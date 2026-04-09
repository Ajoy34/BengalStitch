import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bengalstitch.com';
  const supabase = await createClient();

  const staticPages = [
    '', '/marketplace', '/login', '/signup', '/about', '/blog',
    '/contact', '/faq', '/pricing', '/privacy', '/terms',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('is_published', true);

  const productPages = (products || []).map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const { data: stores } = await supabase
    .from('stores')
    .select('store_slug, created_at')
    .eq('is_active', true);

  const storePages = (stores || []).map((s) => ({
    url: `${baseUrl}/store/${s.store_slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...storePages];
}
