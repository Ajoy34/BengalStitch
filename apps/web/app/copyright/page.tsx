import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Copyright Notice — BengalStitch' };

export default function CopyrightPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Legal</span>
            <h1 className="editorial-headline text-4xl font-extrabold text-gray-900 mt-3">Copyright Notice</h1>
            <p className="text-gray-400 mt-2 text-sm">Last updated: April 1, 2026</p>
          </div>
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900">Intellectual Property Rights</h2>
              <p className="text-gray-600 leading-relaxed">All content on BengalStitch — including the platform design, logos, graphics, software, and text — is the property of BengalStitch or its content creators and is protected by international copyright laws. Product designs uploaded by sellers remain the intellectual property of the respective creators.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">DMCA / Copyright Infringement</h2>
              <p className="text-gray-600 leading-relaxed">BengalStitch respects intellectual property rights and expects sellers to do the same. If you believe your copyrighted work has been used on our platform without authorization, please submit a takedown notice to <strong>copyright@bengalstitch.com</strong> including: a description of the copyrighted work; the URL of the infringing content; your contact information; a statement of good faith belief; your signature (electronic or physical).</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">Counter-Notice</h2>
              <p className="text-gray-600 leading-relaxed">If you believe your content was wrongfully removed due to a copyright claim, you may submit a counter-notice. The content will be restored within 10-14 business days unless the original complainant files legal action.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">Repeat Infringers</h2>
              <p className="text-gray-600 leading-relaxed">Accounts with repeated copyright violations will be permanently terminated. BengalStitch maintains a three-strike policy: first offense results in content removal and warning; second offense triggers a 30-day account suspension; third offense leads to permanent account termination.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900">Permitted Use</h2>
              <p className="text-gray-600 leading-relaxed">You may not reproduce, distribute, or create derivative works from BengalStitch platform content without express written permission. Product images may be shared on social media for promotional purposes by authorized sellers and affiliates only.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
