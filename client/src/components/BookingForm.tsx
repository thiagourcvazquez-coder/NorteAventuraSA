import { useState } from 'react';
import type { Excursion } from '../types';
import { formatPrice } from '../lib/format';
import { createReservation } from '../lib/api';
import { useLang } from '../i18n';
import { WhatsAppIcon } from './Icons';

const inputCls =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2.5 text-sm text-norte-green outline-none transition focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export default function BookingForm({ excursion }: { excursion: Excursion }) {
  const { lang, t, tok } = useLang();
  const [startDate, setStartDate] = useState(tomorrow);
  const [people, setPeople] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const total = excursion.price !== null ? excursion.price * people : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!customerName.trim() || !phone.trim()) {
      setError(t('bk.error'));
      return;
    }
    setSending(true);
    const { whatsappUrl } = await createReservation({
      excursionSlug: excursion.slug,
      excursionName: excursion.name,
      customerName,
      phone,
      email: email || undefined,
      startDate,
      people,
      notes: notes || undefined,
    });
    setSending(false);
    window.open(whatsappUrl, '_blank', 'noopener');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-norte-green/10"
    >
      <div className="mb-5 border-b border-norte-green/10 pb-4">
        {excursion.price !== null ? (
          <>
            <p className="text-xs uppercase tracking-wide text-norte-gray">{t('bk.from')}</p>
            <p className="text-3xl font-extrabold text-norte-green">
              {formatPrice(excursion.price, lang)}
              <span className="ml-1 text-sm font-medium text-norte-gray">{t('bk.per_person')}</span>
            </p>
          </>
        ) : (
          <p className="text-lg font-bold text-norte-green">{t('bk.ask')}</p>
        )}
        {excursion.priceNote && <p className="mt-1 text-xs text-norte-gray">{tok(excursion.priceNote)}</p>}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.date')}
          </label>
          <input
            type="date"
            min={tomorrow}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.people')}
          </label>
          <select
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className={inputCls}
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? t('bk.person') : t('bk.people_p')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.name')}
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t('bk.name_ph')}
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.phone')}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="387 123 4567"
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.email')} <span className="font-normal normal-case">{t('bk.optional')}</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-norte-gray">
            {t('bk.notes')} <span className="font-normal normal-case">{t('bk.optional')}</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={t('bk.notes_ph')}
            className={inputCls}
          />
        </div>
      </div>

      {total !== null && (
        <div className="mt-5 flex items-center justify-between rounded-lg bg-norte-cream px-4 py-3">
          <span className="text-sm font-semibold text-norte-gray">{t('bk.total')}</span>
          <span className="text-xl font-extrabold text-norte-green">{formatPrice(total, lang)}</span>
        </div>
      )}

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-norte-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow transition hover:brightness-95 disabled:opacity-60"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {sending ? t('bk.sending') : t('bk.submit')}
      </button>
      <p className="mt-3 text-center text-xs text-norte-gray">
        {t('bk.foot')}
        {excursion.bookingLead ? ` ${excursion.bookingLead}` : ''}
      </p>
    </form>
  );
}
