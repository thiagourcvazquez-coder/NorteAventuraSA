/** Reseñas de Google (Places API New), con caché en memoria. */
const TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();

export async function getReviews(lang: 'es' | 'en' = 'es') {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;
  const hit = cache.get(lang);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  try {
    return await fetchFromGoogle(key, placeId, lang);
  } catch (e) {
    if (hit) return hit.data; // copia vencida, mejor que nada
    throw e;
  }
}

async function fetchFromGoogle(key: string, placeId: string, lang: 'es' | 'en') {
  const r = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=${lang}`, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
    },
  });
  if (!r.ok) throw new Error(`Places ${r.status}`);
  const p = (await r.json()) as any;
  const data = {
    rating: p.rating ?? null,
    total: p.userRatingCount ?? 0,
    url: p.googleMapsUri ?? null,
    reviews: (p.reviews ?? []).map((v: any) => ({
      author: v.authorAttribution?.displayName ?? '',
      photo: v.authorAttribution?.photoUri ?? null,
      rating: v.rating,
      text: v.text?.text ?? v.originalText?.text ?? '',
      when: v.relativePublishTimeDescription ?? '',
    })),
  };
  cache.set(lang, { at: Date.now(), data });
  return data;
}
