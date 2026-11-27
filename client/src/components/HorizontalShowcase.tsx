import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Excursion } from '../types';
import ExcursionCard from './ExcursionCard';
import DragRow from './DragRow';
import { Reveal, SplitWords } from './Motion';
import { useLang } from '../i18n';

const CARD = 'w-[78vw] shrink-0 sm:w-[360px] lg:w-[380px]';

/**
 * Carrusel de excursiones destacadas: se desliza con el dedo, con el mouse
 * (arrastrando), con el trackpad/rueda horizontal o con las flechas.
 * Reemplaza al scroll "pinned" anterior, que se sentía lento.
 */
export default function HorizontalShowcase({ items }: { items: Excursion[] }) {
  const { t } = useLang();
  const row = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = row.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, items.length]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="bg-norte-cream py-20 sm:py-28">
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-4 px-5 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('show.eyebrow')}</p>
          <h2 className="display mt-2 text-[clamp(2rem,4.5vw,4rem)] text-norte-green">
            <SplitWords text={t('show.title')} />
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-2 sm:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                onClick={() => go(d)}
                disabled={d === -1 ? edge.start : edge.end}
                aria-label={d === -1 ? 'Anterior' : 'Siguiente'}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-norte-green text-norte-cream transition hover:bg-norte-yellow-dark hover:text-norte-green disabled:opacity-30 disabled:hover:bg-norte-green disabled:hover:text-norte-cream"
              >
                <svg viewBox="0 0 24 24" className={`h-5 w-5 ${d === -1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
          <Link
            to="/excursiones"
            data-cursor={t('cur.view')}
            className="hidden shrink-0 rounded-full bg-norte-green px-6 py-3 text-sm font-extrabold text-norte-cream transition hover:bg-norte-yellow-dark hover:text-norte-green md:block"
          >
            {t('show.all')}
          </Link>
        </div>
      </div>

      <Reveal>
        <DragRow ref={row} onScroll={update} className="pb-2">
          <div className="flex w-max gap-5 px-5 sm:px-8">
            {items.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`${CARD} aspect-[4/5] animate-pulse rounded-[28px] bg-norte-green/10`} />
                ))
              : items.map((e) => <ExcursionCard key={e.slug} excursion={e} className={CARD} />)}
            <Link
              to="/excursiones"
              data-cursor={t('cur.go')}
              draggable={false}
              className={`${CARD} display flex aspect-[4/5] items-center justify-center rounded-[28px] bg-norte-yellow-dark p-8 text-center text-4xl text-norte-green transition hover:bg-norte-green hover:text-norte-yellow-dark`}
            >
              {t('show.catalog')}
            </Link>
          </div>
        </DragRow>
      </Reveal>

      <div className="mx-auto mt-8 h-1 w-full max-w-7xl px-5 sm:px-8">
        <div className="h-full overflow-hidden rounded-full bg-norte-green/10">
          <div className="h-full rounded-full bg-norte-green transition-[width] duration-150" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
