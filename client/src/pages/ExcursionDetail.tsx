import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Excursion } from '../types';
import { SplitWords } from '../components/Motion';
import { getExcursion, getExcursions } from '../lib/supabase';
import BookingForm from '../components/BookingForm';
import ExcursionCard from '../components/ExcursionCard';
import { ChartIcon, CheckIcon, ClockIcon, MapPinIcon } from '../components/Icons';

function DetailHero({ excursion }: { excursion: Excursion }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative isolate h-[78svh] min-h-[460px] overflow-hidden bg-norte-green">
      {excursion.imageUrl && (
        <motion.img
          src={excursion.imageUrl}
          alt={excursion.name}
          style={{ y, scale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-norte-green-dark via-norte-green-dark/40 to-norte-green-dark/30" />
      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-norte-cream/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-norte-cream ring-1 ring-white/20 backdrop-blur">
            <MapPinIcon className="h-3.5 w-3.5 text-norte-yellow" /> {excursion.location}
          </p>
          <h1 className="display max-w-5xl text-[clamp(2rem,5.6vw,4.8rem)] text-norte-cream">
            <SplitWords text={excursion.name} onMount delay={0.15} />
          </h1>
        </div>
      </motion.div>
    </section>
  );
}

export default function ExcursionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{
    slug: string;
    excursion: Excursion | null;
    related: Excursion[];
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const loading = data?.slug !== slug;
  const excursion = loading ? null : data!.excursion;
  const related = loading ? [] : data!.related;

  useEffect(() => {
    let alive = true;
    Promise.all([getExcursion(slug ?? ''), getExcursions()]).then(([e, all]) => {
      if (!alive) return;
      setData({
        slug: slug ?? '',
        excursion: e,
        related: all.filter((x) => x.slug !== slug && x.category === e?.category).slice(0, 3),
      });
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="h-[100svh] animate-pulse bg-norte-green" />;
  }

  if (!excursion) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-44 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-norte-green">Excursión no encontrada</h1>
        <Link to="/excursiones" className="mt-4 inline-block font-bold text-norte-yellow-dark underline">
          ← Volver a todas las aventuras
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero de la excursión */}
      <DetailHero excursion={excursion} />

      <section className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[1fr_380px]">
        {/* Columna principal */}
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
              <ClockIcon className="h-4 w-4 text-norte-yellow-dark" /> Duración: {excursion.duration}
            </span>
            {excursion.schedule && (
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
                <ClockIcon className="h-4 w-4 text-norte-yellow-dark" /> {excursion.schedule}
              </span>
            )}
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
              <ChartIcon className="h-4 w-4 text-norte-yellow-dark" /> Dificultad: {excursion.difficulty}
            </span>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-extrabold text-norte-green">Disfrutá de la aventura</h2>
            <p className="mt-4 leading-relaxed text-norte-gray">{excursion.description}</p>
          </div>

          {excursion.included && (
            <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-norte-green/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-norte-green">Incluido</h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-norte-gray">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-norte-whatsapp" />
                {excursion.included}
              </p>
            </div>
          )}

          {excursion.bookingLead && (
            <p className="mt-6 text-sm text-norte-gray">
              <strong className="text-norte-green">Cuándo reservar:</strong> {excursion.bookingLead}{' '}
              Reservá ya y asegurá tu plaza.
            </p>
          )}
          <p className="mt-2 text-sm text-norte-gray">
            <strong className="text-norte-green">Tipo de bono:</strong> Digital. Llevalo en tu celular.
          </p>
          <p className="mt-2 text-sm text-norte-gray">
            <strong className="text-norte-green">Sostenibilidad:</strong> Todos los servicios cumplen
            con el cuidado del medioambiente y el respeto a las comunidades.
          </p>

          {!!excursion.faqs?.length && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-norte-green">Preguntas frecuentes</h2>
              <div className="mt-4 space-y-3">
                {excursion.faqs.map((f, i) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-white ring-1 ring-norte-green/10">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-norte-green"
                    >
                      {f.question}
                      <span className={`ml-4 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openFaq === i && (
                      <p className="border-t border-norte-green/10 px-5 py-4 text-sm leading-relaxed text-norte-gray">
                        {f.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna reserva */}
        <aside className="mt-10 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <BookingForm excursion={excursion} />
          </div>
        </aside>
      </section>

      {!!related.length && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-extrabold text-norte-green">Otras aventuras</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <ExcursionCard key={e.slug} excursion={e} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
