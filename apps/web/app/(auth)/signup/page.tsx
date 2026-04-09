'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type RoleTab = 'seller' | 'affiliate' | 'buyer';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<RoleTab>('seller');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          name: fullName,
          role,
          store_name: role === 'seller' ? storeName : undefined,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="text-3xl font-extrabold font-[family-name:var(--font-headline)]">
              <span className="gradient-text">BengalStitch</span>
            </Link>
            <h1 className="editorial-headline text-3xl font-extrabold mt-6">Create your account</h1>
            <p className="text-on-surface-variant mt-2">Start selling or earning in under 5 minutes</p>
          </div>

          <div className="flex bg-surface-container rounded-xl p-1 gap-1">
            {(['seller', 'affiliate', 'buyer'] as RoleTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setRole(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                  role === tab ? 'gradient-cta text-white' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-error-container text-error text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white border border-outline/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-outline/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {role === 'seller' && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="My Awesome Store"
                  className="w-full bg-white border border-outline/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-white border border-outline/40 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta py-3.5 rounded-xl font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : role === 'seller' ? 'Create Free Store' : 'Create Account'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline/30" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-on-surface-variant">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full border border-outline/40 py-3 rounded-xl font-medium hover:border-primary/40 transition-colors flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 blob-shape blur-2xl" />
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="text-6xl mb-6">
            {role === 'seller' ? '🚀' : role === 'affiliate' ? '💰' : '🛍️'}
          </div>
          <h2 className="editorial-headline text-4xl font-extrabold mb-4">
            {role === 'seller' && 'Your brand, your domain, your profit'}
            {role === 'affiliate' && 'Share links, earn commissions'}
            {role === 'buyer' && 'Discover unique Bangladeshi designs'}
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            {role === 'seller' && 'Set up your storefront on your own .com domain. Customers see your brand — we handle everything behind the scenes.'}
            {role === 'affiliate' && 'Earn 10% commission on every sale you refer. No inventory, no risk. Just share and earn.'}
            {role === 'buyer' && 'Browse thousands of unique custom products from Bangladeshi creators. Virtual try-on, fast delivery, easy payments.'}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-extrabold">80%</div>
              <div className="text-xs text-white/70">Profit Share</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-extrabold">10%</div>
              <div className="text-xs text-white/70">Affiliate Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-extrabold">0</div>
              <div className="text-xs text-white/70">Monthly Fees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
