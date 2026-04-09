import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Marketplace — Browse Products',
  description: 'Browse thousands of unique products from Bangladeshi creators.',
};

interface SearchParams {
  cat?: string;
  q?: string;
  sort?: string;
  page?: string;
  collection?: string;
}

const CATEGORIES = ['All', 'tshirt', 'hoodie', 'mug', 'phone_case', 'poster', 'tote_bag', 'cap'];
const CATEGORY_LABELS: Record<string, string> = {
  All: 'All', tshirt: 'T-Shirts', hoodie: 'Hoodies', mug: 'Mugs',
  phone_case: 'Phone Cases', poster: 'Posters', tote_bag: 'Bags', cap: 'Caps',
};

const COLLECTIONS = [
  { slug: 'hot-trendy', name: 'Hot Trendy', emoji: '🔥', gradient: 'from-orange-500 to-red-500' },
  { slug: 'mothers-day', name: "Mother's Day", emoji: '💐', gradient: 'from-pink-400 to-rose-500' },
  { slug: 'earth-day', name: 'Earth Day', emoji: '🌍', gradient: 'from-emerald-400 to-teal-500' },
  { slug: 'lifestyle', name: 'Lifestyle', emoji: '✨', gradient: 'from-violet-400 to-indigo-500' },
  { slug: 'gaming', name: 'Gaming', emoji: '🎮', gradient: 'from-blue-500 to-cyan-500' },
  { slug: 'funny', name: 'Funny', emoji: '😂', gradient: 'from-yellow-400 to-orange-500' },
  { slug: 'anime-comics', name: 'Anime & Comics', emoji: '⚡', gradient: 'from-fuchsia-500 to-rose-500' },
];

const COLLECTION_TAGS: Record<string, string[]> = {
  'hot-trendy': ['trending', 'hot', 'popular', 'bestseller', 'viral'],
  'mothers-day': ['mom', 'mother', 'mama', 'gift', 'love', 'mothers day'],
  'earth-day': ['eco', 'nature', 'earth', 'green', 'planet', 'recycle'],
  'lifestyle': ['aesthetic', 'minimalist', 'vibes', 'chill', 'mood'],
  'gaming': ['gamer', 'gaming', 'esports', 'controller', 'pixel', 'retro game'],
  'funny': ['meme', 'funny', 'humor', 'joke', 'lol', 'pun'],
  'anime-comics': ['anime', 'manga', 'comic', 'otaku', 'weeb', 'kawaii'],
};

const FALLBACK_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA';

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const category = sp.cat || 'All';
  const search = sp.q || '';
  const sort = sp.sort || 'newest';
  const page = parseInt(sp.page || '1', 10);
  const collection = sp.collection || '';
  const limit = 12;

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (category !== 'All') query = query.eq('category', category);

  if (collection && COLLECTION_TAGS[collection]) {
    const tags = COLLECTION_TAGS[collection];
    query = query.overlaps('tags', tags);
  } else if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (sort === 'price_asc') query = query.order('sell_price', { ascending: true });
  else if (sort === 'price_desc') query = query.order('sell_price', { ascending: false });
  else if (sort === 'popular') query = query.order('total_sold', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Marketplace</h1>
            <p className="text-gray-500">Discover unique products from creators across Bangladesh</p>
          </div>

          {/* Collection Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
            <Link
              href="/marketplace"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                !collection
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              All Collections
            </Link>
            {COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={`/marketplace?collection=${col.slug}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  collection === col.slug
                    ? `bg-gradient-to-r ${col.gradient} text-white shadow-lg`
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <span>{col.emoji}</span>
                {col.name}
              </Link>
            ))}
          </div>

          {/* Active Collection Banner */}
          {collection && COLLECTIONS.find(c => c.slug === collection) && (
            <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${COLLECTIONS.find(c => c.slug === collection)!.gradient} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{COLLECTIONS.find(c => c.slug === collection)!.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-extrabold">{COLLECTIONS.find(c => c.slug === collection)!.name}</h2>
                    <p className="text-white/80 text-sm mt-1">Curated collection of the best designs</p>
                  </div>
                </div>
                <Link href="/marketplace" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Clear Filter
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <form className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Search products, creators, tags..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-6 py-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
              />
            </form>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/marketplace?cat=${cat}${search ? `&q=${search}` : ''}`}
                  className={`px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Sort controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{count || 0} products found</p>
            <div className="flex gap-2">
              {[
                { value: 'newest', label: 'Newest' },
                { value: 'popular', label: 'Popular' },
                { value: 'price_asc', label: 'Price: Low' },
                { value: 'price_desc', label: 'Price: High' },
              ].map((s) => (
                <Link
                  key={s.value}
                  href={`/marketplace?cat=${category}&sort=${s.value}${search ? `&q=${search}` : ''}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sort === s.value ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(products || []).map((p) => {
              const img = (p.images as string[])?.[0] || FALLBACK_IMAGE;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-violet-600 px-2.5 py-1 rounded-full">{p.category}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Earn 10%</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors truncate">{p.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-violet-600">৳ {Number(p.sell_price).toLocaleString()}</span>
                      <span className="text-xs text-gray-400">{p.total_sold} sold</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {(!products || products.length === 0) && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/marketplace?cat=${category}&sort=${sort}&page=${p}${search ? `&q=${search}` : ''}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                    p === page ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
