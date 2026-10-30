-- ============================================================
-- Norte Aventura — Migración: ubicación Google Maps por excursión
-- Ejecutar en Supabase SQL Editor sobre la base existente.
-- Agrega columna maps_query y la puebla por slug.
-- ============================================================

alter table public.excursions
  add column if not exists maps_query text;

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

-- verificación
select slug, maps_query from public.excursions order by display_order;
