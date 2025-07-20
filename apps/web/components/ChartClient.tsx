"use client";

import { useEffect, useState } from "react";
import TradingChart from "@/components/TradingChart";
import CryptoLoader from "@/components/CryptoLoader";
import { UTCTimestamp, CandlestickData, Time } from "lightweight-charts";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import OrderBook from "./OrderBook";
import TradeTrigger from "./TradeTrigger"

// Types
type VolumeData = {
  time: Time;
  value: number;
  color?: string;
};

type SymbolData = {
  name: string;
  symbol: string;
  fullName: string;
  candles: CandlestickData<Time>[];
  volumes: VolumeData[];
  logo?: string;
};

// CoinGecko ID mapping for common assets
const COINGECKO_IDS: { [key: string]: string } = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  DOT: "polkadot",
  MATIC: "matic-network",
  LINK: "chainlink",
};

// Fallback logo
const FALLBACK_LOGO = "https://via.placeholder.com/40?text=Crypto";

// Helpers
function transformBinanceCandle(candle: any): CandlestickData<Time> {
  return {
    time: Math.floor(candle[0] / 1000) as UTCTimestamp,
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
  };
}

function transformBinanceVolume(candle: any): VolumeData {
  return {
    time: Math.floor(candle[0] / 1000) as UTCTimestamp,
    value: parseFloat(candle[5]),
    color: parseFloat(candle[4]) >= parseFloat(candle[1]) ? "#26a69a" : "#ef5350",
  };
}

export default function ChartClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = searchParams.get("symbol")?.toUpperCase() || "BTCUSDT";
  const baseAsset = symbol.slice(0, -4); // e.g., "BTC" from "BTCUSDT"
  const quoteAsset = symbol.slice(-4); // e.g., "USDT"
  const [symbolData, setSymbolData] = useState<SymbolData>({
    name: `${baseAsset}/${quoteAsset}`,
    symbol,
    fullName: baseAsset,
    candles: [],
    volumes: [],
    logo: FALLBACK_LOGO,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch coin info for logo and full name
    async function fetchCoinInfo() {
      try {
        const coinId = COINGECKO_IDS[baseAsset] || baseAsset.toLowerCase();
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
        );
        if (!res.ok) throw new Error(`Failed to fetch CoinGecko data for ${coinId}`);
        const data = await res.json();
        console.log("CoinGecko response:", data); // Debug log
        if (data[0]?.image && data[0]?.name) {
          setSymbolData((prev) => ({
            ...prev,
            logo: data[0].image,
            fullName: data[0].name,
          }));
        } else {
          console.warn(`No data found for coinId: ${coinId}`);
          setSymbolData((prev) => ({ ...prev, logo: FALLBACK_LOGO }));
        }
      } catch (err) {
        console.error("Failed to load CoinGecko data:", err);
        setSymbolData((prev) => ({ ...prev, logo: FALLBACK_LOGO }));
      }
    }

    // Fetch historical candles
    async function fetchHistoricalCandles() {
      try {
        setLoading(true);
        setError(null);
        const endTime = Date.now();
        const startTime = endTime - 24 * 60 * 60 * 1000;
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1000&startTime=${startTime}&endTime=${endTime}`
        );
        if (!res.ok) throw new Error(`Failed to fetch Binance data for ${symbol}`);
        const rawData = await res.json();
        console.log("Binance response:", rawData); // Debug log
        const candles = rawData.map(transformBinanceCandle);
        const volumes = rawData.map(transformBinanceVolume);
        console.log("Transformed candles:", candles); // Debug log
        console.log("Transformed volumes:", volumes); // Debug log

        setSymbolData((prev) => ({ ...prev, candles, volumes }));
      } catch (err) {
        console.error("Failed to load Binance data:", err);
        setError(`Failed to load chart data for ${symbol}. Please try again.`);
      } finally {
        console.log("Setting loading to false"); // Debug log
        setLoading(false);
      }
    }

    fetchCoinInfo();
    fetchHistoricalCandles();

    // WebSocket for real-time updates
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`);
    ws.onmessage = (event) => {
      const { k } = JSON.parse(event.data);
      console.log("WebSocket message:", k); // Debug log
      const newCandle = transformBinanceCandle([k.t, k.o, k.h, k.l, k.c]);
      const newVolume = transformBinanceVolume([k.t, k.o, k.h, k.l, k.c, k.v]);

      setSymbolData((prev) => {
        const last = prev.candles[prev.candles.length - 1];
        const candles =
          last?.time === newCandle.time
            ? [...prev.candles.slice(0, -1), newCandle]
            : [...prev.candles, newCandle].slice(-1000);
        const volumes =
          last?.time === newCandle.time
            ? [...prev.volumes.slice(0, -1), newVolume]
            : [...prev.volumes, newVolume].slice(-1000);
        return { ...prev, candles, volumes };
      });
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError(`Real-time data connection failed for ${symbol}.`);
    };

    return () => ws.close();
  }, [symbol]);

  // Handle refresh
  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6 font-sans">
      {loading && <CryptoLoader logo={symbolData.logo} loading={loading} />}
      {error && (
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}
      {!loading && !error && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-accent pb-4">
            <div className="flex items-center space-x-4">
              <Link href="/markets">
                <button className="bg-accent hover:bg-accent-hover text-black px-5 py-2 rounded-lg font-medium shadow-lg transition border border-accent cursor-pointer">
                  Back to Markets
                </button>
              </Link>
              <img
                src={symbolData.logo}
                alt={`${symbolData.fullName} logo`}
                className="w-10 h-10 rounded-full"
                onError={(e) => (e.currentTarget.src = FALLBACK_LOGO)}
              />
              <div>
                <h2 className="text-3xl font-bold tracking-wide text-accent">
                  {symbolData.fullName} ({symbolData.name})
                </h2>
                <p className="text-sm text-gray-500 mt-1">Powered by Binance WebSocket</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleRefresh}
                className="bg-accent hover:bg-accent-hover text-black px-5 py-2 rounded-lg font-medium shadow-lg transition border border-accent cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Chart Card */}
          <div className="rounded-2xl bg-[#121212] shadow-2xl p-4 border border-gray-800">
            <div className="flex gap-4">
              <div className="w-[60%]">
                <TradingChart symbols={[symbolData]} />
              </div>
              <OrderBook />
              <TradeTrigger />
            </div>
          </div>
        </>
      )}
    </div>
  );
}