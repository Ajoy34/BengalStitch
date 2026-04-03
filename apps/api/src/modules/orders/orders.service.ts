import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: any) {
    const orderNumber = `AMP-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.order.create({
      data: {
        orderNumber,
        buyerId: userId,
        status: 'PENDING',
        subtotal: dto.subtotal || 0,
        total: dto.total || 0,
        shippingAddress: dto.shippingAddress,
        items: {
          create: dto.items?.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            creatorId: item.creatorId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findByBuyer(userId: string, page = 1) {
    const limit = 20;
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: { include: { product: true } } },
    });
  }

  async findByCreator(userId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!creator) return [];
    return this.prisma.orderItem.findMany({
      where: { creatorId: creator.id },
      include: { order: true, product: true },
      orderBy: { order: { createdAt: 'desc' } },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true, variant: true } }, payments: true },
    });
    if (!order || order.buyerId !== userId) throw new NotFoundException('Order not found');
    return order;
  }

  async cancel(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    if (order.status !== 'PENDING') throw new Error('Cannot cancel non-pending order');
    return this.prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });
  }
}
