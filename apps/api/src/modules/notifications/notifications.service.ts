import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string, filter: { unreadOnly?: boolean; page?: number }) {
    const { unreadOnly, page = 1 } = filter;
    const limit = 30;
    const where: Record<string, unknown> = { userId };
    if (unreadOnly) where.isRead = false;

    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notificationLog.findMany({
        where,
        orderBy: { sentAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notificationLog.count({ where }),
      this.prisma.notificationLog.count({ where: { userId, isRead: false } }),
    ]);

    return { items, total, unreadCount, page, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notificationLog.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notificationLog.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notificationLog.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async create(data: {
    userId: string;
    type: 'ORDER' | 'PAYMENT' | 'PAYOUT' | 'SYSTEM' | 'PROMO';
    channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
    title: string;
    body: string;
  }) {
    return this.prisma.notificationLog.create({ data });
  }

  async deleteOld(daysOld: number) {
    const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const result = await this.prisma.notificationLog.deleteMany({
      where: { sentAt: { lt: cutoff }, isRead: true },
    });
    return { deleted: result.count };
  }
}
