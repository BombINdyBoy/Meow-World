-- Feature Flags System
-- ควบคุมการเปิด/ปิดฟีเจอร์โดยไม่ต้อง deploy ใหม่

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name text UNIQUE NOT NULL,
  description text,
  is_enabled boolean DEFAULT false,
  rollout_percentage int DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users uuid[],
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Everyone can read flags (for client-side checks)
CREATE POLICY "Anyone can view flags" ON public.feature_flags
  FOR SELECT USING (true);

-- Only authenticated users can update (for admin)
CREATE POLICY "Authenticated users can update flags" ON public.feature_flags
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Seed default flags
INSERT INTO public.feature_flags (flag_name, description, is_enabled) VALUES
  ('home_mode', 'Home Mode - หน้าหลัก', true),
  ('nest_system', 'Nest System - รังส่วนตัว', false),
  ('decoration', 'Decoration - ตกแต่งบ้าน', false),
  ('community', 'Community - ชุมชน', false),
  ('vet_market', 'Vet Market - ตลาดสัตวแพทย์', false),
  ('family_package', 'Family Package - พื้นที่จัดเก็บ', false)
ON CONFLICT (flag_name) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_feature_flags_updated
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE PROCEDURE public.handle_feature_flags_updated_at();
