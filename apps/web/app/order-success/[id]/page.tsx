import { Header } from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: 'Order Confirmed' };

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single();

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto bg-success-container rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h1 className="editorial-headline text-3xl font-extrabold text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-500 mt-2">Thank you for your purchase</p>
          </div>

          {order && (
            <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-xs">{order.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">৳ {Number(order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full capitalize">{order.order_status}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link href={`/track/${id}`} className="gradient-cta py-3 rounded-xl font-bold text-center">
              Track Your Order
            </Link>
            <Link href="/marketplace" className="text-primary font-semibold hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
