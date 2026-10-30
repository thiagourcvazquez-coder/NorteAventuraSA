import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { WhatsAppIcon } from './Icons';

const LOGO_URL = 'https://norteaventura.com.ar/wp-content/uploads/2026/05/cropped-Logo-NA-transp-270x270.png';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/excursiones', label: 'Excursiones' },
  { to: '/excursiones?origen=salta', label: 'Desde Salta' },
  { to: '/excursiones?origen=jujuy', label: 'Desde Jujuy' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, search } = useLocation();

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
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)} data-cursor="Inicio">
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
                key={l.label}
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
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5493874039502"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-norte-yellow px-5 py-2.5 text-[13px] font-extrabold text-norte-green transition hover:bg-white sm:flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Reservar
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
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
            className="fixed inset-0 z-40 flex flex-col justify-center bg-norte-green px-8 lg:hidden"
          >
            <nav className="space-y-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="display block text-[clamp(2.2rem,11vw,4rem)] text-norte-cream transition hover:text-norte-yellow"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <a
              href="https://wa.me/5493874039502"
              target="_blank"
              rel="noreferrer"
              className="mt-10 flex w-fit items-center gap-2 rounded-full bg-norte-yellow px-7 py-3.5 text-sm font-extrabold text-norte-green"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Escribinos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
