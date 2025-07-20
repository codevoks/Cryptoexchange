import { pubClient, subClient } from "./redis.js"

export async function redisPublish(channel: string, message: any){
    try {
        await pubClient.publish(channel, JSON.stringify(message));
    } catch (error) {
        console.log("Error publishing to Redis Publisher : " + error);
    }
}

export async function redisSubscribe(channel: string, message: any) {
    try {
        await subClient.subscribe(channel, (message:string) => {
        console.log("Catching an Event using Redis to: " + message);
        });
    } catch (error) {
        console.log("Error subscribing to Redis Subscriber : " + error);
    }
}

export async function redisUnsubscribe(channel: string) {
    try {
        await subClient.unsubscribe(channel);
    } catch (error) {
        console.log("Error unsubscribing to Redis Subscriber : " + error);
    }
}