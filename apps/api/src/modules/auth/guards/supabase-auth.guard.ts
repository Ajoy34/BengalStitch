import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.slice(7);

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const supabaseUser = data.user;

    let user = await this.prisma.user.findUnique({
      where: { email: supabaseUser.email! },
      include: { creatorProfile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          passwordHash: 'supabase-managed',
          fullName: supabaseUser.user_metadata?.full_name || supabaseUser.email!.split('@')[0],
          phone: supabaseUser.user_metadata?.phone || null,
          role: supabaseUser.user_metadata?.role === 'seller' ? 'CREATOR' : 'USER',
        },
        include: { creatorProfile: true },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      creatorProfile: user.creatorProfile,
    };

    return true;
  }
}
