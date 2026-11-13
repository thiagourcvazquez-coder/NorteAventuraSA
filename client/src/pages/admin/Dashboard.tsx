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
    },
    {
      label: 'Ingresos del mes',
      value: formatPrice(stats.finances.incomeMonth, 'es'),
      sub: `Cobrado por MP: ${formatPrice(stats.reservations.paidRevenue, 'es')}`,
      onClick: () => go('finanzas'),
      accent: 'text-emerald-700',
    },
    {
      label: 'Egresos del mes',
      value: formatPrice(stats.finances.expenseMonth, 'es'),
      sub: `Neto: ${formatPrice(stats.finances.netMonth, 'es')}`,
      onClick: () => go('finanzas'),
      accent: stats.finances.netMonth >= 0 ? 'text-norte-green' : 'text-red-600',
    },
    {
      label: 'Comentarios por moderar',
      value: String(stats.commentsPending),
      sub: 'testimonios esperando aprobación',
      onClick: () => go('comentarios'),
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className="rounded-xl bg-white p-6 text-left ring-1 ring-norte-green/10 transition hover:ring-norte-green/30"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-norte-gray">{c.label}</p>
            <p className={`display mt-3 text-4xl ${c.accent ?? 'text-norte-green'}`}>{c.value}</p>
            <p className="mt-2 text-xs font-semibold text-norte-gray">{c.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
