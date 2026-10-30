import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getSupabase } from './supabase.js';
import { buildWhatsAppUrl, type ReservationPayload } from './whatsapp.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
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

export default app;
