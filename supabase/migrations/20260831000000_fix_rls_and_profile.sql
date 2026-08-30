-- Fix 1: Drop the recursive RLS policy on home_members and recreate without recursion
DROP POLICY IF EXISTS "Members view members" ON public.home_members;

CREATE POLICY "Members view members" ON public.home_members
  FOR SELECT USING (
    -- Owner of the home can see all members
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
    OR
    -- Members can see their own record
    user_id = auth.uid()
  );

-- Fix 2: Insert profile for existing auth user (run this after you know your user_id)
-- Find your user_id from: Supabase Dashboard > Authentication > Users
-- Then uncomment and run:

-- INSERT INTO public.profiles (id, display_name)
-- VALUES ('YOUR_USER_ID_HERE', 'Your Name')
-- ON CONFLICT (id) DO NOTHING;
