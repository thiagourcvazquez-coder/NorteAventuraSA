import { useEffect, useState } from 'react';
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

export default function Dashboard({ go }: { go: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch<Stats>('/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="p-6 text-sm font-medium text-red-600">{error}</p>;
  if (!stats) return <p className="p-6 text-sm text-norte-gray">Cargando métricas…</p>;

  const cards = [
    {
      label: 'Reservas este mes',
      value: String(stats.reservations.monthTotal),
      sub: `${stats.reservations.total} en total`,
      onClick: () => go('reservas'),
    },
    {
      label: 'Pendientes de confirmar',
      value: String(stats.reservations.pending),
      sub: `${stats.reservations.confirmed} confirmadas · ${stats.reservations.cancelled} canceladas`,
      onClick: () => go('reservas'),
      alert: stats.reservations.pending > 0,
    },
    {
      label: 'Ingresos del mes',
      value: formatPrice(stats.finances.incomeMonth, 'es'),
      sub: `Cobrado por MP: ${formatPrice(stats.reservations.paidRevenue, 'es')}`,
      onClick: () => go('finanzas'),
      accent: 'text-norte-yellow',
    },
    {
      label: 'Egresos del mes',
      value: formatPrice(stats.finances.expenseMonth, 'es'),
      sub: `Neto: ${formatPrice(stats.finances.netMonth, 'es')}`,
      onClick: () => go('finanzas'),
      accent: 'text-norte-yellow-dark',
    },
    {
      label: 'Comentarios por moderar',
      value: String(stats.commentsPending),
      sub: 'testimonios esperando aprobación',
      onClick: () => go('comentarios'),
      alert: stats.commentsPending > 0,
    },
    {
      label: 'Excursiones activas',
      value: String(stats.excursionsActive),
      sub: 'publicadas en el catálogo',
      onClick: () => go('excursiones'),
    },
  ];

  return (
    <div className="p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className="group rounded-2xl bg-norte-green p-6 text-left ring-1 ring-norte-green/20 transition hover:ring-2 hover:ring-norte-yellow/70 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-norte-cream/45">{c.label}</p>
              <span className="text-norte-cream/30 transition group-hover:translate-x-0.5 group-hover:text-norte-yellow">→</span>
            </div>
            <p className={`display mt-4 text-4xl sm:text-5xl ${c.accent ?? 'text-norte-cream'}`}>{c.value}</p>
            <p className="mt-2.5 text-xs font-semibold text-norte-cream/50">{c.sub}</p>
            {c.alert && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-norte-yellow-dark/20 px-3 py-1 text-[11px] font-bold text-norte-yellow-dark">
                ● requiere atención
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
