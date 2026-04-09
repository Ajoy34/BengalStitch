import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

const FALLBACK_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA';

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: store } = await supabase.from('stores').select('store_name, description').eq('store_slug', slug).single();
  return { title: store?.store_name || slug, description: store?.description || '' };
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('store_slug', slug)
    .eq('is_active', true)
    .single();

  if (!store) notFound();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Store banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-violet-600 to-rose-500">
          {store.banner_url && (
            <Image src={store.banner_url} alt="Banner" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 md:px-8 -mt-16 relative z-10">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden flex items-center justify-center">
              {store.logo_url ? (
                <Image src={store.logo_url} alt={store.store_name} width={128} height={128} className="object-cover w-full h-full" />
              ) : (
                <span className="text-4xl font-extrabold gradient-text">{store.store_name.charAt(0)}</span>
              )}
            </div>
            <div className="pb-2">
              <h1 className="editorial-headline text-2xl md:text-3xl font-extrabold text-gray-900">{store.store_name}</h1>
              {store.description && <p className="text-gray-500 text-sm mt-1 max-w-lg">{store.description}</p>}
              <p className="text-xs text-gray-400 mt-1">{(products || []).length} products</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-16">
            {(products || []).map((p) => {
              const img = (p.images as string[])?.[0] || FALLBACK_IMAGE;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors truncate">{p.title}</h3>
                    <span className="font-bold text-violet-600 text-sm">৳ {Number(p.sell_price).toLocaleString()}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {(!products || products.length === 0) && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
