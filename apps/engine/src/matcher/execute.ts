import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { pushToQueue } from "@repo/redis-utils/queue"
import { CreateOrderInput } from "@repo/types/order";
import { TradePayload } from "@repo/types/trade";
import { OrderSide } from "@prisma/client";
import { OrderBook } from "../orderbook/orderbook";
import { redisPublish } from "@repo/redis-utils/pubsub";
import { MessageType } from "@repo/types/message";

export async function executeOrder (newOrder: CreateOrderInput, orderbook: OrderBook, bestPrice: number, targetSide: OrderSide) : Promise<void> {
    const existingOrder = orderbook.getOrdersAtPrice(bestPrice, targetSide)[0];
    if(!existingOrder){
        return;
    }
    const tradedQuantity = Math.min(existingOrder.quantity,newOrder.quantity);
    const trade: TradePayload = {
        buyerOrderId: targetSide === OrderSide.BUY ? existingOrder.id : newOrder.id,
        sellerOrderId: targetSide === OrderSide.BUY ? newOrder.id : existingOrder.id,
        price: bestPrice,
        quantity: tradedQuantity,
        symbol: newOrder.symbol,
        buyerId: targetSide === OrderSide.BUY ? existingOrder.userId : newOrder.userId,
        sellerId: targetSide === OrderSide.BUY ? newOrder.userId : existingOrder.userId,
    }
    orderbook.reduceOrderQuantity(existingOrder,tradedQuantity);
    newOrder.quantity-=tradedQuantity;
    await pushToQueue(QUEUE_NAMES.TRADES,trade);
    const symbol = newOrder.symbol;
    const TRADE_CHANNEL = process.env.REDIS_CHANNEL_TRADE_PREFIX+":"+symbol;
    redisPublish(TRADE_CHANNEL, MessageType.TRADE,trade);
    orderbook.printOrderBook();
}
