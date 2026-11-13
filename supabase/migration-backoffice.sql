-- ============================================================
-- Migración backoffice: finanzas (ingresos/egresos) + comentarios
-- Ejecutar en: Supabase Dashboard → SQL Editor (idempotente)
-- ============================================================

-- 1) Movimientos de caja: ingresos y egresos
create table if not exists public.finances (
  id             uuid primary key default uuid_generate_v4(),
  type           text not null check (type in ('income','expense')),
  category       text not null default 'general',
  concept        text not null,
  amount         numeric(12,2) not null check (amount >= 0),
  method         text not null default 'efectivo'
                 check (method in ('efectivo','transferencia','mercadopago','tarjeta','otro')),
  date           date not null default current_date,
  reservation_id uuid references public.reservations(id) on delete set null,
  notes          text,
  created_at     timestamptz not null default now()
);

create index if not exists finances_date_idx on public.finances(date);
create index if not exists finances_type_idx on public.finances(type);
create index if not exists finances_category_idx on public.finances(category);

alter table public.finances enable row level security;
-- sin policy para anon → solo service role (server) administra finanzas

-- 2) Testimonios / comentarios del sitio
create table if not exists public.comments (
  id              uuid primary key default uuid_generate_v4(),
  author_name     text not null,
  author_location text,
  excursion_id    uuid references public.excursions(id) on delete set null,
  rating          smallint check (rating between 1 and 5),
  body            text not null,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  featured        boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists comments_status_idx on public.comments(status);
create index if not exists comments_excursion_idx on public.comments(excursion_id);

alter table public.comments enable row level security;

drop policy if exists "comments read approved" on public.comments;
create policy "comments read approved" on public.comments
  for select using (status = 'approved');

drop policy if exists "comments insert public" on public.comments;
create policy "comments insert public" on public.comments
  for insert with check (status = 'pending' and featured = false);
