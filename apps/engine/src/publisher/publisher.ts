// redis pubsub function import kiya
import { redisPublish } from "@repo/redis-utils/pubsub";
import { TradeBookSnapshot } from "@repo/types/trade";
import { MessageType } from "@repo/types/message";
import { OrderBookSnapshot } from "@repo/types/orderBook";

// 🧠 MAIN FUNCTION
export function publishBookUpdate(
  ORDERBOOK_CHANNEL: string,
  messageType: MessageType,
  snapShot: OrderBookSnapshot | TradeBookSnapshot
) {
  redisPublish(ORDERBOOK_CHANNEL, messageType, snapShot);
}
