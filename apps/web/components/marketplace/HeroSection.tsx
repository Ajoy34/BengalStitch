'use client';

import Link from 'next/link';
import Image from 'next/image';

const HERO_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA',
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-2 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-violet-700">
                No Startup Costs &bull; Free to Join
              </span>
            </div>

            <h1 className="editorial-headline text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900">
              Your One-Stop Solution for{' '}
              <span className="gradient-text">Print-on-Demand</span>{' '}
              Success!
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Create, sell, and ship custom products worldwide with ease —
              all you need in one place. Connect your own domain, share links &amp; earn commissions.
            </p>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              {['No Startup Costs', 'Top-Quality Products', 'Easy-to-Use Platform'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/signup"
                className="gradient-cta px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2"
              >
                Start Selling
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-700 transition-all inline-flex items-center gap-2"
              >
                Browse Products
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white ${
                    ['bg-violet-400', 'bg-rose-400', 'bg-cyan-400', 'bg-amber-400'][i-1]
                  } flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">8,000+ Sellers</div>
                <div className="text-xs text-gray-500">Trusted worldwide</div>
              </div>
            </div>
          </div>

          {/* Right - product showcase */}
          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-violet-200/40 via-transparent to-rose-200/40 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {HERO_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                    i % 2 !== 0 ? 'mt-8' : ''
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Product showcase ${i + 1}`}
                    width={350}
                    height={350}
                    priority={i < 2}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 22.5C1248 25 1344 40 1392 47.5L1440 55V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
