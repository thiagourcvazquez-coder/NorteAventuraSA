import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getSupabase } from './supabase.js';
import { buildWhatsAppUrl, type ReservationPayload } from './whatsapp.js';
import { adminRouter } from './admin.js';
import { createPreference, getPayment, mpEnabled, verifyWebhookSignature } from './mercadopago.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'norte-aventura-api', db: getSupabase() ? 'supabase' : 'none' });
});

/**
 * POST /api/reservations
 * Registra la reserva en Supabase (si está configurado) y devuelve
 * el deep-link de WhatsApp para que el cliente confirme con la agencia.
 */
app.post('/api/reservations', async (req, res) => {
  const b = req.body as Partial<ReservationPayload>;

  const missing = ['excursionSlug', 'excursionName', 'customerName', 'phone', 'startDate', 'people']
    .filter((k) => b[k as keyof ReservationPayload] === undefined || b[k as keyof ReservationPayload] === '');
  if (missing.length) {
    res.status(400).json({ error: `Campos requeridos faltantes: ${missing.join(', ')}` });
    return;
  }
  const people = Number(b.people);
  if (!Number.isInteger(people) || people < 1) {
    res.status(400).json({ error: 'people debe ser un entero > 0' });
    return;
  }

  const payload: ReservationPayload = {
    excursionSlug: String(b.excursionSlug),
    excursionName: String(b.excursionName),
    customerName: String(b.customerName).trim(),
    lastName: b.lastName ? String(b.lastName).trim() : undefined,
    phone: String(b.phone).trim(),
    email: b.email ? String(b.email).trim() : undefined,
    startDate: String(b.startDate),
    people,
    notes: b.notes ? String(b.notes).trim() : undefined,
    country: b.country ? String(b.country).trim() : undefined,
    hotel: b.hotel ? String(b.hotel).trim() : undefined,
    nationality: b.nationality ? String(b.nationality).trim() : undefined,
    province: b.province ? String(b.province).trim() : undefined,
    documentId: b.documentId ? String(b.documentId).trim() : undefined,
    birthDate: b.birthDate ? String(b.birthDate).trim() : undefined,
    paymentMethod: b.paymentMethod ? String(b.paymentMethod).trim() : undefined,
  };

  const fullName = [payload.customerName, payload.lastName].filter(Boolean).join(' ');
  const detailLines = [
    payload.country && `País: ${payload.country}`,
    payload.hotel && `Hotel/Dirección: ${payload.hotel}`,
    payload.nationality && `Nacionalidad: ${payload.nationality}`,
    payload.province && `Provincia: ${payload.province}`,
    payload.documentId && `DNI/Pasaporte: ${payload.documentId}`,
    payload.birthDate && `Fecha de nacimiento: ${payload.birthDate}`,
    payload.paymentMethod && `Pago elegido: ${payload.paymentMethod}`,
  ].filter(Boolean);
  const notes = [payload.notes, detailLines.join(' · ')].filter(Boolean).join('\n') || null;

  let reservationId: string | null = null;
  const supabase = getSupabase();
  if (supabase) {
    const { data: excursion } = await supabase
      .from('excursions')
      .select('id, price')
      .eq('slug', payload.excursionSlug)
      .single();

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        excursion_id: excursion?.id ?? null,
        customer_name: fullName,
        phone: payload.phone,
        email: payload.email ?? null,
        start_date: payload.startDate,
        people: payload.people,
        total: excursion?.price ? excursion.price * payload.people : null,
        notes,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[reservations] Supabase insert error:', error.message);
    } else {
      reservationId = data?.id ?? null;
    }
  } else {
    console.log('[reservations] Sin Supabase — reserva solo vía WhatsApp:', payload.excursionSlug);
  }

  res.status(201).json({
    id: reservationId,
    whatsappUrl: buildWhatsAppUrl(payload),
  });
});

/**
 * POST /api/payments/preference
 * Genera el link de Checkout Pro de Mercado Pago para una reserva.
 * Body: { reservationId } (reserva ya creada en Supabase).
 */
app.post('/api/payments/preference', async (req, res) => {
  if (!mpEnabled()) {
    res.status(503).json({ error: 'Mercado Pago no configurado (MP_ACCESS_TOKEN)' });
    return;
  }
  const supabase = getSupabase();
  const { reservationId } = (req.body ?? {}) as { reservationId?: string };
  if (!reservationId || !supabase) {
    res.status(400).json({ error: 'Se requiere reservationId' });
    return;
  }

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*, excursions(name, price, price_note)')
    .eq('id', reservationId)
    .single();
  if (error || !reservation) {
    res.status(404).json({ error: 'Reserva no encontrada' });
    return;
  }
  const excursion = Array.isArray(reservation.excursions)
    ? reservation.excursions[0]
    : reservation.excursions;
  if (!excursion?.price) {
    res.status(400).json({ error: 'Esta excursión no tiene precio online (consultar)' });
    return;
  }

  // "Precio x2 personas" (base doble): cada unidad cubre 2 personas.
  const baseDoble = !!excursion.price_note?.includes('x2');
  const quantity = baseDoble ? Math.ceil(reservation.people / 2) : reservation.people;

  try {
    const initPoint = await createPreference({
      reservationId,
      title: `${excursion.name} — ${reservation.people} personas (${reservation.start_date})`,
      quantity,
      unitPrice: excursion.price,
      customerEmail: reservation.email ?? undefined,
    });
    res.json({ initPoint });
  } catch (e) {
    console.error('[payments] Error creando preferencia:', e);
    res.status(502).json({ error: 'No se pudo crear el link de pago' });
  }
});

