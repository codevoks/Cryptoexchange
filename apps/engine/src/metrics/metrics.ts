import express from "express";
import { register } from "@repo/metrics-utils";

const app = express();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export function startMetricsServer(port = 9101) {
  app.listen(port, () => console.log(`Engine metrics running on ${port}`));
}
