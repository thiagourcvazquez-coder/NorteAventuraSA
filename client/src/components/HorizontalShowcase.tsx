import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type { Excursion } from '../types';
import ExcursionCard from './ExcursionCard';
import { SplitWords } from './Motion';

/** Sección "pinned": el scroll vertical recorre una galería horizontal. */
export default function HorizontalShowcase({ items }: { items: Excursion[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  const bar = useTransform(smooth, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative bg-norte-cream">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-4 px-5 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">Excursiones destacadas</p>
            <h2 className="display mt-2 text-[clamp(2.2rem,6vw,5rem)] text-norte-green">
              <SplitWords text="Elegí tu aventura" />
            </h2>
          </div>
          <Link
            to="/excursiones"
            data-cursor="Ver"
            className="hidden shrink-0 rounded-full bg-norte-green px-6 py-3 text-sm font-extrabold text-norte-cream transition hover:bg-norte-yellow hover:text-norte-green sm:block"
          >
            Ver todas →
          </Link>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:px-8">
          {items.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] w-[78vw] animate-pulse rounded-[28px] bg-norte-green/10 sm:w-[400px]" />
              ))
            : items.map((e) => (
                <ExcursionCard key={e.slug} excursion={e} className="w-[78vw] shrink-0 sm:w-[400px]" />
              ))}
          <Link
            to="/excursiones"
            data-cursor="Ir"
            className="display flex aspect-[4/5] w-[78vw] shrink-0 items-center justify-center rounded-[28px] bg-norte-yellow p-8 text-center text-4xl text-norte-green transition hover:bg-norte-green hover:text-norte-yellow sm:w-[400px]"
          >
            Ver todo el catálogo →
          </Link>
        </motion.div>

        <div className="mx-auto mt-8 h-1 w-full max-w-7xl px-5 sm:px-8">
          <div className="h-full overflow-hidden rounded-full bg-norte-green/10">
            <motion.div style={{ width: bar }} className="h-full bg-norte-green" />
          </div>
        </div>
      </div>
    </section>
  );
}
