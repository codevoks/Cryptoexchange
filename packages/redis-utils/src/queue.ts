import { queueInsertClient, queueConsumeClient } from "./redis";

export async function pushToQueue(queueName: string, payload: any) {
  try {
    await queueInsertClient.lPush(queueName, JSON.stringify(payload));
  } catch (error) {
    console.log("Error pushing in redis queue " + queueName + " : ", error);
  }
}

export async function consumeFromQueue(
  queueName: string,
  handler: (data: any) => Promise<void>
) {
  try {
    while (true) {
      try {
        const result = await queueConsumeClient.brPop(queueName, 5);
        if (result?.element) {
          const data = JSON.parse(result.element);
          await handler(data);
        }
      } catch (error) {
        console.log("ERROR IN result " + error);
      }
    }
  } catch (error) {
    console.log("Error consuming from redis queue " + queueName + " : ", error);
  }
}
