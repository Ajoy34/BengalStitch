import type { Currency } from '../types';

export const CURRENCY_CONFIG: Record<
  Currency,
  { symbol: string; name: string; decimals: number; locale: string }
> = {
  BDT: { symbol: '৳', name: 'Bangladeshi Taka', decimals: 2, locale: 'bn-BD' },
  USD: { symbol: '$', name: 'US Dollar', decimals: 2, locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', decimals: 2, locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', decimals: 2, locale: 'en-GB' },
};

export function formatCurrency(
  amount: number,
  currency: Currency = 'BDT'
): string {
  const config = CURRENCY_CONFIG[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: config.decimals,
  }).format(amount);
}
