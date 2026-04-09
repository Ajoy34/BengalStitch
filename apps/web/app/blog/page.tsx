import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'Blog — BengalStitch' };

const FEATURED = {
  slug: 'print-on-demand-101',
  title: 'Print-On-Demand 101: The Complete Guide for Bangladeshi Entrepreneurs',
  excerpt: 'Everything you need to know about starting your POD business. From choosing products to marketing strategies — we cover it all in this comprehensive guide.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
  category: 'Guide',
  author: 'BengalStitch Team',
  date: 'Mar 28, 2026',
  readTime: '12 min read',
};

const POSTS = [
  { title: 'Top 10 Design Tips to Boost Your Sales', excerpt: 'Learn professional design techniques that convert browsers into buyers.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w', category: 'Tips', author: 'Fatema Akhter', date: 'Mar 25, 2026', readTime: '6 min' },
  { title: 'How to Earn Passive Income as an Affiliate', excerpt: 'Share product links and earn 10% commission on every sale.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ', category: 'Affiliate', author: 'Tanvir Ahmed', date: 'Mar 20, 2026', readTime: '5 min' },
  { title: 'Custom Domain Setup Guide for Your Store', excerpt: 'Connect your own .com domain and brand your storefront professionally.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ', category: 'Tutorial', author: 'Imran Khan', date: 'Mar 15, 2026', readTime: '8 min' },
  { title: 'bKash & Nagad Integration: Getting Paid in Bangladesh', excerpt: 'Step-by-step guide to setting up local payment methods for your earnings.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA', category: 'Payments', author: 'Nusrat Jahan', date: 'Mar 10, 2026', readTime: '7 min' },
  { title: 'Holiday Selling Guide 2026: Maximize Your Revenue', excerpt: 'Plan ahead for Eid, Pohela Boishakh, and global holidays to boost sales.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSBagkS-atK37gtA9d20BF4oLJ-NfOaCtRTLwkaMPTDX2NQYEHPvS7UqSb8DTj9dWoYGcg_tFoXlcNPIt83b_MLZokEBmxhpiUgco1H-J2q_vlvEmiaXTMxSvq129up-jOZ5Fu-iiVTSFtLXrS8WLtr-HchaKMosGl_oOZYuIUvzZP7juVUH-pwIYD4-kiAqKpFf9RLbK-c-93UceRq746H9-rWz-Yn_SLWzdnKH7Whc0LFCTxEhuaxV-RXmLRJadh5GwwO4zFkg', category: 'Business', author: 'Rakib Hasan', date: 'Mar 5, 2026', readTime: '9 min' },
  { title: 'All-Over-Print Products: A Complete Selling Guide', excerpt: 'Master selling AOP shoes, bags, and apparel with these proven strategies.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA', category: 'Guide', author: 'Sadia Rahman', date: 'Feb 28, 2026', readTime: '10 min' },
];

const CATEGORIES = ['All', 'Guide', 'Tips', 'Affiliate', 'Tutorial', 'Payments', 'Business'];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 min-h-screen">
        <section className="px-6 md:px-8 pb-16">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Resources</span>
              <h1 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">BengalStitch Blog</h1>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">Tips, guides, and strategies to grow your print-on-demand business</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {CATEGORIES.map((c, i) => (
                <button key={c} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${i === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
              ))}
            </div>

            {/* Featured post */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-12">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] md:aspect-auto">
                  <Image src={FEATURED.image} alt={FEATURED.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Featured</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-green-600 text-sm font-bold">{FEATURED.category}</span>
                  <h2 className="editorial-headline text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">{FEATURED.title}</h2>
                  <p className="text-gray-500 mt-4 leading-relaxed">{FEATURED.excerpt}</p>
                  <div className="flex items-center gap-3 mt-6 text-sm text-gray-400">
                    <span className="font-medium text-gray-600">{FEATURED.author}</span>
                    <span>&bull;</span>
                    <span>{FEATURED.date}</span>
                    <span>&bull;</span>
                    <span>{FEATURED.readTime}</span>
                  </div>
                  <Link href="#" className="inline-flex items-center gap-2 text-green-600 font-bold mt-6 hover:underline">
                    Read Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Posts grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {POSTS.map((post) => (
                <article key={post.title} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                      <span className="font-medium text-gray-600">{post.author}</span>
                      <span>&bull;</span>
                      <span>{post.date}</span>
                      <span>&bull;</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
