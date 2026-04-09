import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Earnings' };

export default async function EarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('total, seller_profit, platform_fee, order_status, created_at')
    .eq('seller_id', user?.id || '')
    .eq('payment_status', 'completed');

  const { data: payouts } = await supabase
    .from('payouts')
    .select('*')
    .eq('user_id', user?.id || '')
    .order('created_at', { ascending: false });

  const totalEarned = (orders || []).reduce((sum, o) => sum + Number(o.seller_profit || 0), 0);
  const totalPaidOut = (payouts || []).filter((p) => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const pending = totalEarned - totalPaidOut;

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Earnings</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-2xl font-extrabold text-green-600 mt-1">৳ {totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Paid Out</p>
          <p className="text-2xl font-extrabold mt-1">৳ {totalPaidOut.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Pending Balance</p>
          <p className="text-2xl font-extrabold text-primary mt-1">৳ {pending.toLocaleString()}</p>
        </div>
      </div>

      {/* Request Payout */}
      {pending > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 border border-green-100 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Ready to withdraw?</p>
              <p className="text-sm text-gray-500">Request a payout to your bKash, Nagad, or bank account</p>
            </div>
            <button className="gradient-cta px-6 py-2.5 rounded-xl text-sm font-bold">
              Request Payout
            </button>
          </div>
        </div>
      )}

      {/* Payout history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold">Payout History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(payouts || []).map((payout) => (
            <div key={payout.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">৳ {Number(payout.amount).toLocaleString()}</p>
                <p className="text-xs text-gray-400 capitalize">{payout.method} &middot; {new Date(payout.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                payout.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {payout.status}
              </span>
            </div>
          ))}
          {(!payouts || payouts.length === 0) && (
            <div className="p-8 text-center text-gray-400 text-sm">No payouts yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
