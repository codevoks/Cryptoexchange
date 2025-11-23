"use client";

import { useState } from "react";

interface MarketOrderFormProps {
  side: "BUY" | "SELL";
}

export default function MarketOrderForm({ side }: MarketOrderFormProps) {
  const [quantity, setQuantity] = useState<number | "">("");
  const isBuy = side === "BUY";

  const baseColor = isBuy ? "#1a3e2a" : "#3a1a1a";
  const textColor = isBuy ? "#4fff8a" : "#ff6464";
  const hoverBg = isBuy ? "#215b3a" : "#5b2121";
  const focusRing = isBuy ? "#4fff8a" : "#ff6464";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity) return alert("Please enter quantity");

    const orderData = {
      userId: "user-123",
      type: "MARKET",
      side,
      symbol: "BTCUSDT",
      quantity: Number(quantity),
      pricePerUnit: null,
    };

    console.log("Submitting Market Order:", orderData);

    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");
    } catch (err) {
      console.error("❌ Error placing market order:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
      <div>
        <label className="text-sm text-gray-400">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value ? +e.target.value : "")}
          className="w-full bg-[#262626] rounded-md p-2 text-white focus:outline-none"
          style={{
            border: `1px solid transparent`,
            boxShadow: `0 0 0 0 ${focusRing}20`,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.border = `1px solid ${focusRing}`)
          }
          onBlur={(e) =>
            (e.currentTarget.style.border = `1px solid transparent`)
          }
          placeholder="Enter quantity"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-2 font-semibold transition-all duration-200 rounded-md"
        style={{
          backgroundColor: baseColor,
          color: textColor,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = baseColor)
        }
      >
        {side} MARKET
      </button>
    </form>
  );
}
