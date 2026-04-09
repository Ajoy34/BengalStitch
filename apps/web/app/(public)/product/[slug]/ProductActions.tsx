'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VirtualTryOnButton } from '@/components/tryon/VirtualTryOnButton';
import { TryOnModal } from '@/components/tryon/TryOnModal';
import { useCartStore } from '@/stores/cart.store';

interface Props {
  garmentUrl: string;
  productTitle: string;
  productId: string;
  sellPrice: number;
  storeName?: string;
  storeSlug?: string;
}

export function ProductActions({ garmentUrl, productTitle, productId, sellPrice, storeName, storeSlug }: Props) {
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <>
      {/* Virtual Try-On */}
      <VirtualTryOnButton onClick={() => setTryOnOpen(true)} />

      <TryOnModal
        isOpen={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        garmentUrl={garmentUrl}
        productTitle={productTitle}
      />

      {/* Add to Cart */}
      <div className="flex gap-3 pt-2">
        <button
          className="flex-1 gradient-cta py-4 rounded-xl font-bold text-lg"
          onClick={() =>
            addItem({
              id: `${productId}-default`,
              productId,
              variantId: 'default',
              quantity: 1,
              product: {
                id: productId,
                title: productTitle,
                sellingPrice: sellPrice,
                currency: 'BDT',
                mockupUrls: [garmentUrl],
              },
              variant: {
                id: 'default',
                sku: 'default',
                additionalPrice: 0,
              },
            } as any)
          }
        >
          Add to Cart
        </button>
        <button className="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-rose-400 hover:text-rose-500 text-gray-400 transition-colors text-xl">
          &#9829;
        </button>
      </div>

      {/* Customize */}
      <div className="flex gap-3">
        <Link
          href={`/dashboard/studio`}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 text-center"
        >
          Customize (Studio)
        </Link>
        <Link
          href="/checkout"
          className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold text-center hover:bg-black"
        >
          Go to Checkout
        </Link>
      </div>

      {/* Share & earn */}
      <div className="bg-gradient-to-r from-violet-50 to-rose-50 rounded-2xl p-5 border border-violet-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Share &amp; Earn 10% Commission</p>
            <p className="text-gray-500 text-xs">Copy your affiliate link and earn on every sale</p>
          </div>
          <button className="ml-auto text-violet-600 font-bold text-sm hover:underline">Copy Link</button>
        </div>
      </div>

      {/* Creator */}
      {storeName && storeSlug && (
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
            {storeName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{storeName}</p>
          </div>
          <Link
            href={`/store/${storeSlug}`}
            className="text-violet-600 font-bold text-sm border border-violet-200 px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            View Store
          </Link>
        </div>
      )}
    </>
  );
}
