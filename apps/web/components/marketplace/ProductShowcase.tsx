'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TABS = [
  { key: 'apparel', label: 'Apparel' },
  { key: 'drinkware', label: 'Drinkware' },
  { key: 'wallart', label: 'Wall Art' },
  { key: 'phonecases', label: 'Phone Cases' },
  { key: 'accessories', label: 'Accessories' },
];

const SHOWCASE_PRODUCTS: Record<string, { name: string; image: string; price: string }[]> = {
  apparel: [
    { name: 'Unisex Classic Tee', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA', price: '$14.99' },
    { name: 'Premium Hoodie', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', price: '$29.99' },
    { name: 'Women\'s Tank Top', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', price: '$12.99' },
    { name: 'Kids T-Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ', price: '$10.99' },
    { name: 'Long Sleeve Tee', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA', price: '$16.99' },
  ],
  drinkware: [
    { name: 'Classic Ceramic Mug', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg', price: '$9.99' },
    { name: 'Travel Tumbler', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA', price: '$18.99' },
    { name: 'Wine Glass', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA', price: '$14.99' },
  ],
  wallart: [
    { name: 'Canvas Print', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', price: '$24.99' },
    { name: 'Framed Poster', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', price: '$34.99' },
    { name: 'Art Print', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ', price: '$19.99' },
  ],
  phonecases: [
    { name: 'iPhone Slim Case', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA', price: '$12.99' },
    { name: 'Samsung Galaxy Case', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg', price: '$12.99' },
    { name: 'AirPod Case', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA', price: '$9.99' },
  ],
  accessories: [
    { name: 'Canvas Tote Bag', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA', price: '$14.99' },
    { name: 'Mesh Trucker Hat', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', price: '$11.99' },
    { name: 'Sticker Pack', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', price: '$4.99' },
  ],
};

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState('apparel');

  return (
    <section className="py-24 px-6 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Product Catalog</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Start Selling Today!
          </h2>
          <p className="text-gray-500 mt-3">Customize &amp; sell from over 2,700 premium product SKUs</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-violet-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(SHOWCASE_PRODUCTS[activeTab] || []).map((product) => (
            <div
              key={product.name}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm text-violet-700 font-bold py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Customize
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                <div className="text-violet-600 font-bold mt-1">From {product.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/marketplace"
            className="gradient-cta inline-block px-8 py-4 rounded-xl font-bold text-lg"
          >
            Browse Full Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
