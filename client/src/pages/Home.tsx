import { lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useExcursions } from '../hooks';
import { useLang } from '../i18n';
import HorizontalShowcase from '../components/HorizontalShowcase';
import { Marquee, Reveal, ScrollWords, SplitWords, SunMark } from '../components/Motion';
import { WhatsAppIcon } from '../components/Icons';

const Peak3D = lazy(() => import('../three/Peak3D'));

const HERO_IMG =
  'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg';

/** Orden pedido por el cliente (docx) para las listas de salidas diarias. */
const DAILY_SALTA = [
  'tour-a-cafayate-desde-salta',
  'excursion-a-cachi-desde-salta',
  'salinas-grandes-purmamarca-desde-salta',
  'humahuaca-hornocal',
  'cascada-escondida-san-lorenzo-salta',
  'city-tour-salta',
  'cerro-elefante-salta',
  'tren-a-las-nubes-san-antonio-de-los-cobres-salta',
  'tren-solar-quebrada-jujuy',
];
const DAILY_JUJUY = [
  'salinas-grandes-purmamarca-desde-tilcara',
  'excursion-humahuaca-hornocal-quebrada-de-las-senoritas',
  'excursion-iruya-desde-tilcara',
  'castillos-de-huichaira-tilcara',
  'traslado-aeropuerto-jujuy-tilcara',
  'garganta-del-diablo-tilcara',
  'city-tour-pucara-tilcara',
  'inca-cueva-humahuaca',
];

/** Nombre corto de la excursión para las listas (antes de ':' / '–' / '|'). */
const shortName = (n: string) => n.split(/[:|–—]/)[0].replace(/“|”/g, '').trim();

const marqueeItems = ['Trekking', 'Salinas Grandes', 'Hornocal', 'Quebrada de Humahuaca', 'Cafayate', 'Purmamarca', 'Tilcara', 'Cachi', 'Iruya'];

const STEP_KEYS = [
  ['steps.1.t', 'steps.1.d'],
  ['steps.2.t', 'steps.2.d'],
  ['steps.3.t', 'steps.3.d'],
  ['steps.4.t', 'steps.4.d'],
] as const;

