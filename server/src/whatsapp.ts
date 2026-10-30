export const BUSINESS_WHATSAPP = process.env.BUSINESS_WHATSAPP ?? '5493874039502';

export interface ReservationPayload {
  excursionSlug: string;
  excursionName: string;
  customerName: string;
  phone: string;
  email?: string;
  startDate: string; // YYYY-MM-DD
  people: number;
  notes?: string;
}

/** Arma el deep-link wa.me con el mensaje de reserva pre-cargado. */
export function buildWhatsAppUrl(r: ReservationPayload): string {
  const fecha = new Date(`${r.startDate}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const lines = [
    'Hola Norte Aventura! Quiero reservar:',
    '',
    `*${r.excursionName}*`,
    `Fecha: ${fecha}`,
    `Personas: ${r.people}`,
    '',
    `Nombre: ${r.customerName}`,
    `Tel: ${r.phone}`,
  ];
  if (r.email) lines.push(`Email: ${r.email}`);
  if (r.notes) lines.push(`Notas: ${r.notes}`);
  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}
