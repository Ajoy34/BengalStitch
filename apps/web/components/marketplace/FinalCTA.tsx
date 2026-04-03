import Link from 'next/link';

const PERKS = [
  { icon: '🌍', label: 'Worldwide Shipping' },
  { icon: '📦', label: 'No Inventory' },
  { icon: '🎨', label: 'Free to Design' },
  { icon: '↩️', label: 'Returns Guarantee' },
];

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* CTA block */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-rose-600 py-24 px-6 md:px-8">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Get Started with BengalStitch Today
          </h2>
          <p className="text-violet-100 text-lg mt-6 max-w-2xl mx-auto">
            Join thousands of creators earning from their designs.
            Zero startup costs, full support, and payouts via bKash, Nagad, Stripe &amp; more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              href="/signup"
              className="bg-white text-violet-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-50 transition-colors shadow-xl shadow-purple-900/20"
            >
              Sign Up Free
            </Link>
            <Link
              href="/signup?role=affiliate"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Join as Affiliate
            </Link>
          </div>
          <p className="text-violet-200 text-sm mt-6">
            Have any questions?{' '}
            <Link href="/contact" className="underline text-white hover:text-violet-100">
              Contact us
            </Link>
          </p>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/30 rounded-full blur-3xl" />
      </div>

      {/* Perks bar */}
      <div className="bg-gray-900 py-6 px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {PERKS.map((perk) => (
              <div key={perk.label} className="flex items-center gap-2 text-gray-300">
                <span className="text-xl">{perk.icon}</span>
                <span className="font-semibold text-sm">{perk.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
