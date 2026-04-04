'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const tickerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' });
    };

    const tick = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1;
      gsap.set(ring, { x: ringPos.current.x, y: ringPos.current.y });
    };
    gsap.ticker.add(tick);
    tickerRef.current = tick;

    const onEnter = () => gsap.to(ring, { scale: 2.8, duration: 0.4, ease: 'power2.out', borderColor: '#6D28D9', opacity: 1 });
    const onLeave = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power2.out', borderColor: 'rgba(109,40,217,0.45)', opacity: 0.85 });

    const attach = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();

    // Re-attach on DOM changes (dynamic content)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('mousemove', onMove);
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        width: '7px', height: '7px', borderRadius: '50%',
        background: '#6D28D9', pointerEvents: 'none',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9998,
        width: '38px', height: '38px', borderRadius: '50%',
        border: '1.5px solid rgba(109,40,217,0.45)',
        pointerEvents: 'none', opacity: 0.85,
      }} />
    </>
  );
}
