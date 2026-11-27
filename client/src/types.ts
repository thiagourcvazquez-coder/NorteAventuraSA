export type CategorySlug = 'salta' | 'jujuy';

/** Tipo de experiencia para el filtro del catálogo y las cards de destinos. */
export type TipoSlug = 'clasica' | 'trekking' | 'privada';

export interface Category {
  slug: CategorySlug;
  name: string;
  description?: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Excursion {
  slug: string;
  name: string;
  location: string;
  category: CategorySlug;
  tipo?: TipoSlug; // default 'clasica'
  price: number | null; // ARS por persona (o por 2 si priceNote = base doble); null = consultar
  priceNote?: string;
  duration: string;
  schedule?: string;
  difficulty: 'Baja' | 'Media' | 'Alta';
  shortDesc: string;
  description: string;
  included?: string;
  bookingLead?: string;
  imageUrl?: string;
  /** Portada propia (cargada desde el panel). Si no hay, se usa la portada con mapa. */
  coverUrl?: string;
  images?: string[];
  /** Bloques de título + descripción editables ("Disfrutá de la aventura"…). */
  sections?: { title: string; body: string }[];
  faqs?: Faq[];
  /** Texto de búsqueda para Google Maps (link + embed). */
  mapsQuery?: string;
}

export interface ReservationRequest {
  excursionSlug: string;
  excursionName: string;
  customerName: string;
  lastName?: string;
  phone: string;
  email?: string;
  startDate: string;
  people: number;
  notes?: string;
  country?: string;
  hotel?: string;
  nationality?: string;
  province?: string;
  documentId?: string;
  birthDate?: string;
  /** mercadopago | transferencia | whatsapp */
  paymentMethod?: string;
}

export interface ReservationResponse {
  id: string | null;
  whatsappUrl: string;
}
