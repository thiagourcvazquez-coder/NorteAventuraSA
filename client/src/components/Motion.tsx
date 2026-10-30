import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Texto que entra palabra por palabra, enmascarado (estilo editorial). */
export function SplitWords({
  text,
  className,
  delay = 0,
  onMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  onMount?: boolean;
}) {
  const words = text.split(' ');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const show = onMount || inView;
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] pr-[0.06em] -mr-[0.06em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '115%' }}
            animate={{ y: show ? '0%' : '115%' }}
            transition={{ duration: 0.95, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? '\u00a0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** Párrafo cuyas palabras se "encienden" a medida que se scrollea. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

export function Marquee({
  items,
  className = '',
  speed = 'animate-marquee',
  separator,
}: {
  items: string[];
  className?: string;
  speed?: string;
  separator: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div className={`flex w-max ${speed}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span>{item}</span>
                <span className="mx-8">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SunMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="9" fill="currentColor" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="22.7" y="2" width="2.6" height="8" rx="1.3" fill="currentColor" transform={`rotate(${i * 30} 24 24)`} />
      ))}
    </svg>
  );
}