/**
 * POST /api/payments/webhook
 * Notificaciones de Mercado Pago → marca la reserva como pagada.
 */
app.post('/api/payments/webhook', async (req, res) => {
  res.sendStatus(200); // responder rápido a MP siempre

  const body = (req.body ?? {}) as { type?: string; data?: { id?: string | number } };
  const dataId = body.data?.id ?? (req.query.id as string | undefined);
  if (!dataId || (body.type && body.type !== 'payment')) return;

  const ok = verifyWebhookSignature(
    req.headers['x-signature'] as string | undefined,
    req.headers['x-request-id'] as string | undefined,
    String(dataId),
  );
  if (!ok) {
    console.warn('[payments] Webhook con firma inválida');
    return;
  }

  try {
    const payment = await getPayment(dataId);
    if (!payment) return;
    const reservationId = payment.external_reference;
    const supabase = getSupabase();
    if (!reservationId || !supabase) return;

    await supabase
      .from('reservations')
      .update({
        payment_id: String(payment.id),
        payment_status: payment.status,
        paid_at: payment.status === 'approved' ? new Date().toISOString() : null,
        status: payment.status === 'approved' ? 'confirmed' : undefined,
      })
      .eq('id', reservationId);
    console.log(`[payments] Reserva ${reservationId} → ${payment.status}`);
  } catch (e) {
    console.error('[payments] Error en webhook:', e);
  }
});

/**
 * GET /api/comments
 * Testimonios aprobados para mostrar en el sitio.
 */
app.get('/api/comments', async (_req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.json([]);
    return;
  }
  const { data, error } = await supabase
    .from('comments')
    .select('id, author_name, author_location, rating, body, featured, created_at, excursions(name, slug)')
    .eq('status', 'approved')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  // Orden: destacados del sitio, luego Google (el front muestra solo 6), luego el resto.
  const rows = data ?? [];
  res.json([...rows.filter((c) => c.featured), ...(await googleReviews()), ...rows.filter((c) => !c.featured)]);
});

/**
 * Reseñas de Google (Places API New). Google entrega como máximo 5.
 * Sin GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID devuelve [] y el sitio sigue igual.
 * Cache en memoria 6 h por instancia para no pagar una consulta por visita.
 */
let googleCache: { at: number; items: unknown[] } | null = null;
async function googleReviews(): Promise<unknown[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return [];
  if (googleCache && Date.now() - googleCache.at < 6 * 3600_000) return googleCache.items;
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviews' },
    });
    if (!r.ok) throw new Error(`Places ${r.status}`);
    const j = (await r.json()) as {
      reviews?: {
        name: string;
        rating?: number;
        publishTime?: string;
        text?: { text: string };
        originalText?: { text: string };
        authorAttribution?: { displayName?: string };
      }[];
    };
    const items = (j.reviews ?? [])
      .map((rv) => ({
        id: rv.name,
        author_name: rv.authorAttribution?.displayName ?? 'Google',
        author_location: 'Reseña de Google',
        rating: rv.rating ?? null,
        body: (rv.originalText?.text ?? rv.text?.text ?? '').trim(),
        featured: false,
        created_at: rv.publishTime ?? '',
        excursions: null,
      }))
      .filter((c) => c.body);
    googleCache = { at: Date.now(), items };
    return items;
  } catch (e) {
    console.error('google reviews', e);
    return googleCache?.items ?? [];
  }
}

/**
 * POST /api/comments
 * El público deja su testimonio → queda 'pending' hasta moderación.
 */
app.post('/api/comments', async (req, res) => {
  const b = (req.body ?? {}) as {
    authorName?: string;
    authorLocation?: string;
    excursionId?: string;
    rating?: number;
    body?: string;
  };
  const authorName = String(b.authorName ?? '').trim();
  const body = String(b.body ?? '').trim();
  if (!authorName || !body) {
    res.status(400).json({ error: 'Faltan nombre y comentario' });
    return;
  }
  if (authorName.length > 80 || body.length > 600) {
    res.status(400).json({ error: 'Texto demasiado largo' });
    return;
  }
  const rating = Number(b.rating);
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'No se pueden guardar comentarios ahora' });
    return;
  }
  const { error } = await supabase.from('comments').insert({
    author_name: authorName,
    author_location: b.authorLocation ? String(b.authorLocation).trim().slice(0, 80) : null,
    excursion_id: b.excursionId || null,
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5,
    body,
    status: 'pending',
  });
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json({ ok: true });
});

app.use('/api/admin', adminRouter);

export default app;
