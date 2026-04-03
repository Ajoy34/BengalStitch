import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
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
    default: 'AmarPOD — Your One-Stop Print-on-Demand Platform',
    template: '%s | AmarPOD',
  },
  description:
    'Create, sell, and ship custom products worldwide. Zero startup costs. Bangladesh & global payments. Your own branded storefront with custom domain.',
  keywords: [
    'print on demand',
    'bangladesh',
    'amarpod',
    'custom products',
    'bkash',
    'nagad',
    'creator economy',
    'sell online',
    'custom domain store',
    'affiliate',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amarpod.com',
    siteName: 'AmarPOD',
    title: 'AmarPOD — Your One-Stop Print-on-Demand Platform',
    description:
      'Create, sell, and ship custom products worldwide. Zero startup costs.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
