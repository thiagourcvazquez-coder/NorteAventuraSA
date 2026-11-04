import { useCallback, useEffect, useState } from 'react';
import { adminFetch, adminLogin, clearAdminToken, getAdminToken } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import ExcursionEditor from './ExcursionEditor';

interface ReservationRow {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  start_date: string;
  people: number;
  total: number | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: string;
  created_at: string;
  excursions: { name: string; slug: string } | { name: string; slug: string }[] | null;
}

export interface AdminExcursion {
  id: string;
  slug: string;
  name: string;
  location: string;
  tipo: 'clasica' | 'trekking' | 'privada';
  price: number | null;
  price_note: string | null;
  duration: string;
  schedule: string | null;
  difficulty: string;
  short_desc: string;
  description: string;
  included: string | null;
  booking_lead: string | null;
  image_url: string | null;
  maps_query: string | null;
  is_active: boolean;
  display_order: number;
  categories: { slug: string } | { slug: string }[] | null;
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmada', cls: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelada', cls: 'bg-red-100 text-red-700' },
};

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

function Login({ onOk }: { onOk: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (await adminLogin(password)) onOk();
      else setError('Contraseña incorrecta');
    } catch {
      setError('No se pudo conectar con la API');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 pt-24">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-norte-green/10">
        <h1 className="text-xl font-extrabold text-norte-green">Backoffice</h1>
        <p className="mt-1 text-sm text-norte-gray">Acceso para el equipo de Norte Aventura.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className={`${input} mt-6`}
          autoFocus
          required
        />
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-full bg-norte-green px-6 py-3 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

function Reservations() {
  const [rows, setRows] = useState<ReservationRow[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(
    () => adminFetch<ReservationRow[]>('/reservations').then(setRows).catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    try {
      await adminFetch(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status: status as ReservationRow['status'] } : r)) ?? rs);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error) return <p className="p-6 text-sm font-medium text-red-600">{error}</p>;
  if (!rows) return <p className="p-6 text-sm text-norte-gray">Cargando reservas…</p>;
  if (!rows.length) return <p className="p-6 text-sm text-norte-gray">Todavía no hay reservas.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-norte-green/15 text-xs uppercase tracking-wide text-norte-gray">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Excursión</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Personas</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Pago</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-norte-green/10">
          {rows.map((r) => {
            const ex = Array.isArray(r.excursions) ? r.excursions[0] : r.excursions;
            const st = STATUS_LABEL[r.status] ?? STATUS_LABEL.pending;
            return (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3 font-semibold text-norte-green">{r.start_date}</td>
                <td className="max-w-56 px-4 py-3">
                  <p className="font-bold text-norte-green">{ex?.name ?? '—'}</p>
                  {r.notes && <p className="mt-1 text-xs text-norte-gray">“{r.notes}”</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-norte-green">{r.customer_name}</p>
                  <p className="text-xs text-norte-gray">{r.phone}</p>
                  {r.email && <p className="text-xs text-norte-gray">{r.email}</p>}
                </td>
                <td className="px-4 py-3 text-norte-green">{r.people}</td>
                <td className="px-4 py-3 font-bold text-norte-green">
                  {r.total ? formatPrice(r.total, 'es') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      r.payment_status === 'approved'
                        ? 'bg-[#00b1ea]/15 text-[#0077a3]'
                        : 'bg-norte-green/10 text-norte-gray'
                    }`}
                  >
                    {r.payment_status === 'approved' ? 'MP pagado' : 'Sin pagar'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold outline-none ${st.cls}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Admin() {
  const [logged, setLogged] = useState(!!getAdminToken());
  const [tab, setTab] = useState<'reservas' | 'excursiones'>('reservas');
  const [list, setList] = useState<AdminExcursion[] | null>(null);
  const [error, setError] = useState('');

  const loadExcursions = useCallback(() => {
    if (!logged) return;
    adminFetch<AdminExcursion[]>('/excursions')
      .then(setList)
      .catch((e) => setError(e.message));
  }, [logged]);

  useEffect(() => {
    loadExcursions();
  }, [loadExcursions]);

  if (!logged) return <Login onOk={() => setLogged(true)} />;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-3xl text-norte-green sm:text-4xl">Backoffice</h1>
        <button
          onClick={() => {
            clearAdminToken();
            setLogged(false);
          }}
          className="rounded-full px-5 py-2 text-xs font-bold text-norte-gray ring-1 ring-norte-green/20 transition hover:text-norte-green hover:ring-norte-green/50"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-8 flex gap-2">
        {(
          [
            ['reservas', 'Reservas'],
            ['excursiones', 'Excursiones'],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`rounded-full px-6 py-2.5 text-sm font-extrabold transition ${
              tab === v ? 'bg-norte-green text-norte-cream' : 'bg-white text-norte-green ring-1 ring-norte-green/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-norte-green/10">
        {tab === 'reservas' ? (
          <Reservations />
        ) : (
          <ExcursionEditor list={list} error={error} reload={loadExcursions} />
        )}
      </div>
    </section>
  );
}
