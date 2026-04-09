import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { SupabaseProvider } from '@/components/providers/SupabaseProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'BengalStitch — Your One-Stop Print-on-Demand Platform',
    template: '%s | BengalStitch',
  },
  description:
    'Create, sell, and ship custom products worldwide. Zero startup costs. Bangladesh & global payments. Your own branded storefront with custom domain.',
  keywords: [
    'print on demand', 'bangladesh', 'bengalstitch', 'custom products',
    'bkash', 'nagad', 'creator economy', 'sell online',
    'custom domain store', 'affiliate', 'virtual try on',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bengalstitch.com',
    siteName: 'BengalStitch',
    title: 'BengalStitch — Your One-Stop Print-on-Demand Platform',
    description: 'Create, sell, and ship custom products worldwide. Zero startup costs.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${inter.variable} antialiased`}>
        <QueryProvider>
          <SupabaseProvider>
            {children}
            <PostHogProvider />
            <Analytics />
          </SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
