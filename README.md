# Norte Aventura — Sitio Web

Nuevo sitio para **Norte Aventura / Pura Aventura** (agencia de turismo, Salta · Tilcara · Jujuy).

Stack: **React + Vite + TypeScript** (front), **Node.js + Express + TypeScript** (API), **Supabase/Postgres** (datos).
Paleta oficial respetada: verde `#093628`, amarillo `#FFC83B`, crema `#FFFBF2`, gris `#6C6D72`, Montserrat.

## Estructura

```
Norte Aventura/
├── client/            # Sitio público (React + Vite + TS + Tailwind v4)
│   └── src/
│       ├── pages/     # Home, Catalog, ExcursionDetail, About, Contact
│       ├── components/# Header, Footer, ExcursionCard, BookingForm…
│       ├── lib/       # supabase (con fallback), api, format
│       └── data/      # datos locales de respaldo
├── server/            # API (Express + TS) — reservas → Supabase + wa.me
├── supabase/
│   ├── schema.sql     # tablas, índices, RLS
│   └── seed.sql       # catálogo real: 15 excursiones
├── docs/propuesta/    # generador del PDF de propuesta técnica
└── .env.example
```

## Levantar en local

```bash
# 1) Instalar dependencias (raíz usa workspaces)
npm install

# 2) Opcional pero recomendado: instalar deps de cada workspace
npm install -w client -w server

# 3) Arrancar API + front juntos (o por separado con dev:client / dev:server)
npm run dev
```

- Front → http://localhost:5173 (proxy `/api` → :4000)
- API → http://localhost:4000 (`/api/health`, `/api/reservations`)

**Sin Supabase** todo funciona igual: el front usa datos locales y las reservas
siguen generando el link de WhatsApp (solo no se persisten en DB).

## Conectar Supabase

1. Crear proyecto en https://supabase.com
2. SQL Editor → pegar `supabase/schema.sql` → Run
3. SQL Editor → pegar `supabase/seed.sql` → Run
4. Copiar `server/.env` y `client/.env` desde `.env.example` con las claves del proyecto
   (Settings → API): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server) y
   `VITE_SUPABASE_ANON_KEY` (client).
5. Reiniciar `npm run dev`.

## Flujo de reserva

Formulario en la ficha de cada excursión → `POST /api/reservations` → la API
guarda el lead en `reservations` (service role) y devuelve un `wa.me` con el
mensaje pre-armado → el front abre WhatsApp al **+54 9 387 403 9502**.
Si la API o Supabase no responden, el front genera el `wa.me` localmente.

## Deploy en Vercel

Son **2 proyectos** desde el mismo repo:

### 1. Client (frontend)
- Root Directory: `client` · Framework: Vite (detectado solo)
- Env vars:
  - `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` → catálogo desde Supabase
  - `VITE_API_URL` → URL del proyecto server (paso 2), sin barra final. Opcional:
    sin ella las reservas igual abren WhatsApp (no se persisten en DB).
- `vercel.json` ya incluye el rewrite SPA para react-router.

### 2. Server (API Express → serverless)
- Root Directory: `server` · Framework: Express/Otro
- Entry: `api/index.ts` exporta la app; `vercel.json` rutea todo a `/api/*`.
- Env vars:
  - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → persiste `reservations`
  - `CORS_ORIGIN` → URL del client (ej. `https://norte-aventura.vercel.app`)
  - `BUSINESS_WHATSAPP` → `5493874039502`

Orden: deployar **server** primero, copiar su URL a `VITE_API_URL` del client y
redeployar el client (o agregar la env y tocar "Redeploy").

## Propuesta técnica (PDF)

```bash
cd docs/propuesta && npm install   # pdfmake (primera vez)
npm run propuesta                  # genera docs/propuesta/propuesta-norte-aventura.pdf
```

## Roadmap (alineado a la propuesta)

- **Fase 1** ✅ Sitio informativo + reservas por WhatsApp (este repo)
- **Fase 2** Backoffice: login Supabase Auth + CRUD de excursiones/imágenes/textos (opción 4 del presupuesto)
- **Fase 3** Pasarela de pagos (MercadoPago) + confirmación automática de reservas (opción 3)
