import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import type { AdminExcursion } from './Admin';

interface CommentRow {
  id: string;
  author_name: string;
  author_location: string | null;
  excursion_id: string | null;
  rating: number | null;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  created_at: string;
  excursions: { name: string; slug: string } | { name: string; slug: string }[] | null;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Publicado', cls: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rechazado', cls: 'bg-red-100 text-red-700' },
};

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

const empty = { authorName: '', authorLocation: '', rating: '5', body: '', excursionId: '' };

export default function CommentsAdmin({ excursions }: { excursions: AdminExcursion[] | null }) {
  const [rows, setRows] = useState<CommentRow[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [form, setForm] = useState({ ...empty });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    () => adminFetch<CommentRow[]>('/comments').then(setRows).catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  async function update(id: string, patch: Record<string, unknown>) {
    try {
      const updated = await adminFetch<CommentRow>(`/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      });
      setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, ...updated } : r)) ?? rs);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string) {
    if (!window.confirm('¿Borrar este comentario definitivamente?')) return;
    try {
      await adminFetch(`/comments/${id}`, { method: 'DELETE' });
      setRows((rs) => rs?.filter((r) => r.id !== id) ?? rs);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminFetch('/comments', {
        method: 'POST',
        body: JSON.stringify({
          authorName: form.authorName,
          authorLocation: form.authorLocation || undefined,
          excursionId: form.excursionId || undefined,
          rating: Number(form.rating),
          body: form.body,
          status: 'approved',
        }),
      });
      setForm({ ...empty });
      setShowForm(false);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  }

  const pending = (rows ?? []).filter((r) => r.status === 'pending').length;
  const visible = filter === 'all' ? rows ?? [] : (rows ?? []).filter((r) => r.status === filter);

  return (
    <div className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-norte-green/5 p-1">
          {(
            [
              ['all', `Todos (${(rows ?? []).length})`],
              ['pending', `Pendientes (${pending})`],
              ['approved', 'Publicados'],
              ['rejected', 'Rechazados'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                filter === v ? 'bg-norte-green text-norte-cream' : 'text-norte-gray hover:text-norte-green'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-full bg-norte-green px-5 py-2 text-xs font-bold text-norte-cream transition hover:bg-norte-green-light"
        >
          {showForm ? 'Cerrar' : '+ Cargar testimonio'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-4 rounded-xl bg-norte-cream/60 p-5 ring-1 ring-norte-green/10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              placeholder="Nombre del cliente *"
              className={input}
              required
            />
            <input
              value={form.authorLocation}
              onChange={(e) => setForm((f) => ({ ...f, authorLocation: e.target.value }))}
              placeholder="Origen (ej: Buenos Aires)"
              className={input}
            />
            <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={input}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {'★'.repeat(r)}{'☆'.repeat(5 - r)}
                </option>
              ))}
            </select>
            <select
              value={form.excursionId}
              onChange={(e) => setForm((f) => ({ ...f, excursionId: e.target.value }))}
              className={input}
            >
              <option value="">Sin excursión</option>
              {(excursions ?? []).map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Texto del testimonio *"
            rows={3}
            className={`${input} mt-3`}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-full bg-norte-green px-6 py-2.5 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Publicar testimonio'}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {!rows ? (
        <p className="mt-6 text-sm text-norte-gray">Cargando comentarios…</p>
      ) : !visible.length ? (
        <p className="mt-6 text-sm text-norte-gray">No hay comentarios en este estado.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {visible.map((c) => {
            const ex = Array.isArray(c.excursions) ? c.excursions[0] : c.excursions;
            const st = STATUS_LABEL[c.status] ?? STATUS_LABEL.pending;
            return (
              <div key={c.id} className="rounded-xl bg-white p-5 ring-1 ring-norte-green/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-extrabold text-norte-green">{c.author_name}</p>
                      {c.author_location && <p className="text-xs text-norte-gray">{c.author_location}</p>}
                      {c.rating && <p className="text-sm text-norte-yellow-dark">{'★'.repeat(c.rating)}</p>}
                    </div>
                    {ex && <p className="mt-0.5 text-xs font-semibold text-norte-yellow-dark">{ex.name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                    {c.featured && (
                      <span className="rounded-full bg-norte-yellow/30 px-2.5 py-1 text-[11px] font-bold text-norte-green">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-norte-gray">“{c.body}”</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-norte-green/10 pt-3">
                  {c.status !== 'approved' && (
                    <button
                      onClick={() => update(c.id, { status: 'approved' })}
                      className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200"
                    >
                      Aprobar
                    </button>
                  )}
                  {c.status !== 'rejected' && (
                    <button
                      onClick={() => update(c.id, { status: 'rejected' })}
                      className="rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
                    >
                      Rechazar
                    </button>
                  )}
                  <button
                    onClick={() => update(c.id, { featured: !c.featured })}
                    className="rounded-full bg-norte-yellow/25 px-4 py-1.5 text-xs font-bold text-norte-green transition hover:bg-norte-yellow/50"
                  >
                    {c.featured ? 'Quitar destacado' : 'Destacar'}
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="ml-auto rounded-full px-4 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                  >
                    Borrar
                  </button>
                  <span className="text-xs text-norte-gray">
                    {new Date(c.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
