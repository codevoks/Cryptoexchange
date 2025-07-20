import { OrderBook } from "./orderbook";

class OrderBookRegistry {
  private static instance: OrderBookRegistry;
  private books: Map<string, OrderBook> = new Map();

  private constructor() {}

  static getInstance(): OrderBookRegistry {
    if (!OrderBookRegistry.instance) {
      OrderBookRegistry.instance = new OrderBookRegistry();
    }
    return OrderBookRegistry.instance;
  }

  getOrderBook(pair: string): OrderBook {
    if (!this.books.has(pair)) {
      this.books.set(pair, new OrderBook());
    }
    return this.books.get(pair)!;
  }

  getAllBooks(): Map<string, OrderBook> {
    return this.books;
  }

  removeOrderBook(pair: string): void {
    this.books.delete(pair);
  }
}

export const orderBookRegistry = OrderBookRegistry.getInstance();