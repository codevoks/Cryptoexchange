import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set in the environment.");
}

export const queueClient = createClient({ url: REDIS_URL });
export const queueInsertClient = createClient({ url: REDIS_URL });
export const queueConsumeClient = createClient({ url: REDIS_URL });
export const pubClient = createClient({ url: REDIS_URL });
export const subClient = createClient({ url: REDIS_URL });
export const snapShotClient = createClient({ url: REDIS_URL });

pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
queueInsertClient.on("error", (err) =>
  console.error("Redis Queue Error:", err)
);
queueConsumeClient.on("error", (err) =>
  console.error("Redis Queue Error:", err)
);
subClient.on("error", (err) => console.error("Redis Sub Error:", err));
snapShotClient.on("error", (err) => console.error("Redis Sub Error:", err));

async function connectRedisClient() {
  try {
    await Promise.all([
      queueInsertClient.connect(),
      queueConsumeClient.connect(),
      pubClient.connect(),
      subClient.connect(),
      snapShotClient.connect(),
    ]);
  } catch (error) {
    console.log("Error connecting to redis: ", error);
  }
}

connectRedisClient();
