"use client";
import { useState } from "react";
import OrderTabs from "./OrderTabs";
import LimitOrderForm from "./LimitOrderForm";
import MarketOrderForm from "./MarketOrderForm";

export default function TradeTrigger({ symbol }: { symbol: string }) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET">("LIMIT");

  return (
    <div className="w-[20%] h-[500px] bg-[#1E1E1E] border border-gray-700 rounded-xl text-white p-4 flex flex-col">
      {/* BUY / SELL buttons */}
      <div className="flex w-full mb-4">
        <button
          onClick={() => setSide("BUY")}
          className={`flex-1 py-2 font-semibold rounded-t-md transition-all duration-200 ${
            side === "BUY"
              ? "bg-[#1a3e2a] text-[#4fff8a] shadow-inner"
              : "bg-[#262626] text-gray-400 hover:text-[#4fff8a]"
          }`}
        >
          BUY
        </button>

        <button
          onClick={() => setSide("SELL")}
          className={`flex-1 py-2 font-semibold rounded-t-md transition-all duration-200 ${
            side === "SELL"
              ? "bg-[#3a1a1a] text-[#ff6464] shadow-inner"
              : "bg-[#262626] text-gray-400 hover:text-[#ff8a8a]"
          }`}
        >
          SELL
        </button>
      </div>

      {/* Limit / Market Tabs */}
      <OrderTabs
        orderType={orderType}
        setOrderType={setOrderType}
        side={side}
      />

      {/* Form */}
      <div className="flex-1 mt-4">
        {orderType === "LIMIT" ? (
          <LimitOrderForm side={side} symbol={symbol} />
        ) : (
          <MarketOrderForm side={side} symbol={symbol} />
        )}
      </div>
    </div>
  );
}
