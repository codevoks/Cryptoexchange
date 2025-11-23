import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { pushToQueue } from "@repo/redis-utils/queue";
import { CreateOrderInput } from "@repo/types/order";
import { TradePayload } from "@repo/types/trade";
import { OrderSide } from "@prisma/client";
import { OrderBook } from "../orderbook/orderbook";
import { TradeBook } from "../tradebook/tradebook";
import { redisPublish } from "@repo/redis-utils/pubsub";
import { MessageType } from "@repo/types/message";
import { TradeSide } from "@prisma/client";

export async function executeOrder(
  newOrder: CreateOrderInput,
  orderbook: OrderBook,
  tradeBook: TradeBook,
  bestPrice: number,
  targetSide: OrderSide
): Promise<void> {
  const existingOrder = orderbook.getOrdersAtPrice(bestPrice, targetSide)[0];
  if (!existingOrder) {
    return;
  }
  const tradedQuantity = Math.min(existingOrder.quantity, newOrder.quantity);
  const trade: TradePayload = {
    buyerOrderId: targetSide === OrderSide.BUY ? existingOrder.id : newOrder.id,
    sellerOrderId:
      targetSide === OrderSide.BUY ? newOrder.id : existingOrder.id,
    price: bestPrice,
    side: newOrder.side === OrderSide.BUY ? TradeSide.BUY : TradeSide.SELL,
    quantity: tradedQuantity,
    symbol: newOrder.symbol,
    buyerId:
      targetSide === OrderSide.BUY ? existingOrder.userId : newOrder.userId,
    sellerId:
      targetSide === OrderSide.BUY ? newOrder.userId : existingOrder.userId,
  };
  orderbook.reduceOrderQuantity(existingOrder, tradedQuantity);
  newOrder.quantity -= tradedQuantity;
  tradeBook.addTrade(trade);
  await pushToQueue(QUEUE_NAMES.TRADES, trade);
}
