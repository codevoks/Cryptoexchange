import { Suspense } from "react";
import ChartClient from "@/components/ChartClient";
import OrderBook from "@/components/OrderBook";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading chart...</div>}>
      <ChartClient />
    </Suspense>
  );
}