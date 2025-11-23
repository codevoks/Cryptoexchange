import { QUEUE_NAMES } from "@repo/redis-utils/constants";
import { pushToQueue } from "@repo/redis-utils/queue";
import { CreateOrderInput } from "@repo/types/order";
import { NextResponse } from "next/server";
import { verifyJWT } from "@repo/auth-utils/jwt";
import { JwtPayLoad } from "@repo/types/authTypes";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) throw new Error("Missing auth token");

    const token = cookieHeader.split("token=")[1];
    if (!token) throw new Error("Token not found");

    const result = await verifyJWT(token, JWT_SECRET as string);
    if (!result) throw new Error("Invalid token");

    const userPayload = result.payload as JwtPayLoad;

    const order: CreateOrderInput = {
      ...body,
      userId: userPayload.userId,
      slippagePercent: body.slippagePercent ?? undefined,
    };

    await pushToQueue(QUEUE_NAMES.ORDERS, order);

    return NextResponse.json({ message: "Order queued to engine", order });
  } catch (err) {
    console.error("❌ Queue error:", err);
    return NextResponse.json(
      { error: "Failed to queue order" },
      { status: 500 }
    );
  }
}
