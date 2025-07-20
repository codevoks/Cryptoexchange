export interface TradePayload {
  buyerOrderId: string;
  sellerOrderId: string;
  price: number;
  quantity: number;
  pair: string;
  buyerId: string;
  sellerId: string;
}