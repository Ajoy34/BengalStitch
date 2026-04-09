import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.storesService.findAll({
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyStore(@CurrentUser('id') userId: string) {
    return this.storesService.getMyStore(userId);
  }

  @Get('me/earnings')
  @UseGuards(JwtAuthGuard)
  getEarnings(@CurrentUser('id') userId: string) {
    return this.storesService.getEarnings(userId);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createStore(
    @CurrentUser('id') userId: string,
    @Body() dto: { storeName: string; bio?: string },
  ) {
    return this.storesService.createStore(userId, dto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateStore(@CurrentUser('id') userId: string, @Body() dto: Record<string, unknown>) {
    return this.storesService.updateStore(userId, dto as never);
  }
}
