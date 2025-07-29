// redis pubsub function import kiya
import { redisPublish } from "@repo/redis-utils/pubsub"; 
import { OrderBook } from "../orderbook/orderbook";
import { OrderSide } from "@prisma/client";
import { MessageType } from "@repo/types/message";
import { OrderBookSnapshot } from "@repo/types/orderBook"

// 🧠 MAIN FUNCTION
export function publishOrderBookUpdate(ORDERBOOK_CHANNEL: string, snapShot: OrderBookSnapshot) {
  console.log('INSIDE publishOrderBookUpdate DEBUG ',ORDERBOOK_CHANNEL);
  console.log("ORDERBOOK IS ",snapShot);
  // const sortedOrderBook = {
  //   bids: flattenSorted(snapShot, OrderSide.BUY),   // 👈 BUY side (sorted DESC)
  //   asks: flattenSorted(snapShot, OrderSide.SELL)   // 👈 SELL side (sorted ASC)
  // };
  redisPublish(ORDERBOOK_CHANNEL, MessageType.ORDERBOOK, snapShot);
}

function flattenSorted(orderbook: OrderBook, side: OrderSide) {
  const prices = side === OrderSide.BUY ? orderbook.getBidPrices() : orderbook.getAskPrices();
  const levels = side === OrderSide.BUY ? orderbook.getBidLevels() : orderbook.getAskLevels();

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