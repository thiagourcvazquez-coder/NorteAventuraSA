// Plantillas NUEVAS de Instagram — Norte Aventura → docs/instagram/out/*.png
// Renderiza con Chrome del sistema en modo headless (sin playwright).
// Uso: node render-nuevas.mjs           (todas)
//      node render-nuevas.mjs itinerario  (una sola)
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dir = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(dir, '../propuesta/assets/fonts').replace(/\\/g, '/');
const TMP = path.join(dir, '.tmp');
const OUT = path.join(dir, 'out');

const GREEN = '#093628';
const GREEN_L = '#0d4a36';
const GREEN_D = '#052a1e';
const YELLOW = '#FFC83B';
const YELLOW_D = '#c9971f';
const CREAM = '#FFFBF2';
const WA = '+54 9 387 403 9502';
const IG = '@norteaventura';

// ---- marca: sol de rayos
const sun = (size, color = YELLOW, style = '') => `
<svg viewBox="0 0 48 48" width="${size}" height="${size}" style="${style}">
  <circle cx="24" cy="24" r="9" fill="${color}"/>
  ${Array.from({ length: 12 }, (_, i) =>
    `<rect x="22.7" y="2" width="2.6" height="8" rx="1.3" fill="${color}" transform="rotate(${i * 30} 24 24)"/>`,
  ).join('')}
</svg>`;

// ---- textura: líneas topográficas (motivo "aventura", sin salirse de la paleta)
const contour = (color = CREAM, opacity = 0.07) => `
<svg viewBox="0 0 600 600" style="position:absolute;inset:0;width:100%;height:100%" preserveAspectRatio="xMidYMid slice">
  ${[120, 180, 245, 315, 390, 470, 555, 645].map((r, i) => `
  <circle cx="${300 + (i % 3) * 30}" cy="${300 - (i % 2) * 25}" r="${r}" fill="none"
    stroke="${color}" stroke-opacity="${opacity}" stroke-width="14"/>`).join('')}
</svg>`;

const logo = (size = 60, color = CREAM) => `
<div style="display:flex;align-items:center;gap:14px">
  ${sun(size)}
  <p style="font-size:${size * 0.38}px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;line-height:1.15;color:${color}">Norte<br>Aventura</p>
</div>`;

const cta = (txt = 'Reservá por WhatsApp →', fs = 27) => `
<div style="display:inline-flex;align-items:center;gap:12px;background:${YELLOW};color:${GREEN};
  border-radius:999px;padding:20px 42px;font-size:${fs}px;font-weight:800">${txt}</div>`;

const chip = (txt, fs = 24) => `
<span style="display:inline-flex;align-items:center;background:${YELLOW};color:${GREEN};
  border-radius:999px;padding:14px 28px;font-size:${fs}px;font-weight:700;
  letter-spacing:.22em;text-transform:uppercase">${txt}</span>`;

