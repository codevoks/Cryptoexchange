// lib/binance.ts
export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function fetchBinanceKlines(symbol = 'BTCUSDT', interval = '1m', limit = 100): Promise<Kline[]> {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    { cache: 'no-store' }
  );

  const rawData = await res.json();

  return rawData.map((d: any[]) => ({
    time: d[0] / 1000, // in seconds
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
  }));
}