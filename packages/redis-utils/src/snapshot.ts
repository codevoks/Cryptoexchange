import { snapShotClient } from "./redis";
import { MessageType } from "@repo/types/message";

export async function setUpdate(channel: string,messageType:MessageType, payload: any) {
    try {
        console.log("setting snapshot on channel "+channel+" with MessageType "+messageType+" paylaod = "+payload);
        await snapShotClient.set(channel, JSON.stringify({messageType,payload}));
    } catch (error) {
        console.log("Error updating snapshot of type "+messageType+" on channel "+channel);
    }
}

export async function getUpdate(channel: string) {
    try {
        console.log(" getting payload from channel -> "+channel);
        const raw = await snapShotClient.get(channel);
        if(!raw){
            return null;
        }
        return JSON.parse(raw);
    } catch (error) {
        console.log("Error getting snapshot of type on channel "+channel);
    }
}