export interface TradePayload {
  buyerOrderId: string;
  sellerOrderId: string;
  price: number;
  quantity: number;
  symbol: string;
  buyerId: string;
  sellerId: string;
}