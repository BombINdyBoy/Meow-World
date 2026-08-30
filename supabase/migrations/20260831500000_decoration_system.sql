-- Decoration System: ตกแต่งบ้านและรัง

CREATE TABLE IF NOT EXISTS public.decorations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nest_id uuid REFERENCES public.nests(id) ON DELETE CASCADE,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE,
  decoration_type text NOT NULL,
  position_x int DEFAULT 0,
  position_y int DEFAULT 0,
  season text,
  created_at timestamptz DEFAULT NOW(),
  CHECK (nest_id IS NOT NULL OR home_id IS NOT NULL)
);

-- Decoration Items Catalog
CREATE TABLE IF NOT EXISTS public.decoration_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  icon_url text,
  season text,
  is_free boolean DEFAULT true,
  price_coins int DEFAULT 0,
  created_at timestamptz DEFAULT NOW()
);

-- Seed decoration items
INSERT INTO public.decoration_items (item_key, name, description, category, season, is_free) VALUES
  ('tree_oak', 'ต้นไม้โอ๊ค', 'ต้นไม้ใหญ่ให้ร่มเงา', 'nature', null, true),
  ('flower_rose', 'ดอกกุหลาบ', 'ดอกไม้สีชมพู', 'nature', null, true),
  ('bench_wood', 'ม้านั่งไม้', 'ม้านั่งพักผ่อน', 'furniture', null, true),
  ('pond_small', 'บ่อปลาเล็ก', 'บ่อปลาขนาดเล็ก', 'water', null, false),
  ('lantern', 'โคมไฟ', 'โคมไฟสว่างไสว', 'light', null, true),
  ('pumpkin', 'ฟักทอง', 'ตกแต่งฮาโลวีน', 'seasonal', 'halloween', true),
  ('christmas_tree', 'ต้นคริสต์มาส', 'ตกแต่งคริสต์มาส', 'seasonal', 'christmas', true),
  ('sakura', 'ดอกซากุระ', 'ตกแต่งสงกรานต์', 'seasonal', 'songkran', true),
  ('lantern_loi', 'กระทง', 'ตกแต่งลอยกระทง', 'seasonal', 'loi_krathong', true)
ON CONFLICT (item_key) DO NOTHING;

-- RLS
ALTER TABLE public.decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view decoration items" ON public.decoration_items
  FOR SELECT USING (true);

CREATE POLICY "Nest owner can manage decorations" ON public.decorations
  FOR ALL USING (
    nest_id IN (SELECT id FROM public.nests WHERE owner_id = auth.uid())
    OR home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Family members can view decorations" ON public.decorations
  FOR SELECT USING (
    nest_id IN (
      SELECT n.id FROM public.nests n
      JOIN public.homes h ON h.id = n.home_id
      WHERE h.owner_id = auth.uid()
      OR n.home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
    )
    OR home_id IN (
      SELECT id FROM public.homes WHERE owner_id = auth.uid()
      OR id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS decorations_nest_id_idx ON public.decorations(nest_id);
CREATE INDEX IF NOT EXISTS decorations_home_id_idx ON public.decorations(home_id);
