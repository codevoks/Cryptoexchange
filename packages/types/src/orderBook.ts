import { CreateOrderInput } from "./order.js";

export type PriceLevelMap = Map<number, CreateOrderInput[]>;

export type OrderBookLevel = {
  price: number;
  quantity: number; // total quantity at this price
  cumulativeQuantity: number;
};

export type OrderBookSnapshot = {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
};

export interface PriorityQueue<T> {
  insert(item: T, priority: number): void;
  peek(): T | null;
  pop(): T | null;
  size(): number;
  isEmpty(): boolean;
}
