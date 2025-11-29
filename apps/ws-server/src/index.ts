// import * as dotenv from 'dotenv';
import { resolve } from "path";
import { startMetricsServer } from "./metrics/metrics";
// dotenv.config({ path: resolve(__dirname, '../../../.env') });
export * from "./websocket/webSocket";
startMetricsServer(9102);
