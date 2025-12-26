import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { createClient, RedisClientType } from "redis";

let clients: {
  queueClient?: RedisClientType;
  queueInsertClient?: RedisClientType;
  queueConsumeClient?: RedisClientType;
  pubClient?: RedisClientType;
  subClient?: RedisClientType;
  snapShotClient?: RedisClientType;
} | null = null;

export function getRedisClients() {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL not set");
  
  if (!clients) {
    const url = process.env.REDIS_URL;

    clients = {
      queueClient: createClient({ url }),
      queueInsertClient: createClient({ url }),
      queueConsumeClient: createClient({ url }),
      pubClient: createClient({ url }),
      subClient: createClient({ url }),
      snapShotClient: createClient({ url }),
    };

    Object.values(clients).forEach((c) =>
      c?.on("error", (err) => console.error("Redis error:", err))
    );
  }

  return clients;
}

async function connectRedisClient() {
  try {
    const clients = getRedisClients();
    await Promise.all([
      clients.queueInsertClient?.connect(),
      clients.queueConsumeClient?.connect(),
      clients.pubClient?.connect(),
      clients.subClient?.connect(),
      clients.snapShotClient?.connect(),
    ]);
  } catch (error) {
    console.log("Error connecting to redis: ", error);
  }
}

connectRedisClient();
