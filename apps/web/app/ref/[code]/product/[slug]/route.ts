import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string; slug: string }> }
) {
  const { code, slug } = await params;
  const supabase = createAdminClient();
  const headersList = await headers();

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('id')
    .eq('referral_code', code)
    .single();

  if (affiliate) {
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const ipHash = createHash('sha256').update(ip + code).digest('hex');

    const { data: existingClick } = await supabase
      .from('affiliate_clicks')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single();

    if (!existingClick) {
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single();

      await supabase.from('affiliate_clicks').insert({
        affiliate_id: affiliate.id,
        product_id: product?.id || null,
        ip_hash: ipHash,
      });

      await supabase.rpc('increment_affiliate_clicks', { aff_id: affiliate.id })
        .then(null, () => {
          // RPC may not exist yet; fall back to manual increment
          return supabase
            .from('affiliates')
            .update({ total_clicks: (affiliate as unknown as { total_clicks: number }).total_clicks + 1 })
            .eq('id', affiliate.id);
        });
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const response = NextResponse.redirect(`${appUrl}/product/${slug}`);

  // 30-day affiliate cookie
  response.cookies.set('ref', code, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}
