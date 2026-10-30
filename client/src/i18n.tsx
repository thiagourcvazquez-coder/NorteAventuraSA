import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';

const STR = {
  es: {
    // ---- nav / header
    'nav.home': 'Inicio',
    'nav.excursions': 'Excursiones',
    'nav.from_salta': 'Desde Salta',
    'nav.from_jujuy': 'Desde Jujuy',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.book': 'Reservar',
    'nav.whatsapp': 'Escribinos por WhatsApp',
    'nav.open': 'Abrir menú',
    'nav.close': 'Cerrar menú',

    // ---- hero
    'hero.line1': 'Cuando dudes del camino,',
    'hero.line2': 'Seguí al',
    'hero.line3': 'Norte',
    'hero.cta1': 'Ver excursiones',
    'hero.cta2': 'Consultar',
    'hero.scroll': 'Scrolleá',

    // ---- home
    'home.eyebrow': 'Quiénes somos',
    'home.statement':
      'Somos una agencia de turismo orientada al trekking y al turismo alternativo. Reversionamos cada destino y le damos nuestro toque: ¡a Pura Aventura!',
    'home.more': 'Conocé más sobre nosotros →',
    'home.dest_eyebrow': 'Nuestros destinos',
    'home.dest_title': 'Tu próximo destino',
    'home.cta_badge': '5 estrellas en Google',
    'home.cta_t1': 'Tu aventura',
    'home.cta_t2': 'empieza acá.',
    'home.cta_text':
      'Guías locales, grupos reducidos y turismo sustentable. Escribinos y armamos la excursión perfecta para vos.',
    'home.cta_btn': 'Reservá tu aventura',

    // ---- showcase
    'show.eyebrow': 'Excursiones destacadas',
    'show.title': 'Elegí tu aventura',
    'show.all': 'Ver todas →',
    'show.catalog': 'Ver todo el catálogo →',

    // ---- pasos
    'steps.eyebrow': 'Cómo reservar',
    'steps.title': 'Cuatro pasos hasta el norte',
    'steps.1.t': 'Buscá',
    'steps.1.d': 'Explorá salidas desde Salta o Jujuy y encontrá la actividad que mejor se adapte a vos.',
    'steps.2.t': 'Elegí la fecha',
    'steps.2.d': 'Verificá disponibilidad y elegí el día que te quede cómodo. ¡Hay salidas diarias!',
    'steps.3.t': 'Reservá',
    'steps.3.d': 'Confirmá tu lugar directo con nosotros por WhatsApp, sin registros ni vueltas.',
    'steps.4.t': 'Disfrutá',
    'steps.4.d': 'Te esperamos para que pases un día lleno de nuevas aventuras.',

    // ---- catálogo
    'cat.title': 'Todas las aventuras',
    'cat.sub':
      'Excursiones diarias, trekking y experiencias por Salta y Jujuy. Elegí la tuya y reservá por WhatsApp.',
    'cat.all': 'Todas',
    'cat.search': 'Buscar excursión o destino…',
    'cat.empty': 'No encontramos excursiones para tu búsqueda.',

    // ---- detalle
    'det.duration': 'Duración:',
    'det.difficulty': 'Dificultad:',
    'det.enjoy': 'Disfrutá de la aventura',
    'det.included': 'Incluido',
    'det.when': 'Cuándo reservar:',
    'det.when_cta': 'Reservá ya y asegurá tu plaza.',
    'det.voucher': 'Tipo de bono:',
    'det.voucher_text': 'Digital. Llevalo en tu celular.',
    'det.sustain': 'Sostenibilidad:',
    'det.sustain_text':
      'Todos los servicios cumplen con el cuidado del medioambiente y el respeto a las comunidades.',
    'det.faqs': 'Preguntas frecuentes',
    'det.related': 'Otras aventuras',
    'det.notfound': 'Excursión no encontrada',
    'det.back': '← Volver a todas las aventuras',
    'gal.eyebrow': 'Galería',
    'gal.title': 'La experiencia en fotos',

    // ---- reserva
    'bk.from': 'Desde',
    'bk.per_person': 'por persona',
    'bk.ask': 'Consultá precio y disponibilidad',
    'bk.date': 'Fecha de inicio',
    'bk.people': 'Personas',
    'bk.person': 'persona',
    'bk.people_p': 'personas',
    'bk.name': 'Nombre y apellido',
    'bk.name_ph': 'Tu nombre',
    'bk.phone': 'Teléfono',
    'bk.email': 'Email',
    'bk.optional': '(opcional)',
    'bk.notes': 'Notas',
    'bk.notes_ph': '¿Alguna consulta?',
    'bk.total': 'Total estimado',
    'bk.submit': 'Reservar por WhatsApp',
    'bk.sending': 'Reservando…',
    'bk.foot': 'Te llevamos a WhatsApp con tu reserva lista para enviar.',
    'bk.error': 'Completá tu nombre y teléfono para reservar.',

    // ---- card
    'card.per_person': 'Por persona',

    // ---- contacto
    'ct.eyebrow': 'Contacto',
    'ct.title': 'Hablemos de tu próxima aventura',
    'ct.sub': 'Escribinos por WhatsApp o dejanos tu consulta y te respondemos a la brevedad.',
    'ct.intro':
      'Estamos en Salta, Argentina, y salimos todos los días hacia Salta, Tilcara y Jujuy.',
    'ct.form': 'Envianos tu consulta',
    'ct.name': 'Nombre',
    'ct.name_ph': 'Tu nombre',
    'ct.phone': 'Teléfono',
    'ct.msg': 'Mensaje',
    'ct.msg_ph': 'Contanos qué excursión te interesa, fechas, cantidad de personas…',
    'ct.send': 'Enviar por WhatsApp',
    'ct.note': 'Tu consulta se envía directo a nuestro WhatsApp.',

    // ---- nosotros
    'ab.eyebrow': 'Nosotros',
    'ab.title': 'Pura Aventura, del norte para el mundo',
    'ab.h': 'Quiénes somos',
    'ab.p1':
      'Somos una agencia de turismo con base en Salta y Tilcara, orientada al trekking y al turismo alternativo. Buscamos reversionar cada destino y darle nuestro toque: ¡a Pura Aventura!',
    'ab.p2':
      'Trabajamos con guías locales, grupos reducidos y un fuerte compromiso con la sustentabilidad: cada excursión cuida el medioambiente y respeta a las comunidades que nos reciben.',
    'ab.v1': 'Trekking y turismo alternativo',
    'ab.v2': 'Reversionamos cada destino con nuestro toque',
    'ab.v3': 'Excursiones, naturaleza y cultura',
    'ab.v4': 'Turismo para todxs',
    'ab.v5': 'Compromiso con el medioambiente y las comunidades locales',
    'ab.cta_t': '¿Listo para tu próxima aventura?',
    'ab.cta_b': 'Ver excursiones',

    // ---- footer
    'ft.l1': 'Cuando dudes',
    'ft.l2': 'del camino,',
    'ft.l3': 'seguí al Norte.',
    'ft.menu': 'Menú',
    'ft.contact': 'Contacto',

    // ---- 404
    'nf.title': 'Te fuiste del sendero',
    'nf.text': 'La página que buscás no existe o fue movida.',
    'nf.btn': 'Volver al inicio',

    // ---- cursor
    'cur.view': 'Ver',
    'cur.explore': 'Explorar',
    'cur.go': 'Ir',
    'cur.home': 'Inicio',

    // ---- destinos (subtítulos)
    'dest.cafayate': 'Vinos y quebradas',
  },

  en: {
    'nav.home': 'Home',
    'nav.excursions': 'Excursions',
    'nav.from_salta': 'From Salta',
    'nav.from_jujuy': 'From Jujuy',
    'nav.about': 'About us',
    'nav.contact': 'Contact',
    'nav.book': 'Book now',
    'nav.whatsapp': 'Message us on WhatsApp',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',

    'hero.line1': 'When in doubt about the road,',
    'hero.line2': 'Follow the',
    'hero.line3': 'North',
    'hero.cta1': 'See excursions',
    'hero.cta2': 'Ask us',
    'hero.scroll': 'Scroll',

    'home.eyebrow': 'Who we are',
    'home.statement':
      'We are a tourism agency focused on trekking and alternative tourism. We reimagine every destination and give it our own touch: pure adventure!',
    'home.more': 'Learn more about us →',
    'home.dest_eyebrow': 'Our destinations',
    'home.dest_title': 'Your next destination',
    'home.cta_badge': '5 stars on Google',
    'home.cta_t1': 'Your adventure',
    'home.cta_t2': 'starts here.',
    'home.cta_text':
      'Local guides, small groups and sustainable tourism. Message us and we will craft the perfect excursion for you.',
    'home.cta_btn': 'Book your adventure',

    'show.eyebrow': 'Featured excursions',
    'show.title': 'Choose your adventure',
    'show.all': 'See all →',
    'show.catalog': 'Browse the full catalog →',

    'steps.eyebrow': 'How to book',
    'steps.title': 'Four steps to the north',
    'steps.1.t': 'Browse',
    'steps.1.d': 'Explore departures from Salta or Jujuy and find the activity that suits you best.',
    'steps.2.t': 'Pick your date',
    'steps.2.d': 'Check availability and choose the day that works for you. Daily departures!',
    'steps.3.t': 'Book',
    'steps.3.d': 'Confirm your spot directly with us on WhatsApp — no sign-ups, no hassle.',
    'steps.4.t': 'Enjoy',
    'steps.4.d': 'We will be waiting to give you a day full of new adventures.',

    'cat.title': 'All the adventures',
    'cat.sub':
      'Daily excursions, trekking and experiences across Salta and Jujuy. Pick yours and book via WhatsApp.',
    'cat.all': 'All',
    'cat.search': 'Search excursion or destination…',
    'cat.empty': 'No excursions match your search.',

    'det.duration': 'Duration:',
    'det.difficulty': 'Difficulty:',
    'det.enjoy': 'Enjoy the adventure',
    'det.included': 'Included',
    'det.when': 'When to book:',
    'det.when_cta': 'Book now and secure your spot.',
    'det.voucher': 'Ticket type:',
    'det.voucher_text': 'Digital. Keep it on your phone.',
    'det.sustain': 'Sustainability:',
    'det.sustain_text':
      'All our services follow environmental care and respect for local communities.',
    'det.faqs': 'Frequently asked questions',
    'det.related': 'More adventures',
    'det.notfound': 'Excursion not found',
    'det.back': '← Back to all adventures',
    'gal.eyebrow': 'Gallery',
    'gal.title': 'The experience in photos',

    'bk.from': 'From',
    'bk.per_person': 'per person',
    'bk.ask': 'Ask for price and availability',
    'bk.date': 'Start date',
    'bk.people': 'People',
    'bk.person': 'person',
    'bk.people_p': 'people',
    'bk.name': 'Full name',
    'bk.name_ph': 'Your name',
    'bk.phone': 'Phone',
    'bk.email': 'Email',
    'bk.optional': '(optional)',
    'bk.notes': 'Notes',
    'bk.notes_ph': 'Any questions?',
    'bk.total': 'Estimated total',
    'bk.submit': 'Book via WhatsApp',
    'bk.sending': 'Booking…',
    'bk.foot': 'We will take you to WhatsApp with your booking ready to send.',
    'bk.error': 'Please fill in your name and phone to book.',

    'card.per_person': 'Per person',

    'ct.eyebrow': 'Contact',
    'ct.title': "Let's talk about your next adventure",
    'ct.sub': 'Message us on WhatsApp or leave your enquiry and we will get back to you soon.',
    'ct.intro':
      'We are based in Salta, Argentina, with daily departures to Salta, Tilcara and Jujuy.',
    'ct.form': 'Send us your enquiry',
    'ct.name': 'Name',
    'ct.name_ph': 'Your name',
    'ct.phone': 'Phone',
    'ct.msg': 'Message',
    'ct.msg_ph': 'Tell us which excursion interests you, dates, group size…',
    'ct.send': 'Send via WhatsApp',
    'ct.note': 'Your message goes straight to our WhatsApp.',

    'ab.eyebrow': 'About us',
    'ab.title': 'Pura Aventura, from the North to the world',
    'ab.h': 'Who we are',
    'ab.p1':
      'We are a tourism agency based in Salta and Tilcara, focused on trekking and alternative tourism. We aim to reimagine every destination and give it our own touch: pure adventure!',
    'ab.p2':
      'We work with local guides, small groups and a strong commitment to sustainability: every excursion cares for the environment and respects the communities that welcome us.',
    'ab.v1': 'Trekking and alternative tourism',
    'ab.v2': 'We reimagine every destination with our own touch',
    'ab.v3': 'Excursions, nature and culture',
    'ab.v4': 'Tourism for everyone',
    'ab.v5': 'Commitment to the environment and local communities',
    'ab.cta_t': 'Ready for your next adventure?',
    'ab.cta_b': 'See excursions',

    'ft.l1': 'When in doubt',
    'ft.l2': 'about the road,',
    'ft.l3': 'follow the North.',
    'ft.menu': 'Menu',
    'ft.contact': 'Contact',

    'nf.title': 'You went off the trail',
    'nf.text': "The page you're looking for doesn't exist or was moved.",
    'nf.btn': 'Back home',

    'cur.view': 'View',
    'cur.explore': 'Explore',
    'cur.go': 'Go',
    'cur.home': 'Home',

    'dest.cafayate': 'Wines & canyons',
  },
} as const;

