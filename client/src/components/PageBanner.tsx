import { SplitWords, SunMark } from './Motion';

export default function PageBanner({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden bg-norte-green pb-16 pt-36 sm:pb-24 sm:pt-44">
      <SunMark className="pointer-events-none absolute -right-16 -top-16 h-[380px] w-[380px] animate-[spin_90s_linear_infinite] text-norte-yellow/15 sm:h-[560px] sm:w-[560px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-norte-yellow">{eyebrow}</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] text-norte-cream">
          <SplitWords text={title} onMount delay={0.1} />
        </h1>
        {children && <div className="mt-6 max-w-xl text-norte-cream/70">{children}</div>}
      </div>
    </section>
  );
}
