import { pushToQueue } from '@repo/redis-utils/queue';
import { CreateOrderInput } from '@repo/types/order';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order: CreateOrderInput = {
      ...body,
      slippagePercent: body.slippagePercent ?? undefined,
    };

    await pushToQueue('DB_queue',order);

    return NextResponse.json({ message: 'Order queued to engine' });
  } catch (err) {
    console.error('Queue error:', err);
    return NextResponse.json({ error: 'Failed to queue order' }, { status: 500 });
  }
}