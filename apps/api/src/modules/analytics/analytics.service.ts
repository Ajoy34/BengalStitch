import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(data: {
    eventType: string;
    entityType?: string;
    entityId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getPlatformOverview() {
    const [totalUsers, totalProducts, totalOrders, totalStores, revenue] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.creatorProfile.count(),
        this.prisma.order.aggregate({
          where: { status: { in: ['PAID', 'PROCESSING', 'PRINTED', 'SHIPPED', 'DELIVERED'] } },
          _sum: { total: true },
        }),
      ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalStores,
      totalRevenue: revenue._sum.total || 0,
    };
  }

  async getRevenueTimeline(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: since },
        status: { in: ['PAID', 'PROCESSING', 'PRINTED', 'SHIPPED', 'DELIVERED'] },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const daily = new Map<string, number>();
    for (const order of orders) {
      const day = order.createdAt.toISOString().slice(0, 10);
      daily.set(day, (daily.get(day) || 0) + Number(order.total));
    }

    return Array.from(daily.entries()).map(([date, revenue]) => ({ date, revenue }));
  }

  async getTopProducts(limit = 10) {
    return this.prisma.product.findMany({
      orderBy: { saleCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        saleCount: true,
        viewCount: true,
        sellingPrice: true,
        creator: { select: { storeName: true } },
      },
    });
  }

  async getTopStores(limit = 10) {
    return this.prisma.creatorProfile.findMany({
      orderBy: { totalSales: 'desc' },
      take: limit,
      select: {
        id: true,
        storeName: true,
        storeSlug: true,
        totalSales: true,
        totalEarnings: true,
        user: { select: { fullName: true } },
        _count: { select: { products: true } },
      },
    });
  }

  async getSellerAnalytics(userId: string, days = 30) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile) return null;

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [orderItems, products] = await Promise.all([
      this.prisma.orderItem.findMany({
        where: { creatorId: profile.id, order: { createdAt: { gte: since } } },
        include: { order: { select: { createdAt: true, status: true } } },
      }),
      this.prisma.product.findMany({
        where: { creatorId: profile.id },
        select: { id: true, title: true, saleCount: true, viewCount: true },
        orderBy: { saleCount: 'desc' },
        take: 10,
      }),
    ]);

    const revenue = orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    const totalSold = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      revenue,
      totalSold,
      orderCount: new Set(orderItems.map((i) => i.orderId)).size,
      topProducts: products,
    };
  }
}