export type Key = keyof (typeof STR)['es'];

/** Tokens que vienen de la DB y sí conviene traducir (enums/etiquetas fijas).
 *  Nombres de excursiones, lugares y descripciones quedan siempre en español. */
const TOKENS: Record<string, { es: string; en: string }> = {
  'Baja': { es: 'Baja', en: 'Easy' },
  'Media': { es: 'Media', en: 'Moderate' },
  'Alta': { es: 'Alta', en: 'Hard' },
  '1 (un) día': { es: '1 (un) día', en: '1 day' },
  '1/2 (medio) día': { es: '1/2 (medio) día', en: 'half day' },
  'Consultar horarios': { es: 'Consultar horarios', en: 'Ask for schedule' },
  'Precio x2 personas': { es: 'Precio x2 personas', en: 'Price for 2 people' },
  'Consultar precio': { es: 'Consultar precio', en: 'Ask for price' },
};

const CATEGORIES: Record<string, { es: string; en: string }> = {
  salta: { es: 'Desde Salta', en: 'From Salta' },
  jujuy: { es: 'Desde Jujuy', en: 'From Jujuy' },
};

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
  /** Traduce tokens de la DB (dificultad, duración, etc.); pasa el resto igual. */
  tok: (value?: string | null) => string;
  /** Nombre de categoría por slug. */
  cat: (slug?: string | null) => string;
}

const Ctx = createContext<LangCtx>({
  lang: 'es',
  setLang: () => {},
  t: (k) => STR.es[k],
  tok: (v) => v ?? '',
  cat: () => '',
});

function initialLang(): Lang {
  const saved = localStorage.getItem('na-lang');
  if (saved === 'es' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('na-lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LangCtx = {
    lang,
    setLang,
    t: (k) => STR[lang][k] ?? STR.es[k],
    tok: (v) => (v && TOKENS[v] ? TOKENS[v][lang] : v ?? ''),
    cat: (slug) => (slug && CATEGORIES[slug] ? CATEGORIES[slug][lang] : slug ?? ''),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Switch ES | EN para header / menú. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Idioma / Language"
      className={`flex items-center overflow-hidden rounded-full ring-1 ring-white/25 ${className}`}
    >
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
            lang === l
              ? 'bg-norte-yellow text-norte-green'
              : 'text-norte-cream/70 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
