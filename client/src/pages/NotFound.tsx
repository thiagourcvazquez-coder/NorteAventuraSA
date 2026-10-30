import { Link } from 'react-router-dom';
import { useLang } from '../i18n';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-48 text-center sm:px-6">
      <p className="text-6xl font-extrabold text-norte-yellow">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-norte-green">
        {t('nf.title')}
      </h1>
      <p className="mt-2 text-norte-gray">{t('nf.text')}</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-norte-green px-8 py-3 text-sm font-bold text-norte-cream transition hover:bg-norte-green-light"
      >
        {t('nf.btn')}
      </Link>
    </div>
  );
}
