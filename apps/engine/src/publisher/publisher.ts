// redis pubsub function import kiya
import { redisPublish } from "@repo/redis-utils/pubsub"; 
import { MessageType } from "@repo/types/message";
import { OrderBookSnapshot } from "@repo/types/orderBook"

// 🧠 MAIN FUNCTION
export function publishOrderBookUpdate(ORDERBOOK_CHANNEL: string, snapShot: OrderBookSnapshot) {
  console.log('INSIDE publishOrderBookUpdate DEBUG ',ORDERBOOK_CHANNEL);
  console.log("ORDERBOOK IS ",snapShot);
  redisPublish(ORDERBOOK_CHANNEL, MessageType.ORDERBOOK, snapShot);
}