'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  CandlestickData,
  Time,
  IChartApi,
  IPriceLine,
} from 'lightweight-charts';

// Candle type aligned with CandlestickData<Time>
type Candle = CandlestickData<Time>;

// Volume data type
type VolumeData = {
  time: Time;
  value: number;
  color?: string;
};

// Symbol data type
interface SymbolData {
  name: string;
  candles: Candle[];
  volumes?: VolumeData[]; // Optional for cases with no volume
}

interface Props {
  data?: Candle[]; // Optional data prop for single symbol
  symbols?: SymbolData[]; // Optional for multiple symbols
}

export default function TradingChart({ data, symbols = [] }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentSymbolIndex, setCurrentSymbolIndex] = useState(0);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const priceLineRef = useRef<IPriceLine | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Use symbols if provided, else create a default symbol from data
    const activeData: SymbolData[] = symbols.length > 0 ? symbols : data ? [{ name: 'Default', candles: data }] : [];

    if (!activeData[currentSymbolIndex]) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#363C4E' },
      },
      timeScale: {
        borderColor: '#485c7b',
        rightOffset: 10,
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#485c7b',
      },
      crosshair: {
        mode: 0, // Magnet mode for better UX
      },
    });

    chartRef.current = chart;

    // Add Candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      priceScaleId: 'right',
      priceLineVisible: true,
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    }) as ISeriesApi<'Candlestick'>;
    candlestickSeriesRef.current = candlestickSeries;

    // Add Volume series (only if volume data exists)
    let volumeSeries: ISeriesApi<'Histogram'> | null = null;
    if (activeData[currentSymbolIndex].volumes) {
      volumeSeries = chart.addSeries(HistogramSeries, {
        priceScaleId: 'volume',
        priceFormat: { type: 'volume' },
        base: 0,
      }) as ISeriesApi<'Histogram'>;
      volumeSeriesRef.current = volumeSeries;

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 }, // Place volume at bottom
      });
    }

    // Set initial data
    candlestickSeries.setData(activeData[currentSymbolIndex].candles);
    if (volumeSeries && activeData[currentSymbolIndex].volumes) {
      volumeSeries.setData(activeData[currentSymbolIndex].volumes!);
    }

    // Add live price line
    const lastCandle = activeData[currentSymbolIndex].candles[activeData[currentSymbolIndex].candles.length - 1];
    if (lastCandle) {
      priceLineRef.current = candlestickSeries.createPriceLine({
        price: lastCandle.close,
        color: '#ffffff',
        lineWidth: 1,
        lineStyle: 0, // Dashed line
        axisLabelVisible: true,
        title: 'Live Price',
        lineVisible: true,
        axisLabelColor: '#ffffff',
        axisLabelTextColor: '#000000',
      });
    }

    // Custom tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = '#ffffff';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '1000';
    chartContainerRef.current.appendChild(tooltip);
    tooltipRef.current = tooltip;

    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time || !tooltipRef.current) return;

      const data = param.seriesData.get(candlestickSeries) as CandlestickData<Time>;
      const volumeData = volumeSeries ? (param.seriesData.get(volumeSeries) as { value: number }) : null;

      if (data) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${param.point.x + 10}px`;
        tooltipRef.current.style.top = `${param.point.y + 10}px`;
        tooltipRef.current.innerHTML = `
          <div>Time: ${param.time}</div>
          <div>Open: ${data.open}</div>
          <div>High: ${data.high}</div>
          <div>Low: ${data.low}</div>
          <div>Close: ${data.close}</div>
          <div>Volume: ${volumeData?.value || 'N/A'}</div>
        `;
      } else {
        tooltipRef.current.style.display = 'none';
      }
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    // Enable zoom/pan
    chart.timeScale().applyOptions({
      rightBarStaysOnScroll: true,
      lockVisibleTimeRangeOnResize: true,
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [currentSymbolIndex, data, symbols]);

  // Symbol switcher (only shown if symbols are provided)
  const handleSymbolChange = (index: number) => {
    setCurrentSymbolIndex(index);
    if (candlestickSeriesRef.current && symbols[index]) {
      candlestickSeriesRef.current.setData(symbols[index].candles);
      if (volumeSeriesRef.current && symbols[index].volumes) {
        volumeSeriesRef.current.setData(symbols[index].volumes);
      }

      // Update live price line
      const lastCandle = symbols[index].candles[symbols[index].candles.length - 1];
      if (lastCandle && candlestickSeriesRef.current) {
        if (priceLineRef.current) {
          candlestickSeriesRef.current.removePriceLine(priceLineRef.current);
        }
        priceLineRef.current = candlestickSeriesRef.current.createPriceLine({
          price: lastCandle.close,
          color: '#ffffff',
          lineWidth: 1,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Live Price',
          lineVisible: true,
          axisLabelColor: '#ffffff',
          axisLabelTextColor: '#000000',
        });
      }
    }
  };

  return (
    <div style={{ position: 'relative'}}>
      <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />
      {/* Symbol switcher (only if multiple symbols) */}
      {symbols.length > 0 && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
          {symbols.map((symbol, index) => (
            <button
              key={symbol.name}
              onClick={() => handleSymbolChange(index)}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                background: currentSymbolIndex === index ? '#26a69a' : '#363C4E',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {symbol.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 'use client';

// import { useState, useRef, useMemo } from 'react';
// import { ISeriesApi, IChartApi } from 'lightweight-charts';
// import ChartContainer from './TradingChart/ChartContainer';
// import CandlestickSeriesComponent from './TradingChart/CandlestickSeries';
// import VolumeSeriesComponent from './TradingChart/VolumeSeries';
// import Tooltip from './TradingChart/Tooltip';
// import PriceLine from './TradingChart/PriceLine';
// import SymbolSwitcher from './TradingChart/SymbolSwitcher';
// import { TradingChartProps, SymbolData } from '../types/charts';

// export default function TradingChart({ data, symbols = [] }: TradingChartProps) {
//   const [currentSymbolIndex, setCurrentSymbolIndex] = useState(0);
//   const chartRef = useRef<IChartApi | null>(null);
//   const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
//   const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

//   const activeData: SymbolData[] = useMemo(() => {
//     return symbols.length > 0
//       ? symbols
//       : data
//       ? [{
//           name: 'Default',
//           symbol: 'DEFAULT',
//           fullName: 'Default Asset',
//           candles: data,
//           volumes: [],
//           logo: undefined
//         }]
//       : [];
//   }, [data, symbols]);

//   const handleChartReady = (chart: IChartApi) => {
//     chartRef.current = chart;
//   };

//   const handleCandlestickSeriesReady = (series: ISeriesApi<'Candlestick'>) => {
//     candlestickSeriesRef.current = series;
//   };

//   const handleVolumeSeriesReady = (series: ISeriesApi<'Histogram'> | null) => {
//     volumeSeriesRef.current = series;
//   };

//   const handleSymbolChange = (index: number) => {
//     setCurrentSymbolIndex(index);
//   };

//   return (
//     <div style={{ position: 'relative' }}>
//       {activeData[currentSymbolIndex] && activeData[currentSymbolIndex].candles.length > 0 && (
//         <>
//           <ChartContainer onChartReady={handleChartReady} />
//           <CandlestickSeriesComponent
//             chart={chartRef.current}
//             candles={activeData[currentSymbolIndex].candles}
//             onSeriesReady={handleCandlestickSeriesReady}
//           />
//           <VolumeSeriesComponent
//             chart={chartRef.current}
//             volumes={activeData[currentSymbolIndex].volumes}
//             onSeriesReady={handleVolumeSeriesReady}
//           />
//           <Tooltip
//             chart={chartRef.current}
//             candlestickSeries={candlestickSeriesRef.current}
//             volumeSeries={volumeSeriesRef.current}
//           />
//           <PriceLine
//             candlestickSeries={candlestickSeriesRef.current}
//             candles={activeData[currentSymbolIndex].candles}
//           />
//           {symbols.length > 1 && (
//             <SymbolSwitcher
//               symbols={symbols}
//               currentSymbolIndex={currentSymbolIndex}
//               onSymbolChange={handleSymbolChange}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// }