import { Router, type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getSupabase } from './supabase.js';

export const adminRouter = Router();

const TOKEN_TTL = '12h';

function jwtSecret(): string {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? 'dev-secret';
}

/** POST /api/admin/login — { password } → { token } */
adminRouter.post('/login', (req: Request, res: Response) => {
  const { password } = (req.body ?? {}) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(503).json({ error: 'ADMIN_PASSWORD no configurada' });
    return;
  }
  if (!password || password !== expected) {
    res.status(401).json({ error: 'Contraseña incorrecta' });
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
