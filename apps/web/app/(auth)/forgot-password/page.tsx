'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface-dim">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl card-shadow">
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold font-[family-name:var(--font-headline)]">
            <span className="gradient-text">BengalStitch</span>
          </Link>
          <h1 className="editorial-headline text-2xl font-bold mt-6">Reset your password</h1>
          <p className="text-on-surface-variant mt-2">
            {sent
              ? 'Check your email for a reset link'
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-error text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {sent ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-success-container rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-on-surface-variant">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Check your inbox and spam folder.
            </p>
            <Link href="/login" className="inline-block text-primary font-semibold hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta py-3.5 rounded-xl font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {!sent && (
          <p className="text-center text-sm text-on-surface-variant">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
