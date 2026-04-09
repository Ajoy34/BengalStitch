import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const STATUS_FLOW: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PRINTED'],
  PRINTED: ['SHIPPED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: [],
  RETURNED: [],
  CANCELLED: [],
};

@Injectable()
export class FulfillmentService {
  constructor(private prisma: PrismaService) {}

  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    meta?: { trackingNumber?: string; courier?: string },
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const allowed = STATUS_FLOW[order.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`,
      );
    }

    const data: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'SHIPPED') {
      if (meta?.trackingNumber) data.trackingNumber = meta.trackingNumber;
      if (meta?.courier) data.courier = meta.courier;
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data,
      include: { buyer: { select: { email: true, fullName: true } } },
    });

    if (newStatus === 'DELIVERED') {
      await this.creditCreatorEarnings(orderId);
    }

    return updated;
  }

  async getOrderTimeline(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        payments: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getPendingFulfillment(page = 1) {
    const limit = 20;
    const where = { status: { in: ['PAID', 'PROCESSING', 'PRINTED'] as never } };

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          buyer: { select: { fullName: true, email: true } },
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  private async creditCreatorEarnings(orderId: string) {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true, creator: true },
    });

    for (const item of items) {
      const profit = Number(item.totalPrice) - Number(item.product.basePrice) * item.quantity;
      const platformCut = profit * (Number(item.creator.commissionRate) / 100);
      const creatorEarning = profit - platformCut;

      if (creatorEarning > 0) {
        await this.prisma.creatorProfile.update({
          where: { id: item.creatorId },
          data: {
            totalEarnings: { increment: creatorEarning },
            totalSales: { increment: item.quantity },
          },
        });
      }
    }
  }
}
