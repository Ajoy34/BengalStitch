import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const { referralCode, productId } = await request.json();
    const supabase = createAdminClient();
    const headersList = await headers();

    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!affiliate) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const ipHash = createHash('sha256').update(ip + referralCode).digest('hex');

    const { data: existing } = await supabase
      .from('affiliate_clicks')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single();

    if (!existing) {
      await supabase.from('affiliate_clicks').insert({
        affiliate_id: affiliate.id,
        product_id: productId || null,
        ip_hash: ipHash,
      });
    }

    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
