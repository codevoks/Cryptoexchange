import { prisma } from '@repo/db/lib/prisma';
import type { Order, OrderStatus, OrderType, OrderSide } from '@prisma/client';
import { CreateOrderInput } from "@repo/types/order"

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  return prisma.order.create({
    data: {
      userId: data.userId,
      type: data.type,
      side: data.side,
      price: data.pricePerUnit,
      quantity: data.quantity,
      pair: data.symbol
    },
  });
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}