import { Link, useSearchParams } from 'react-router-dom';
import { useLang } from '../i18n';
import { SunMark } from '../components/Motion';

type State = 'approved' | 'pending' | 'failure';

export default function PaymentResult() {
  const { t } = useLang();
  const [params] = useSearchParams();
  // Mercado Pago redirige con ?collection_status= o ?status=
  const raw = params.get('collection_status') ?? params.get('status') ?? '';
  const state: State =
    raw === 'approved' ? 'approved' : raw === 'failure' || raw === 'rejected' ? 'failure' : 'pending';

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <SunMark
        className={`h-16 w-16 ${
          state === 'approved' ? 'text-norte-whatsapp' : state === 'pending' ? 'text-norte-yellow-dark' : 'text-red-500'
        }`}
      />
      <h1 className="display mt-6 text-4xl text-norte-green sm:text-5xl">{t(`pay.${state}_t`)}</h1>
      <p className="mt-4 max-w-md text-norte-gray">{t(`pay.${state}_d`)}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/excursiones"
          className="rounded-full bg-norte-yellow px-7 py-3 text-sm font-extrabold text-norte-green transition hover:bg-norte-yellow-dark"
        >
          {t('pay.back')}
        </Link>
        <Link
          to="/"
          className="rounded-full px-7 py-3 text-sm font-extrabold text-norte-green ring-1 ring-norte-green/25 transition hover:ring-norte-green"
        >
          {t('pay.home')}
        </Link>
      </div>
    </section>
  );
}
