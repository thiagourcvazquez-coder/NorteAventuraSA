const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | null): string {
  return value === null ? 'Consultar' : ars.format(value);
}
