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
