import type { PaymentGateway } from '../types';

export const PAYMENT_GATEWAY_CONFIG: Record<
  PaymentGateway,
  {
    label: string;
    region: 'BD' | 'GLOBAL';
    icon: string;
    feePercent: number;
    currencies: string[];
  }
> = {
  BKASH: {
    label: 'bKash',
    region: 'BD',
    icon: 'account_balance_wallet',
    feePercent: 1.5,
    currencies: ['BDT'],
  },
  NAGAD: {
    label: 'Nagad',
    region: 'BD',
    icon: 'payments',
    feePercent: 1.5,
    currencies: ['BDT'],
  },
  ROCKET: {
    label: 'Rocket',
    region: 'BD',
    icon: 'rocket_launch',
    feePercent: 1.8,
    currencies: ['BDT'],
  },
  SSLCOMMERZ: {
    label: 'SSLCommerz',
    region: 'BD',
    icon: 'credit_card',
    feePercent: 2.0,
    currencies: ['BDT'],
  },
  STRIPE: {
    label: 'Stripe',
    region: 'GLOBAL',
    icon: 'credit_card',
    feePercent: 2.9,
    currencies: ['USD', 'EUR', 'GBP', 'BDT'],
  },
  PAYPAL: {
    label: 'PayPal',
    region: 'GLOBAL',
    icon: 'paid',
    feePercent: 3.49,
    currencies: ['USD', 'EUR', 'GBP'],
  },
};

export const BD_GATEWAYS: PaymentGateway[] = ['BKASH', 'NAGAD', 'ROCKET', 'SSLCOMMERZ'];
export const GLOBAL_GATEWAYS: PaymentGateway[] = ['STRIPE', 'PAYPAL'];
