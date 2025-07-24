'use client';

import { useEffect, useState } from "react";

type Order = {
  price: number;
  quantity: number;
};

type Trade = {
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
};

export default function OrderBook() {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const ws = new WebSocket("${WS_URL}?symbols=BTC/USDT"); // Replace with your actual URL

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "orderbook_update") {
        // Sort highest bid first, lowest ask first
        setBids([...data.bids].sort((a, b) => b.price - a.price));
        setAsks([...data.asks].sort((a, b) => a.price - b.price));
      }

      if (data.type === "trade_update") {
        setTrades((prev) => [
          {
            ...data.trade,
          },
          ...prev.slice(0, 19), // Keep latest 20 trades
        ]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-[20%] h-[500px] bg-[#1E1E1E] border border-gray-700 rounded-xl text-white p-4 flex flex-col">
      
      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('orderbook')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'orderbook'
              ? 'bg-[#262626] text-white'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
        >
          Order Book
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`px-4 py-2 rounded-t-md font-semibold ${
            activeTab === 'trades'
              ? 'bg-[#262626] text-white'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
        >
          Trades
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto text-sm font-mono space-y-1">
        {activeTab === 'orderbook' ? (
          <>
            {asks.map((ask, idx) => (
              <div key={`ask-${idx}`} className="text-red-400 flex justify-between">
                <span>Sell</span>
                <span>{ask.quantity} @ ${ask.price}</span>
              </div>
            ))}
            {bids.map((bid, idx) => (
              <div key={`bid-${idx}`} className="text-green-400 flex justify-between">
                <span>Buy</span>
                <span>{bid.quantity} @ ${bid.price}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            {trades.map((trade, idx) => (
              <div key={`trade-${idx}`} className="text-gray-300 flex justify-between">
                <span>{new Date(trade.timestamp * 1000).toLocaleTimeString()}</span>
                <span>
                  {trade.side === 'buy' ? 'Buy' : 'Sell'} {trade.quantity} @ ${trade.price}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}