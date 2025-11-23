"use client";
import { useState } from "react";

interface SlippageControlProps {
  side: "BUY" | "SELL";
}

export default function SlippageControl({ side }: SlippageControlProps) {
  const isBuy = side === "BUY";
  const accent = isBuy ? "#4fff8a" : "#ff6464";
  const darkAccent = isBuy ? "#215b3a" : "#5b2121";

  const [useZero, setUseZero] = useState(true);
  const [slippage, setSlippage] = useState(0);
  const [maxSlippage, setMaxSlippage] = useState(5);

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(Number(e.target.value));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val < 0) val = 0;
    if (val > maxSlippage) val = maxSlippage;
    setSlippage(val);
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400">Slippage (%)</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useZero}
            onChange={(e) => {
              setUseZero(e.target.checked);
              if (e.target.checked) setSlippage(0);
            }}
          />
          Use 0% slippage
        </label>
      </div>

      <input
        type="number"
        value={slippage}
        readOnly={useZero}
        onChange={handleInput}
        className="w-full bg-[#262626] rounded-md p-2 text-white focus:outline-none transition-all duration-200"
        style={{
          border: `1px solid ${useZero ? "#333" : accent}`,
          color: useZero ? "#aaa" : accent,
        }}
      />

      <input
        type="range"
        min={0}
        max={maxSlippage}
        step={0.1}
        value={slippage}
        disabled={useZero}
        onChange={handleSlider}
        className="w-full cursor-pointer"
        style={{
          accentColor: accent,
          opacity: useZero ? 0.5 : 1,
        }}
      />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>0%</span>
        <span>{maxSlippage}% max</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Max Slippage (%)</label>
        <input
          type="number"
          value={maxSlippage}
          onChange={(e) => setMaxSlippage(Number(e.target.value))}
          className="w-full bg-[#262626] rounded-md p-2 text-white focus:outline-none border border-gray-700"
        />
      </div>
    </div>
  );
}
