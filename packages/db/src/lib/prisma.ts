import { PrismaClient } from "@prisma/client";
import path from "path";
import dotenv from "dotenv";

// dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
