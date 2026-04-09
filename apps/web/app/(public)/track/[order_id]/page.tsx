import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Props {
  params: Promise<{ order_id: string }>;
}

const STATUS_STEPS = ['pending', 'confirmed', 'printing', 'shipped', 'delivered'];

export const metadata = { title: 'Track Order' };

export default async function TrackOrderPage({ params }: Props) {
  const { order_id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from('orders').select('*').eq('id', order_id).single();

  const currentIndex = order ? STATUS_STEPS.indexOf(order.order_status) : -1;

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-2xl">
          <h1 className="editorial-headline text-3xl font-extrabold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500 text-sm mb-8">Order ID: {order_id.slice(0, 8).toUpperCase()}</p>

          {!order ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-gray-400">Order not found</p>
              <Link href="/marketplace" className="text-primary font-semibold mt-4 inline-block hover:underline">
                Browse marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="relative">
                  {STATUS_STEPS.map((step, i) => {
                    const isCompleted = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div key={step} className="flex items-start gap-4 relative">
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`absolute left-[15px] top-8 w-0.5 h-12 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
                        )}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        <div className={`pb-10 ${isCurrent ? '' : ''}`}>
                          <p className={`font-semibold capitalize ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {step === 'pending' && 'Order placed, awaiting confirmation'}
                            {step === 'confirmed' && 'Order confirmed by seller'}
                            {step === 'printing' && 'Your product is being printed'}
                            {step === 'shipped' && 'Package is on its way'}
                            {step === 'delivered' && 'Package delivered successfully'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order details */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                <h2 className="font-bold">Order Details</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Name:</span> {order.buyer_name}</div>
                  <div><span className="text-gray-500">Phone:</span> {order.buyer_phone || 'N/A'}</div>
                  <div><span className="text-gray-500">Total:</span> ৳ {Number(order.total).toLocaleString()}</div>
                  <div><span className="text-gray-500">Payment:</span> <span className="capitalize">{order.payment_method || 'N/A'}</span></div>
                </div>
                {order.tracking_number && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm"><span className="text-gray-500">Tracking:</span> {order.tracking_number}</p>
                    {order.tracking_url && (
                      <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-semibold hover:underline">
                        Track on courier site
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
