'use client';

import { useState, useMemo } from 'react';

const TIERS = [
  { name: 'Blue', markup: 0 },
  { name: 'Bronze', markup: 0.05 },
  { name: 'Silver', markup: 0.10 },
  { name: 'Gold', markup: 0.15 },
  { name: 'Diamond', markup: 0.20 },
  { name: 'Platinum', markup: 0.25 },
];

const PRODUCTS: Record<string, { name: string; basePrice: number; icon: string }[]> = {
  apparel: [
    { name: 'Unisex T-Shirt', basePrice: 8.50, icon: '👕' },
    { name: 'Hoodie', basePrice: 18.00, icon: '🧥' },
    { name: 'Women\'s Tank Top', basePrice: 7.50, icon: '👚' },
    { name: 'Kids T-Shirt', basePrice: 6.50, icon: '👶' },
    { name: 'Long Sleeve Tee', basePrice: 10.00, icon: '🎽' },
  ],
  drinkware: [
    { name: 'Classic Mug', basePrice: 4.50, icon: '☕' },
    { name: 'Travel Tumbler', basePrice: 9.00, icon: '🥤' },
    { name: 'Wine Glass', basePrice: 6.00, icon: '🍷' },
  ],
  wallart: [
    { name: 'Canvas Print', basePrice: 12.00, icon: '🖼️' },
    { name: 'Poster', basePrice: 5.00, icon: '📄' },
    { name: 'Framed Print', basePrice: 16.00, icon: '🎨' },
  ],
  accessories: [
    { name: 'Phone Case', basePrice: 5.50, icon: '📱' },
    { name: 'Tote Bag', basePrice: 7.00, icon: '👜' },
    { name: 'Trucker Hat', basePrice: 6.00, icon: '🧢' },
  ],
};

const CATEGORIES = [
  { key: 'apparel', label: 'Apparel', icon: '👕' },
  { key: 'drinkware', label: 'Drinkware', icon: '☕' },
  { key: 'wallart', label: 'Wall Art', icon: '🖼️' },
  { key: 'accessories', label: 'Accessories', icon: '📱' },
];

const PROCESSING_FEE_RATE = 0.07;

export function ProfitCalculator() {
  const [category, setCategory] = useState('apparel');
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [tier, setTier] = useState(0);
  const [sellPrice, setSellPrice] = useState(25);

  const products = PRODUCTS[category];
  const product = products[selectedProduct] || products[0];
  const tierData = TIERS[tier];

  const calculation = useMemo(() => {
    const baseCost = product.basePrice * (1 + tierData.markup);
    const rawProfit = sellPrice - baseCost;
    const processingFee = rawProfit > 0 ? rawProfit * PROCESSING_FEE_RATE : 0;
    const profit = Math.max(0, rawProfit - processingFee);
    return { baseCost, processingFee, profit };
  }, [product.basePrice, tierData.markup, sellPrice]);

  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — info */}
          <div className="space-y-6">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="editorial-headline text-4xl md:text-5xl font-extrabold text-gray-900">
              Profit Calculator
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Know exactly what you&apos;ll earn before you sell. Set your own prices
              and see your profit margin in real time. The processing fee is only 7% of profit.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-3xl font-extrabold text-green-600">80%</div>
                <div className="text-sm text-gray-600 mt-1">Seller Gets</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <div className="text-3xl font-extrabold text-green-600">10%</div>
                <div className="text-sm text-gray-600 mt-1">Affiliate Commission</div>
              </div>
              <div className="bg-cyan-50 rounded-2xl p-5 border border-cyan-100">
                <div className="text-3xl font-extrabold text-cyan-600">7%</div>
                <div className="text-sm text-gray-600 mt-1">Processing Fee</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-3xl font-extrabold text-emerald-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Monthly Fees</div>
              </div>
            </div>
          </div>

          {/* Right — calculator */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => { setCategory(cat.key); setSelectedProduct(0); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    category === cat.key
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Product selection */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Choose Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50"
              >
                {products.map((p, i) => (
                  <option key={p.name} value={i}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Tier */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setTier(i)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                      tier === i
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sell price */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                You sell it for: <span className="text-green-600">${sellPrice.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={Math.ceil(calculation.baseCost) + 1}
                max={100}
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>${(Math.ceil(calculation.baseCost) + 1).toFixed(2)}</span>
                <span>$100.00</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 bg-gray-50 rounded-2xl p-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base Price ({product.name})</span>
                <span className="font-semibold text-gray-700">${product.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tier Markup ({tierData.name})</span>
                <span className="font-semibold text-gray-700">+{(tierData.markup * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Your Sell Price</span>
                <span className="font-semibold text-gray-700">${sellPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Processing Fee (7%)</span>
                <span className="font-semibold text-gray-700">-${calculation.processingFee.toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-lg">Your Profit</span>
                <span className="text-3xl font-extrabold gradient-text">${calculation.profit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
