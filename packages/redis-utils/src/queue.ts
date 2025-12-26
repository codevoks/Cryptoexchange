import { getRedisClients } from "./redis";
import { queuePushCounter, queueConsumeCounter } from "@repo/metrics-utils";

export async function pushToQueue(queueName: string, payload: any) {
  try {
    const { queueInsertClient } = getRedisClients();
    await queueInsertClient?.lPush(queueName, JSON.stringify(payload));
    queuePushCounter.labels(queueName).inc();
  } catch (error) {
    console.log("Error pushing in redis queue " + queueName + " : ", error);
  }
}

export async function consumeFromQueue(
  queueName: string,
  handler: (data: any) => Promise<void>
) {
  try {
    const { queueConsumeClient } = getRedisClients();
    while (true) {
      try {
        const result = await queueConsumeClient?.brPop(queueName, 5);
        if (result?.element) {
          const data = JSON.parse(result.element);
          await handler(data);
          queueConsumeCounter.labels(queueName).inc();
        }
      } catch (error) {
        console.log("ERROR IN result " + error);
      }
    }
  } catch (error) {
    console.log("Error consuming from redis queue " + queueName + " : ", error);
  }
}
