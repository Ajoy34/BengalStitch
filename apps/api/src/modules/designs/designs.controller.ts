import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DesignsService } from './designs.service';

@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.designsService.findByProduct(productId);
  }

  @Post('product/:productId')
  @UseGuards(JwtAuthGuard)
  addDesign(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: { designUrl: string; thumbnailUrl: string; placement?: string },
  ) {
    return this.designsService.addDesign(userId, productId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateDesign(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: { placement?: string; positionX?: number; positionY?: number; scale?: number; rotation?: number },
  ) {
    return this.designsService.updateDesign(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeDesign(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.designsService.removeDesign(userId, id);
  }
}
