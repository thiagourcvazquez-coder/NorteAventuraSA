-- ============================================================
-- Norte Aventura — FIX imágenes reales (scrapeadas del WooCommerce)
-- Reemplaza las URLs fabricadas del seed por las reales del sitio.
-- ============================================================

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_173856-e1745003053876.jpg' where slug = 'cafayate-trekking-y-degustacion';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='cafayate-trekking-y-degustacion');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_173856-e1745003053876.jpg',1),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_122914.jpg',2),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.32.jpeg',3),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG_20230325_003444_176-e1745003447558.webp',4),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_110724.jpg',5),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_163030.jpg',6),
  ('cafayate-trekking-y-degustacion','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG_20230325_003444_383.webp',7)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg' where slug = 'caravana-de-llamas-centro-de-interpetacion-tilcara';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='caravana-de-llamas-centro-de-interpetacion-tilcara');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg',1),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg',2),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0018.jpg',3),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0024.jpg',4),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0021.jpg',5),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0028.jpg',6),
  ('caravana-de-llamas-centro-de-interpetacion-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2025-02-07-at-10.03.16.jpeg',7)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg' where slug = 'cascada-escondida-san-lorenzo-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='cascada-escondida-san-lorenzo-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115217.jpg',1),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20241231_103939.jpg',2),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_114144.jpg',3),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_131803.jpg',4),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_120640.jpg',5),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/06/20250105_132053.jpg',6),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_103249.jpg',7),
  ('cascada-escondida-san-lorenzo-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_131907.jpg',8)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/Imagen.jpeg' where slug = 'city-tour-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='city-tour-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/Imagen.jpeg',1),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/trav12.jpg',2),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/7697219537efe087eb0e4a511faaa9b3.jpg',3),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/imageforentry19-k4a.jpg',4),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/145.jpg',5),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/6032946686_908c3c8314_b-1.jpg',6),
  ('city-tour-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/98-1.jpg',7)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg' where slug = 'excursion-a-cachi-desde-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='excursion-a-cachi-desde-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg',1),
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/Foto-Febrero-Inprotur-3.jpg',2),
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_86331.jpg',3),
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_8748.jpg',4),
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_90241.jpg',5),
  ('excursion-a-cachi-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_88231.jpg',6)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0023.jpg' where slug = 'excursion-humahuaca-hornocal-quebrada-de-las-senoritas';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='excursion-humahuaca-hornocal-quebrada-de-las-senoritas');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0023.jpg',1),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0017.jpg',2),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20240520-WA0124.jpg',3),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/Inprotur-dic-2021-2.jpg',4),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0021.jpg',5),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/20210904_182627.jpg',6),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/20210904_161207.jpg',7),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0020.jpg',8),
  ('excursion-humahuaca-hornocal-quebrada-de-las-senoritas','https://norteaventura.com.ar/wp-content/uploads/2025/02/20211217_153927.jpg',9)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg' where slug = 'excursion-iruya-desde-tilcara';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='excursion-iruya-desde-tilcara');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg',1),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0080.jpg',2),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0073.jpg',3),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0079.jpg',4),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240625-WA0024.jpg',5),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0048.jpg',6),
  ('excursion-iruya-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/20240501_101631.jpg',7)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg' where slug = 'humahuaca-hornocal';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='humahuaca-hornocal');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20240520-WA0124.jpg',1),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/03/20211217_114825.jpg',2),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/02/20211217_153927.jpg',3),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca06.jpg',4),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg',5),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca04.jpg',6),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/03/humahuaca02.jpg',7),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/02/Inprotur-dic-2021-2.jpg',8),
  ('humahuaca-hornocal','https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg',9)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg' where slug = 'salinas-grandes-purmamarca-desde-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='salinas-grandes-purmamarca-desde-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg',1),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg',2),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/20220720_003055.webp',3),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp',4),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg',5),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg',6),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/vydhc16tnccanj2ja1r7.webp',7),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/20220515_145323-scaled.jpg',8),
  ('salinas-grandes-purmamarca-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/salinas-grandes-despejado.jpg',9)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg' where slug = 'salinas-grandes-purmamarca-desde-tilcara';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='salinas-grandes-purmamarca-desde-tilcara');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg',1),
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp',2),
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/02/20220720_003055.webp',3),
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/02/07671a8e-08eb-425a-87ae-8085840a54db.jpg',4),
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/02/vydhc16tnccanj2ja1r7.webp',5),
  ('salinas-grandes-purmamarca-desde-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/02/f2c0fcec-f1e3-4888-bcd1-efdaf6c26bcc.jpg',6)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg' where slug = 'termas-del-jordan-trekking-de-altura';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='termas-del-jordan-trekking-de-altura');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg',1),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/20240714_140005-e1745461815133.jpg',2),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240626-WA0013.jpg',3),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0137.jpg',4),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240909-WA0053.jpg',5),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0122-e1745461949799.jpg',6),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0001.jpg',7),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240908-WA0125.jpg',8),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240910-WA0001.jpg',9),
  ('termas-del-jordan-trekking-de-altura','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240720-WA0058.jpg',10)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg' where slug = 'tour-a-cafayate-desde-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='tour-a-cafayate-desde-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg',1),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.14.jpeg',2),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/FOTO-A.jpeg',3),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-21-at-18.03.32.jpeg',4),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20210913_152549.jpg',5),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2024-05-15-at-11.01.27.jpeg',6),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_183354.jpg',7),
  ('tour-a-cafayate-desde-salta','https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_184429.jpg',8)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg' where slug = 'trekking-andino-llamas-patapampa-tilcara';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='trekking-andino-llamas-patapampa-tilcara');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg',1),
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0024.jpg',2),
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0018.jpg',3),
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0021.jpg',4),
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/03/WhatsApp-Image-2025-02-07-at-10.03.16.jpeg',5),
  ('trekking-andino-llamas-patapampa-tilcara','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240503-WA0022.jpg',6)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/multimedia.grande.a0870cb228d1086f.5472656e2061206c6173204e756265735f6772616e64652e6a7067.jpg' where slug = 'tren-a-las-nubes-san-antonio-de-los-cobres-salta';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='tren-a-las-nubes-san-antonio-de-los-cobres-salta');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/multimedia.grande.a0870cb228d1086f.5472656e2061206c6173204e756265735f6772616e64652e6a7067.jpg',1),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/punatrendelasnubes087.jpg',2),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/San-Antonio-de-los-Cobres-2_Mesa-de-trabajo-1-1024x614-1.jpg',3),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/4fd5e623-1fc9-4883-a227-6fa4c6dd1023.jpg',4),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/Vicuna.jpg',5),
  ('tren-a-las-nubes-san-antonio-de-los-cobres-salta','https://norteaventura.com.ar/wp-content/uploads/2025/02/llamass.jpg',6)
) as u(slug,url,ord) on u.slug = e.slug;

update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2-1024x768.jpg' where slug = 'tren-solar-quebrada-jujuy';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='tren-solar-quebrada-jujuy');
insert into public.excursion_images (excursion_id, url, sort_order)
select e.id, u.url, u.ord from public.excursions e join (values
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/0T8A6041.jpg',1),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/0T8A6083.jpg',2),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/20240408_103832.jpg',3),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/20240408_103857.jpg',4),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2-1.jpg',5),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0686.jpg',6),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG_9637.jpg',7),
  ('tren-solar-quebrada-jujuy','https://norteaventura.com.ar/wp-content/uploads/2025/04/cerro-los-7-colores.webp',8)
) as u(slug,url,ord) on u.slug = e.slug;

-- quebrada-de-las-conchas (sin página en Woo): foto real de la Quebrada
update public.excursions set image_url = 'https://norteaventura.com.ar/wp-content/uploads/2025/02/FOTO-A.jpeg' where slug = 'quebrada-de-las-conchas';
delete from public.excursion_images where excursion_id = (select id from public.excursions where slug='quebrada-de-las-conchas');
