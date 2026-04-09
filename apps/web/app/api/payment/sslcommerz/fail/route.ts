import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const formData = await request.formData();
  const tranId = formData.get('tran_id') as string;

  if (tranId) {
    const supabase = createAdminClient();
    await supabase
      .from('orders')
      .update({ payment_status: 'failed' })
      .eq('id', tranId);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(`${appUrl}/checkout?error=payment_failed`);
}
