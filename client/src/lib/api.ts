import type { ReservationRequest, ReservationResponse } from '../types';

const BUSINESS_WHATSAPP = '5493874039502';
const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

/** Fallback local si la API no responde: arma el wa.me igual que el server. */
export function localWhatsAppUrl(r: ReservationRequest): string {
  const fecha = new Date(`${r.startDate}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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

/**
 * Registra la reserva en la API (que persiste en Supabase).
 * Si la API no está disponible, igual devuelve el link de WhatsApp.
 */
export async function createReservation(
  payload: ReservationRequest,
): Promise<ReservationResponse> {
  try {
    const res = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as ReservationResponse;
  } catch {
    return { id: null, whatsappUrl: localWhatsAppUrl(payload) };
  }
}
