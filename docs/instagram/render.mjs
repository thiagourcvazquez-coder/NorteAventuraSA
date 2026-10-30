// Genera las plantillas de Instagram de Norte Aventura → docs/instagram/out/*.png
// Uso: node render.mjs            (todas)
//      node render.mjs excursion  (una sola)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pw = createRequire(import.meta.url)('C:/Users/Usuario/AppData/Local/Temp/na-verify/node_modules/playwright-core');
const CHROME = 'C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const dir = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(dir, '../propuesta/assets/fonts').replace(/\\/g, '/');

const GREEN = '#093628';
const GREEN_L = '#0d4a36';
const GREEN_D = '#052a1e';
const YELLOW = '#FFC83B';
const YELLOW_D = '#c9971f';
const CREAM = '#FFFBF2';

// ---- marca: sol de rayos del logo
const sun = (size, color = YELLOW, cls = '') => `
<svg viewBox="0 0 48 48" width="${size}" height="${size}" class="${cls}">
  <circle cx="24" cy="24" r="9" fill="${color}"/>
  ${Array.from({ length: 12 }, (_, i) =>
    `<rect x="22.7" y="2" width="2.6" height="8" rx="1.3" fill="${color}" transform="rotate(${i * 30} 24 24)"/>`,
  ).join('')}
</svg>`;

const css = `
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Regular.ttf'); font-weight: 400; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Medium.ttf'); font-weight: 500; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-SemiBold.ttf'); font-weight: 600; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Bold.ttf'); font-weight: 700; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-ExtraBold.ttf'); font-weight: 800; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
  .display { text-transform: uppercase; font-weight: 800; line-height: 0.95; letter-spacing: -0.01em; }
  .eyebrow { font-size: 26px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; }
  .pill { display: inline-flex; align-items: center; gap: 10px; border-radius: 999px; }
  .logo { display: flex; align-items: center; gap: 14px; }
  .logo-name { font-size: 24px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; line-height: 1.15; }
`;

