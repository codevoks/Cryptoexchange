'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { ChartContainerProps } from '../../types/charts';

export default function ChartContainer({ onChartReady }: ChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log('Creating chart'); // Debug log
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
        mode: 0,
      },
    });

    chartRef.current = chart;
    onChartReady(chart);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    chart.timeScale().applyOptions({
      rightBarStaysOnScroll: true,
      lockVisibleTimeRangeOnResize: true,
    });

    return () => {
      console.log('Disposing chart'); // Debug log
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [onChartReady]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '500px' }} />;
}