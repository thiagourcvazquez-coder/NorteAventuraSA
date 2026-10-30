import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { Excursion } from '../types';
import { formatPrice } from '../lib/format';
import { useLang } from '../i18n';
import { ClockIcon, MapPinIcon } from './Icons';

export default function ExcursionCard({
  excursion,
  className = '',
  aspect = 'aspect-[4/5]',
}: {
  excursion: Excursion;
  className?: string;
  aspect?: string;
}) {
  const { lang, t, tok } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={className}
    >
      <Link
        to={`/excursion/${excursion.slug}`}
        data-cursor={t('cur.view')}
        className={`group relative block ${aspect} overflow-hidden rounded-[28px] bg-norte-green`}
      >
        {excursion.imageUrl && (
          <img
            src={excursion.imageUrl}
            alt={excursion.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-norte-green-dark via-norte-green-dark/30 to-transparent opacity-90 transition group-hover:opacity-100" />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-norte-cream/90 px-3 py-1.5 text-[11px] font-bold text-norte-green backdrop-blur">
          <MapPinIcon className="h-3 w-3" />
          {excursion.location}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="line-clamp-3 text-xl font-extrabold leading-tight text-white">{excursion.name}</h3>
          <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider text-norte-cream/70">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 text-norte-yellow" />
              {tok(excursion.duration)}
            </span>
            <span>{tok(excursion.difficulty)}</span>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              {excursion.price !== null && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-norte-cream/60">{t('card.per_person')}</p>
              )}
              <p className="text-2xl font-extrabold text-norte-yellow">{formatPrice(excursion.price, lang)}</p>
              {excursion.priceNote && <p className="text-[10px] text-norte-cream/60">{tok(excursion.priceNote)}</p>}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-norte-yellow text-norte-green transition duration-500 group-hover:rotate-45 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
