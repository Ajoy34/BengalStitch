import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

interface EmailRequest {
  to: string;
  template: 'order_confirmation' | 'shipping_update' | 'payout_processed' | 'welcome';
  data: Record<string, string | number>;
}

const TEMPLATES: Record<string, (data: Record<string, string | number>) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: 'Welcome to BengalStitch!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#6c3ce9;">Welcome to BengalStitch!</h1>
        <p>Hi ${data.name},</p>
        <p>Your account has been created successfully. Start exploring unique Bangladeshi designs or set up your own store.</p>
        <a href="${data.appUrl}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6c3ce9,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Go to Dashboard</a>
      </div>
    `,
  }),

  order_confirmation: (data) => ({
    subject: `Order Confirmed - #${String(data.orderId).slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#6c3ce9;">Order Confirmed!</h1>
        <p>Hi ${data.buyerName},</p>
        <p>Your order has been placed successfully.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin:20px 0;">
          <p><strong>Order ID:</strong> ${String(data.orderId).slice(0, 8).toUpperCase()}</p>
          <p><strong>Total:</strong> ৳ ${data.total}</p>
        </div>
        <a href="${data.appUrl}/track/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,#6c3ce9,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Track Your Order</a>
      </div>
    `,
  }),

  shipping_update: (data) => ({
    subject: `Your order has been shipped! - #${String(data.orderId).slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#6c3ce9;">Your Order is On Its Way!</h1>
        <p>Hi ${data.buyerName},</p>
        <p>Great news! Your order has been shipped.</p>
        <div style="background:#f8f9fa;padding:20px;border-radius:12px;margin:20px 0;">
          <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
        </div>
        <a href="${data.appUrl}/track/${data.orderId}" style="display:inline-block;background:linear-gradient(135deg,#6c3ce9,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Track Shipment</a>
      </div>
    `,
  }),

  payout_processed: (data) => ({
    subject: 'Payout Processed - BengalStitch',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="color:#6c3ce9;">Payout Processed</h1>
        <p>Hi ${data.name},</p>
        <p>Your payout of <strong>৳ ${data.amount}</strong> has been processed via ${data.method}.</p>
        <p>The funds should arrive in your account shortly.</p>
      </div>
    `,
  }),
};

export async function POST(request: Request) {
  try {
    const { to, template, data } = (await request.json()) as EmailRequest;

    if (!TEMPLATES[template]) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
    }

    const { subject, html } = TEMPLATES[template](data);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: 'BengalStitch <noreply@bengalstitch.com>',
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
