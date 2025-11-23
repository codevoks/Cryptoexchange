import { TradeEntry, TradePayload, TradesList } from "@repo/types/trade";

export class TradeBook {
  private tradeBook: TradeEntry[] = [];

  getTradeBook(): TradeEntry[] {
    return this.tradeBook;
  }

  addTrade(trade: TradePayload) {
    this.tradeBook.push({
      price: trade.price,
      quantity: trade.quantity,
      side: trade.side,
    });
  }

  printTradeBook() {
    console.log("======== TRADE BOOK ========");
    this.tradeBook.forEach((trade) => {
      console.log(
        `Price: ${trade.price} | Trade Qty: ${trade.quantity} | Total Side: ${trade.side}`
      );
    });
    console.log("============================\n");
  }

  getTradeBookSnapshot(): TradesList {
    let tradeBookSnapShot: TradesList = {
      trade: [],
    };
    tradeBookSnapShot = {
      trade: this.tradeBook.map((trade) => ({
        price: trade.price,
        quantity: trade.quantity,
        side: trade.side,
      })),
    };
    return tradeBookSnapShot;
  }
}
