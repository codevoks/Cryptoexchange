"use client";

import { useEffect, useState } from "react";
import MiniChart from "@/components/MiniChart";
import { CandlestickData, Time, UTCTimestamp } from "lightweight-charts";
import { useRouter } from "next/navigation";

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
  volumes: VolumeData[];
  logo?: string;
};

type CoinInfo = {
  id: string;
  symbol: string;
  name: string;
  image: string;
};

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

export default function MarketsPage() {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [baseAsset, setBaseAsset] = useState("BTC");
  const [quoteAsset, setQuoteAsset] = useState("USDT");
  const router = useRouter();

  // Fetch coin info for logos
  useEffect(() => {
    async function fetchCoinInfo() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot,matic-network,chainlink"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Failed to load CoinGecko data:", err);
      }
    }
    fetchCoinInfo();
  }, []);

  // Fetch market data for 10 pairs
  useEffect(() => {
    const pairs = [
      "BTCUSDT",
      "ETHUSDT",
      "BNBUSDT",
      "SOLUSDT",
      "XRPUSDT",
      "ADAUSDT",
      "DOGEUSDT",
      "DOTUSDT",
      "MATICUSDT",
      "LINKUSDT",
    ];

    async function fetchMarketData() {
      const symbolDataPromises = pairs.map(async (pair): Promise<SymbolData | null> => {
        try {
          const endTime = Date.now();
          const startTime = endTime - 24 * 60 * 60 * 1000;
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=24&startTime=${startTime}&endTime=${endTime}`
          );
          const rawData = await res.json();
          const candles: CandlestickData<Time>[] = rawData.map(transformBinanceCandle);
          const volumes: VolumeData[] = rawData.map(transformBinanceVolume);
          const coin = coins.find((c) => c.symbol.toUpperCase() === pair.slice(0, -4)) || {
            image: "",
          };
          return {
            name: pair.slice(0, -4) + "/USDT",
            symbol: pair,
            candles,
            volumes,
            logo: coin.image || undefined, // Ensure logo is string | undefined
          };
        } catch (err) {
          console.error(`Failed to load data for ${pair}:`, err);
          return null;
        }
      });

      const data = (await Promise.all(symbolDataPromises)).filter(
        (d): d is SymbolData => d !== null
      );
      setSymbols(data);
    }

    if (coins.length > 0) fetchMarketData();
  }, [coins]);

  // Handle pair selection
  const handlePairSelect = () => {
    const pair = `${baseAsset}${quoteAsset}`;
    router.push(`/dashboard?symbol=${pair}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-accent pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-wide text-accent">Markets</h2>
          <p className="text-sm text-gray-500 mt-1">Select a trading pair to view details</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <select
            value={baseAsset}
            onChange={(e) => setBaseAsset(e.target.value)}
            className="bg-[#121212] text-white border border-gray-800 rounded-lg px-4 py-2"
          >
            {["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LINK"].map(
              (asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              )
            )}
          </select>
          <select
            value={quoteAsset}
            onChange={(e) => setQuoteAsset(e.target.value)}
            className="bg-[#121212] text-white border border-gray-800 rounded-lg px-4 py-2"
          >
            {["USDT", "USD"].map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
          <button
            onClick={handlePairSelect}
            className="bg-accent hover:bg-accent-hover text-black px-5 py-2 rounded-lg font-medium shadow-lg transition"
          >
            View Chart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((symbol) => (
          <MiniChart key={symbol.symbol} symbolData={symbol} />
        ))}
      </div>
    </div>
  );
}