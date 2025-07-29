import { queueClient } from "./redis"

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
        // console.log("consumeFromQueue queueName "+queueName);
        while(true){
            // console.log("BEFORE result");
            try {
                // console.log("Queue length:", await queueClient.lLen(queueName));
                // console.log("Queue contents:", await queueClient.lRange(queueName, 0, -1));
                //const result = await queueClient.brPop(queueName,0);
                const result = await queueClient.brPop(queueName, 5);  
                // console.log(" RESULT ",result);
                // console.log("AFTER result");
                if(result?.element){
                    const data = JSON.parse(result.element);
                    // console.log("🔥 Got order from queue "+queueName+" data -> ",data);
                    await handler(data);
                }
            } catch (error) {
                console.log('ERROR IN result '+error);
            }
        }
    } catch (error) {
        console.log('Error consuming from redis queue '+queueName+' : ',error);
    }
}