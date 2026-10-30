import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Excursion } from '../types';
import { SplitWords } from '../components/Motion';
import { getExcursion, getExcursions } from '../lib/supabase';
import { useLang } from '../i18n';
import { localizeExcursion } from '../data/i18n-en';
import BookingForm from '../components/BookingForm';
import ExcursionCard from '../components/ExcursionCard';
import { ChartIcon, CheckIcon, ClockIcon, MapPinIcon } from '../components/Icons';

function Gallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useLang();
  const doubled = [...images, ...images];

  return (
    <section className="pt-12">
      <div className="mx-auto mb-5 max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('gal.eyebrow')}</p>
        <h2 className="display mt-1 text-3xl text-norte-green sm:text-4xl">{t('gal.title')}</h2>
      </div>
      <div
        className="overflow-hidden pb-2"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
        }}
      >
        <div
          className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: `${images.length * 5}s` }}
        >
          {doubled.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${name} — foto ${(i % images.length) + 1}`}
              loading={i >= images.length ? 'lazy' : undefined}
              className="h-[260px] w-[72vw] shrink-0 rounded-[28px] object-cover sm:h-[340px] sm:w-[440px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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
  const { t, tok, lang } = useLang();
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
        <h1 className="text-2xl font-extrabold text-norte-green">{t('det.notfound')}</h1>
        <Link to="/excursiones" className="mt-4 inline-block font-bold text-norte-yellow-dark underline">
          {t('det.back')}
        </Link>
      </div>
    );
  }

  const ex = localizeExcursion(excursion, lang);
  const mapsQ = excursion.mapsQuery ?? `${excursion.location}, Argentina`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQ)}`;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(mapsQ)}&output=embed`;

  return (
    <>
      {/* Hero de la excursión */}
      <DetailHero excursion={excursion} />

      {!!excursion.images?.length && excursion.images.length > 1 && (
        <Gallery images={excursion.images} name={excursion.name} />
      )}

      <section className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[1fr_380px]">
        {/* Columna principal */}
        <div>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
              <ClockIcon className="h-4 w-4 text-norte-yellow-dark" /> {t('det.duration')} {tok(excursion.duration)}
            </span>
            {excursion.schedule && (
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
                <ClockIcon className="h-4 w-4 text-norte-yellow-dark" /> {tok(excursion.schedule)}
              </span>
            )}
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-norte-green ring-1 ring-norte-green/15">
              <ChartIcon className="h-4 w-4 text-norte-yellow-dark" /> {t('det.difficulty')} {tok(excursion.difficulty)}
            </span>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-extrabold text-norte-green">{t('det.enjoy')}</h2>
            <p className="mt-4 leading-relaxed text-norte-gray">{ex.description}</p>
          </div>

          {excursion.included && (
            <div className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-norte-green/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-norte-green">{t('det.included')}</h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-norte-gray">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-norte-whatsapp" />
                {tok(excursion.included)}
              </p>
            </div>
          )}

          {excursion.bookingLead && (
            <p className="mt-6 text-sm text-norte-gray">
              <strong className="text-norte-green">{t('det.when')}</strong> {tok(excursion.bookingLead)}{' '}
              {t('det.when_cta')}
            </p>
          )}
          <p className="mt-2 text-sm text-norte-gray">
            <strong className="text-norte-green">{t('det.voucher')}</strong> {t('det.voucher_text')}
          </p>
          <p className="mt-2 text-sm text-norte-gray">
            <strong className="text-norte-green">{t('det.sustain')}</strong> {t('det.sustain_text')}
          </p>

          {!!ex.faqs?.length && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-norte-green">{t('det.faqs')}</h2>
              <div className="mt-4 space-y-3">
                {ex.faqs.map((f, i) => (
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

          {/* Mapa */}
          <div className="mt-10">
            <h2 className="text-xl font-extrabold text-norte-green">{t('det.map')}</h2>
            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-norte-green/10">
              <iframe
                src={mapsEmbed}
                title={`Mapa — ${excursion.location}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
                allowFullScreen
              />
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-norte-yellow-dark underline underline-offset-4 hover:text-norte-green"
            >
              <MapPinIcon className="h-4 w-4" /> {t('det.map_open')}
            </a>
          </div>
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
          <h2 className="text-2xl font-extrabold text-norte-green">{t('det.related')}</h2>
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
