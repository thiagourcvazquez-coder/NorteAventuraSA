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
          <div className="mt-8 flex gap-3">
            {[
              { href: 'https://www.facebook.com/puraaventurasalta/', label: 'Facebook', Icon: FacebookIcon },
              { href: 'https://www.instagram.com/puraaventurasalta/', label: 'Instagram', Icon: InstagramIcon },
              { href: 'https://www.tiktok.com/@puraaventurasalta', label: 'TikTok', Icon: TikTokIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/20 transition hover:bg-norte-yellow hover:text-norte-green hover:ring-norte-yellow"
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
              ['/excursiones', 'nav.excursions'],
              ['/excursiones?origen=salta', 'nav.from_salta'],
              ['/excursiones?origen=jujuy', 'nav.from_jujuy'],
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
              <a href="mailto:puraaventuratrekking@gmail.com" className="flex items-center gap-2.5 break-all text-norte-cream/75 hover:text-norte-yellow">
                <MailIcon className="h-4 w-4 shrink-0 text-norte-yellow" />
                puraaventuratrekking@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="select-none px-2 text-center" aria-hidden>
        <p className="display text-outline whitespace-nowrap text-[clamp(2.4rem,10.4vw,10rem)] [--stroke:#14694a]">
          Norte Aventura
        </p>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-norte-cream/50">
        Pura Aventura © {YEAR} — Salta, Tilcara y Jujuy
      </div>
    </footer>
  );
}
