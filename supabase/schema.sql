create extension if not exists "pgcrypto";

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  title text,
  hero_kicker text,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tech_stack text[] not null default '{}',
  project_url text,
  academic_year text not null default 'First Year' check (academic_year in ('First Year', 'Second Year', 'Third Year', 'Fourth Year')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  date_range text,
  bullet_points text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  linkedin_url text,
  github_url text,
  facebook_url text,
  resume_url text,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_site_config_updated_at on public.site_config;
create trigger touch_site_config_updated_at
before update on public.site_config
for each row execute function public.touch_updated_at();

drop trigger if exists touch_projects_updated_at on public.projects;
create trigger touch_projects_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists touch_experiences_updated_at on public.experiences;
create trigger touch_experiences_updated_at
before update on public.experiences
for each row execute function public.touch_updated_at();

drop trigger if exists touch_contact_settings_updated_at on public.contact_settings;
create trigger touch_contact_settings_updated_at
before update on public.contact_settings
for each row execute function public.touch_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.site_config enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.contact_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
    and role = 'admin'
  );
$$;

drop policy if exists "Public can read site config" on public.site_config;
create policy "Public can read site config" on public.site_config
for select using (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects
for select using (true);

drop policy if exists "Public can read experiences" on public.experiences;
create policy "Public can read experiences" on public.experiences
for select using (true);

drop policy if exists "Public can read contact settings" on public.contact_settings;
create policy "Public can read contact settings" on public.contact_settings
for select using (true);

drop policy if exists "Admins can read admin profiles" on public.admin_profiles;
create policy "Admins can read admin profiles" on public.admin_profiles
for select using (public.is_admin());

drop policy if exists "Admins can write site config" on public.site_config;
create policy "Admins can write site config" on public.site_config
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can write projects" on public.projects;
create policy "Admins can write projects" on public.projects
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can write experiences" on public.experiences;
create policy "Admins can write experiences" on public.experiences
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can write contact settings" on public.contact_settings;
create policy "Admins can write contact settings" on public.contact_settings
for all using (public.is_admin()) with check (public.is_admin());
