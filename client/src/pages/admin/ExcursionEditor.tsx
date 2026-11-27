import { useState } from 'react';
import { GALLERIES } from '../../data/galleries';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import type { AdminExcursion } from './Admin';
import { FaqEditor, GalleryEditor, ImageUpload, SectionsEditor, type ExcursionContent } from './ContentFields';

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';
const label = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-norte-gray';

const EMPTY: Partial<AdminExcursion> & { category: string } = {
  slug: '',
  name: '',
  location: '',
  category: 'salta',
  price: null,
  price_note: '',
  duration: '1 día',
  schedule: 'Consultar horarios',
  difficulty: 'Baja',
  short_desc: '',
  description: '',
  included: '',
  booking_lead: '',
  image_url: '',
  cover_url: '',
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
    cover_url: e.cover_url ?? '',
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
  cover_url: 'coverUrl',
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
  content,
  onContent,
}: {
  content: ExcursionContent | null;
  onContent: (c: ExcursionContent) => void;
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
        <div>
          <label className={label}>Búsqueda Google Maps</label>
          <input className={input} value={String(draft.maps_query ?? '')} onChange={set('maps_query')} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <label className={label}>Foto de la card (catálogo)</label>
          <ImageUpload value={String(draft.image_url ?? '')} onChange={(u) => onChange('image_url', u)} folder="cards" />
        </div>
        <div>
          <label className={label}>Portada de la excursión</label>
          <ImageUpload
            value={String(draft.cover_url ?? '')}
            onChange={(u) => onChange('cover_url', u)}
            folder="portadas"
            hint="Si la dejás vacía se usa la portada con mapa que ya tiene."
          />
        </div>
      </div>

      <div className="mt-6 space-y-6 border-t border-norte-green/10 pt-5">
        {!content ? (
          <p className="text-sm text-norte-gray">Cargando fotos, preguntas y textos…</p>
        ) : (
          <>
            <div>
              <h4 className="mb-2 text-sm font-extrabold text-norte-green">Textos de la excursión (título + descripción)</h4>
              <SectionsEditor
                sections={content.sections}
                ready={content.sectionsReady}
                onChange={(sections) => onContent({ ...content, sections })}
              />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-extrabold text-norte-green">La experiencia en fotos (galería)</h4>
              <GalleryEditor images={content.images} onChange={(images) => onContent({ ...content, images })} />
            </div>
            <div>
              <h4 className="mb-2 text-sm font-extrabold text-norte-green">Preguntas frecuentes</h4>
              <FaqEditor faqs={content.faqs} onChange={(faqs) => onContent({ ...content, faqs })} />
            </div>
          </>
        )}
      </div>
      <div className="mt-5 flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-norte-green px-7 py-2.5 text-sm font-extrabold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
        >
          {saving ? 'Guardando' : isNew ? 'Crear excursión' : 'Guardar cambios'}
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
  const [q, setQ] = useState('');
  const [content, setContent] = useState<ExcursionContent | null>(null);

  async function openEdit(e: AdminExcursion) {
    setEditing(toDraft(e));
    setCreating(false);
    setContent(null);
    try {
      const c = await adminFetch<ExcursionContent>(`/excursions/${e.id}/content`);
      // Si la excursión todavía usa la galería de respaldo, se muestra para poder editarla.
      setContent({ ...c, images: c.images.length ? c.images : (GALLERIES[e.slug] ?? []) });
    } catch (er) {
      setErr((er as Error).message);
      setContent({ faqs: [], images: [], sections: [], sectionsReady: false });
    }
  }

  function openNew() {
    setEditing({ ...EMPTY });
    setCreating(true);
    setContent({ faqs: [], images: [], sections: [], sectionsReady: true });
  }

  if (error) return <p className="p-6 text-sm font-medium text-red-600">{error}</p>;
  if (!list) return <p className="p-6 text-sm text-norte-gray">Cargando excursiones</p>;

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? list.filter((e) =>
        [e.name, e.location, e.difficulty, e.slug].some((f) => f?.toLowerCase().includes(needle)),
      )
    : list;

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
      for (const k of ['priceNote', 'schedule', 'included', 'bookingLead', 'imageUrl', 'coverUrl', 'mapsQuery']) {
        if (body[k] === '') body[k] = null;
      }
      let id = String(d.id ?? '');
      if (creating) {
        const created = await adminFetch<{ id: string }>('/excursions', { method: 'POST', body: JSON.stringify(body) });
        id = created.id;
      } else {
        await adminFetch(`/excursions/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      }
      if (content && id) {
        await adminFetch(`/excursions/${id}/content`, {
          method: 'PUT',
          body: JSON.stringify({
            faqs: content.faqs,
            images: content.images,
            ...(content.sectionsReady ? { sections: content.sections } : {}),
          }),
        });
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
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <p className="text-sm font-semibold text-norte-gray">
          {filtered.length} de {list.length} excursiones
        </p>
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-norte-gray"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, lugar"
            className="w-full rounded-full border border-norte-green/20 bg-white py-2 pl-9 pr-8 text-sm text-norte-green outline-none placeholder:text-norte-gray/60 focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-norte-gray hover:text-norte-green"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={openNew}
          className="ml-auto rounded-full bg-norte-yellow px-5 py-2 text-sm font-extrabold text-norte-green transition hover:bg-norte-yellow-dark"
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
            content={content}
            onContent={setContent}
          />
        )}
        {filtered.length === 0 && (
          <li className="px-5 py-8 text-center text-sm font-semibold text-norte-gray">
            No hay excursiones que coincidan con “{q}”.
          </li>
        )}
        {filtered.map((e) => (
          <li key={e.id}>
            <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.is_active ? 'bg-emerald-500' : 'bg-norte-gray/40'}`}
                title={e.is_active ? 'Activa' : 'Oculta'}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-norte-green">{e.name}</p>
                <p className="text-xs text-norte-gray">
                  {e.location} · {e.difficulty}
                </p>
              </div>
              <span className="text-sm font-extrabold text-norte-green">
                {e.price ? formatPrice(e.price, 'es') : 'Consultar'}
              </span>
              <button
                onClick={() => openEdit(e)}
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
                content={content}
                onContent={setContent}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
