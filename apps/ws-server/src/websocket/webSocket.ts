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
  const ORDERBOOK_CHANNEL = process.env.REDIS_CHANNEL_ORDERBOOK_PREFIX+":"+symbol;
  await redisSubscribe(ORDERBOOK_CHANNEL, (message: string) => {
    console.log('Subscribed to '+ORDERBOOK_CHANNEL);
    const conns = clients.get(symbol);
    console.log("conns is-> "+conns);
    if (!conns) return;

    const parsedMessage = JSON.parse(message); // 🔥 Parse once here

    for (const ws of conns) {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('SENDING DATA VIA WS on symbol = ',symbol," parsedMessage = ",parsedMessage );
        ws.send(JSON.stringify({ symbol, data: parsedMessage }));
      }
    }
  });
}

// Unsubscribe when no clients are listening
async function handleRedisUnsubscription(symbol: string) {
  const ORDERBOOK_CHANNEL = process.env.REDIS_CHANNEL_ORDERBOOK_PREFIX+":"+symbol;
  console.log('Unsubscribed to '+ORDERBOOK_CHANNEL);
  const conns = clients.get(symbol);
  if (!conns || conns.size === 0) {
    await redisUnsubscribe(ORDERBOOK_CHANNEL);
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
  console.log('✅ New client connected for symbols:'+ symbols);
  for (const symbol of symbols) {
    if (!clients.has(symbol)) {
      clients.set(symbol, new Set());
    }

    const conns = clients.get(symbol)!;
    conns.add(ws);

    handleRedisSubscription(symbol);
  }

  ws.on('close', () => {
    console.log('❌ Client disconnected from symbols:', symbols);
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