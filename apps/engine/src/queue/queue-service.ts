import { consumeFromQueue } from "@repo/redis-utils/queue"

export async function startQueue(queueName: string, handler: (data:any)=>Promise<void>) {
    try {
        await consumeFromQueue(queueName, handler);
    } catch (error) {
        console.log(" Error while fetching order from unmatched orders queue ",error);
    }
}