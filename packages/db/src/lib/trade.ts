import { TradePayload } from "@repo/types/trade"
import { Trade } from "@prisma/client"
import { prisma } from "./prisma"

export async function insertTradeInDB(data: TradePayload): Promise<Trade> {
    return prisma.trade.create({
        data:{
            takerOrderId: data.buyerOrderId,
            makerOrderId: data.sellerOrderId,
            price: data.price,
            quantity: data.quantity,
            side: data.side,
            pair: data.symbol,
            buyerId: data.buyerId,
            sellerId: data.sellerId
        }
    })
}
