import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'ZERO Startup Cost',
    description: 'Start selling without spending a single taka. No inventory, no risk — just pure creative potential.',
    color: 'bg-violet-50 text-violet-600 border-violet-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Quality Products',
    description: 'Over 2,700+ premium product SKUs. From apparel to home decor — the largest POD catalog in Bangladesh.',
    color: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Automatic Upsells',
    description: 'Boost earnings through automated upsell and cross-selling strategies for instant results.',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Free Email Marketing',
    description: 'Send customer emails from your dashboard. Track campaign success with built-in KPI analytics.',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Clear Profit Margins',
    description: 'Full pricing transparency. Control your prices, see your margins, and maximize your earnings.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Custom Storefronts',
    description: 'Connect your own .com domain and get a branded landing page that looks like your own website.',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Easy Analytics',
    description: 'Track site traffic, conversion rates, and best-selling products with an intuitive analytics dashboard.',
    color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Customer Service',
    description: 'Round-the-clock support in English and Bangla. We handle customer queries so you can focus on creating.',
    color: 'bg-sky-50 text-sky-600 border-sky-200',
  },
];

export function WhyChoose() {
  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Our Advantages</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Why Choose BengalStitch?
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            With our print-on-demand products, dependable fulfillment, industry-leading customer service,
            and more — BengalStitch provides a clear path toward success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" className="gradient-cta inline-block px-8 py-4 rounded-xl font-bold text-lg">
            Create a Product
          </Link>
          <Link href="/signup" className="inline-block px-8 py-4 rounded-xl font-bold text-lg border-2 border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors">
            Start Selling
          </Link>
        </div>
      </div>
    </section>
  );
}
