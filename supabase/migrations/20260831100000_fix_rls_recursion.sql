-- Fix infinite recursion between homes and home_members
-- Problem: homes policy queries home_members, home_members policy queries homes = loop

-- 1. Drop all existing policies on both tables
DROP POLICY IF EXISTS "Members view homes" ON public.homes;
DROP POLICY IF EXISTS "Users create own homes" ON public.homes;
DROP POLICY IF EXISTS "Members view members" ON public.home_members;
DROP POLICY IF EXISTS "Owners add members" ON public.home_members;

-- 2. Recreate homes policies (no reference to home_members)
CREATE POLICY "Users view own homes" ON public.homes
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users create own homes" ON public.homes
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users update own homes" ON public.homes
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users delete own homes" ON public.homes
  FOR DELETE USING (owner_id = auth.uid());

-- 3. Recreate home_members policies (no reference to homes)
CREATE POLICY "Users view own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Home owners manage members" ON public.home_members
  FOR ALL USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );
