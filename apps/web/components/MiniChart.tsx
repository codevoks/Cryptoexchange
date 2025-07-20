"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickData, Time, IChartApi, ISeriesApi, LineSeries } from "lightweight-charts";
import Link from "next/link";

// Types
type VolumeData = {
  time: Time;
  value: number;
  color?: string;
};

type SymbolData = {
  name: string;
  symbol: string;
  candles: CandlestickData<Time>[];
  volumes?: VolumeData[];
  logo?: string;
};

interface MiniChartProps {
  symbolData: SymbolData;
}

export default function MiniChart({ symbolData }: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !symbolData?.candles?.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 100,
      layout: { background: { color: "#121212" }, textColor: "#d1d4dc" },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      timeScale: { visible: false },
      rightPriceScale: { visible: false },
      crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    });

    // Use LineSeries constructor for addSeries
    const series = chart.addSeries(LineSeries, {
      color:
        symbolData.candles[symbolData.candles.length - 1]?.close &&
        symbolData.candles[0]?.open &&
        symbolData.candles[symbolData.candles.length - 1]!.close >=
          symbolData.candles[0].open
          ? "#26a69a"
          : "#ef5350",
    }) as ISeriesApi<"Line">;

    series.setData(
      symbolData.candles.map((c) => ({
        time: c.time,
        value: c.close ?? 0, // Fallback to 0 if close is undefined
      }))
    );
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [symbolData]);

  return (
    <Link href={`/dashboard?symbol=${symbolData.symbol}`}>
      <div className="bg-[#121212] rounded-2xl p-4 border border-gray-800 hover:shadow-xl transition">
        <div className="flex items-center mb-2">
          {symbolData.logo && (
            <img
              src={symbolData.logo}
              alt={`${symbolData.name} logo`}
              className="w-8 h-8 mr-2"
            />
          )}
          <h3 className="text-lg font-semibold text-white">{symbolData.name}</h3>
        </div>
        <div ref={chartContainerRef} className="w-full h-[100px]" />
        <p className="text-sm text-gray-500 mt-2">
          Last Price: $
          {symbolData.candles[symbolData.candles.length - 1]?.close?.toFixed(2) || "N/A"}
        </p>
      </div>
    </Link>
  );
}