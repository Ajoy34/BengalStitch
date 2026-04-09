import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DesignsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.productDesign.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addDesign(
    userId: string,
    productId: string,
    dto: {
      designUrl: string;
      thumbnailUrl: string;
      placement?: string;
      positionX?: number;
      positionY?: number;
      scale?: number;
      rotation?: number;
    },
  ) {
    await this.verifyProductOwnership(userId, productId);

    return this.prisma.productDesign.create({
      data: {
        productId,
        designUrl: dto.designUrl,
        thumbnailUrl: dto.thumbnailUrl,
        placement: (dto.placement as never) || 'FRONT',
        positionX: dto.positionX ?? 50,
        positionY: dto.positionY ?? 50,
        scale: dto.scale ?? 100,
        rotation: dto.rotation ?? 0,
      },
    });
  }

  async updateDesign(
    userId: string,
    designId: string,
    dto: {
      placement?: string;
      positionX?: number;
      positionY?: number;
      scale?: number;
      rotation?: number;
    },
  ) {
    const design = await this.prisma.productDesign.findUnique({
      where: { id: designId },
      include: { product: true },
    });
    if (!design) throw new NotFoundException('Design not found');

    await this.verifyProductOwnership(userId, design.productId);

    return this.prisma.productDesign.update({
      where: { id: designId },
      data: {
        placement: dto.placement ? (dto.placement as never) : undefined,
        positionX: dto.positionX,
        positionY: dto.positionY,
        scale: dto.scale,
        rotation: dto.rotation,
      },
    });
  }

  async removeDesign(userId: string, designId: string) {
    const design = await this.prisma.productDesign.findUnique({
      where: { id: designId },
    });
    if (!design) throw new NotFoundException('Design not found');

    await this.verifyProductOwnership(userId, design.productId);
    await this.prisma.productDesign.delete({ where: { id: designId } });
    return { deleted: true };
  }

  private async verifyProductOwnership(userId: string, productId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Not a creator');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.creatorId !== profile.id) {
      throw new ForbiddenException('Not your product');
    }
  }
}
