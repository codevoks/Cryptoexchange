import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { pushToQueue } from "@repo/redis-utils/queue"
import { CreateOrderInput } from "@repo/types/order";
import { TradePayload } from "@repo/types/trade";
import { OrderSide } from "@prisma/client";
import { OrderBook } from "../orderbook/orderbook";

export async function executeOrder (newOrder: CreateOrderInput, orderbook: OrderBook, bestPrice: number, targetSide: OrderSide) : Promise<void> {
    const existingOrder = orderbook.getOrdersAtPrice(bestPrice, targetSide)[0];
    console.log(" inside execute existingOrder ",executeOrder);
    if(!existingOrder){
        return;
    }
    const tradedQuantity = Math.min(existingOrder.quantity,newOrder.quantity);
    const trade: TradePayload = {
        buyerOrderId: targetSide === "BUY" ? existingOrder.id : newOrder.id,
        sellerOrderId: targetSide === "BUY" ? newOrder.id : existingOrder.id,
        price: bestPrice,
        quantity: tradedQuantity,
        pair: newOrder.pair,
        buyerId: targetSide === "BUY" ? existingOrder.userId : newOrder.userId,
        sellerId: targetSide === "BUY" ? newOrder.userId : existingOrder.userId,
    }
    orderbook.reduceOrderQuantity(existingOrder,tradedQuantity);
    newOrder.quantity-=tradedQuantity;
    await pushToQueue(QUEUE_NAMES.TRADES,trade);
    console.log(" execute before printOrderBook ");
    orderbook.printOrderBook();
    console.log(" execute after printOrderBook ");
}
