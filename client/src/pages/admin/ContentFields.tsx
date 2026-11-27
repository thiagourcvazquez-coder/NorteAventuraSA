import { useRef, useState } from 'react';
import { uploadImage } from '../../lib/upload';

export const inputCls =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';
export const labelCls = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-norte-gray';

export interface FaqItem {
  question: string;
  answer: string;
}
export interface SectionItem {
  title: string;
  body: string;
}
export interface ExcursionContent {
  faqs: FaqItem[];
  images: string[];
  sections: SectionItem[];
  /** false si todavía no se corrió el SQL de bloques de texto */
  sectionsReady: boolean;
}

function move<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

const btn =
  'flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-norte-green ring-1 ring-norte-green/20 transition hover:bg-norte-green hover:text-norte-cream disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-norte-green';

/** Foto única: se sube desde la compu/celu, o se pega un link. */
export function ImageUpload({
  value,
  onChange,
  folder,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  hint?: string;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(f?: File) {
    if (!f) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(f, folder));
    } catch (e) {
      setErr((e as Error).message);
    }
    setBusy(false);
    if (file.current) file.current.value = '';
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-norte-green/10 ring-1 ring-norte-green/15">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-[11px] font-semibold text-norte-gray">Sin foto</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => file.current?.click()}
              className="rounded-full bg-norte-yellow px-4 py-2 text-xs font-extrabold text-norte-green transition hover:bg-norte-yellow-dark disabled:opacity-60"
            >
              {busy ? 'Subiendo…' : value ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-full px-4 py-2 text-xs font-bold text-norte-gray ring-1 ring-norte-green/20 hover:text-norte-green"
              >
                Quitar
              </button>
            )}
          </div>
          <input
            className={`${inputCls} mt-2 !py-1.5 text-xs`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="o pegá el link de una foto"
          />
          {hint && <p className="mt-1 text-[11px] text-norte-gray">{hint}</p>}
          {err && <p className="mt-1 text-xs font-medium text-red-600">{err}</p>}
        </div>
      </div>
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}

/** Galería "La experiencia en fotos": subir varias, ordenar y quitar. */
export function GalleryEditor({ images, onChange }: { images: string[]; onChange: (v: string[]) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setErr('');
    const urls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setBusy(`Subiendo ${i + 1} de ${files.length}…`);
        urls.push(await uploadImage(files[i], 'galeria'));
      }
    } catch (e) {
      setErr((e as Error).message);
    }
    if (urls.length) onChange([...images, ...urls]);
    setBusy('');
    if (file.current) file.current.value = '';
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((src, i) => (
          <div key={src + i} className="overflow-hidden rounded-xl bg-white ring-1 ring-norte-green/15">
            <img src={src} alt="" loading="lazy" className="h-24 w-full object-cover" />
            <div className="flex items-center justify-between gap-1 p-1.5">
              <button type="button" className={btn} disabled={i === 0} onClick={() => onChange(move(images, i, -1))} aria-label="Mover antes">
                ←
              </button>
              <button type="button" className={btn} onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label="Quitar foto">
                ✕
              </button>
              <button type="button" className={btn} disabled={i === images.length - 1} onClick={() => onChange(move(images, i, 1))} aria-label="Mover después">
                →
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={!!busy}
          onClick={() => file.current?.click()}
          className="flex h-[7.5rem] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-norte-green/25 text-xs font-extrabold text-norte-green transition hover:border-norte-yellow-dark hover:bg-norte-yellow/10 disabled:opacity-60"
        >
          <span className="text-2xl leading-none">+</span>
          {busy || 'Agregar fotos'}
        </button>
      </div>
      {err && <p className="mt-2 text-xs font-medium text-red-600">{err}</p>}
      <p className="mt-2 text-[11px] text-norte-gray">
        Se muestran como carrusel infinito. Con pocas o muchas fotos sigue funcionando igual.
      </p>
      <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
    </div>
  );
}

/** Preguntas frecuentes con sus respuestas. */
export function FaqEditor({ faqs, onChange }: { faqs: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  const set = (i: number, patch: Partial<FaqItem>) => onChange(faqs.map((f, k) => (k === i ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-norte-green/15">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <input className={inputCls} value={f.question} onChange={(e) => set(i, { question: e.target.value })} placeholder="Pregunta (ej: ¿El camino es peligroso?)" maxLength={300} />
              <textarea className={inputCls} rows={2} value={f.answer} onChange={(e) => set(i, { answer: e.target.value })} placeholder="Respuesta" maxLength={2000} />
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" className={btn} disabled={i === 0} onClick={() => onChange(move(faqs, i, -1))} aria-label="Subir">↑</button>
              <button type="button" className={btn} disabled={i === faqs.length - 1} onClick={() => onChange(move(faqs, i, 1))} aria-label="Bajar">↓</button>
              <button type="button" className={btn} onClick={() => onChange(faqs.filter((_, k) => k !== i))} aria-label="Quitar">✕</button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...faqs, { question: '', answer: '' }])}
        className="rounded-full bg-norte-yellow px-4 py-2 text-xs font-extrabold text-norte-green transition hover:bg-norte-yellow-dark"
      >
        + Agregar pregunta
      </button>
    </div>
  );
}

/** Bloques de título + descripción ("Disfrutá de la aventura", etc.). */
export function SectionsEditor({
  sections,
  onChange,
  ready,
}: {
  sections: SectionItem[];
  onChange: (v: SectionItem[]) => void;
  ready: boolean;
}) {
  const set = (i: number, patch: Partial<SectionItem>) => onChange(sections.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  return (
    <div className="space-y-3">
      {!ready && (
        <p className="rounded-lg bg-norte-yellow-dark/15 px-3 py-2 text-xs font-bold text-norte-green">
          Esta función todavía no está activada en la base de datos (falta correr el SQL de bloques de texto).
        </p>
      )}
      {sections.map((s, i) => (
        <div key={i} className="rounded-xl bg-white p-3 ring-1 ring-norte-green/15">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 space-y-2">
              <input className={`${inputCls} font-bold`} value={s.title} onChange={(e) => set(i, { title: e.target.value })} placeholder="Título (ej: Disfrutá de la aventura)" maxLength={200} />
              <textarea className={inputCls} rows={4} value={s.body} onChange={(e) => set(i, { body: e.target.value })} placeholder="Descripción" maxLength={6000} />
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" className={btn} disabled={i === 0} onClick={() => onChange(move(sections, i, -1))} aria-label="Subir">↑</button>
              <button type="button" className={btn} disabled={i === sections.length - 1} onClick={() => onChange(move(sections, i, 1))} aria-label="Bajar">↓</button>
              <button type="button" className={btn} onClick={() => onChange(sections.filter((_, k) => k !== i))} aria-label="Quitar">✕</button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={!ready}
        onClick={() => onChange([...sections, { title: '', body: '' }])}
        className="rounded-full bg-norte-yellow px-4 py-2 text-xs font-extrabold text-norte-green transition hover:bg-norte-yellow-dark disabled:opacity-40"
      >
        + Agregar bloque
      </button>
      <p className="text-[11px] text-norte-gray">
        Si no hay bloques, la excursión muestra “Disfrutá de la aventura” con la descripción completa de arriba.
      </p>
    </div>
  );
}
