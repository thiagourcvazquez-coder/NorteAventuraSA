-- ============================================================
-- Norte Aventura — cambios pedidos por el cliente (noviembre 2026)
-- Pegar COMPLETO en Supabase → SQL Editor → Run. Se puede correr más de una vez.
--
--  1) Portada propia por excursión (reemplaza el mapa generado si se carga)
--  2) Bloques de título + descripción editables por excursión
--     ("Disfrutá de la aventura", etc.)
--  3) Bucket público "media" para subir fotos desde el panel
--     (hero, portadas, galería)
--  Las preguntas frecuentes (excursion_faqs), la galería (excursion_images)
--  y los textos/hero (site_content) ya existen: no se tocan.
-- ============================================================

-- 1) Portada por excursión
alter table public.excursions
  add column if not exists cover_url text;

-- 2) Bloques de texto por excursión
create table if not exists public.excursion_sections (
  id           uuid primary key default uuid_generate_v4(),
  excursion_id uuid not null references public.excursions(id) on delete cascade,
  title        text not null,
  body         text not null default '',
  sort_order   integer not null default 0
);

create index if not exists excursion_sections_excursion_idx
  on public.excursion_sections(excursion_id);

alter table public.excursion_sections enable row level security;

drop policy if exists "excursion_sections read public" on public.excursion_sections;
create policy "excursion_sections read public"
  on public.excursion_sections for select using (true);
-- Escribe solo el server (service role) desde el panel admin.

-- 3) Storage: bucket público para las fotos que sube el cliente
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select using (bucket_id = 'media');
-- Subir/borrar: solo el server con la service role (no hay policy de escritura para anon).
