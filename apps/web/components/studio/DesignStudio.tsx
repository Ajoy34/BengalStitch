'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
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

type Step = 'select' | 'editor' | 'publish';
type View = 'front' | 'back';

const PRODUCT_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Forest', hex: '#166534' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Maroon', hex: '#7F1D1D' },
  { name: 'Charcoal', hex: '#374151' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gold', hex: '#D97706' },
];

type CatalogCategory = {
  key: string;
  label: string;
  icon: string;
  items: CatalogItem[];
};

type CatalogItem = {
  key: string;
  title: string;
  basePrice: number;
  images: { front: string; back: string };
  printArea: { x: number; y: number; w: number; h: number };
};

const IMG_TEE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA';
const IMG_HOODIE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w';
const IMG_MUG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg';
const IMG_POSTER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ';
const IMG_PHONE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ';
const IMG_TOTE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA';
const IMG_PILLOW =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA';

const CATALOG: CatalogCategory[] = [
  {
    key: 'apparel',
    label: 'Apparel',
    icon: '👕',
    items: [
      { key: 'unisex-tee', title: 'Unisex T-Shirt', basePrice: 8.5, images: { front: IMG_TEE, back: IMG_TEE }, printArea: { x: 0.25, y: 0.2, w: 0.5, h: 0.5 } },
      { key: 'premium-hoodie', title: 'Premium Hoodie', basePrice: 18, images: { front: IMG_HOODIE, back: IMG_HOODIE }, printArea: { x: 0.25, y: 0.2, w: 0.5, h: 0.45 } },
      { key: 'womens-tank', title: "Women's Tank Top", basePrice: 7.5, images: { front: IMG_TEE, back: IMG_TEE }, printArea: { x: 0.27, y: 0.22, w: 0.46, h: 0.45 } },
      { key: 'kids-tee', title: 'Kids T-Shirt', basePrice: 6.5, images: { front: IMG_TEE, back: IMG_TEE }, printArea: { x: 0.28, y: 0.22, w: 0.44, h: 0.44 } },
      { key: 'long-sleeve', title: 'Long Sleeve Tee', basePrice: 10, images: { front: IMG_TEE, back: IMG_TEE }, printArea: { x: 0.25, y: 0.2, w: 0.5, h: 0.5 } },
      { key: 'sweatshirt', title: 'Fleece Sweatshirt', basePrice: 16, images: { front: IMG_HOODIE, back: IMG_HOODIE }, printArea: { x: 0.25, y: 0.2, w: 0.5, h: 0.45 } },
    ],
  },
  {
    key: 'drinkware',
    label: 'Drinkware',
    icon: '☕',
    items: [
      { key: 'classic-mug', title: 'Classic Mug (11oz)', basePrice: 4.5, images: { front: IMG_MUG, back: IMG_MUG }, printArea: { x: 0.15, y: 0.15, w: 0.7, h: 0.55 } },
      { key: 'travel-tumbler', title: 'Travel Tumbler (20oz)', basePrice: 9, images: { front: IMG_MUG, back: IMG_MUG }, printArea: { x: 0.2, y: 0.1, w: 0.6, h: 0.6 } },
      { key: 'wine-glass', title: 'Wine Glass', basePrice: 6, images: { front: IMG_MUG, back: IMG_MUG }, printArea: { x: 0.25, y: 0.25, w: 0.5, h: 0.4 } },
    ],
  },
  {
    key: 'wallart',
    label: 'Wall Art',
    icon: '🖼️',
    items: [
      { key: 'canvas-print', title: 'Canvas Print', basePrice: 12, images: { front: IMG_POSTER, back: IMG_POSTER }, printArea: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 } },
      { key: 'poster', title: 'Poster (18x24)', basePrice: 5, images: { front: IMG_POSTER, back: IMG_POSTER }, printArea: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 } },
      { key: 'framed-print', title: 'Framed Print', basePrice: 16, images: { front: IMG_POSTER, back: IMG_POSTER }, printArea: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 } },
    ],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    icon: '📱',
    items: [
      { key: 'phone-case', title: 'iPhone Slim Case', basePrice: 5.5, images: { front: IMG_PHONE, back: IMG_PHONE }, printArea: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 } },
      { key: 'tote-bag', title: 'Canvas Tote Bag', basePrice: 7, images: { front: IMG_TOTE, back: IMG_TOTE }, printArea: { x: 0.15, y: 0.15, w: 0.7, h: 0.6 } },
      { key: 'trucker-hat', title: 'Mesh Trucker Hat', basePrice: 6, images: { front: IMG_TOTE, back: IMG_TOTE }, printArea: { x: 0.2, y: 0.15, w: 0.6, h: 0.4 } },
    ],
  },
  {
    key: 'home',
    label: 'Home & Living',
    icon: '🏠',
    items: [
      { key: 'pillow', title: 'Throw Pillow (18x18)', basePrice: 8, images: { front: IMG_PILLOW, back: IMG_PILLOW }, printArea: { x: 0.1, y: 0.1, w: 0.8, h: 0.8 } },
      { key: 'blanket', title: 'Fleece Blanket', basePrice: 22, images: { front: IMG_PILLOW, back: IMG_PILLOW }, printArea: { x: 0.05, y: 0.05, w: 0.9, h: 0.9 } },
      { key: 'ornament', title: 'Ceramic Ornament', basePrice: 4, images: { front: IMG_MUG, back: IMG_MUG }, printArea: { x: 0.15, y: 0.15, w: 0.7, h: 0.7 } },
    ],
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

async function composeMockup(
  baseUrl: string,
  designUrl: string,
  area: { x: number; y: number; w: number; h: number },
  rotation: number,
): Promise<Blob> {
  const [base, design] = await Promise.all([loadImage(baseUrl), loadImage(designUrl)]);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const baseScale = Math.max(size / base.width, size / base.height);
  const bw = base.width * baseScale;
  const bh = base.height * baseScale;
  ctx.drawImage(base, (size - bw) / 2, (size - bh) / 2, bw, bh);

  const dx = size * area.x;
  const dy = size * area.y;
  const dw = size * area.w;
  const dh = size * area.h;
  const designScale = Math.min(dw / design.width, dh / design.height);
  const rw = design.width * designScale;
  const rh = design.height * designScale;

  ctx.save();
  ctx.translate(dx + dw / 2, dy + dh / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(design, -rw / 2, -rh / 2, rw, rh);
  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png', 0.95);
  });
}

