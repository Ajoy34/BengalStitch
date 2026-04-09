import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Products' };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, stores(store_name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">All Products</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Store</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products || []).map((p) => {
                const img = (p.images as string[])?.[0];
                const store = p.stores as { store_name: string } | null;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {img && <Image src={img} alt={p.title} width={40} height={40} className="object-cover w-full h-full" />}
                        </div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{p.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{store?.store_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold">৳ {Number(p.sell_price).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{p.total_sold}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!products || products.length === 0) && <div className="p-12 text-center text-gray-400 text-sm">No products</div>}
      </div>
    </div>
  );
}
