// Genera docs/cambios/preview-cambios.pdf — preview visual de los cambios pedidos
// Uso: node render-mocks.mjs && node generate.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(dir, '../propuesta/generate.mjs'));
const pdfmake = req('pdfmake');

const A = (n) => path.join(dir, 'assets', n);
const F = (n) => path.join(dir, '../propuesta/assets/fonts', n);

pdfmake.setLocalAccessPolicy(() => true);
pdfmake.setFonts({
  Montserrat: {
    normal: F('Montserrat-Regular.ttf'),
    bold: F('Montserrat-Bold.ttf'),
    italics: F('Montserrat-Regular.ttf'),
    bolditalics: F('Montserrat-Bold.ttf'),
  },
});

// Nueva paleta del cliente
const LIME = '#bfdb26';
const ORANGE = '#fb950e';
const OLIVE = '#728316';
const BLACK = '#0b0d05';
const GRAY = '#5c5f52';
const PAPER = '#f7f8ee';

const h1 = (text) => ({ text, fontSize: 15, bold: true, color: BLACK, margin: [0, 14, 0, 6] });
const h2 = (text) => ({ text, fontSize: 10.5, bold: true, color: OLIVE, margin: [0, 8, 0, 3] });
const p = (text, opts = {}) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.45, margin: [0, 0, 0, 6], ...opts });
const li = (text) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.4, margin: [0, 1.5, 0, 1.5] });
const tag = (text, color = OLIVE) => ({
  text, fontSize: 8, bold: true, color: '#ffffff', characterSpacing: 1.5,
  fillColor: color, margin: [0, 10, 0, 4],
});

const img = (name, width) => ({ image: A(name), width, margin: [0, 4, 0, 8] });
const caption = (text, color = GRAY) => ({ text, fontSize: 8, color, italics: true, margin: [0, 0, 0, 8] });
const bullet = (items) => ({ ul: items.map(li) });

