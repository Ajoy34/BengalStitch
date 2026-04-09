'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useSupabase } from '@/components/providers/SupabaseProvider';

type Product = {
  id: string;
  title: string;
  slug: string;
  images: string[] | null;
  mockup_images: string[] | null;
  is_published: boolean;
};

type View = 'front' | 'back';

const INVENTORY_PRODUCTS: Array<{
  key: string;
  title: string;
  category: string;
  images: { front: string; back: string };
}> = [
  {
    key: 'tee',
    title: 'Unisex T‑Shirt',
    category: 'tshirt',
    images: {
      front:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
      back:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
    },
  },
  {
    key: 'hoodie',
    title: 'Hoodie',
    category: 'hoodie',
    images: {
      front:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
      back:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
    },
  },
];

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA';

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

async function composeMockup(
  baseUrl: string,
  designUrl: string,
  opts: { x: number; y: number; scale: number; rotation: number },
): Promise<Blob> {
  const [base, design] = await Promise.all([loadImage(baseUrl), loadImage(designUrl)]);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // cover base image
  const baseScale = Math.max(size / base.width, size / base.height);
  const bw = base.width * baseScale;
  const bh = base.height * baseScale;
  const bx = (size - bw) / 2;
  const by = (size - bh) / 2;
  ctx.drawImage(base, bx, by, bw, bh);

  const target = size * 0.55 * opts.scale;
  const designScale = Math.min(target / design.width, target / design.height);
  const dw = design.width * designScale;
  const dh = design.height * designScale;

  const cx = size * opts.x;
  const cy = size * opts.y;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((opts.rotation * Math.PI) / 180);
  ctx.drawImage(design, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to export image'))), 'image/png', 0.95);
  });
}

