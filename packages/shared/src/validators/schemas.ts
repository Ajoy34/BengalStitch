import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  fullName: z.string().min(2).max(255),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
    .optional(),
  country: z.string().length(2).default('BD'),
  language: z.enum(['en', 'bn']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const createProductSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  productType: z.enum([
    'TSHIRT',
    'HOODIE',
    'MUG',
    'PHONE_CASE',
    'TOTE_BAG',
    'POSTER',
    'CAP',
    'SHOES',
    'JEWELRY',
  ]),
  basePrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  currency: z.enum(['BDT', 'USD', 'EUR', 'GBP']).default('BDT'),
  tags: z.array(z.string()).max(20).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        colorHex: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        additionalPrice: z.number().min(0).default(0),
      })
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid(),
        quantity: z.number().int().positive().max(100),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: z.string().min(2).max(255),
    line1: z.string().min(5).max(500),
    line2: z.string().max(500).optional(),
    city: z.string().min(2).max(100),
    state: z.string().max(100).optional(),
    postalCode: z.string().min(3).max(20),
    country: z.string().length(2),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  }),
  couponCode: z.string().max(30).optional(),
  notes: z.string().max(1000).optional(),
});

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  gateway: z.enum([
    'BKASH',
    'NAGAD',
    'ROCKET',
    'SSLCOMMERZ',
    'STRIPE',
    'PAYPAL',
  ]),
  returnUrl: z.string().url(),
  cancelUrl: z.string().url().optional(),
});

export const productFilterSchema = z.object({
  search: z.string().max(200).optional(),
  productType: z
    .enum([
      'TSHIRT',
      'HOODIE',
      'MUG',
      'PHONE_CASE',
      'TOTE_BAG',
      'POSTER',
      'CAP',
      'SHOES',
      'JEWELRY',
    ])
    .optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  creatorId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z
    .enum(['newest', 'popular', 'price_asc', 'price_desc', 'rating'])
    .default('newest'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(24),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
