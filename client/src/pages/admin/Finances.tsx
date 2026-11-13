import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '../../lib/api';
import DatePicker from '../../components/ui/DatePicker';

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

const METHODS = ['efectivo', 'transferencia', 'mercadopago', 'tarjeta', 'otro'] as const;
const METHOD_LABEL: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  mercadopago: 'Mercado Pago',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
};

const INCOME_CATS = ['reserva', 'seña', 'excursión', 'transfer', 'varios'] as const;
const EXPENSE_CATS = ['combustible', 'chofer', 'guía', 'publicidad', 'seguro', 'sueldos', 'mantenimiento', 'administración', 'varios'] as const;

const CAT_COLORS = ['#bfdb26', '#fb950e', '#728316', '#e8d9b0', '#c96f3f', '#8ab6d6', '#d9a05b', '#9aa65a', '#b39ddb', '#f4a7c0'];

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(n);

const card = 'rounded-2xl bg-norte-green p-6 sm:p-7';
const field =
  'w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-norte-cream placeholder:text-norte-cream/35 outline-none transition focus:bg-white/15 focus:ring-2 focus:ring-norte-yellow/50';

function monthLabel(m: string) {
  const [y, mo] = m.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

function Donut({ parts, total }: { parts: { value: number; color: string }[]; total: number }) {
  const r = 62;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 160 160" className="h-44 w-44">
      <circle r={r} cx="80" cy="80" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="30" />
      {total > 0 &&
        parts.map((p, i) => {
          const frac = p.value / total;
          const el = (
            <circle
              key={i}
              r={r}
              cx="80"
              cy="80"
              fill="none"
              stroke={p.color}
              strokeWidth="30"
              strokeDasharray={`${Math.max(frac * C - 1.5, 0)} ${C}`}
              strokeDashoffset={-acc * C}
              transform="rotate(-90 80 80)"
            />
          );
          acc += frac;
          return el;
        })}
    </svg>
  );
}

