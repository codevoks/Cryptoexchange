import { OrderType, OrderSide, OrderStatus } from "@prisma/client";

export interface CreateOrderInput {
  id: string;
  userId: string;
  type: OrderType;
  side: OrderSide;
  pair: string;
  pricePerUnit: number;
  quantity: number;
  slippagePercent?: number;
}

export interface MatchOrderInput {
  id: string;
  userId: string;
  type: OrderType;
  side: OrderSide;
  pricePerUnit: number;
  quantity: number;
  slippagePercent?: number;
}

export interface OrderWithStatus extends CreateOrderInput {
  filled: string;
  status: OrderStatus;
  createdAt: Date;
}