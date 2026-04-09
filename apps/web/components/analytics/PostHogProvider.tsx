'use client';

import { useEffect } from 'react';

export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        capture_pageleave: true,
      });
    });
  }, []);

  return null;
}
