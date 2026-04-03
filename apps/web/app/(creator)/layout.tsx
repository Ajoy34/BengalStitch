'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SIDEBAR_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/products', label: 'Products', icon: '📦' },
  { href: '/orders', label: 'Orders', icon: '🛒' },
  { href: '/studio', label: 'Design Studio', icon: '🎨' },
  { href: '/earnings', label: 'Earnings', icon: '💰' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/affiliates', label: 'Affiliates', icon: '🔗' },
  { href: '/store-settings', label: 'Store Settings', icon: '⚙️' },
  { href: '/payment-setup', label: 'Payment Setup', icon: '💳' },
];

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container-low p-6 gap-2 sticky top-0 h-screen">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-primary font-[family-name:var(--font-headline)] mb-8"
        >
          AmarPOD
        </Link>

        <nav className="flex-1 space-y-1">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 bg-gradient-to-br from-tertiary-container/30 to-surface-container rounded-2xl">
          <p className="text-sm font-bold mb-1">Go Pro</p>
          <p className="text-xs text-on-surface-variant mb-3">
            Unlock unlimited products and AI credits.
          </p>
          <Link
            href="/pricing"
            className="block text-center text-xs font-bold gradient-cta text-on-primary px-4 py-2 rounded-lg"
          >
            Upgrade
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
