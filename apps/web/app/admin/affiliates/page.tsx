import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Affiliates' };

export default async function AdminAffiliatesPage() {
  const supabase = await createClient();
  const { data: affiliates } = await supabase
    .from('affiliates')
    .select('*, users(name, email)')
    .order('total_earned', { ascending: false });

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Affiliate Performance</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Affiliate</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Conversions</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Earned</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(affiliates || []).map((aff) => {
                const u = aff.users as { name: string; email: string } | null;
                return (
                  <tr key={aff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{u?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{u?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">{aff.referral_code}</td>
                    <td className="px-6 py-4 text-sm">{aff.total_clicks}</td>
                    <td className="px-6 py-4 text-sm">{aff.total_conversions}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">৳ {Number(aff.total_earned).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">৳ {Number(aff.pending_payout).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!affiliates || affiliates.length === 0) && <div className="p-12 text-center text-gray-400 text-sm">No affiliates</div>}
      </div>
    </div>
  );
}
