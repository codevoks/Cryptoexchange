import { startQueue } from "./queue-service";
import { handleTradeInsert } from "../trade-service.ts/trade.service";

export async function initDBQueue(queueName: string) {
    try {
        startQueue(queueName,handleTradeInsert);
    } catch (error) {
        console.log(" Error while fetching trade from db queue ",error);
    }
}