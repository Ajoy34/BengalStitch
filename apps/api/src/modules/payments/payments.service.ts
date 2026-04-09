import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async initiateSSLCommerz(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { buyer: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const storeId = this.config.get('SSLCOMMERZ_STORE_ID');
    const storePassword = this.config.get('SSLCOMMERZ_STORE_PASSWORD');
    const baseUrl = this.config.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000';

    const params = new URLSearchParams({
      store_id: storeId || '',
      store_passwd: storePassword || '',
      total_amount: order.total.toString(),
      currency: order.currency,
      tran_id: order.id,
      success_url: `${baseUrl}/api/payment/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/fail`,
      cus_name: order.buyer.fullName,
      cus_email: order.buyer.email,
      cus_phone: order.buyer.phone || '01700000000',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'Courier',
      product_name: order.items.map((i) => i.product.title).join(', '),
      product_category: 'Clothing',
      product_profile: 'physical-goods',
    });

    const isSandbox = this.config.get('SSLCOMMERZ_SANDBOX') !== 'false';
    const endpoint = isSandbox
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status === 'SUCCESS') {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          gateway: 'SSLCOMMERZ',
          amount: order.total,
          currency: order.currency,
          status: 'PENDING',
        },
      });
      return { gatewayUrl: data.GatewayPageURL };
    }

    throw new BadRequestException('SSLCommerz initiation failed');
  }

  async handleSSLCommerzCallback(body: Record<string, string>, success: boolean) {
    const orderId = body.tran_id;
    if (!orderId) throw new BadRequestException('Missing transaction ID');

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (success && body.status === 'VALID') {
      await this.prisma.$transaction([
        this.prisma.order.update({ where: { id: orderId }, data: { status: 'PAID' } }),
        this.prisma.payment.updateMany({
          where: { orderId, gateway: 'SSLCOMMERZ' },
          data: { status: 'COMPLETED', gatewayTxnId: body.val_id, paidAt: new Date() },
        }),
      ]);
      return { orderId, status: 'paid' };
    }

    await this.prisma.payment.updateMany({
      where: { orderId, gateway: 'SSLCOMMERZ' },
      data: { status: 'FAILED' },
    });
    return { orderId, status: 'failed' };
  }

  async requestPayout(userId: string, dto: { amount: number; method: string }) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('No store found');

    const availableBalance =
      Number(profile.totalEarnings) -
      (await this.getPayoutTotal(profile.id));

    if (dto.amount > availableBalance) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.payout.create({
      data: {
        creatorId: profile.id,
        amount: dto.amount,
        method: dto.method as never,
        status: 'PENDING',
      },
    });
  }

  async approvePayout(payoutId: string) {
    return this.prisma.payout.update({
      where: { id: payoutId },
      data: { status: 'COMPLETED', processedAt: new Date() },
    });
  }

  async findPayouts(filter: { status?: string; page?: number }) {
    const { status, page = 1 } = filter;
    const limit = 20;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        include: { creator: { include: { user: { select: { fullName: true, email: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payout.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  private async getPayoutTotal(creatorId: string): Promise<number> {
    const result = await this.prisma.payout.aggregate({
      where: { creatorId, status: { in: ['PENDING', 'PROCESSING', 'COMPLETED'] } },
      _sum: { amount: true },
    });
    return Number(result._sum.amount || 0);
  }
}
