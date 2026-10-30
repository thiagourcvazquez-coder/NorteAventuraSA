import { lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useExcursions } from '../hooks';
import HorizontalShowcase from '../components/HorizontalShowcase';
import { Marquee, Reveal, ScrollWords, SplitWords, SunMark } from '../components/Motion';
import { WhatsAppIcon } from '../components/Icons';

const Hero3D = lazy(() => import('../three/Hero3D'));
const Peak3D = lazy(() => import('../three/Peak3D'));

const steps = [
  { title: 'Buscá', text: 'Explorá salidas desde Salta o Jujuy y encontrá la actividad que mejor se adapte a vos.' },
  { title: 'Elegí la fecha', text: 'Verificá disponibilidad y elegí el día que te quede cómodo. ¡Hay salidas diarias!' },
  { title: 'Reservá', text: 'Confirmá tu lugar directo con nosotros por WhatsApp, sin registros ni vueltas.' },
  { title: 'Disfrutá', text: 'Te esperamos para que pases un día lleno de nuevas aventuras.' },
];

const destinations = [
  {
    name: 'Seclantás',
    sub: 'Valles Calchaquíes',
    to: '/excursiones?origen=salta',
    img: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg',
  },
  {
    name: 'Jujuy',
    sub: 'Quebrada de Humahuaca',
    to: '/excursiones?origen=jujuy',
    img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg',
  },
  {
    name: 'Cafayate',
    sub: 'Vinos y quebradas',
    to: '/excursiones?q=cafayate',
    img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg',
  },
];

const marqueeItems = ['Trekking', 'Salinas Grandes', 'Hornocal', 'Quebrada de Humahuaca', 'Cafayate', 'Purmamarca', 'Tilcara', 'Cachi', 'Iruya'];

const STATEMENT =
  'Somos una agencia de turismo orientada al trekking y al turismo alternativo. Reversionamos cada destino y le damos nuestro toque: ¡a Pura Aventura!';

function HeroFallback() {
  return <div className="absolute inset-0 bg-gradient-to-b from-norte-green-dark to-norte-green" />;
}

export default function Home() {
  const { excursions } = useExcursions();

  const featured = useMemo(() => {
    const salta = excursions.filter((e) => e.category === 'salta' && e.price !== null).slice(0, 4);
    const jujuy = excursions.filter((e) => e.category === 'jujuy' && e.price !== null).slice(0, 4);
    return [...salta, ...jujuy];
  }, [excursions]);

  return (
    <>
      {/* HERO 3D */}
      <section className="relative isolate flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-norte-green">
        <Suspense fallback={<HeroFallback />}>
          <Hero3D />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-norte-green-dark/70 via-transparent to-norte-green-dark/30" />
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

          <h1 className="display text-norte-cream">
            <span className="block text-[clamp(1rem,2.4vw,1.6rem)] font-semibold normal-case tracking-normal text-norte-cream/80">
              <SplitWords text="Cuando dudes del camino," onMount delay={0.6} />
            </span>
            <span className="mt-2 block text-[clamp(3.4rem,13vw,11.5rem)]">
              <SplitWords text="Seguí al" onMount delay={0.8} />
            </span>
            <span className="block text-[clamp(3.4rem,13vw,11.5rem)] text-norte-yellow">
              <SplitWords text="Norte" onMount delay={1} />
            </span>
          </h1>

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
              Ver excursiones
            </Link>
            <a
              href="https://wa.me/5493874039502"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold text-norte-cream ring-2 ring-white/50 backdrop-blur transition hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consultar
            </a>
            <div className="ml-auto hidden items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-norte-cream/70 md:flex">
              Scrolleá
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
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">Quiénes somos</p>
        <ScrollWords
          text={STATEMENT}
          className="text-[clamp(1.7rem,4.4vw,3.6rem)] font-extrabold leading-[1.12] tracking-tight text-norte-green"
        />
        <Reveal className="mt-12">
          <Link
            to="/nosotros"
            className="inline-flex items-center gap-3 text-sm font-extrabold text-norte-green underline decoration-norte-yellow decoration-[3px] underline-offset-8 hover:text-norte-yellow-dark"
          >
            Conocé más sobre nosotros →
          </Link>
        </Reveal>
      </section>

      {/* GALERÍA HORIZONTAL */}
      <HorizontalShowcase items={featured} />

      {/* CÓMO RESERVAR */}
      <section className="relative overflow-hidden bg-norte-green py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow">Cómo reservar</p>
          <h2 className="display mt-3 max-w-3xl text-[clamp(2.2rem,6vw,5rem)] text-norte-cream">
            <SplitWords text="Cuatro pasos hasta el norte" />
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1} y={30}>
                <div className="group h-full bg-norte-green p-8 transition hover:bg-norte-green-light">
                  <span className="display text-outline block text-7xl transition group-hover:!text-norte-yellow/25">
                    0{i + 1}
                  </span>
                  <h3 className="mt-8 text-xl font-extrabold text-norte-cream">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-norte-cream/65">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINOS */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">Nuestros destinos</p>
        <h2 className="display mt-3 text-[clamp(2.2rem,6vw,5rem)] text-norte-green">
          <SplitWords text="Tu próximo destino" />
        </h2>
        <div className="mt-14 flex flex-col gap-3 md:h-[68vh] md:flex-row">
          {destinations.map((d) => (
            <Link
              key={d.name}
              to={d.to}
              data-cursor="Explorar"
              className="group relative h-64 flex-1 overflow-hidden rounded-[28px] transition-[flex] duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:h-auto md:hover:flex-[2.6]"
            >
              <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-norte-green-dark via-norte-green-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-norte-yellow">{d.sub}</p>
                <p className="display mt-1 text-4xl text-white md:text-5xl">{d.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA 3D */}
      <section className="relative isolate overflow-hidden bg-norte-green-dark">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-24 sm:px-8 md:grid-cols-2">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow">
              <SunMark className="h-4 w-4" /> 5 estrellas en Google
            </p>
            <h2 className="display mt-5 text-[clamp(2.6rem,7vw,6rem)] text-norte-cream">
              <SplitWords text="Tu aventura" />
              <br />
              <span className="text-norte-yellow">
                <SplitWords text="empieza acá." delay={0.2} />
              </span>
            </h2>
            <p className="mt-6 max-w-md text-norte-cream/70">
              Guías locales, grupos reducidos y turismo sustentable. Escribinos y armamos la excursión perfecta para vos.
            </p>
            <a
              href="https://wa.me/5493874039502?text=Hola%20Norte%20Aventura!%20Quiero%20consultar%20por%20una%20excursi%C3%B3n."
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-norte-yellow px-9 py-4 text-sm font-extrabold text-norte-green shadow-lg shadow-black/30 transition hover:bg-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Reservá tu aventura
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
