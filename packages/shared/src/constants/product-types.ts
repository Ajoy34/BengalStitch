import type { ProductType } from '../types';

export const PRODUCT_TYPE_CONFIG: Record<
  ProductType,
  {
    label: string;
    labelBn: string;
    icon: string;
    basePriceBDT: number;
    sizes?: string[];
    hasColor: boolean;
  }
> = {
  TSHIRT: {
    label: 'T-Shirt',
    labelBn: 'টি-শার্ট',
    icon: 'checkroom',
    basePriceBDT: 500,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    hasColor: true,
  },
  HOODIE: {
    label: 'Hoodie',
    labelBn: 'হুডি',
    icon: 'apparel',
    basePriceBDT: 1200,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    hasColor: true,
  },
  MUG: {
    label: 'Mug',
    labelBn: 'মগ',
    icon: 'coffee',
    basePriceBDT: 300,
    hasColor: false,
  },
  PHONE_CASE: {
    label: 'Phone Case',
    labelBn: 'ফোন কেস',
    icon: 'smartphone',
    basePriceBDT: 350,
    hasColor: true,
  },
  TOTE_BAG: {
    label: 'Tote Bag',
    labelBn: 'টোট ব্যাগ',
    icon: 'shopping_bag',
    basePriceBDT: 400,
    hasColor: true,
  },
  POSTER: {
    label: 'Poster',
    labelBn: 'পোস্টার',
    icon: 'image',
    basePriceBDT: 200,
    sizes: ['A4', 'A3', 'A2', 'A1'],
    hasColor: false,
  },
  CAP: {
    label: 'Cap',
    labelBn: 'ক্যাপ',
    icon: 'dry_cleaning',
    basePriceBDT: 350,
    sizes: ['One Size', 'S/M', 'L/XL'],
    hasColor: true,
  },
  SHOES: {
    label: 'Shoes',
    labelBn: 'জুতা',
    icon: 'steps',
    basePriceBDT: 2500,
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    hasColor: true,
  },
  JEWELRY: {
    label: 'Jewelry',
    labelBn: 'গহনা',
    icon: 'diamond',
    basePriceBDT: 800,
    hasColor: true,
  },
};

export const PRODUCT_TYPES = Object.keys(PRODUCT_TYPE_CONFIG) as ProductType[];