export default function StudioPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [selectedInventoryKey, setSelectedInventoryKey] = useState(INVENTORY_PRODUCTS[0].key);
  const inventory = INVENTORY_PRODUCTS.find((p) => p.key === selectedInventoryKey) || INVENTORY_PRODUCTS[0];
  const [view, setView] = useState<View>('front');

  const [posX, setPosX] = useState(0.5);
  const [posY, setPosY] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string>('');

  const selected = products.find((p) => p.id === selectedId);
  const baseImage = (selected?.images?.[view === 'front' ? 0 : 1] ||
    selected?.images?.[0] ||
    inventory.images[view] ||
    FALLBACK_IMAGE) as string;

  useEffect(() => {
    async function run() {
      setError('');
      setLoading(true);
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: store, error: storeErr } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (storeErr || !store) {
        setLoading(false);
        setError('Please set up your store first.');
        return;
      }

      const { data: items, error: prodErr } = await supabase
        .from('products')
        .select('id, title, slug, images, mockup_images, is_published')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (prodErr) {
        setError(prodErr.message);
      } else {
        setProducts((items as unknown as Product[]) || []);
        setSelectedId(((items as unknown as Product[])?.[0]?.id as string) || '');
        setStep(((items as unknown as Product[])?.length || 0) > 0 ? 'edit' : 'select');
      }

      setLoading(false);
    }

    run();
  }, [supabase, user, authLoading]);

  async function onPickDesign(file: File | null) {
    setDesignFile(file);
    setDesignPreview('');
    if (!file) return;
    const url = await toDataUrl(file);
    setDesignPreview(url);
  }

  async function createDraftFromInventory() {
    if (!user) return;
    setError('');
    setSaving(true);

    const { data: store, error: storeErr } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (storeErr || !store) {
      setError('Please set up your store first.');
      setSaving(false);
      return;
    }

    const baseSlug = inventory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const { data: inserted, error: insErr } = await supabase
      .from('products')
      .insert({
        store_id: store.id,
        title: `${inventory.title} — Custom`,
        slug,
        description: 'Customized in BengalStitch Studio',
        category: inventory.category,
        images: [inventory.images.front, inventory.images.back],
        mockup_images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [],
        is_published: false,
        base_price: 0,
        sell_price: 0,
        total_sold: 0,
      })
      .select('id, title, slug, images, mockup_images, is_published')
      .single();

    if (insErr || !inserted) {
      setError(insErr?.message || 'Failed to create draft product');
      setSaving(false);
      return;
    }

    setProducts((prev) => [inserted as unknown as Product, ...prev]);
    setSelectedId((inserted as unknown as Product).id);
    setStep('edit');
    setSaving(false);
  }

  async function saveMockup() {
    if (!selected) return;
    if (!designPreview) {
      setError('Upload a design (PNG/JPG) first.');
      return;
    }

    setError('');
    setSaving(true);

    // Ensure bucket exists (server-side, service role).
    const bucketRes = await fetch('/api/storage/ensure-bucket', { method: 'POST' });
    if (!bucketRes.ok) {
      const msg = await bucketRes.text();
      setError(msg || 'Failed to prepare storage');
      setSaving(false);
      return;
    }

    // Upload original design + composed mockup to Supabase Storage, then store public URLs in product.
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id || 'anon';
    const baseKey = `products/${selected.id}/${Date.now()}`;

    let designPublicUrl = designPreview;
    if (designFile) {
      const designPath = `${baseKey}-design-${designFile.name}`.replace(/\s+/g, '-');
      const { error: upErr } = await supabase.storage
        .from('product-assets')
        .upload(designPath, designFile, { upsert: true, contentType: designFile.type || 'image/png' });
      if (!upErr) {
        designPublicUrl = supabase.storage.from('product-assets').getPublicUrl(designPath).data.publicUrl;
      }
    }

    const mockupBlob = await composeMockup(baseImage, designPublicUrl, {
      x: posX,
      y: posY,
      scale,
      rotation,
    });
    const mockupPath = `${baseKey}-mockup.png`;
    const { error: mockErr } = await supabase.storage
      .from('product-assets')
      .upload(mockupPath, mockupBlob, { upsert: true, contentType: 'image/png' });
    if (mockErr) {
      setError(mockErr.message);
      setSaving(false);
      return;
    }

    const mockupPublicUrl = supabase.storage.from('product-assets').getPublicUrl(mockupPath).data.publicUrl;

    const nextMockups = Array.from(new Set([mockupPublicUrl, ...(selected.mockup_images || [])]));

    const { error: updErr } = await supabase
      .from('products')
      .update({ mockup_images: nextMockups })
      .eq('id', selected.id);

    if (updErr) {
      setError(updErr.message);
      setSaving(false);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === selected.id ? { ...p, mockup_images: nextMockups } : p)),
    );

    setSaving(false);
  }

  if (loading) {
    return <div className="text-gray-500">Loading studio…</div>;
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="editorial-headline text-2xl font-extrabold text-gray-900">Design Studio</h1>
        <p className="text-gray-600">Please sign in to access your seller studio.</p>
        <div className="flex gap-3">
          <button
            className="gradient-cta px-5 py-3 rounded-xl font-bold"
            onClick={() => {
              router.push('/login?redirect=/dashboard/studio');
            }}
          >
            Sign In
          </button>
          <Link
            href="/signup"
            className="px-5 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="editorial-headline text-2xl font-extrabold text-gray-900">Design Studio</h1>
          <p className="text-gray-500 mt-1">
            Select a base product, upload a design, place it on front/back, generate mockups, then publish.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep('select')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm border ${
              step === 'select' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Select Product
          </button>
          <button
            onClick={() => setStep('edit')}
            disabled={!selectedId}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm border disabled:opacity-50 ${
              step === 'edit' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Editor
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

      {step === 'select' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-extrabold text-gray-900 text-lg">Choose a base product</h2>
          <p className="text-gray-500 text-sm mt-1">We’ll create a draft product automatically — no manual product creation needed.</p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {INVENTORY_PRODUCTS.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedInventoryKey(p.key)}
                className={`text-left rounded-2xl border p-4 transition-all ${
                  selectedInventoryKey === p.key ? 'border-violet-300 bg-violet-50' : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    <Image src={p.images.front} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{p.category}</div>
                    <div className="text-xs text-gray-500 mt-2">Front + back views included</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={createDraftFromInventory}
              disabled={saving}
              className="gradient-cta px-6 py-3 rounded-xl font-extrabold disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Start Designing'}
            </button>
          </div>
        </div>
      )}

      {step === 'edit' && (
        <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: product picker */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Your Products</h2>
            <Link href="/dashboard/products" className="text-sm font-semibold text-violet-700 hover:underline">
              Manage
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-sm text-gray-500">
              No products yet. Go to “Select Product” to start.
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    p.id === selectedId
                      ? 'border-violet-200 bg-violet-50'
                      : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{p.title}</div>
                      <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      p.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.is_published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: studio */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
          {!selected ? (
            <div className="text-sm text-gray-500">Select a product to start customizing.</div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{selected.title}</h2>
                  <p className="text-xs text-gray-500">Customize preview + try-on uses the current garment image.</p>
                </div>
                <Link
                  href={`/product/${selected.slug}`}
                  className="text-sm font-bold text-violet-700 border border-violet-200 px-4 py-2 rounded-lg hover:bg-violet-50"
                >
                  View Product
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  {(['front', 'back'] as View[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        view === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {v === 'front' ? 'Front' : 'Back'}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500">Position • Scale • Rotate</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50">
                    <Image src={baseImage} alt="Base garment" fill className="object-cover" />
                  </div>
                  <div className="p-3 text-xs text-gray-500">Base garment</div>
                </div>

                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
                    {designPreview ? (
                      <Image src={designPreview} alt="Design" fill className="object-contain p-6" />
                    ) : (
                      <div className="text-sm text-gray-400">Upload a design to preview</div>
                    )}
                  </div>
                  <div className="p-3 text-xs text-gray-500">Design preview</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Upload design (PNG/JPG)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickDesign(e.target.files?.[0] || null)}
                    className="w-full text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">X</label>
                      <input type="range" min="0.1" max="0.9" step="0.01" value={posX} onChange={(e) => setPosX(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Y</label>
                      <input type="range" min="0.1" max="0.9" step="0.01" value={posY} onChange={(e) => setPosY(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Scale</label>
                      <input type="range" min="0.5" max="1.8" step="0.01" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Rotation</label>
                      <input type="range" min="-45" max="45" step="1" value={rotation} onChange={(e) => setRotation(parseFloat(e.target.value))} className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <button
                    onClick={saveMockup}
                    disabled={saving}
                    className="flex-1 gradient-cta py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : `Generate ${view === 'front' ? 'Front' : 'Back'} Mockup`}
                  </button>
                  <Link
                    href={`/product/${selected.slug}`}
                    className="px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Share Link
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4 text-sm text-violet-900">
                <div className="font-bold">Next step (GenAI)</div>
                <div className="text-violet-800/80 mt-1">
                  We’ll add: “Edit garment with AI” (prompt + reference image) and then save the generated mockup back to the product.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

