'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function StoreSettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    storeName: '', storeSlug: '', description: '', customDomain: '',
  });

  useEffect(() => {
    setLoading(true);
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (store) {
        setForm({
          storeName: store.store_name || '',
          storeSlug: store.store_slug || '',
          description: store.description || '',
          customDomain: store.custom_domain || '',
        });
      }
      setLoading(false);
    });
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const storeData = {
      user_id: user.id,
      store_name: form.storeName,
      store_slug: form.storeSlug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      description: form.description,
      custom_domain: form.customDomain || null,
    };

    if (existing) {
      await supabase.from('stores').update(storeData).eq('id', existing.id);
    } else {
      await supabase.from('stores').insert(storeData);
    }

    setSaving(false);
    router.refresh();
  }

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="editorial-headline text-2xl font-extrabold text-gray-900 mb-8">Store Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Store Name</label>
            <input required value={form.storeName} onChange={(e) => updateField('storeName', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Store URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">bengalstitch.com/store/</span>
              <input required value={form.storeSlug} onChange={(e) => updateField('storeSlug', e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Custom Domain <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input value={form.customDomain} onChange={(e) => updateField('customDomain', e.target.value)} placeholder="mystore.com" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="gradient-cta px-8 py-3 rounded-xl font-semibold disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
