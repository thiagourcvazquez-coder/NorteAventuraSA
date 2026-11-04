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
    phone: String(b.phone).trim(),
    email: b.email ? String(b.email).trim() : undefined,
    startDate: String(b.startDate),
    people,
    notes: b.notes ? String(b.notes).trim() : undefined,
  };

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
        customer_name: payload.customerName,
        phone: payload.phone,
        email: payload.email ?? null,
        start_date: payload.startDate,
        people: payload.people,
        total: excursion?.price ? excursion.price * payload.people : null,
        notes: payload.notes ?? null,
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

app.use('/api/admin', adminRouter);

export default app;
