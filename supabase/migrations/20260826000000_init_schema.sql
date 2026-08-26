-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure Profiles with RLS
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Pets Table (Passport)
create table public.pets (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  birth_date date,
  weight decimal(5,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure Pets with RLS
alter table public.pets enable row level security;
create policy "Users can view their own pets" on public.pets for select using (auth.uid() = owner_id);
create policy "Users can insert their own pets" on public.pets for insert with check (auth.uid() = owner_id);
create policy "Users can update their own pets" on public.pets for update using (auth.uid() = owner_id);
create policy "Users can delete their own pets" on public.pets for delete using (auth.uid() = owner_id);

-- 3. Life Journey Events Table
create table public.life_journey_events (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade not null,
  event_date date not null,
  event_type text not null, -- e.g., 'medical', 'vaccine', 'milestone', 'memory'
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure Events with RLS
-- Note: We check if the user owns the pet via a subquery
alter table public.life_journey_events enable row level security;
create policy "Users can view events of their pets" on public.life_journey_events 
  for select using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Users can insert events for their pets" on public.life_journey_events 
  for insert with check (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Users can update events of their pets" on public.life_journey_events 
  for update using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Users can delete events of their pets" on public.life_journey_events 
  for delete using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_pets_updated
  before update on public.pets
  for each row execute procedure public.handle_updated_at();

create trigger on_events_updated
  before update on public.life_journey_events
  for each row execute procedure public.handle_updated_at();

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
