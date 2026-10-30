// Genera docs/propuesta/propuesta-norte-aventura.pdf
// Uso: node generate.mjs   (o `npm run propuesta` desde la raíz)
import { createRequire } from 'node:module';
const pdfmake = createRequire(import.meta.url)('pdfmake');
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const F = (n) => path.join(dir, 'assets/fonts', n);

pdfmake.setLocalAccessPolicy(() => true);
pdfmake.setFonts({
  Montserrat: {
    normal: F('Montserrat-Regular.ttf'),
    bold: F('Montserrat-Bold.ttf'),
    italics: F('Montserrat-Regular.ttf'),
    bolditalics: F('Montserrat-Bold.ttf'),
  },
});

const GREEN = '#093628';
const GREEN_LIGHT = '#0d4a36';
const YELLOW = '#FFC83B';
const CREAM = '#FFFBF2';
const GRAY = '#6C6D72';

// ---------------------------------------------------------------- helpers
const h1 = (text) => ({
  text,
  fontSize: 16,
  bold: true,
  color: GREEN,
  margin: [0, 18, 0, 8],
});
const h2 = (text) => ({
  text,
  fontSize: 11.5,
  bold: true,
  color: GREEN_LIGHT,
  margin: [0, 10, 0, 4],
});
const p = (text, opts = {}) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.45, margin: [0, 0, 0, 6], ...opts });
const li = (text) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.4, margin: [0, 1.5, 0, 1.5] });

const table = (head, rows, widths, opts = {}) => ({
  table: {
    headerRows: 1,
    widths,
    body: [
      head.map((t) => ({ text: t, bold: true, fontSize: 9, color: CREAM, fillColor: GREEN, margin: [6, 5, 6, 5] })),
      ...rows.map((r, i) =>
        r.map((c) => ({
          ...(typeof c === 'object' ? c : { text: c }),
          fontSize: 8.8,
          color: GREEN,
          fillColor: i % 2 ? '#F4F1E8' : '#FFFFFF',
          margin: [6, 4, 6, 4],
          ...(typeof c === 'object' ? c : {}),
        })),
      ),
    ],
  },
  layout: {
    hLineColor: '#E3DEC9',
    vLineColor: '#E3DEC9',
    paddingTop: () => 4,
    paddingBottom: () => 4,
  },
  margin: [0, 4, 0, 10],
  ...opts,
});

