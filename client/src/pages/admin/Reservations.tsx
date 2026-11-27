import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { downloadCsv, printTable, todayStamp } from '../../lib/exportData';

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

  const [toDelete, setToDelete] = useState<ReservationRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminFetch(`/reservations/${toDelete.id}`, { method: 'DELETE' });
      setRows((rs) => rs?.filter((r) => r.id !== toDelete.id) ?? rs);
      setToDelete(null);
    } catch (e) {
      setError((e as Error).message);
      setToDelete(null);
    }
    setDeleting(false);
  }

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

  // Datos planos para Excel / papel (lo que se ve filtrado en pantalla)
  const exHeaders = ['Fecha de la excursión', 'Excursión', 'Cliente', 'Teléfono', 'Email', 'Personas', 'Total', 'Pago', 'Estado', 'Notas', 'Reservada el'];
  const exRows = visible.map((r) => {
    const ex = Array.isArray(r.excursions) ? r.excursions[0] : r.excursions;
    return [
      r.start_date,
      ex?.name ?? '',
      r.customer_name,
      r.phone,
      r.email ?? '',
      r.people,
      r.total ?? '',
      r.payment_status === 'approved' ? 'MP pagado' : 'Sin pagar',
      (STATUS_LABEL[r.status] ?? STATUS_LABEL.pending).label,
      r.notes ?? '',
      r.created_at.slice(0, 10),
    ];
  });
  const filterLabel = { all: 'Todas', pending: 'Pendientes', confirmed: 'Confirmadas', cancelled: 'Canceladas' }[filter];
  const totalSum = visible.reduce((a, r) => a + (r.total ?? 0), 0);

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
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => downloadCsv(`reservas-${todayStamp()}`, exHeaders, exRows)}
            className="rounded-full bg-norte-yellow px-4 py-1.5 text-xs font-extrabold text-norte-green transition hover:bg-norte-yellow-dark"
          >
            Descargar Excel
          </button>
          <button
            onClick={() =>
              printTable({
                title: 'Reservas',
                subtitle: `${filterLabel} · ${visible.length} reservas`,
                headers: ['Fecha', 'Excursión', 'Cliente', 'Teléfono', 'Pers.', 'Total', 'Pago', 'Estado'],
                rows: exRows.map((r) => [r[0], r[1], r[2], r[3], r[5], r[6] === '' ? '—' : formatPrice(Number(r[6]), 'es'), r[7], r[8]]),
                summary: [`Total de las reservas listadas: ${formatPrice(totalSum, 'es')}`],
                rightCols: [4, 5],
              })
            }
            className="rounded-full bg-norte-green px-4 py-1.5 text-xs font-extrabold text-norte-cream transition hover:bg-norte-green-light"
          >
            Imprimir / PDF
          </button>
        </div>
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
              <th className="px-4 py-3" />
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setToDelete(r)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!visible.length && <p className="p-6 text-sm text-norte-gray">No hay reservas con este estado.</p>}
      </div>

      {toDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
          onClick={() => !deleting && setToDelete(null)}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="display text-xl text-norte-green">¿Eliminar esta reserva?</p>
            <div className="mt-4 rounded-2xl bg-norte-cream p-4 text-sm text-norte-green">
              <p className="font-extrabold">{toDelete.customer_name}</p>
              <p>
                {(Array.isArray(toDelete.excursions) ? toDelete.excursions[0] : toDelete.excursions)?.name ?? 'Sin excursión'} ·{' '}
                {toDelete.start_date} · {toDelete.people} pers.
              </p>
              <p className="text-norte-gray">{toDelete.phone}</p>
            </div>
            <p className="mt-4 text-sm font-semibold text-red-600">
              Se borra para siempre y no se puede deshacer. Si querés conservarla, descargá antes el Excel.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="rounded-full px-6 py-2.5 text-sm font-bold text-norte-gray ring-1 ring-norte-green/20 hover:text-norte-green"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
