-- Roadmap 1 full reset migration.
-- Drops only application data in public. Supabase Auth users are preserved.

create extension if not exists "uuid-ossp";

drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_updated_at() cascade;
drop function if exists public.is_family_member(uuid) cascade;
drop function if exists public.is_family_owner(uuid) cascade;
drop function if exists public.can_access_pet(uuid) cascade;

drop table if exists public.life_journey_events cascade;
drop table if exists public.pet_shares cascade;
drop table if exists public.family_members cascade;
drop table if exists public.families cascade;
drop table if exists public.pets cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table public.pets (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  birth_date date,
  weight numeric(5,2) check (weight is null or weight >= 0),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create table public.life_journey_events (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade not null,
  event_date date not null,
  event_type text not null check (event_type in ('medical', 'vaccine', 'milestone', 'memory')),
  title text not null,
  description text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create table public.families (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table public.family_members (
  family_id uuid references public.families(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'viewer' check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  primary key (family_id, user_id)
);

create table public.pet_shares (
  pet_id uuid references public.pets(id) on delete cascade not null,
  family_id uuid references public.families(id) on delete cascade not null,
  permission text not null default 'view' check (permission in ('view', 'edit')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  primary key (pet_id, family_id)
);

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = target_family_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_family_owner(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.families
    where id = target_family_id and owner_id = auth.uid()
  );
$$;

create or replace function public.can_access_pet(target_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pets where id = target_pet_id and owner_id = auth.uid()
  ) or exists (
    select 1
    from public.pet_shares shares
    join public.family_members members on members.family_id = shares.family_id
    where shares.pet_id = target_pet_id and members.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.life_journey_events enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.pet_shares enable row level security;

create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view accessible pets" on public.pets for select using (public.can_access_pet(id));
create policy "Users can insert their own pets" on public.pets for insert with check (auth.uid() = owner_id);
create policy "Owners and editors can update pets" on public.pets for update using (auth.uid() = owner_id or exists (
  select 1 from public.pet_shares shares
  join public.family_members members on members.family_id = shares.family_id
  where shares.pet_id = pets.id and members.user_id = auth.uid()
    and (shares.permission = 'edit' or members.role in ('owner', 'editor'))
));
create policy "Owners can delete pets" on public.pets for delete using (auth.uid() = owner_id);

create policy "Users can view accessible events" on public.life_journey_events for select using (public.can_access_pet(pet_id));
create policy "Owners and editors can insert events" on public.life_journey_events for insert with check (
  public.can_access_pet(pet_id) and (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()) or exists (
    select 1 from public.pet_shares shares join public.family_members members on members.family_id = shares.family_id
    where shares.pet_id = life_journey_events.pet_id and members.user_id = auth.uid()
      and (shares.permission = 'edit' or members.role in ('owner', 'editor'))
  ))
);
create policy "Owners and editors can update events" on public.life_journey_events for update using (
  exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()) or exists (
    select 1 from public.pet_shares shares join public.family_members members on members.family_id = shares.family_id
    where shares.pet_id = life_journey_events.pet_id and members.user_id = auth.uid()
      and (shares.permission = 'edit' or members.role in ('owner', 'editor'))
  )
);
create policy "Owners can delete events" on public.life_journey_events for delete using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));

create policy "Members and owners can view families" on public.families for select using (owner_id = auth.uid() or public.is_family_member(id));
create policy "Users can create families" on public.families for insert with check (auth.uid() = owner_id);
create policy "Owners can update families" on public.families for update using (auth.uid() = owner_id);
create policy "Owners can delete families" on public.families for delete using (auth.uid() = owner_id);

create policy "Members can view membership" on public.family_members for select using (user_id = auth.uid() or public.is_family_owner(family_id));
create policy "Owners can add members" on public.family_members for insert with check (public.is_family_owner(family_id));
create policy "Owners can update members" on public.family_members for update using (public.is_family_owner(family_id));
create policy "Owners can remove members" on public.family_members for delete using (public.is_family_owner(family_id));

create policy "Members can view pet shares" on public.pet_shares for select using (public.is_family_member(family_id) or exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Pet owners can create shares" on public.pet_shares for insert with check (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Pet owners can update shares" on public.pet_shares for update using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));
create policy "Pet owners can delete shares" on public.pet_shares for delete using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_pets_updated before update on public.pets for each row execute procedure public.handle_updated_at();
create trigger on_events_updated before update on public.life_journey_events for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create index pets_owner_id_idx on public.pets(owner_id);
create index life_journey_events_pet_date_idx on public.life_journey_events(pet_id, event_date desc);
create index family_members_user_id_idx on public.family_members(user_id);
create index pet_shares_family_id_idx on public.pet_shares(family_id);
