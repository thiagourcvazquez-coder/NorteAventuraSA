import { useEffect, useState } from 'react';
import { useLang } from '../i18n';

/** [código de discado, nombre en español, nombre en inglés] — Argentina primero y por defecto. */
const DIAL: [string, string, string][] = [
  ['+54', 'Argentina', 'Argentina'],
  ['+598', 'Uruguay', 'Uruguay'],
  ['+56', 'Chile', 'Chile'],
  ['+55', 'Brasil', 'Brazil'],
  ['+595', 'Paraguay', 'Paraguay'],
  ['+591', 'Bolivia', 'Bolivia'],
  ['+51', 'Perú', 'Peru'],
  ['+57', 'Colombia', 'Colombia'],
  ['+593', 'Ecuador', 'Ecuador'],
  ['+58', 'Venezuela', 'Venezuela'],
  ['+52', 'México', 'Mexico'],
  ['+1', 'Estados Unidos / Canadá', 'United States / Canada'],
  ['+34', 'España', 'Spain'],
  ['+33', 'Francia', 'France'],
  ['+39', 'Italia', 'Italy'],
  ['+49', 'Alemania', 'Germany'],
  ['+44', 'Reino Unido', 'United Kingdom'],
  ['+31', 'Países Bajos', 'Netherlands'],
  ['+41', 'Suiza', 'Switzerland'],
  ['+351', 'Portugal', 'Portugal'],
  ['+972', 'Israel', 'Israel'],
  ['+61', 'Australia', 'Australia'],
  ['+81', 'Japón', 'Japan'],
  ['+86', 'China', 'China'],
];

/**
 * Teléfono internacional: selector de país (Argentina por defecto) + número.
 * Devuelve al padre "+54 387 123 4567", o vacío si todavía no hay número
 * (así las validaciones de "campo obligatorio" siguen funcionando).
 */
export default function PhoneField({
  onChange,
  inputCls,
  placeholder = '387 123 4567',
  followDial,
}: {
  onChange: (full: string) => void;
  inputCls: string;
  placeholder?: string;
  /** Código sugerido (por ejemplo según el país elegido en el formulario). */
  followDial?: string;
}) {
  const { lang, t } = useLang();
  const [dial, setDial] = useState('+54');
  const [num, setNum] = useState('');

  const emit = (d: string, n: string) => onChange(n.trim() ? `${d} ${n.trim()}` : '');

  // Si el usuario cambia de país en el formulario, el código acompaña (y se puede volver a cambiar a mano).
  useEffect(() => {
    if (followDial && DIAL.some(([c]) => c === followDial)) {
      setDial(followDial);
      onChange(num.trim() ? `${followDial} ${num.trim()}` : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followDial]);

  return (
    <div className="flex gap-2">
      <select
        value={dial}
        onChange={(e) => {
          setDial(e.target.value);
          emit(e.target.value, num);
        }}
        aria-label={t('bk.country')}
        className={`${inputCls} !w-[9.6rem] shrink-0 !px-2`}
      >
        {DIAL.map(([code, es, en]) => (
          <option key={code + es} value={code}>
            {lang === 'en' ? en : es} ({code})
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={num}
        onChange={(e) => {
          setNum(e.target.value);
          emit(dial, e.target.value);
        }}
        placeholder={placeholder}
        className={inputCls}
        required
      />
    </div>
  );
}
