import { useEffect, useState } from 'react';
import { fetchGoogleReviews, type GoogleReviewsData } from '../lib/api';
import { useLang } from '../i18n';
import InfiniteStrip from './InfiniteStrip';

/** "G" oficial de Google (cuatro colores). */
function GoogleG({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6Z" />
      <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}

function GoogleWordmark({ className = '' }: { className?: string }) {
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#4285F4', '#34A853', '#EA4335'];
  return (
    <span className={`font-sans font-bold tracking-tight ${className}`} aria-label="Google">
      {'Google'.split('').map((c, i) => (
        <span key={i} style={{ color: colors[i] }}>
          {c}
        </span>
      ))}
    </span>
  );
}

const Stars = ({ n, size = 'text-lg' }: { n: number; size?: string }) => (
  <span className={`${size} tracking-tight text-[#FBBC04]`} aria-label={`${n} / 5`}>
    {'★'.repeat(Math.round(n))}
    <span className="text-black/15">{'★'.repeat(5 - Math.round(n))}</span>
  </span>
);

const AVATAR_COLORS = ['#C2185B', '#6D4C41', '#00796B', '#5E35B1', '#E64A19', '#1565C0', '#2E7D32'];

function Avatar({ name, photo }: { name: string; photo: string | null }) {
  const [broken, setBroken] = useState(false);
  if (photo && !broken) {
    return (
      <img
        src={photo}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        draggable={false}
        onError={() => setBroken(true)}
        className="h-11 w-11 rounded-full object-cover"
      />
    );
  }
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: color }}>
      {name.trim().charAt(0).toUpperCase() || 'G'}
    </span>
  );
}

const VerifiedCheck = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Verificada">
    <circle cx="12" cy="12" r="10" fill="#4285F4" />
    <path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const cardWidth = () => (window.innerWidth < 640 ? 280 : 330);

/** Bloque de reseñas de Google, con el formato del widget de Google (separado de los comentarios propios del sitio). */
export default function GoogleReviews() {
  const { t, lang } = useLang();
  const [d, setD] = useState<GoogleReviewsData | null>(null);

  useEffect(() => {
    fetchGoogleReviews(lang).then(setD);
  }, [lang]);

  const reviews = d?.reviews.filter((r) => r.text.trim()) ?? [];
  if (!d || !reviews.length) return null;

  const rating = d.rating ?? 5;
  const label = rating >= 4.5 ? t('grev.excellent') : rating >= 4 ? t('grev.great') : t('grev.good');

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow-dark">{t('grev.eyebrow')}</p>
        <h2 className="display mt-2 text-[clamp(2rem,4.5vw,3.6rem)] text-norte-green">{t('grev.title')}</h2>

        <a
          href={d.url ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-8 inline-flex flex-col items-center gap-1 rounded-2xl px-6 py-3 transition hover:bg-norte-cream"
        >
          <span className="text-lg font-extrabold uppercase tracking-wide text-norte-green">{label}</span>
          <Stars n={rating} size="text-3xl" />
          <span className="text-sm text-norte-gray">
            {t('grev.based')} <strong className="text-norte-green">{d.total}</strong> {t('grev.reviews')}
          </span>
          <GoogleWordmark className="mt-1 text-3xl" />
        </a>
      </div>

      <InfiniteStrip
        className="mt-10"
        gap={16}
        itemWidth={cardWidth}
        items={reviews.map((r, i) => (
          <figure
            key={i}
            style={{ width: cardWidth() }}
            className="flex h-[210px] flex-col rounded-2xl bg-white p-5 text-left shadow-[0_2px_14px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
          >
            <div className="flex items-start gap-3">
              <Avatar name={r.author} photo={r.photo} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-neutral-900">{r.author}</p>
                <p className="text-xs text-neutral-500">{r.when}</p>
              </div>
              <GoogleG className="h-5 w-5 shrink-0" />
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Stars n={r.rating} />
              <VerifiedCheck />
            </div>
            <blockquote className="mt-2 line-clamp-4 text-[14px] leading-snug text-neutral-800">{r.text}</blockquote>
          </figure>
        ))}
      />

      {d.url && (
        <div className="mt-6 text-center">
          <a
            href={d.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-norte-green px-6 py-3 text-sm font-extrabold text-norte-cream transition hover:bg-norte-yellow-dark hover:text-norte-green"
          >
            <GoogleG className="h-4 w-4" /> {t('grev.all')}
          </a>
        </div>
      )}
    </section>
  );
}
