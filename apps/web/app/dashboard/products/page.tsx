import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Products' };

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('user_id', user?.id || '')
    .single();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store?.id || '')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="editorial-headline text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{(products || []).length} products</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="gradient-cta px-6 py-2.5 rounded-xl text-sm font-bold"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products || []).map((p) => {
                const img = (p.images as string[])?.[0];
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {img && <Image src={img} alt={p.title} width={48} height={48} className="object-cover w-full h-full" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">৳ {Number(p.sell_price).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.total_sold}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!products || products.length === 0) && (
          <div className="p-12 text-center">
            <p className="text-gray-400">No products yet</p>
            <Link href="/dashboard/products/new" className="text-primary font-semibold text-sm mt-2 inline-block hover:underline">
              Create your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
