import fetch from "node-fetch";

const API_URL = "http://localhost:3000/api/v1/orders"; // adjust port if needed
const AUTH_COOKIE =
  "token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjNmFjMmUxZS03YTI4LTQ2MDYtYWM4Zi0yODA2YjUyZmMxMzQiLCJlbWFpbCI6ImFiYzJAYWJjIiwiaWF0IjoxNzYyNjA5NTExLCJleHAiOjE3NjI2MTMxMTF9.LK-U4HjD9ih5oYJoMTplPZxRJuGC3gIQFWan72YoqYI"; // 👈 paste the cookie value from browser

// This ensures no trades happen — buy < sell prices
const buyPrices = [
  65000, 64950, 64900, 64850, 64800, 64750, 64700, 64650, 64600, 64550,
];
const sellPrices = [
  66000, 66050, 66100, 66150, 66200, 66250, 66300, 66350, 66400, 66450,
];

const ORDERS = [
  ...buyPrices.map((price, i) => ({
    id: `buy-${i + 1}`,
    userId: "user-101",
    type: "LIMIT",
    side: "BUY",
    symbol: "BTCUSDT",
    pricePerUnit: price,
    quantity: 0.5,
  })),
  ...sellPrices.map((price, i) => ({
    id: `sell-${i + 1}`,
    userId: "user-102",
    type: "LIMIT",
    side: "SELL",
    symbol: "BTCUSDT",
    pricePerUnit: price,
    quantity: 0.5,
  })),
];

async function floodOrders() {
  for (const order of ORDERS) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: AUTH_COOKIE, // 👈 attach your JWT cookie
        },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        const err = await res.text();
        // console.error(`❌ Failed for ${order.id}:`, err);
        console.error(`❌ Failed for `);
      } else {
        // console.log(`✅ Added ${order.side} order: ${order.pricePerUnit}`);
        // console.log(`✅ Added `);
      }

      await new Promise((r) => setTimeout(r, 150)); // small delay to avoid overload
    } catch (err) {
      // console.error(`💥 Error for ${order.id}:`, err.message);
      console.error(`💥 Error for : `);
    }
  }
}

floodOrders();
