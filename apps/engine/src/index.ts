import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../../../.env') });

import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { initOrdersQueue } from "./queue/queue-matcher";
import { initTradesQueue } from "./queue/queue-db";

async function init() {
    console.clear();
    console.log("🚀 Starting Matching Engine...");
    console.log("Before promise");
    await Promise.all([initOrdersQueue(QUEUE_NAMES.ORDERS),initTradesQueue(QUEUE_NAMES.TRADES)]);
    console.log("After promise");
}

init();


//keep on checking if there is any order in queue 1

//fetch the order

//matching logic

/*if matched
    update order book
    put the transaction in queue2
    broadcast the match using pub
*/