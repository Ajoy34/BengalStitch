import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: {
    search?: string;
    productType?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, productType, sortBy = 'newest', page = 1, limit = 24 } = filter;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'ACTIVE' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }
    if (productType) where.productType = productType;

    const orderBy = {
      newest: { createdAt: 'desc' as const },
      popular: { saleCount: 'desc' as const },
      price_asc: { sellingPrice: 'asc' as const },
      price_desc: { sellingPrice: 'desc' as const },
    }[sortBy] || { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          variants: true,
          creator: { select: { storeName: true, storeSlug: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total,
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        designs: true,
        creator: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            logoUrl: true,
            isVerifiedSeller: true,
          },
        },
        reviews: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async create(userId: string, dto: CreateProductDto) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });
    if (!creator) throw new ForbiddenException('Not a creator account');

    const slug = this.generateSlug(dto.title);

    const product = await this.prisma.product.create({
      data: {
        creatorId: creator.id,
        title: dto.title,
        slug,
        description: dto.description,
        productType: dto.productType as never,
        basePrice: dto.basePrice,
        sellingPrice: dto.sellingPrice,
        profitMargin: dto.sellingPrice - dto.basePrice,
        currency: dto.currency || 'BDT',
        tags: dto.tags || [],
        variants: dto.variants
          ? {
              create: dto.variants.map((v, i) => ({
                ...v,
                sku: `${slug}-${i + 1}`,
              })),
            }
          : undefined,
      },
      include: { variants: true },
    });

    return {
      ...product,
      shareableLink: `${process.env.FRONTEND_URL || 'https://bengalstitch.com'}/p/${slug}`,
    };
  }

  async update(userId: string, id: string, dto: Partial<CreateProductDto>) {
    const product = await this.verifyOwnership(userId, id);
    return this.prisma.product.update({
      where: { id: product.id },
      data: {
        title: dto.title,
        description: dto.description,
        sellingPrice: dto.sellingPrice,
        basePrice: dto.basePrice,
        tags: dto.tags,
      },
    });
  }

  async remove(userId: string, id: string) {
    const product = await this.verifyOwnership(userId, id);
    await this.prisma.product.delete({ where: { id: product.id } });
    return { deleted: true };
  }

  private async verifyOwnership(userId: string, productId: string) {
    const creator = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.creatorId !== creator?.id) {
      throw new ForbiddenException('Not your product');
    }
    return product;
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${base}-${suffix}`;
  }
}
