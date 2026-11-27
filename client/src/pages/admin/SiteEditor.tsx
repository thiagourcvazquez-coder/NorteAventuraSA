import { useEffect, useState } from 'react';
import { adminFetch } from '../../lib/api';
import { ImageUpload } from './ContentFields';

export const DEFAULT_HERO = 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0686.jpg';

/** Pestaña "Sitio": foto principal (hero) de la página de inicio. */
export default function SiteEditor() {
  const [hero, setHero] = useState<string | null>(null);
  const [saved, setSaved] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'ok'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch<Record<string, string>>('/site')
      .then((s) => {
        setHero(s.hero_image ?? '');
        setSaved(s.hero_image ?? '');
      })
      .catch((e) => setError((e as Error).message));
  }, []);

  async function save() {
    if (hero === null) return;
    setState('saving');
    setError('');
    try {
      await adminFetch('/site', { method: 'PUT', body: JSON.stringify({ hero_image: hero }) });
      setSaved(hero);
      setState('ok');
      setTimeout(() => setState('idle'), 2500);
    } catch (e) {
      setError((e as Error).message);
      setState('idle');
    }
  }

  if (hero === null && !error) return <p className="p-6 text-sm text-norte-gray">Cargando…</p>;

  return (
    <div className="space-y-6 p-5 sm:p-8">
      <div>
        <h2 className="display text-2xl text-norte-green">Foto principal de la home</h2>
        <p className="mt-1 max-w-2xl text-sm text-norte-gray">
          Es la foto grande de la portada del sitio. Conviene una foto horizontal, de buena calidad y con personas.
          Si la dejás vacía se usa la foto original.
        </p>
      </div>

      <div className="max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <ImageUpload value={hero ?? ''} onChange={setHero} folder="hero" hint="Se achica sola al subirla." />
        <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-2xl bg-norte-green">
          <img src={hero || DEFAULT_HERO} alt="Vista previa del hero" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-norte-green-dark/80 via-norte-green-dark/20 to-norte-green-dark/40" />
          <p className="absolute bottom-3 left-4 text-xs font-extrabold uppercase tracking-widest text-norte-cream/80">Vista previa</p>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={save}
            disabled={state === 'saving' || hero === saved}
            className="rounded-full bg-norte-green px-7 py-2.5 text-sm font-extrabold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-50"
          >
            {state === 'saving' ? 'Guardando…' : 'Guardar'}
          </button>
          {state === 'ok' && <span className="text-sm font-bold text-emerald-600">✓ Guardado. Ya se ve en el sitio.</span>}
        </div>
      </div>
    </div>
  );
}
