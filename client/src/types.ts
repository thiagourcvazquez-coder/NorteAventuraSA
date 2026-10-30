export type CategorySlug = 'salta' | 'jujuy';

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
  price: number | null; // ARS por persona; null = consultar
  priceNote?: string;
  duration: string;
  schedule?: string;
  difficulty: 'Baja' | 'Media' | 'Alta';
  shortDesc: string;
  description: string;
  included?: string;
  bookingLead?: string;
  imageUrl?: string;
  faqs?: Faq[];
}

export interface ReservationRequest {
  excursionSlug: string;
  excursionName: string;
  customerName: string;
  phone: string;
  email?: string;
  startDate: string;
  people: number;
  notes?: string;
}

export interface ReservationResponse {
  id: string | null;
  whatsappUrl: string;
}
