'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TryOnModal } from '@/components/tryon/TryOnModal';

const INVENTORY_BASES = [
  {
    key: 'tee-front',
    title: 'Unisex T‑Shirt (Front)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
  },
  {
    key: 'hoodie-front',
    title: 'Hoodie (Front)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
  },
];

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

async function composeMockup(baseUrl: string, designUrl: string, opts: { x: number; y: number; scale: number; rotation: number }): Promise<Blob> {
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

  // draw design with transforms around its center
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

export default function StudioUserPage() {
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const [baseKey, setBaseKey] = useState(INVENTORY_BASES[0].key);
  const base = INVENTORY_BASES.find((b) => b.key === baseKey)!;

  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState('');

  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [mockupUrl, setMockupUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [tryOnOpen, setTryOnOpen] = useState(false);

  useEffect(() => {
    async function run() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/signup?role=studio';
        return;
      }
      setReady(true);
    }
    run();
  }, [supabase]);

  async function onPickDesign(file: File | null) {
    setDesignFile(file);
    setDesignPreview('');
    setMockupUrl('');
    if (!file) return;
    setDesignPreview(await toDataUrl(file));
  }

  async function saveProject() {
    if (!designPreview) {
      setError('Upload a design first.');
      return;
    }
    setError('');
    setSaving(true);

    const ensure = await fetch('/api/storage/ensure-bucket', { method: 'POST' });
    if (!ensure.ok) {
      setError('Failed to prepare storage bucket.');
      setSaving(false);
      return;
    }

    // Upload design file (if present) and composed mockup
    const baseKeyPath = `studio/${Date.now()}`;
    let designUrl = designPreview;
    if (designFile) {
      const designPath = `${baseKeyPath}-design-${designFile.name}`.replace(/\s+/g, '-');
      const { error: upErr } = await supabase.storage.from('product-assets').upload(designPath, designFile, {
        upsert: true,
        contentType: designFile.type || 'image/png',
      });
      if (!upErr) {
        designUrl = supabase.storage.from('product-assets').getPublicUrl(designPath).data.publicUrl;
      }
    }

    const mockupBlob = await composeMockup(base.image, designUrl, { x, y, scale, rotation });
    const mockupPath = `${baseKeyPath}-mockup.png`;
    const { error: mockErr } = await supabase.storage.from('product-assets').upload(mockupPath, mockupBlob, {
      upsert: true,
      contentType: 'image/png',
    });
    if (mockErr) {
      setError(mockErr.message);
      setSaving(false);
      return;
    }
    const publicMock = supabase.storage.from('product-assets').getPublicUrl(mockupPath).data.publicUrl;
    setMockupUrl(publicMock);

    // Store as a studio project row
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (user) {
      await supabase.from('studio_projects').insert({
        user_id: user.id,
        title: 'My Custom Design',
        base_image_url: base.image,
        design_image_url: designUrl,
        mockup_image_url: publicMock,
      });
    }

    setSaving(false);
  }

  if (!ready) return <div className="min-h-screen pt-28 px-6 text-gray-500">Loading studio…</div>;

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="editorial-headline text-3xl font-extrabold text-gray-900">Studio</h1>
            <p className="text-gray-500 mt-1">Make your own dress design, generate a mockup, and test virtual try-on.</p>
          </div>
          <Link href="/marketplace" className="px-5 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50">
            Browse Marketplace
          </Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Base garment</label>
              <select value={baseKey} onChange={(e) => setBaseKey(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                {INVENTORY_BASES.map((b) => (
                  <option key={b.key} value={b.key}>{b.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Upload design</label>
              <input type="file" accept="image/*" onChange={(e) => onPickDesign(e.target.files?.[0] || null)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">X</label>
                <input type="range" min="0.1" max="0.9" step="0.01" value={x} onChange={(e) => setX(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Y</label>
                <input type="range" min="0.1" max="0.9" step="0.01" value={y} onChange={(e) => setY(parseFloat(e.target.value))} className="w-full" />
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

            <button onClick={saveProject} disabled={saving} className="w-full gradient-cta py-3 rounded-xl font-bold disabled:opacity-50">
              {saving ? 'Saving…' : 'Generate Mockup'}
            </button>

            <button
              onClick={() => setTryOnOpen(true)}
              disabled={!mockupUrl}
              className="w-full py-3 rounded-xl font-bold border border-gray-200 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Virtual Try‑On
            </button>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Preview</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <div className="relative aspect-square bg-gray-50">
                  <Image src={base.image} alt="Base garment" fill className="object-cover" />
                </div>
                <div className="p-3 text-xs text-gray-500">Base garment</div>
              </div>
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <div className="relative aspect-square bg-gray-50">
                  <Image src={mockupUrl || base.image} alt="Mockup" fill className="object-cover" />
                </div>
                <div className="p-3 text-xs text-gray-500">{mockupUrl ? 'Generated mockup' : 'Mockup will appear after Generate'}</div>
              </div>
            </div>
          </div>
        </div>

        <TryOnModal isOpen={tryOnOpen} onClose={() => setTryOnOpen(false)} garmentUrl={mockupUrl || base.image} productTitle="My Custom Design" />
      </div>
    </div>
  );
}

