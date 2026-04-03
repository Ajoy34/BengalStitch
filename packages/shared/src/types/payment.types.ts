export type PaymentGateway =
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'SSLCOMMERZ'
  | 'STRIPE'
  | 'PAYPAL';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type Currency = 'BDT' | 'USD' | 'EUR' | 'GBP';

export interface Payment {
  id: string;
  orderId: string;
  gateway: PaymentGateway;
  gatewayTxnId?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
}

export interface Payout {
  id: string;
  creatorId: string;
  amount: number;
  currency: Currency;
  method: string;
  status: PayoutStatus;
  reference?: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface InitiatePaymentInput {
  orderId: string;
  gateway: PaymentGateway;
  returnUrl: string;
  cancelUrl?: string;
}

export interface PaymentResult {
  paymentId: string;
  gateway: PaymentGateway;
  redirectUrl?: string;
  clientSecret?: string;
  expiresAt?: Date;
}

export interface CommissionSplit {
  totalAmount: number;
  platformCommission: number;
  creatorRevenue: number;
  gatewayFee: number;
  netPlatformRevenue: number;
}

export function calculateCommission(
  amount: number,
  commissionRate: number,
  gatewayFeeRate: number = 0.02
): CommissionSplit {
  const platformCommission = amount * (commissionRate / 100);
  const gatewayFee = amount * gatewayFeeRate;
  const creatorRevenue = amount - platformCommission;
  const netPlatformRevenue = platformCommission - gatewayFee;

  return {
    totalAmount: amount,
    platformCommission: Math.round(platformCommission * 100) / 100,
    creatorRevenue: Math.round(creatorRevenue * 100) / 100,
    gatewayFee: Math.round(gatewayFee * 100) / 100,
    netPlatformRevenue: Math.round(netPlatformRevenue * 100) / 100,
  };
}
