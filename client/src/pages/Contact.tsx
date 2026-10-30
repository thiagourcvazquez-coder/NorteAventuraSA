import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import { MailIcon, MapPinIcon, WhatsAppIcon } from '../components/Icons';
import { FacebookIcon, InstagramIcon, TikTokIcon } from '../components/Icons';
import { useLang } from '../i18n';

const inputCls =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2.5 text-sm text-norte-green outline-none transition focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

export default function Contact() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola Norte Aventura! Soy ${name} (tel: ${phone}).\n\n${message}`,
    );
    window.open(`https://wa.me/5493874039502?text=${text}`, '_blank', 'noopener');
  }

  return (
    <>
    <PageBanner eyebrow={t('ct.eyebrow')} title={t('ct.title')}>
      {t('ct.sub')}
    </PageBanner>
    <section className="mx-auto max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid lg:grid-cols-2">
      <div>
        <p className="max-w-md leading-relaxed text-norte-gray">
          {t('ct.intro')}
        </p>

        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3 text-norte-green">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green/10">
              <MapPinIcon className="h-5 w-5" />
            </span>
            Salta · Tilcara · Jujuy, Argentina
          </li>
          <li>
            <a href="https://wa.me/5493874039502" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-norte-green hover:text-norte-yellow-dark">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green/10">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              +54 9 387 403 9502
            </a>
          </li>
          <li>
            <a href="mailto:puraaventuratrekking@gmail.com" className="flex items-center gap-3 text-norte-green hover:text-norte-yellow-dark">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green/10">
                <MailIcon className="h-5 w-5" />
              </span>
              puraaventuratrekking@gmail.com
            </a>
          </li>
        </ul>

        <div className="mt-8 flex gap-4">
          <a href="https://www.facebook.com/puraaventurasalta/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green text-norte-cream transition hover:bg-norte-green-light">
            <FacebookIcon />
          </a>
          <a href="https://www.instagram.com/puraaventurasalta/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green text-norte-cream transition hover:bg-norte-green-light">
            <InstagramIcon />
          </a>
          <a href="https://www.tiktok.com/@puraaventurasalta" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-norte-green text-norte-cream transition hover:bg-norte-green-light">
            <TikTokIcon />
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-norte-green/10 lg:mt-0">
        <h2 className="text-lg font-extrabold text-norte-green">{t('ct.form')}</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">{t('ct.name')}</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('ct.name_ph')} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">{t('ct.phone')}</label>
            <input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="387 123 4567" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">{t('ct.msg')}</label>
            <textarea className={inputCls} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('ct.msg_ph')} required />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-norte-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow transition hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t('ct.send')}
        </button>
        <p className="mt-3 text-center text-xs text-norte-gray">
          {t('ct.note')}
        </p>
      </form>
    </section>
    </>
  );
}
