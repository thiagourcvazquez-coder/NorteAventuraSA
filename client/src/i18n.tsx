import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';

const STR = {
  es: {
    // ---- nav / header
    'nav.home': 'Inicio',
    'nav.excursions': 'Excursiones',
    'nav.from_salta': 'Desde Salta',
    'nav.from_jujuy': 'Desde Jujuy',
    'nav.trekking': 'Trekking y Experiencias',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.book': 'Reservar',
    'nav.whatsapp': 'Escribinos por WhatsApp',
    'nav.open': 'Abrir menú',
    'nav.close': 'Cerrar menú',

    // ---- hero
    'hero.title': 'Viví el Norte Argentino como nunca antes',
    'hero.sub': 'Excursiones, trekking y experiencias auténticas desde Salta y Jujuy.',
    'hero.cta1': 'Ver excursiones',
    'hero.cta2': 'Consultar',
    'hero.scroll': 'Scrolleá',

    // ---- home
    'home.eyebrow': 'Quiénes somos',
    'home.statement':
      'Somos una agencia de turismo orientada al trekking y al turismo alternativo. Reversionamos cada destino y le damos nuestro toque: ¡a Pura Aventura!',
    'home.more': 'Conocé más sobre nosotros →',
    'home.daily_eyebrow': 'Salidas diarias',
    'home.daily_title': 'Excursiones todos los días',
    'home.daily_salta': 'Excursiones diarias desde Salta',
    'home.daily_jujuy': 'Excursiones diarias desde Jujuy',
    'home.dest_eyebrow': 'Nuestros destinos',
    'home.dest_title': 'Descubrí tu tipo de experiencia en el Norte',
    'dest.c1_t': 'Excursiones clásicas',
    'dest.c1_b': 'Ver excursiones',
    'dest.c2_t': 'Trekking & Turismo Activo',
    'dest.c2_b': 'Explorar trekking',
    'dest.c2_badge': 'Nuestro diferencial',
    'dest.c3_t': 'Salidas privadas y a medida',
    'dest.c3_b': 'Solicitar propuesta',
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

    // ---- catálogo
    'cat.title': 'Todas las aventuras',
    'cat.sub':
      'Excursiones diarias, trekking y experiencias por Salta y Jujuy. Elegí la tuya y reservá por WhatsApp.',
    'cat.all': 'Todas',
    'cat.clasicas': 'Clásicas',
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
    'det.map': 'Dónde queda',
    'det.map_open': 'Abrir en Google Maps',
    'det.related': 'Otras aventuras',
    'det.notfound': 'Excursión no encontrada',
    'det.back': '← Volver a todas las aventuras',
    'gal.eyebrow': 'Galería',
    'gal.title': 'La experiencia en fotos',

    // ---- reserva
    'bk.from': 'Desde',
    'bk.per_person': 'por persona',
    'bk.per_2people': 'por 2 personas (base doble)',
    'bk.pay_mp': 'Pagar con Mercado Pago',
    'bk.pay_note': 'Pagás online y te confirmamos por WhatsApp.',
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
    'bk.done_t': '¡Reserva registrada!',
    'bk.done_d': 'Elegí cómo confirmar tu lugar:',
    'bk.pay_error': 'No pudimos generar el link de pago. Probá por WhatsApp.',

    // ---- card
    'card.per_person': 'Por persona',

    // ---- contacto
    'ct.eyebrow': 'Contacto',
    'ct.title': 'Hablemos de tu próxima aventura',
    'ct.sub': 'Escribinos por WhatsApp o dejanos tu consulta y te respondemos a la brevedad.',
    'ct.intro':
      '¿Tenés dudas sobre una excursión o un trekking? ¿Buscás una salida privada a tu medida? Contanos qué te gustaría conocer y te asesoramos con información clara y concreta para que elijas la experiencia ideal para vos.',
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
    'ab.title': 'Especialistas en trekking en Salta y Tilcara',
    'ab.h': 'Quiénes somos',
    'ab.p1':
      'En Norte Aventura somos una agencia especializada en trekking y experiencias activas en el Norte Argentino. Trabajamos principalmente en Salta y Tilcara, organizando salidas bien planificadas, con logística clara y coordinación profesional.',
    'ab.p2':
      'Cada circuito que ofrecemos fue recorrido y evaluado previamente por nuestro equipo. Conocemos el terreno, las distancias, los tiempos y las condiciones reales de cada zona. Esa preparación nos permite organizar experiencias seguras, ordenadas y sin improvisaciones.',
    'ab.p3':
      'Nuestro equipo está formado por profesionales con experiencia en la región y turismo activo. Priorizamos la seguridad, el respeto por el entorno y una comunicación directa con cada viajero.',
    'ab.p4':
      'Organizamos experiencias en el Norte Argentino con planificación real y conocimiento del territorio.',
    'ab.v1': 'Trekking y experiencias activas',
    'ab.v2': 'Logística clara y coordinación profesional',
    'ab.v3': 'Circuitos recorridos y evaluados por nuestro equipo',
    'ab.v4': 'Seguridad y respeto por el entorno',
    'ab.v5': 'Comunicación directa con cada viajero',
    'ab.cta_t': '¿Listo para tu próxima aventura?',
    'ab.cta_b': 'Ver excursiones',

    // ---- footer
    'ft.l1': 'Cuando dudes',
    'ft.l2': 'del camino,',
    'ft.l3': 'seguí al Norte.',
    'ft.desc':
      'Somos una agencia especializada en trekking y experiencias activas en el Norte Argentino, con base en Salta y Tilcara. Creamos salidas únicas, con identidad propia, planificación profesional, logística organizada y atención cercana para que cada salida sea segura, auténtica y sin improvisaciones.',
    'ft.menu': 'Menú',
    'ft.contact': 'Contacto',

    // ---- pago
    'pay.approved_t': '¡Pago aprobado!',
    'pay.approved_d': 'Tu reserva quedó confirmada. Te contactamos por WhatsApp para coordinar los detalles.',
    'pay.pending_t': 'Pago pendiente',
    'pay.pending_d': 'Estamos procesando tu pago. Cuando se acredite te confirmamos por WhatsApp.',
    'pay.failure_t': 'El pago no se completó',
    'pay.failure_d': 'No se realizó ningún cargo. Podés reintentar desde la excursión o reservar por WhatsApp.',
    'pay.back': 'Volver a excursiones',
    'pay.home': 'Ir al inicio',

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
    'nav.trekking': 'Trekking & Experiences',
    'nav.about': 'About us',
    'nav.contact': 'Contact',
    'nav.book': 'Book now',
    'nav.whatsapp': 'Message us on WhatsApp',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',

    'hero.title': 'Experience the Argentine North like never before',
    'hero.sub': 'Excursions, trekking and authentic experiences from Salta and Jujuy.',
    'hero.cta1': 'See excursions',
    'hero.cta2': 'Ask us',
    'hero.scroll': 'Scroll',

    'home.eyebrow': 'Who we are',
    'home.statement':
      'We are a tourism agency focused on trekking and alternative tourism. We reimagine every destination and give it our own touch: pure adventure!',
    'home.more': 'Learn more about us →',
    'home.daily_eyebrow': 'Daily departures',
    'home.daily_title': 'Excursions every day',
    'home.daily_salta': 'Daily excursions from Salta',
    'home.daily_jujuy': 'Daily excursions from Jujuy',
    'home.dest_eyebrow': 'Our destinations',
    'home.dest_title': 'Discover your kind of experience in the North',
    'dest.c1_t': 'Classic excursions',
    'dest.c1_b': 'See excursions',
    'dest.c2_t': 'Trekking & Active Tourism',
    'dest.c2_b': 'Explore trekking',
    'dest.c2_badge': 'Our signature',
    'dest.c3_t': 'Private & tailor-made departures',
    'dest.c3_b': 'Request a quote',
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

    'cat.title': 'All the adventures',
    'cat.sub':
      'Daily excursions, trekking and experiences across Salta and Jujuy. Pick yours and book via WhatsApp.',
    'cat.all': 'All',
    'cat.clasicas': 'Classic',
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
    'det.map': 'Where it is',
    'det.map_open': 'Open in Google Maps',
    'det.related': 'More adventures',
    'det.notfound': 'Excursion not found',
    'det.back': '← Back to all adventures',
    'gal.eyebrow': 'Gallery',
    'gal.title': 'The experience in photos',

    'bk.from': 'From',
    'bk.per_person': 'per person',
    'bk.per_2people': 'for 2 people (double base)',
    'bk.pay_mp': 'Pay with Mercado Pago',
    'bk.pay_note': 'Pay online and we confirm via WhatsApp.',
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
    'bk.done_t': 'Booking registered!',
    'bk.done_d': 'Choose how to confirm your spot:',
    'bk.pay_error': 'We could not generate the payment link. Try via WhatsApp.',

    'card.per_person': 'Per person',

    'ct.eyebrow': 'Contact',
    'ct.title': "Let's talk about your next adventure",
    'ct.sub': 'Message us on WhatsApp or leave your enquiry and we will get back to you soon.',
    'ct.intro':
      'Questions about an excursion or a trek? Looking for a private tailor-made departure? Tell us what you would like to discover and we will advise you with clear, concrete information so you can choose the ideal experience.',
    'ct.form': 'Send us your enquiry',
    'ct.name': 'Name',
    'ct.name_ph': 'Your name',
    'ct.phone': 'Phone',
    'ct.msg': 'Message',
    'ct.msg_ph': 'Tell us which excursion interests you, dates, group size…',
    'ct.send': 'Send via WhatsApp',
    'ct.note': 'Your message goes straight to our WhatsApp.',

    'ab.eyebrow': 'About us',
    'ab.title': 'Trekking specialists in Salta and Tilcara',
    'ab.h': 'Who we are',
    'ab.p1':
      'At Norte Aventura we are an agency specialized in trekking and active experiences in the Argentine North. We mainly operate in Salta and Tilcara, organizing well-planned departures with clear logistics and professional coordination.',
    'ab.p2':
      'Every circuit we offer has been previously explored and evaluated by our team. We know the terrain, the distances, the timing and the real conditions of each area. That preparation allows us to organize safe, well-ordered experiences with no improvisation.',
    'ab.p3':
      'Our team is made up of professionals with experience in the region and active tourism. We prioritize safety, respect for the environment and direct communication with every traveler.',
    'ab.p4':
      'We organize experiences in the Argentine North with real planning and knowledge of the territory.',
    'ab.v1': 'Trekking and active experiences',
    'ab.v2': 'Clear logistics and professional coordination',
    'ab.v3': 'Circuits explored and evaluated by our team',
    'ab.v4': 'Safety and respect for the environment',
    'ab.v5': 'Direct communication with every traveler',
    'ab.cta_t': 'Ready for your next adventure?',
    'ab.cta_b': 'See excursions',

    'ft.l1': 'When in doubt',
    'ft.l2': 'about the road,',
    'ft.l3': 'follow the North.',
    'ft.desc':
      'We are an agency specialized in trekking and active experiences in the Argentine North, based in Salta and Tilcara. We create unique departures with our own identity, professional planning, organized logistics and close attention so that every trip is safe, authentic and without improvisation.',
    'ft.menu': 'Menu',
    'ft.contact': 'Contact',

    'pay.approved_t': 'Payment approved!',
    'pay.approved_d': 'Your booking is confirmed. We will contact you on WhatsApp to coordinate the details.',
    'pay.pending_t': 'Payment pending',
    'pay.pending_d': 'We are processing your payment. Once it clears we will confirm on WhatsApp.',
    'pay.failure_t': 'Payment was not completed',
    'pay.failure_d': 'No charge was made. You can retry from the excursion page or book via WhatsApp.',
    'pay.back': 'Back to excursions',
    'pay.home': 'Go home',

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
  '2 (dos) días': { es: '2 (dos) días', en: '2 days' },
  'A coordinar': { es: 'A coordinar', en: 'To be arranged' },
  '1/2 (medio) día': { es: '1/2 (medio) día', en: 'half day' },
  'Consultar horarios': { es: 'Consultar horarios', en: 'Ask for schedule' },
  'Precio x2 personas': { es: 'Precio x2 personas', en: 'Price for 2 people' },
  'Consultar precio': { es: 'Consultar precio', en: 'Ask for price' },
  '7:00 a 19:00hs': { es: '7:00 a 19:00hs', en: '7:00am – 7:00pm' },
  '7:00 a 20:00hs': { es: '7:00 a 20:00hs', en: '7:00am – 8:00pm' },
  'Traslado, seguro, guiado.': { es: 'Traslado, seguro, guiado.', en: 'Transport, insurance, guide.' },
  'Guía, seguro, snack.': { es: 'Guía, seguro, snack.', en: 'Guide, insurance, snack.' },
  'Guía local, llamas, seguro.': { es: 'Guía local, llamas, seguro.', en: 'Local guide, llamas, insurance.' },
  'Guía, seguro.': { es: 'Guía, seguro.', en: 'Guide, insurance.' },
  'Reservá hasta 48hs antes sujeto a disponibilidad.': {
    es: 'Reservá hasta 48hs antes sujeto a disponibilidad.',
    en: 'Book up to 48h in advance, subject to availability.',
  },
  'Reservá con anticipación, cupos limitados.': {
    es: 'Reservá con anticipación, cupos limitados.',
    en: 'Book in advance — limited spots.',
  },
  'Consultar disponibilidad.': { es: 'Consultar disponibilidad.', en: 'Ask about availability.' },
  'Consultar disponibilidad y tarifas del tren.': {
    es: 'Consultar disponibilidad y tarifas del tren.',
    en: 'Ask about availability and train fares.',
  },
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
