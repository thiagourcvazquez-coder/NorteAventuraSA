import { useState } from 'react';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import type { AdminExcursion } from './Admin';

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';
const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-norte-gray';

const EMPTY: Partial<AdminExcursion> & { category: string } = {
  slug: '',
  name: '',
  location: '',
  category: 'salta',
  tipo: 'clasica',
  price: null,
  price_note: '',
  duration: '1 (un) día',
  schedule: 'Consultar horarios',
  difficulty: 'Baja',
  short_desc: '',
  description: '',
  included: '',
  booking_lead: '',
  image_url: '',
  maps_query: '',
  is_active: true,
  display_order: 99,
};

type Draft = Record<string, unknown> & { category: string };

function toDraft(e: AdminExcursion): Draft {
  const cat = Array.isArray(e.categories) ? e.categories[0] : e.categories;
  return {
    id: e.id,
    slug: e.slug,
    name: e.name,
    location: e.location,
    category: cat?.slug ?? 'salta',
    tipo: e.tipo,
    price: e.price,
    price_note: e.price_note ?? '',
    duration: e.duration,
    schedule: e.schedule ?? '',
    difficulty: e.difficulty,
    short_desc: e.short_desc,
    description: e.description,
    included: e.included ?? '',
    booking_lead: e.booking_lead ?? '',
    image_url: e.image_url ?? '',
    maps_query: e.maps_query ?? '',
    is_active: e.is_active,
    display_order: e.display_order,
  };
}

const FIELD_TO_API: Record<string, string> = {
  name: 'name',
  slug: 'slug',
  location: 'location',
  category: 'category',
  tipo: 'tipo',
  price: 'price',
  price_note: 'priceNote',
  duration: 'duration',
  schedule: 'schedule',
  difficulty: 'difficulty',
  short_desc: 'shortDesc',
  description: 'description',
  included: 'included',
  booking_lead: 'bookingLead',
  image_url: 'imageUrl',
  maps_query: 'mapsQuery',
  is_active: 'isActive',
  display_order: 'displayOrder',
};

