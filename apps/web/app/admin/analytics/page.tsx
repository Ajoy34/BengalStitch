import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Platform Analytics' };

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase.from('orders').select('total, order_status, payment_method, created_at').order('created_at', { ascending: false }).limit(500);
  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);

  const byStatus: Record<string, number> = {};
  (orders || []).forEach((o) => { byStatus[o.order_status] = (byStatus[o.order_status] || 0) + 1; });

  const byPayment: Record<string, number> = {};
  (orders || []).forEach((o) => { if (o.payment_method) byPayment[o.payment_method] = (byPayment[o.payment_method] || 0) + 1; });

  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayStr = date.toDateString();
    const dayRevenue = (orders || []).filter((o) => new Date(o.created_at).toDateString() === dayStr).reduce((sum, o) => sum + Number(o.total), 0);
    return { label: date.getDate().toString(), revenue: dayRevenue };
  });
  const maxDayRevenue = Math.max(...last30Days.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Platform Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
          <p className="text-3xl font-extrabold gradient-text mt-1">৳ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase">Total Users</p>
          <p className="text-3xl font-extrabold mt-1">{userCount || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase">Total Orders</p>
          <p className="text-3xl font-extrabold mt-1">{(orders || []).length}</p>
        </div>
      </div>

      {/* 30-day revenue */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <h2 className="font-bold mb-4">Revenue (Last 30 Days)</h2>
        <div className="flex items-end gap-1 h-32">
          {last30Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-violet-500 to-violet-300 rounded-t transition-all"
                style={{ height: `${(day.revenue / maxDayRevenue) * 100}%`, minHeight: '1px' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">30 days ago</span>
          <span className="text-xs text-gray-400">Today</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold mb-4">Order Status Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-600">{status}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
            {Object.keys(byStatus).length === 0 && <p className="text-gray-400 text-sm">No data</p>}
          </div>
        </div>

        {/* Payment method breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {Object.entries(byPayment).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-600">{method}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
            {Object.keys(byPayment).length === 0 && <p className="text-gray-400 text-sm">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
