import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Marketplace',
  description: 'Browse thousands of unique products from Bangladeshi creators.',
};

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto">
          {/* Search + Filter Bar */}
          <div className="mb-12">
            <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold mb-6">
              Marketplace
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="search"
                placeholder="Search products, creators, tags..."
                className="flex-1 bg-surface-container-lowest ghost-border rounded-xl px-6 py-4 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,221,221,0.2)] transition-all"
              />
              <div className="flex gap-2 overflow-x-auto">
                {['All', 'T-Shirts', 'Hoodies', 'Mugs', 'Phone Cases', 'Posters'].map(
                  (category) => (
                    <button
                      key={category}
                      className="px-4 py-2 bg-surface-container-highest rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-container rounded-[var(--radius-card)] overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/5] bg-surface-container-high" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
