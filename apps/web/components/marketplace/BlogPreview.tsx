import Image from 'next/image';
import Link from 'next/link';

const BLOG_POSTS = [
  {
    slug: 'print-on-demand-101',
    title: 'Print-On-Demand 101: Complete Beginner Guide',
    excerpt: 'Everything you need to know about starting your POD business in Bangladesh. From design to delivery.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXlUhUo80ya30PpexggkqYN63xOUey7rylDIP3EKdUzXBvR8n1jduDaTuiPpLqi-y3oj5bY7W3Rfl3ZuYAOIZgvZEJRG8ijVCEOzivXFnOVEgvePpm81V8uVIf3IKaSBkpxLjpQMTmDeJVR-lzOdw_Ojn03mdDaqBUjdxTd83nlUf7v7SgcxloxHtS8iGFTG6uzqOzDQWbEUyDp0pX5i2MOU4w1IsuEkZuDIzFaKf8zoKRhkBQKNPfiG0IWEsXKZLSpAPSj7x3iA',
    category: 'Guide',
    author: 'BengalStitch Team',
    time: 'Yesterday',
  },
  {
    slug: 'design-tips-selling',
    title: 'Top 10 Design Tips to Boost Your Sales',
    excerpt: 'Learn professional design techniques that convert browsers into buyers. Increase your revenue with these proven strategies.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
    category: 'Tips',
    author: 'Fatema Akhter',
    time: '2 days ago',
  },
  {
    slug: 'affiliate-marketing-guide',
    title: 'How to Earn Passive Income as an Affiliate',
    excerpt: 'Share product links and earn 10% commission on every sale. Here\'s the ultimate guide to maximizing your affiliate earnings.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhksxVrdsL_Mf9yPmo5VUTo_r8TrINS99vOT_u0f5tohoTDPT3VtNOqpjCZWhf727xbeGrDOsSWuVJ7-DWMAYEuC0dy3eyWVx35ctHly4bG2mSMIKBnmCyec7cR2RnueiJW0DsU-OcgIkVtEfwtursAPrsSbtyqrXMIdlwYk8PbmvIfY-rssZucwibIp-SFYlmC5htaL9zmAC4SqjdXsj27iJZrU_cDzvt9Bimhh5PN2WJdPustaoUAnYrvYxYDFIul9pJ-ZNSVQ',
    category: 'Affiliate',
    author: 'Tanvir Ahmed',
    time: '4 hours ago',
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Learn & Grow</span>
          <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            BengalStitch Makes It Easy
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Dive into our free resource library and learn the secrets to selling POD products.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 pt-2 text-sm text-gray-400">
                  <span className="font-medium text-gray-600">{post.author}</span>
                  <span>&bull;</span>
                  <span>{post.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-800 transition-colors"
          >
            View More Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
