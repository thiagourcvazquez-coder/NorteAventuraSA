import { forwardRef, useRef, type ReactNode } from 'react';

/**
 * Fila horizontal que se desliza con el dedo (nativo) y con el mouse (arrastrando).
 * El click que cierra un arrastre se descarta para no abrir links sin querer.
 */
const DragRow = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; onScroll?: () => void; onUserInteract?: () => void }
>(function DragRow({ children, className = '', onScroll, onUserInteract }, forwardedRef) {
  const inner = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  const setRefs = (el: HTMLDivElement | null) => {
    inner.current = el;
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  return (
    <div
      ref={setRefs}
      onScroll={onScroll}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || !inner.current) return;
        drag.current = { active: true, startX: e.clientX, startLeft: inner.current.scrollLeft, moved: false };
        onUserInteract?.();
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active || !inner.current) return;
        const dx = e.clientX - d.startX;
        if (!d.moved && Math.abs(dx) > 5) {
          d.moved = true;
          inner.current.setPointerCapture(e.pointerId);
          inner.current.style.cursor = 'grabbing';
        }
        if (d.moved) inner.current.scrollLeft = d.startLeft - dx;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        d.active = false;
        if (inner.current) {
          inner.current.style.cursor = '';
          if (inner.current.hasPointerCapture(e.pointerId)) inner.current.releasePointerCapture(e.pointerId);
        }
      }}
      onPointerCancel={() => {
        drag.current.active = false;
      }}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      className={`cursor-grab select-none overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
});

export default DragRow;
