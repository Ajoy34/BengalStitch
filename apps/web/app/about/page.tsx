import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = { title: 'About Us — BengalStitch' };

const STATS = [
  { value: '8,000+', label: 'Active Sellers' },
  { value: '2,700+', label: 'Product SKUs' },
  { value: '500K+', label: 'Items Sold' },
  { value: '50+', label: 'Countries Reached' },
];

const VALUES = [
  { icon: '🇧🇩', title: 'Bangladesh First', description: 'Built from Dhaka for the world. We prioritize local payment methods, local shipping, and support in Bangla.' },
  { icon: '🚀', title: 'Zero Barriers', description: 'No startup costs, no inventory risk. Anyone with a creative idea can start selling in minutes.' },
  { icon: '🤝', title: 'Community Driven', description: 'Our affiliate system lets anyone earn. Share a link, earn 10% — building a network of mutual success.' },
  { icon: '🎨', title: 'Creator Empowerment', description: 'AI-powered design tools, custom domains, and branded storefronts to help every creator look professional.' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 min-h-screen">
        <section className="px-6 md:px-8 pb-16 bg-gradient-to-br from-green-50 via-white to-green-50">
          <div className="container mx-auto max-w-4xl text-center">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Our Story</span>
            <h1 className="editorial-headline text-4xl md:text-6xl font-extrabold text-gray-900 mt-3">
              Empowering Bangladeshi Creators to Sell Globally
            </h1>
            <p className="text-gray-500 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
              BengalStitch was born from a simple idea: every creative person in Bangladesh deserves the tools to turn their art into income — without needing capital, inventory, or technical expertise.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-8 py-16">
          <div className="container mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-8 py-16 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="editorial-headline text-3xl font-extrabold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                  <span className="text-4xl">{v.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-4">{v.title}</h3>
                  <p className="text-gray-500 mt-2 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 md:px-8 py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="editorial-headline text-3xl font-extrabold text-gray-900">Our Mission</h2>
            <p className="text-gray-500 mt-4 text-lg leading-relaxed">
              To make print-on-demand accessible to every Bangladeshi creator — from university students earning their first income, to established designers expanding globally. We handle the printing, shipping, and customer service so you can focus on what matters most: creating.
            </p>
            <Link href="/signup" className="inline-block mt-8 gradient-cta px-8 py-4 rounded-xl font-bold text-lg">
              Join 8,000+ Creators
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
