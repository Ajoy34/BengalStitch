import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = { title: 'Pricing — BengalStitch' };

const STANDARD_PRODUCTS = [
  { name: 'Unisex T-Shirt', base: '$8.50', sell: '$22.99', profit: '$14.49' },
  { name: 'Premium Hoodie', base: '$18.00', sell: '$44.99', profit: '$26.99' },
  { name: 'Classic Mug (11oz)', base: '$4.50', sell: '$14.99', profit: '$10.49' },
  { name: 'Canvas Tote Bag', base: '$7.00', sell: '$19.99', profit: '$12.99' },
  { name: 'Phone Case', base: '$5.50', sell: '$16.99', profit: '$11.49' },
  { name: 'Canvas Print (16x20)', base: '$12.00', sell: '$34.99', profit: '$22.99' },
  { name: 'Poster (18x24)', base: '$5.00', sell: '$16.99', profit: '$11.99' },
  { name: 'Trucker Hat', base: '$6.00', sell: '$18.99', profit: '$12.99' },
];

const SHIPPING = [
  { region: 'Bangladesh (Dhaka)', standard: '৳60', express: '৳120', time: '1-2 days' },
  { region: 'Bangladesh (Outside Dhaka)', standard: '৳80', express: '৳150', time: '2-4 days' },
  { region: 'United States', standard: '$4.99', express: '$9.99', time: '5-10 days' },
  { region: 'Europe', standard: '$5.99', express: '$11.99', time: '7-14 days' },
  { region: 'Rest of World', standard: '$6.99', express: '$14.99', time: '10-21 days' },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-violet-50 via-white to-rose-50 px-6 md:px-8 pb-16">
          <div className="container mx-auto max-w-5xl text-center">
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Transparent Pricing</span>
            <h1 className="editorial-headline text-4xl md:text-6xl font-extrabold text-gray-900 mt-3">
              Simple, Honest Pricing
            </h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              No monthly fees. No hidden costs. You only pay the base cost when a product sells — keep the rest as profit.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { value: '$0', label: 'Monthly Fee' },
                { value: '0%', label: 'Listing Fee' },
                { value: '7%', label: 'Processing Fee' },
                { value: '80%+', label: 'Your Profit' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm min-w-[140px]">
                  <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product pricing */}
        <section className="px-6 md:px-8 py-16">
          <div className="container mx-auto max-w-5xl">
            <h2 className="editorial-headline text-3xl font-extrabold text-gray-900 mb-2">Product Base Prices</h2>
            <p className="text-gray-500 mb-8">Set your own retail price. The difference is your profit (minus 7% processing fee).</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Base Cost</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Suggested Retail</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Your Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDARD_PRODUCTS.map((p) => (
                    <tr key={p.name} className="border-b border-gray-100 hover:bg-violet-50/50 transition-colors">
                      <td className="py-4 px-4 font-semibold text-gray-800">{p.name}</td>
                      <td className="py-4 px-4 text-gray-500">{p.base}</td>
                      <td className="py-4 px-4 text-gray-700">{p.sell}</td>
                      <td className="py-4 px-4 font-bold text-green-600">{p.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section className="px-6 md:px-8 py-16 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="editorial-headline text-3xl font-extrabold text-gray-900 mb-2">Shipping Rates</h2>
            <p className="text-gray-500 mb-8">Competitive shipping rates worldwide. Bangladesh gets priority delivery.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Standard</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Express</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Delivery Time</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING.map((s) => (
                    <tr key={s.region} className="border-b border-gray-100 hover:bg-white transition-colors">
                      <td className="py-4 px-4 font-semibold text-gray-800">{s.region}</td>
                      <td className="py-4 px-4 text-gray-600">{s.standard}</td>
                      <td className="py-4 px-4 text-gray-600">{s.express}</td>
                      <td className="py-4 px-4 text-gray-500">{s.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="px-6 md:px-8 py-16">
          <div className="container mx-auto max-w-5xl">
            <h2 className="editorial-headline text-3xl font-extrabold text-gray-900 mb-2">Seller Tiers</h2>
            <p className="text-gray-500 mb-8">Sell more, unlock better rates. All tiers are free to reach.</p>
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Blue', sales: '0+', discount: '0%', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { name: 'Bronze', sales: '50+', discount: '5%', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                { name: 'Silver', sales: '200+', discount: '10%', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                { name: 'Gold', sales: '500+', discount: '15%', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { name: 'Diamond', sales: '1,000+', discount: '20%', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
                { name: 'Platinum', sales: '5,000+', discount: '25%', color: 'bg-violet-100 text-violet-700 border-violet-200' },
              ].map((t) => (
                <div key={t.name} className={`rounded-2xl p-5 border-2 ${t.color} text-center`}>
                  <div className="text-lg font-extrabold">{t.name}</div>
                  <div className="text-sm mt-1">{t.sales} sales</div>
                  <div className="text-2xl font-extrabold mt-3">{t.discount}</div>
                  <div className="text-xs mt-1 opacity-70">Base cost discount</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 bg-gradient-to-r from-violet-600 to-rose-500">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Start Earning?</h2>
            <p className="text-violet-100 mt-3">Create your free store today. No credit card required.</p>
            <Link href="/signup" className="inline-block mt-8 bg-white text-violet-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-50 transition-colors shadow-xl">
              Start Selling Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
