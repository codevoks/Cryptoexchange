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
                const data = JSON.parse(result.element);
                console.log("🔥 Got order from queue "+queueName+" data -> "+data);
                await handler(data);
            }
        }
    } catch (error) {
        console.log('Error consuming from redis queue '+queueName+' : ',error);
    }
}