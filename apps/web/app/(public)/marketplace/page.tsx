import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

const DEMO_PRODUCTS = [
  { slug: 'sample-tshirt', name: 'Bengal Tiger Classic Tee', price: '৳850', category: 'T-Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA', rating: 4.8 },
  { slug: 'premium-hoodie', name: 'Dhaka Skyline Hoodie', price: '৳1,850', category: 'Hoodie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA', rating: 4.9 },
  { slug: 'classic-mug', name: 'Rickshaw Art Ceramic Mug', price: '৳450', category: 'Mug', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA', rating: 4.7 },
  { slug: 'sample-tshirt', name: 'Sundarbans Wildlife Tee', price: '৳900', category: 'T-Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', rating: 4.6 },
  { slug: 'premium-hoodie', name: 'Barishal Vibes Hoodie', price: '৳1,950', category: 'Hoodie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', rating: 4.8 },
  { slug: 'classic-mug', name: 'Padma River Mug', price: '৳500', category: 'Mug', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ', rating: 4.5 },
  { slug: 'sample-tshirt', name: 'Pohela Boishakh Edition', price: '৳950', category: 'T-Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg', rating: 4.9 },
  { slug: 'premium-hoodie', name: 'Cox Bazar Sunset Hoodie', price: '৳2,100', category: 'Hoodie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA', rating: 4.7 },
  { slug: 'classic-mug', name: 'Nakshi Kantha Mug', price: '৳475', category: 'Mug', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA', rating: 4.8 },
  { slug: 'sample-tshirt', name: 'Jute Pattern Premium Tee', price: '৳1,050', category: 'T-Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', rating: 4.6 },
  { slug: 'premium-hoodie', name: 'Sylhet Tea Garden Hoodie', price: '৳1,750', category: 'Hoodie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', rating: 4.9 },
  { slug: 'classic-mug', name: 'Victory Day Special Mug', price: '৳550', category: 'Mug', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA', rating: 4.7 },
];

export const metadata = {
  title: 'Marketplace — Browse Products',
  description: 'Browse thousands of unique products from Bangladeshi creators.',
};

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 px-6 md:px-8 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Marketplace</h1>
            <p className="text-gray-500">Discover unique products from creators across Bangladesh</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="search" placeholder="Search products, creators, tags..." className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-6 py-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'T-Shirts', 'Hoodies', 'Mugs', 'Phone Cases', 'Posters', 'Bags'].map((cat, i) => (
                <button key={cat} className={`px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${i === 0 ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {DEMO_PRODUCTS.map((p, i) => (
              <Link key={i} href={`/product/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-bold text-violet-600 px-2.5 py-1 rounded-full">{p.category}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Earn 10%</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-violet-600 transition-colors truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-violet-600">{p.price}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-xs text-gray-500">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
