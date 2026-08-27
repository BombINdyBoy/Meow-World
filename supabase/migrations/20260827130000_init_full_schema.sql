-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Homes Table
CREATE TABLE IF NOT EXISTS public.homes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;

-- 3. Home Members Table (ต้องสร้างก่อนใส่ Policy ที่อ้างอิงถึง)
CREATE TABLE IF NOT EXISTS public.home_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(home_id, user_id)
);
ALTER TABLE public.home_members ENABLE ROW LEVEL SECURITY;

-- 4. Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  species TEXT DEFAULT 'Cat',
  breed TEXT,
  gender TEXT,
  birth_date DATE,
  color TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 5. Life Journey Events Table
CREATE TABLE IF NOT EXISTS public.life_journey_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT,
  event_type TEXT DEFAULT 'memory',
  media_urls TEXT[],
  participant_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
ALTER TABLE public.life_journey_events ENABLE ROW LEVEL SECURITY;

-- === POLICIES (ใส่ทีหลังเมื่อตารางพร้อมหมดแล้ว) ===

-- Profiles Policies
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Homes Policies
CREATE POLICY "Members view homes" ON public.homes FOR SELECT USING (
  owner_id = auth.uid() OR 
  id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users create own homes" ON public.homes FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Home Members Policies
CREATE POLICY "Members view members" ON public.home_members FOR SELECT USING (
  home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);
CREATE POLICY "Owners add members" ON public.home_members FOR INSERT WITH CHECK (
  home_id IN (SELECT home_id FROM public.homes WHERE owner_id = auth.uid())
);

-- Pets Policies
CREATE POLICY "Members view pets" ON public.pets FOR SELECT USING (
  home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);
CREATE POLICY "Members add pets" ON public.pets FOR INSERT WITH CHECK (
  home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);

-- Events Policies
CREATE POLICY "Members view events" ON public.life_journey_events FOR SELECT USING (
  home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);
CREATE POLICY "Members create events" ON public.life_journey_events FOR INSERT WITH CHECK (
  home_id IN (SELECT home_id FROM public.home_members WHERE user_id = auth.uid())
);

-- Trigger: Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