function Form({
  draft,
  onChange,
  onSave,
  onCancel,
  saving,
  isNew,
}: {
  draft: Draft;
  onChange: (k: string, v: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  isNew: boolean;
}) {
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    onChange(k, e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value);

  return (
    <div className="border-t border-norte-green/10 bg-norte-cream/50 p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={label}>Nombre</label>
          <input className={input} value={String(draft.name ?? '')} onChange={set('name')} />
        </div>
        <div>
          <label className={label}>Slug (URL)</label>
          <input className={input} value={String(draft.slug ?? '')} onChange={set('slug')} disabled={!isNew} />
        </div>
        <div>
          <label className={label}>Ubicación</label>
          <input className={input} value={String(draft.location ?? '')} onChange={set('location')} />
        </div>
        <div>
          <label className={label}>Origen</label>
          <select className={input} value={String(draft.category)} onChange={set('category')}>
            <option value="salta">Desde Salta</option>
            <option value="jujuy">Desde Jujuy</option>
          </select>
        </div>
        <div>
          <label className={label}>Tipo</label>
          <select className={input} value={String(draft.tipo)} onChange={set('tipo')}>
            <option value="clasica">Clásica</option>
            <option value="trekking">Trekking y experiencias</option>
            <option value="privada">Privada / a medida</option>
          </select>
        </div>
        <div>
          <label className={label}>Dificultad</label>
          <select className={input} value={String(draft.difficulty)} onChange={set('difficulty')}>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div>
          <label className={label}>Precio (ARS, vacío = consultar)</label>
          <input
            className={input}
            type="number"
            value={draft.price === null || draft.price === '' ? '' : String(draft.price)}
            onChange={(e) => onChange('price', e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={label}>Nota de precio</label>
          <input className={input} value={String(draft.price_note ?? '')} onChange={set('price_note')} placeholder="Precio x2 personas / Consultar precio" />
        </div>
        <div>
          <label className={label}>Duración</label>
          <input className={input} value={String(draft.duration ?? '')} onChange={set('duration')} />
        </div>
        <div>
          <label className={label}>Horarios</label>
          <input className={input} value={String(draft.schedule ?? '')} onChange={set('schedule')} />
        </div>
        <div>
          <label className={label}>Orden en catálogo</label>
          <input
            className={input}
            type="number"
            value={String(draft.display_order ?? 0)}
            onChange={(e) => onChange('display_order', Number(e.target.value))}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-norte-green">
            <input
              type="checkbox"
              checked={!!draft.is_active}
              onChange={(e) => onChange('is_active', e.target.checked)}
              className="h-4 w-4 accent-[#728316]"
            />
            Activa (visible en el sitio)
          </label>
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        <div>
          <label className={label}>Bajada corta (cards)</label>
          <input className={input} value={String(draft.short_desc ?? '')} onChange={set('short_desc')} />
        </div>
        <div>
          <label className={label}>Descripción completa</label>
          <textarea className={input} rows={3} value={String(draft.description ?? '')} onChange={set('description')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Incluye</label>
            <input className={input} value={String(draft.included ?? '')} onChange={set('included')} />
          </div>
          <div>
            <label className={label}>Cuándo reservar</label>
            <input className={input} value={String(draft.booking_lead ?? '')} onChange={set('booking_lead')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>URL imagen principal</label>
            <input className={input} value={String(draft.image_url ?? '')} onChange={set('image_url')} />
          </div>
          <div>
            <label className={label}>Búsqueda Google Maps</label>
            <input className={input} value={String(draft.maps_query ?? '')} onChange={set('maps_query')} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-norte-green px-7 py-2.5 text-sm font-extrabold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
        >
          {saving ? 'Guardando…' : isNew ? 'Crear excursión' : 'Guardar cambios'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-full px-6 py-2.5 text-sm font-bold text-norte-gray ring-1 ring-norte-green/20 hover:text-norte-green"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function ExcursionEditor({
  list,
  error,
  reload,
}: {
  list: AdminExcursion[] | null;
  error: string;
  reload: () => void;
}) {
  const [editing, setEditing] = useState<Draft | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  if (error) return <p className="p-6 text-sm font-medium text-red-600">{error}</p>;
  if (!list) return <p className="p-6 text-sm text-norte-gray">Cargando excursiones…</p>;

  async function save() {
    const d = editing;
    if (!d) return;
    setSaving(true);
    setErr('');
    try {
      const body: Record<string, unknown> = {};
      for (const [k, api] of Object.entries(FIELD_TO_API)) {
        if (d[k] !== undefined) body[api] = d[k];
      }
      // strings vacíos → null en campos opcionales
      for (const k of ['priceNote', 'schedule', 'included', 'bookingLead', 'imageUrl', 'mapsQuery']) {
        if (body[k] === '') body[k] = null;
      }
      if (creating) {
        await adminFetch('/excursions', { method: 'POST', body: JSON.stringify(body) });
      } else {
        await adminFetch(`/excursions/${d.id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      setEditing(null);
      setCreating(false);
      reload();
    } catch (e) {
      setErr((e as Error).message);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-semibold text-norte-gray">{list.length} excursiones en la base</p>
        <button
          onClick={() => {
            setEditing({ ...EMPTY });
            setCreating(true);
          }}
          className="rounded-full bg-norte-yellow px-5 py-2 text-sm font-extrabold text-norte-green transition hover:bg-norte-yellow-dark"
        >
          + Nueva excursión
        </button>
      </div>
      {err && <p className="px-5 pb-2 text-sm font-medium text-red-600">{err}</p>}
      <ul className="divide-y divide-norte-green/10">
        {creating && editing && (
          <Form
            draft={editing}
            onChange={(k, v) => setEditing((d) => (d ? { ...d, [k]: v } : d))}
            onSave={save}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
            saving={saving}
            isNew
          />
        )}
        {list.map((e) => (
          <li key={e.id}>
            <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.is_active ? 'bg-emerald-500' : 'bg-norte-gray/40'}`}
                title={e.is_active ? 'Activa' : 'Oculta'}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-norte-green">{e.name}</p>
                <p className="text-xs text-norte-gray">
                  {e.location} · {e.tipo} · {e.difficulty}
                </p>
              </div>
              <span className="text-sm font-extrabold text-norte-green">
                {e.price ? formatPrice(e.price, 'es') : 'Consultar'}
              </span>
              <button
                onClick={() => {
                  setEditing(toDraft(e));
                  setCreating(false);
                }}
                className="rounded-full px-4 py-1.5 text-xs font-extrabold text-norte-green ring-1 ring-norte-green/25 transition hover:bg-norte-green hover:text-norte-cream"
              >
                Editar
              </button>
            </div>
            {!creating && editing?.id === e.id && (
              <Form
                draft={editing}
                onChange={(k, v) => setEditing((d) => (d ? { ...d, [k]: v } : d))}
                onSave={save}
                onCancel={() => setEditing(null)}
                saving={saving}
                isNew={false}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
