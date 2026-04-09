'use client';

import { Header } from '@/components/layout/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart.store';

const PAYMENT_METHODS = [
  { id: 'sslcommerz', label: 'SSLCommerz', desc: 'Card, bKash, Nagad' },
  { id: 'bkash', label: 'bKash', desc: 'Mobile wallet' },
  { id: 'stripe', label: 'Stripe', desc: 'International cards' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
];

const BD_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet',
  'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('sslcommerz');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', district: 'Dhaka', postalCode: '',
  });

  const subtotal = total();
  const shipping = 60;
  const grandTotal = subtotal + shipping;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: form,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.product.sellingPrice,
          })),
          subtotal,
          shipping,
          total: grandTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.orderId) {
        clearCart();
        router.push(`/order-success/${data.orderId}`);
      }
    } catch {
      setLoading(false);
    }
  }

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6 md:px-8 min-h-screen">
        <form onSubmit={handlePlaceOrder} className="container mx-auto max-w-5xl">
          <h1 className="editorial-headline text-3xl font-extrabold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-6">
              {/* Shipping */}
              <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
                <h2 className="text-lg font-bold">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+880" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input required value={form.address} onChange={(e) => updateField('address', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">District</label>
                    <select value={form.district} onChange={(e) => updateField('district', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all">
                      {BD_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input required value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
                <h2 className="text-lg font-bold">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        paymentMethod === m.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/30'
                      }`}
                    >
                      <p className="font-semibold text-sm">{m.label}</p>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 h-fit sticky top-24 space-y-4 border border-gray-100">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.title || 'Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">৳ {(item.product.sellingPrice * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                {items.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Cart is empty</p>}
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>৳ {shipping}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="gradient-text">৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full gradient-cta py-4 rounded-xl font-bold text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
