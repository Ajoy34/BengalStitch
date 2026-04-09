'use client';

import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
}

export function VirtualTryOnButton({ onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full py-4 rounded-xl font-bold text-lg overflow-hidden group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ backgroundSize: '200% 200%' }}
      />

      <motion.div
        className="absolute inset-0 bg-white/20"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
        style={{ skewX: '-12deg' }}
      />

      <span className="relative z-10 flex items-center justify-center gap-3 text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Virtual Try-On
        <motion.span
          className="inline-block w-2 h-2 rounded-full bg-white"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </span>
    </motion.button>
  );
}
