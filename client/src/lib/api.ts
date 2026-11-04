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

/**
 * Crea la preferencia de Mercado Pago para una reserva ya registrada.
 * Devuelve la URL del Checkout Pro (init_point) o null si falla.
 */
export async function createPaymentPreference(reservationId: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/payments/preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { initPoint?: string };
    return data.initPoint ?? null;
  } catch {
    return null;
  }
}

// ------------------------- Admin API -------------------------

const ADMIN_KEY = 'na-admin-token';
export const getAdminToken = () => sessionStorage.getItem(ADMIN_KEY);
export const clearAdminToken = () => sessionStorage.removeItem(ADMIN_KEY);

export async function adminLogin(password: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const { token } = (await res.json()) as { token: string };
  sessionStorage.setItem(ADMIN_KEY, token);
  return true;
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAdminToken() ?? ''}`,
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    throw new Error('Sesión expirada — volvé a ingresar');
  }
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `API ${res.status}`);
  return res.json() as Promise<T>;
}
