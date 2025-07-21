import { startQueue } from "./queue-service";
import { match } from "../matcher/matching";

export async function initOrdersQueue(queueName: string) {
    try {
        startQueue(queueName,match)
    } catch (error) {
        console.log(" Error while fetching order from unmatched orders queue ",error);
    }
}