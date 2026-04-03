import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query('page') page?: string) {
    return this.ordersService.findByBuyer(userId, page ? parseInt(page) : 1);
  }

  @Get('creator')
  findCreatorOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.findByCreator(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.findOne(userId, id);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.ordersService.cancel(userId, id);
  }
}
