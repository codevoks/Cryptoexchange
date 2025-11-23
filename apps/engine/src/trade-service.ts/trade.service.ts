import { prisma } from "@repo/db/lib/prisma";
import { TradePayload } from "@repo/types/trade";
import { Trade } from "@prisma/client";
import { insertTradeInDB } from "@repo/db/index";

export async function handleTradeInsert(data: TradePayload) {
  try {
    await insertTradeInDB(data);
  } catch (error) {
    console.log("Error inserting Trade " + error);
  }
}
export async function getTradesByUser(userId: string): Promise<Trade[]> {
  return prisma.trade.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { timestamp: "desc" },
  });
}
