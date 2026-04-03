'use client';

import Link from 'next/link';

const CATEGORIES = [
  { name: 'Apparel', icon: '👕', count: 45, color: 'from-violet-500 to-purple-600' },
  { name: 'Hoodies', icon: '🧥', count: 29, color: 'from-rose-500 to-pink-600' },
  { name: 'Mugs', icon: '☕', count: 12, color: 'from-amber-500 to-orange-600' },
  { name: 'Phone Cases', icon: '📱', count: 18, color: 'from-cyan-500 to-blue-600' },
  { name: 'Tote Bags', icon: '👜', count: 8, color: 'from-emerald-500 to-green-600' },
  { name: 'Wall Art', icon: '🖼️', count: 24, color: 'from-fuchsia-500 to-purple-600' },
  { name: 'Posters', icon: '📄', count: 15, color: 'from-sky-500 to-blue-600' },
  { name: 'Caps', icon: '🧢', count: 10, color: 'from-red-500 to-rose-600' },
  { name: 'Shoes', icon: '👟', count: 14, color: 'from-indigo-500 to-violet-600' },
  { name: 'Stickers', icon: '✨', count: 20, color: 'from-yellow-500 to-amber-600' },
  { name: 'Blankets', icon: '🛏️', count: 6, color: 'from-teal-500 to-cyan-600' },
  { name: 'Jewelry', icon: '💎', count: 9, color: 'from-pink-500 to-rose-600' },
];

export function CategoryBar() {
  return (
    <section className="py-16 px-6 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="editorial-headline text-3xl md:text-4xl font-extrabold text-gray-900">
            Customize Products &amp; Start Selling Now!
          </h2>
          <p className="text-gray-500 mt-3">Choose from 2,700+ premium product SKUs</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/marketplace?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.count} Items</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-violet-600 font-bold hover:text-violet-800 transition-colors"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
