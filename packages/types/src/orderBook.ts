import { CreateOrderInput } from "./order.js";

export type PriceLevelMap = Map<number, CreateOrderInput[]>;

export interface PriorityQueue<T> {
  insert(item: T, priority: number): void
  peek(): T | null
  pop(): T | null
  size(): number
  isEmpty(): boolean
}