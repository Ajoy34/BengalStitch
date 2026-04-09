/**
 * Shared Supabase public env (browser + server).
 * Supports legacy/alternate Vercel var names some projects use by mistake.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL. Add it in apps/web/.env.local and Vercel project settings.',
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim();
  if (!key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase anon/public JWT). ' +
        'Optional fallback: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.',
    );
  }
  return key;
}

/** Prevent open redirects: only same-site relative paths. */
export function safeAuthRedirect(path: string | null | undefined, fallback = '/dashboard'): string {
  if (!path || typeof path !== 'string') return fallback;
  const p = path.trim();
  if (!p.startsWith('/') || p.startsWith('//')) return fallback;
  return p;
}
