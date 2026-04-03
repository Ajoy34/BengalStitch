import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { creatorProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async update(id: string, data: { fullName?: string; phone?: string; language?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        country: true,
        language: true,
        role: true,
      },
    });
  }
}
