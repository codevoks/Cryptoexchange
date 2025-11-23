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

  getOrderBook(symbol: string): OrderBook {
    if (!this.books.has(symbol)) {
      this.books.set(symbol, new OrderBook());
    }
    return this.books.get(symbol)!;
  }

  getAllOrderBooks(): Map<string, OrderBook> {
    return this.books;
  }

  removeOrderBook(symbol: string): void {
    this.books.delete(symbol);
  }
}

export const orderBookRegistry = OrderBookRegistry.getInstance();
