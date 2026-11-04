import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { WhatsAppIcon } from './Icons';
import { LangSwitch, useLang } from '../i18n';

const LOGO_URL = 'https://norteaventura.com.ar/wp-content/uploads/2026/05/cropped-Logo-NA-transp-270x270.png';

const links = [
  { to: '/', key: 'nav.home', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0017.jpg' },
  { to: '/excursiones?origen=salta', key: 'nav.from_salta', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg' },
  { to: '/excursiones?origen=jujuy', key: 'nav.from_jujuy', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg' },
  { to: '/excursiones?tipo=trekking', key: 'nav.trekking', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg' },
  { to: '/nosotros', key: 'nav.about', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg' },
  { to: '/contacto', key: 'nav.contact', img: 'https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg' },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, search } = useLocation();
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lenis-stopped', open);
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, [open]);

  const solid = scrolled && !open;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6 ${
            solid
              ? 'bg-norte-green/90 shadow-lg shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)} data-cursor={t('cur.home')}>
            <img src={LOGO_URL} alt="Norte Aventura" className="h-11 w-11 rounded-full bg-norte-cream object-contain p-0.5" />
            <span className="hidden text-sm font-extrabold uppercase leading-none tracking-[0.18em] text-norte-cream sm:block">
              Norte
              <br />
              Aventura
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.key}
                to={l.to}
                end
                className={() => {
                  const active = l.to.includes('?')
                    ? pathname + search === l.to
                    : pathname === l.to && !search.includes('origen=');
                  return `rounded-full px-4 py-2 text-[13px] font-bold transition ${
                    active ? 'bg-norte-yellow text-norte-green' : 'text-norte-cream/85 hover:bg-white/10 hover:text-white'
                  }`;
                }}
              >
                {t(l.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangSwitch />
            <a
              href="https://wa.me/5493874039502"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-norte-yellow px-5 py-2.5 text-[13px] font-extrabold text-norte-green transition hover:bg-white sm:flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t('nav.book')}
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t('nav.close') : t('nav.open')}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-norte-cream/10 ring-1 ring-white/20 lg:hidden"
            >
              <span className={`h-0.5 w-5 bg-norte-cream transition ${open ? 'translate-y-1 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 bg-norte-cream transition ${open ? '-translate-y-1 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-norte-green lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-norte-green via-norte-green to-norte-green-dark" />
            <div className="grain pointer-events-none absolute inset-0" />
            <motion.span
              aria-hidden
              initial={{ x: '20%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="display text-outline pointer-events-none absolute -bottom-6 left-0 whitespace-nowrap text-[34vw] leading-none"
              style={{ ['--stroke' as string]: 'rgba(191,219,38,0.18)' }}
            >
              AVENTURA
            </motion.span>

            <nav className="relative z-10 mt-24 flex-1 overflow-y-auto px-7">
              {links.map((l, i) => (
                <motion.div
                  key={l.key}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 border-b border-white/10 py-4"
                  >
                    <span className="text-[11px] font-extrabold tracking-widest text-norte-yellow">
                      0{i + 1}
                    </span>
                    <span className="display flex-1 text-[clamp(1.75rem,7.5vw,3rem)] text-norte-cream transition group-active:text-norte-yellow">
                      {t(l.key)}
                    </span>
                    <img
                      src={l.img}
                      alt=""
                      loading="lazy"
                      className="h-14 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-white/15"
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="relative z-10 px-7 pb-8"
            >
              <a
                href="https://wa.me/5493874039502"
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-2 rounded-full bg-norte-yellow px-7 py-3.5 text-sm font-extrabold text-norte-green"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t('nav.whatsapp')}
              </a>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-norte-cream/45">
                Salta, Argentina
              </p>
              <p className="mt-1 text-xs font-semibold text-norte-cream/45">
                norteaventuraok@gmail.com
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
