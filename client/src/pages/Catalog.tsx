import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useExcursions } from '../hooks';
import { useLang } from '../i18n';
import ExcursionCard from '../components/ExcursionCard';
import PageBanner from '../components/PageBanner';
import { Reveal } from '../components/Motion';
import type { CategorySlug } from '../types';

const filters: { value: 'todas' | CategorySlug; key: 'cat.all' | 'nav.from_salta' | 'nav.from_jujuy' }[] = [
  { value: 'todas', key: 'cat.all' },
  { value: 'salta', key: 'nav.from_salta' },
  { value: 'jujuy', key: 'nav.from_jujuy' },
];

export default function Catalog() {
  const { excursions, loading } = useExcursions();
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const origen = (params.get('origen') ?? 'todas') as 'todas' | CategorySlug;
  const query = params.get('q') ?? '';

  function update(next: { origen?: string; q?: string }) {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === 'todas') p.delete(k);
      else p.set(k, v);
    }
    setParams(p, { replace: true });
  }

  const items = useMemo(
    () =>
      excursions.filter(
        (e) =>
          (origen === 'todas' || e.category === origen) &&
          (query === '' || `${e.name} ${e.location}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [excursions, origen, query],
  );

  return (
    <>
      <PageBanner eyebrow="Tours" title={t('cat.title')}>
        {t('cat.sub')}
      </PageBanner>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => update({ origen: f.value })}
              className={`rounded-full px-6 py-2.5 text-sm font-extrabold transition ${
                origen === f.value
                  ? 'bg-norte-green text-norte-cream'
                  : 'bg-white text-norte-green ring-1 ring-norte-green/20 hover:ring-norte-green/50'
              }`}
            >
              {t(f.key)}
            </button>
          ))}
          <input
            type="search"
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t('cat.search')}
            className="ml-auto w-full rounded-full border border-norte-green/20 bg-white px-6 py-2.5 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40 sm:w-72"
          />
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-[28px] bg-norte-green/10" />
            ))}
          </div>
        ) : items.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 3) * 0.08} y={50} className={i % 3 === 1 ? 'lg:mt-12' : ''}>
                <ExcursionCard excursion={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-20 text-center text-norte-gray">{t('cat.empty')}</p>
        )}
      </section>
    </>
  );
}