const empty = {
  type: 'income' as 'income' | 'expense',
  concept: '',
  amount: '',
  category: 'reserva',
  method: 'efectivo',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function Finances() {
  const [rows, setRows] = useState<FinanceRow[] | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [catView, setCatView] = useState<'expense' | 'income'>('expense');

  const load = useCallback(
    () => adminFetch<FinanceRow[]>('/finances').then(setRows).catch((e) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  const monthRows = useMemo(() => (rows ?? []).filter((r) => r.date.startsWith(month)), [rows, month]);
  const income = monthRows.filter((r) => r.type === 'income').reduce((a, r) => a + Number(r.amount), 0);
  const expense = monthRows.filter((r) => r.type === 'expense').reduce((a, r) => a + Number(r.amount), 0);
  const balance = income - expense;

  const catParts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of monthRows.filter((x) => x.type === catView)) {
      map.set(r.category, (map.get(r.category) ?? 0) + Number(r.amount));
    }
    return [...map.entries()]
      .map(([category, total], i) => ({ category, total, color: CAT_COLORS[i % CAT_COLORS.length] }))
      .sort((a, b) => b.total - a.total);
  }, [monthRows, catView]);
  const catTotal = catParts.reduce((a, p) => a + p.total, 0);

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  function shiftMonth(delta: number) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(d.toISOString().slice(0, 7));
  }

  function startEdit(r: FinanceRow) {
    setEditing(r.id);
    setForm({
      type: r.type,
      concept: r.concept,
      amount: String(r.amount),
      category: r.category,
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
      const payload = { ...form, amount: Number(form.amount), notes: form.notes || undefined };
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
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
      {/* ============ NUEVO MOVIMIENTO ============ */}
      <form onSubmit={save} className={`${card} lg:row-span-2`}>
        <div className="flex items-center justify-between">
          <h3 className="display text-lg uppercase tracking-wide text-norte-cream">Nuevo movimiento</h3>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ ...empty });
              }}
              className="text-xs font-bold text-norte-cream/60 hover:text-norte-cream"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(['income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  type: t,
                  category: (t === 'income' ? INCOME_CATS : EXPENSE_CATS)[0],
                }))
              }
              className={`rounded-xl py-3 text-sm font-bold transition ${
                form.type === t
                  ? 'bg-[#bfdb26] text-norte-green'
                  : 'bg-white/10 text-norte-cream/70 hover:bg-white/15'
              }`}
            >
              {t === 'income' ? 'Ingreso' : 'Gasto'}
            </button>
          ))}
        </div>

        <input
          value={form.concept}
          onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
          placeholder="Descripción (ej: Seña Humahuaca, Nafta combi)"
          required
          className={`${field} mt-4`}
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-norte-cream/50">Monto $</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
              className={field}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-norte-cream/50">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={`${field} capitalize [&>option]:text-norte-green`}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-norte-cream/50">Fecha</label>
            <DatePicker
              value={form.date}
              onChange={(v) => setForm((f) => ({ ...f, date: v }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-norte-cream/50">Método</label>
            <select
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
              className={`${field} [&>option]:text-norte-green`}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {METHOD_LABEL[m]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Notas (opcional)"
          className={`${field} mt-3`}
        />

        {error && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 rounded-xl bg-[#bfdb26] px-8 py-3 text-sm font-extrabold text-norte-green transition hover:bg-norte-yellow disabled:opacity-60"
        >
          {saving ? 'Guardando' : editing ? 'Guardar cambios' : 'Guardar'}
        </button>
      </form>

      {/* ============ BALANCE DEL MES ============ */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h3 className="display text-lg capitalize text-norte-cream">Balance de {monthLabel(month)}</h3>
          <div className="flex gap-2">
            <button onClick={() => shiftMonth(-1)} className="rounded-lg bg-white/10 px-3 py-1.5 text-norte-cream transition hover:bg-white/20" aria-label="Mes anterior">‹</button>
            <button onClick={() => shiftMonth(1)} className="rounded-lg bg-white/10 px-3 py-1.5 text-norte-cream transition hover:bg-white/20" aria-label="Mes siguiente">›</button>
          </div>
        </div>
        <p className="display mt-4 text-4xl sm:text-5xl text-norte-cream">{fmt(balance)}</p>
        <p className="mt-1 text-xs font-semibold text-norte-cream/50">Ingresos menos egresos</p>
        <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-norte-cream/70">Ingresos</span>
            <span className="font-extrabold text-[#bfdb26]">{fmt(income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-norte-cream/70">Egresos</span>
            <span className="font-extrabold text-[#fb950e]">{fmt(expense)}</span>
          </div>
        </div>
      </div>

      {/* ============ POR CATEGORÍA ============ */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h3 className="display text-lg uppercase tracking-wide text-norte-cream">Por categoría</h3>
          <div className="flex gap-1 rounded-full bg-white/10 p-1">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCatView(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  catView === t ? 'bg-[#bfdb26] text-norte-green' : 'text-norte-cream/60 hover:text-norte-cream'
                }`}
              >
                {t === 'expense' ? 'Egresos' : 'Ingresos'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-6">
          <Donut parts={catParts.map((p) => ({ value: p.total, color: p.color }))} total={catTotal} />
          <p className="text-xs font-semibold text-norte-cream/50">
            Total de {catView === 'expense' ? 'egresos' : 'ingresos'}:<br />
            <span className="text-lg font-extrabold text-norte-cream">{fmt(catTotal)}</span>
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {catParts.map((p) => (
            <div key={p.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold uppercase text-norte-green"
                  style={{ background: p.color }}
                >
                  {p.category.charAt(0)}
                </span>
                <div>
                  <p className="font-bold capitalize text-norte-cream">{p.category}</p>
                  <p className="text-[11px] text-norte-cream/50">{catTotal ? Math.round((p.total / catTotal) * 100) : 0}% del total</p>
                </div>
              </div>
              <p className="font-extrabold text-norte-cream">{fmt(p.total)}</p>
            </div>
          ))}
          {!catParts.length && <p className="text-sm text-norte-cream/50">Sin movimientos este mes.</p>}
        </div>
      </div>

      {/* ============ MOVIMIENTOS DEL MES ============ */}
      <div className={`${card} lg:col-span-2`}>
        <h3 className="display text-lg capitalize text-norte-cream">Movimientos de {monthLabel(month)}</h3>
        {!rows ? (
          <p className="mt-4 text-sm text-norte-cream/50">Cargando</p>
        ) : !monthRows.length ? (
          <p className="mt-4 text-sm text-norte-cream/50">Sin movimientos este mes.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-norte-cream/40">
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Concepto</th>
                  <th className="py-2 pr-4">Categoría</th>
                  <th className="py-2 pr-4">Método</th>
                  <th className="py-2 pr-4 text-right">Monto</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthRows.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="py-3 pr-4 font-semibold text-norte-cream/80">{r.date}</td>
                    <td className="max-w-64 py-3 pr-4">
                      <p className="font-bold text-norte-cream">{r.concept}</p>
                      {r.notes && <p className="text-xs text-norte-cream/45">{r.notes}</p>}
                    </td>
                    <td className="py-3 pr-4 capitalize text-norte-cream/70">{r.category}</td>
                    <td className="py-3 pr-4 text-norte-cream/60">{METHOD_LABEL[r.method] ?? r.method}</td>
                    <td className={`py-3 pr-4 text-right font-extrabold ${r.type === 'income' ? 'text-[#bfdb26]' : 'text-[#fb950e]'}`}>
                      {r.type === 'income' ? '+' : '−'}{fmt(r.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => startEdit(r)} className="mr-3 text-xs font-bold text-norte-yellow hover:underline">
                        Editar
                      </button>
                      <button onClick={() => remove(r.id)} className="text-xs font-bold text-[#fb950e] hover:underline">
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
    </div>
  );
}
