// Mockups "después" para el PDF de preview de cambios → docs/cambios/assets/mock-*.png
// Uso: node render-mocks.mjs
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pw = createRequire(import.meta.url)('C:/Users/Usuario/AppData/Local/Temp/na-verify/node_modules/playwright-core');
const CHROME = 'C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const dir = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(dir, '../propuesta/assets/fonts').replace(/\\/g, '/');

// Nueva paleta pedida por el cliente
const LIME = '#bfdb26';
const ORANGE = '#fb950e';
const OLIVE = '#728316';
const BLACK = '#0b0d05';
const WHITE = '#ffffff';

const css = `
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Regular.ttf'); font-weight: 400; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Medium.ttf'); font-weight: 500; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-SemiBold.ttf'); font-weight: 600; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-Bold.ttf'); font-weight: 700; }
  @font-face { font-family: 'Montserrat'; src: url('file://${FONTS}/Montserrat-ExtraBold.ttf'); font-weight: 800; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
  .display { text-transform: uppercase; font-weight: 800; line-height: .95; letter-spacing: -.01em; }
  .pill { display: inline-flex; align-items: center; gap: 10px; border-radius: 999px; }
`;

const page = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body { width: ${w}px; height: ${h}px; overflow: hidden; position: relative; }
</style></head><body>${body}</body></html>`;

const NAV = ['Inicio', 'Desde Salta', 'Desde Jujuy', 'Trekking y Experiencias', 'Nosotros', 'Contacto'];
const navBar = (active = 'Inicio') => `
  <div style="position:absolute;top:24px;left:40px;right:40px;height:72px;display:flex;align-items:center;justify-content:space-between;background:rgba(11,13,5,.55);backdrop-filter:blur(14px);border-radius:999px;padding:0 14px 0 22px;box-shadow:0 8px 30px rgba(0,0,0,.25)">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:46px;height:46px;border-radius:50%;background:${LIME};display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 48 48" width="30" height="30"><circle cx="24" cy="20" r="9" fill="${BLACK}"/>${Array.from({length:12},(_,i)=>`<rect x="22.7" y="3" width="2.6" height="7" rx="1.3" fill="${BLACK}" transform="rotate(${i*30} 24 20)"/>`).join('')}<path d="M6 40 L18 26 L26 34 L34 22 L44 40 Z" fill="${BLACK}"/></svg>
      </div>
      <div style="font-size:15px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${WHITE};line-height:1.1">Norte<br>Aventura</div>
    </div>
    <div style="display:flex;align-items:center;gap:2px">
      ${NAV.map(n => `<span style="padding:12px 16px;border-radius:999px;font-size:13.5px;font-weight:700;${n===active?`background:${LIME};color:${BLACK}`:`color:rgba(255,255,255,.85)`}">${n}</span>`).join('')}
      <span class="pill" style="margin-left:12px;background:${ORANGE};color:${BLACK};padding:13px 24px;font-size:13.5px;font-weight:800">Reservar</span>
    </div>
  </div>`;

const T = {
  // ---- 1) HERO con nueva paleta + títulos pedidos
  'mock-hero': page(1440, 760, `
    <img src="https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,13,5,.35) 0%,rgba(11,13,5,.15) 40%,rgba(11,13,5,.78) 100%)"></div>
    ${navBar('Inicio')}
    <div style="position:absolute;left:64px;right:64px;top:150px">
      <span class="pill" style="background:${LIME};color:${BLACK};padding:12px 24px;font-size:14px;font-weight:800;letter-spacing:.2em;text-transform:uppercase">Salta · Tilcara · Jujuy</span>
      <h1 class="display" style="font-size:78px;color:${WHITE};margin-top:26px;max-width:1100px">Viví el Norte Argentino<br><span style="color:${LIME}">como nunca antes</span></h1>
      <p style="font-size:24px;font-weight:600;color:rgba(255,255,255,.9);margin-top:24px;max-width:720px;line-height:1.4">Excursiones, trekking y experiencias auténticas desde Salta y Jujuy.</p>
      <div style="display:flex;gap:16px;margin-top:36px">
        <span class="pill" style="background:${ORANGE};color:${BLACK};padding:20px 38px;font-size:17px;font-weight:800">Ver excursiones →</span>
        <span class="pill" style="background:transparent;color:${WHITE};border:2px solid rgba(255,255,255,.5);padding:18px 34px;font-size:17px;font-weight:700">Trekking a medida</span>
      </div>
    </div>`),

  // ---- 2) NUESTROS DESTINOS → 3 cards con CTA
  'mock-destinos': page(1440, 900, `
    <div style="position:absolute;inset:0;background:#f7f8ee"></div>
    <div style="position:absolute;left:64px;right:64px;top:70px">
      <p style="font-size:15px;font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:${OLIVE}">Nuestros destinos</p>
      <h2 class="display" style="font-size:62px;color:${BLACK};margin-top:14px">Descubrí tu tipo de<br>experiencia en el Norte</h2>
    </div>
    <div style="position:absolute;left:64px;right:64px;top:280px;display:flex;gap:28px">
      <div style="flex:1;height:540px;border-radius:32px;overflow:hidden;position:relative">
        <img src="https://norteaventura.com.ar/wp-content/uploads/2025/04/Salta-Cachi-Iglesia-de-San-Jose-de-Cachi-1.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(11,13,5,.85))"></div>
        <div style="position:absolute;left:34px;right:34px;bottom:34px">
          <p class="display" style="font-size:38px;color:${WHITE}">Excursiones<br>clásicas</p>
          <span class="pill" style="margin-top:20px;background:${LIME};color:${BLACK};padding:14px 26px;font-size:15px;font-weight:800">Ver excursiones →</span>
        </div>
      </div>
      <div style="flex:1.25;height:580px;margin-top:-20px;border-radius:32px;overflow:hidden;position:relative;box-shadow:0 24px 60px rgba(11,13,5,.25)">
        <img src="https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(11,13,5,.9))"></div>
        <span class="pill" style="position:absolute;top:26px;left:34px;background:${ORANGE};color:${BLACK};padding:10px 22px;font-size:12.5px;font-weight:800;letter-spacing:.15em;text-transform:uppercase">Diferencial</span>
        <div style="position:absolute;left:34px;right:34px;bottom:38px">
          <p class="display" style="font-size:46px;color:${WHITE}">Trekking &amp;<br>Turismo Activo</p>
          <span class="pill" style="margin-top:22px;background:${ORANGE};color:${BLACK};padding:16px 30px;font-size:16px;font-weight:800">Explorar trekking →</span>
        </div>
      </div>
      <div style="flex:1;height:540px;border-radius:32px;overflow:hidden;position:relative">
        <img src="https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(11,13,5,.85))"></div>
        <div style="position:absolute;left:34px;right:34px;bottom:34px">
          <p class="display" style="font-size:38px;color:${WHITE}">Salidas privadas<br>y a medida</p>
          <span class="pill" style="margin-top:20px;background:${WHITE};color:${BLACK};padding:14px 26px;font-size:15px;font-weight:800">Solicitar propuesta →</span>
        </div>
      </div>
    </div>`),

  // ---- 3) Card de excursión con precio base doble claro + dificultad
  'mock-card-doble': page(520, 720, `
    <div style="position:absolute;inset:0;background:#f7f8ee"></div>
    <div style="position:absolute;left:14px;right:14px;top:14px;bottom:14px;border-radius:32px;overflow:hidden;background:${WHITE};box-shadow:0 14px 44px rgba(11,13,5,.12)">
      <div style="position:relative;height:340px">
        <img src="https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
        <span class="pill" style="position:absolute;top:18px;left:18px;background:rgba(255,255,255,.92);color:${BLACK};padding:9px 16px;font-size:12.5px;font-weight:700">📍 San Lorenzo, Salta</span>
        <span class="pill" style="position:absolute;top:18px;right:18px;background:${ORANGE};color:${BLACK};padding:9px 16px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Dificultad media</span>
      </div>
      <div style="padding:26px 28px">
        <h3 style="font-size:21px;font-weight:800;color:${BLACK};line-height:1.2">Cascada Escondida – San Lorenzo</h3>
        <p style="font-size:13.5px;font-weight:600;color:${OLIVE};margin-top:8px">Trekking y naturaleza · 1/2 día</p>
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:24px;border-top:1.5px solid #e8ebd4;padding-top:20px">
          <div>
            <p style="font-size:32px;font-weight:800;color:${BLACK}">$ 70.000</p>
            <p style="font-size:13.5px;font-weight:700;color:${ORANGE};margin-top:2px">por 2 personas (base doble)</p>
          </div>
          <span class="pill" style="background:${LIME};color:${BLACK};width:52px;height:52px;justify-content:center;font-size:20px;font-weight:800">→</span>
        </div>
      </div>
    </div>`),

  // ---- 4) Footer con datos corregidos + redes a color
  'mock-footer': page(1440, 520, `
    <div style="position:absolute;inset:0;background:${BLACK}"></div>
    <div style="position:absolute;left:80px;right:80px;top:64px;display:flex;gap:80px">
      <div style="flex:1.4">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:58px;height:58px;border-radius:50%;background:${LIME};display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 48 48" width="38" height="38"><circle cx="24" cy="20" r="9" fill="${BLACK}"/>${Array.from({length:12},(_,i)=>`<rect x="22.7" y="3" width="2.6" height="7" rx="1.3" fill="${BLACK}" transform="rotate(${i*30} 24 20)"/>`).join('')}<path d="M6 40 L18 26 L26 34 L34 22 L44 40 Z" fill="${BLACK}"/></svg>
          </div>
          <div style="font-size:18px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${WHITE};line-height:1.1">Norte<br>Aventura</div>
        </div>
        <p style="font-size:14.5px;font-weight:500;color:rgba(255,255,255,.65);line-height:1.6;margin-top:22px;max-width:430px">Somos una agencia especializada en trekking y experiencias activas en el Norte Argentino, con base en Salta y Tilcara. Creamos salidas únicas, con identidad propia, planificación profesional y atención cercana.</p>
        <div style="display:flex;gap:12px;margin-top:26px">
          <div style="width:44px;height:44px;border-radius:12px;background:#1877F2;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff">f</div>
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);display:flex;align-items:center;justify-content:center;color:#fff">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="#fff" stroke="none"/></svg>
          </div>
          <div style="width:44px;height:44px;border-radius:12px;background:#000;border:1.5px solid #333;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M16.6 3c.4 2 1.8 3.5 3.9 3.8v3c-1.5 0-2.9-.5-3.9-1.3v6.4c0 3.6-2.7 6.1-6 6.1-3.5 0-6.1-2.6-6.1-6 0-3.5 2.9-6.2 6.6-5.9v3.1c-1.9-.4-3.5.8-3.5 2.7 0 1.6 1.3 2.9 3 2.9 1.9 0 3-1.4 3-3.2V3h3z"/></svg>
          </div>
          <div style="width:44px;height:44px;border-radius:12px;background:#25D366;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-3.4-1.1-5.6-4.6-5.8-4.8-.2-.2-1.4-1.9-1.4-3.6 0-1.7.9-2.5 1.2-2.9.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.8.6l1 2.4c.1.2.1.4 0 .6l-.5.7c-.2.2-.3.4-.1.8.1.3.7 1.2 1.6 2 1.1 1 2 1.3 2.3 1.4.3.2.5.1.7-.1l1-1.1c.2-.3.5-.2.8-.1l2.1 1c.3.2.5.3.6.4.1.3.1.9-.1 1.6z"/></svg>
          </div>
        </div>
      </div>
      <div style="flex:1">
        <p style="font-size:12px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:${LIME}">Menú</p>
        ${NAV.map(n=>`<p style="font-size:15.5px;font-weight:600;color:rgba(255,255,255,.85);margin-top:14px">${n}</p>`).join('')}
      </div>
      <div style="flex:1.1">
        <p style="font-size:12px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;color:${LIME}">Contacto</p>
        <p style="font-size:15.5px;font-weight:600;color:rgba(255,255,255,.85);margin-top:14px">📍 Salta, Argentina</p>
        <p style="font-size:15.5px;font-weight:600;color:rgba(255,255,255,.85);margin-top:12px">📞 +54 9 387 403 9502</p>
        <p style="font-size:15.5px;font-weight:700;color:${ORANGE};margin-top:12px">✉ norteaventuraok@gmail.com</p>
        <p style="font-size:13px;font-weight:600;color:rgba(255,255,255,.5);margin-top:14px">@norteaventura.ok en todas las redes</p>
      </div>
    </div>
    <div style="position:absolute;left:80px;right:80px;bottom:34px;border-top:1px solid rgba(255,255,255,.12);padding-top:20px;display:flex;justify-content:space-between">
      <p style="font-size:12.5px;color:rgba(255,255,255,.45)">Norte Aventura © 2026 — Salta, Tilcara y Jujuy</p>
      <p style="font-size:12.5px;color:rgba(255,255,255,.45)">Hecho con ♥ en el Norte</p>
    </div>`),
};

const browser = await pw.chromium.launch({ executablePath: CHROME });
const sizes = { 'mock-hero': [1440, 760], 'mock-destinos': [1440, 900], 'mock-card-doble': [520, 720], 'mock-footer': [1440, 520] };
for (const [name, html] of Object.entries(T)) {
  const [w, h] = sizes[name];
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(dir, 'assets', `${name}.png`) });
  await p.close();
  console.log('✓', name);
}
await browser.close();
