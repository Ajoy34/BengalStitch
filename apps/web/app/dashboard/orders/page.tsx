import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Orders' };

export default async function DashboardOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('seller_id', user?.id || '')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Orders</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-bold">{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.buyer_name}</p>
                    <p className="text-xs text-gray-400">{order.buyer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">৳ {Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.order_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!orders || orders.length === 0) && (
          <div className="p-12 text-center text-gray-400 text-sm">No orders yet</div>
        )}
      </div>
    </div>
  );
}
