import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

const DEMO_PRODUCTS: Record<string, { title: string; category: string; price: string; oldPrice: string; rating: number; reviews: number; description: string; images: string[]; colors: string[]; sizes: string[]; creator: string; creatorProducts: number }> = {
  'sample-tshirt': {
    title: 'Bengal Tiger Classic Tee',
    category: 'T-Shirt',
    price: '৳ 850',
    oldPrice: '৳ 1,200',
    rating: 4.8,
    reviews: 124,
    description: 'Premium 100% cotton unisex t-shirt featuring a stunning Bengal tiger design. Soft, breathable fabric perfect for the Bangladeshi climate. Available in multiple sizes and colors.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ',
    ],
    colors: ['#1a1a2e', '#ffffff', '#e94560', '#0f3460'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    creator: 'TigerArts BD',
    creatorProducts: 48,
  },
  'premium-hoodie': {
    title: 'Dhaka Skyline Hoodie',
    category: 'Hoodie',
    price: '৳ 1,850',
    oldPrice: '৳ 2,500',
    rating: 4.9,
    reviews: 87,
    description: 'Cozy premium fleece hoodie with a beautiful Dhaka skyline graphic. Perfect for cooler evenings. Features kangaroo pocket and adjustable drawstring hood.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
    ],
    colors: ['#1a1a2e', '#333333', '#4a2c2a', '#0f3460'],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    creator: 'DhakaDesigns',
    creatorProducts: 72,
  },
  'classic-mug': {
    title: 'Rickshaw Art Ceramic Mug',
    category: 'Mug',
    price: '৳ 450',
    oldPrice: '৳ 650',
    rating: 4.7,
    reviews: 203,
    description: 'Beautiful 11oz ceramic mug featuring traditional Bangladeshi rickshaw art. Dishwasher and microwave safe. Makes a perfect gift for anyone who loves Bangladeshi culture.',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg',
    ],
    colors: ['#ffffff', '#f5f0e1'],
    sizes: ['11oz', '15oz'],
    creator: 'CraftBD Studio',
    creatorProducts: 35,
  },
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(DEMO_PRODUCTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = DEMO_PRODUCTS[slug];
  return { title: product?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = DEMO_PRODUCTS[slug] || DEMO_PRODUCTS['sample-tshirt']!;

  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-violet-600">Home</Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-violet-600">Marketplace</Link>
            <span>/</span>
            <span className="text-gray-600">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <Image src={product.images[0]} alt={product.title} width={600} height={600} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div key={i} className={`aspect-square bg-white rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-violet-500' : 'border-gray-100 hover:border-violet-300'}`}>
                    <Image src={img} alt={`${product.title} view ${i + 1}`} width={150} height={150} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="editorial-headline text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold gradient-text">{product.price}</span>
                <span className="text-lg text-gray-400 line-through">{product.oldPrice}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">SAVE 30%</span>
              </div>

              {/* Size */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, i) => (
                    <button key={size} className={`min-w-[48px] h-12 px-4 rounded-xl text-sm font-bold transition-all ${i === 1 ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-300'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button key={color} className={`w-10 h-10 rounded-full border-2 transition-all ${i === 0 ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-200 hover:border-violet-300'}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 gradient-cta py-4 rounded-xl font-bold text-lg">
                  Add to Cart
                </button>
                <button className="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-rose-400 hover:text-rose-500 text-gray-400 transition-colors text-xl">
                  &#9829;
                </button>
              </div>

              {/* Share & earn */}
              <div className="bg-gradient-to-r from-violet-50 to-rose-50 rounded-2xl p-5 border border-violet-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Share &amp; Earn 10% Commission</p>
                    <p className="text-gray-500 text-xs">Copy your affiliate link and earn on every sale</p>
                  </div>
                  <button className="ml-auto text-violet-600 font-bold text-sm hover:underline">Copy Link</button>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                  {product.creator.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{product.creator}</p>
                  <p className="text-gray-500 text-sm">{product.creatorProducts} products</p>
                </div>
                <button className="text-violet-600 font-bold text-sm border border-violet-200 px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors">
                  View Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
