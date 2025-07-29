'use client';
import {MessageType} from "@repo/types/message"
console.log("🧪 OrderBook component is loading...");
import { useEffect, useState } from "react";
console.log('ENV VARIABLE WS_URL '+process.env.NEXT_PUBLIC_WS_URL);
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

type Order = {
  price: number;
  quantity: number;
  cumulativeQuantity: number;
};

type Trade = {
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
};

export default function OrderBook({symbol}:{symbol: string}) {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
  const fetchSnapshot = async () => {
    console.log("INSIDE FETCH");
    try {
      const res = await fetch(`/api/v1/orderbook?symbol=${symbol}`);
      const result = await res.json();
      const { orderbook, trades } = await result;
      console.log("RES is ",result);
      console.log("FETCH orderbook is ",orderbook);
      console.log("FETCH trades is ",trades);

      if (!orderbook?.payload) {
        console.warn("⚠️ Orderbook payload missing!", orderbook);
      }
      if (!trades?.payload?.trades) {
        console.warn("⚠️ Trades payload malformed!", trades);
      }

      if (orderbook?.payload) {
        setBids([...orderbook.payload.bids].sort((a, b) => b.price - a.price));
        setAsks([...orderbook.payload.asks].sort((a, b) => a.price - b.price));
      }

      if (trades?.payload?.trades) {
        setTrades(trades.payload.trades.slice(0, 20)); // or sort by timestamp
      }

    } catch (err) {
      console.error("❌ Error fetching snapshot:", err);
    }
  };

  fetchSnapshot();
  }, [symbol]);

  useEffect(() => {
    console.log("🔍 WS_URL in client:", WS_URL);
    const ws = new WebSocket(WS_URL+"?symbols="+symbol); // Replace with your actual URL
    
    ws.onopen = () => {
      // console.log("✅ Connected to local WebSocket server for orderbook");
    };

    ws.onclose = () => {
      // console.log("⚠️ WebSocket closed for "+symbol);
    }

    ws.onerror = (err) => {
      // console.error("❌ WebSocket error:", err);
    }

    ws.onmessage = (event) => {
      // console.log(" in side onmessage in OrderBook ");
      const message = JSON.parse(event.data);
      const { messageType, payload } = message.data;
      // console.log(" message IS ",message);
      // console.log(" messageType IS ",messageType);
      // console.log("payload is ",payload);
      if (messageType === MessageType.ORDERBOOK) {
        // console.log(' INSIDE IF 1');
        // Sort highest bid first, lowest ask first
        setBids([...payload.bids].sort((a, b) => b.price - a.price));
        setAsks([...payload.asks].sort((a, b) => a.price - b.price));
        // console.log("BIDS are "+bids);
        // console.log("ASKS are "+asks);
      }

      if (messageType === MessageType.TRADE) {
        setTrades((prev) => [
          {
            ...payload.trade,
          },
          ...prev.slice(0, 19), // Keep latest 20 trades
        ]);
      }
    };

    return () => ws.close();
  }, [symbol]);

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
      <div className="flex-1 space-y-1 overflow-y-auto font-mono text-sm">
        {activeTab === 'orderbook' ? (
          <>
            {asks.map((ask, idx) => (
              <div key={`ask-${idx}`} className="flex justify-between text-red-400">
                <span>Sell</span>
                <span>{ask.quantity} @ ${ask.price} @ {ask.cumulativeQuantity}</span>
              </div>
            ))}
            {bids.map((bid, idx) => (
              <div key={`bid-${idx}`} className="flex justify-between text-green-400">
                <span>Buy</span>
                <span>{bid.quantity} @ ${bid.price} @ {bid.cumulativeQuantity}</span>
              </div>
            ))}
          </>
        ) : (
          <>
            {trades.map((trade, idx) => (
              <div key={`trade-${idx}`} className="flex justify-between text-gray-300">
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