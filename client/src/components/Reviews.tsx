import { useEffect, useState } from 'react';
import { getComments, submitComment, type PublicComment } from '../lib/api';
import { Reveal } from './Motion';
import { useLang } from '../i18n';

function Stars({ value, onPick }: { value: number; onPick?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick?.(n)}
          className={`text-2xl transition ${onPick ? 'cursor-pointer hover:scale-125' : 'cursor-default'} ${
            n <= value ? 'text-norte-yellow-dark' : 'text-norte-cream/25'
          }`}
          aria-label={`${n} estrellas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function CommentCard({ c, featured }: { c: PublicComment; featured?: boolean }) {
  const ex = Array.isArray(c.excursions) ? c.excursions[0] : c.excursions;
  return (
    <div
      className={`flex h-full flex-col rounded-3xl bg-white/10 p-7 ring-1 backdrop-blur-sm transition ${
        featured ? 'ring-norte-yellow/40' : 'ring-white/10'
      }`}
    >
      {c.rating && <p className="text-lg text-norte-yellow-dark">{'★'.repeat(c.rating)}</p>}
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-norte-cream/85">“{c.body}”</p>
      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="font-extrabold text-norte-cream">{c.author_name}</p>
        <p className="mt-0.5 text-xs text-norte-cream/50">
          {[c.author_location, ex?.name].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}

function ReviewForm({ onDone }: { onDone: () => void }) {
  const { t } = useLang();
  const [form, setForm] = useState({ authorName: '', authorLocation: '', body: '' });
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const res = await submitComment({
      authorName: form.authorName,
      authorLocation: form.authorLocation || undefined,
      rating,
      body: form.body,
    });
    if (res.ok) {
      setState('ok');
      setForm({ authorName: '', authorLocation: '', body: '' });
      setRating(5);
      setTimeout(onDone, 2500);
    } else {
      setError(res.error ?? 'Error');
      setState('error');
    }
  }

  if (state === 'ok') {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-norte-yellow p-8 text-center">
        <p className="display text-2xl text-norte-green">{t('rev.thanks_t')}</p>
        <p className="mt-2 text-sm font-semibold text-norte-green/70">
          {t('rev.thanks_d')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col rounded-3xl bg-norte-yellow p-7">
      <p className="display text-xl text-norte-green">{t('rev.form_t')}</p>
      <div className="mt-4">
        <Stars value={rating} onPick={setRating} />
      </div>
      <input
        value={form.authorName}
        onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
        placeholder={t('rev.name_ph')}
        required
        maxLength={80}
        className="mt-4 w-full rounded-2xl border-0 bg-white/80 px-5 py-3 text-sm font-semibold text-norte-green outline-none placeholder:text-norte-green/40 focus:ring-2 focus:ring-norte-green"
      />
      <input
        value={form.authorLocation}
        onChange={(e) => setForm((f) => ({ ...f, authorLocation: e.target.value }))}
        placeholder={t('rev.loc_ph')}
        maxLength={80}
        className="mt-3 w-full rounded-2xl border-0 bg-white/80 px-5 py-3 text-sm font-semibold text-norte-green outline-none placeholder:text-norte-green/40 focus:ring-2 focus:ring-norte-green"
      />
      <textarea
        value={form.body}
        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        placeholder={t('rev.body_ph')}
        required
        rows={3}
        maxLength={600}
        className="mt-3 w-full flex-1 rounded-2xl border-0 bg-white/80 px-5 py-3 text-sm font-semibold text-norte-green outline-none placeholder:text-norte-green/40 focus:ring-2 focus:ring-norte-green"
      />
      {state === 'error' && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-4 rounded-full bg-norte-green px-7 py-3 text-sm font-extrabold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
      >
        {state === 'sending' ? t('rev.sending') : t('rev.submit')}
      </button>
    </form>
  );
}

export default function Reviews() {
  const [comments, setComments] = useState<PublicComment[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    getComments().then(setComments);
  }, []);

  const list = comments ?? [];
  if (comments !== null && !list.length && !showForm) {
    // Sin testimonios todavía: igual mostramos el formulario invitado
    return (
      <section className="relative isolate overflow-hidden bg-norte-green">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="mx-auto max-w-4xl px-5 py-28 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('rev.eyebrow')}</p>
          <h2 className="display mt-3 text-[clamp(2rem,5vw,4rem)] text-norte-cream">{t('rev.title')}</h2>
          <p className="mt-4 max-w-lg text-norte-cream/65">{t('rev.empty')}</p>
          <div className="mt-10 max-w-xl">
            <ReviewForm onDone={() => {}} />
          </div>
        </div>
      </section>
    );
  }

  const featured = list.filter((c) => c.featured);
  const normal = list.filter((c) => !c.featured);

  return (
    <section className="relative isolate overflow-hidden bg-norte-green">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('rev.eyebrow')}</p>
            <h2 className="display mt-3 max-w-3xl text-[clamp(2rem,5vw,4rem)] text-norte-cream">{t('rev.title')}</h2>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-full bg-norte-yellow-dark px-7 py-3 text-sm font-extrabold text-norte-green transition hover:bg-white"
          >
            {showForm ? '←' : t('rev.cta')}
          </button>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {showForm && (
            <Reveal>
              <ReviewForm onDone={() => setShowForm(false)} />
            </Reveal>
          )}
          {[...featured, ...normal].slice(0, showForm ? 5 : 6).map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08} y={30}>
              <CommentCard c={c} featured={c.featured} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
