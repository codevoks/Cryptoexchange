import { getRedisClients, connectRedisClients } from "./redis";
import { MessageType } from "@repo/types/message";

export async function setUpdate(
  channel: string,
  messageType: MessageType,
  payload: any
) {
  try {
    await connectRedisClients();
    const { snapShotClient } = getRedisClients();
    if (!snapShotClient) return; // Skip during build time
    await snapShotClient.set(channel, JSON.stringify({ messageType, payload }));
  } catch (error) {
    console.log(
      "Error updating SNAPSHOT of type " +
        messageType +
        " on channel " +
        channel
    );
  }
}

export async function getUpdate(channel: string) {
  try {
    await connectRedisClients();
    const { snapShotClient } = getRedisClients();
    if (!snapShotClient) return null; // Skip during build time
    const raw = await snapShotClient.get(channel);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.log("Error getting SNAPSHOT of type on channel " + channel);
  }
}