const doc = {
  pageSize: 'A4',
  pageMargins: [44, 52, 44, 52],
  defaultStyle: { font: 'Montserrat' },
  info: {
    title: 'Preview de cambios — Norte Aventura',
    author: 'Desarrollo Web',
    subject: 'Mockups de los cambios solicitados sobre el sitio actual',
  },

  background: (page) =>
    page === 1
      ? { canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: BLACK },
          { type: 'rect', x: 0, y: 620, w: 595.28, h: 10, color: LIME },
          { type: 'rect', x: 0, y: 630, w: 595.28, h: 4, color: ORANGE },
        ] }
      : { canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 5, color: LIME },
          { type: 'rect', x: 0, y: 5, w: 595.28, h: 3, color: BLACK },
        ] },

  footer: (page, total) =>
    page === 1
      ? null
      : {
          columns: [
            { text: 'Norte Aventura — Preview de cambios', fontSize: 7.5, color: GRAY, margin: [44, 18, 0, 0] },
            { text: `Página ${page} de ${total}`, fontSize: 7.5, color: GRAY, alignment: 'right', margin: [0, 18, 44, 0] },
          ],
        },

  content: [
    // ------------------------------------------------------ PORTADA
    {
      stack: [
        { text: 'NORTE AVENTURA', fontSize: 13, bold: true, color: LIME, alignment: 'center', characterSpacing: 4, margin: [0, 170, 0, 10] },
        { text: 'Salta · Tilcara · Jujuy', fontSize: 9, color: '#a8b06a', alignment: 'center', margin: [0, 6, 0, 60] },
        { text: 'Preview de cambios', fontSize: 30, bold: true, color: '#FFFFFF', alignment: 'center' },
        { text: 'Mockups visuales de los cambios solicitados', fontSize: 13, color: ORANGE, alignment: 'center', margin: [0, 10, 0, 80] },
        { text: 'Cada sección muestra el estado ACTUAL del sitio y la propuesta NUEVA,\nsin modificar todavía el sitio en producción.', fontSize: 9.5, color: '#a8b06a', alignment: 'center', lineHeight: 1.5 },
        { text: 'Noviembre 2026 — Documento de trabajo', fontSize: 8.5, color: '#6f7a45', alignment: 'center', margin: [0, 50, 0, 0] },
      ],
      pageBreak: 'after',
    },

    // ------------------------------------------------------ 1. RESUMEN + PALETA
    h1('1. Resumen de cambios solicitados'),
    bullet([
      'Nueva paleta de colores tomada del flyer de la marca.',
      'Hero: foto de portada que se entienda + título y subtítulo de impacto.',
      'Menú reordenado con nuevo ítem: TREKKING Y EXPERIENCIAS.',
      'Catálogo ampliado con nuevas excursiones por origen.',
      'Bloque "Nuestros Destinos" convertido en 3 tarjetas con botón.',
      'Footer: logo, email y redes corregidos (+ TikTok).',
      'Precios "base doble" claros y dificultades corregidas.',
      'Textos nuevos de Nosotros y Contacto.',
    ]),
    h2('Nueva paleta (del flyer)'),
    {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [[
          { stack: [
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 118, h: 42, color: LIME }] },
            { text: '#bfdb26 — Verde lima\nColor principal / acentos', fontSize: 8, color: GRAY, margin: [0, 6, 0, 0] },
          ]},
          { stack: [
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 118, h: 42, color: ORANGE }] },
            { text: '#fb950e — Naranja\nCTAs, diferenciales', fontSize: 8, color: GRAY, margin: [0, 6, 0, 0] },
          ]},
          { stack: [
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 118, h: 42, color: OLIVE }] },
            { text: '#728316 — Verde oliva\nEyebrows, secundarios', fontSize: 8, color: GRAY, margin: [0, 6, 0, 0] },
          ]},
          { stack: [
            { canvas: [{ type: 'rect', x: 0, y: 0, w: 118, h: 42, color: BLACK }] },
            { text: '#000000 — Negro\nFondos oscuros, texto', fontSize: 8, color: GRAY, margin: [0, 6, 0, 0] },
          ]},
        ]],
      },
      layout: 'noBorders',
      margin: [0, 4, 0, 8],
    },
    p('La paleta actual del sitio (verde oscuro + amarillo) se reemplaza por la del flyer: lima como color de marca, naranja para los llamados a la acción, oliva para detalles y negro para fondos y texto.'),
    h2('Menú: orden y nombres correctos'),
    {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [{ text: 'Actual', bold: true, fontSize: 9, color: '#fff', fillColor: OLIVE, margin: [6, 5, 6, 5] },
           { text: 'Nuevo orden', bold: true, fontSize: 9, color: '#fff', fillColor: BLACK, margin: [6, 5, 6, 5] }],
          [{ text: 'Inicio · Excursiones · Desde Salta · Desde Jujuy · Nosotros · Contacto', fontSize: 9, color: GRAY, margin: [6, 5, 6, 5] },
           { text: 'Inicio · Desde Salta · Desde Jujuy · Trekking y Experiencias · Nosotros · Contacto', fontSize: 9, bold: true, color: BLACK, margin: [6, 5, 6, 5] }],
        ],
      },
      layout: { hLineColor: '#e3e8c9', vLineColor: '#e3e8c9' },
      margin: [0, 4, 0, 10],
    },

    // ------------------------------------------------------ 2. HERO
    h1('2. Portada (hero)'),
    p('El cliente pide que al entrar se entienda de inmediato qué hace la empresa: foto de portada legible + frase de impacto.'),
    tag('ANTES — sitio actual'),
    img('actual-hero.png', 505),
    tag('DESPUÉS — propuesta con nueva paleta', BLACK),
    img('mock-hero.png', 505),
    bullet([
      'Título: "Viví el Norte Argentino como nunca antes".',
      'Subtítulo: "Excursiones, trekking y experiencias auténticas desde Salta y Jujuy."',
      'Menú con el nuevo orden y botón Reservar en naranja.',
      'La foto definitiva la define el cliente (envía material nuevo).',
    ]),
    '',

    // ------------------------------------------------------ 3. DESTINOS
    h1('3. "Nuestros Destinos" → tarjetas con botón', ),
    p('El bloque actual de destinos se recicla en 3 tarjetas que redireccionan. La tarjeta central destaca el diferencial de la marca: el trekking.'),
    tag('ANTES — sitio actual'),
    img('actual-destinos.png', 505),
    tag('DESPUÉS — propuesta', BLACK),
    img('mock-destinos.png', 505),
    {
      table: {
        headerRows: 1,
        widths: [70, '*'],
        body: [
          [{ text: 'Card', bold: true, fontSize: 9, color: '#fff', fillColor: BLACK, margin: [6, 5, 6, 5] },
           { text: 'Destino del botón', bold: true, fontSize: 9, color: '#fff', fillColor: BLACK, margin: [6, 5, 6, 5] }],
          ['1 — Excursiones clásicas', { text: '→ Catálogo de excursiones diarias', fontSize: 9, color: GRAY, margin: [6, 5, 6, 5] }],
          [{ text: '2 — Trekking & Turismo Activo', bold: true, fontSize: 9, color: BLACK, margin: [6, 5, 6, 5] }, { text: '→ Sección "Trekking y Experiencias" (diferencial)', fontSize: 9, color: GRAY, margin: [6, 5, 6, 5] }],
          ['3 — Salidas privadas', { text: '→ Contacto / formulario de propuesta a medida', fontSize: 9, color: GRAY, margin: [6, 5, 6, 5] }],
        ],
      },
      layout: { hLineColor: '#e3e8c9', vLineColor: '#e3e8c9' },
      margin: [0, 4, 0, 10],
    },

    // ------------------------------------------------------ 4. PRECIOS
    h1('4. Precios "base doble" y dificultades'),
    p('Hoy una excursión de $70.000 para 2 personas puede leerse como precio por persona. La card lo aclara a simple vista, y la dificultad se corrige por excursión (no todas son "Baja").'),
    { columns: [
      { width: '48%', stack: [tag('ANTES'), img('actual-card-doble.png', 235)] },
      { width: '4%', text: '' },
      { width: '48%', stack: [tag('DESPUÉS', BLACK), img('mock-card-doble.png', 235)] },
    ]},
    bullet([
      'Precio visible + etiqueta "por 2 personas (base doble)" — sin confusión.',
      'Dificultad como badge visible (Baja / Media / Alta según corresponda a cada excursión).',
      'Las dificultades incorrectas se corrigen en la base de datos.',
    ]),

    // ------------------------------------------------------ 5. CATÁLOGO
    h1('5. Catálogo ampliado'),
    p('El cliente define el orden y las excursiones por origen. En negrita, las que ya existen en el sitio; el resto se agrega como fichas nuevas (con "(consultar)" cuando corresponda).'),
    h2('Botón "Inicio" — Excursiones diarias desde Salta'),
    p('Cafayate · Cachi · Salinas Grandes · Humahuaca + Hornocal · Cascada Escondida · City Tour · Cerro Elefante · Tren a las Nubes · Tren Solar (Jujuy)', { fontSize: 8.8 }),
    h2('Botón "Inicio" — Excursiones diarias desde Jujuy'),
    p('Salinas Grandes desde Tilcara · Humahuaca Combo Triple · Iruya (consultar) · Castillos de Huichaira · Traslado Aeropuerto Jujuy/Tilcara · Garganta del Diablo · City Tour + Pucará · Inca Cueva (consultar)', { fontSize: 8.8 }),
    h2('"Desde Salta" — listado completo'),
    p('Cafayate · Cachi · Salinas Grandes · Humahuaca + Hornocal · Cascada Escondida · City Tour · Cerro Elefante · Tren a las Nubes · Tren Solar · Termas de Jordán · Yungas Jujeñas · Cuevas de Acisibi · Puente del Diablo–La Poma · Iruya Trekking (2 días) · Trekking en Cafayate', { fontSize: 8.8 }),
    h2('"Desde Jujuy" — listado completo'),
    p('Salinas Grandes desde Tilcara · Humahuaca Combo Triple · Iruya · Castillos de Huichaira · Traslado Aeropuerto · Garganta del Diablo · City Tour + Pucará · Salinas Grandes Nocturna · Termas de Reyes + Lagunas de Yala · Cuevas del Wayra · Inca Cueva · Termas de Jordán · Yungas Jujeñas · Laguna de Pozuelo · Cascadas · Turismo Rural', { fontSize: 8.8 }),
    p('Las fichas nuevas se crean con la misma plantilla actual (foto, galería, datos, mapa y reserva por WhatsApp) y se cargan en la misma base de datos.', { fontSize: 8.5, italics: true }),

    // ------------------------------------------------------ 6. FOOTER + TEXTOS
    h1('6. Footer, Nosotros y Contacto'),
    tag('ANTES — footer actual'),
    img('actual-footer.png', 505),
    tag('DESPUÉS — propuesta', BLACK),
    img('mock-footer.png', 505),
    h2('Correcciones de datos'),
    bullet([
      'Email: norteaventuraok@gmail.com (reemplaza al actual).',
      'Redes: facebook.com/norteaventura.ok · instagram.com/norteaventura.ok · tiktok.com/@norteaventura.ok — íconos con los colores reales de cada red + TikTok.',
      'Copyright: "Norte Aventura © 2026" (corrige "PuraAventura 2025").',
      'Frase institucional nueva: "Somos una agencia especializada en trekking y experiencias activas en el Norte Argentino, con base en Salta y Tilcara…".',
    ]),
    h2('Nosotros — texto nuevo'),
    p('"Especialistas en trekking en Salta y Tilcara. En NorteAventura somos una agencia especializada en trekking y experiencias activas…" (texto completo provisto por el cliente).', { fontSize: 8.8 }),
    h2('Contacto — frase nueva'),
    p('"¿Tenés dudas sobre una excursión o un trekking? ¿Buscás una salida privada a tu medida? Contanos qué te gustaría conocer y te asesoramos…"', { fontSize: 8.8 }),

    // ------------------------------------------------------ CIERRE
    {
      margin: [0, 20, 0, 0],
      table: {
        widths: ['*'],
        body: [[
          {
            stack: [
              { text: 'Pendiente del cliente: archivo del logo nuevo y fotos definitivas.', fontSize: 10, bold: true, color: '#ffffff', margin: [0, 0, 0, 5] },
              { text: 'Estos mockups son orientativos: la implementación final respeta la misma estructura y calidad del sitio actual.', fontSize: 8.5, color: '#c9d487' },
            ],
            fillColor: BLACK,
            margin: [16, 14, 16, 14],
          },
        ]],
      },
      layout: 'noBorders',
    },
  ],
};

const out = path.join(dir, 'preview-cambios.pdf');
await pdfmake.createPdf(doc).write(out);
console.log('PDF generado →', out);
