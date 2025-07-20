import { queueClient } from "./redis.js"

export async function pushToQueue(queueName:string, payload:any){
    try{
        await queueClient.lPush(queueName,JSON.stringify(payload));
    }
    catch(error){
        console.log('Error pushing in redis queue '+queueName+' : ',error);
    }
}

export async function consumeFromQueue(queueName:string, handler: (data:any) => Promise<void>){
    try {
        while(true){
            const result = await queueClient.brPop(queueName,0);
            if(result?.element){
                const raw = typeof result.element === "string"
                    ? result.element
                    : result.element.toString("utf-8"); // 🔥 Convert Buffer to string safely
                const data = JSON.parse(raw);
                console.log("🔥 Got order from queue "+queueName+" data -> "+data);
                await handler(data);
            }
        }
    } catch (error) {
        console.log('Error consuming from redis queue '+queueName+' : ',error);
    }
}