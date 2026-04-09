import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user?.id || '')
    .single();

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store?.id || '');

  const { data: orders } = await supabase
    .from('orders')
    .select('total, order_status, created_at')
    .eq('seller_id', user?.id || '');

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = (orders || []).filter((o) => o.order_status === 'pending').length;
  const todayOrders = (orders || []).filter((o) => {
    const d = new Date(o.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const stats = [
    { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, color: 'from-violet-500 to-purple-600' },
    { label: 'Products', value: productCount || 0, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending Orders', value: pendingOrders, color: 'from-amber-500 to-orange-500' },
    { label: 'Orders Today', value: todayOrders, color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="editorial-headline text-3xl font-extrabold text-gray-900">
          Welcome back{profile?.name ? `, ${profile.name}` : ''}
        </h1>
        <p className="text-gray-500 mt-1">
          {store ? `Store: ${store.store_name}` : 'Set up your store to start selling'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-extrabold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {(orders || []).slice(0, 5).map((order, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium">৳ {Number(order.total).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.order_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {order.order_status}
              </span>
            </div>
          ))}
          {(!orders || orders.length === 0) && (
            <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
