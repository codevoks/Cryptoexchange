import { consumeFromQueue } from "@repo/redis-utils/queue"

export async function startQueue(queueName: string, handler: (data:any)=>Promise<void>) {
    try {
        console.log(" inside startQueue queueName = "+queueName);
        await consumeFromQueue(queueName, handler);
        console.log(" after await in startQueue queueName = "+queueName);
    } catch (error) {
        console.log(" Error while fetching order from unmatched orders queue ",error);
    }
}