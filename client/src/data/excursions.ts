import type { Excursion } from '../types';

/**
 * Query de Google Maps por excursión (fallback cuando la DB no tiene maps_query).
 * Espejo de los UPDATE de supabase/migration-maps.sql.
 */
export const MAPS_QUERY: Record<string, string> = {
  'excursion-a-cachi-desde-salta': 'Cachi, Salta, Argentina',
  'salinas-grandes-purmamarca-desde-salta': 'Salinas Grandes, Jujuy, Argentina',
  'cascada-escondida-san-lorenzo-salta': 'Cascada Escondida, San Lorenzo, Salta, Argentina',
  'humahuaca-hornocal': 'Cerro Hornocal, Humahuaca, Jujuy, Argentina',
  'tour-a-cafayate-desde-salta': 'Cafayate, Salta, Argentina',
  'city-tour-salta': 'Plaza 9 de Julio, Salta, Argentina',
  'trekking-andino-llamas-patapampa-tilcara': 'Patapampa, Tilcara, Jujuy, Argentina',
  'caravana-de-llamas-centro-de-interpetacion-tilcara': 'Tilcara, Jujuy, Argentina',
  'excursion-humahuaca-hornocal-quebrada-de-las-senoritas': 'Uquía, Jujuy, Argentina',
  'salinas-grandes-purmamarca-desde-tilcara': 'Salinas Grandes, Jujuy, Argentina',
  'excursion-iruya-desde-tilcara': 'Iruya, Salta, Argentina',
  'termas-de-jordan-un-tesoro-natural': 'Termas del Jordán, San Francisco, Jujuy, Argentina',
  'cafayate-trekking-y-degustacion': 'Cafayate, Salta, Argentina',
  'tren-a-las-nubes-san-antonio-de-los-cobres-salta': 'San Antonio de los Cobres, Salta, Argentina',
  'tren-solar-quebrada-jujuy': 'Volcán, Jujuy, Argentina',
};

/**
 * Datos de respaldo: réplica del seed de Supabase.
 * Se usan cuando no hay credenciales de Supabase configuradas
 * (desarrollo local / demo sin backend).
 */
