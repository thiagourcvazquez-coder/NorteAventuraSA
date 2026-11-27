import { useEffect, useRef, useState, type ReactNode } from 'react';
import DragRow from './DragRow';

const SPEED = 40; // px por segundo

/**
 * Tira infinita automática que también se desliza con mouse o dedo.
 * Sirve para cualquier contenido (fotos, reseñas…) y con cualquier cantidad:
 * si hay pocos elementos se repiten hasta llenar el ancho. Se pausa al pasar
 * el mouse y unos segundos después de que el usuario la toca.
 */
export default function InfiniteStrip({
  items,
  itemWidth,
  gap = 16,
  className = '',
}: {
  items: ReactNode[];
  /** Ancho aproximado de cada elemento (para calcular cuántas repeticiones hacen falta). */
  itemWidth: () => number;
  gap?: number;
  className?: string;
}) {
  const row = useRef<HTMLDivElement | null>(null);
  const set = useRef<HTMLDivElement | null>(null);
  const pos = useRef(0);
  const paused = useRef(false);
  const resumeAt = useRef(0);
  const [reps, setReps] = useState(1);
  const count = items.length;

  useEffect(() => {
    const el = row.current;
    if (!el || !count) return;
    const calc = () => setReps(Math.max(1, Math.ceil(el.clientWidth / ((itemWidth() + gap) * count))));
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count, gap, itemWidth]);

  useEffect(() => {
    const el = row.current;
    const first = set.current;
    if (!el || !first || !count) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    pos.current = first.offsetWidth;
    el.scrollLeft = pos.current;

    const wrap = () => {
      const w = first.offsetWidth;
      if (!w) return;
      if (el.scrollLeft >= 2 * w) el.scrollLeft -= w;
      else if (el.scrollLeft < w) el.scrollLeft += w;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce && !paused.current && now > resumeAt.current) {
        if (Math.abs(el.scrollLeft - pos.current) > 2) pos.current = el.scrollLeft;
        pos.current += SPEED * dt;
        el.scrollLeft = pos.current;
      }
      wrap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hold = () => {
      resumeAt.current = performance.now() + 2500;
    };
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('touchmove', hold, { passive: true });
    el.addEventListener('wheel', hold, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('touchmove', hold);
      el.removeEventListener('wheel', hold);
    };
  }, [count, reps]);

  if (!count) return null;

  return (
    <div
      className={className}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
      }}
    >
      <DragRow
        ref={row}
        className="pb-2"
        onUserInteract={() => {
          resumeAt.current = performance.now() + 2500;
        }}
      >
        <div className="flex w-max">
          {[0, 1, 2].map((s) => (
            <div key={s} ref={s === 0 ? set : undefined} className="flex shrink-0" style={{ gap, paddingRight: gap }}>
              {Array.from({ length: reps }).flatMap((_, r) =>
                items.map((node, i) => (
                  <div key={`${r}-${i}`} className="shrink-0" aria-hidden={s !== 0 || r !== 0 ? true : undefined}>
                    {node}
                  </div>
                )),
              )}
            </div>
          ))}
        </div>
      </DragRow>
    </div>
  );
}
