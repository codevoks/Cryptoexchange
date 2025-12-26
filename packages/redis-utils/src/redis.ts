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

let connecting = false;
let connected = false;

async function ensureConnected() {
  if (connected || connecting) return;
  
  if (!process.env.REDIS_URL) {
    // Skip connection if REDIS_URL not set (e.g., during build time)
    return;
  }

  connecting = true;
  try {
    const clients = getRedisClients();
    await Promise.all([
      clients.queueInsertClient?.connect(),
      clients.queueConsumeClient?.connect(),
      clients.pubClient?.connect(),
      clients.subClient?.connect(),
      clients.snapShotClient?.connect(),
    ]);
    connected = true;
  } catch (error) {
    console.log("Error connecting to redis: ", error);
  } finally {
    connecting = false;
  }
}

export function getRedisClients() {
  // If REDIS_URL not set, return empty clients object (e.g., during build time)
  if (!process.env.REDIS_URL) {
    return {
      queueClient: undefined,
      queueInsertClient: undefined,
      queueConsumeClient: undefined,
      pubClient: undefined,
      subClient: undefined,
      snapShotClient: undefined,
    };
  }
  
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

// Export connection function - call this when Redis is actually needed
export async function connectRedisClients() {
  await ensureConnected();
}
