import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Excursion, CategorySlug } from '../types';
import { FALLBACK_EXCURSIONS } from '../data/excursions';
import { GALLERIES } from '../data/galleries';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

interface ExcursionRow {
  slug: string;
  name: string;
  location: string;
  price: number | null;
  price_note: string | null;
  duration: string;
  schedule: string | null;
  difficulty: 'Baja' | 'Media' | 'Alta';
  short_desc: string;
  description: string;
  included: string | null;
  booking_lead: string | null;
  image_url: string | null;
  display_order: number;
  categories: { slug: string } | { slug: string }[] | null;
  excursion_faqs: { question: string; answer: string; sort_order: number }[];
  excursion_images: { url: string; sort_order: number }[];
}

function rowToExcursion(r: ExcursionRow): Excursion {
  const cat = Array.isArray(r.categories) ? r.categories[0] : r.categories;
  return {
    slug: r.slug,
    name: r.name,
    location: r.location,
    category: (cat?.slug ?? 'salta') as CategorySlug,
    price: r.price,
    priceNote: r.price_note ?? undefined,
    duration: r.duration,
    schedule: r.schedule ?? undefined,
    difficulty: r.difficulty,
    shortDesc: r.short_desc,
    description: r.description,
    included: r.included ?? undefined,
    bookingLead: r.booking_lead ?? undefined,
    imageUrl: r.image_url ?? undefined,
    images:
      (r.excursion_images?.length
        ? r.excursion_images.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url)
        : GALLERIES[r.slug]) ??
      (r.image_url ? [r.image_url] : []),
    faqs: r.excursion_faqs
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map(({ question, answer }) => ({ question, answer })),
  };
}

/**
 * Trae las excursiones desde Supabase.
 * Si no hay credenciales o falla la query → datos de respaldo locales.
 */
const withGallery = (list: Excursion[]): Excursion[] =>
  list.map((e) => (e.images?.length ? e : { ...e, images: GALLERIES[e.slug] ?? (e.imageUrl ? [e.imageUrl] : []) }));

export async function getExcursions(): Promise<Excursion[]> {
  if (!supabase) return withGallery(FALLBACK_EXCURSIONS);
  const { data, error } = await supabase
    .from('excursions')
    .select('*, categories(slug), excursion_faqs(question, answer, sort_order), excursion_images(url, sort_order)')
    .eq('is_active', true)
    .order('display_order');
  if (error || !data?.length) {
    console.warn('[supabase] fallback a datos locales:', error?.message);
    return withGallery(FALLBACK_EXCURSIONS);
  }
  return (data as ExcursionRow[]).map(rowToExcursion);
}

export async function getExcursion(slug: string): Promise<Excursion | null> {
  const all = await getExcursions();
  return all.find((e) => e.slug === slug) ?? null;
}
