export type ProductType =
  | 'TSHIRT'
  | 'HOODIE'
  | 'MUG'
  | 'PHONE_CASE'
  | 'TOTE_BAG'
  | 'POSTER'
  | 'CAP'
  | 'SHOES'
  | 'JEWELRY';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type DesignPlacement = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'ALL_OVER';
export type StockStatus = 'IN_STOCK' | 'LOW' | 'OUT_OF_STOCK';

export interface Product {
  id: string;
  creatorId: string;
  title: string;
  slug: string;
  description?: string;
  productType: ProductType;
  basePrice: number;
  sellingPrice: number;
  profitMargin: number;
  currency: string;
  status: ProductStatus;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  viewCount: number;
  saleCount: number;
  isFeatured: boolean;
  mockupUrls: MockupUrls;
  variants: ProductVariant[];
  designs: ProductDesign[];
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  colorHex?: string;
  sku: string;
  additionalPrice: number;
  stockStatus: StockStatus;
  weightGrams?: number;
}

export interface ProductDesign {
  id: string;
  productId: string;
  designUrl: string;
  thumbnailUrl: string;
  placement: DesignPlacement;
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  layers?: DesignLayer[];
  createdAt: Date;
}

export interface DesignLayer {
  id: string;
  type: 'IMAGE' | 'TEXT' | 'SHAPE' | 'STICKER';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  properties?: Record<string, unknown>;
}

export interface MockupUrls {
  front?: string;
  back?: string;
  side?: string;
  threeDModel?: string;
  video?: string;
  ogImage?: string;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  productType: ProductType;
  basePrice: number;
  sellingPrice: number;
  currency?: string;
  tags?: string[];
  variants?: CreateVariantInput[];
}

export interface CreateVariantInput {
  size?: string;
  color?: string;
  colorHex?: string;
  additionalPrice?: number;
}

export interface ProductFilter {
  search?: string;
  productType?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  creatorId?: string;
  status?: ProductStatus;
  tags?: string[];
  sortBy?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
