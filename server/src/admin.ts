import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabase } from './supabase.js';

export const adminRouter = Router();

const TOKEN_TTL = '12h';

function jwtSecret(): string {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? 'dev-secret';
}

/** POST /api/admin/login — { username, password } → { token } */
adminRouter.post('/login', (req: Request, res: Response) => {
  const { username, password } = (req.body ?? {}) as { username?: string; password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  const expectedUser = process.env.ADMIN_USERNAME;
  if (!expected) {
    res.status(503).json({ error: 'ADMIN_PASSWORD no configurada' });
    return;
  }
  if (expectedUser && username !== expectedUser) {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    return;
  }
  if (!password || password !== expected) {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    return;
  }
  res.json({ token: jwt.sign({ role: 'admin' }, jwtSecret(), { expiresIn: TOKEN_TTL }) });
});

/** Middleware: exige Bearer <jwt> válido. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    jwt.verify(token, jwtSecret());
    next();
  } catch {
    res.status(401).json({ error: 'No autorizado' });
  }
}

const FIELD_MAP: Record<string, string> = {
  slug: 'slug',
  name: 'name',
  location: 'location',
  category: 'category', // slug de categoría → se resuelve a category_id
  tipo: 'tipo',
  price: 'price',
  priceNote: 'price_note',
  duration: 'duration',
  schedule: 'schedule',
  difficulty: 'difficulty',
  shortDesc: 'short_desc',
  description: 'description',
  included: 'included',
  bookingLead: 'booking_lead',
  imageUrl: 'image_url',
  coverUrl: 'cover_url',
  mapsQuery: 'maps_query',
  isActive: 'is_active',
  displayOrder: 'display_order',
};

function toRow(body: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, col] of Object.entries(FIELD_MAP)) {
    if (k === 'category') continue; // se resuelve aparte
    if (body[k] !== undefined) row[col] = body[k];
  }
  return row;
}

// A partir de acá todo requiere admin
adminRouter.use(requireAdmin);

/** GET /api/admin/reservations — lista completa ordenada por fecha de creación. */
adminRouter.get('/reservations', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, error } = await supabase
    .from('reservations')
    .select('*, excursions(name, slug)')
    .order('created_at', { ascending: false });
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

/** PATCH /api/admin/reservations/:id — cambiar estado de la reserva. */
adminRouter.patch('/reservations/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const status = String(req.body?.status ?? '');
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    res.status(400).json({ error: 'status inválido' });
    return;
  }
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

/** GET /api/admin/excursions — todas, incluidas inactivas. */
adminRouter.get('/excursions', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, error } = await supabase
    .from('excursions')
    .select('*, categories(slug)')
    .order('display_order');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

async function categoryId(categorySlug: unknown): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase || !categorySlug) return null;
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', String(categorySlug))
    .single();
  return data?.id ?? null;
}

