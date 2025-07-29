import { TradeSide } from "@prisma/client";

export interface TradePayload {
  buyerOrderId: string;
  sellerOrderId: string;
  price: number;
  side: TradeSide,
  quantity: number;
  symbol: string;
  buyerId: string;
  sellerId: string;
}