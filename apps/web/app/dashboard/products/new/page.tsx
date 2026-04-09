'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = ['tshirt', 'hoodie', 'mug', 'phone_case', 'poster', 'tote_bag', 'cap'];

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'tshirt',
    basePrice: '', sellPrice: '', sizes: 'S,M,L,XL',
    tags: '',
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!store) {
      alert('Please set up your store first');
      router.push('/dashboard/store');
      return;
    }

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const { error } = await supabase.from('products').insert({
      store_id: store.id,
      title: form.title,
      slug,
      description: form.description,
      category: form.category,
      base_price: parseFloat(form.basePrice) || 0,
      sell_price: parseFloat(form.sellPrice) || 0,
      sizes: form.sizes.split(',').map((s) => s.trim()),
      tags: form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      is_published: false,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/products');
    router.refresh();
  }

  const profit = (parseFloat(form.sellPrice) || 0) - (parseFloat(form.basePrice) || 0);

  return (
    <div className="max-w-2xl">
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Title</label>
            <input required value={form.title} onChange={(e) => updateField('title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="e.g. Bengal Tiger Classic Tee" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary capitalize">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Base Price (৳)</label>
              <input type="number" required min="0" step="0.01" value={form.basePrice} onChange={(e) => updateField('basePrice', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Selling Price (৳)</label>
              <input type="number" required min="0" step="0.01" value={form.sellPrice} onChange={(e) => updateField('sellPrice', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {profit > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
              <span className="text-green-700 font-semibold">Your profit: ৳ {profit.toFixed(2)}</span> per sale
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1.5">Sizes (comma-separated)</label>
            <input value={form.sizes} onChange={(e) => updateField('sizes', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. anime, funny, gaming, lifestyle"
            />
            <p className="text-xs text-gray-500 mt-2">
              Used for collections like <span className="font-semibold">Hot Trendy</span>, <span className="font-semibold">Funny</span>, <span className="font-semibold">Anime &amp; Comics</span>.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl gradient-cta font-semibold disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
