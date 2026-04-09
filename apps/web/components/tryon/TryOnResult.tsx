'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';

interface Props {
  personImage: string;
  resultImage: string;
  onSave?: () => void;
  onRetry?: () => void;
}

export function TryOnResult({ personImage, resultImage, onSave, onRetry }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const sliderX = useMotionValue(containerWidth / 2);
  const clipWidth = useTransform(sliderX, (v) => `${v}px`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="space-y-4"
    >
      {/* Before/After Comparison Slider */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] max-h-[420px] mx-auto rounded-2xl overflow-hidden select-none touch-none"
        onPointerDown={() => {
          if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
        }}
      >
        {/* After (result) — full background */}
        <Image src={resultImage} alt="Try-on result" fill className="object-cover" />

        {/* Before (original) — clipped */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ width: clipWidth }}
        >
          <Image src={personImage} alt="Original" fill className="object-cover" />
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
            Before
          </div>
        </motion.div>

        {/* Slider handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ x: sliderX, left: -0.5 }}
          drag="x"
          dragConstraints={{ left: 40, right: containerWidth - 40 }}
          dragElastic={0}
          dragMomentum={false}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </motion.div>

        {/* After label */}
        <div className="absolute top-4 right-4 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded-full">
          After
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        {onSave && (
          <motion.button
            onClick={onSave}
            className="flex-1 py-3 rounded-xl gradient-cta font-semibold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.97 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save Result
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
