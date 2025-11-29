// packages/metrics-utils/index.ts
import client from "prom-client";

export const register = new client.Registry();

// Default metrics like CPU, memory
client.collectDefaultMetrics({ register });

// Queue metrics
export const queuePushCounter = new client.Counter({
  name: "queue_push_total",
  help: "Total number of messages pushed to Redis queue",
  labelNames: ["queueName"],
});

export const queueConsumeCounter = new client.Counter({
  name: "queue_consume_total",
  help: "Total number of messages consumed from Redis queue",
  labelNames: ["queueName"],
});

// Register all metrics
register.registerMetric(queuePushCounter);
register.registerMetric(queueConsumeCounter);
