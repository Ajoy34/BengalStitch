import Image from 'next/image';
import Link from 'next/link';

const FEATURES = [
  {
    icon: '🌐',
    title: 'Your Own Domain',
    description: 'Sign up with your .com domain. Your storefront looks like your own website.',
    color: 'bg-primary-container text-primary',
  },
  {
    icon: '🔗',
    title: 'Share & Earn',
    description: 'Anyone can share any product link and earn 10% commission on every sale.',
    color: 'bg-secondary-container text-secondary',
  },
  {
    icon: '💳',
    title: 'BD + Global Payments',
    description: 'bKash, Nagad, SSLCommerz for Bangladesh. Stripe, PayPal for global customers.',
    color: 'bg-accent-container text-accent',
  },
  {
    icon: '🤖',
    title: 'AI Design Studio',
    description: 'Generate designs with AI, remove backgrounds, upscale images. Create in minutes.',
    color: 'bg-tertiary-container text-tertiary',
  },
  {
    icon: '👕',
    title: '3D Product Preview',
    description: 'Interactive 3D mockups, avatar try-on, and 360° product views.',
    color: 'bg-success-container text-success',
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    description: 'Track views, sales, conversions, and earnings in a beautiful dashboard.',
    color: 'bg-warning-container text-warning',
  },
];

export function TrendingCreations() {
  return (
    <section className="py-24 px-6 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-accent uppercase tracking-wider">Why BengalStitch</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold mt-4 mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            From custom domains to AI design tools, we give you the complete toolkit
            to build a profitable print-on-demand business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-2xl border border-outline/20 hover:border-transparent hover:card-shadow-hover transition-all duration-300 group bg-white"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-on-surface">{feature.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Affiliate Banner */}
        <div className="mt-16 rounded-3xl overflow-hidden gradient-bg p-10 md:p-16 text-white relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="editorial-headline text-3xl md:text-4xl font-extrabold mb-4">
                Share Links. Earn Money.
              </h3>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                No need to create products. Just sign up, share any product link on
                social media, and earn <strong>10% commission</strong> on every sale
                generated through your link.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-white text-primary font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Become an Affiliate
              </Link>
            </div>
            <div className="text-center">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <div className="text-6xl font-extrabold">10%</div>
                <div className="text-white/80 mt-2">Per Sale Commission</div>
                <div className="mt-4 text-sm text-white/60">
                  Paid out via bKash, Nagad, or PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
