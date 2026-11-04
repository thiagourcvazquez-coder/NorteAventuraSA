// Genera docs/resumen/resumen-proyecto.pdf — resumen ejecutivo del trabajo realizado
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(dir, '../propuesta/generate.mjs'));
const pdfmake = req('pdfmake');
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

const GREEN = '#093628';
const GREEN_LIGHT = '#0d4a36';
const YELLOW = '#FFC83B';
const CREAM = '#FFFBF2';
const GRAY = '#6C6D72';

const h1 = (text) => ({ text, fontSize: 15, bold: true, color: GREEN, margin: [0, 14, 0, 6] });
const h2 = (text) => ({ text, fontSize: 10.5, bold: true, color: GREEN_LIGHT, margin: [0, 8, 0, 3] });
const p = (text, opts = {}) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.45, margin: [0, 0, 0, 6], ...opts });
const li = (text) => ({ text, fontSize: 9.5, color: GRAY, lineHeight: 1.4, margin: [0, 1.5, 0, 1.5] });
const bullet = (items) => ({ ul: items.map(li) });

const doc = {
  pageSize: 'A4',
  pageMargins: [48, 56, 48, 56],
  defaultStyle: { font: 'Montserrat' },
  info: { title: 'Resumen del proyecto — Norte Aventura', author: 'Desarrollo Web' },

  background: (page) =>
    page === 1
      ? { canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 841.89, color: GREEN },
          { type: 'rect', x: 0, y: 620, w: 595.28, h: 10, color: YELLOW },
        ] }
      : { canvas: [
          { type: 'rect', x: 0, y: 0, w: 595.28, h: 5, color: YELLOW },
          { type: 'rect', x: 0, y: 5, w: 595.28, h: 3, color: GREEN },
        ] },

  footer: (page, total) =>
    page === 1 ? null : {
      columns: [
        { text: 'Norte Aventura — Resumen del proyecto', fontSize: 7.5, color: GRAY, margin: [48, 18, 0, 0] },
        { text: `Página ${page} de ${total}`, fontSize: 7.5, color: GRAY, alignment: 'right', margin: [0, 18, 48, 0] },
      ],
    },

  content: [
    // ------------------------------------------------------ PORTADA
    {
      stack: [
        { image: path.join(dir, '../propuesta/assets/logo.png'), width: 110, alignment: 'center', margin: [0, 140, 0, 24] },
        { text: 'NORTE AVENTURA', fontSize: 13, bold: true, color: YELLOW, alignment: 'center', characterSpacing: 4 },
        { text: 'Salta · Tilcara · Jujuy', fontSize: 9, color: '#BFD8CC', alignment: 'center', margin: [0, 6, 0, 60] },
        { text: 'Resumen del proyecto', fontSize: 30, bold: true, color: '#FFFFFF', alignment: 'center' },
        { text: 'Trabajo realizado a Noviembre 2026', fontSize: 13, color: YELLOW, alignment: 'center', margin: [0, 10, 0, 90] },
        { text: 'Sitio web en producción · Propuesta comercial · Preview de cambios · Kit de Instagram', fontSize: 9.5, color: '#BFD8CC', alignment: 'center' },
      ],
      pageBreak: 'after',
    },

    // ------------------------------------------------------ 1. SITIO WEB
    h1('1. Sitio web — en producción'),
    p('Sitio a medida desarrollado completo y en línea, con reservas por WhatsApp y base de datos propia.'),
    h2('URL'),
    p('https://norte-aventura-salta.vercel.app — código versionado en GitHub (repositorio privado del proyecto).', { fontSize: 9, bold: true, color: GREEN }),
    h2('Funcionalidades implementadas'),
    bullet([
      'Diseño premium a medida (estilo award): hero 3D con Three.js, animaciones, smooth scrolling, galerías en movimiento continuo.',
      'Catálogo de 15 excursiones reales con filtros por origen (Desde Salta / Desde Jujuy) y buscador.',
      'Ficha por excursión: galería marquee, datos, descripción, incluidos, FAQs, mapa de Google Maps embebido y excursiones relacionadas.',
      'Motor de reservas: formulario que guarda el lead en la base de datos y abre WhatsApp con el mensaje pre-armado.',
      'Sitio bilingüe Español / Inglés con selector en el header (detecta idioma del navegador, persiste la elección).',
      'Páginas: Inicio, Excursiones, Nosotros, Contacto + diseño 100% responsive.',
    ]),
    h2('Stack'),
    p('React 19 + Vite + TypeScript + Tailwind (frontend) · Node.js + Express (API de reservas) · Supabase/PostgreSQL (datos) · Vercel (hosting).'),

    // ------------------------------------------------------ 2. BASE DE DATOS
    h1('2. Base de datos — Supabase'),
    bullet([
      '15 excursiones migradas con precios, horarios, dificultad, descripciones e incluidos.',
      '117 fotos migradas en galerías por excursión.',
      'Tablas: categories, excursions, excursion_images, excursion_faqs, reservations, site_content.',
      'Seguridad RLS: catálogo de lectura pública; reservas solo escritas por la API.',
      'Script setup.sql para reset completo + seeds incrementales + migración de mapas.',
    ]),

    // ------------------------------------------------------ 3. DOCUMENTOS
    h1('3. Documentos generados'),
    bullet([
      'propuesta-norte-aventura.pdf — propuesta técnica y comercial (3 páginas): objetivo, alcance, stack, opciones de inversión ($300k–$900k) y condiciones.',
      'preview-cambios.pdf — mockups visuales de los cambios solicitados por el cliente (7 páginas): nueva paleta, hero, menú, destinos en cards, precios base doble, catálogo ampliado y footer corregido.',
      'resumen-proyecto.pdf — este documento.',
    ]),

    // ------------------------------------------------------ 4. INSTAGRAM
    h1('4. Kit de Instagram'),
    bullet([
      '14 plantillas PNG listas para usar: ficha de excursión, promo, salidas de la semana, testimonio, dato del norte, story y 8 portadas unificadas de destacadas.',
      'Sistema de feed definido: alternancia foto/gráfico, reglas de uso y fórmula de captions.',
      'Generador parametrizable para crear nuevas piezas con otros textos/fotos.',
    ]),

    // ------------------------------------------------------ 5. PENDIENTES
    h1('5. Pendientes / próximos pasos'),
    bullet([
      'Cliente envía: logo nuevo (archivo) y fotos definitivas.',
      'Implementar cambios del preview: nueva paleta, menú reordenado, bloque destinos 3-cards, footer/redes corregidas.',
      'Ampliar catálogo con las excursiones nuevas del listado (fichas en la misma base).',
      'Correr migration-maps.sql en Supabase (columna maps_query — el sitio ya funciona con fallback).',
      'Fases futuras presupuestadas: backoffice (opción 2), pagos MercadoPago (opción 3) o sistema completo (opción 4).',
    ]),
  ],
};

const out = path.join(dir, 'resumen-proyecto.pdf');
await pdfmake.createPdf(doc).write(out);
console.log('PDF generado →', out);