function StepIndicator({ step, setStep, canEdit }: { step: Step; setStep: (s: Step) => void; canEdit: boolean }) {
  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'select', label: 'Select Product', num: 1 },
    { key: 'editor', label: 'Design Editor', num: 2 },
    { key: 'publish', label: 'Review & Publish', num: 3 },
  ];
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl p-2">
      {steps.map((s, i) => {
        const active = s.key === step;
        const done = steps.findIndex((x) => x.key === step) > i;
        const disabled = s.key === 'editor' && !canEdit;
        return (
          <button
            key={s.key}
            disabled={disabled}
            onClick={() => !disabled && setStep(s.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              active
                ? 'bg-green-600 text-white shadow-md shadow-green-200'
                : done
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'text-gray-400 hover:text-gray-600 disabled:opacity-40'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                active ? 'bg-white/20 text-white' : done ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s.num
              )}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function DesignStudio() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useSupabase();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [step, setStep] = useState<Step>('select');
  const [activeCat, setActiveCat] = useState(CATALOG[0].key);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [view, setView] = useState<View>('front');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState('');
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const [tryOnFile, setTryOnFile] = useState<File | null>(null);
  const [tryOnPreview, setTryOnPreview] = useState('');
  const [tryOnResult, setTryOnResult] = useState('');
  const [tryOnLoading, setTryOnLoading] = useState(false);

  const [productTitle, setProductTitle] = useState('');
  const [sellPrice, setSellPrice] = useState(25);

  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const cat = CATALOG.find((c) => c.key === activeCat) || CATALOG[0];

  const filteredItems = searchQuery
    ? CATALOG.flatMap((c) => c.items).filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : cat.items;

  useEffect(() => {
    async function init() {
      if (authLoading) return;
      if (!user) return;

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (store) {
        setStoreId(store.id);
        const { data: items } = await supabase
          .from('products')
          .select('id, title, slug, images, mockup_images, is_published')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });
        if (items) setProducts(items as unknown as Product[]);
      }
    }
    init();
  }, [supabase, user, authLoading]);

  const renderPreview = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedItem) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S = canvas.width;
    ctx.clearRect(0, 0, S, S);

    ctx.fillStyle = selectedColor.hex;
    ctx.fillRect(0, 0, S, S);

    try {
      const baseImg = await loadImage(selectedItem.images[view]);
      const bs = Math.max(S / baseImg.width, S / baseImg.height);
      const bw = baseImg.width * bs;
      const bh = baseImg.height * bs;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(baseImg, (S - bw) / 2, (S - bh) / 2, bw, bh);
      ctx.globalAlpha = 1;
    } catch { /* base image failed */ }

    const pa = selectedItem.printArea;
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(pa.x * S, pa.y * S, pa.w * S, pa.h * S);
    ctx.setLineDash([]);

    if (designPreview) {
      try {
        const dImg = await loadImage(designPreview);
        const dw = pa.w * S;
        const dh = pa.h * S;
        const scale = Math.min(dw / dImg.width, dh / dImg.height);
        const rw = dImg.width * scale;
        const rh = dImg.height * scale;
        const cx = pa.x * S + dw / 2;
        const cy = pa.y * S + dh / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(dImg, -rw / 2, -rh / 2, rw, rh);
        ctx.restore();
      } catch { /* design load failed */ }
    }

    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [selectedItem, selectedColor, view, designPreview, rotation]);

  useEffect(() => {
    if (step === 'editor' || step === 'publish') renderPreview();
  }, [step, renderPreview]);

  async function onPickDesign(file: File | null) {
    setDesignFile(file);
    setDesignPreview('');
    if (!file) return;
    const url = await toDataUrl(file);
    setDesignPreview(url);
  }

  function onSelectProduct(item: CatalogItem) {
    setSelectedItem(item);
    setProductTitle(`${item.title} — Custom Design`);
    setSellPrice(Math.ceil(item.basePrice * 2.5));
    setDesignFile(null);
    setDesignPreview('');
    setRotation(0);
    setStep('editor');
  }

  async function handleGenAI() {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      if (data.output) {
        const imgUrl = Array.isArray(data.output) ? data.output[0] : data.output;
        setDesignPreview(imgUrl);
        setDesignFile(null);
      } else if (data.id) {
        for (let i = 0; i < 60; i++) {
          await new Promise((r) => setTimeout(r, 2000));
          const poll = await fetch(`/api/generate-image/${data.id}`);
          const pollData = await poll.json();
          if (pollData.status === 'succeeded' && pollData.output) {
            const imgUrl = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
            setDesignPreview(imgUrl);
            setDesignFile(null);
            break;
          }
          if (pollData.status === 'failed') throw new Error('Generation failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed');
    }
    setAiGenerating(false);
  }

  async function handleTryOn() {
    if (!tryOnFile || !previewUrl) return;
    setTryOnLoading(true);
    setTryOnResult('');
    setError('');
    try {
      const garmentUrl = previewUrl;
      const formData = new FormData();
      formData.append('person_image', tryOnFile);
      formData.append('garment_url', garmentUrl);
      formData.append('category', 'tops');

      const res = await fetch('/api/tryon', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Try-on failed');

      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const poll = await fetch(`/api/tryon/${data.id}`);
        const pollData = await poll.json();
        if (pollData.status === 'succeeded' && pollData.output) {
          const outputUrl = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
          setTryOnResult(outputUrl);
          break;
        }
        if (pollData.status === 'failed') throw new Error('Try-on failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Virtual try-on failed');
    }
    setTryOnLoading(false);
  }

  async function onPickTryOnPhoto(file: File | null) {
    setTryOnFile(file);
    setTryOnResult('');
    if (!file) { setTryOnPreview(''); return; }
    const url = await toDataUrl(file);
    setTryOnPreview(url);
  }

  async function handlePublish() {
    if (!selectedItem) return;
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setError('');
    setSuccess('');
    setSaving(true);

    let sid = storeId;
    if (!sid) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!store) {
        setError('Please set up your store first (go to Dashboard > Settings).');
        setSaving(false);
        return;
      }
      sid = store.id;
      setStoreId(sid);
    }

    await fetch('/api/storage/ensure-bucket', { method: 'POST' });

    const baseSlug = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const ts = Date.now();
    const mockupUrls: string[] = [];

    for (const v of ['front', 'back'] as View[]) {
      if (!designPreview) continue;
      try {
        const blob = await composeMockup(
          selectedItem.images[v],
          designPreview,
          selectedItem.printArea,
          rotation,
        );
        const path = `products/${slug}/${ts}-${v}-mockup.png`;
        const { error: upErr } = await supabase.storage
          .from('product-assets')
          .upload(path, blob, { upsert: true, contentType: 'image/png' });
        if (!upErr) {
          mockupUrls.push(supabase.storage.from('product-assets').getPublicUrl(path).data.publicUrl);
        }
      } catch { /* mockup composition failed for this view */ }
    }

    let designUrl = '';
    if (designFile) {
      const dPath = `products/${slug}/${ts}-design-${designFile.name}`.replace(/\s+/g, '-');
      const { error: dErr } = await supabase.storage
        .from('product-assets')
        .upload(dPath, designFile, { upsert: true, contentType: designFile.type || 'image/png' });
      if (!dErr) {
        designUrl = supabase.storage.from('product-assets').getPublicUrl(dPath).data.publicUrl;
      }
    }

    const { data: inserted, error: insErr } = await supabase
      .from('products')
      .insert({
        store_id: sid,
        title: productTitle,
        slug,
        description: `Designed in BengalStitch Studio. Base product: ${selectedItem.title}.`,
        category: CATALOG.find((c) => c.items.some((i) => i.key === selectedItem.key))?.key || 'apparel',
        images: [selectedItem.images.front, selectedItem.images.back],
        mockup_images: mockupUrls.length > 0 ? mockupUrls : [designUrl || selectedItem.images.front],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [selectedColor.name],
        is_published: true,
        base_price: selectedItem.basePrice,
        sell_price: sellPrice,
        total_sold: 0,
      })
      .select('id, title, slug, images, mockup_images, is_published')
      .single();

    if (insErr || !inserted) {
      setError(insErr?.message || 'Failed to publish product');
      setSaving(false);
      return;
    }

    setProducts((prev) => [inserted as unknown as Product, ...prev]);
    setSuccess(`Published! Your product is live at /product/${slug}`);
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} width={800} height={800} className="hidden" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Design Studio</h1>
          <p className="text-gray-500 text-sm mt-1">Create custom products in 3 easy steps</p>
        </div>
        <StepIndicator step={step} setStep={setStep} canEdit={!!selectedItem} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* STEP 1: SELECT PRODUCT */}
      {step === 'select' && (
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-1 lg:sticky lg:top-24 self-start">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Categories</h3>
            {CATALOG.map((c) => (
              <button
                key={c.key}
                onClick={() => { setActiveCat(c.key); setSearchQuery(''); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeCat === c.key && !searchQuery
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <span>{c.label}</span>
                <span className="ml-auto text-xs text-gray-400">{c.items.length}</span>
              </button>
            ))}

            <hr className="border-gray-100 my-3" />

            {products.length > 0 && (
              <>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Your Products</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {products.slice(0, 8).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600">
                      <span className={`w-2 h-2 rounded-full ${p.is_published ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <span className="truncate">{p.title}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search all products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">
                {searchQuery ? `Results for "${searchQuery}"` : cat.label}
              </h2>
              <span className="text-sm text-gray-400">{filteredItems.length} products</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onSelectProduct(item)}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 text-left"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={item.images.front}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                        Start Designing
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-600 font-bold text-sm">From ${item.basePrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-400">Front + Back</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DESIGN EDITOR */}
      {step === 'editor' && selectedItem && (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {(['front', 'back'] as View[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                        view === v ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'
                      }`}
                    >
                      {v === 'front' ? 'Front' : 'Back'}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{selectedItem.title}</span>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 max-w-lg mx-auto" style={{ backgroundColor: selectedColor.hex }}>
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Loading preview...
                  </div>
                )}

                {!designPreview && (
                  <div
                    className="absolute border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center"
                    style={{
                      left: `${selectedItem.printArea.x * 100}%`,
                      top: `${selectedItem.printArea.y * 100}%`,
                      width: `${selectedItem.printArea.w * 100}%`,
                      height: `${selectedItem.printArea.h * 100}%`,
                    }}
                  >
                    <span className="text-green-400 text-xs font-semibold bg-white/80 px-2 py-1 rounded">Print Area</span>
                  </div>
                )}
              </div>
            </div>

            {products.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Recent Mockups</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {products.slice(0, 6).map((p) => {
                    const img = p.mockup_images?.[0] || p.images?.[0];
                    if (!img) return null;
                    return (
                      <Link key={p.id} href={`/product/${p.slug}`} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 hover:border-green-300 transition-colors">
                        <Image src={img} alt={p.title} width={80} height={80} className="w-full h-full object-cover" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Upload Design</h3>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-colors cursor-pointer">
                {designPreview ? (
                  <div className="relative w-24 h-24">
                    <Image src={designPreview} alt="Design" fill className="object-contain" />
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500 font-medium">Drop image or click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, SVG</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => onPickDesign(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {designFile && (
                <button onClick={() => { setDesignFile(null); setDesignPreview(''); }} className="text-xs text-red-500 hover:underline">
                  Remove design
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-bold text-gray-900">Product Color</h3>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor.name === c.name ? 'ring-2 ring-green-500 ring-offset-2 scale-110' : 'hover:scale-110'
                    } ${c.border ? 'border border-gray-300' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">{selectedColor.name}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-bold text-gray-900">Design Rotation</h3>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>-180&deg;</span>
                <span className="font-semibold text-green-600">{rotation}&deg;</span>
                <span>180&deg;</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <h3 className="font-bold text-gray-900">AI Design Generator</h3>
              </div>
              <p className="text-xs text-gray-500">Describe the design you want and AI will generate it for you.</p>
              <textarea
                placeholder="e.g. A minimalist mountain landscape with sunset colors, vector style..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none"
              />
              <button
                onClick={handleGenAI}
                disabled={aiGenerating || !aiPrompt.trim()}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate with AI'
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <h3 className="font-bold text-gray-900">Virtual Try-On</h3>
              </div>
              <p className="text-xs text-gray-500">Upload a full-body photo to see how this product looks on you.</p>
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-colors cursor-pointer">
                {tryOnPreview ? (
                  <div className="relative w-16 h-16">
                    <Image src={tryOnPreview} alt="Your photo" fill className="object-cover rounded-lg" />
                  </div>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">Upload your photo</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => onPickTryOnPhoto(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <button
                onClick={handleTryOn}
                disabled={tryOnLoading || !tryOnFile || !designPreview}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {tryOnLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Try It On'
                )}
              </button>
              {tryOnResult && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <Image src={tryOnResult} alt="Try-on result" width={360} height={480} className="w-full h-auto object-contain" />
                  <div className="p-2 bg-gray-50 text-center">
                    <a href={tryOnResult} download={`bengalstitch-tryon-${Date.now()}.jpg`} className="text-xs font-semibold text-green-600 hover:underline">
                      Download Result
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 text-sm hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={() => { renderPreview(); setStep('publish'); }}
                disabled={!designPreview}
                className="flex-1 gradient-cta py-3 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                Next: Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PUBLISH */}
      {step === 'publish' && selectedItem && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Mockup Preview</h3>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100" style={{ backgroundColor: selectedColor.hex }}>
              {previewUrl && <Image src={previewUrl} alt="Mockup" fill className="object-contain" />}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-500">Base Cost</div>
                <div className="font-bold text-gray-900">${selectedItem.basePrice.toFixed(2)}</div>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xs text-green-600">Your Profit</div>
                <div className="font-bold text-green-700">${(sellPrice - selectedItem.basePrice).toFixed(2)}</div>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <div className="text-xs text-green-600">Sell Price</div>
                <div className="font-bold text-green-700">${sellPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h3 className="font-bold text-gray-900 text-lg">Product Details</h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sell Price: <span className="text-green-600">${sellPrice.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={Math.ceil(selectedItem.basePrice) + 1}
                  max={200}
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Min ${(Math.ceil(selectedItem.basePrice) + 1).toFixed(2)}</span>
                  <span>$200.00</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: selectedColor.hex }} />
                  <span className="text-sm text-gray-600">{selectedColor.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sizes</label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('editor')} className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-gray-700 text-sm hover:bg-gray-50">
                Back to Editor
              </button>
              <button
                onClick={handlePublish}
                disabled={saving || !productTitle.trim()}
                className="flex-1 gradient-cta py-3.5 rounded-xl font-bold text-sm disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </span>
                ) : (
                  'Publish Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH PROMPT MODAL */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAuthPrompt(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-5">
            <button onClick={() => setShowAuthPrompt(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Sign up to publish</h3>
              <p className="text-gray-500 text-sm">
                Your design is ready! Create a free account to publish your product, set up your store, and start selling.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/signup?role=seller&redirect=/studio')}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold transition-colors"
              >
                Sign Up Free
              </button>
              <button
                onClick={() => router.push('/login?redirect=/studio')}
                className="w-full border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Already have an account? Sign In
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Your design will be saved. You can publish right after signing up.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
