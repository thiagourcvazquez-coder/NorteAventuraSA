-- ============================================================
-- Norte Aventura — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Categorías / orígenes de las excursiones
-- ------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,          -- 'salta' | 'jujuy'
  name        text not null,                 -- 'Desde Salta' | 'Desde Jujuy'
  description text,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Excursiones
-- ------------------------------------------------------------
create table if not exists public.excursions (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  location      text not null,               -- 'Cachi, Salta'
  category_id   uuid not null references public.categories(id) on delete restrict,
  price         integer,                     -- ARS por persona; null = consultar
  price_note    text,                        -- 'Precio x2 personas', etc.
  duration      text not null,               -- '1 (un) día' | '1/2 (medio) día'
  schedule      text,                        -- '7:00 a 19:00hs'
  difficulty    text not null default 'Baja' check (difficulty in ('Baja','Media','Alta')),
  short_desc    text not null,               -- bajada para cards
  description   text not null,               -- descripción larga (detalle)
  included      text,                        -- 'Traslado, seguro, guiado.'
  booking_lead  text,                        -- 'Reservá hasta 48hs antes'
  image_url     text,                        -- imagen destacada
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists excursions_category_idx on public.excursions(category_id);
create index if not exists excursions_active_idx on public.excursions(is_active);

-- ------------------------------------------------------------
-- Galería de imágenes por excursión
-- ------------------------------------------------------------
create table if not exists public.excursion_images (
  id           uuid primary key default uuid_generate_v4(),
  excursion_id uuid not null references public.excursions(id) on delete cascade,
  url          text not null,
  alt          text,
  sort_order   integer not null default 0
);

create index if not exists excursion_images_excursion_idx on public.excursion_images(excursion_id);

-- ------------------------------------------------------------
-- Preguntas frecuentes por excursión
-- ------------------------------------------------------------
create table if not exists public.excursion_faqs (
  id           uuid primary key default uuid_generate_v4(),
  excursion_id uuid not null references public.excursions(id) on delete cascade,
  question     text not null,
  answer       text not null,
  sort_order   integer not null default 0
);

create index if not exists excursion_faqs_excursion_idx on public.excursion_faqs(excursion_id);

-- ------------------------------------------------------------
-- Reservas (lead generado desde el formulario → WhatsApp)
-- ------------------------------------------------------------
create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');

create table if not exists public.reservations (
  id            uuid primary key default uuid_generate_v4(),
  excursion_id  uuid references public.excursions(id) on delete set null,
  customer_name text not null,
  phone         text not null,
  email         text,
  start_date    date not null,
  people        integer not null check (people > 0),
  total         integer,                     -- ARS estimado (price * people)
  notes         text,
  status        public.reservation_status not null default 'pending',
  created_at    timestamptz not null default now()
);

create index if not exists reservations_excursion_idx on public.reservations(excursion_id);
create index if not exists reservations_status_idx on public.reservations(status);
create index if not exists reservations_date_idx on public.reservations(start_date);

-- ------------------------------------------------------------
-- Contenido editable del sitio (para el futuro backoffice)
-- ------------------------------------------------------------
create table if not exists public.site_content (
  key        text primary key,               -- 'hero_title', 'about_text', ...
  value      text not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Trigger: updated_at automático en excursions
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists excursions_updated_at on public.excursions;
create trigger excursions_updated_at
  before update on public.excursions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
--   - Lectura pública: categories, excursions, images, faqs, site_content
--   - Escritura de reservas: solo vía API (service role en el server)
--   - El backoffice se autentica con Supabase Auth (fase 2)
-- ------------------------------------------------------------
alter table public.categories       enable row level security;
alter table public.excursions       enable row level security;
alter table public.excursion_images enable row level security;
alter table public.excursion_faqs   enable row level security;
alter table public.reservations     enable row level security;
alter table public.site_content     enable row level security;

create policy "categories read public"       on public.categories       for select using (true);
create policy "excursions read public"       on public.excursions       for select using (is_active = true);
create policy "excursion_images read public" on public.excursion_images for select using (true);
create policy "excursion_faqs read public"   on public.excursion_faqs   for select using (true);
create policy "site_content read public"     on public.site_content     for select using (true);
-- reservations: sin policy para anon → solo service role (server) puede insertar/leer
