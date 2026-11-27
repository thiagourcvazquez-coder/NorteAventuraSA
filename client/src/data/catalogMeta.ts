import type { Excursion } from '../types';

/**
 * Orden correcto del catálogo, "sale desde" y excursiones a consultar
 * (documento del cliente, noviembre 2026). Las excursiones que no figuren acá
 * (por ejemplo las que se agreguen desde el admin) van al final, en el orden
 * en que vienen de la base.
 */
const ORDER_SALTA = [
  'tour-a-cafayate-desde-salta',
  'excursion-a-cachi-desde-salta',
  'salinas-grandes-purmamarca-desde-salta',
  'humahuaca-hornocal',
  'cascada-escondida-san-lorenzo-salta',
  'city-tour-salta',
  'cerro-elefante-salta',
  'tren-a-las-nubes-san-antonio-de-los-cobres-salta',
  'tren-solar-quebrada-jujuy',
  'termas-de-jordan-desde-salta',
  'cuevas-de-acisibi',
  'puente-del-diablo-la-poma',
  'iruya-trekking-2-dias',
  'cafayate-trekking-y-degustacion',
];

const ORDER_JUJUY = [
  'salinas-grandes-purmamarca-desde-tilcara',
  'excursion-humahuaca-hornocal-quebrada-de-las-senoritas',
  'excursion-iruya-desde-tilcara',
  'castillos-de-huichaira-tilcara',
  'traslado-aeropuerto-jujuy-tilcara',
  'garganta-del-diablo-tilcara',
  'city-tour-pucara-tilcara',
  'salinas-grandes-nocturna',
  'termas-de-reyes-lagunas-de-yala',
  'cuevas-del-wayra',
  'inca-cueva-humahuaca',
  'termas-del-jordan-trekking-de-altura',
  'yungas-jujenas',
  'laguna-de-pozuelo',
  'cascadas-trekking-jujuy',
  'turismo-rural-jujuy',
];

/** Se gestionan por consulta (no se reservan online): se marcan distinto. */
const CONSULT = new Set([
  'termas-de-jordan-desde-salta',
  'cuevas-de-acisibi',
  'puente-del-diablo-la-poma',
  'iruya-trekking-2-dias',
  'cafayate-trekking-y-degustacion',
  'excursion-iruya-desde-tilcara',
  'salinas-grandes-nocturna',
  'cuevas-del-wayra',
  'inca-cueva-humahuaca',
  'termas-del-jordan-trekking-de-altura',
  'yungas-jujenas',
  'laguna-de-pozuelo',
  'cascadas-trekking-jujuy',
  'turismo-rural-jujuy',
]);

const ORIGIN_OVERRIDE: Record<string, string> = {
  'inca-cueva-humahuaca': 'Desde Tilcara / Humahuaca',
  'traslado-aeropuerto-jujuy-tilcara': 'Aeropuerto de Jujuy',
  'yungas-jujenas': 'Desde Jujuy',
  'termas-del-jordan-trekking-de-altura': 'Desde Jujuy',
};

/** "Desde Salta", "Desde Tilcara"… según la excursión. */
export function originOf(e: Pick<Excursion, 'slug' | 'category'>): string {
  return ORIGIN_OVERRIDE[e.slug] ?? (e.category === 'salta' ? 'Desde Salta' : 'Desde Tilcara');
}

/** Sin precio o marcada por el cliente: se consulta por WhatsApp. */
export function isConsult(e: Pick<Excursion, 'slug' | 'price'>): boolean {
  return e.price === null || CONSULT.has(e.slug);
}

const RANK = new Map<string, number>(
  [...ORDER_SALTA, ...ORDER_JUJUY].map((s, i) => [s, i] as [string, number]),
);

export function sortExcursions(list: Excursion[]): Excursion[] {
  const pos = new Map(list.map((e, i) => [e.slug, i]));
  return [...list].sort((a, b) => {
    if (a.category !== b.category) return a.category === 'salta' ? -1 : 1;
    const ra = RANK.get(a.slug) ?? 1000 + pos.get(a.slug)!;
    const rb = RANK.get(b.slug) ?? 1000 + pos.get(b.slug)!;
    return ra - rb;
  });
}
