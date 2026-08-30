-- NUCLEAR FIX: Drop ALL policies and recreate without recursion
-- This fixes infinite recursion in home_members caused by circular references

-- === DROP ALL POLICIES ===
-- Profiles
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

-- Homes
DROP POLICY IF EXISTS "Members view homes" ON public.homes;
DROP POLICY IF EXISTS "Users create own homes" ON public.homes;
DROP POLICY IF EXISTS "Users view own homes" ON public.homes;
DROP POLICY IF EXISTS "Users update own homes" ON public.homes;
DROP POLICY IF EXISTS "Users delete own homes" ON public.homes;

-- Home Members
DROP POLICY IF EXISTS "Members view members" ON public.home_members;
DROP POLICY IF EXISTS "Owners add members" ON public.home_members;
DROP POLICY IF EXISTS "Users view own membership" ON public.home_members;
DROP POLICY IF EXISTS "Home owners manage members" ON public.home_members;

-- Pets
DROP POLICY IF EXISTS "Members view pets" ON public.pets;
DROP POLICY IF EXISTS "Members add pets" ON public.pets;

-- Life Journey Events
DROP POLICY IF EXISTS "Members view events" ON public.life_journey_events;
DROP POLICY IF EXISTS "Members create events" ON public.life_journey_events;

-- === RECREATE ALL POLICIES (no circular references) ===

-- Profiles: everyone can view, user can update own
CREATE POLICY "Public profiles viewable" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Homes: owner can do everything
CREATE POLICY "Owner full access on homes" ON public.homes
  FOR ALL USING (owner_id = auth.uid());

-- Home Members: user can see own records, owner can manage
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Owner manages members" ON public.home_members
  FOR INSERT WITH CHECK (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );
CREATE POLICY "Owner updates members" ON public.home_members
  FOR UPDATE USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );
CREATE POLICY "Owner deletes members" ON public.home_members
  FOR DELETE USING (
    home_id IN (SELECT id FROM public.homes WHERE owner_id = auth.uid())
  );

-- Pets: anyone in the home can view, home owner can manage
CREATE POLICY "Home members view pets" ON public.pets
  FOR SELECT USING (
    home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Home members add pets" ON public.pets
  FOR INSERT WITH CHECK (
    home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );

-- Events: anyone in the home can view and create
CREATE POLICY "Home members view events" ON public.life_journey_events
  FOR SELECT USING (
    home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );
CREATE POLICY "Home members create events" ON public.life_journey_events
  FOR INSERT WITH CHECK (
    home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
  );
