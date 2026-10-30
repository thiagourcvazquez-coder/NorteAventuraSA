-- ============================================================
-- Norte Aventura — SETUP COMPLETO (todo en uno)
-- Borra TODA la base y la reconstruye: schema + datos + galerías.
-- Pegar completo en: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ------------------------------------------------------------
-- 1) RESET: borra tablas, tipo y función existentes
-- ------------------------------------------------------------
drop table if exists public.excursion_faqs   cascade;
drop table if exists public.excursion_images cascade;
drop table if exists public.reservations     cascade;
drop table if exists public.excursions       cascade;
drop table if exists public.site_content     cascade;
drop table if exists public.categories       cascade;
drop type  if exists public.reservation_status cascade;
drop function if exists public.set_updated_at cascade;

-- ------------------------------------------------------------
-- 2) SCHEMA
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table public.excursions (
  id            uuid primary key default uuid_generate_v4(),
  slug          text not null unique,
  name          text not null,
  location      text not null,
  category_id   uuid not null references public.categories(id) on delete restrict,
  price         integer,
  price_note    text,
  duration      text not null,
  schedule      text,
  difficulty    text not null default 'Baja' check (difficulty in ('Baja','Media','Alta')),
  short_desc    text not null,
  description   text not null,
  included      text,
  booking_lead  text,
  image_url     text,
  maps_query    text,
  is_active     boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index excursions_category_idx on public.excursions(category_id);
create index excursions_active_idx on public.excursions(is_active);

create table public.excursion_images (
  id           uuid primary key default uuid_generate_v4(),
  excursion_id uuid not null references public.excursions(id) on delete cascade,
  url          text not null,
  alt          text,
  sort_order   integer not null default 0
);

create index excursion_images_excursion_idx on public.excursion_images(excursion_id);

create table public.excursion_faqs (
  id           uuid primary key default uuid_generate_v4(),
  excursion_id uuid not null references public.excursions(id) on delete cascade,
  question     text not null,
  answer       text not null,
  sort_order   integer not null default 0
);

create index excursion_faqs_excursion_idx on public.excursion_faqs(excursion_id);

create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');

create table public.reservations (
  id            uuid primary key default uuid_generate_v4(),
  excursion_id  uuid references public.excursions(id) on delete set null,
  customer_name text not null,
  phone         text not null,
  email         text,
  start_date    date not null,
  people        integer not null check (people > 0),
  total         integer,
  notes         text,
  status        public.reservation_status not null default 'pending',
  created_at    timestamptz not null default now()
);

create index reservations_excursion_idx on public.reservations(excursion_id);
create index reservations_status_idx on public.reservations(status);
create index reservations_date_idx on public.reservations(start_date);

create table public.site_content (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- Trigger: updated_at automático en excursions
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger excursions_updated_at
  before update on public.excursions
  for each row execute function public.set_updated_at();

-- Row Level Security
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

-- ------------------------------------------------------------
-- 3) DATOS: categorías + contenido del sitio
-- ------------------------------------------------------------
insert into public.categories (slug, name, description) values
  ('salta', 'Desde Salta', 'Excursiones con salida desde la ciudad de Salta'),
  ('jujuy', 'Desde Jujuy', 'Excursiones con salida desde Tilcara y la Quebrada de Humahuaca');

insert into public.site_content (key, value) values
  ('hero_title',    'Cuando dudes del camino, seguí al Norte'),
  ('hero_subtitle', 'Disfruta del paisaje. Viví la experiencia. Compartí aventuras.'),
  ('about_text',    'Somos una agencia de turismo orientada al trekking y turismo alternativo. Buscamos reversionar cada destino y darle nuestro toque ¡a Pura Aventura!'),
  ('whatsapp',      '5493874039502'),
  ('email',         'puraaventuratrekking@gmail.com'),
  ('instagram',     'https://www.instagram.com/puraaventurasalta/'),
  ('facebook',      'https://www.facebook.com/puraaventurasalta/'),
  ('tiktok',        'https://www.tiktok.com/@puraaventurasalta');

-- ------------------------------------------------------------
-- 4) EXCURSIONES (precios ARS por persona, sitio actual)
-- ------------------------------------------------------------
with salta as (select id from public.categories where slug='salta'),
     jujuy as (select id from public.categories where slug='jujuy')
