'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const PRODUCT_CATEGORIES = [
  {
    group: 'Best-sellers',
    items: [
      { href: '/marketplace?cat=summer', label: 'Best for Summer' },
      { href: '/marketplace?cat=trending', label: 'Trending Now' },
      { href: '/marketplace?cat=new', label: 'New Arrivals' },
    ],
  },
  {
    group: 'Apparel',
    items: [
      { href: '/marketplace?cat=tshirts', label: 'Unisex T-Shirts' },
      { href: '/marketplace?cat=hoodies', label: 'Hoodies & Sweatshirts' },
      { href: '/marketplace?cat=womens', label: "Women's Clothing" },
      { href: '/marketplace?cat=kids', label: "Kids & Baby" },
    ],
  },
  {
    group: 'Home & Living',
    items: [
      { href: '/marketplace?cat=mugs', label: 'Mugs & Tumblers' },
      { href: '/marketplace?cat=blankets', label: 'Blankets & Pillows' },
      { href: '/marketplace?cat=wallart', label: 'Wall Art & Posters' },
      { href: '/marketplace?cat=bathroom', label: 'Bathroom' },
    ],
  },
  {
    group: 'Accessories',
    items: [
      { href: '/marketplace?cat=phonecases', label: 'Phone Cases' },
      { href: '/marketplace?cat=bags', label: 'Bags & Totes' },
      { href: '/marketplace?cat=hats', label: 'Hats & Caps' },
      { href: '/marketplace?cat=stickers', label: 'Stickers' },
    ],
  },
];

const NAV_LINKS = [
  { href: '/marketplace', label: 'Products', hasMega: true },
  { href: '#how-it-works', label: 'How It Works', hasMega: false },
  { href: '/pricing', label: 'Pricing', hasMega: false },
  { href: '/blog', label: 'Resources', hasMega: false },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (megaTimeout.current) clearTimeout(megaTimeout.current);
    };
  }, []);

  const handleMegaEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-violet-600 to-rose-500 text-white text-center py-2 px-4 text-xs font-semibold">
        Start your store for FREE — No startup costs, no inventory!{' '}
        <Link href="/signup" className="underline ml-1">Get Started &rarr;</Link>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight font-[family-name:var(--font-headline)]"
          >
            <span className="gradient-text">AmarPOD</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.hasMega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                  ref={megaRef}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-violet-600 font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-violet-50"
                  >
                    {link.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[650px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-4 gap-6">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <div key={cat.group}>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{cat.group}</h4>
                          <ul className="space-y-2">
                            {cat.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
                                  onClick={() => setMegaOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="col-span-4 mt-2 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <Link href="/marketplace" className="text-sm font-bold text-violet-600 hover:underline">
                          View All Products &rarr;
                        </Link>
                        <Link href="/signup" className="text-sm font-bold gradient-cta px-4 py-2 rounded-lg">
                          Start Selling Free
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-violet-600 font-medium text-sm transition-colors px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <button className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-violet-600 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="gradient-cta px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-6 shadow-xl">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-violet-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-100 my-2" />
              <div className="space-y-3 pt-2">
                <Link href="/login" className="block text-center py-3 rounded-xl font-semibold text-violet-600 border border-violet-200 hover:bg-violet-50">Sign In</Link>
                <Link href="/signup" className="block text-center gradient-cta py-3 rounded-xl font-bold text-white">Sign Up Free</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