export const FALLBACK_EXCURSIONS: Excursion[] = [
  {
    slug: 'excursion-a-cachi-desde-salta',
    name: 'Excursión a Cachi: Un viaje en el tiempo desde Salta',
    location: 'Cachi, Salta',
    category: 'salta',
    price: 48000,
    duration: '1 (un) día',
    schedule: '7:00 a 19:00hs',
    difficulty: 'Baja',
    shortDesc: 'Un viaje en el tiempo por los Valles Calchaquíes.',
    description:
      'Recorrido por la emblemática Cuesta del Obispo y la Quebrada de Escoipe hasta llegar a Cachi, un pueblo colonial entre cerros y cardones. Miradores, recta de Tin Tin, Parque Nacional Los Cardones y el casco histórico con su iglesia y museo arqueológico.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg',
  },
  {
    slug: 'salinas-grandes-purmamarca-desde-salta',
    name: 'Salinas Grandes desde Salta: Mar blanco de película',
    location: 'Salinas Grandes, Jujuy',
    category: 'salta',
    price: 58000,
    duration: '1 (un) día',
    schedule: '7:00 a 20:00hs',
    difficulty: 'Baja',
    shortDesc: 'El tercer salar más grande de Sudamérica.',
    description:
      'Salida desde Salta hacia Jujuy cruzando la Cuesta de Lipán (4.170 msnm) hasta las imponentes Salinas Grandes. Incluye parada en Purmamarca para conocer el Cerro de los Siete Colores. Un paisaje blanco infinito ideal para fotos increíbles.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg',
  },
  {
    slug: 'cascada-escondida-san-lorenzo-salta',
    name: 'Cascada Escondida – San Lorenzo: trekking y naturaleza en Salta',
    location: 'San Lorenzo, Salta',
    category: 'salta',
    price: 80000,
    priceNote: 'Precio x2 personas',
    duration: '1/2 (medio) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'Trekking por la selva de yungas a pocos minutos de Salta.',
    description:
      'Caminata guiada por senderos de la reserva de San Lorenzo entre vegetación de yungas, arroyos y piletones naturales hasta llegar a la Cascada Escondida. Ideal para conectar con la naturaleza sin alejarse de la ciudad.',
    included: 'Guía, seguro, snack.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg',
  },
  {
    slug: 'humahuaca-hornocal',
    name: 'Humahuaca + Hornocal “Ruta de los Colores y las Alturas”',
    location: 'Humahuaca, Jujuy',
    category: 'salta',
    price: 80000,
    duration: '1 (un) día',
    schedule: '7:00 a 19:00hs',
    difficulty: 'Media',
    shortDesc: 'El alma de la Quebrada en una sola excursión.',
    description:
      'Humahuaca se encuentra en el corazón de la Quebrada de Humahuaca (Jujuy, Argentina), declarada Patrimonio de la Humanidad por la UNESCO. El recorrido incluye Purmamarca con el Cerro de los Siete Colores, Tilcara (cuna del carnaval) y, como gran final, el ascenso al imponente Hornocal o Cerro de 14 Colores, a más de 4.300 msnm.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg',
    faqs: [
      {
        question: '¿Se visita el Cerro de los 14 Colores (Hornocal)?',
        answer:
          'Sí, la excursión incluye el ascenso al mirador del Hornocal, ubicado a más de 4.300 msnm, una de las postales más impresionantes del norte argentino.',
      },
      {
        question: '¿Es apta para personas con niños o adultos mayores?',
        answer:
          'Sí, es una excursión apta para toda la familia. En la cima del Hornocal se recomienda moverse despacio y tomar agua, ya que la altitud puede sentirse.',
      },
      {
        question: '¿Qué lugares se recorren además de Humahuaca?',
        answer:
          'También visitamos Purmamarca (Cerro de los Siete Colores) y Tilcara, hasta llegar a la comunidad del Hornocal.',
      },
    ],
  },
  {
    slug: 'tour-a-cafayate-desde-salta',
    name: 'Tour a Cafayate desde Salta: Vinos y Quebrada de las Conchas',
    location: 'Cafayate, Salta',
    category: 'salta',
    price: 48000,
    duration: '1 (un) día',
    schedule: '7:00 a 20:00hs',
    difficulty: 'Baja',
    shortDesc: 'Vinos de altura y formaciones rojizas únicas.',
    description:
      'Viaje por la Quebrada de las Conchas con paradas en la Garganta del Diablo, El Anfiteatro y Los Castillos. Llegada a Cafayate, capital del torrontés, con visita a bodega y tiempo para recorrer la plaza y sus viñedos.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg',
  },
  {
    slug: 'city-tour-salta',
    name: 'City Tour Salta: descubrí la ciudad “tan linda que enamora”',
    location: 'Salta',
    category: 'salta',
    price: 30000,
    duration: '1/2 (medio) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'Los imperdibles de la ciudad en medio día.',
    description:
      'Recorrido por los puntos más emblemáticos de Salta: Plaza 9 de Julio, Catedral Basílica, Cabildo, cerro San Bernardo, monumento a Güemes y San Lorenzo. Perfecto para los primeros días en la ciudad.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/02/Imagen.jpeg',
  },
  {
    slug: 'trekking-andino-llamas-patapampa-tilcara',
    name: 'Trekking andino con llamas – Ruta Patapampa',
    location: 'Tilcara, Jujuy',
    category: 'jujuy',
    price: 320000,
    priceNote: 'Precio x2 personas',
    duration: '1/2 (medio) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'Caminata ancestral con llamas por la puna jujeña.',
    description:
      'Experiencia de trekking andino acompañado por llamas cargueras, recreando las rutas caravaneras prehispánicas por la zona de Patapampa. Paisajes de altura, cultura andina y contacto directo con las comunidades locales.',
    included: 'Guía local, llamas, seguro.',
    bookingLead: 'Reservá con anticipación, cupos limitados.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg',
  },
  {
    slug: 'caravana-de-llamas-centro-de-interpetacion-tilcara',
    name: 'Trekking andino con llamas en Tilcara: experiencia corta y cultural',
    location: 'Tilcara, Jujuy',
    category: 'jujuy',
    price: 100000,
    priceNote: 'Precio x2 personas',
    duration: '1/2 (medio) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'Versión corta y cultural de la caminata con llamas.',
    description:
      'Caminata accesible con llamas por los alrededores de Tilcara, con visita al centro de interpretación. Una experiencia cultural ideal para toda la familia y para quienes tienen poco tiempo en la Quebrada.',
    included: 'Guía local, llamas, seguro.',
    bookingLead: 'Reservá con anticipación, cupos limitados.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg',
  },
  {
    slug: 'excursion-humahuaca-hornocal-quebrada-de-las-senoritas',
    name: 'Humahuaca + Hornocal + Quebrada de las Señoritas (Combo Triple)',
    location: 'Tilcara, Jujuy',
    category: 'jujuy',
    price: 70000,
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Media',
    shortDesc: 'Tres joyas de la Quebrada en un solo día.',
    description:
      'Combo que combina Humahuaca, el Cerro de 14 Colores (Hornocal) y el trekking por la Quebrada de las Señoritas en Uquía, con sus formaciones rojizas. Salida desde Tilcara recorriendo lo mejor de la Quebrada declarada Patrimonio de la Humanidad.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/02/IMG-20250207-WA0023.jpg',
  },
  {
    slug: 'salinas-grandes-purmamarca-desde-tilcara',
    name: 'Salinas Grandes + Purmamarca desde Tilcara: Paisajes de película',
    location: 'Salinas Grandes, Jujuy',
    category: 'jujuy',
    price: 48000,
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'El salar y el Cerro de los Siete Colores desde la Quebrada.',
    description:
      'Salida desde Tilcara hacia Purmamarca y ascenso por la Cuesta de Lipán hasta las Salinas Grandes. Tiempo libre en el salar para fotos y regreso por Purmamarca con su pueblo de adobe y el famoso cerro multicolor.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg',
  },
  {
    slug: 'excursion-iruya-desde-tilcara',
    name: 'Iruya desde Tilcara: Pueblo mágico en la montaña',
    location: 'Iruya, Salta',
    category: 'jujuy',
    price: 160000,
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'El pueblo colgado de la montaña.',
    description:
      'Travesía hacia Iruya, un pueblo salteño encaramado a 2.780 msnm al que se llega por un camino de cornisa que supera el Abra del Cóndor (4.000 msnm). Calles empedradas, casas de adobe y paisajes que parecen detenidos en el tiempo.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá con anticipación, cupos limitados.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg',
  },
  {
    slug: 'termas-de-jordan-un-tesoro-natural',
    name: 'Termas de Jordán: Un tesoro natural',
    location: 'San Francisco, Jujuy',
    category: 'jujuy',
    price: 150000,
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'Aguas termales entre montañas y selva de yungas.',
    description:
      'Escapada a las Termas del Jordán, en plena selva de yungas jujeñas. Piletones de agua caliente natural, senderos selváticos y un entorno ideal para relajarse en contacto total con la naturaleza.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg',
  },
  {
    slug: 'cafayate-trekking-y-degustacion',
    name: 'Trekking en Cafayate',
    location: 'Cafayate, Salta',
    category: 'salta',
    price: null,
    priceNote: 'Consultar precio',
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Media',
    shortDesc: 'Caminatas entre viñedos y quebradas del valle calchaquí.',
    description:
      'Trekking guiado por los alrededores de Cafayate: quebradas, ríos y formaciones rocosas del Valle Calchaquí, con opción de cerrar el día con degustación de vinos de altura.',
    included: 'Guía, seguro.',
    bookingLead: 'Consultar disponibilidad.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/02/20240511_173856-e1745003053876.jpg',
  },
  {
    slug: 'tren-a-las-nubes-san-antonio-de-los-cobres-salta',
    name: 'Tren a las Nubes + San Antonio de los Cobres',
    location: 'San Antonio de los Cobres, Salta',
    category: 'salta',
    price: null,
    priceNote: 'Consultar precio',
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'El viaducto La Polvorilla y la puna salteña.',
    description:
      'Excursión hacia la puna salteña siguiendo la ruta del mítico Tren a las Nubes: San Antonio de los Cobres, el viaducto La Polvorilla a 4.200 msnm y paisajes de altura únicos en el mundo.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Consultar disponibilidad y tarifas del tren.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/02/multimedia.grande.a0870cb228d1086f.5472656e2061206c6173204e756265735f6772616e64652e6a7067.jpg',
  },
  {
    slug: 'tren-solar-quebrada-jujuy',
    name: 'Tren Solar de Jujuy | Quebrada de Humahuaca',
    location: 'Volcán, Jujuy',
    category: 'jujuy',
    price: null,
    priceNote: 'Consultar precio',
    duration: '1 (un) día',
    schedule: 'Consultar horarios',
    difficulty: 'Baja',
    shortDesc: 'El primer tren solar de Latinoamérica por la Quebrada.',
    description:
      'Viaje en el Tren Solar de la Quebrada, una experiencia única que recorre paisajes de la Quebrada de Humahuaca entre Volcán y las localidades quebradeñas, combinando turismo sustentable y cultura andina.',
    included: 'Traslado, seguro, guiado.',
    bookingLead: 'Consultar disponibilidad y tarifas del tren.',
    imageUrl:
      'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2.jpg',
  },
];
