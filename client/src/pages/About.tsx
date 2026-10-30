import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/Icons';
import PageBanner from '../components/PageBanner';

const values = [
  'Trekking y turismo alternativo',
  'Reversionamos cada destino con nuestro toque',
  'Excursiones, naturaleza y cultura',
  'Turismo para todxs',
  'Compromiso con el medioambiente y las comunidades locales',
];

export default function About() {
  return (
    <>
      <PageBanner eyebrow="Nosotros" title="Pura Aventura, del norte para el mundo" />

      <section className="mx-auto max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold text-norte-green">Quiénes somos</h2>
          <p className="mt-4 leading-relaxed text-norte-gray">
            Somos una agencia de turismo con base en Salta y Tilcara, orientada al trekking y
            al turismo alternativo. Buscamos reversionar cada destino y darle nuestro toque:
            ¡a Pura Aventura!
          </p>
          <p className="mt-4 leading-relaxed text-norte-gray">
            Trabajamos con guías locales, grupos reducidos y un fuerte compromiso con la
            sustentabilidad: cada excursión cuida el medioambiente y respeta a las comunidades
            que nos reciben.
          </p>
          <ul className="mt-8 space-y-3">
            {values.map((v) => (
              <li key={v} className="flex items-start gap-3 text-sm font-semibold text-norte-green">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-norte-yellow text-norte-green">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-0">
          <img
            src="https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240520-WA0124.jpg"
            alt="Hornocal"
            className="h-56 w-full rounded-2xl object-cover"
          />
          <img
            src="https://norteaventura.com.ar/wp-content/uploads/2025/02/20220304_172731-scaled.jpg"
            alt="Salinas Grandes"
            className="h-56 w-full rounded-2xl object-cover sm:mt-8"
          />
          <img
            src="https://norteaventura.com.ar/wp-content/uploads/2025/03/IMG-20240503-WA0026.jpg"
            alt="Trekking con llamas"
            className="h-56 w-full rounded-2xl object-cover"
          />
          <img
            src="https://norteaventura.com.ar/wp-content/uploads/2025/03/20250105_115140.jpg"
            alt="Cascada Escondida"
            className="h-56 w-full rounded-2xl object-cover sm:mt-8"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold text-norte-green">¿Listo para tu próxima aventura?</h2>
        <Link
          to="/excursiones"
          className="mt-6 inline-block rounded-full bg-norte-yellow px-8 py-3.5 text-sm font-bold text-norte-green shadow transition hover:bg-norte-yellow-dark"
        >
          Ver excursiones
        </Link>
      </section>
    </>
  );
}
