import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Privacy Policy — BengalStitch' };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Legal</span>
            <h1 className="editorial-headline text-4xl font-extrabold text-gray-900 mt-3">Privacy Policy</h1>
            <p className="text-gray-400 mt-2 text-sm">Last updated: April 1, 2026</p>
          </div>
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">We collect information you provide directly when creating an account, making purchases, or contacting support. This includes your name, email address, phone number, shipping address, and payment information. We also collect usage data such as pages visited, products viewed, and interaction patterns to improve our platform.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">Your information is used to: process orders and payments; manage your seller/buyer account; send order confirmations and shipping updates; provide customer support; improve our platform and services; send marketing communications (with your consent); prevent fraud and ensure platform security; comply with legal obligations.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">3. Payment Information</h2>
              <p className="text-gray-600 leading-relaxed">Payment processing is handled by secure third-party providers including bKash, Nagad, SSLCommerz, Stripe, and PayPal. We do not store complete credit card numbers or mobile banking PINs on our servers. All payment data is encrypted using industry-standard TLS/SSL protocols.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Data Sharing</h2>
              <p className="text-gray-600 leading-relaxed">We share your information only with: payment processors to complete transactions; shipping partners to deliver orders; cloud service providers who host our platform; analytics services to improve user experience. We never sell your personal data to third parties for marketing purposes.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">5. Cookies &amp; Tracking</h2>
              <p className="text-gray-600 leading-relaxed">We use cookies and similar technologies to maintain your session, remember preferences, and analyze traffic. You can control cookie settings through your browser. Essential cookies are required for the platform to function properly.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">6. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">We implement robust security measures including encryption at rest and in transit, regular security audits, access controls, and DDoS protection. However, no method of electronic transmission is 100% secure, and we cannot guarantee absolute security.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">7. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">You have the right to: access your personal data; request correction of inaccurate data; request deletion of your account and data; opt out of marketing communications; export your data in a portable format. To exercise these rights, contact us at privacy@bengalstitch.com.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">8. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">For privacy-related inquiries, reach us at <strong>privacy@bengalstitch.com</strong> or write to: BengalStitch Privacy Team, Dhaka, Bangladesh.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
