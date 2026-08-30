-- Vet Market: ตลาดสัตวแพทย์

CREATE TABLE IF NOT EXISTS public.market_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.market_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.market_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'THB',
  images text[],
  is_available boolean DEFAULT true,
  stock_count int DEFAULT 0,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.market_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES public.market_items(id) ON DELETE CASCADE NOT NULL,
  quantity int DEFAULT 1,
  total_price decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Seed categories
INSERT INTO public.market_categories (name, slug, icon, sort_order) VALUES
  ('อาหารสัตว์', 'food', '🍖', 1),
  ('ขนม', 'treats', '🦴', 2),
  ('ของเล่น', 'toys', '🧸', 3),
  ('อุปกรณ์', 'equipment', '🏥', 4),
  ('ยาและวัคซีน', 'medicine', '💊', 5),
  ('เสื้อผ้า', 'clothing', '👕', 6)
ON CONFLICT (slug) DO NOTHING;

-- RLS
ALTER TABLE public.market_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.market_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view items" ON public.market_items FOR SELECT USING (is_available = true);

CREATE POLICY "Sellers can manage items" ON public.market_items
  FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "Buyers can view own orders" ON public.market_orders
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.market_orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS market_items_category_idx ON public.market_items(category_id);
CREATE INDEX IF NOT EXISTS market_items_seller_idx ON public.market_items(seller_id);
CREATE INDEX IF NOT EXISTS market_orders_buyer_idx ON public.market_orders(buyer_id);
