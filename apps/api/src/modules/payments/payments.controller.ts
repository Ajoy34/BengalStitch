import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('sslcommerz/initiate')
  @UseGuards(JwtAuthGuard)
  initiateSSLCommerz(@Body('orderId') orderId: string) {
    return this.paymentsService.initiateSSLCommerz(orderId);
  }

  @Post('sslcommerz/success')
  @HttpCode(HttpStatus.OK)
  handleSSLCommerzSuccess(@Body() body: Record<string, string>) {
    return this.paymentsService.handleSSLCommerzCallback(body, true);
  }

  @Post('sslcommerz/fail')
  @HttpCode(HttpStatus.OK)
  handleSSLCommerzFail(@Body() body: Record<string, string>) {
    return this.paymentsService.handleSSLCommerzCallback(body, false);
  }

  @Post('payout/request')
  @UseGuards(JwtAuthGuard)
  requestPayout(
    @CurrentUser('id') userId: string,
    @Body() dto: { amount: number; method: string },
  ) {
    return this.paymentsService.requestPayout(userId, dto);
  }

  @Post('payout/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  approvePayout(@Param('id') id: string) {
    return this.paymentsService.approvePayout(id);
  }

  @Get('payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findPayouts(@Query('status') status?: string, @Query('page') page?: string) {
    return this.paymentsService.findPayouts({
      status,
      page: page ? parseInt(page) : 1,
    });
  }
}
