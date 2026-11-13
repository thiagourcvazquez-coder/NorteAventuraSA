import { useState } from 'react';
import type { Excursion } from '../types';
import { formatPrice } from '../lib/format';
import { createReservation, createPaymentPreference } from '../lib/api';
import { useLang } from '../i18n';
import { WhatsAppIcon } from './Icons';
import DatePicker from './ui/DatePicker';

const inputCls =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2.5 text-sm text-norte-green outline-none transition focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';
const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray';

const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'España', 'Estados Unidos',
  'Francia', 'Alemania', 'Italia', 'Paraguay', 'Perú', 'Reino Unido', 'Uruguay', 'Otro',
];
const PROVINCES = [
  'Salta', 'Jujuy', 'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro',
];

function maskBirth(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
}
function birthToIso(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

type Mode = 'online' | 'whatsapp';
type PayMethod = 'mercadopago' | 'transferencia';

export default function BookingForm({ excursion }: { excursion: Excursion }) {
  const { lang, t, tok } = useLang();
  const [mode, setMode] = useState<Mode>('online');
  const [payMethod, setPayMethod] = useState<PayMethod>('mercadopago');
  const [startDate, setStartDate] = useState(tomorrow);
  const [people, setPeople] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Argentina');
  const [hotel, setHotel] = useState('');
  const [nationality, setNationality] = useState('');
  const [province, setProvince] = useState('Salta');
  const [documentId, setDocumentId] = useState('');
  const [birth, setBirth] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ id: string | null; whatsappUrl: string; via: Mode | PayMethod } | null>(null);

  const isBaseDoble = !!excursion.priceNote?.includes('x2');
  const total =
    excursion.price !== null
      ? isBaseDoble
        ? excursion.price * Math.ceil(people / 2)
        : excursion.price * people
      : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const birthIso = birth ? birthToIso(birth) : '';
    if (mode === 'online') {
      if (!customerName.trim() || !lastName.trim() || !phone.trim() || !hotel.trim() ||
          !nationality.trim() || !documentId.trim() || !birthIso) {
        setError(t('bk.error_full'));
        return;
      }
    } else if (!customerName.trim() || !phone.trim()) {
      setError(t('bk.error'));
      return;
    }

    const payload = {
      excursionSlug: excursion.slug,
      excursionName: excursion.name,
      customerName: customerName.trim(),
      lastName: lastName.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      startDate,
      people,
      notes: notes.trim() || undefined,
      ...(mode === 'online'
        ? {
            country, hotel: hotel.trim(), nationality: nationality.trim(), province,
            documentId: documentId.trim(), birthDate: birthIso,
            paymentMethod: payMethod,
          }
        : { paymentMethod: 'whatsapp' }),
    };

    // Pago online con MP: reservar y redirigir al checkout
    if (mode === 'online' && payMethod === 'mercadopago') {
      setPaying(true);
      const res = await createReservation(payload);
      if (res.id) {
        const initPoint = await createPaymentPreference(res.id);
        if (initPoint) {
          window.location.href = initPoint;
          return;
        }
      }
      setPaying(false);
      setError(t('bk.pay_error'));
      return;
    }

    setSending(true);
    const res = await createReservation(payload);
    setSending(false);
    setResult({ ...res, via: mode === 'online' ? payMethod : 'whatsapp' });
  }

  // ---- pantalla de confirmación (whatsapp / transferencia) ----
  if (result) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-norte-green/10">
        <p className="text-lg font-extrabold text-norte-green">{t('bk.done_t')}</p>
        <p className="mt-2 text-sm text-norte-gray">
          {result.via === 'transferencia' ? t('bk.done_transfer') : t('bk.done_d')}
        </p>
        {total !== null && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-norte-cream px-4 py-3">
            <span className="text-sm font-semibold text-norte-gray">{t('bk.total')}</span>
            <span className="text-xl font-extrabold text-norte-green">{formatPrice(total, lang)}</span>
          </div>
        )}
        <a
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-norte-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow transition hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {result.via === 'transferencia' ? t('bk.transfer_wa') : t('bk.submit')}
        </a>
        <p className="mt-3 text-center text-xs text-norte-gray">{t('bk.pay_note')}</p>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-norte-green/10">
      <div className="mb-5 border-b border-norte-green/10 pb-4">
        {excursion.price !== null ? (
          <>
            <p className="text-xs uppercase tracking-wide text-norte-gray">{t('bk.from')}</p>
            <p className="text-3xl font-extrabold text-norte-green">
              {formatPrice(excursion.price, lang)}
              <span className="ml-1 text-sm font-medium text-norte-gray">
                {isBaseDoble ? t('bk.per_2people') : t('bk.per_person')}
              </span>
            </p>
          </>
        ) : (
          <p className="text-lg font-bold text-norte-green">{t('bk.ask')}</p>
        )}
        {excursion.priceNote && <p className="mt-1 text-xs text-norte-gray">{tok(excursion.priceNote)}</p>}
      </div>

      {/* ---- cómo reservar ---- */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setMode('online')}
          className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition ${
            mode === 'online'
              ? 'border-norte-yellow bg-norte-yellow/15 text-norte-green'
              : 'border-norte-green/15 text-norte-gray hover:border-norte-green/40'
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="3" />
            <path d="M2 10h20" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-extrabold">{t('bk.online')}</span>
          <span className="text-[11px] font-medium leading-tight opacity-70">{t('bk.online_sub')}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('whatsapp')}
          className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition ${
            mode === 'whatsapp'
              ? 'border-norte-whatsapp bg-norte-whatsapp/10 text-norte-green'
              : 'border-norte-green/15 text-norte-gray hover:border-norte-green/40'
          }`}
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="text-sm font-extrabold">{t('bk.wa')}</span>
          <span className="text-[11px] font-medium leading-tight opacity-70">{t('bk.wa_sub')}</span>
        </button>
      </div>

      {/* ---- fecha + personas ---- */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>{t('bk.date')}</label>
          <DatePicker value={startDate} onChange={setStartDate} min={tomorrow} light />
        </div>
        <div>
          <label className={labelCls}>{t('bk.people')}</label>
          <div className="flex items-center rounded-lg border border-norte-green/20 bg-white">
            <button
              type="button"
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="flex h-10 w-10 items-center justify-center text-lg font-extrabold text-norte-gray transition hover:text-norte-green disabled:opacity-30"
              disabled={people <= 1}
              aria-label="−"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-bold text-norte-green">
              {people} {people === 1 ? t('bk.person') : t('bk.people_p')}
            </span>
            <button
              type="button"
              onClick={() => setPeople((p) => Math.min(15, p + 1))}
              className="flex h-10 w-10 items-center justify-center text-lg font-extrabold text-norte-gray transition hover:text-norte-green disabled:opacity-30"
              disabled={people >= 15}
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ---- datos ---- */}
      <div className="mt-5 space-y-4">
        <p className="border-b border-norte-green/10 pb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-norte-green">
          {t('bk.data')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t('bk.name')} *</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('bk.name_ph')} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>{t('bk.lastname')}{mode === 'online' ? ' *' : ''}</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
              placeholder={t('bk.lastname_ph')} className={inputCls} required={mode === 'online'} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t('bk.phone')} *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="387 123 4567" className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>
            {t('bk.email')} <span className="font-normal normal-case">{t('bk.optional')}</span>
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com" className={inputCls} />
        </div>

        {mode === 'online' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t('bk.country')} *</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} required>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t('bk.nationality')} *</label>
                <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}
                  placeholder="Argentina" className={inputCls} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>{t('bk.hotel')} *</label>
              <input type="text" value={hotel} onChange={(e) => setHotel(e.target.value)}
                placeholder={t('bk.hotel_ph')} className={inputCls} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t('bk.province')} *</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)} className={inputCls} required>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t('bk.dni')} *</label>
                <input type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="12.345.678" className={inputCls} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>{t('bk.birth')} *</label>
              <input type="text" value={birth} onChange={(e) => setBirth(maskBirth(e.target.value))}
                placeholder={t('bk.birth_ph')} inputMode="numeric" maxLength={10} className={inputCls} required />
            </div>
          </>
        )}

        <div>
          <label className={labelCls}>
            {t('bk.notes')} <span className="font-normal normal-case">{t('bk.optional')}</span>
          </label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            placeholder={t('bk.notes_ph')} className={inputCls} />
        </div>
      </div>

      {total !== null && (
        <div className="mt-5 flex items-center justify-between rounded-lg bg-norte-cream px-4 py-3">
          <span className="text-sm font-semibold text-norte-gray">{t('bk.total')}</span>
          <span className="text-xl font-extrabold text-norte-green">{formatPrice(total, lang)}</span>
        </div>
      )}

      {/* ---- modo de pago (solo online) ---- */}
      {mode === 'online' && total !== null && (
        <div className="mt-5">
          <p className="mb-2 border-b border-norte-green/10 pb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-norte-green">
            {t('bk.pay_title')}
          </p>
          <div className="space-y-2">
            {(
              [
                { v: 'mercadopago', t1: 'bk.pay_card', t2: 'bk.pay_card_sub' },
                { v: 'transferencia', t1: 'bk.pay_transfer', t2: 'bk.pay_transfer_sub' },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setPayMethod(o.v)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  payMethod === o.v
                    ? 'border-norte-green bg-norte-green/5'
                    : 'border-norte-green/15 hover:border-norte-green/40'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    payMethod === o.v ? 'border-norte-green bg-norte-green' : 'border-norte-gray/40'
                  }`}
                >
                  {payMethod === o.v && <span className="h-2 w-2 rounded-full bg-norte-yellow" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-norte-green">{t(o.t1)}</span>
                  <span className="block text-xs text-norte-gray">{t(o.t2)}</span>
                </span>
                {o.v === 'mercadopago' && (
                  <span className="rounded-md bg-[#00b1ea] px-2 py-1 text-[10px] font-black italic text-white">MP</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      {mode === 'online' ? (
        <button
          type="submit"
          disabled={paying || (total === null)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-norte-green px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider text-norte-cream shadow transition hover:bg-norte-green-light disabled:opacity-60"
        >
          {paying ? t('bk.sending') : total === null ? t('bk.ask') : t('bk.order')}
        </button>
      ) : (
        <button
          type="submit"
          disabled={sending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-norte-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow transition hover:brightness-95 disabled:opacity-60"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {sending ? t('bk.sending') : t('bk.submit')}
        </button>
      )}
      <p className="mt-3 text-center text-xs text-norte-gray">
        {mode === 'online' ? t('bk.order_note') : t('bk.foot')}
        {mode === 'whatsapp' && excursion.bookingLead ? ` ${tok(excursion.bookingLead)}` : ''}
      </p>
    </form>
  );
}