const page = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body { width: ${w}px; height: ${h}px; overflow: hidden; position: relative; }
</style></head><body>${body}</body></html>`;

const wa = '+54 9 387 403 9502';

// ============================================================ templates
const T = {

  // 1) Excursión destacada — 1080x1350 (foto full-bleed + data abajo)
  excursion: page(1080, 1350, `
    <img src="https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.55) 0%,rgba(9,54,40,0) 32%,rgba(9,54,40,0) 48%,rgba(5,42,30,.92) 78%,${GREEN_D} 100%)"></div>
    <div style="position:absolute;top:56px;left:56px" class="logo">
      ${sun(64)}
      <div class="logo-name" style="color:${CREAM}">Norte<br>Aventura</div>
    </div>
    <div style="position:absolute;left:56px;right:56px;bottom:56px;color:${CREAM}">
      <span class="pill eyebrow" style="background:${YELLOW};color:${GREEN};padding:14px 26px">Desde Salta</span>
      <h1 class="display" style="font-size:96px;margin-top:26px">Humahuaca<br>+ Hornocal</h1>
      <div style="width:120px;height:6px;background:${YELLOW};margin:30px 0"></div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between">
        <div>
          <p style="font-size:24px;font-weight:600;opacity:.75;text-transform:uppercase;letter-spacing:.12em">1 día · Salidas diarias</p>
          <p style="font-size:58px;font-weight:800;color:${YELLOW};margin-top:8px">$ 80.000 <span style="font-size:26px;font-weight:600;color:${CREAM};opacity:.8">por persona</span></p>
        </div>
      </div>
      <div class="pill" style="margin-top:34px;background:${YELLOW};color:${GREEN};padding:22px 40px;font-size:27px;font-weight:800">
        Reservá por WhatsApp&nbsp;→
      </div>
    </div>`),

  // 2) Promo / precio — 1080x1350 (sin foto dominante, tipografía gigante)
  promo: page(1080, 1350, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    <div style="position:absolute;top:-140px;right:-140px;opacity:.12;transform:rotate(15deg)">${sun(560)}</div>
    <div style="position:absolute;top:56px;left:56px" class="logo">
      ${sun(64)}
      <div class="logo-name" style="color:${CREAM}">Norte<br>Aventura</div>
    </div>
    <div style="position:absolute;left:56px;right:56px;top:280px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW}">Oferta de temporada</p>
      <h1 class="display" style="font-size:150px;margin-top:24px">Salinas<br>Grandes</h1>
      <p style="font-size:30px;font-weight:600;opacity:.75;margin-top:26px;line-height:1.4">El tercer salar más grande de Sudamérica.<br>Cuesta de Lipán · Purmamarca · Cerro 7 Colores</p>
    </div>
    <div style="position:absolute;left:56px;right:56px;bottom:180px">
      <div style="background:${YELLOW};color:${GREEN};border-radius:32px;padding:40px 44px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <p style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;opacity:.7">Desde</p>
          <p style="font-size:92px;font-weight:800;line-height:1">$58.000</p>
        </div>
        <div style="text-align:right;font-size:26px;font-weight:700;line-height:1.5">
          por persona<br><span style="opacity:.65;font-weight:600">traslado + guía + seguro</span>
        </div>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${CREAM};padding:34px 56px;display:flex;align-items:center;justify-content:space-between">
      <p style="font-size:28px;font-weight:800;color:${GREEN};text-transform:uppercase">Reservá tu lugar →</p>
      <p style="font-size:28px;font-weight:800;color:${GREEN}">${wa}</p>
    </div>`),

  // 3) Testimonio — 1080x1080
  review: page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;top:-100px;right:-100px;opacity:.1;transform:rotate(12deg)">${sun(420, GREEN)}</div>
    <div style="position:absolute;left:64px;right:64px;top:110px">
      <p class="eyebrow" style="color:${YELLOW_D}">Lo que dicen</p>
      <p style="font-size:64px;color:${YELLOW_D};margin-top:34px">★★★★★</p>
      <p style="font-size:44px;font-weight:700;color:${GREEN};line-height:1.3;margin-top:30px">
        "La excursión a Hornocal fue increíble. Los guías unos genios, atentos a cada detalle. Volvería mil veces."
      </p>
      <p style="font-size:26px;font-weight:600;color:${GREEN};opacity:.6;margin-top:34px">— María G., Buenos Aires</p>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${GREEN};padding:30px 64px;display:flex;align-items:center;gap:16px">
      ${sun(44)}
      <p class="logo-name" style="color:${CREAM};font-size:22px">Norte Aventura · Salta y Jujuy</p>
    </div>`),

  // 4) Dato del norte — 1080x1080
  fact: page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${GREEN}"></div>
    <div style="position:absolute;bottom:-160px;left:-160px;opacity:.1;transform:rotate(-14deg)">${sun(540)}</div>
    <div style="position:absolute;left:64px;right:64px;top:96px;color:${CREAM}">
      <p class="eyebrow" style="color:${YELLOW}">¿Sabías que…?</p>
      <p class="display" style="font-size:280px;color:${YELLOW};margin-top:40px">4.350</p>
      <p style="font-size:34px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:${YELLOW}">msnm</p>
      <p style="font-size:42px;font-weight:600;line-height:1.35;margin-top:44px;opacity:.92">
        tiene el mirador del <b>Hornocal</b>, el Cerro de los 14 Colores, en la Quebrada de Humahuaca.
      </p>
    </div>
    <div style="position:absolute;left:64px;right:64px;bottom:56px;display:flex;align-items:center;justify-content:space-between">
      <div class="logo">${sun(44)}<p class="logo-name" style="color:${CREAM};font-size:20px">Norte Aventura</p></div>
      <p style="font-size:22px;font-weight:700;color:${YELLOW}">@puraaventurasalta</p>
    </div>`),

  // 5) Salidas de la semana — 1080x1080
  week: page(1080, 1080, `
    <div style="position:absolute;inset:0;background:${CREAM}"></div>
    <div style="position:absolute;left:0;right:0;top:0;background:${GREEN};padding:52px 64px;display:flex;align-items:center;justify-content:space-between">
      <div class="logo">${sun(54)}<p class="logo-name" style="color:${CREAM}">Norte<br>Aventura</p></div>
      <p class="eyebrow" style="color:${YELLOW};font-size:22px">Salidas de la semana</p>
    </div>
    <div style="position:absolute;left:64px;right:64px;top:230px">
      ${[
        ['SÁB', 'Humahuaca + Hornocal', '1 día', '$80.000', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg'],
        ['DOM', 'Cafayate + Quebrada de las Conchas', '1 día', '$48.000', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg'],
        ['SÁB', 'Salinas Grandes + Purmamarca', '1 día', '$58.000', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg'],
        ['DOM', 'Cachi · Cuesta del Obispo', '1 día', '$48.000', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg'],
      ].map(([day, name, dur, price, img]) => `
        <div style="display:flex;align-items:center;gap:26px;background:#fff;border-radius:26px;padding:18px;margin-bottom:20px;box-shadow:0 6px 24px rgba(9,54,40,.08)">
          <img src="${img}" style="width:150px;height:110px;object-fit:cover;border-radius:18px">
          <div style="flex:1">
            <p style="font-size:20px;font-weight:800;color:${YELLOW_D};letter-spacing:.14em">${day}</p>
            <p style="font-size:30px;font-weight:800;color:${GREEN};line-height:1.15">${name}</p>
            <p style="font-size:20px;font-weight:600;color:${GREEN};opacity:.55">${dur}</p>
          </div>
          <p style="font-size:34px;font-weight:800;color:${GREEN}">${price}</p>
        </div>`).join('')}
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:${YELLOW};padding:28px 64px;text-align:center">
      <p style="font-size:26px;font-weight:800;color:${GREEN};text-transform:uppercase">Reservá por WhatsApp → ${wa}</p>
    </div>`),

  // 6) Story — 1080x1920 (foto arriba + info abajo)
  story: page(1080, 1920, `
    <img src="https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,54,40,.4) 0%,rgba(9,54,40,0) 30%,rgba(5,42,30,.94) 66%,${GREEN_D} 100%)"></div>
    <div style="position:absolute;top:64px;left:64px" class="logo">
      ${sun(64)}
      <div class="logo-name" style="color:${CREAM}">Norte<br>Aventura</div>
    </div>
    <div style="position:absolute;left:64px;right:64px;bottom:120px;color:${CREAM}">
      <span class="pill eyebrow" style="background:${YELLOW};color:${GREEN};padding:16px 30px">Nueva salida · Sáb 15</span>
      <h1 class="display" style="font-size:118px;margin-top:32px">Salinas<br>Grandes<br>+ Purmamarca</h1>
      <p style="font-size:34px;font-weight:600;opacity:.8;margin-top:30px">Cuesta de Lipán · fotos infinitas · grupos reducidos</p>
      <div class="pill" style="margin-top:44px;background:${YELLOW};color:${GREEN};padding:26px 48px;font-size:32px;font-weight:800">
        Escribinos y reservá →
      </div>
      <p style="font-size:26px;font-weight:700;margin-top:30px;opacity:.75">${wa} · @puraaventurasalta</p>
    </div>`),

  // 7) Portadas de destacadas — 1080x1080, una por destino
  ...Object.fromEntries(
    [
      ['cover-hornocal', 'Hornocal', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg'],
      ['cover-salinas', 'Salinas', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/20220515_153224.jpg'],
      ['cover-cachi', 'Cachi', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg'],
      ['cover-cafayate', 'Cafayate', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/20250126_174817-e1772563249896.jpg'],
      ['cover-llamas', 'Llamas', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg'],
      ['cover-iruya', 'Iruya', 'https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20250115-WA0080.jpg'],
      ['cover-termas', 'Termas', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/IMG-20240715-WA0028-e1745460883211.jpg'],
      ['cover-tren', 'Tren Solar', 'https://norteaventura.com.ar/wp-content/uploads/2025/04/DJI_0679-2.jpg'],
    ].map(([key, name, img]) => [
      key,
      page(1080, 1080, `
        <img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:${GREEN};opacity:.82"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px">
          ${sun(200)}
          <p class="display" style="font-size:88px;color:${CREAM};text-align:center;padding:0 40px">${name}</p>
        </div>`),
    ]),
  ),
};

// ============================================================ render
const only = process.argv[2];
const targets = Object.entries(T).filter(([k]) => !only || k === only);
if (!targets.length) {
  console.error('Template desconocido. Disponibles:', Object.keys(T).join(', '));
  process.exit(1);
}

const browser = await pw.chromium.launch({ executablePath: CHROME });
const sizes = { excursion: [1080, 1350], promo: [1080, 1350], story: [1080, 1920] };
for (const [name, html] of targets) {
  const [w, h] = sizes[name] ?? [1080, 1080];
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  const out = path.join(dir, 'out', `${name}.png`);
  await p.screenshot({ path: out });
  await p.close();
  console.log('✓', name, `(${w}x${h})`);
}
await browser.close();
