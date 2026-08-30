-- Nest System: รังส่วนตัวสำหรับแต่ละคน

CREATE TABLE IF NOT EXISTS public.nests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nest_name text NOT NULL,
  description text,
  theme text DEFAULT 'default',
  banner_url text,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Pets เข้ากับ Nest แทน Home
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS nest_id uuid REFERENCES public.nests(id) ON DELETE SET NULL;

-- Events เข้ากับ Nest ด้วย
ALTER TABLE public.life_journey_events ADD COLUMN IF NOT EXISTS nest_id uuid REFERENCES public.nests(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.nests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nest owner can manage" ON public.nests
  FOR ALL USING (
    owner_id = auth.uid()
    OR home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Family members can view nests" ON public.nests
  FOR SELECT USING (
    home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
    OR home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );

-- Index
CREATE INDEX IF NOT EXISTS nests_home_id_idx ON public.nests(home_id);
CREATE INDEX IF NOT EXISTS nests_owner_id_idx ON public.nests(owner_id);

-- Trigger
CREATE OR REPLACE FUNCTION public.handle_nests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_nests_updated ON public.nests;
CREATE TRIGGER on_nests_updated
  BEFORE UPDATE ON public.nests
  FOR EACH ROW EXECUTE PROCEDURE public.handle_nests_updated_at();
