import { useEffect, useRef, useState } from 'react';

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function parse(v: string) {
  const [y, m, d] = v.split('-').map(Number);
  return { y: y || 0, m: (m || 1) - 1, d: d || 1 };
}
function fmt(v: string) {
  const { y, m, d } = parse(v);
  return `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`;
}

export default function DatePicker({
  value,
  onChange,
  min,
  light = false,
}: {
  value: string; // 'YYYY-MM-DD'
  onChange: (v: string) => void;
  min?: string;
  light?: boolean;
}) {
  const today = new Date();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const sel = parse(value || todayIso);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: sel.y, m: sel.m });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  function nav(dir: number) {
    setView((v) => {
      const m = v.m + dir;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });
  }

  // grilla: semanas empezando lunes
  const first = new Date(view.y, view.m, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const daysInPrev = new Date(view.y, view.m, 0).getDate();
  const cells: { iso: string; n: number; dim: boolean }[] = [];
  for (let i = offset - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({ iso: iso(view.m - 1 < 0 ? view.y - 1 : view.y, (view.m + 11) % 12, d), n: d, dim: true });
  }
  for (let d = 1; d <= daysInMonth; d++) cells.push({ iso: iso(view.y, view.m, d), n: d, dim: false });
  let next = 1;
  while (cells.length % 7) {
    cells.push({ iso: iso(view.m + 1 > 11 ? view.y + 1 : view.y, (view.m + 1) % 12, next), n: next++, dim: true });
  }

  function pick(v: string) {
    if (min && v < min) return;
    onChange(v);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setView({ y: sel.y, m: sel.m });
          setOpen((o) => !o);
        }}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm outline-none transition ${
          light
            ? 'border border-norte-green/20 bg-white text-norte-green hover:border-norte-green/40 focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40'
            : 'bg-white/10 text-norte-cream hover:bg-white/15 focus:ring-2 focus:ring-norte-yellow/50'
        }`}
      >
        <span>{fmt(value || todayIso)}</span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 ${light ? 'text-norte-gray' : 'text-norte-cream/60'}`} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-72 rounded-2xl bg-norte-green p-4 shadow-2xl ring-1 ring-white/15">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => nav(-1)} aria-label="Mes anterior"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-norte-cream/70 transition hover:bg-white/10 hover:text-norte-cream">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <p className="text-sm font-extrabold capitalize text-norte-cream">
              {MONTHS[view.m]} <span className="text-norte-cream/50">{view.y}</span>
            </p>
            <button type="button" onClick={() => nav(1)} aria-label="Mes siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-norte-cream/70 transition hover:bg-white/10 hover:text-norte-cream">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map((d) => (
              <span key={d} className="py-1 text-[10px] font-extrabold tracking-wider text-norte-cream/40">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((c) => {
              const disabled = !!(min && c.iso < min);
              const isSel = c.iso === (value || todayIso);
              const isToday = c.iso === todayIso;
              return (
                <button
                  key={c.iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(c.iso)}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm font-semibold transition
                    ${isSel ? 'bg-norte-yellow font-extrabold text-norte-green'
                      : disabled ? 'text-norte-cream/20'
                      : c.dim ? 'text-norte-cream/25 hover:bg-white/10'
                      : 'text-norte-cream/85 hover:bg-white/10'}
                    ${!isSel && isToday ? 'ring-1 ring-norte-yellow/60' : ''}`}
                >
                  {c.n}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end border-t border-white/10 pt-3">
            <button type="button" onClick={() => pick(todayIso)}
              className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold text-norte-yellow transition hover:bg-white/20">
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
