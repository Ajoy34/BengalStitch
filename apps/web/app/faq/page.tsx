'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import Link from 'next/link';

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { q: 'How do I create a store on BengalStitch?', a: 'Sign up for free at bengalstitch.com/signup. Enter your name, email, and choose a store name. You can also connect your own custom domain (.com, .xyz, etc.) for a branded experience. Your store will be live in under 2 minutes.' },
      { q: 'Is it really free to start?', a: 'Yes! There are absolutely no monthly fees, no listing fees, and no startup costs. You only pay the base production cost when a customer makes a purchase. The rest is your profit (minus a 7% processing fee).' },
      { q: 'Do I need design skills?', a: 'Not at all! Our AI Design Studio helps you create professional designs in minutes. You can also upload your own artwork or use our template library. No Photoshop skills required.' },
      { q: 'Can I connect my own domain?', a: 'Yes! When you sign up, you can connect your own .com domain. Your store will look like your own website, but all orders are handled by BengalStitch.' },
    ],
  },
  {
    title: 'Selling & Products',
    items: [
      { q: 'What products can I sell?', a: 'We offer 2,700+ products including t-shirts, hoodies, mugs, phone cases, tote bags, wall art, posters, hats, shoes, blankets, and more. All products are premium quality.' },
      { q: 'How do I set my prices?', a: 'You set your own retail price. The base cost is fixed (see our Pricing page), and the difference is your profit. For example, if a t-shirt base cost is $8.50 and you sell for $25, your profit is $16.50 minus processing fee.' },
      { q: 'Who handles printing and shipping?', a: 'We handle everything! When a customer places an order, we print the product with your design, package it, and ship it directly to the customer. You never touch inventory.' },
      { q: 'How long does shipping take?', a: 'Bangladesh (Dhaka): 1-2 days. Bangladesh (outside Dhaka): 2-4 days. USA: 5-10 days. Europe: 7-14 days. Rest of world: 10-21 days.' },
    ],
  },
  {
    title: 'Payments & Earnings',
    items: [
      { q: 'How do I get paid?', a: 'Choose your preferred payout method: bKash, Nagad, Rocket (Bangladesh), or Stripe, PayPal, Wise, Payoneer (international). Payouts are processed after a 7-day holding period.' },
      { q: 'What is the commission structure?', a: 'Sellers keep approximately 80% of profit. A 7% processing fee applies to your profit margin. There are no monthly fees. Affiliates earn 10% commission on referred sales.' },
      { q: 'What currencies are supported?', a: 'We support BDT (Bangladeshi Taka), USD, EUR, and GBP with automatic currency conversion. Customers see prices in their local currency.' },
      { q: 'How does the affiliate program work?', a: 'Anyone can join as an affiliate. Share product links on social media, and you earn 10% commission on every sale made through your link. No selling required — just sharing!' },
    ],
  },
  {
    title: 'Returns & Support',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days for defective, damaged, or incorrect items. Since products are custom-made, we cannot accept returns for change of mind. See our Returns page for full details.' },
      { q: 'How do I contact support?', a: 'Email us at support@bengalstitch.com, use our 24/7 live chat on the platform, or call our Bangladesh hotline. We support both English and Bangla.' },
      { q: 'What if a customer receives a defective product?', a: 'We will replace the item or issue a full refund at no cost. Just contact support with the order number and photos of the issue.' },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-800 pr-4">{q}</span>
        <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Help Center</span>
            <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">Frequently Asked Questions</h1>
            <p className="text-gray-500 mt-3">Find answers to common questions about BengalStitch</p>
          </div>

          <div className="space-y-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-green-50 rounded-3xl p-10 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900">Still have questions?</h2>
            <p className="text-gray-500 mt-2">Our support team is available 24/7</p>
            <Link href="/contact" className="inline-block mt-6 gradient-cta px-8 py-3 rounded-xl font-bold">Contact Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
