import type { Excursion } from '../types';
import type { Lang } from '../i18n';

/**
 * Contenido en inglés por excursión, indexado por slug.
 * Se aplica sobre los datos en español (Supabase o fallback) al renderizar
 * con lang === 'en'. Nombres y ubicaciones quedan siempre en español.
 */
interface ExcursionEn {
  shortDesc?: string;
  description?: string;
  faqs?: { question: string; answer: string }[];
}

export const EXCURSION_EN: Record<string, ExcursionEn> = {
  'excursion-a-cachi-desde-salta': {
    shortDesc: 'A journey back in time through the Calchaquí Valleys.',
    description:
      'A journey along the emblematic Cuesta del Obispo and the Quebrada de Escoipe to Cachi, a colonial village nestled among hills and cacti. Lookouts, the Recta del Tin Tin, Los Cardones National Park and the historic center with its church and archaeological museum.',
  },
  'salinas-grandes-purmamarca-desde-salta': {
    shortDesc: 'The third-largest salt flat in South America.',
    description:
      'Departure from Salta towards Jujuy crossing the Cuesta de Lipán (4,170 masl) up to the imposing Salinas Grandes. Includes a stop in Purmamarca to see the Hill of Seven Colors. An endless white landscape, perfect for incredible photos.',
  },
  'cascada-escondida-san-lorenzo-salta': {
    shortDesc: 'Trekking through the yungas jungle just minutes from Salta.',
    description:
      'Guided hike along the trails of the San Lorenzo reserve through yungas vegetation, streams and natural pools up to the Cascada Escondida. Ideal for connecting with nature without leaving the city.',
  },
  'humahuaca-hornocal': {
    shortDesc: 'The soul of the Quebrada in a single excursion.',
    description:
      'Humahuaca lies in the heart of the Quebrada de Humahuaca (Jujuy, Argentina), a UNESCO World Heritage Site. The route includes Purmamarca with its Hill of Seven Colors, Tilcara (cradle of the carnival) and, as the grand finale, the ascent to the imposing Hornocal or Hill of 14 Colors, at over 4,300 masl.',
    faqs: [
      {
        question: 'Do we visit the Hill of 14 Colors (Hornocal)?',
        answer:
          'Yes, the excursion includes the ascent to the Hornocal lookout, located at over 4,300 masl — one of the most impressive views in northern Argentina.',
      },
      {
        question: 'Is it suitable for children or older adults?',
        answer:
          "Yes, it's a family-friendly excursion. At the Hornocal summit we recommend moving slowly and drinking water, as the altitude can be felt.",
      },
      {
        question: 'What other places do we visit besides Humahuaca?',
        answer:
          'We also visit Purmamarca (Hill of Seven Colors) and Tilcara, before reaching the Hornocal community.',
      },
    ],
  },
  'tour-a-cafayate-desde-salta': {
    shortDesc: 'High-altitude wines and unique red rock formations.',
    description:
      'Drive through the Quebrada de las Conchas with stops at the Garganta del Diablo, El Anfiteatro and Los Castillos. Arrival in Cafayate, capital of torrontés wine, with a winery visit and time to explore the square and its vineyards.',
  },
  'city-tour-salta': {
    shortDesc: "The city's must-sees in half a day.",
    description:
      "A tour of Salta's most iconic spots: Plaza 9 de Julio, the Cathedral Basilica, the Cabildo, San Bernardo hill, the Güemes monument and San Lorenzo. Perfect for your first days in the city.",
  },
  'trekking-andino-llamas-patapampa-tilcara': {
    shortDesc: 'An ancestral llama trek across the Jujuy puna.',
    description:
      'An Andean trekking experience alongside pack llamas, recreating the pre-Hispanic caravan routes through the Patapampa area. High-altitude landscapes, Andean culture and direct contact with local communities.',
  },
  'caravana-de-llamas-centro-de-interpetacion-tilcara': {
    shortDesc: 'A shorter, cultural llama walk.',
    description:
      'An accessible llama walk around Tilcara, including a visit to the interpretation center. A cultural experience ideal for the whole family and for those with limited time in the Quebrada.',
  },
  'excursion-humahuaca-hornocal-quebrada-de-las-senoritas': {
    shortDesc: 'Three gems of the Quebrada in one day.',
    description:
      'A combo combining Humahuaca, the Hill of 14 Colors (Hornocal) and trekking through the Quebrada de las Señoritas in Uquía, with its reddish rock formations. Departure from Tilcara covering the best of the World Heritage Quebrada.',
  },
  'salinas-grandes-purmamarca-desde-tilcara': {
    shortDesc: 'The salt flats and the Hill of Seven Colors from the Quebrada.',
    description:
      'Departure from Tilcara to Purmamarca and ascent via the Cuesta de Lipán to Salinas Grandes. Free time on the salt flats for photos and return through Purmamarca with its adobe village and famous multicolored hill.',
  },
  'excursion-iruya-desde-tilcara': {
    shortDesc: 'The village hanging from the mountain.',
    description:
      'A journey to Iruya, a village in Salta perched at 2,780 masl, reached via a cliff-edge road crossing the Abra del Cóndor (4,000 masl). Cobblestone streets, adobe houses and landscapes that seem frozen in time.',
  },
  'termas-de-jordan-un-tesoro-natural': {
    shortDesc: 'Hot springs between mountains and yungas jungle.',
    description:
      "A getaway to the Termas del Jordán, deep in Jujuy's yungas jungle. Natural hot spring pools, jungle trails and an ideal setting to relax in total contact with nature.",
  },
  'cafayate-trekking-y-degustacion': {
    shortDesc: 'Hikes among vineyards and canyons of the Calchaquí Valley.',
    description:
      'Guided trek around Cafayate: canyons, rivers and rock formations of the Calchaquí Valley, with the option of ending the day tasting high-altitude wines.',
  },
  'tren-a-las-nubes-san-antonio-de-los-cobres-salta': {
    shortDesc: 'The La Polvorilla viaduct and the Salta puna.',
    description:
      'An excursion to the Salta puna following the route of the legendary Tren a las Nubes: San Antonio de los Cobres, the La Polvorilla viaduct at 4,200 masl and high-altitude landscapes unique in the world.',
  },
  'tren-solar-quebrada-jujuy': {
    shortDesc: "Latin America's first solar train through the Quebrada.",
    description:
      'A ride on the Tren Solar de la Quebrada, a unique experience through the landscapes of the Quebrada de Humahuaca between Volcán and the quebrada villages, combining sustainable tourism and Andean culture.',
  },
};

/** Mezcla el contenido EN sobre la excursión en español. */
export function localizeExcursion(e: Excursion, lang: Lang): Excursion {
  if (lang !== 'en') return e;
  const en = EXCURSION_EN[e.slug];
  if (!en) return e;
  return {
    ...e,
    shortDesc: en.shortDesc ?? e.shortDesc,
    description: en.description ?? e.description,
    faqs: en.faqs ?? e.faqs,
  };
}
