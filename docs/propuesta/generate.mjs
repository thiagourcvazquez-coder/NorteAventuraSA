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
    h1('1. Objetivo'),
    p(
      'Norte Aventura hoy opera su sitio sobre WordPress + WooCommerce, lo que limita la velocidad, ' +
        'la identidad visual y la evolución del negocio. Esta propuesta plantea un sitio a medida, moderno ' +
        'y rápido, fiel a la marca (verde, amarillo, Montserrat), con reservas simples por WhatsApp y una ' +
        'base técnica lista para crecer hacia backoffice y cobros online.',
    ),
    table(
      ['Situación actual', 'Propuesta'],
      [
        ['WordPress + plugins de terceros', 'Código a medida: rápido, seguro, sin dependencias frágiles'],
        ['Checkout complejo', 'Reserva en 2 pasos que deriva a WhatsApp con el mensaje listo'],
        ['Sin registro de consultas', 'Cada reserva queda guardada como lead en la base de datos'],
      ],
      ['*', '*'],
    ),

    // ------------------------------------------------------ 2. ALCANCE
    h1('2. Qué incluye el sitio (ya desarrollado)'),
    { ul: [
      'Home con hero, destacadas, pasos de reserva y CTA a WhatsApp — diseño responsive mobile-first.',
      'Catálogo de excursiones con filtros por origen (Desde Salta / Desde Jujuy) y buscador.',
      'Ficha por excursión: galería de fotos, ubicación con mapa, duración, dificultad, incluidos, FAQs y mapa de Google.',
      'Reserva con fecha, personas y contacto: registra el lead en la base y abre WhatsApp al +54 9 387 403 9502.',
      'Sitio bilingüe Español/Inglés. Contenido administrable en base de datos.',
    ].map(li) },
    p('Datos ya migrados: 15 excursiones con precios y detalles, 117 fotos en galerías, FAQs y contenidos del sitio.', { fontSize: 8.5, italics: true }),

    // ------------------------------------------------------ 3. STACK
    h1('3. Stack tecnológico'),
    table(
      ['Capa', 'Tecnología'],
      [
        ['Frontend', 'React 19 + Vite + TypeScript + Tailwind CSS'],
        ['Backend / API', 'Node.js + Express + TypeScript'],
        ['Base de datos', 'Supabase (PostgreSQL, con RLS y Auth)'],
        ['Reservas', 'Deep-link wa.me + registro del lead en DB'],
        ['Hosting', 'Vercel (front + API) + Supabase Cloud'],
      ],
      [110, '*'],
    ),

    // ------------------------------------------------------ 4. INVERSIÓN
    h1('4. Opciones de inversión'),
    table(
      ['Opción', 'Incluye', 'Inversión (ARS)'],
      [
        ['Opción 1', 'Sitio a medida + motor de reservas por WhatsApp (ya desarrollada)', '$ 300.000'],
        [
          { text: 'Opción 2', bold: true, fillColor: '#FFEFC2' },
          { text: 'Opción 1 + backoffice privado para administrar excursiones, precios, imágenes y reservas (+2–3 semanas)', bold: true, fillColor: '#FFEFC2' },
          { text: '$ 400.000', bold: true, fillColor: '#FFEFC2' },
        ],
        [
          { text: 'Opción 3', bold: true, fillColor: '#FFEFC2' },
          { text: 'Opción 1 + pagos online con MercadoPago (+1–2 semanas)', bold: true, fillColor: '#FFEFC2' },
          { text: '$ 600.000', bold: true, fillColor: '#FFEFC2' },
        ],
        ['Opción 4', 'Sistema completo: sitio + backoffice + pagos online', '$ 900.000'],
      ],
      [70, '*', 90],
    ),
    p('Cualquier opción puede ampliarse luego a la Opción 4 abonando la diferencia.', { fontSize: 8.5 }),

    // ------------------------------------------------------ 5. CONDICIONES
    h1('5. Condiciones'),
    { ul: [
      '50% al inicio del proyecto y 50% contra entrega funcional.',
      'Validez de la propuesta: 15 días corridos.',
      'Hosting, dominio y costos de Supabase/MercadoPago a cargo del cliente (planes gratuitos alcanzan para arrancar).',
      'Incluye 30 días de soporte por errores funcionales. Cambios de alcance se presupuestan aparte.',
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