// ---------------------------------------------------------------- doc
const doc = {
  pageSize: 'A4',
  pageMargins: [48, 56, 48, 56],
  defaultStyle: { font: 'Montserrat' },
  info: {
    title: 'Propuesta Técnica — Norte Aventura',
    author: 'Desarrollo Web',
    subject: 'Sitio web a medida: React + Node + TypeScript + Supabase',
  },

  background: (page) =>
    page === 1
      ? {
          canvas: [
            { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: GREEN },
            { type: 'rect', x: 0, y: 620, w: 595.28, h: 10, color: YELLOW },
          ],
        }
      : {
          canvas: [
            { type: 'rect', x: 0, y: 0, w: 595.28, h: 5, color: YELLOW },
            { type: 'rect', x: 0, y: 5, w: 595.28, h: 3, color: GREEN },
          ],
        },

  footer: (page, total) =>
    page === 1
      ? null
      : {
          columns: [
            { text: 'Norte Aventura — Propuesta Técnica', fontSize: 7.5, color: GRAY, margin: [48, 18, 0, 0] },
            { text: `Página ${page} de ${total}`, fontSize: 7.5, color: GRAY, alignment: 'right', margin: [0, 18, 48, 0] },
          ],
        },

  content: [
    // ------------------------------------------------------ PORTADA
    {
      stack: [
        { image: path.join(dir, 'assets/logo.png'), width: 110, alignment: 'center', margin: [0, 130, 0, 24] },
        { text: 'NORTE AVENTURA', fontSize: 13, bold: true, color: YELLOW, alignment: 'center', characterSpacing: 4 },
        { text: 'Salta · Tilcara · Jujuy', fontSize: 9, color: '#BFD8CC', alignment: 'center', margin: [0, 6, 0, 60] },
        { text: 'Propuesta Técnica', fontSize: 30, bold: true, color: '#FFFFFF', alignment: 'center' },
        { text: 'Desarrollo de Sitio Web a Medida', fontSize: 14, color: YELLOW, alignment: 'center', margin: [0, 8, 0, 90] },
        {
          text: 'React · Node.js · TypeScript · Supabase',
          fontSize: 9.5,
          color: '#BFD8CC',
          alignment: 'center',
        },
        {
          text: `Octubre 2026 — Documento confidencial`,
          fontSize: 8.5,
          color: '#8FB3A2',
          alignment: 'center',
          margin: [0, 40, 0, 0],
        },
      ],
      pageBreak: 'after',
    },

    // ------------------------------------------------------ 1. OBJETIVO
    h1('1. Objetivo del proyecto'),
    p(
      'Norte Aventura es una agencia de turismo de Salta que opera excursiones y trekking por Salta y Jujuy ' +
        '(Purmamarca, Hornocal, Salinas Grandes, Cachi, Cafayate, Tilcara, Iruya, entre otros destinos). ' +
        'Actualmente su sitio web funciona sobre WordPress + WooCommerce, lo que limita la velocidad, ' +
        'la identidad visual y la evolución del negocio.',
    ),
    p(
      'El objetivo de esta propuesta es desarrollar un sitio web a medida, moderno y rápido, que respete la ' +
        'identidad de la marca (verde #093628, amarillo #FFC83B, tipografía Montserrat), simplifique el proceso ' +
        'de reserva para el cliente final y deje una base técnica sólida para crecer hacia un backoffice ' +
        'de autogestión y cobros online.',
    ),
    table(
      ['Situación actual', 'Propuesta'],
      [
        ['WordPress + WooCommerce + plugins de terceros', 'Código a medida: rápido, seguro y sin dependencias frágiles'],
        ['Checkout complejo para vender excursiones', 'Reserva en 2 pasos que deriva a WhatsApp con el mensaje listo'],
        ['Edición de contenidos técnica y riesgosa', 'Contenidos en base de datos, listos para un backoffice (Fase 2)'],
        ['Sin registro estructurado de consultas', 'Cada reserva queda registrada como lead en la base de datos'],
      ],
      ['*', '*'],
    ),

    // ------------------------------------------------------ 2. ALCANCE
    h1('2. Alcance funcional — Fase 1 (entregada)'),
    h2('Público'),
    { ul: [
      'Home con hero, excursiones destacadas por origen (Desde Salta / Desde Jujuy), pasos de reserva, destinos y CTA a WhatsApp.',
      'Catálogo completo de excursiones con filtros por origen y buscador.',
      'Ficha de excursión: imagen, ubicación, duración, horario, dificultad, descripción, servicios incluidos, FAQs y relacionadas.',
      'Formulario de reserva (fecha, personas, datos de contacto) que registra el lead y abre WhatsApp con el mensaje pre-armado al +54 9 387 403 9502.',
      'Páginas Nosotros y Contacto. Diseño 100% responsive (mobile-first).',
    ].map(li) },
    h2('Datos'),
    { ul: [
      'Las 15 excursiones actuales del catálogo ya migradas a la base de datos con precios, duración, dificultad e imágenes.',
      'Modelo preparado para galerías de fotos, FAQs por excursión y contenidos editables del sitio.',
    ].map(li) },

    // ------------------------------------------------------ 3. STACK
    h1('3. Stack tecnológico'),
    table(
      ['Capa', 'Tecnología', 'Por qué'],
      [
        ['Frontend', 'React 19 + Vite + TypeScript + Tailwind CSS', 'SPA rápida, tipada, con la identidad visual de la marca'],
        ['Backend / API', 'Node.js + Express + TypeScript', 'API liviana para reservas, futuros pagos e integraciones'],
        ['Base de datos', 'Supabase (PostgreSQL gestionado)', 'DB real con Auth, Storage y seguridad por filas (RLS) incluidas'],
        ['Reservas', 'Deep-link wa.me + registro en DB', 'Conversión directa a WhatsApp sin perder el dato del lead'],
        ['Hosting (sugerido)', 'Vercel/Netlify (front) + Supabase Cloud', 'Deploy continuo, HTTPS y costo inicial mínimo'],
        ['Pagos (Fase 3)', 'MercadoPago', 'Estándar en Argentina: tarjetas, débito y transferencia'],
      ],
      [70, 165, '*'],
    ),

    // ------------------------------------------------------ 4. ARQUITECTURA
    h1('4. Arquitectura de la solución'),
    {
      text: [
        'Navegador (React SPA)\n',
        '      │\n',
        '      ├─► Supabase (Postgres) — catálogo, imágenes, FAQs  [lectura pública]\n',
        '      │\n',
        '      └─► API Node/Express — POST /api/reservations\n',
        '              │\n',
        '              ├─► Supabase: guarda el lead (tabla reservations)\n',
        '              └─► wa.me/5493874039502 — WhatsApp con mensaje pre-armado',
      ],
      font: 'Montserrat',
      fontSize: 8.5,
      color: GREEN,
      fillColor: '#F4F1E8',
      margin: [0, 4, 0, 10],
      preserveLeadingSpaces: true,
    },
    h2('Modelo de datos (Supabase)'),
    table(
      ['Tabla', 'Contenido'],
      [
        ['categories', 'Orígenes de las excursiones: Desde Salta / Desde Jujuy'],
        ['excursions', 'Nombre, ubicación, precio, duración, horario, dificultad, descripción, incluido, imagen'],
        ['excursion_images', 'Galería de fotos por excursión (preparado para Fase 2)'],
        ['excursion_faqs', 'Preguntas frecuentes por excursión'],
        ['reservations', 'Leads de reserva: excursión, fecha, personas, contacto, total estimado, estado'],
        ['site_content', 'Textos editables del sitio (hero, nosotros, contacto, redes) — base del backoffice'],
      ],
      [130, '*'],
    ),
    p(
      'Seguridad: la lectura del catálogo es pública mediante políticas RLS; la escritura de reservas solo se ' +
        'realiza desde la API con service role, nunca desde el navegador.',
    ),

    // ------------------------------------------------------ 5. ROADMAP
    h1('5. Roadmap por fases'),
    table(
      ['Fase', 'Alcance', 'Estado'],
      [
        ['Fase 1', 'Sitio informativo completo + catálogo + fichas + reservas por WhatsApp + DB Supabase', 'Desarrollada (esta entrega)'],
        ['Fase 2', 'Backoffice: login y panel para administrar excursiones, precios, imágenes, textos y ver reservas', 'Opción 4 — presupuestada'],
        ['Fase 3', 'Pasarela de pagos online (MercadoPago) con confirmación automática de la reserva', 'Opción 3 — presupuestada'],
        ['Fase 4', 'Sistema completo: sitio + backoffice + pagos + gestión de reservas y disponibilidad', 'Opción 5 — presupuestada'],
      ],
      [40, '*', 120],
    ),

    // ------------------------------------------------------ 6. CRONOGRAMA
    h1('6. Cronograma estimado'),
    table(
      ['Etapa', 'Duración estimada'],
      [
        ['Relevamiento, diseño y setup (hecho)', '—'],
        ['Fase 1 — Sitio + reservas WhatsApp', '2 – 3 semanas desde aprobación de diseño y contenidos finales'],
        ['Fase 2 — Backoffice', '+2 – 3 semanas adicionales'],
        ['Fase 3 — Pagos online', '+1 – 2 semanas adicionales'],
      ],
      ['*', 250],
    ),
    p('Los tiempos son estimados y pueden ajustarse según disponibilidad de contenidos (fotos, textos, precios) y tiempos de revisión del cliente.', { fontSize: 8.5, italics: true }),

    // ------------------------------------------------------ 7. INVERSIÓN
    h1('7. Opciones de inversión'),
    table(
      ['Opción', 'Incluye', 'Inversión (ARS)'],
      [
        ['Opción 2', 'Web informativa a medida: catálogo, fichas y reservas por WhatsApp', '$ 300.000'],
        [
          { text: 'Opción 4', bold: true, fillColor: '#FFEFC2' },
          { text: 'Fase 1 + backoffice privado para administrar excursiones, precios, imágenes y textos sin tocar código', bold: true, fillColor: '#FFEFC2' },
          { text: '$ 400.000', bold: true, fillColor: '#FFEFC2' },
        ],
        [
          { text: 'Opción 3', bold: true, fillColor: '#FFEFC2' },
          { text: 'Fase 1 + pasarela de pagos online para cobrar reservas desde el sitio', bold: true, fillColor: '#FFEFC2' },
          { text: '$ 600.000', bold: true, fillColor: '#FFEFC2' },
        ],
        ['Opción 5', 'Todo: sitio + backoffice + pagos online', '$ 900.000'],
      ],
      [70, '*', 90],
    ),
    p('Filas resaltadas = opciones de interés del cliente. Ambas comparten la misma Fase 1 ya desarrollada, por lo que luego pueden ampliarse a la Opción 5 abonando la diferencia.', { fontSize: 8.5 }),

    // ------------------------------------------------------ 8. CONDICIONES
    h1('8. Condiciones comerciales'),
    { ul: [
      'Forma de pago: 50% al inicio del proyecto y 50% contra entrega funcional.',
      'Validez de la propuesta: 15 días corridos desde su emisión.',
      'Contenidos (fotos, textos, precios, logos) provistos por el cliente; el catálogo actual ya fue migrado.',
      'Hosting, dominio y costos de Supabase/MercadoPago a cargo del cliente (se asesora en la configuración; planes gratuitos suficientes para el arranque).',
      'Incluye 30 días de soporte por errores funcionales posteriores a la entrega.',
      'Cambios de alcance fuera de lo descripto se presupuestan por separado.',
    ].map(li) },

    // ------------------------------------------------------ CIERRE
    {
      margin: [0, 24, 0, 0],
      table: {
        widths: ['*'],
        body: [[
          {
            stack: [
              { text: 'Cuando dudes del camino, seguí al Norte.', fontSize: 12, bold: true, color: CREAM, margin: [0, 0, 0, 6] },
              { text: 'Norte Aventura — +54 9 387 403 9502 — puraaventuratrekking@gmail.com', fontSize: 8.5, color: '#BFD8CC' },
            ],
            fillColor: GREEN,
            margin: [16, 14, 16, 14],
          },
        ]],
      },
      layout: 'noBorders',
    },
  ],
};

const out = path.join(dir, 'propuesta-norte-aventura.pdf');
const pdf = pdfmake.createPdf(doc);
await pdf.write(out);
console.log('PDF generado →', out);
