import { useEffect, useState, type ReactNode } from 'react';
import { adminFetch } from '../../lib/api';
import { formatPrice } from '../../lib/format';

interface Stats {
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    paidRevenue: number;
    monthTotal: number;
  };
  finances: {
    incomeMonth: number;
    expenseMonth: number;
    incomeTotal: number;
    expenseTotal: number;
    netMonth: number;
  };
  commentsPending: number;
  excursionsActive: number;
}

const money = (n: number) => formatPrice(n, 'es');

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  mountain: 'm3 20 6-11 4 7 3-5 5 9H3Z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12Z',
  dollar: 'M12 2v20M17 6.5C16 5 14.2 4.5 12 4.5c-2.8 0-4.5 1.2-4.5 3s1.7 2.6 4.5 3.2 4.5 1.4 4.5 3.3-1.8 3-4.5 3c-2.4 0-4.2-.7-5.2-2.2',
  alert: 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
};

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7 ${className}`}>{children}</div>;
}

function Kpi({
  label,
  value,
  sub,
  icon,
  tint,
  onClick,
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
  tint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-norte-yellow"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tint}`}>
          <Icon d={icon} />
        </span>
        <Icon d={ICONS.arrow} className="h-4 w-4 text-norte-gray/40 transition group-hover:translate-x-0.5 group-hover:text-norte-green" />
      </div>
      <p className="display mt-5 text-4xl text-norte-green">{value}</p>
      <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-norte-gray">{label}</p>
      <p className="mt-1.5 text-xs font-semibold text-norte-gray/80">{sub}</p>
    </button>
  );
}

export default function Dashboard({ go }: { go: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch<Stats>('/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="p-6 text-sm font-medium text-red-600">{error}</p>;
  if (!stats) return <p className="p-6 text-sm text-norte-gray">Cargando métricas…</p>;

  const { reservations: r, finances: f } = stats;
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const flow = f.incomeMonth + f.expenseMonth;
  const incomePct = flow > 0 ? Math.round((f.incomeMonth / flow) * 100) : 50;
  const resTotal = r.confirmed + r.pending + r.cancelled;
  const seg = (n: number) => (resTotal > 0 ? (n / resTotal) * 100 : 0);

  const alerts = [
    r.pending > 0 && {
      text: `${r.pending} ${r.pending === 1 ? 'reserva pendiente' : 'reservas pendientes'} de confirmar`,
      action: 'Ver reservas',
      to: 'reservas',
    },
    stats.commentsPending > 0 && {
      text: `${stats.commentsPending} ${stats.commentsPending === 1 ? 'comentario' : 'comentarios'} esperando aprobación`,
      action: 'Moderar',
      to: 'comentarios',
    },
  ].filter(Boolean) as { text: string; action: string; to: string }[];

  return (
    <div className="space-y-6 p-5 sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-norte-yellow-dark">{today}</p>
        <h2 className="display mt-1 text-3xl text-norte-green sm:text-4xl">Resumen del negocio</h2>
      </div>

      {alerts.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {alerts.map((a) => (
            <div
              key={a.to}
              className="flex items-center justify-between gap-4 rounded-2xl bg-norte-yellow-dark/10 px-5 py-4 ring-1 ring-norte-yellow-dark/30"
            >
              <p className="flex items-center gap-3 text-sm font-bold text-norte-green">
                <Icon d={ICONS.alert} className="h-5 w-5 shrink-0 text-norte-yellow-dark" />
                {a.text}
              </p>
              <button
                onClick={() => go(a.to)}
                className="shrink-0 rounded-full bg-norte-yellow-dark px-4 py-1.5 text-xs font-extrabold text-norte-green transition hover:bg-norte-green hover:text-norte-cream"
              >
                {a.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Finanzas del mes */}
      <div className="relative overflow-hidden rounded-3xl bg-norte-green p-7 text-norte-cream sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-norte-yellow/10 blur-2xl" />
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-norte-cream/55">Neto del mes</p>
            <p className={`display mt-2 text-5xl sm:text-6xl ${f.netMonth < 0 ? 'text-norte-yellow-dark' : 'text-norte-yellow'}`}>
              {money(f.netMonth)}
            </p>
            <p className="mt-2 text-xs font-semibold text-norte-cream/55">
              Cobrado por Mercado Pago: {money(r.paidRevenue)}
            </p>
          </div>
          <button
            onClick={() => go('finanzas')}
            className="flex items-center gap-2 rounded-full bg-norte-yellow px-5 py-2.5 text-xs font-extrabold text-norte-green transition hover:bg-white"
          >
            Ver finanzas <Icon d={ICONS.arrow} className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8">
          <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
            <div className="bg-norte-yellow transition-all" style={{ width: `${incomePct}%` }} />
            <div className="bg-norte-yellow-dark transition-all" style={{ width: `${100 - incomePct}%` }} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-norte-cream/55">
                <span className="h-2.5 w-2.5 rounded-full bg-norte-yellow" /> Ingresos
              </p>
              <p className="display mt-1 text-2xl">{money(f.incomeMonth)}</p>
              <p className="text-xs font-semibold text-norte-cream/45">Acumulado: {money(f.incomeTotal)}</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-norte-cream/55">
                <span className="h-2.5 w-2.5 rounded-full bg-norte-yellow-dark" /> Egresos
              </p>
              <p className="display mt-1 text-2xl">{money(f.expenseMonth)}</p>
              <p className="text-xs font-semibold text-norte-cream/45">Acumulado: {money(f.expenseTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi
          label="Reservas este mes"
          value={String(r.monthTotal)}
          sub={`${r.total} en total`}
          icon={ICONS.calendar}
          tint="bg-norte-yellow/25 text-norte-green"
          onClick={() => go('reservas')}
        />
        <Kpi
          label="Comentarios por moderar"
          value={String(stats.commentsPending)}
          sub="testimonios esperando aprobación"
          icon={ICONS.chat}
          tint="bg-norte-yellow-dark/20 text-norte-yellow-dark"
          onClick={() => go('comentarios')}
        />
        <Kpi
          label="Excursiones activas"
          value={String(stats.excursionsActive)}
          sub="publicadas en el catálogo"
          icon={ICONS.mountain}
          tint="bg-norte-green-light/20 text-norte-green-light"
          onClick={() => go('excursiones')}
        />
      </div>

      {/* Estado de reservas */}
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-norte-gray">Estado de las reservas</p>
          <button onClick={() => go('reservas')} className="text-xs font-bold text-norte-green-light hover:underline">
            Ver todas →
          </button>
        </div>
        {resTotal > 0 ? (
          <div className="mt-5 flex h-3.5 overflow-hidden rounded-full bg-norte-cream">
            <div className="bg-norte-green-light" style={{ width: `${seg(r.confirmed)}%` }} />
            <div className="bg-norte-yellow-dark" style={{ width: `${seg(r.pending)}%` }} />
            <div className="bg-norte-gray/40" style={{ width: `${seg(r.cancelled)}%` }} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-norte-gray">Todavía no hay reservas.</p>
        )}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {[
            { n: r.confirmed, l: 'Confirmadas', c: 'bg-norte-green-light' },
            { n: r.pending, l: 'Pendientes', c: 'bg-norte-yellow-dark' },
            { n: r.cancelled, l: 'Canceladas', c: 'bg-norte-gray/40' },
          ].map((x) => (
            <div key={x.l}>
              <p className="display text-3xl text-norte-green">{x.n}</p>
              <p className="mt-1 flex items-center gap-2 text-xs font-bold text-norte-gray">
                <span className={`h-2.5 w-2.5 rounded-full ${x.c}`} /> {x.l}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
