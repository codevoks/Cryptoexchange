import { initMatcherQueue } from "./queue/queue-matcher";
import { initDBQueue } from "./queue/queue-db";

async function init() {
    await Promise.all([initMatcherQueue('matcher_queue'),initDBQueue('DB_queue')]);
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