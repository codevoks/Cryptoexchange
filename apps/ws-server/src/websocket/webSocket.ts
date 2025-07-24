// apps/ws-server/src/index.ts

import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { redisSubscribe, redisUnsubscribe } from '@repo/redis-utils/pubsub';
import { IncomingMessage } from 'http';

const WS_PORT = process.env.WS_PORT;
const server = createServer();
const wss = new WebSocketServer({ server });

const clients = new Map<string, Set<WebSocket>>(); // symbol → clients
const subscribedSymbols = new Set<string>(); // symbols we've subscribed on Redis

// Subscribe to Redis channel on demand
async function handleRedisSubscription(symbol: string) {
  if (subscribedSymbols.has(symbol)) return; // already subscribed

  subscribedSymbols.add(symbol);

  await redisSubscribe(`orderbook_updates:${symbol}`, (message: string) => {
    const conns = clients.get(symbol);
    if (!conns) return;

    const parsedMessage = JSON.parse(message); // 🔥 Parse once here

    for (const ws of conns) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ symbol, data: parsedMessage }));
      }
    }
  });
}

// Unsubscribe when no clients are listening
async function handleRedisUnsubscription(symbol: string) {
  const conns = clients.get(symbol);
  if (!conns || conns.size === 0) {
    await redisUnsubscribe(`orderbook_updates:${symbol}`);
    subscribedSymbols.delete(symbol);
  }
}

// 🧠 Parse requested symbols from client
function getSymbolsFromQuery(req: IncomingMessage): string[] {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  const symbolsParam = url.searchParams.get('symbols'); // e.g., ?symbols=BTC/USDC,ETH/USDC
  return symbolsParam?.split(',').map(s => s.trim()) ?? [];
}

// 🚀 Client Connection Handler
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  const symbols = getSymbolsFromQuery(req);

  for (const symbol of symbols) {
    if (!clients.has(symbol)) {
      clients.set(symbol, new Set());
    }

    const conns = clients.get(symbol)!;
    conns.add(ws);

    handleRedisSubscription(symbol);
  }

  ws.on('close', () => {
    for (const symbol of symbols) {
      const conns = clients.get(symbol);
      if (!conns) continue;

      conns.delete(ws);
      if (conns.size === 0) {
        clients.delete(symbol);
        handleRedisUnsubscription(symbol);
      }
    }
  });
});

// Start HTTP + WS server
server.listen(WS_PORT, () => {
  console.log('🧠 WebSocket server running at ws://localhost:'+WS_PORT);
});