const check = () => `
<svg viewBox="0 0 24 24" width="30" height="30">
  <circle cx="12" cy="12" r="11" fill="${YELLOW}"/>
  <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="${GREEN}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const css = `
  @font-face { font-family:'Montserrat'; src:url('file://${FONTS}/Montserrat-Regular.ttf'); font-weight:400; }
  @font-face { font-family:'Montserrat'; src:url('file://${FONTS}/Montserrat-Medium.ttf'); font-weight:500; }
  @font-face { font-family:'Montserrat'; src:url('file://${FONTS}/Montserrat-SemiBold.ttf'); font-weight:600; }
  @font-face { font-family:'Montserrat'; src:url('file://${FONTS}/Montserrat-Bold.ttf'); font-weight:700; }
  @font-face { font-family:'Montserrat'; src:url('file://${FONTS}/Montserrat-ExtraBold.ttf'); font-weight:800; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Montserrat',sans-serif; -webkit-font-smoothing:antialiased; }
  .display { text-transform:uppercase; font-weight:800; line-height:.95; letter-spacing:-.01em; }
  .eyebrow { font-size:25px; font-weight:700; letter-spacing:.26em; text-transform:uppercase; }
`;

const page = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body { width:${w}px; height:${h}px; overflow:hidden; position:relative; }
</style></head><body>${body}</body></html>`;

const footer = (bg, fg, txt = `Reservá tu lugar → ${WA}`) => `
<div style="position:absolute;left:0;right:0;bottom:0;background:${bg};padding:32px 64px;
  display:flex;align-items:center;justify-content:space-between">
  <p style="font-size:27px;font-weight:800;color:${fg};text-transform:uppercase">${txt.split('→')[0]}→</p>
  <p style="font-size:27px;font-weight:800;color:${fg}">${WA}</p>
</div>`;

const IMGS = {
  hornocal: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg',
  salinas: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg',
  cachi: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg',
  cafayate: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg',
  llamas: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg',
  iruya: 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0080.jpg',
  termas: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg',
  tren: 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2.jpg',
};

const M = 64; // margen

// ============================================================ plantillas
const T = {

  // 1) Itinerario del día — 1080x1350
  itinerario: page(1080, 1350, `
    <img src="${IMGS.hornocal}" style="position:absolute;inset:0;width:100%;height:470px;object-fit:cover">
    <div style="position:absolute;inset:0;height:470px;background:linear-gradient(180deg,rgba(9,54,40,.5),rgba(9,54,40,.15) 45%,rgba(9,54,40,.85))"></div>
    <div style="position:absolute;top:${M}px;left:${M}px">${logo()}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:238px;color:${CREAM}">
      ${chip('1 día · desde Salta', 21)}
      <h1 class="display" style="font-size:82px;margin-top:22px">Humahuaca<br>+ Hornocal</h1>
    </div>
    <div style="position:absolute;left:0;right:0;top:470px;bottom:96px;background:${CREAM};padding:44px ${M}px 0">
      <p class="eyebrow" style="color:${YELLOW_D}">Así es el día</p>
      ${[
        ['Salida desde Salta', 'Retiramos por tu alojamiento'],
        ['Paleta del Pintor · Maimará', 'Parada fotográfica'],
        ['Purmamarca', 'Cerro de los 7 Colores'],
        ['Tilcara', 'Almuerzo libre · Pucará'],
        ['Humahuaca', 'Casco histórico y artesanías'],
        ['Hornocal · 4.350 msnm', 'Mirador del Cerro de los 14 Colores'],
      ].map(([t, d], i, a) => `
        <div style="display:flex;gap:26px;margin-top:${i === 0 ? 34 : 0}px">
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:16px;height:16px;border-radius:50%;background:${i === a.length - 1 ? YELLOW : GREEN};border:3px solid ${i === a.length - 1 ? YELLOW : GREEN};margin-top:8px"></div>
            ${i < a.length - 1 ? `<div style="width:3px;flex:1;background:${GREEN};opacity:.18;margin:6px 0"></div>` : ''}
          </div>
          <div style="padding-bottom:${i < a.length - 1 ? 30 : 0}px">
            <p style="font-size:30px;font-weight:800;color:${GREEN};line-height:1.15">${t}</p>
            <p style="font-size:22px;font-weight:600;color:${GREEN};opacity:.55;margin-top:5px">${d}</p>
          </div>
        </div>`).join('')}
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${GREEN};padding:26px ${M}px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:26px;font-weight:800;color:${CREAM}">$ 80.000 <span style="font-weight:600;font-size:20px;opacity:.7">por persona</span></p>
      <p style="font-size:25px;font-weight:800;color:${YELLOW}">Reservá → ${WA}</p>
    </div>`),

  // 2) Combo 2 excursiones — 1080x1350
  combo: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;top:0;left:0;right:0;height:520px;display:flex">
      <div style="position:relative;flex:1;overflow:hidden">
        <img src="${IMGS.salinas}" style="width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.1),rgba(9,54,40,.55))"></div>
        <p style="position:absolute;left:36px;bottom:30px;font-size:30px;font-weight:800;color:${CREAM};text-transform:uppercase">Día 1 · Salinas</p>
      </div>
      <div style="width:10px;background:${CREAM}"></div>
      <div style="position:relative;flex:1;overflow:hidden">
        <img src="${IMGS.cafayate}" style="width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.1),rgba(9,54,40,.55))"></div>
        <p style="position:absolute;right:36px;bottom:30px;font-size:30px;font-weight:800;color:${CREAM};text-transform:uppercase">Día 2 · Cafayate</p>
      </div>
    </div>
    <div style="position:absolute;top:${M}px;left:0;right:0;display:flex;justify-content:center">${logo()}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:586px">
      <p class="eyebrow" style="color:${YELLOW_D}">Pack escapada · 2 días</p>
      <h1 class="display" style="font-size:110px;color:${GREEN};margin-top:24px">Salinas<br>+ Cafayate</h1>
      <p style="font-size:28px;font-weight:600;color:${GREEN};opacity:.6;margin-top:28px;line-height:1.45">
        Dos excursiones consecutivas con el mismo guía.<br>Reservás una vez y te olvidás.
      </p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:160px">
      <div style="background:${GREEN};border-radius:34px;padding:40px 46px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <p style="font-size:22px;font-weight:700;color:${CREAM};opacity:.6;text-transform:uppercase;letter-spacing:.16em;text-decoration:line-through">$106.000 por separado</p>
          <p style="font-size:88px;font-weight:800;color:${YELLOW};line-height:1;margin-top:10px">$ 92.000</p>
        </div>
        <p style="font-size:26px;font-weight:700;color:${CREAM};text-align:right;line-height:1.5">combo por persona<br><span style="opacity:.6;font-weight:600">ahorrás $14.000</span></p>
      </div>
    </div>
    ${footer(YELLOW, GREEN, 'Armá tu pack →')}`),

  // 3) Qué incluye — 1080x1350
  incluye: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    ${contour()}
    <div style="position:absolute;top:${M}px;left:${M}px">${logo()}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:230px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW}">Todo resuelto</p>
      <h1 class="display" style="font-size:96px;margin-top:22px">Qué incluye<br>la excursión</h1>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:560px">
      ${[
        'Traslado ida y vuelta',
        'Guía profesional (consultar bilingüe)',
        'Seguro y coordinación permanente',
        'Paradas en los mejores miradores',
        'Pickup por tu alojamiento',
        'Asistencia por WhatsApp',
      ].map((t) => `
        <div style="display:flex;align-items:center;gap:24px;background:${GREEN_L};border-radius:22px;
          padding:24px 28px;margin-bottom:18px">
          ${check()}
          <p style="font-size:29px;font-weight:700;color:${CREAM}">${t}</p>
        </div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:23px;font-weight:600;color:${CREAM};opacity:.6">No incluye: almuerzo ni gastos extra</p>
      ${cta('Reservá →', 25)}
    </div>`),

  // 4) Galería editorial — 1080x1350
  galeria: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${GREEN_D}"></div>
    <div style="position:absolute;inset:0;display:grid;
      grid-template-columns:1.6fr 1fr;grid-template-rows:1.5fr 1fr;gap:10px;padding:10px">
      <img src="${IMGS.hornocal}" style="grid-row:1/3;width:100%;height:100%;object-fit:cover;border-radius:26px 0 0 26px">
      <img src="${IMGS.salinas}" style="width:100%;height:100%;object-fit:cover;border-radius:0 26px 0 0">
      <img src="${IMGS.iruya}" style="width:100%;height:100%;object-fit:cover;border-radius:0 0 26px 0">
    </div>
    <div style="position:absolute;left:${M}px;bottom:150px;display:flex;align-items:center;gap:22px">
      ${sun(70)}
      <div>
        <p class="display" style="font-size:64px;color:${CREAM}">El norte<br>te espera</p>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${CREAM};padding:30px ${M}px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:26px;font-weight:800;color:${GREEN};text-transform:uppercase;letter-spacing:.14em">${IG}</p>
      <p style="font-size:26px;font-weight:800;color:${GREEN}">Salta y Tilcara · Argentina</p>
    </div>`),

  // 5) Tarifario de temporada — 1080x1350
  tarifario: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;left:0;right:0;top:0;background:${GREEN};padding:56px ${M}px 46px">
      <div style="display:flex;align-items:center;justify-content:space-between">
        ${logo(56)}
        ${chip('Temporada 2026', 20)}
      </div>
      <h1 class="display" style="font-size:92px;color:${CREAM};margin-top:44px">Tarifas</h1>
      <p style="font-size:27px;font-weight:600;color:${CREAM};opacity:.7;margin-top:16px">Por persona · con traslado, guía y seguro</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:470px">
      ${[
        ['Humahuaca + Hornocal', '1 día', '$80.000'],
        ['Salinas Grandes + Purmamarca', '1 día', '$58.000'],
        ['Cafayate + Quebrada de las Conchas', '1 día', '$48.000'],
        ['Cachi · Cuesta del Obispo', '1 día', '$48.000'],
        ['Iruya (2 días)', '2 días', '$120.000'],
        ['Termas de Reyes + city tour', '½ día', '$30.000'],
      ].map(([n, d, p], i) => `
        <div style="display:flex;align-items:baseline;gap:20px;padding:26px 0;
          ${i ? `border-top:2px solid rgba(9,54,40,.14)` : ''}">
          <div style="flex:1">
            <p style="font-size:32px;font-weight:800;color:${GREEN};line-height:1.15">${n}</p>
            <p style="font-size:21px;font-weight:600;color:${GREEN};opacity:.5;margin-top:5px">${d}</p>
          </div>
          <p style="font-size:40px;font-weight:800;color:${GREEN}">${p}</p>
        </div>`).join('')}
    </div>
    ${footer(YELLOW, GREEN, 'Reservá por WhatsApp →')}`),

  // 6) Últimos lugares — 1080x1080
  lugares: page(1080, 1080, `
    <img src="${IMGS.salinas}" style="position:absolute;inset:0;width:100%;height:560px;object-fit:cover">
    <div style="position:absolute;inset:0;height:560px;background:linear-gradient(180deg,rgba(9,54,40,.35),rgba(9,54,40,.75))"></div>
    <div style="position:absolute;top:${M}px;left:${M}px">${logo()}</div>
    <div style="position:absolute;left:${M}px;bottom:560px;transform:translateY(50%)">${chip('Sáb 15 · Salinas + Purmamarca', 21)}</div>
    <div style="position:absolute;left:0;right:0;top:560px;bottom:0;background:${GREEN};padding:52px ${M}px 0">
      <p class="eyebrow" style="color:${YELLOW}">Últimos lugares</p>
      <div style="display:flex;align-items:flex-end;gap:30px;margin-top:26px">
        <p class="display" style="font-size:150px;color:${CREAM};line-height:.9">Quedan</p>
        <p class="display" style="font-size:220px;color:${YELLOW};line-height:.85">4</p>
      </div>
      <div style="display:flex;gap:14px;margin-top:44px">
        ${Array.from({ length: 8 }, (_, i) => `
          <div style="width:44px;height:44px;border-radius:50%;background:${i < 4 ? YELLOW : 'transparent'};
            border:4px solid ${i < 4 ? YELLOW : CREAM};opacity:${i < 4 ? 1 : 0.35}"></div>`).join('')}
      </div>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:44px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:25px;font-weight:700;color:${CREAM}">Reservá antes del viernes →</p>
      ${cta(WA, 24)}
    </div>`),

  // 7) Pregunta frecuente — 1080x1080
  pregunta: page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;top:-40px;right:-30px;font-size:560px;font-weight:800;color:${GREEN};opacity:.06;line-height:1">?</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:120px">
      <p class="eyebrow" style="color:${YELLOW_D}">Pregunta frecuente</p>
      <h1 class="display" style="font-size:84px;color:${GREEN};margin-top:36px">¿A qué hora<br>salimos de<br>Salta?</h1>
      <div style="width:110px;height:6px;background:${YELLOW};margin:44px 0"></div>
      <p style="font-size:38px;font-weight:600;color:${GREEN};line-height:1.45;opacity:.85">
        Entre <b>6:50 y 7:30</b> retiramos por tu alojamiento. La vuelta es cerca de las
        <b>20:00</b>, con paradas en cada mirador del recorrido.
      </p>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${GREEN};padding:30px ${M}px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:14px">${sun(44)}
        <p style="font-size:22px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${CREAM}">Norte Aventura</p></div>
      <p style="font-size:23px;font-weight:700;color:${YELLOW}">Deslizá para más respuestas →</p>
    </div>`),

  // 8) Mapa de ruta — 1080x1080
  'mapa-ruta': page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    ${contour()}
    <div style="position:absolute;left:${M}px;right:${M}px;top:76px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW}">El camino del día</p>
      <h1 class="display" style="font-size:76px;margin-top:22px">Humahuaca<br>+ Hornocal</h1>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:430px">
      ${[
        ['Salta', 'largada · 6:50', true],
        ['Paleta del Pintor', 'Maimará · parada fotográfica'],
        ['Purmamarca', '165 km · 2 h'],
        ['Tilcara', '+ 20 min'],
        ['Humahuaca', '+ 45 min · almuerzo'],
        ['Hornocal', '+ 30 min · 4.350 msnm'],
      ].map(([n, d, start], i, a) => `
        <div style="display:flex;align-items:flex-start;gap:26px">
          <div style="display:flex;flex-direction:column;align-items:center;width:30px">
            <div style="width:${start ? 26 : 20}px;height:${start ? 26 : 20}px;border-radius:50%;
              background:${i === a.length - 1 ? YELLOW : (start ? CREAM : 'transparent')};
              border:4px solid ${i === a.length - 1 ? YELLOW : CREAM};margin-top:6px"></div>
            ${i < a.length - 1 ? `<div style="width:4px;height:44px;background-image:linear-gradient(${CREAM} 55%,transparent 55%);background-size:4px 14px;opacity:.4"></div>` : ''}
          </div>
          <div style="display:flex;align-items:baseline;gap:18px;padding-bottom:${i < a.length - 1 ? 18 : 0}px">
            <p style="font-size:34px;font-weight:800;color:${i === a.length - 1 ? YELLOW : CREAM}">${n}</p>
            <p style="font-size:21px;font-weight:600;color:${CREAM};opacity:.55">${d}</p>
          </div>
        </div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:48px;display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:14px">${sun(46)}
        <p style="font-size:21px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${CREAM}">Norte Aventura</p></div>
      <p style="font-size:24px;font-weight:800;color:${YELLOW}">${IG}</p>
    </div>`),

  // 9) Gift card — 1080x1080
  giftcard: page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;left:${M}px;top:100px;right:${M}px">
      <p class="eyebrow" style="color:${YELLOW_D}">¿Sin ideas para regalar?</p>
      <h1 class="display" style="font-size:86px;color:${GREEN};margin-top:26px">Regalá<br>aventura</h1>
      <p style="font-size:30px;font-weight:600;color:${GREEN};opacity:.65;margin-top:30px;line-height:1.4;max-width:540px">
        Vale para cualquier excursión · 12 meses de vigencia · se entrega por WhatsApp
      </p>
    </div>
    <div style="position:absolute;right:${M}px;top:120px;transform:rotate(6deg)">
      <div style="width:400px;height:252px;border-radius:28px;background:linear-gradient(135deg,${GREEN_L},${GREEN_D});
        box-shadow:0 24px 60px rgba(9,54,40,.25);padding:34px;display:flex;flex-direction:column;justify-content:space-between">
        <div style="display:flex;justify-content:space-between;align-items:center">
          ${sun(52)}
          <p style="font-size:19px;font-weight:800;letter-spacing:.2em;color:${CREAM};text-transform:uppercase">Gift<br>Card</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          ${sun(34)}
          <p style="font-size:21px;font-weight:800;letter-spacing:.22em;color:${CREAM};text-transform:uppercase;line-height:1.15">Norte<br>Aventura</p>
        </div>
        <p style="font-size:44px;font-weight:800;color:${YELLOW}">$ 50.000</p>
      </div>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:140px;display:flex;gap:16px">
      ${['$25.000', '$50.000', '$100.000'].map((v, i) => `
        <span style="border-radius:999px;padding:16px 30px;font-size:26px;font-weight:800;
          background:${i === 1 ? YELLOW : 'transparent'};color:${GREEN};border:3px solid ${i === 1 ? YELLOW : GREEN}">${v}</span>`).join('')}
    </div>
    ${footer(GREEN, CREAM, 'Pedí la tuya →')}`),

  // 10) Grupos / empresas — 1080x1350
  grupo: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    ${contour()}
    <img src="${IMGS.llamas}" style="position:absolute;left:0;right:0;bottom:96px;width:100%;height:430px;object-fit:cover;opacity:.9">
    <div style="position:absolute;left:0;right:0;bottom:96px;height:430px;background:linear-gradient(180deg,${GREEN} 0%,rgba(9,54,40,.25) 40%,rgba(9,54,40,.5))"></div>
    <div style="position:absolute;top:${M}px;left:${M}px">${logo()}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:240px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW}">Grupos · Empresas · XV años</p>
      <h1 class="display" style="font-size:118px;margin-top:28px">Viajen<br>juntos</h1>
      <div style="display:flex;gap:18px;margin-top:44px;flex-wrap:wrap">
        ${['Hasta 36 personas', 'Destino a medida', 'Coordinador dedicado'].map((t) => `
          <span style="border:3px solid ${CREAM};border-radius:999px;padding:18px 30px;font-size:25px;font-weight:700;color:${CREAM}">${t}</span>`).join('')}
      </div>
    </div>
    ${footer(YELLOW, GREEN, 'Cotizá tu grupo →')}`),

  // 11) Story encuesta A/B — 1080x1920
  'story-encuesta': page(1080, 1920, `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column">
      <div style="position:relative;flex:1;overflow:hidden">
        <img src="${IMGS.salinas}" style="width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.4),transparent 40%,rgba(9,54,40,.6))"></div>
        <div style="position:absolute;top:64px;left:64px">${logo()}</div>
        <p style="position:absolute;left:64px;bottom:56px;font-size:34px;font-weight:800;color:${CREAM};text-transform:uppercase;letter-spacing:.1em">
          <span style="background:${YELLOW};color:${GREEN};border-radius:50%;width:72px;height:72px;display:inline-flex;align-items:center;justify-content:center;margin-right:20px">A</span>Salinas Grandes
        </p>
      </div>
      <div style="background:${GREEN};padding:44px 64px;text-align:center">
        <p class="eyebrow" style="color:${YELLOW};font-size:30px">¿Cuál hacemos este sábado?</p>
        <p style="font-size:40px;font-weight:800;color:${CREAM};margin-top:18px;text-transform:uppercase">Votá en la encuesta ↓</p>
      </div>
      <div style="position:relative;flex:1;overflow:hidden">
        <img src="${IMGS.cafayate}" style="width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.55),transparent 40%)"></div>
        <p style="position:absolute;left:64px;top:56px;font-size:34px;font-weight:800;color:${CREAM};text-transform:uppercase;letter-spacing:.1em">
          <span style="background:${YELLOW};color:${GREEN};border-radius:50%;width:72px;height:72px;display:inline-flex;align-items:center;justify-content:center;margin-right:20px">B</span>Cafayate
        </p>
        <p style="position:absolute;right:64px;bottom:52px;font-size:26px;font-weight:700;color:${CREAM};opacity:.8">${IG}</p>
      </div>
    </div>`),

  // 12) Story countdown — 1080x1920
  'story-cuenta': page(1080, 1920, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    ${contour()}
    <div style="position:absolute;top:90px;left:0;right:0;display:flex;justify-content:center">${logo(70)}</div>
    <div style="position:absolute;top:340px;left:0;right:0;text-align:center">
      <p class="eyebrow" style="color:${YELLOW};font-size:32px">Salimos en</p>
      <p class="display" style="font-size:620px;color:${CREAM};line-height:1;margin-top:10px">3</p>
      <p class="display" style="font-size:86px;color:${YELLOW}">días</p>
    </div>
    <div style="position:absolute;left:70px;right:70px;bottom:290px;border-radius:30px;overflow:hidden;height:430px">
      <img src="${IMGS.hornocal}" style="width:100%;height:100%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(5,42,30,.9))"></div>
      <p class="display" style="position:absolute;left:44px;bottom:40px;font-size:54px;color:${CREAM}">Humahuaca + Hornocal · sáb 15</p>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:120px;display:flex;justify-content:center">${cta('Apurá tu lugar →', 32)}</div>
    <p style="position:absolute;left:0;right:0;bottom:56px;text-align:center;font-size:26px;font-weight:700;color:${CREAM};opacity:.7">${WA} · ${IG}</p>`),

  // 13) Story promo — 1080x1920
  'story-promo': page(1080, 1920, `
    <div style="position:absolute;inset:0;background:${GREEN_D}"></div>
    ${contour(CREAM, 0.06)}
    <div style="position:absolute;top:-120px;right:-120px;opacity:.1;transform:rotate(15deg)">${sun(620)}</div>
    <div style="position:absolute;top:80px;left:80px">${logo(70)}</div>
    <div style="position:absolute;left:80px;right:80px;top:420px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW};font-size:30px">Destino destacado</p>
      <h1 class="display" style="font-size:172px;margin-top:34px">Salinas<br>Grandes<br><span style="font-size:64px">desde Salta</span></h1>
      <p style="font-size:36px;font-weight:600;opacity:.75;margin-top:36px;line-height:1.45">
        El tercer salar más grande de Sudamérica.<br>Cuesta de Lipán · Purmamarca · Cerro 7 Colores
      </p>
    </div>
    <div style="position:absolute;left:80px;right:80px;top:1420px">
      <div style="background:${YELLOW};color:${GREEN};border-radius:36px;padding:46px 50px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <p style="font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;opacity:.7">Desde</p>
          <p style="font-size:104px;font-weight:800;line-height:1">$58.000</p>
        </div>
        <p style="text-align:right;font-size:29px;font-weight:700;line-height:1.5">por persona<br><span style="opacity:.65;font-weight:600">traslado + guía + seguro</span></p>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:150px;display:flex;justify-content:center">${cta('Reservá por WhatsApp →', 33)}</div>
    <p style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:27px;font-weight:700;color:${CREAM};opacity:.7">${WA} · ${IG}</p>`),

  // 14-15) Portadas de destacadas institucionales (faltan en el set actual)
  'cover-reservas': page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    ${contour()}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
      ${sun(190)}
      <p class="display" style="font-size:86px;color:${CREAM};text-align:center">Reservas</p>
      <p style="font-size:26px;font-weight:700;color:${YELLOW};letter-spacing:.1em">${WA}</p>
    </div>`),

  'cover-opiniones': page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px">
      ${sun(160, GREEN)}
      <p style="font-size:64px;color:${YELLOW_D};letter-spacing:.1em">★★★★★</p>
      <p class="display" style="font-size:84px;color:${GREEN};text-align:center">Opiniones</p>
    </div>`),
};

// ============================================================ render
const SIZES = {
  itinerario: [1080, 1350], combo: [1080, 1350], incluye: [1080, 1350],
  galeria: [1080, 1350], tarifario: [1080, 1350], grupo: [1080, 1350],
  'story-encuesta': [1080, 1920], 'story-cuenta': [1080, 1920], 'story-promo': [1080, 1920],
};

const only = process.argv[2];
const targets = Object.entries(T).filter(([k]) => !only || k === only);
if (!targets.length) {
  console.error('Template desconocido. Disponibles:', Object.keys(T).join(', '));
  process.exit(1);
}

await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

for (const [name, html] of targets) {
  const [w, h] = SIZES[name] ?? [1080, 1080];
  const htmlPath = path.join(TMP, `${name}.html`);
  await writeFile(htmlPath, html);
  await run(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${w},${h}`,
    '--virtual-time-budget=15000',
    `--screenshot=${path.join(OUT, `${name}.png`)}`,
    pathToFileURL(htmlPath).href,
  ], { maxBuffer: 16 * 1024 * 1024 });
  console.log('✓', name, `(${w}x${h})`);
}