insert into public.excursions
  (slug, name, location, category_id, price, price_note, duration, schedule, difficulty, short_desc, description, included, booking_lead, image_url, display_order)
values
  (
    'excursion-a-cachi-desde-salta',
    'Excursión a Cachi: Un viaje en el tiempo desde Salta',
    'Cachi, Salta',
    (select id from salta), 48000, null,
    '1 (un) día', '7:00 a 19:00hs', 'Baja',
    'Un viaje en el tiempo por los Valles Calchaquíes.',
    'Recorrido por la emblemática Cuesta del Obispo y la Quebrada de Escoipe hasta llegar a Cachi, un pueblo colonial entre cerros y cardones. Miradores, recta de Tin Tin, Parque Nacional Los Cardones y el casco histórico con su iglesia y museo arqueológico.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg', 1
  ),
  (
    'salinas-grandes-purmamarca-desde-salta',
    'Salinas Grandes desde Salta: Mar blanco de película',
    'Salinas Grandes, Jujuy',
    (select id from salta), 58000, null,
    '1 (un) día', '7:00 a 20:00hs', 'Baja',
    'El tercer salar más grande de Sudamérica.',
    'Salida desde Salta hacia Jujuy cruzando la Cuesta de Lipán (4.170 msnm) hasta las imponentes Salinas Grandes. Incluye parada en Purmamarca para conocer el Cerro de los Siete Colores. Un paisaje blanco infinito ideal para fotos increíbles.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg', 2
  ),
  (
    'cascada-escondida-san-lorenzo-salta',
    'Cascada Escondida – San Lorenzo: trekking y naturaleza en Salta',
    'San Lorenzo, Salta',
    (select id from salta), 80000, 'Precio x2 personas',
    '1/2 (medio) día', 'Consultar horarios', 'Baja',
    'Trekking por la selva de yungas a pocos minutos de Salta.',
    'Caminata guiada por senderos de la reserva de San Lorenzo entre vegetación de yungas, arroyos y piletones naturales hasta llegar a la Cascada Escondida. Ideal para conectar con la naturaleza sin alejarse de la ciudad.',
    'Guía, seguro, snack.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg', 3
  ),
  (
    'humahuaca-hornocal',
    'Humahuaca + Hornocal “Ruta de los Colores y las Alturas”',
    'Humahuaca, Jujuy',
    (select id from salta), 80000, null,
    '1 (un) día', '7:00 a 19:00hs', 'Media',
    'El alma de la Quebrada en una sola excursión.',
    'Humahuaca se encuentra en el corazón de la Quebrada de Humahuaca (Jujuy, Argentina), declarada Patrimonio de la Humanidad por la UNESCO. El recorrido incluye Purmamarca con el Cerro de los Siete Colores, Tilcara (cuna del carnaval) y, como gran final, el ascenso al imponente Hornocal o Cerro de 14 Colores, a más de 4.300 msnm.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg', 4
  ),
  (
    'tour-a-cafayate-desde-salta',
    'Tour a Cafayate desde Salta: Vinos y Quebrada de las Conchas',
    'Cafayate, Salta',
    (select id from salta), 48000, null,
    '1 (un) día', '7:00 a 20:00hs', 'Baja',
    'Vinos de altura y formaciones rojizas únicas.',
    'Viaje por la Quebrada de las Conchas con paradas en las Garganta del Diablo, El Anfiteatro y Los Castillos. Llegada a Cafayate, capital del torrontés, con visita a bodega y tiempo para recorrer la plaza y sus viñedos.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg', 5
  ),
  (
    'city-tour-salta',
    'City Tour Salta: descubrí la ciudad “tan linda que enamora”',
    'Salta',
    (select id from salta), 30000, null,
    '1/2 (medio) día', 'Consultar horarios', 'Baja',
    'Los imperdibles de la ciudad en medio día.',
    'Recorrido por los puntos más emblemáticos de Salta: Plaza 9 de Julio, Catedral Basílica, Cabildo, cerro San Bernardo, monumento a Güemes y San Lorenzo. Perfecto para los primeros días en la ciudad.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/02/Imagen.jpeg', 6
  ),
  (
    'trekking-andino-llamas-patapampa-tilcara',
    'Trekking andino con llamas – Ruta Patapampa',
    'Tilcara, Jujuy',
    (select id from jujuy), 320000, 'Precio x2 personas',
    '1/2 (medio) día', 'Consultar horarios', 'Baja',
    'Caminata ancestral con llamas por la puna jujeña.',
    'Experiencia de trekking andino acompañado por llamas cargueras, recreando las rutas caravaneras prehispánicas por la zona de Patapampa. Paisajes de altura, cultura andina y contacto directo con las comunidades locales.',
    'Guía local, llamas, seguro.', 'Reservá con anticipación, cupos limitados.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg', 7
  ),
  (
    'caravana-de-llamas-centro-de-interpetacion-tilcara',
    'Trekking andino con llamas en Tilcara: experiencia corta y cultural',
    'Tilcara, Jujuy',
    (select id from jujuy), 100000, 'Precio x2 personas',
    '1/2 (medio) día', 'Consultar horarios', 'Baja',
    'Versión corta y cultural de la caminata con llamas.',
    'Caminata accesible con llamas por los alrededores de Tilcara, con visita al centro de interpretación. Una experiencia cultural ideal para toda la familia y para quienes tienen poco tiempo en la Quebrada.',
    'Guía local, llamas, seguro.', 'Reservá con anticipación, cupos limitados.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg', 8
  ),
  (
    'excursion-humahuaca-hornocal-quebrada-de-las-senoritas',
    'Humahuaca + Hornocal + Quebrada de las Señoritas (Combo Triple)',
    'Tilcara, Jujuy',
    (select id from jujuy), 70000, null,
    '1 (un) día', 'Consultar horarios', 'Media',
    'Tres joyas de la Quebrada en un solo día.',
    'Combo que combina Humahuaca, el Cerro de 14 Colores (Hornocal) y el trekking por la Quebrada de las Señoritas en Uquía, con sus formaciones rojizas. Salida desde Tilcara recorriendo lo mejor de la Quebrada declarada Patrimonio de la Humanidad.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0023.jpg', 9
  ),
  (
    'salinas-grandes-purmamarca-desde-tilcara',
    'Salinas Grandes + Purmamarca desde Tilcara: Paisajes de película',
    'Salinas Grandes, Jujuy',
    (select id from jujuy), 48000, null,
    '1 (un) día', 'Consultar horarios', 'Baja',
    'El salar y el Cerro de los Siete Colores desde la Quebrada.',
    'Salida desde Tilcara hacia Purmamarca y ascenso por la Cuesta de Lipán hasta las Salinas Grandes. Tiempo libre en el salar para fotos y regreso por Purmamarca con su pueblo de adobe y el famoso cerro multicolor.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg', 10
  ),
  (
    'excursion-iruya-desde-tilcara',
    'Iruya desde Tilcara: Pueblo mágico en la montaña',
    'Iruya, Salta',
    (select id from jujuy), 160000, null,
    '1 (un) día', 'Consultar horarios', 'Baja',
    'El pueblo colgado de la montaña.',
    'Travesía hacia Iruya, un pueblo salteño encaramado a 2.780 msnm al que se llega por un camino de cornisa que supera el Abra del Cóndor (4.000 msnm). Calles empedradas, casas de adobe y paisajes que parecen detenidos en el tiempo.',
    'Traslado, seguro, guiado.', 'Reservá con anticipación, cupos limitados.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg', 11
  ),
  (
    'termas-de-jordan-un-tesoro-natural',
    'Termas de Jordán: Un tesoro natural',
    'San Francisco, Jujuy',
    (select id from jujuy), 150000, null,
    '1 (un) día', 'Consultar horarios', 'Baja',
    'Aguas termales entre montañas y selva de yungas.',
    'Escapada a las Termas del Jordán, en plena selva de yungas jujeñas. Piletones de agua caliente natural, senderos selváticos y un entorno ideal para relajarse en contacto total con la naturaleza.',
    'Traslado, seguro, guiado.', 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg', 12
  ),
  (
    'cafayate-trekking-y-degustacion',
    'Trekking en Cafayate',
    'Cafayate, Salta',
    (select id from salta), null, 'Consultar precio',
    '1 (un) día', 'Consultar horarios', 'Media',
    'Caminatas entre viñedos y quebradas del valle calchaquí.',
    'Trekking guiado por los alrededores de Cafayate: quebradas, ríos y formaciones rocosas del Valle Calchaquí, con opción de cerrar el día con degustación de vinos de altura.',
    'Guía, seguro.', 'Consultar disponibilidad.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_173856-e1745003053876.jpg', 13
  ),
  (
    'tren-a-las-nubes-san-antonio-de-los-cobres-salta',
    'Tren a las Nubes + San Antonio de los Cobres',
    'San Antonio de los Cobres, Salta',
    (select id from salta), null, 'Consultar precio',
    '1 (un) día', 'Consultar horarios', 'Baja',
    'El viaducto La Polvorilla y la puna salteña.',
    'Excursión hacia la puna salteña siguiendo la ruta del mítico Tren a las Nubes: San Antonio de los Cobres, el viaducto La Polvorilla a 4.200 msnm y paisajes de altura únicos en el mundo.',
    'Traslado, seguro, guiado.', 'Consultar disponibilidad y tarifas del tren.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/02/multimedia.grande.a0870cb228d1086f.5472656e2061206c6173204e756265735f6772616e64652e6a7067.jpg', 14
  ),
  (
    'tren-solar-quebrada-jujuy',
    'Tren Solar de Jujuy | Quebrada de Humahuaca',
    'Volcán, Jujuy',
    (select id from jujuy), null, 'Consultar precio',
    '1 (un) día', 'Consultar horarios', 'Baja',
    'El primer tren solar de Latinoamérica por la Quebrada.',
    'Viaje en el Tren Solar de la Quebrada, una experiencia única que recorre paisajes de la Quebrada de Humahuaca entre Volcán y las localidades quebradeñas, combinando turismo sustentable y cultura andina.',
    'Traslado, seguro, guiado.', 'Consultar disponibilidad y tarifas del tren.',
    'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2.jpg', 15
  );

