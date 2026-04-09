import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('event')
  trackEvent(@Body() dto: { eventType: string; entityType?: string; entityId?: string; metadata?: Record<string, unknown> }, @Req() req: Request) {
    return this.analyticsService.trackEvent({
      ...dto,
      ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  getPlatformOverview() {
    return this.analyticsService.getPlatformOverview();
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard)
  getRevenueTimeline(@Query('days') days?: string) {
    return this.analyticsService.getRevenueTimeline(days ? parseInt(days) : 30);
  }

  @Get('top-products')
  @UseGuards(JwtAuthGuard)
  getTopProducts(@Query('limit') limit?: string) {
    return this.analyticsService.getTopProducts(limit ? parseInt(limit) : 10);
  }

  @Get('top-stores')
  @UseGuards(JwtAuthGuard)
  getTopStores(@Query('limit') limit?: string) {
    return this.analyticsService.getTopStores(limit ? parseInt(limit) : 10);
  }

  @Get('seller')
  @UseGuards(JwtAuthGuard)
  getSellerAnalytics(@CurrentUser('id') userId: string, @Query('days') days?: string) {
    return this.analyticsService.getSellerAnalytics(userId, days ? parseInt(days) : 30);
  }
}
