import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';

export interface ReservationRow {
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

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmada', cls: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelada', cls: 'bg-red-100 text-red-700' },
};

export default function Reservations() {
  const [rows, setRows] = useState<ReservationRow[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

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
  if (!rows) return <p className="p-6 text-sm text-norte-gray">Cargando reservas</p>;
  if (!rows.length) return <p className="p-6 text-sm text-norte-gray">Todavía no hay reservas.</p>;

  const visible = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-norte-green/10 px-5 py-3">
        {(
          [
            ['all', `Todas (${rows.length})`],
            ['pending', 'Pendientes'],
            ['confirmed', 'Confirmadas'],
            ['cancelled', 'Canceladas'],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              filter === v ? 'bg-norte-green text-norte-cream' : 'bg-norte-green/5 text-norte-gray hover:text-norte-green'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
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
            {visible.map((r) => {
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
        {!visible.length && <p className="p-6 text-sm text-norte-gray">No hay reservas con este estado.</p>}
      </div>
    </div>
  );
}
