import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyer, items, subtotal, shipping, total, paymentMethod } = body;

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_name: buyer.name,
        buyer_email: buyer.email,
        buyer_phone: buyer.phone,
        shipping_address: {
          address: buyer.address,
          city: buyer.city,
          district: buyer.district,
          postal_code: buyer.postalCode,
        },
        products: items,
        subtotal,
        shipping_cost: shipping,
        total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        order_status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    if (paymentMethod === 'sslcommerz') {
      const sslRes = await initSSLCommerz(order, buyer);
      if (sslRes?.GatewayPageURL) {
        return NextResponse.json({ redirectUrl: sslRes.GatewayPageURL, orderId: order.id });
      }
    }

    if (paymentMethod === 'stripe') {
      const stripe = (await import('stripe')).default;
      const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'bdt',
            product_data: { name: `BengalStitch Order #${order.id.slice(0, 8)}` },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success/${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        metadata: { orderId: order.id },
      });
      return NextResponse.json({ redirectUrl: session.url, orderId: order.id });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

async function initSSLCommerz(
  order: { id: string; total: number },
  buyer: { name: string; email: string; phone: string; address: string; city: string }
) {
  const baseUrl = process.env.SSLCOMMERZ_BASE_URL || 'https://sandbox.sslcommerz.com';
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePass = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePass) return null;

  const params = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePass,
    total_amount: String(order.total),
    currency: 'BDT',
    tran_id: order.id,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/success`,
    fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/sslcommerz/fail`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    cus_name: buyer.name,
    cus_email: buyer.email,
    cus_phone: buyer.phone,
    cus_add1: buyer.address,
    cus_city: buyer.city,
    cus_country: 'Bangladesh',
    shipping_method: 'Courier',
    product_name: 'BengalStitch Order',
    product_category: 'Print on Demand',
    product_profile: 'general',
  });

  const res = await fetch(`${baseUrl}/gwprocess/v4`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  return res.json();
}
