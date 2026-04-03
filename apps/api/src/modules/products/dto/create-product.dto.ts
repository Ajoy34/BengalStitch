import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  IsPositive,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum ProductType {
  TSHIRT = 'TSHIRT',
  HOODIE = 'HOODIE',
  MUG = 'MUG',
  PHONE_CASE = 'PHONE_CASE',
  TOTE_BAG = 'TOTE_BAG',
  POSTER = 'POSTER',
  CAP = 'CAP',
  SHOES = 'SHOES',
  JEWELRY = 'JEWELRY',
}

class CreateVariantDto {
  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  colorHex?: string;

  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsEnum(ProductType)
  productType: string;

  @IsNumber()
  @IsPositive()
  basePrice: number;

  @IsNumber()
  @IsPositive()
  sellingPrice: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}
