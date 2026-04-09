import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Analytics' };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('total, order_status, created_at')
    .eq('seller_id', user?.id || '')
    .order('created_at', { ascending: false })
    .limit(100);

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = (orders || []).length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const conversionRate = totalOrders > 0 ? ((orders || []).filter((o) => o.order_status === 'delivered').length / totalOrders * 100).toFixed(1) : '0';

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toDateString();
    const dayOrders = (orders || []).filter((o) => new Date(o.created_at).toDateString() === dayStr);
    return {
      label: date.toLocaleDateString('en', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
      count: dayOrders.length,
    };
  });

  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}` },
          { label: 'Total Orders', value: totalOrders },
          { label: 'Avg. Order Value', value: `৳ ${avgOrderValue.toFixed(0)}` },
          { label: 'Delivery Rate', value: `${conversionRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart (CSS bars) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <h2 className="font-bold mb-6">Revenue (Last 7 Days)</h2>
        <div className="flex items-end gap-3 h-48">
          {last7Days.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">৳{day.revenue.toLocaleString()}</span>
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all"
                style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? '8px' : '2px' }}
              />
              <span className="text-xs text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