/** POST /api/admin/excursions — crear excursión. */
adminRouter.post('/excursions', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = toRow(req.body ?? {});
  for (const required of ['slug', 'name', 'location', 'duration', 'short_desc', 'description']) {
    if (!row[required]) {
      res.status(400).json({ error: `Falta ${required}` });
      return;
    }
  }
  const catId = await categoryId(req.body?.category);
  if (!catId) {
    res.status(400).json({ error: 'category debe ser slug válido (salta | jujuy)' });
    return;
  }
  row.category_id = catId;
  const { data, error } = await supabase.from('excursions').insert(row).select().single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

/** PUT /api/admin/excursions/:id — actualizar campos. */
adminRouter.put('/excursions/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = toRow(req.body ?? {});
  if (req.body?.category !== undefined) {
    const catId = await categoryId(req.body.category);
    if (!catId) {
      res.status(400).json({ error: 'category inválida' });
      return;
    }
    row.category_id = catId;
  }
  if (!Object.keys(row).length) {
    res.status(400).json({ error: 'Nada para actualizar' });
    return;
  }
  const { data, error } = await supabase
    .from('excursions')
    .update(row)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

// ============================================================ contenido por excursión

type Row = Record<string, unknown>;

/**
 * Reemplaza todas las filas de una tabla hija (faqs / images / sections) de una excursión.
 * Si el insert falla, restaura lo que había para no perder datos.
 */
async function replaceChildren(
  table: 'excursion_faqs' | 'excursion_images' | 'excursion_sections',
  excursionId: string,
  rows: Row[],
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return 'Supabase no configurado';
  const { data: old, error: readErr } = await supabase.from(table).select('*').eq('excursion_id', excursionId);
  if (readErr) return readErr.message;
  const { error: delErr } = await supabase.from(table).delete().eq('excursion_id', excursionId);
  if (delErr) return delErr.message;
  if (!rows.length) return null;
  const { error: insErr } = await supabase
    .from(table)
    .insert(rows.map((r, i) => ({ ...r, excursion_id: excursionId, sort_order: i })));
  if (insErr) {
    if (old?.length) await supabase.from(table).insert(old);
    return insErr.message;
  }
  return null;
}

const str = (v: unknown, max = 4000) => String(v ?? '').trim().slice(0, max);

/** GET /api/admin/excursions/:id/content — preguntas frecuentes, fotos y bloques de texto. */
adminRouter.get('/excursions/:id/content', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const id = req.params.id;
  const [faqs, images, sections] = await Promise.all([
    supabase.from('excursion_faqs').select('question, answer, sort_order').eq('excursion_id', id).order('sort_order'),
    supabase.from('excursion_images').select('url, sort_order').eq('excursion_id', id).order('sort_order'),
    supabase.from('excursion_sections').select('title, body, sort_order').eq('excursion_id', id).order('sort_order'),
  ]);
  if (faqs.error || images.error) {
    res.status(500).json({ error: (faqs.error ?? images.error)!.message });
    return;
  }
  res.json({
    faqs: faqs.data ?? [],
    images: (images.data ?? []).map((i) => i.url),
    sections: sections.data ?? [],
    // false si todavía no se corrió el SQL de bloques de texto
    sectionsReady: !sections.error,
  });
});

/** PUT /api/admin/excursions/:id/content — { faqs?, images?, sections? } reemplaza lo enviado. */
adminRouter.put('/excursions/:id/content', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const b = (req.body ?? {}) as { faqs?: Row[]; images?: unknown[]; sections?: Row[] };
  const jobs: [Parameters<typeof replaceChildren>[0], Row[]][] = [];

  if (Array.isArray(b.faqs)) {
    jobs.push([
      'excursion_faqs',
      b.faqs.map((f) => ({ question: str(f.question, 300), answer: str(f.answer, 2000) })).filter((f) => f.question && f.answer),
    ]);
  }
  if (Array.isArray(b.images)) {
    jobs.push([
      'excursion_images',
      b.images.map((u) => ({ url: str(u, 1000) })).filter((i) => /^https?:\/\//.test(i.url)),
    ]);
  }
  if (Array.isArray(b.sections)) {
    jobs.push([
      'excursion_sections',
      b.sections.map((x) => ({ title: str(x.title, 200), body: str(x.body, 6000) })).filter((x) => x.title),
    ]);
  }
  for (const [table, rows] of jobs) {
    const err = await replaceChildren(table, id, rows);
    if (err) {
      res.status(500).json({ error: `${table}: ${err}` });
      return;
    }
  }
  res.json({ ok: true });
});

// ============================================================ fotos y contenido del sitio

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

/**
 * POST /api/admin/uploads — { data: base64, contentType, folder? } → { url }
 * Sube la imagen al bucket público "media" de Supabase Storage.
 */
adminRouter.post('/uploads', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, contentType, folder } = (req.body ?? {}) as { data?: string; contentType?: string; folder?: string };
  const ext = contentType ? IMAGE_TYPES[contentType] : undefined;
  if (!data || !ext) {
    res.status(400).json({ error: 'Imagen inválida (JPG, PNG, WebP, AVIF o GIF)' });
    return;
  }
  const buf = Buffer.from(data, 'base64');
  if (!buf.length || buf.length > 4 * 1024 * 1024) {
    res.status(413).json({ error: 'La imagen supera los 4 MB' });
    return;
  }
  const dir = String(folder ?? 'general').replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'general';
  const path = `${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, buf, { contentType, cacheControl: '31536000' });
  if (error) {
    const hint = /bucket/i.test(error.message) ? ' — ¿se corrió el SQL del bucket "media"?' : '';
    res.status(500).json({ error: error.message + hint });
    return;
  }
  const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
  res.status(201).json({ url: pub.publicUrl });
});

/** GET /api/admin/site — claves editables de site_content. */
adminRouter.get('/site', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(Object.fromEntries((data ?? []).map((r) => [r.key, r.value])));
});

const SITE_KEYS = ['hero_image'];

/** PUT /api/admin/site — { hero_image?: url } (vacío = volver a la foto por defecto). */
adminRouter.put('/site', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  for (const key of SITE_KEYS) {
    if (body[key] === undefined) continue;
    const value = str(body[key], 1000);
    const { error } = value
      ? await supabase.from('site_content').upsert({ key, value, updated_at: new Date().toISOString() })
      : await supabase.from('site_content').delete().eq('key', key);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
  res.json({ ok: true });
});

// ============================================================ dashboard

/** GET /api/admin/stats — métricas para el dashboard. */
adminRouter.get('/stats', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const monthStart = new Date();
  monthStart.setDate(1);
  const month = monthStart.toISOString().slice(0, 10);

  const [reservations, finances, commentsPending, excursions] = await Promise.all([
    supabase.from('reservations').select('id,status,payment_status,total,created_at'),
    supabase.from('finances').select('type,amount,date'),
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('excursions').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);
  if (reservations.error) {
    res.status(500).json({ error: reservations.error.message });
    return;
  }
  // finances/comments pueden no existir si falta correr la migración → ceros

  const rows = reservations.data ?? [];
  const fin = finances.error ? [] : (finances.data ?? []);
  const inMonth = (d: string | null) => !!d && d >= month;
  const sum = (list: { type: string; amount: number; date: string }[], type: string, onlyMonth = false) =>
    list.filter((f) => f.type === type && (!onlyMonth || inMonth(f.date))).reduce((a, f) => a + Number(f.amount), 0);

  res.json({
    reservations: {
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      confirmed: rows.filter((r) => r.status === 'confirmed').length,
      cancelled: rows.filter((r) => r.status === 'cancelled').length,
      paidRevenue: rows
        .filter((r) => r.payment_status === 'approved')
        .reduce((a, r) => a + Number(r.total ?? 0), 0),
      monthTotal: rows.filter((r) => inMonth(r.created_at)).length,
    },
    finances: {
      incomeMonth: sum(fin, 'income', true),
      expenseMonth: sum(fin, 'expense', true),
      incomeTotal: sum(fin, 'income'),
      expenseTotal: sum(fin, 'expense'),
      netMonth: sum(fin, 'income', true) - sum(fin, 'expense', true),
    },
    commentsPending: commentsPending.count ?? 0,
    excursionsActive: excursions.count ?? 0,
  });
});

// ============================================================ finanzas

const FIN_FIELDS: Record<string, string> = {
  type: 'type',
  category: 'category',
  concept: 'concept',
  amount: 'amount',
  method: 'method',
  date: 'date',
  notes: 'notes',
  reservationId: 'reservation_id',
};

function finRow(body: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, col] of Object.entries(FIN_FIELDS)) {
    if (body[k] !== undefined) row[col] = body[k];
  }
  return row;
}

function finValid(row: Record<string, unknown>, partial: boolean): string | null {
  if (!partial || row.type !== undefined) {
    if (!['income', 'expense'].includes(String(row.type))) return "type debe ser 'income' | 'expense'";
  }
  if (!partial || row.amount !== undefined) {
    const a = Number(row.amount);
    if (!Number.isFinite(a) || a < 0) return 'amount debe ser un número ≥ 0';
    row.amount = a;
  }
  if (!partial && !row.concept) return 'Falta concept';
  if (!partial && !row.date) row.date = new Date().toISOString().slice(0, 10);
  return null;
}

/** GET /api/admin/finances?type=&from=&to= — lista de movimientos. */
adminRouter.get('/finances', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  let q = supabase
    .from('finances')
    .select('*, reservations(customer_name)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  const { type, from, to } = req.query as Record<string, string | undefined>;
  if (type && ['income', 'expense'].includes(type)) q = q.eq('type', type);
  if (from) q = q.gte('date', from);
  if (to) q = q.lte('date', to);
  const { data, error } = await q;
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

/** GET /api/admin/finances/summary — totales por mes y categoría. */
adminRouter.get('/finances/summary', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, error } = await supabase.from('finances').select('type,category,amount,date');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const byMonth: Record<string, { income: number; expense: number }> = {};
  const byCat: Record<string, number> = {};
  for (const f of data ?? []) {
    const m = String(f.date).slice(0, 7);
    byMonth[m] ??= { income: 0, expense: 0 };
    byMonth[m][f.type as 'income' | 'expense'] += Number(f.amount);
    if (f.type === 'expense') byCat[f.category] = (byCat[f.category] ?? 0) + Number(f.amount);
  }
  res.json({
    byMonth: Object.entries(byMonth)
      .map(([month, v]) => ({ month, ...v, net: v.income - v.expense }))
      .sort((a, b) => b.month.localeCompare(a.month)),
    byCategory: Object.entries(byCat)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total),
  });
});

/** POST /api/admin/finances — crear movimiento. */
adminRouter.post('/finances', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = finRow(req.body ?? {});
  const err = finValid(row, false);
  if (err) {
    res.status(400).json({ error: err });
    return;
  }
  const { data, error } = await supabase.from('finances').insert(row).select().single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

/** PUT /api/admin/finances/:id — editar movimiento. */
adminRouter.put('/finances/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = finRow(req.body ?? {});
  if (!Object.keys(row).length) {
    res.status(400).json({ error: 'Nada para actualizar' });
    return;
  }
  const err = finValid(row, true);
  if (err) {
    res.status(400).json({ error: err });
    return;
  }
  const { data, error } = await supabase
    .from('finances')
    .update(row)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

/** DELETE /api/admin/finances/:id — borrar movimiento. */
adminRouter.delete('/finances/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { error } = await supabase.from('finances').delete().eq('id', req.params.id);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
});

// ============================================================ comentarios

/** GET /api/admin/comments — todos, pendientes primero. */
adminRouter.get('/comments', async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { data, error } = await supabase
    .from('comments')
    .select('*, excursions(name, slug)')
    .order('created_at', { ascending: false });
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

const COMMENT_FIELDS: Record<string, string> = {
  authorName: 'author_name',
  authorLocation: 'author_location',
  excursionId: 'excursion_id',
  rating: 'rating',
  body: 'body',
  status: 'status',
  featured: 'featured',
};

function commentRow(body: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, col] of Object.entries(COMMENT_FIELDS)) {
    if (body[k] !== undefined) row[col] = body[k];
  }
  if (row.rating !== undefined) {
    const r = Number(row.rating);
    row.rating = Number.isInteger(r) && r >= 1 && r <= 5 ? r : null;
  }
  return row;
}

/** POST /api/admin/comments — cargar testimonio manualmente. */
adminRouter.post('/comments', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = commentRow(req.body ?? {});
  if (!row.author_name || !row.body) {
    res.status(400).json({ error: 'Faltan authorName / body' });
    return;
  }
  row.status ??= 'approved';
  const { data, error } = await supabase.from('comments').insert(row).select().single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json(data);
});

/** PUT /api/admin/comments/:id — editar / moderar. */
adminRouter.put('/comments/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const row = commentRow(req.body ?? {});
  if (row.status !== undefined && !['pending', 'approved', 'rejected'].includes(String(row.status))) {
    res.status(400).json({ error: 'status inválido' });
    return;
  }
  if (!Object.keys(row).length) {
    res.status(400).json({ error: 'Nada para actualizar' });
    return;
  }
  const { data, error } = await supabase
    .from('comments')
    .update(row)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

/** DELETE /api/admin/comments/:id — borrar testimonio. */
adminRouter.delete('/comments/:id', async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) {
    res.status(503).json({ error: 'Supabase no configurado' });
    return;
  }
  const { error } = await supabase.from('comments').delete().eq('id', req.params.id);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
});
