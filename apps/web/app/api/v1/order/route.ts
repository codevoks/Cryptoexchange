import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { pushToQueue } from '@repo/redis-utils/queue';
import { CreateOrderInput } from '@repo/types/order';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📦 Received order body:", body);

    const order: CreateOrderInput = {
      ...body,
      slippagePercent: body.slippagePercent ?? undefined,
    };

    console.log("🧾 Final order object:", order);

    await pushToQueue(QUEUE_NAMES.ORDERS, order);

    console.log("✅ Order pushed to MATCHER_queue");

    return NextResponse.json({ message: 'Order queued to engine' });
  } catch (err) {
    console.error('❌ Queue error:', err);
    return NextResponse.json({ error: 'Failed to queue order' }, { status: 500 });
  }
}