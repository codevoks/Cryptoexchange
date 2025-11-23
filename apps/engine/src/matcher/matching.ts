import { OrderBook } from "../orderbook/orderbook";
import { orderBookRegistry } from "../orderbook/orderbookRegistry";
import { OrderSide } from "@prisma/client";
import { CreateOrderInput } from "@repo/types/order";
import { DEFAULT_SLIPPAGE_PERCENT } from "./constants";
import { executeOrder } from "./execute";
import { publishBookUpdate } from "../publisher/publisher";
import { setUpdate } from "@repo/redis-utils/snapshot";
import { MessageType } from "@repo/types/message";
import { tradeBookRegistry } from "../tradebook/tradebookRegistry";

export async function match(order: CreateOrderInput) {
  const symbol = order.symbol;
  const orderbook = orderBookRegistry.getOrderBook(symbol);
  const tradeBook = tradeBookRegistry.getTradeBook(symbol);
  const targetSide: OrderSide = getTargetSide(order);
  setQuotePrice(order, targetSide, orderbook);
  const ORDERBOOK_CHANNEL =
    process.env.REDIS_CHANNEL_ORDERBOOK_PREFIX + ":" + symbol;
  const TRADEBOOK_CHANNEL =
    process.env.REDIS_CHANNEL_TRADE_PREFIX + ":" + symbol;
  while (order.quantity > 0) {
    const bestPrice = orderbook.getBestPrice(targetSide);
    if (
      !bestPrice ||
      (targetSide === OrderSide.BUY
        ? bestPrice < order.pricePerUnit!
        : bestPrice > order.pricePerUnit!)
    ) {
      // either there is no order at all in the list or the best price is not good enough
      orderbook.addOrder(order);
      orderbook.printOrderBook();
      const orderbookSnapshot = orderbook.getOrderBookSnapshot();
      publishBookUpdate(
        ORDERBOOK_CHANNEL,
        MessageType.ORDERBOOK,
        orderbookSnapshot
      ); //broadcasting orderbook
      setUpdate(ORDERBOOK_CHANNEL, MessageType.ORDERBOOK, orderbookSnapshot); //setting the updated orderbook for client
      break;
    } else {
      await executeOrder(order, orderbook, tradeBook, bestPrice, targetSide);
      const orderbookSnapshot = orderbook.getOrderBookSnapshot();
      const tradebookSnapshot = tradeBook.getTradeBookSnapshot();
      publishBookUpdate(
        ORDERBOOK_CHANNEL,
        MessageType.ORDERBOOK,
        orderbookSnapshot
      );
      publishBookUpdate(
        TRADEBOOK_CHANNEL,
        MessageType.TRADE,
        tradebookSnapshot
      ); //broadcasting tradebook
      setUpdate(ORDERBOOK_CHANNEL, MessageType.ORDERBOOK, orderbookSnapshot);
      setUpdate(TRADEBOOK_CHANNEL, MessageType.TRADE, tradebookSnapshot); //setting the updated tradebook for client
    }
  }
}

function getTargetSide(order: CreateOrderInput): OrderSide {
  return order.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
}

function setQuotePrice(
  order: CreateOrderInput,
  targetSide: OrderSide,
  orderbook: OrderBook
): void {
  if (order.type === "MARKET") {
    const bestOppositePrice = orderbook.getBestPrice(targetSide);
    if (!bestOppositePrice) {
      return;
    }
    const slippage = order.slippagePercent ?? DEFAULT_SLIPPAGE_PERCENT;
    order.pricePerUnit = orderbook.getSlippagePrice(
      order.side,
      bestOppositePrice,
      slippage
    );
  }
}
