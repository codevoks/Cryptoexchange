import { getRedisClients } from "./redis";
import { MessageType } from "@repo/types/message";

export async function redisPublish(
  channel: string,
  messageType: MessageType,
  payload: any
) {
  try {
    const { pubClient } = getRedisClients();
    const message = {
      messageType,
      payload,
    };
    await pubClient?.publish(channel, JSON.stringify(message));
    // console.log(
    //   "Publishing " + JSON.stringify(message) + " to channel-> " + channel
    // );
  } catch (error) {
    console.log("Error publishing to Redis Publisher : " + error);
  }
}

export async function redisSubscribe(
  channel: string,
  handler: (message: string) => void
) {
  try {
    const { subClient } = getRedisClients();
    await subClient?.subscribe(channel, handler);
  } catch (error) {
    console.log("Error subscribing to Redis Subscriber : " + error);
  }
}

export async function redisUnsubscribe(channel: string) {
  try {
    const { subClient } = getRedisClients();
    await subClient?.unsubscribe(channel);
  } catch (error) {
    console.log("Error unsubscribing to Redis Subscriber : " + error);
  }
}
