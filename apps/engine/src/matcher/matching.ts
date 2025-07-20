import { OrderBook } from "../orderbook/orderbook";
import { orderBookRegistry } from "../orderbook/orderbookRegistry";
import { OrderSide } from "@prisma/client"
import { CreateOrderInput } from "@repo/types/order";
import { DEFAULT_SLIPPAGE_PERCENT } from "./constants";
import { executeOrder } from "./execute";
import { publishOrderBookUpdate } from "../publisher/publisher";

export async function match (order:CreateOrderInput){
    const pair = order.pair;
    const orderbook = orderBookRegistry.getOrderBook(pair);
    const targetSide: OrderSide = getTargetSide(order);
    setQuotePrice(order,targetSide,orderbook);
    while(order.quantity > 0){
        const bestPrice = orderbook.getBestPrice(targetSide);
        if(!bestPrice || (targetSide==="BUY" ? bestPrice<order.pricePerUnit! : bestPrice>order.pricePerUnit!)) { // either there is no order at all in the list or the best price is not good enough
            orderbook.addOrder(order);
            publishOrderBookUpdate(`orderbook_updates:${pair}`, orderbook);
            return;
        }
        executeOrder(order,orderbook,bestPrice,targetSide);
        publishOrderBookUpdate(`orderbook_updates:${pair}`, orderbook); 
    }
}


function getTargetSide (order: CreateOrderInput) : OrderSide {
    return order.side === "BUY" ? "SELL" : "BUY";
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