-- ------------------------------------------------------------
-- 5) FAQs (excursión destacada)
-- ------------------------------------------------------------
insert into public.excursion_faqs (excursion_id, question, answer, sort_order)
select e.id, f.q, f.a, f.ord
from public.excursions e
join (values
  ('¿Se visita el Cerro de los 14 Colores (Hornocal)?',
   'Sí, la excursión incluye el ascenso al mirador del Hornocal, ubicado a más de 4.300 msnm, una de las postales más impresionantes del norte argentino.', 1),
  ('¿Es apta para personas con niños o adultos mayores?',
   'Sí, es una excursión apta para toda la familia. En la cima del Hornocal se recomienda moverse despacio y tomar agua, ya que la altitud puede sentirse.', 2),
  ('¿Qué lugares se recorren además de Humahuaca?',
   'También visitamos Purmamarca (Cerro de los Siete Colores) y Tilcara, hasta llegar a la comunidad del Hornocal.', 3)
) as f(q,a,ord) on e.slug = 'humahuaca-hornocal';

-- ------------------------------------------------------------
-- 6) GALERÍAS DE IMÁGENES (117 fotos desde el sitio actual)
-- ------------------------------------------------------------
with imgs(slug, url, ord) as (values
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg', 0),
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Foto-Febrero-Inprotur-3.jpg', 1),
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_86331.jpg', 2),
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_8748.jpg', 3),
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_90241.jpg', 4),
  ('excursion-a-cachi-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_88231.jpg', 5),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg', 0),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg', 1),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220720_003055.webp', 2),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp', 3),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg', 4),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg', 5),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/vydhc16tnccanj2ja1r7.webp', 6),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220515_145323-scaled.jpg', 7),
  ('salinas-grandes-purmamarca-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/salinas-grandes-despejado.jpg', 8),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg', 0),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115217.jpg', 1),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20241231_103939.jpg', 2),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_114144.jpg', 3),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_131803.jpg', 4),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_120640.jpg', 5),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/06/20250105_132053.jpg', 6),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_103249.jpg', 7),
  ('cascada-escondida-san-lorenzo-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_131907.jpg', 8),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg', 0),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20211217_114825.jpg', 1),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20211217_153927.jpg', 2),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca06.jpg', 3),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg', 4),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca04.jpg', 5),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca02.jpg', 6),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/Inprotur-dic-2021-2.jpg', 7),
  ('humahuaca-hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg', 8),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg', 0),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.14.jpeg', 1),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/FOTO-A.jpeg', 2),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.32.jpeg', 3),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20210913_152549.jpg', 4),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-15-at-11.01.27.jpeg', 5),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_183354.jpg', 6),
  ('tour-a-cafayate-desde-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_184429.jpg', 7),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Imagen.jpeg', 0),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/trav12.jpg', 1),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/7697219537efe087eb0e4a511faaa9b3.jpg', 2),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/imageforentry19-k4a.jpg', 3),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/145.jpg', 4),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/6032946686_908c3c8314_b-1.jpg', 5),
  ('city-tour-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/98-1.jpg', 6),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg', 0),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0024.jpg', 1),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0018.jpg', 2),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0021.jpg', 3),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2025-02-07-at-10.03.16.jpeg', 4),
  ('trekking-andino-llamas-patapampa-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240503-WA0022.jpg', 5),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg', 0),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg', 1),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0018.jpg', 2),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0024.jpg', 3),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0021.jpg', 4),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0028.jpg', 5),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2025-02-07-at-10.03.16.jpeg', 6),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0023.jpg', 0),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0017.jpg', 1),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20240520-WA0124.jpg', 2),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Inprotur-dic-2021-2.jpg', 3),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0021.jpg', 4),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20210904_182627.jpg', 5),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20210904_161207.jpg', 6),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0020.jpg', 7),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20211217_153927.jpg', 8),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg', 0),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp', 1),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220720_003055.webp', 2),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg', 3),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/vydhc16tnccanj2ja1r7.webp', 4),
  ('salinas-grandes-purmamarca-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg', 5),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg', 0),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0080.jpg', 1),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0073.jpg', 2),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0079.jpg', 3),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240625-WA0024.jpg', 4),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0048.jpg', 5),
  ('excursion-iruya-desde-tilcara', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20240501_101631.jpg', 6),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg', 0),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20240714_140005-e1745461815133.jpg', 1),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240626-WA0013.jpg', 2),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0137.jpg', 3),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240909-WA0053.jpg', 4),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0122-e1745461949799.jpg', 5),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0001.jpg', 6),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0125.jpg', 7),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240910-WA0001.jpg', 8),
  ('termas-de-jordan-un-tesoro-natural', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240720-WA0058.jpg', 9),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_173856-e1745003053876.jpg', 0),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_122914.jpg', 1),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.32.jpeg', 2),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG_20230325_003444_176-e1745003447558.webp', 3),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_110724.jpg', 4),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_163030.jpg', 5),
  ('cafayate-trekking-y-degustacion', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG_20230325_003444_383.webp', 6),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/multimedia.grande.a0870cb228d1086f.5472656e2061206c6173204e756265735f6772616e64652e6a7067.jpg', 0),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/punatrendelasnubes087.jpg', 1),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Medidas-Plan-Abril-1024-×-660-px-2024-07-31T152833.913.jpg', 2),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/San-Antonio-de-los-Cobres-2_Mesa-de-trabajo-1-1024x614-1.jpg', 3),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/4fd5e623-1fc9-4883-a227-6fa4c6dd1023.jpg', 4),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Vicuna.jpg', 5),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Img_67440.avif', 6),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta', 'https://norteaventura.com.ar/wp-content/uploads/2025/02/llamass.jpg', 7),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2.jpg', 0),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/0T8A6041.jpg', 1),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/0T8A6083.jpg', 2),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20240408_103832.jpg', 3),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20240408_103857.jpg', 4),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2-1.jpg', 5),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0686.jpg', 6),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_9637.jpg', 7),
  ('tren-solar-quebrada-jujuy', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp', 8)
)
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, i.url, i.ord
from imgs i
join public.excursions e on e.slug = i.slug;

