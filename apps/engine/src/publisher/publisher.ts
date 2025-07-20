// redis pubsub function import kiya
import { redisPublish } from "@repo/redis-utils/pubsub"; 
import { OrderBook } from "../orderbook/orderbook";
import { OrderSide } from "@prisma/client";

// 🧠 MAIN FUNCTION
export function publishOrderBookUpdate(pair: string, orderbook: OrderBook) {
  const sortedOrderBook = {
    bids: flattenSorted(orderbook, "BUY"),   // 👈 BUY side (sorted DESC)
    asks: flattenSorted(orderbook, "SELL")   // 👈 SELL side (sorted ASC)
  };

  // Redis channel: "orderbook:BTCUSDT" jaise naam se
  redisPublish(`orderbook:${pair}`, sortedOrderBook);
}

function flattenSorted(orderbook: OrderBook, side: OrderSide) {
  const prices = side === "BUY" ? orderbook.getBidPrices() : orderbook.getAskPrices();
  const levels = side === "BUY" ? orderbook.getBidLevels() : orderbook.getAskLevels();

  const result = [];

  for (let price of prices) {
    const orders = levels.get(price) || [];
    let totalQuantity = 0;

    for (let order of orders) {
      totalQuantity += order.quantity;
    }

    result.push({ price, quantity: totalQuantity });
  }

  return result;
}