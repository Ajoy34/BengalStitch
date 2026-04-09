import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Terms of Service — BengalStitch' };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Legal</span>
            <h1 className="editorial-headline text-4xl font-extrabold text-gray-900 mt-3">Terms of Service</h1>
            <p className="text-gray-400 mt-2 text-sm">Last updated: April 1, 2026</p>
          </div>
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">By accessing or using BengalStitch (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services. These terms apply to all users including sellers, buyers, and affiliates.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">2. Account Registration</h2>
              <p className="text-gray-600 leading-relaxed">To use certain features, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your credentials. You must be at least 18 years old or have parental consent to create an account. One person may not maintain multiple accounts.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">3. Seller Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed">Sellers must: upload only original designs or designs they have rights to use; not infringe on intellectual property, trademarks, or copyrights; set fair and accurate pricing; respond to customer inquiries in a timely manner; comply with all applicable laws in their jurisdiction. BengalStitch reserves the right to remove any product that violates these terms.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">4. Buyer Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed">Buyers must provide accurate shipping information. All sales are processed through BengalStitch. Buyers agree to the return and refund policy outlined separately. Buyers must not use purchased products for unauthorized commercial reproduction.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">5. Commission &amp; Payments</h2>
              <p className="text-gray-600 leading-relaxed">BengalStitch operates on a commission model. The platform retains a percentage of each sale as outlined in the Pricing page. Sellers receive payouts via their chosen method (bKash, Nagad, Stripe, PayPal) after a 7-day holding period. Affiliates earn 10% commission on referred sales, paid out monthly. A 7% processing fee applies to profits.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">6. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">Sellers retain ownership of their original designs. By uploading content, sellers grant BengalStitch a non-exclusive license to display, promote, and sell products featuring their designs. The BengalStitch name, logo, and platform design are proprietary and may not be used without permission.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">7. Prohibited Content</h2>
              <p className="text-gray-600 leading-relaxed">The following content is strictly prohibited: hate speech or discrimination; explicit adult content; counterfeit or trademarked designs without authorization; content promoting violence or illegal activities; misleading or fraudulent product descriptions.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">8. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">BengalStitch provides the platform &quot;as is&quot; and is not liable for: product quality issues from manufacturing partners; shipping delays by third-party carriers; losses due to unauthorized account access; indirect or consequential damages arising from platform use.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">9. Termination</h2>
              <p className="text-gray-600 leading-relaxed">BengalStitch may suspend or terminate accounts that violate these terms. Users may delete their accounts at any time. Upon termination, pending payouts will be processed within 30 days, and remaining obligations survive termination.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">10. Contact</h2>
              <p className="text-gray-600 leading-relaxed">For questions about these terms, contact us at <strong>legal@bengalstitch.com</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
