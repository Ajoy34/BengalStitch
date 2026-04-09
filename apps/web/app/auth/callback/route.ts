import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl, safeAuthRedirect } from '@/lib/supabase/env';

/**
 * OAuth / magic-link callback. Session cookies MUST be set on the redirect
 * response (not a bare NextResponse.next), or the browser never stores the session.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  const redirectTo = safeAuthRedirect(url.searchParams.get('redirect'), '/dashboard');

  if (code) {
    const response = NextResponse.redirect(new URL(redirectTo, url.origin));

    const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('auth/callback exchangeCodeForSession:', error.message);
      const login = new URL('/login', url.origin);
      login.searchParams.set('error', 'auth_callback');
      login.searchParams.set('message', error.message);
      return NextResponse.redirect(login);
    }

    return response;
  }

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
