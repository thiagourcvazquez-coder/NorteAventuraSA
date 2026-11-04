import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, MailIcon, MapPinIcon, TikTokIcon, WhatsAppIcon } from './Icons';
import { useLang } from '../i18n';

const YEAR = new Date().getFullYear();

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative overflow-hidden bg-norte-green-dark text-norte-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-10 pt-20 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-3xl text-norte-cream sm:text-4xl">
            {t('ft.l1')}
            <br />
            {t('ft.l2')}
            <br />
            <span className="text-norte-yellow">{t('ft.l3')}</span>
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-norte-cream/60">{t('ft.desc')}</p>
          <div className="mt-8 flex gap-3">
            {[
              { href: 'https://web.facebook.com/norteaventura.ok/', label: 'Facebook', Icon: FacebookIcon, bg: 'bg-[#1877F2]' },
              { href: 'https://www.instagram.com/norteaventura.ok/', label: 'Instagram', Icon: InstagramIcon, bg: 'bg-[#E4405F]' },
              { href: 'https://www.tiktok.com/@norteaventura.ok', label: 'TikTok', Icon: TikTokIcon, bg: 'bg-white text-black' },
            ].map(({ href, label, Icon, bg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-white/15 transition hover:scale-110 ${bg}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-norte-yellow">{t('ft.menu')}</h3>
          <ul className="space-y-2.5 text-sm font-semibold">
            {[
              ['/', 'nav.home'],
              ['/excursiones?origen=salta', 'nav.from_salta'],
              ['/excursiones?origen=jujuy', 'nav.from_jujuy'],
              ['/excursiones?tipo=trekking', 'nav.trekking'],
              ['/nosotros', 'nav.about'],
              ['/contacto', 'nav.contact'],
            ].map(([to, key]) => (
              <li key={key}>
                <Link to={to} className="text-norte-cream/75 transition hover:text-norte-yellow">
                  {t(key as Parameters<typeof t>[0])}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-norte-yellow">{t('ft.contact')}</h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-center gap-2.5 text-norte-cream/75">
              <MapPinIcon className="h-4 w-4 shrink-0 text-norte-yellow" />
              Salta, Argentina
            </li>
            <li>
              <a href="https://wa.me/5493874039502" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-norte-cream/75 hover:text-norte-yellow">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-norte-yellow" />
                +54 9 387 403 9502
              </a>
            </li>
            <li>
              <a href="mailto:norteaventuraok@gmail.com" className="flex items-center gap-2.5 break-all text-norte-cream/75 hover:text-norte-yellow">
                <MailIcon className="h-4 w-4 shrink-0 text-norte-yellow" />
                norteaventuraok@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="select-none px-2 text-center" aria-hidden>
        <p className="display text-outline whitespace-nowrap text-[clamp(2.4rem,10.4vw,10rem)] [--stroke:#3f4a0e]">
          Norte Aventura
        </p>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-norte-cream/50">
        Norte Aventura © {YEAR} — Salta, Tilcara y Jujuy
      </div>
    </footer>
  );
}
