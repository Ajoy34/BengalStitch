export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'PRINTED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  trackingNumber?: string;
  courier?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  creatorId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  designSnapshot?: Record<string, unknown>;
  product?: {
    title: string;
    slug: string;
    mockupUrls: { front?: string };
  };
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddress: Address;
  couponCode?: string;
  notes?: string;
}

export interface CreateOrderItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    title: string;
    slug: string;
    sellingPrice: number;
    mockupUrls: { front?: string };
  };
  variant: {
    size?: string;
    color?: string;
    additionalPrice: number;
  };
}
