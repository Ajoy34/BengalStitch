import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Dashboard' };

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { data: allOrders } = await supabase.from('orders').select('total, order_status, created_at');
  const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true });

  const totalRevenue = (allOrders || []).reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = allOrders?.length || 0;
  const todayOrders = (allOrders || []).filter((o) => new Date(o.created_at).toDateString() === new Date().toDateString()).length;
  const pendingOrders = (allOrders || []).filter((o) => o.order_status === 'pending').length;

  const stats = [
    { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, color: 'from-green-500 to-green-600' },
    { label: 'Total Users', value: usersCount || 0, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Orders', value: totalOrders, color: 'from-emerald-500 to-green-500' },
    { label: 'Products', value: productsCount || 0, color: 'from-amber-500 to-orange-500' },
    { label: 'Stores', value: storesCount || 0, color: 'from-green-500 to-pink-500' },
    { label: 'Today Orders', value: todayOrders, color: 'from-indigo-500 to-green-500' },
    { label: 'Pending Orders', value: pendingOrders, color: 'from-yellow-500 to-amber-500' },
    { label: 'Avg. Order', value: `৳ ${totalOrders ? Math.round(totalRevenue / totalOrders) : 0}`, color: 'from-teal-500 to-emerald-500' },
  ];

  return (
    <div>
      <h1 className="editorial-headline text-3xl font-extrabold text-gray-900 mb-8">Platform Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
            <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-extrabold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(allOrders || []).slice(0, 10).map((order, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium">৳ {Number(order.total).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.order_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {order.order_status}
              </span>
            </div>
          ))}
          {(!allOrders || allOrders.length === 0) && (
            <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
