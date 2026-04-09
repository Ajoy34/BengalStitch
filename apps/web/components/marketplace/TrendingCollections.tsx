'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const COLLECTIONS = [
  {
    name: 'Hot Trendy',
    slug: 'hot-trendy',
    description: 'What everyone\'s wearing right now',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
    ),
    emoji: '🔥',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    bgGlow: 'bg-orange-500/20',
    tags: ['trending', 'hot', 'popular', 'bestseller'],
    count: 240,
  },
  {
    name: "Mother's Day",
    slug: 'mothers-day',
    description: 'Perfect gifts for the best mom',
    emoji: '💐',
    gradient: 'from-pink-400 via-rose-400 to-fuchsia-500',
    bgGlow: 'bg-pink-500/20',
    tags: ['mothers-day', 'mom', 'gift', 'love'],
    count: 128,
  },
  {
    name: 'Earth Day',
    slug: 'earth-day',
    description: 'Eco-friendly & nature inspired',
    emoji: '🌍',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    bgGlow: 'bg-emerald-500/20',
    tags: ['earth-day', 'eco', 'nature', 'green'],
    count: 96,
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Express your daily vibe',
    emoji: '✨',
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
    bgGlow: 'bg-violet-500/20',
    tags: ['lifestyle', 'aesthetic', 'minimalist', 'vibes'],
    count: 312,
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Level up your merch game',
    emoji: '🎮',
    gradient: 'from-blue-500 via-cyan-500 to-teal-400',
    bgGlow: 'bg-blue-500/20',
    tags: ['gaming', 'gamer', 'esports', 'controller'],
    count: 186,
  },
  {
    name: 'Funny',
    slug: 'funny',
    description: 'Memes, puns & LOL-worthy prints',
    emoji: '😂',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    bgGlow: 'bg-yellow-500/20',
    tags: ['funny', 'meme', 'humor', 'joke'],
    count: 274,
  },
  {
    name: 'Anime & Comics',
    slug: 'anime-comics',
    description: 'For otaku & comic lovers',
    emoji: '⚡',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    bgGlow: 'bg-fuchsia-500/20',
    tags: ['anime', 'manga', 'comics', 'otaku'],
    count: 198,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
};

export function TrendingCollections() {
  return (
    <section className="py-20 px-6 md:px-8 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-bold text-violet-600 uppercase tracking-wider mb-3"
          >
            Explore Collections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Trending Right Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto"
          >
            Discover curated collections for every mood, season, and passion
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {/* First card - large featured */}
          <motion.div variants={cardVariants} className="col-span-2 row-span-2">
            <Link
              href={`/marketplace?collection=${COLLECTIONS[0].slug}`}
              className="group relative block h-full min-h-[320px] rounded-3xl overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${COLLECTIONS[0].gradient} opacity-90`} />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
              <div className="relative h-full flex flex-col justify-between p-8">
                <div>
                  <span className="text-6xl mb-4 block group-hover:scale-110 transition-transform duration-500 inline-block">
                    {COLLECTIONS[0].emoji}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
                    {COLLECTIONS[0].name}
                  </h3>
                  <p className="text-white/80 mt-2 text-lg">{COLLECTIONS[0].description}</p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full">
                    {COLLECTIONS[0].count}+ Products
                  </span>
                  <span className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                    <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Remaining cards */}
          {COLLECTIONS.slice(1).map((col) => (
            <motion.div key={col.slug} variants={cardVariants}>
              <Link
                href={`/marketplace?collection=${col.slug}`}
                className="group relative block rounded-3xl overflow-hidden h-full min-h-[160px]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} opacity-90`} />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                <div className="relative h-full flex flex-col justify-between p-5">
                  <div>
                    <span className="text-3xl group-hover:scale-125 transition-transform duration-500 inline-block">
                      {col.emoji}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-2 leading-tight">
                      {col.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-1 line-clamp-2">{col.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-white/60 text-xs font-semibold">{col.count}+ items</span>
                    <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                      <svg className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tag cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {['Streetwear', 'Vintage', 'Y2K', 'Cottagecore', 'Dark Academia', 'Kawaii', 'Retro', 'Minimalist', 'Boho', 'Grunge', 'Cyberpunk', 'Vaporwave'].map((tag) => (
            <Link
              key={tag}
              href={`/marketplace?q=${tag.toLowerCase()}`}
              className="px-4 py-2 bg-gray-100 hover:bg-violet-100 text-gray-600 hover:text-violet-700 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
            >
              #{tag}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
