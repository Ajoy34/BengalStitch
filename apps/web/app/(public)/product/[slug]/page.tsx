import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: 'sample-tshirt' },
    { slug: 'premium-hoodie' },
    { slug: 'classic-mug' },
  ];
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface-container rounded-[var(--radius-card)] flex items-center justify-center">
              <p className="text-on-surface-variant text-sm">
                Product image for <strong>{slug}</strong>
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-surface-container-high rounded-xl"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                T-Shirt
              </span>
              <h1 className="editorial-headline text-3xl md:text-4xl font-extrabold mt-2">
                {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <p className="text-on-surface-variant mt-4">
                Premium quality print-on-demand product by a Bangladeshi
                creator.
              </p>
            </div>

            <div className="text-3xl font-bold text-primary">
              ৳ 850
            </div>

            {/* Size selector */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
                Size
              </h3>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 rounded-xl bg-surface-container-highest text-sm font-bold hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
                Color
              </h3>
              <div className="flex gap-3">
                {['#000000', '#ffffff', '#1a1a2e', '#e94560'].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-full ghost-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 gradient-cta text-on-primary py-4 rounded-md font-extrabold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,221,221,0.4)] transition-all">
                Add to Cart
              </button>
              <button className="w-14 h-14 rounded-xl ghost-border flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors">
                &#9829;
              </button>
            </div>

            {/* Creator info */}
            <div className="flex items-center gap-4 p-6 bg-surface-container-high rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                A
              </div>
              <div>
                <p className="font-bold">AuraCreative</p>
                <p className="text-on-surface-variant text-sm">
                  120 products &bull; 4.8 rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
