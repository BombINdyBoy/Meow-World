-- Migration for Digital Certificates and Family QR Invite Tokens

create table if not exists public.digital_certificates (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references public.pets(id) on delete cascade not null,
  cert_type text not null check (cert_type in ('pedigree', 'vaccine', 'microchip', 'adoption', 'health', 'general')),
  title text not null,
  certificate_no text not null unique,
  issuing_authority text not null,
  issue_date date not null,
  expiry_date date,
  original_doc_url text not null,
  generated_cert_url text,
  security_hash text not null,
  verification_qr_payload text not null,
  metadata jsonb default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.family_invite_tokens (
  id uuid default uuid_generate_v4() primary key,
  token text not null unique,
  family_id uuid references public.families(id) on delete cascade not null,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  created_by uuid references public.profiles(id) on delete cascade not null,
  expires_at timestamptz not null,
  used_by uuid references public.profiles(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.journey_comments (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.life_journey_events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- RLS policies
alter table public.digital_certificates enable row level security;
alter table public.family_invite_tokens enable row level security;
alter table public.journey_comments enable row level security;

create policy "Users can view certificates for accessible pets" on public.digital_certificates
  for select using (public.can_access_pet(pet_id));

create policy "Owners and editors can insert certificates" on public.digital_certificates
  for insert with check (public.can_access_pet(pet_id));

create policy "Owners can delete certificates" on public.digital_certificates
  for delete using (exists (select 1 from public.pets where id = pet_id and owner_id = auth.uid()));

create policy "Family members can view invite tokens" on public.family_invite_tokens
  for select using (public.is_family_member(family_id) or is_family_owner(family_id));

create policy "Family owners and editors can create invite tokens" on public.family_invite_tokens
  for insert with check (public.is_family_owner(family_id));

create policy "Users can view comments on accessible events" on public.journey_comments
  for select using (exists (
    select 1 from public.life_journey_events e 
    where e.id = event_id and public.can_access_pet(e.pet_id)
  ));

create policy "Users can insert comments on accessible events" on public.journey_comments
  for insert with check (exists (
    select 1 from public.life_journey_events e 
    where e.id = event_id and public.can_access_pet(e.pet_id)
  ));
