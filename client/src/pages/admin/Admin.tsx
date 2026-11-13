import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { adminFetch, adminLogin, clearAdminToken, getAdminToken } from '../../lib/api';
import Dashboard from './Dashboard';
import Reservations from './Reservations';
import Finances from './Finances';
import CommentsAdmin from './CommentsAdmin';
import ExcursionEditor from './ExcursionEditor';

export interface AdminExcursion {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: number | null;
  price_note: string | null;
  duration: string;
  schedule: string | null;
  difficulty: string;
  short_desc: string;
  description: string;
  included: string | null;
  booking_lead: string | null;
  image_url: string | null;
  maps_query: string | null;
  is_active: boolean;
  display_order: number;
  categories: { slug: string } | { slug: string }[] | null;
}

type Tab = 'dashboard' | 'reservas' | 'finanzas' | 'comentarios' | 'excursiones';

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'reservas',
    label: 'Reservas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 9h18" />
      </svg>
    ),
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M12 2v20M17 6H9.5a3 3 0 000 6h5a3 3 0 010 6H6" />
      </svg>
    ),
  },
  {
    id: 'comentarios',
    label: 'Comentarios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    id: 'excursiones',
    label: 'Excursiones',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M3 20l6-16 5 10 3-6 4 12z" />
      </svg>
    ),
  },
];

const input =
  'w-full rounded-lg border border-norte-green/20 bg-white px-3 py-2 text-sm text-norte-green outline-none focus:border-norte-yellow-dark focus:ring-2 focus:ring-norte-yellow/40';

function SunMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="9" fill="currentColor" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x="22.7"
          y="2"
          width="2.6"
          height="8"
          rx="1.3"
          fill="currentColor"
          transform={`rotate(${i * 30} 24 24)`}
        />
      ))}
    </svg>
  );
}

function Login({ onOk }: { onOk: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (await adminLogin(username, password)) onOk();
      else setError('Usuario o contraseña incorrectos');
    } catch {
      setError('No se pudo conectar con la API');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-norte-green px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-9 shadow-2xl">
        <div className="flex items-center gap-3">
          <SunMark className="h-11 w-11 text-norte-yellow-dark" />
          <div>
            <p className="text-lg font-extrabold uppercase leading-none tracking-[0.14em] text-norte-green">
              Norte<br />Aventura
            </p>
          </div>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-norte-yellow-dark">Backoffice</p>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          className={`${input} mt-4`}
          autoFocus
          autoComplete="username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className={`${input} mt-3`}
          autoComplete="current-password"
          required
        />
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-norte-green px-6 py-3 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light disabled:opacity-60"
        >
          {loading ? 'Ingresando' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [logged, setLogged] = useState(!!getAdminToken());
  const [tab, setTab] = useState<Tab>('dashboard');
  const [list, setList] = useState<AdminExcursion[] | null>(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadExcursions = useCallback(() => {
    if (!logged) return;
    adminFetch<AdminExcursion[]>('/excursions')
      .then(setList)
      .catch((e) => {
        if (e.message.includes('Sesión')) setLogged(false);
        setError(e.message);
      });
  }, [logged]);

  useEffect(() => {
    loadExcursions();
  }, [loadExcursions]);

  if (!logged) return <Login onOk={() => setLogged(true)} />;

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex min-h-screen bg-norte-cream">
      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 flex-col bg-norte-green md:flex">
        <div className="flex items-center gap-3 px-6 py-7">
          <SunMark className="h-9 w-9 text-norte-yellow" />
          <p className="text-base font-extrabold uppercase leading-tight tracking-[0.14em] text-norte-cream">
            Norte<br />Aventura
          </p>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                tab === t.id
                  ? 'bg-norte-yellow text-norte-green'
                  : 'text-norte-cream/70 hover:bg-white/10 hover:text-norte-cream'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            clearAdminToken();
            setLogged(false);
          }}
          className="mx-3 mb-6 rounded-xl px-4 py-3 text-left text-sm font-bold text-norte-cream/60 transition hover:bg-white/10 hover:text-norte-cream"
        >
          Cerrar sesión →
        </button>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <div className="flex items-center justify-between bg-norte-green px-5 py-4 md:hidden">
          <div className="flex items-center gap-2.5">
            <SunMark className="h-7 w-7 text-norte-yellow" />
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-norte-cream">Norte Aventura</p>
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg px-3 py-1.5 text-sm font-bold text-norte-cream ring-1 ring-norte-cream/30"
          >
            {menuOpen ? 'Cerrar' : current.label}
          </button>
        </div>
        {menuOpen && (
          <nav className="space-y-1 bg-norte-green px-5 pb-5 md:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                  tab === t.id ? 'bg-norte-yellow text-norte-green' : 'text-norte-cream/70'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
            <button
              onClick={() => {
                clearAdminToken();
                setLogged(false);
              }}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-norte-cream/60"
            >
              Cerrar sesión →
            </button>
          </nav>
        )}

        <header className="hidden items-center justify-between border-b border-norte-green/10 bg-white px-8 py-5 md:flex">
          <h1 className="display text-2xl text-norte-green">{current.label}</h1>
          <a href="/" target="_blank" className="text-xs font-bold text-norte-gray hover:text-norte-green">
            Ver sitio público →
          </a>
        </header>

        {error && <p className="mx-5 mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{error}</p>}

        <main className="flex-1 p-4 sm:p-6">
          <div className="rounded-2xl bg-norte-cream/40">
            {tab === 'dashboard' && <Dashboard go={(t) => setTab(t as Tab)} />}
            {tab === 'reservas' && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-norte-green/10">
                <Reservations />
              </div>
            )}
            {tab === 'finanzas' && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-norte-green/10">
                <Finances />
              </div>
            )}
            {tab === 'comentarios' && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-norte-green/10">
                <CommentsAdmin excursions={list} />
              </div>
            )}
            {tab === 'excursiones' && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-norte-green/10">
                <ExcursionEditor list={list} error={error} reload={loadExcursions} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
