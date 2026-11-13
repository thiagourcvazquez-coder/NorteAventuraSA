import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';

interface FinanceRow {
  id: string;
  type: 'income' | 'expense';
  category: string;
  concept: string;
  amount: number;
  method: string;
  date: string;
  notes: string | null;
  reservation_id: string | null;
  created_at: string;
  reservations: { customer_name: string } | { customer_name: string }[] | null;
}

interface Summary {
  byMonth: { month: string; income: number; expense: number; net: number }[];
  byCategory: { category: string; total: number }[];
}

const METHODS = ['efectivo', 'transferencia', 'mercadopago', 'tarjeta', 'otro'] as const;
const METHOD_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercadopago: 'Mercado Pago',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
};

const INCOME_CATS = ['reserva', 'seña', 'excursión', 'transfer', 'otro'] as const;
const EXPENSE_CATS = ['combustible', 'chofer', 'guía', 'publicidad', 'seguro', 'sueldos', 'mantenimiento', 'administración', 'otro'] as const;

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

const empty = {
  type: 'income' as 'income' | 'expense',
  category: 'reserva',
  concept: '',
  amount: '',
  method: 'efectivo' as string,
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

function monthLabel(m: string) {
  const [y, mo] = m.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

export default function Finances() {
  const [rows, setRows] = useState<FinanceRow[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [monthFilter, setMonthFilter] = useState('');

  const load = useCallback(() => {
    adminFetch<FinanceRow[]>('/finances').then(setRows).catch((e) => setError(e.message));
    adminFetch<Summary>('/finances/summary').then(setSummary).catch(() => setSummary(null));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const visible = useMemo(() => {
    let list = rows ?? [];
    if (typeFilter !== 'all') list = list.filter((r) => r.type === typeFilter);
    if (monthFilter) list = list.filter((r) => r.date.startsWith(monthFilter));
    return list;
  }, [rows, typeFilter, monthFilter]);

  const totals = useMemo(() => {
    const income = visible.filter((r) => r.type === 'income').reduce((a, r) => a + Number(r.amount), 0);
    const expense = visible.filter((r) => r.type === 'expense').reduce((a, r) => a + Number(r.amount), 0);
    return { income, expense, net: income - expense };
  }, [visible]);

  function startEdit(r: FinanceRow) {
    setEditing(r.id);
    setForm({
      type: r.type,
      category: r.category,
      concept: r.concept,
      amount: String(r.amount),
      method: r.method,
      date: r.date,
      notes: r.notes ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        notes: form.notes || undefined,
      };
      if (editing) {
        await adminFetch(`/finances/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/finances', { method: 'POST', body: JSON.stringify(payload) });
      }
      setForm({ ...empty });
      setEditing(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!window.confirm('¿Borrar este movimiento?')) return;
    try {
      await adminFetch(`/finances/${id}`, { method: 'DELETE' });
      setRows((rs) => rs?.filter((r) => r.id !== id) ?? rs);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const months = useMemo(
    () => [...new Set((rows ?? []).map((r) => r.date.slice(0, 7)))].sort().reverse(),
    [rows],
  );

  return (
    <div className="p-5 sm:p-7">
      {/* --- Formulario alta/edición --- */}
      <form onSubmit={save} className="rounded-xl bg-norte-cream/60 p-5 ring-1 ring-norte-green/10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-norte-green">
            {editing ? 'Editar movimiento' : 'Nuevo movimiento'}
          </h3>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ ...empty });
              }}
              className="text-xs font-bold text-norte-gray hover:text-norte-green"
            >
              Cancelar edición
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <select
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                type: e.target.value as 'income' | 'expense',
                category: (e.target.value === 'income' ? INCOME_CATS : EXPENSE_CATS)[0],
              }))
            }
            className={input}
          >
            <option value="income">Ingreso</option>
            <option value="expense">Egreso</option>
          </select>
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={input}>
            {cats.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <input
            value={form.concept}
            onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
            placeholder="Concepto (ej: seña Humahuaca)"
            className={`${input} lg:col-span-2`}
            required
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="Monto $"
            className={input}
            required
          />
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={input} required />
          <select value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className={input}>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {METHOD_LABEL[m]}
              </option>
            ))}
          </select>
          <input
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Notas (opcional)"
            className={`${input} lg:col-span-4`}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-norte-green px-6 py-2.5 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
          >
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : '+ Cargar'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      </form>

      {/* --- Resumen mensual --- */}
      {summary && summary.byMonth.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-5 ring-1 ring-norte-green/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-norte-gray">Por mes</h4>
            <div className="mt-3 space-y-2">
              {summary.byMonth.slice(0, 6).map((m) => (
                <div key={m.month} className="flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-norte-green">{monthLabel(m.month)}</span>
                  <span className="text-emerald-700">+{formatPrice(m.income, 'es')}</span>
                  <span className="text-red-600">−{formatPrice(m.expense, 'es')}</span>
                  <span className={`font-extrabold ${m.net >= 0 ? 'text-norte-green' : 'text-red-600'}`}>
                    {formatPrice(m.net, 'es')}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 ring-1 ring-norte-green/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-norte-gray">Egresos por categoría</h4>
            <div className="mt-3 space-y-2">
              {summary.byCategory.slice(0, 6).map((c) => (
                <div key={c.category} className="flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-norte-green">{c.category}</span>
                  <span className="font-bold text-red-600">{formatPrice(c.total, 'es')}</span>
                </div>
              ))}
              {!summary.byCategory.length && <p className="text-sm text-norte-gray">Sin egresos cargados.</p>}
            </div>
          </div>
        </div>
      )}

      {/* --- Filtros + totales --- */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full bg-norte-green/5 p-1">
          {(
            [
              ['all', 'Todos'],
              ['income', 'Ingresos'],
              ['expense', 'Egresos'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setTypeFilter(v)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                typeFilter === v ? 'bg-norte-green text-norte-cream' : 'text-norte-gray hover:text-norte-green'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className={`${input} w-auto`}>
          <option value="">Todos los meses</option>
          {months.map((m) => (
            <option key={m} value={m} className="capitalize">
              {monthLabel(m)}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-4 text-sm font-bold">
          <span className="text-emerald-700">+{formatPrice(totals.income, 'es')}</span>
          <span className="text-red-600">−{formatPrice(totals.expense, 'es')}</span>
          <span className={totals.net >= 0 ? 'text-norte-green' : 'text-red-600'}>
            Neto: {formatPrice(totals.net, 'es')}
          </span>
        </div>
      </div>

      {/* --- Tabla --- */}
      {!rows ? (
        <p className="mt-6 text-sm text-norte-gray">Cargando movimientos…</p>
      ) : !visible.length ? (
        <p className="mt-6 text-sm text-norte-gray">No hay movimientos cargados.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-norte-green/15 text-xs uppercase tracking-wide text-norte-gray">
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-3 py-2">Concepto</th>
                <th className="px-3 py-2">Método</th>
                <th className="px-3 py-2 text-right">Monto</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-norte-green/10">
              {visible.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-3 py-2.5 font-semibold text-norte-green">{r.date}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        r.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.type === 'income' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 capitalize text-norte-green">{r.category}</td>
                  <td className="max-w-64 px-3 py-2.5">
                    <p className="font-semibold text-norte-green">{r.concept}</p>
                    {r.notes && <p className="text-xs text-norte-gray">{r.notes}</p>}
                    {r.reservations && (
                      <p className="text-xs text-norte-gray">
                        Reserva: {(Array.isArray(r.reservations) ? r.reservations[0] : r.reservations)?.customer_name}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-norte-gray">{METHOD_LABEL[r.method] ?? r.method}</td>
                  <td
                    className={`px-3 py-2.5 text-right font-extrabold ${
                      r.type === 'income' ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {r.type === 'income' ? '+' : '−'}
                    {formatPrice(r.amount, 'es')}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button onClick={() => startEdit(r)} className="mr-3 text-xs font-bold text-norte-green hover:underline">
                      Editar
                    </button>
                    <button onClick={() => remove(r.id)} className="text-xs font-bold text-red-600 hover:underline">
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
