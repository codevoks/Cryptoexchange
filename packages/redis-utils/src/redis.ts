import { createClient } from 'redis';

export const queueClient = createClient();
export const pubClient = createClient();
export const subClient = createClient();

pubClient.on('error', (err) => console.error('Redis Pub Error:', err));
queueClient.on('error', (err) => console.error('Redis Queue Error:', err));
subClient.on('error', (err) => console.error('Redis Sub Error:', err));

async function connectRedisClient(){
    try {
        await Promise.all([
            queueClient.connect(),
            pubClient.connect(),
            subClient.connect()
        ]);
    } catch (error) {
        console.log('Error connecting to redis: ',error);
    }
}

connectRedisClient();