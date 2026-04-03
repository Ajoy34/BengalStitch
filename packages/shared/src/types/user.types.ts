export type UserRole = 'USER' | 'CREATOR' | 'ADMIN';
export type Language = 'en' | 'bn';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  country: string;
  language: Language;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  bio?: string;
  logoUrl?: string;
  bannerUrl?: string;
  subscriptionTier: SubscriptionTier;
  commissionRate: number;
  totalEarnings: number;
  totalSales: number;
  payoutMethod?: PayoutMethod;
  payoutDetails?: Record<string, unknown>;
  isVerifiedSeller: boolean;
  createdAt: Date;
}

export type SubscriptionTier = 'FREE' | 'PRO' | 'BRAND' | 'ENTERPRISE';
export type PayoutMethod = 'BKASH' | 'NAGAD' | 'BANK' | 'PAYPAL' | 'WISE' | 'PAYONEER';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  country?: string;
  language?: Language;
}

export interface LoginInput {
  email: string;
  password: string;
}
