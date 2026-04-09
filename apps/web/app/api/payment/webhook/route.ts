import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');

  if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      const stripe = (await import('stripe')).default;
      const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
      const body = await request.text();
      const event = stripeClient.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const supabase = createAdminClient();
          await supabase
            .from('orders')
            .update({
              payment_status: 'completed',
              payment_ref: session.payment_intent as string,
              order_status: 'confirmed',
            })
            .eq('id', orderId);
        }
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err);
      return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
    }
  }

  return NextResponse.json({ error: 'No signature' }, { status: 400 });
}
