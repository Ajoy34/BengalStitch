import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductActions } from './ProductActions';

interface Props {
  params: Promise<{ slug: string }>;
}

const FALLBACK_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
];

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('slug', slug)
    .single();

  return {
    title: product?.title || slug.replace(/-/g, ' '),
    description: product?.description || 'Unique product from BengalStitch',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, stores(store_name, store_slug, logo_url)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!product) {
    notFound();
  }

  const images: string[] = (product.images as string[])?.length ? product.images : FALLBACK_IMAGES;
  const sizes: string[] = (product.sizes as string[]) || ['S', 'M', 'L', 'XL'];
  const colors: string[] = (product.colors as string[]) || [];
  const store = product.stores as { store_name: string; store_slug: string; logo_url: string | null } | null;

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-violet-600">Home</Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-violet-600">Marketplace</Link>
            <span>/</span>
            <span className="text-gray-600">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <Image src={images[0]} alt={product.title} width={600} height={600} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img: string, i: number) => (
                    <div key={i} className={`aspect-square bg-white rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-violet-500' : 'border-gray-100 hover:border-violet-300'}`}>
                      <Image src={img} alt={`${product.title} view ${i + 1}`} width={150} height={150} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="editorial-headline text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
                  {product.title}
                </h1>
                {product.description && (
                  <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold gradient-text">
                  ৳ {Number(product.sell_price).toLocaleString()}
                </span>
                {Number(product.base_price) > Number(product.sell_price) && (
                  <span className="text-lg text-gray-400 line-through">
                    ৳ {Number(product.base_price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Sizes */}
              {sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string, i: number) => (
                      <button key={size} className={`min-w-[48px] h-12 px-4 rounded-xl text-sm font-bold transition-all ${i === 1 ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-300'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Color</h3>
                  <div className="flex gap-3">
                    {colors.map((color: string, i: number) => (
                      <button key={color} className={`w-10 h-10 rounded-full border-2 transition-all ${i === 0 ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-200 hover:border-violet-300'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Client-side interactive parts */}
              <ProductActions
                garmentUrl={images[0]}
                productTitle={product.title}
                productId={product.id}
                sellPrice={Number(product.sell_price)}
                storeName={store?.store_name}
                storeSlug={store?.store_slug}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
