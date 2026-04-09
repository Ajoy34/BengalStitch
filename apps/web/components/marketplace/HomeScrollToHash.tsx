'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

/** After navigating to `/` with a hash (e.g. `/#how-it-works`), scroll to the target — Next App Router often skips this. */
export function HomeScrollToHash() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== '/') return;
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [pathname]);

  return null;
}
