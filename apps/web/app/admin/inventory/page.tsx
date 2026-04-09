import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inventory' };

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: inventory } = await supabase
    .from('inventory')
    .select('*, products(title)')
    .order('stock_quantity', { ascending: true });

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Inventory</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Variant</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Alert Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(inventory || []).map((item) => {
                const product = item.products as { title: string } | null;
                const isLow = item.stock_quantity <= item.low_stock_alert;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{product?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{item.variant}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{item.stock_quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.low_stock_alert}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        item.stock_quantity === 0 ? 'bg-red-100 text-red-700' :
                        isLow ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.stock_quantity === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!inventory || inventory.length === 0) && <div className="p-12 text-center text-gray-400 text-sm">No inventory records</div>}
      </div>
    </div>
  );
}