-- ------------------------------------------------------------
-- 7) Ubicación Google Maps por excursión
-- ------------------------------------------------------------
update public.excursions set maps_query = 'Cachi, Salta, Argentina'
  where slug = 'excursion-a-cachi-desde-salta';
update public.excursions set maps_query = 'Salinas Grandes, Jujuy, Argentina'
  where slug = 'salinas-grandes-purmamarca-desde-salta';
update public.excursions set maps_query = 'Cascada Escondida, San Lorenzo, Salta, Argentina'
  where slug = 'cascada-escondida-san-lorenzo-salta';
update public.excursions set maps_query = 'Cerro Hornocal, Humahuaca, Jujuy, Argentina'
  where slug = 'humahuaca-hornocal';
update public.excursions set maps_query = 'Cafayate, Salta, Argentina'
  where slug = 'tour-a-cafayate-desde-salta';
update public.excursions set maps_query = 'Plaza 9 de Julio, Salta, Argentina'
  where slug = 'city-tour-salta';
update public.excursions set maps_query = 'Patapampa, Tilcara, Jujuy, Argentina'
  where slug = 'trekking-andino-llamas-patapampa-tilcara';
update public.excursions set maps_query = 'Tilcara, Jujuy, Argentina'
  where slug = 'caravana-de-llamas-centro-de-interpetacion-tilcara';
