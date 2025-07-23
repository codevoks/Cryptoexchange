import { prisma } from '@repo/db/lib/prisma';
import { TradePayload } from '@repo/types/trade';
import { Trade } from "@prisma/client";
import { insertTradeInDB } from "@repo/db/trade"

export async function handleTradeInsert(data: TradePayload) {
    await insertTradeInDB(data);
}
export async function insertTradeInDB(data: TradePayload): Promise<Trade> {
    return prisma.trade.create({
        data:{
            takerOrderId: data.buyerOrderId,
            makerOrderId: data.sellerOrderId,
            price: data.price,
            quantity: data.quantity,
            pair: data.pair,
            buyerId: data.buyerId,
            sellerId: data.sellerId
        }
    })
}

export async function getTradesByUser(userId: string): Promise<Trade[]> {
  return prisma.trade.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { timestamp: 'desc' },
  });
}