import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA';

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  sell_price: number;
  total_sold: number;
  images: string[] | null;
  mockup_images?: string[] | null;
  stores?: { store_slug: string; store_name: string } | null;
};

export async function FeaturedProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, slug, title, category, sell_price, total_sold, images, mockup_images, stores(store_slug, store_name)')
    .eq('is_published', true)
    .order('total_sold', { ascending: false })
    .limit(8);

  return (
    <section className="py-20 px-6 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Shop</span>
            <h2 className="editorial-headline text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">Real products from creators — click to buy, try-on, or customize.</p>
          </div>
          <Link href="/marketplace" className="hidden sm:inline-flex gradient-cta px-6 py-3 rounded-xl font-bold">
            View Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {(products as unknown as ProductRow[] | null)?.map((p) => {
            const img = p.mockup_images?.[0] || p.images?.[0] || FALLBACK_IMAGE;
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-violet-600 px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors truncate">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-violet-600">৳ {Number(p.sell_price).toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{p.total_sold} sold</span>
                  </div>
                  {p.stores?.store_slug && (
                    <div className="mt-2 text-xs text-gray-500">
                      by{' '}
                      <span className="font-semibold text-gray-700">
                        {p.stores.store_name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {(!products || products.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            No published products yet. Create products in your dashboard and publish them to show here.
          </div>
        )}
      </div>
    </section>
  );
}

