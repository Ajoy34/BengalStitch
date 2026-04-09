import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Contact Us — BengalStitch' };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Get in Touch</span>
            <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">Contact Us</h1>
            <p className="text-gray-500 mt-3">We&apos;re here to help. Reach out anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact form */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50" placeholder="Rakib" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50" placeholder="Hasan" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 text-gray-600">
                    <option>General Inquiry</option>
                    <option>Seller Support</option>
                    <option>Buyer Support</option>
                    <option>Affiliate Program</option>
                    <option>Technical Issue</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 resize-none" placeholder="How can we help you?" />
                </div>
                <button type="button" className="w-full gradient-cta py-4 rounded-xl font-bold text-lg">Send Message</button>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              {[
                { icon: '📧', title: 'Email', lines: ['General: hello@bengalstitch.com', 'Support: support@bengalstitch.com', 'Sellers: sellers@bengalstitch.com'] },
                { icon: '📞', title: 'Phone', lines: ['Bangladesh: +880-1XXX-XXXXXX', 'International: +1-XXX-XXX-XXXX', 'Hours: 9AM - 10PM BST, 7 days'] },
                { icon: '📍', title: 'Office', lines: ['BengalStitch HQ', 'Gulshan, Dhaka 1212', 'Bangladesh'] },
                { icon: '💬', title: 'Live Chat', lines: ['Available 24/7 on the platform', 'Average response time: 2 minutes', 'Support in English & Bangla'] },
              ].map((info) => (
                <div key={info.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{info.title}</h3>
                    {info.lines.map((line) => (
                      <p key={line} className="text-gray-500 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
