import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Payouts' };

export default async function PayoutsPage() {
  const supabase = await createClient();
  const { data: payouts } = await supabase
    .from('payouts')
    .select('*, users(name, email)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Payout Requests</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(payouts || []).map((p) => {
                const u = p.users as { name: string; email: string } | null;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{u?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{u?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">৳ {Number(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm capitalize">{p.method}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                        p.status === 'paid' ? 'bg-green-100 text-green-700' :
                        p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        p.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!payouts || payouts.length === 0) && <div className="p-12 text-center text-gray-400 text-sm">No payouts</div>}
      </div>
    </div>
  );
}
