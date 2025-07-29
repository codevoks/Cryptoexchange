import { OrderBook } from "../orderbook/orderbook";
import { orderBookRegistry } from "../orderbook/orderbookRegistry";
import { OrderSide } from "@prisma/client"
import { CreateOrderInput } from "@repo/types/order";
import { DEFAULT_SLIPPAGE_PERCENT } from "./constants";
import { executeOrder } from "./execute";
import { publishOrderBookUpdate } from "../publisher/publisher";
import { setUpdate } from "@repo/redis-utils/snapshot"
import { MessageType } from "@repo/types/message";

export async function match (order:CreateOrderInput){
    const symbol = order.symbol;
    const orderbook = orderBookRegistry.getOrderBook(symbol);
    const targetSide: OrderSide = getTargetSide(order);
    setQuotePrice(order,targetSide,orderbook);
    const ORDERBOOK_CHANNEL = process.env.REDIS_CHANNEL_ORDERBOOK_PREFIX+":"+symbol;
    console.log('ORDERBOOK_CHANNEL is ',ORDERBOOK_CHANNEL);
    while(order.quantity > 0){
        const bestPrice = orderbook.getBestPrice(targetSide);
        if(!bestPrice || (targetSide===OrderSide.BUY ? bestPrice<order.pricePerUnit! : bestPrice>order.pricePerUnit!)) { // either there is no order at all in the list or the best price is not good enough
            orderbook.addOrder(order);
            orderbook.printOrderBook();
            const snapshot = orderbook.getOrderBookSnapshot();
            publishOrderBookUpdate(ORDERBOOK_CHANNEL, snapshot);
            setUpdate(ORDERBOOK_CHANNEL,MessageType.ORDERBOOK,snapshot);
            break;
        }else{
            await executeOrder(order,orderbook,bestPrice,targetSide);
            const snapshot = orderbook.getOrderBookSnapshot();
            publishOrderBookUpdate(ORDERBOOK_CHANNEL, snapshot);
            setUpdate(ORDERBOOK_CHANNEL,MessageType.ORDERBOOK,snapshot);
        }
    }
}


function getTargetSide (order: CreateOrderInput) : OrderSide {
    return order.side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
}

function setQuotePrice(order: CreateOrderInput, targetSide: OrderSide, orderbook: OrderBook):void {
    if (order.type === "MARKET") {
    const bestOppositePrice = orderbook.getBestPrice(targetSide);
    if (!bestOppositePrice) {
        return;
    }
    const slippage = order.slippagePercent ?? DEFAULT_SLIPPAGE_PERCENT;
    order.pricePerUnit = orderbook.getSlippagePrice(order.side, bestOppositePrice, slippage);
    }
}