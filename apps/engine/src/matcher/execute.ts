import { pushToQueue } from "@repo/redis-utils/queue"
import { CreateOrderInput } from "@repo/types/order";
import { TradePayload } from "@repo/types/trade";
import { OrderSide } from "@prisma/client";
import { OrderBook } from "../orderbook/orderbook";

export function executeOrder (newOrder: CreateOrderInput, orderbook: OrderBook, bestPrice: number, targetSide: OrderSide) : void {
    const existingOrder = orderbook.getOrdersAtPrice(bestPrice, targetSide)[0];
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
    pushToQueue('DB_queue',trade);
}
