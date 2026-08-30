-- Family Package: พื้นที่จัดเก็บสำหรับครอบครัว

CREATE TABLE IF NOT EXISTS public.family_packages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE UNIQUE NOT NULL,
  storage_limit bigint DEFAULT 5368709120,
  storage_used bigint DEFAULT 0,
  plan_type text DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'premium')),
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Storage Usage Tracking
CREATE TABLE IF NOT EXISTS public.storage_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  home_id uuid REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  file_name text,
  created_at timestamptz DEFAULT NOW()
);

-- RLS
ALTER TABLE public.family_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Home owner can manage package" ON public.family_packages
  FOR ALL USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );

CREATE POLICY "Family members can view package" ON public.family_packages
  FOR SELECT USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
    OR home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Family members can view storage" ON public.storage_usage
  FOR SELECT USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
    OR home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Family members can add storage" ON public.storage_usage
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
    OR home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );

-- Index
CREATE INDEX IF NOT EXISTS storage_usage_home_id_idx ON public.storage_usage(home_id);
CREATE INDEX IF NOT EXISTS storage_usage_user_id_idx ON public.storage_usage(user_id);

-- Trigger
CREATE OR REPLACE FUNCTION public.handle_family_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_family_packages_updated ON public.family_packages;
CREATE TRIGGER on_family_packages_updated
  BEFORE UPDATE ON public.family_packages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_family_packages_updated_at();
