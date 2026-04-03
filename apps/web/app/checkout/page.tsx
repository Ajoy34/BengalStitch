import { Header } from '@/components/layout/Header';

export const metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 px-6 md:px-8 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <h1 className="editorial-headline text-3xl font-extrabold mb-8">
            Checkout
          </h1>

          <div className="grid md:grid-cols-[1fr_400px] gap-8">
            {/* Shipping form */}
            <div className="space-y-6">
              <div className="bg-surface-container-high rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" placeholder="+880" />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-surface-container-high rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {['bKash', 'Nagad', 'Stripe', 'PayPal'].map((method) => (
                    <button
                      key={method}
                      className="p-4 rounded-xl ghost-border hover:border-primary text-center font-medium transition-colors"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-surface-container-high rounded-2xl p-6 h-fit sticky top-24 space-y-4">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-surface-container rounded-xl">
                  <div className="w-16 h-16 bg-surface-container-highest rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Essential Tee (M, Black)</p>
                    <p className="text-xs text-on-surface-variant">Qty: 1</p>
                  </div>
                  <p className="text-sm font-bold">৳ 850</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>৳ 850</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span>৳ 60</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-primary">৳ 910</span>
                </div>
              </div>

              <button className="w-full gradient-cta text-on-primary py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,221,221,0.4)] transition-all">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
