import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: { search?: string; page?: number; limit?: number }) {
    const { search, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.creatorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { email: true, fullName: true, avatarUrl: true } },
          _count: { select: { products: true } },
        },
        orderBy: { totalSales: 'desc' },
      }),
      this.prisma.creatorProfile.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.creatorProfile.findUnique({
      where: { storeSlug: slug },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async getMyStore(userId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { userId },
      include: { _count: { select: { products: true, orderItems: true } } },
    });
    if (!profile) throw new NotFoundException('You have no store. Create one first.');
    return profile;
  }

  async createStore(userId: string, dto: { storeName: string; bio?: string }) {
    const existing = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('You already have a store');

    const storeSlug = dto.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const slugExists = await this.prisma.creatorProfile.findUnique({ where: { storeSlug } });
    if (slugExists) throw new ConflictException('Store name taken, try another');

    await this.prisma.user.update({ where: { id: userId }, data: { role: 'CREATOR' } });

    return this.prisma.creatorProfile.create({
      data: {
        userId,
        storeName: dto.storeName,
        storeSlug: storeSlug,
        bio: dto.bio,
      },
    });
  }

  async updateStore(
    userId: string,
    dto: {
      storeName?: string;
      bio?: string;
      logoUrl?: string;
      bannerUrl?: string;
      themeColor?: string;
      heroTitle?: string;
      heroSubtitle?: string;
      socialLinks?: Record<string, string>;
    },
  ) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('No store found');

    const data: Record<string, unknown> = {};
    if (dto.storeName) data.storeName = dto.storeName;
    if (dto.bio !== undefined) data.bio = dto.bio;
    if (dto.logoUrl !== undefined) data.logoUrl = dto.logoUrl;
    if (dto.bannerUrl !== undefined) data.bannerUrl = dto.bannerUrl;
    if (dto.themeColor) data.themeColor = dto.themeColor;
    if (dto.heroTitle !== undefined) data.heroTitle = dto.heroTitle;
    if (dto.heroSubtitle !== undefined) data.heroSubtitle = dto.heroSubtitle;
    if (dto.socialLinks) data.socialLinks = dto.socialLinks;

    return this.prisma.creatorProfile.update({ where: { userId }, data });
  }

  async getEarnings(userId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('No store found');

    const [pendingPayouts, completedPayouts] = await Promise.all([
      this.prisma.payout.aggregate({
        where: { creatorId: profile.id, status: 'PENDING' },
        _sum: { amount: true },
      }),
      this.prisma.payout.aggregate({
        where: { creatorId: profile.id, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalEarnings: profile.totalEarnings,
      totalSales: profile.totalSales,
      pendingPayout: pendingPayouts._sum.amount || 0,
      completedPayouts: completedPayouts._sum.amount || 0,
    };
  }
}
