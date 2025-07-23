import { createClient } from 'redis';

const URL_REDIS_CONN = process.env.URL_REDIS_CONN || 'redis://localhost:6379';

export const queueClient = createClient({ url: URL_REDIS_CONN });
export const pubClient = createClient({ url: URL_REDIS_CONN });
export const subClient = createClient({ url: URL_REDIS_CONN });

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