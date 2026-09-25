'use client';

import { useEffect, useRef } from 'react';

/** Thin purple progress bar pinned to the very top of the viewport. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
      zIndex: 300, pointerEvents: 'none', background: 'rgba(109,40,217,0.12)',
    }}>
      <div ref={barRef} style={{
        height: '100%', width: '100%', transformOrigin: 'left center',
        transform: 'scaleX(0)',
        background: 'linear-gradient(90deg, #6D28D9, #A78BFA)',
        willChange: 'transform',
      }} />
    </div>
  );
}
