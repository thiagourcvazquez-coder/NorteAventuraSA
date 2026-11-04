import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function Cursor() {
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );
  const [target, setTarget] = useState<{ label: string } | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a,button,[data-cursor]');
      setTarget(el ? { label: el.dataset.cursor ?? '' } : null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const big = !!target;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-norte-yellow"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99] flex items-center justify-center rounded-full border border-norte-yellow text-[10px] font-extrabold uppercase tracking-wider text-norte-green"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: target?.label ? 84 : big ? 52 : 30,
          height: target?.label ? 84 : big ? 52 : 30,
          backgroundColor: target?.label ? 'rgba(191,219,38,1)' : big ? 'rgba(191,219,38,0.18)' : 'rgba(191,219,38,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {target?.label}
      </motion.div>
    </>
  );
}
