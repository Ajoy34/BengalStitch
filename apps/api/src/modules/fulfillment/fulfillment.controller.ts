import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FulfillmentService } from './fulfillment.service';

@Controller('fulfillment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Get('pending')
  getPendingFulfillment(@Query('page') page?: string) {
    return this.fulfillmentService.getPendingFulfillment(
      page ? parseInt(page) : 1,
    );
  }

  @Get(':orderId')
  getOrderTimeline(@Param('orderId') orderId: string) {
    return this.fulfillmentService.getOrderTimeline(orderId);
  }

  @Patch(':orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: { status: string; trackingNumber?: string; courier?: string },
  ) {
    return this.fulfillmentService.updateOrderStatus(orderId, dto.status, {
      trackingNumber: dto.trackingNumber,
      courier: dto.courier,
    });
  }
}
