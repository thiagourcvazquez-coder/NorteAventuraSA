const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

import type { Lang } from '../i18n';

export function formatPrice(value: number | null, lang: Lang = 'es'): string {
  return value === null ? (lang === 'en' ? 'On request' : 'Consultar') : ars.format(value);
}
