import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Returns & Refunds — BengalStitch' };

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Policy</span>
            <h1 className="editorial-headline text-4xl font-extrabold text-gray-900 mt-3">Returns &amp; Refunds</h1>
            <p className="text-gray-400 mt-2 text-sm">Last updated: April 1, 2026</p>
          </div>
          <div className="space-y-8">
            {[
              { title: 'Our Guarantee', text: 'We stand behind the quality of every product. If you receive a defective, damaged, or incorrect item, we will replace it or issue a full refund at no additional cost to you.' },
              { title: 'Eligibility', text: 'Returns are accepted within 30 days of delivery for: defective or damaged products; wrong item received; print quality issues; significantly different from product listing. Since products are custom-made, we cannot accept returns for change of mind, incorrect size selection, or color variations due to screen display differences.' },
              { title: 'How to Request a Return', text: 'Contact our support team at support@bengalstitch.com with your order number and photos of the issue. Our team will review your request within 24 hours and provide instructions. For Bangladesh orders, call our hotline at +880-1XXX-XXXXXX.' },
              { title: 'Refund Process', text: 'Approved refunds are processed within 5-7 business days. Refunds are issued to the original payment method: bKash/Nagad — refunded to your mobile wallet within 1-3 business days; Credit/Debit Card (via SSLCommerz/Stripe) — 5-10 business days; PayPal — 3-5 business days.' },
              { title: 'Replacements', text: 'If you prefer a replacement over a refund, we will ship a new item at no cost. Replacement orders are prioritized and typically ship within 2-3 business days.' },
              { title: 'Shipping Costs', text: 'Return shipping costs are covered by BengalStitch for defective or incorrect items. For international returns, we provide a prepaid shipping label. Do not ship returns without contacting us first.' },
              { title: 'Seller Responsibility', text: 'Sellers are responsible for ensuring product descriptions and mockups accurately represent the final product. Repeated quality issues may result in account review.' },
            ].map((s) => (
              <section key={s.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed mt-2">{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
