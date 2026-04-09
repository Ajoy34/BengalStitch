'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  personPreview: string;
  garmentUrl: string;
}

export function ProcessingAnimation({ personPreview, garmentUrl }: Props) {
  return (
    <div className="relative aspect-[3/4] max-h-[420px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Person image, slightly dimmed */}
      <Image src={personPreview} alt="You" fill className="object-cover opacity-40" />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Body outline SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="200" height="320" viewBox="0 0 200 320" fill="none" className="opacity-80">
          <motion.ellipse
            cx="100" cy="55" rx="30" ry="38"
            stroke="url(#grad)" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M70 93 Q40 120 35 200 L50 310 M130 93 Q160 120 165 200 L150 310 M70 93 L130 93 M50 150 L150 150"
            stroke="url(#grad)" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="200" y2="320">
              <stop offset="0%" stopColor="#6c3ce9" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Garment floating in */}
      <motion.div
        className="absolute top-1/4 left-1/2 w-24 h-24 -ml-12"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.05, 0.8],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image src={garmentUrl} alt="Garment" width={96} height={96} className="rounded-xl object-cover shadow-2xl" />
      </motion.div>

      {/* Particle effects */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          style={{ left: `${20 + i * 10}%`, top: `${30 + (i % 3) * 20}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Status text */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <motion.div
          className="flex items-center gap-3"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <div>
            <p className="text-white font-semibold text-sm">Generating your look...</p>
            <p className="text-white/60 text-xs">AI is fitting the garment to your photo</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
