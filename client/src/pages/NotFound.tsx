import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-48 text-center sm:px-6">
      <p className="text-6xl font-extrabold text-norte-yellow">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-norte-green">
        Te fuiste del sendero
      </h1>
      <p className="mt-2 text-norte-gray">La página que buscás no existe o fue movida.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-norte-green px-8 py-3 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
