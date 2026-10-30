-- ============================================================
-- Norte Aventura — Datos iniciales (catálogo real del sitio actual)
-- Ejecutar DESPUÉS de schema.sql en Supabase SQL Editor
-- ============================================================

insert into public.categories (slug, name, description) values
  ('salta', 'Desde Salta', 'Excursiones con salida desde la ciudad de Salta'),
  ('jujuy', 'Desde Jujuy', 'Excursiones con salida desde Tilcara y la Quebrada de Humahuaca')
on conflict (slug) do nothing;

insert into public.site_content (key, value) values
  ('hero_title',    'Cuando dudes del camino, seguí al Norte'),
  ('hero_subtitle', 'Disfruta del paisaje. Viví la experiencia. Compartí aventuras.'),
  ('about_text',    'Somos una agencia de turismo orientada al trekking y turismo alternativo. Buscamos reversionar cada destino y darle nuestro toque ¡a Pura Aventura!'),
  ('whatsapp',      '5493874039502'),
  ('email',         'puraaventuratrekking@gmail.com'),
  ('instagram',     'https://www.instagram.com/puraaventurasalta/'),
  ('facebook',      'https://www.facebook.com/puraaventurasalta/'),
  ('tiktok',        'https://www.tiktok.com/@puraaventurasalta')
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- Excursiones (precios ARS por persona, relevados del sitio actual)
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
  )
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- FAQs de ejemplo (excursión destacada)
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
) as f(q,a,ord) on e.slug = 'humahuaca-hornocal'
on conflict do nothing;
