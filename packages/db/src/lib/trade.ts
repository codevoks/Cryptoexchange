import { TradePayload } from "@repo/types/trade";
import { Trade } from "@prisma/client";
import { prisma } from "./prisma";

export async function insertTradeInDB(data: TradePayload): Promise<Trade> {
  try {
  } catch (error) {
    console.log("ERROR ", error);
  }
  return prisma.trade.create({
    data: {
      buyerOrderId: data.buyerOrderId,
      sellerOrderId: data.sellerOrderId,
      price: data.price,
      quantity: data.quantity,
      side: data.side,
      symbol: data.symbol,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
    },
  });
}
