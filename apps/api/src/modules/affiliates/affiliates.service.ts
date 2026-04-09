import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';

@Injectable()
export class AffiliatesService {
  constructor(private prisma: PrismaService) {}

  async createLink(userId: string, dto: { productId?: string; storeId?: string }) {
    const code = this.generateCode();

    const existing = await this.prisma.affiliateLink.findFirst({
      where: { userId, productId: dto.productId || null },
    });
    if (existing) return existing;

    return this.prisma.affiliateLink.create({
      data: {
        userId,
        productId: dto.productId,
        storeId: dto.storeId,
        code,
        linkType: dto.productId ? 'PRODUCT' : 'STORE',
      },
    });
  }

  async getMyLinks(userId: string) {
    return this.prisma.affiliateLink.findMany({
      where: { userId },
      include: { product: { select: { title: true, slug: true, sellingPrice: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async trackClick(code: string, ipAddress: string, productSlug?: string) {
    const link = await this.prisma.affiliateLink.findUnique({ where: { code } });
    if (!link || !link.isActive) throw new NotFoundException('Affiliate link not found');

    const ipHash = createHash('sha256').update(ipAddress + code).digest('hex');

    const recentClick = await this.prisma.$queryRaw`
      SELECT id FROM affiliate_links WHERE code = ${code}
      AND id IN (
        SELECT id FROM affiliate_links WHERE code = ${code}
      )
    `;

    await this.prisma.affiliateLink.update({
      where: { code },
      data: { clickCount: { increment: 1 } },
    });

    return { tracked: true, code };
  }

  async recordConversion(code: string, orderId: string, orderTotal: number) {
    const link = await this.prisma.affiliateLink.findUnique({ where: { code } });
    if (!link) return null;

    const commission = orderTotal * (Number(link.commissionPercent) / 100);

    await this.prisma.affiliateLink.update({
      where: { code },
      data: {
        conversionCount: { increment: 1 },
        totalEarned: { increment: commission },
      },
    });

    return { commission, affiliateUserId: link.userId };
  }

  async getAdminOverview() {
    const [totalLinks, totalClicks, totalConversions, totalEarned] = await Promise.all([
      this.prisma.affiliateLink.count(),
      this.prisma.affiliateLink.aggregate({ _sum: { clickCount: true } }),
      this.prisma.affiliateLink.aggregate({ _sum: { conversionCount: true } }),
      this.prisma.affiliateLink.aggregate({ _sum: { totalEarned: true } }),
    ]);

    const topAffiliates = await this.prisma.affiliateLink.findMany({
      orderBy: { totalEarned: 'desc' },
      take: 10,
      include: { user: { select: { fullName: true, email: true } } },
    });

    return {
      totalLinks,
      totalClicks: totalClicks._sum.clickCount || 0,
      totalConversions: totalConversions._sum.conversionCount || 0,
      totalEarned: totalEarned._sum.totalEarned || 0,
      topAffiliates,
    };
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
