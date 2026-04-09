-- BengalStitch Database Schema

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'seller', 'affiliate', 'buyer');
CREATE TYPE user_tier AS ENUM ('blue', 'bronze', 'silver', 'gold', 'diamond', 'platinum');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'printing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TYPE payout_method AS ENUM ('bkash', 'nagad', 'stripe');
CREATE TYPE expense_category AS ENUM ('printing', 'shipping', 'marketing', 'salary', 'misc');

-- Users (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'buyer',
  bkash_number TEXT,
  nagad_number TEXT,
  stripe_account_id TEXT,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.users(id),
  tier user_tier NOT NULL DEFAULT 'blue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := 'BS' || UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_referral_code
  BEFORE INSERT ON public.users
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- Auto-create user row on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Stores
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_user ON public.stores(user_id);
CREATE INDEX idx_stores_slug ON public.stores(store_slug);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  sell_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'tshirt',
  images JSONB DEFAULT '[]'::JSONB,
  mockup_images JSONB DEFAULT '[]'::JSONB,
  sizes JSONB DEFAULT '["S","M","L","XL"]'::JSONB,
  colors JSONB DEFAULT '[]'::JSONB,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  total_sold INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_store ON public.products(store_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_published ON public.products(is_published);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  shipping_address JSONB NOT NULL DEFAULT '{}'::JSONB,
  products JSONB NOT NULL DEFAULT '[]'::JSONB,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_ref TEXT,
  order_status order_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  tracking_url TEXT,
  seller_id UUID REFERENCES public.users(id),
  affiliate_id UUID REFERENCES public.users(id),
  affiliate_commission NUMERIC(10,2) DEFAULT 0,
  seller_profit NUMERIC(10,2) DEFAULT 0,
  platform_fee NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_orders_status ON public.orders(order_status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

-- Affiliates
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  total_clicks INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_out NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_affiliates_user ON public.affiliates(user_id);

-- Affiliate clicks
CREATE TABLE public.affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_affiliate ON public.affiliate_clicks(affiliate_id);

-- Inventory
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_alert INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_product ON public.inventory(product_id);

-- Expenses
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id),
  category expense_category NOT NULL DEFAULT 'misc',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BDT',
  description TEXT,
  receipt_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payouts
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BDT',
  method payout_method NOT NULL DEFAULT 'bkash',
  status payout_status NOT NULL DEFAULT 'pending',
  transaction_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_user ON public.payouts(user_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE NOT is_read;

-- Virtual try-on results
CREATE TABLE public.tryon_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  person_image_url TEXT NOT NULL,
  result_image_url TEXT,
  prediction_id TEXT,
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tryon_user ON public.tryon_results(user_id);

-- Updated_at auto-trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ─────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tryon_results ENABLE ROW LEVEL SECURITY;

-- Users: read own, admins read all
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles readable" ON public.users FOR SELECT USING (TRUE);

-- Stores: public read, owner write
CREATE POLICY "Stores are publicly readable" ON public.stores FOR SELECT USING (TRUE);
CREATE POLICY "Owners can manage stores" ON public.stores FOR ALL USING (auth.uid() = user_id);

-- Products: published are public, owner manages
CREATE POLICY "Published products are public" ON public.products FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Store owners manage products" ON public.products FOR ALL USING (
  store_id IN (SELECT id FROM public.stores WHERE user_id = auth.uid())
);

-- Orders: buyer/seller can see own
CREATE POLICY "Buyers see own orders" ON public.orders FOR SELECT USING (buyer_email = (SELECT email FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Sellers see own orders" ON public.orders FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (TRUE);

-- Affiliates: own data
CREATE POLICY "Affiliates see own data" ON public.affiliates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Affiliates manage own" ON public.affiliates FOR ALL USING (user_id = auth.uid());

-- Affiliate clicks: insert only
CREATE POLICY "Anyone can log clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Affiliates see own clicks" ON public.affiliate_clicks FOR SELECT USING (
  affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
);

-- Inventory: sellers see own product stock
CREATE POLICY "Sellers manage own inventory" ON public.inventory FOR ALL USING (
  product_id IN (
    SELECT p.id FROM public.products p
    JOIN public.stores s ON p.store_id = s.id
    WHERE s.user_id = auth.uid()
  )
);

-- Expenses: admin only
CREATE POLICY "Admins manage expenses" ON public.expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Payouts: own data + admin
CREATE POLICY "Users see own payouts" ON public.payouts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users request payouts" ON public.payouts FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications: own only
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Try-on results: own or anonymous
CREATE POLICY "Users see own tryon results" ON public.tryon_results FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Anyone can create tryon" ON public.tryon_results FOR INSERT WITH CHECK (TRUE);

-- Storage buckets (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tryon', 'tryon', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('stores', 'stores', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);
