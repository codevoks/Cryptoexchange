// types/chart.ts


export interface UTCCandle {
  time: number; // UNIX timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}


import { CandlestickData, Time } from 'lightweight-charts';

export type Candle = CandlestickData<Time>;

export type VolumeData = {
  time: Time;
  value: number;
  color?: string;
};

export interface SymbolData {
  name: string;
  symbol: string;
  fullName: string;
  candles: Candle[];
  volumes?: VolumeData[];
  logo?: string;
}

export interface ChartContainerProps {
  onChartReady: (chart: import('lightweight-charts').IChartApi) => void;
}

export interface CandlestickSeriesProps {
  chart: import('lightweight-charts').IChartApi | null;
  candles: Candle[];
  onSeriesReady: (series: import('lightweight-charts').ISeriesApi<'Candlestick'>) => void;
}

export interface VolumeSeriesProps {
  chart: import('lightweight-charts').IChartApi | null;
  volumes?: VolumeData[];
  onSeriesReady: (series: import('lightweight-charts').ISeriesApi<'Histogram'> | null) => void;
}

export interface TooltipProps {
  chart: import('lightweight-charts').IChartApi | null;
  candlestickSeries: import('lightweight-charts').ISeriesApi<'Candlestick'> | null;
  volumeSeries: import('lightweight-charts').ISeriesApi<'Histogram'> | null;
}

export interface SymbolSwitcherProps {
  symbols: SymbolData[];
  currentSymbolIndex: number;
  onSymbolChange: (index: number) => void;
}

export interface PriceLineProps {
  candlestickSeries: import('lightweight-charts').ISeriesApi<'Candlestick'> | null;
  candles: Candle[];
}

export interface TradingChartProps {
  data?: Candle[];
  symbols?: SymbolData[];
}