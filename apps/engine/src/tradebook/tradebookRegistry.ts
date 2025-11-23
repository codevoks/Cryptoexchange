import { TradeBook } from "./tradebook";

class TradeBookRegistry {
  private static instance: TradeBookRegistry;
  private books: Map<string, TradeBook> = new Map();

  private constructor() {}

  static getInstance(): TradeBookRegistry {
    if (!TradeBookRegistry.instance) {
      TradeBookRegistry.instance = new TradeBookRegistry();
    }
    return TradeBookRegistry.instance;
  }

  public getTradeBook(symbol: string): TradeBook {
    if (!this.books.has(symbol)) {
      this.books.set(symbol, new TradeBook());
    }
    return this.books.get(symbol)!;
  }

  public getAllTradeBooks(): Map<string, TradeBook> {
    return this.books;
  }

  public deleteTradeBook(symbol: string) {
    this.books.delete(symbol);
  }
}

export const tradeBookRegistry = TradeBookRegistry.getInstance();