update public.excursions set maps_query = 'Uquía, Jujuy, Argentina'
  where slug = 'excursion-humahuaca-hornocal-quebrada-de-las-senoritas';
update public.excursions set maps_query = 'Salinas Grandes, Jujuy, Argentina'
  where slug = 'salinas-grandes-purmamarca-desde-tilcara';
update public.excursions set maps_query = 'Iruya, Salta, Argentina'
  where slug = 'excursion-iruya-desde-tilcara';
update public.excursions set maps_query = 'Termas del Jordán, San Francisco, Jujuy, Argentina'
  where slug = 'termas-de-jordan-un-tesoro-natural';
update public.excursions set maps_query = 'Cafayate, Salta, Argentina'
  where slug = 'cafayate-trekking-y-degustacion';
update public.excursions set maps_query = 'San Antonio de los Cobres, Salta, Argentina'
  where slug = 'tren-a-las-nubes-san-antonio-de-los-cobres-salta';
update public.excursions set maps_query = 'Volcán, Jujuy, Argentina'
  where slug = 'tren-solar-quebrada-jujuy';

-- ------------------------------------------------------------
-- 8) VERIFICACIÓN (debería mostrar 15 excursiones con 6-10 fotos)
-- ------------------------------------------------------------
select e.slug, count(i.id) as fotos
from public.excursions e
left join public.excursion_images i on i.excursion_id = e.id
group by e.slug order by e.slug;
