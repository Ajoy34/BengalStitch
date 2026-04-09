import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AffiliatesService } from './affiliates.service';
import { Request } from 'express';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post('link')
  @UseGuards(JwtAuthGuard)
  createLink(
    @CurrentUser('id') userId: string,
    @Body() dto: { productId?: string; storeId?: string },
  ) {
    return this.affiliatesService.createLink(userId, dto);
  }

  @Get('my-links')
  @UseGuards(JwtAuthGuard)
  getMyLinks(@CurrentUser('id') userId: string) {
    return this.affiliatesService.getMyLinks(userId);
  }

  @Post('click/:code')
  trackClick(@Param('code') code: string, @Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
    return this.affiliatesService.trackClick(code, ip);
  }

  @Get('admin/overview')
  @UseGuards(JwtAuthGuard)
  getAdminOverview() {
    return this.affiliatesService.getAdminOverview();
  }
}
