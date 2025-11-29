import { NextResponse } from "next/server";
import { register } from "@repo/metrics-utils";

export async function GET() {
  return new NextResponse(await register.metrics(), {
    headers: {
      "Content-Type": register.contentType,
    },
  });
}