export default function Home() {
  const { excursions } = useExcursions();
  const { t } = useLang();

  const featured = useMemo(() => {
    const salta = excursions.filter((e) => e.category === 'salta' && e.price !== null).slice(0, 4);
    const jujuy = excursions.filter((e) => e.category === 'jujuy' && e.price !== null).slice(0, 4);
    return [...salta, ...jujuy];
  }, [excursions]);

  const daily = useMemo(() => {
    const bySlug = new Map(excursions.map((e) => [e.slug, e]));
    return {
      salta: DAILY_SALTA.map((s) => bySlug.get(s)).filter(Boolean) as typeof excursions,
      jujuy: DAILY_JUJUY.map((s) => bySlug.get(s)).filter(Boolean) as typeof excursions,
    };
  }, [excursions]);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-norte-green">
        <motion.img
          src={HERO_IMG}
          alt="Cerro Hornocal, Quebrada de Humahuaca"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-norte-green-dark/85 via-norte-green-dark/25 to-norte-green-dark/45" />
        <div className="grain pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-norte-cream/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-norte-cream ring-1 ring-white/20 backdrop-blur"
          >
            <SunMark className="h-4 w-4 text-norte-yellow" />
            Salta · Tilcara · Jujuy
          </motion.p>

          <h1 className="display max-w-5xl text-[clamp(2.5rem,7.5vw,6.5rem)] text-norte-cream">
            <SplitWords text={t('hero.title')} onMount delay={0.6} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-norte-cream/85 sm:text-lg"
          >
            {t('hero.sub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/excursiones"
              className="rounded-full bg-norte-yellow px-8 py-4 text-sm font-extrabold text-norte-green shadow-lg shadow-black/30 transition hover:bg-white"
            >
              {t('hero.cta1')}
            </Link>
            <a
              href="https://wa.me/5493874039502"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold text-norte-cream ring-2 ring-white/50 backdrop-blur transition hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t('hero.cta2')}
            </a>
            <div className="ml-auto hidden items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-norte-cream/70 md:flex">
              {t('hero.scroll')}
              <span className="relative block h-12 w-px overflow-hidden bg-white/20">
                <motion.span
                  className="absolute inset-x-0 top-0 h-5 bg-norte-yellow"
                  animate={{ y: ['-100%', '260%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative z-10 -mt-px overflow-hidden bg-norte-yellow py-5 text-norte-green">
        <Marquee
          items={marqueeItems}
          className="display text-[clamp(1.6rem,4vw,3rem)]"
          separator={<SunMark className="h-8 w-8" />}
        />
      </section>

      {/* MANIFIESTO */}
      <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-40">
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('home.eyebrow')}</p>
        <ScrollWords
          text={t('home.statement')}
          className="text-[clamp(1.7rem,4.4vw,3.6rem)] font-extrabold leading-[1.12] tracking-tight text-norte-green"
        />
        <Reveal className="mt-12">
          <Link
            to="/nosotros"
            className="inline-flex items-center gap-3 text-sm font-extrabold text-norte-green underline decoration-norte-yellow decoration-[3px] underline-offset-8 hover:text-norte-yellow-dark"
          >
            {t('home.more')}
          </Link>
        </Reveal>
      </section>

      {/* GALERÍA HORIZONTAL */}
      <HorizontalShowcase items={featured} />

      {/* CÓMO RESERVAR */}
      <section className="relative overflow-hidden bg-norte-green py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow">{t('steps.eyebrow')}</p>
          <h2 className="display mt-3 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-norte-cream">
            <SplitWords text={t('steps.title')} />
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_KEYS.map(([tk, dk], i) => (
              <Reveal key={tk} delay={i * 0.1} y={30}>
                <div className="group h-full bg-norte-green p-8 transition hover:bg-norte-green-light">
                  <span className="display text-outline block text-7xl transition group-hover:!text-norte-yellow/25">
                    0{i + 1}
                  </span>
                  <h3 className="mt-8 text-xl font-extrabold text-norte-cream">{t(tk)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-norte-cream/65">{t(dk)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SALIDAS DIARIAS */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('home.daily_eyebrow')}</p>
        <h2 className="display mt-3 text-[clamp(2.2rem,6vw,5rem)] text-norte-green">
          <SplitWords text={t('home.daily_title')} />
        </h2>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {(
            [
              [t('home.daily_salta'), daily.salta, '/excursiones?origen=salta'],
              [t('home.daily_jujuy'), daily.jujuy, '/excursiones?origen=jujuy'],
            ] as const
          ).map(([title, list, to]) => (
            <div key={title}>
              <h3 className="display border-b-2 border-norte-yellow pb-3 text-2xl text-norte-green">
                {title}
              </h3>
              <ul className="mt-2 divide-y divide-norte-green/10">
                {list.map((e) => (
                  <li key={e.slug}>
                    <Link
                      to={`/excursion/${e.slug}`}
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="text-sm font-bold text-norte-green transition group-hover:text-norte-yellow-dark">
                        {shortName(e.name)}
                      </span>
                      <span className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-norte-gray transition group-hover:text-norte-yellow-dark">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={to}
                className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-norte-green underline decoration-norte-yellow decoration-[3px] underline-offset-8 hover:text-norte-yellow-dark"
              >
                {t('show.all')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINOS — 3 tipos de experiencia */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('home.dest_eyebrow')}</p>
        <h2 className="display mt-3 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-norte-green">
          <SplitWords text={t('home.dest_title')} />
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(
            [
              {
                t: 'dest.c1_t',
                b: 'dest.c1_b',
                to: '/excursiones?tipo=clasica',
                img: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg',
                featured: false,
              },
              {
                t: 'dest.c2_t',
                b: 'dest.c2_b',
                to: '/excursiones?tipo=trekking',
                img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg',
                featured: true,
              },
              {
                t: 'dest.c3_t',
                b: 'dest.c3_b',
                to: '/contacto',
                img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0075-e1772563433316.jpg',
                featured: false,
              },
            ] as const
          ).map((c, i) => (
            <Reveal key={c.t} delay={i * 0.12} y={40}>
              <Link
                to={c.to}
                data-cursor={t('cur.go')}
                className={`group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-[28px] transition md:h-[480px] ${
                  c.featured ? 'md:-mt-6 md:h-[520px] ring-4 ring-norte-yellow' : ''
                }`}
              >
                <img
                  src={c.img}
                  alt={t(c.t)}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-norte-green-dark via-norte-green-dark/30 to-transparent" />
                {c.featured && (
                  <span className="absolute left-5 top-5 rounded-full bg-norte-yellow px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-norte-green">
                    {t('dest.c2_badge')}
                  </span>
                )}
                <div className="relative p-7">
                  <h3 className="display text-3xl text-norte-cream">{t(c.t)}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-norte-yellow px-6 py-2.5 text-sm font-extrabold text-norte-green transition group-hover:bg-white">
                    {t(c.b)} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA 3D */}
      <section className="relative isolate overflow-hidden bg-norte-green-dark">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-24 sm:px-8 md:grid-cols-2">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow">
              <SunMark className="h-4 w-4" /> {t('home.cta_badge')}
            </p>
            <h2 className="display mt-5 text-[clamp(2.6rem,7vw,6rem)] text-norte-cream">
              <SplitWords text={t('home.cta_t1')} />
              <br />
              <span className="text-norte-yellow">
                <SplitWords text={t('home.cta_t2')} delay={0.2} />
              </span>
            </h2>
            <p className="mt-6 max-w-md text-norte-cream/70">
              {t('home.cta_text')}
            </p>
            <a
              href="https://wa.me/5493874039502?text=Hola%20Norte%20Aventura!%20Quiero%20consultar%20por%20una%20excursi%C3%B3n."
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-norte-yellow px-9 py-4 text-sm font-extrabold text-norte-green shadow-lg shadow-black/30 transition hover:bg-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t('home.cta_btn')}
            </a>
          </div>
          <div className="relative h-[380px] md:h-[520px]">
            <Suspense fallback={null}>
              <Peak3D />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
