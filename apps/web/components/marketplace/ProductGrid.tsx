import Image from 'next/image';
import Link from 'next/link';

const PRODUCTS = [
  {
    title: 'Essential Tee',
    price: '৳850',
    tag: 'Best Seller',
    tagColor: 'bg-secondary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3l2xve2ebMiBz4B3KqFnIcyn8duJI-ktcDufeGLjABevNqDJzuQLVFNueom8TMq8j14ytBvkHv0W6usqM9TR7ue34WktwWLG1LhytM9mH6wEiSVrP-8_qwMfjXHoCqCV8p6oAnqak1MlHmtsKQkmrbnT5dGZJWKO0u3P7OfNAF5dj7B1N5k5QnENYoCMahoGp46LpbZ7dT3yS-jLvqCz0bcV8c-MH4ifDFyvudOHsjDbXwqOp3XezGRfQ3HhsMwIHwnPaVskK2w',
    alt: 'White t-shirt mockup',
  },
  {
    title: 'Urban Hoodie',
    price: '৳1,450',
    tag: 'Popular',
    tagColor: 'bg-primary text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgDvAkTDQ_9Dv3_nIEmGLYPv-pNQSXq33Nmdnad95A1Tj_tWMkwFyt2yLywFZCbewjsvJa3oH8qwEncUCwUkWWcwJ9QpDECVakTC90_aOIS1u7p7JYB6FPv1TlryU_EHeN855hQ0BYVGxhK4tjQ_CVmHj6KZNYBSv9HU91wCwC1iby9TpaIB-2F-8KBfzcUPhwLVvMRqFtPICf1zc2tBIQdOPMtB76Xr34Wmisj2fDvnFLavg6zCB9jzmGR4kqVFr28yPljH6_XA',
    alt: 'Hoodie mockup',
  },
  {
    title: 'Artisan Mug',
    price: '৳450',
    tag: 'New',
    tagColor: 'bg-accent text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDecIBLXJLvczGZwz1LuJokca8x8rxOYwEazbJciate3yfit4kNjgBEFZaRceVtdWhrqescAHv3-cwuVEGWt6aeWxFkvv-pSNetV4LTSezETlxn6JIr21fNwZr9xuxgAuchWMFgPcOEDR5AvPmKFXKssjPjZGN9_jF8PkrxLmLP_XR9YAuvpz5JiwFceRzLikb4nZycx6rzYq-eQoX3krT1M67KDNGKx_lFoPuzUz_81GpBR-rXqN8CyTBMhDzcuMsAGKGD8I9lXA',
    alt: 'Ceramic mug mockup',
  },
  {
    title: 'Phone Case',
    price: '৳550',
    tag: 'Trending',
    tagColor: 'bg-warning text-white',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UmUwXTrzX4fpFWmVplwIBTNpxn3Yez5JJi_yuv7ZkDmqfZnJIJphrR7PjVZVbhhuyz9sRkzDAbXZR7Sm9QXsZlqh5Dkewjhp0sihbacq9tJjkooqCTpr1epBZSt5-7oN7ks62d4bUuIjy6RJUtVTBz5DpjTdB1-UkvH96OzJ48WQaf--SlobIXRBn70kCSZu4MEdTHkArLTk46CTsPPzVfJBjDoAZrOsKoMO4P7XJw5E9-H-Q1tNQo-kTz3PHQqFhSCnInMIAQ',
    alt: 'Phone case mockup',
  },
];

const CATEGORIES = [
  { name: 'All', active: true },
  { name: 'T-Shirts', active: false },
  { name: 'Hoodies', active: false },
  { name: 'Mugs', active: false },
  { name: 'Phone Cases', active: false },
  { name: 'Tote Bags', active: false },
  { name: 'Posters', active: false },
  { name: 'Caps', active: false },
];

export function ProductGrid() {
  return (
    <section className="py-24 bg-surface-dim px-6 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-sm font-bold text-secondary uppercase tracking-wider">Top Products</span>
            <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold mt-2">
              Customize &amp; Sell <span className="gradient-text">Premium Products</span>
            </h2>
          </div>
          <Link href="/marketplace" className="text-primary font-bold hover:underline text-sm flex items-center gap-1">
            View all products &rarr;
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-10 pb-2 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                cat.active
                  ? 'gradient-cta text-white shadow-md'
                  : 'bg-white text-on-surface-variant border border-outline/30 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <Link
              key={product.title}
              href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="group bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                <Image
                  src={product.image}
                  alt={product.alt}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 ${product.tagColor} text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
                  {product.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-on-surface">{product.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold">{product.price}+</span>
                  <span className="text-xs text-success font-semibold bg-success-container px-2 py-1 rounded-full">
                    Earn 10%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
