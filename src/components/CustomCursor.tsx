'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const tickerRef = useRef<(() => void) | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Only run on real pointing devices, and respect reduced-motion.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
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

    const grow = () => gsap.to(ring, { scale: 2.8, duration: 0.4, ease: 'power2.out', borderColor: '#6D28D9', opacity: 1 });
    const shrink = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power2.out', borderColor: 'rgba(109,40,217,0.45)', opacity: 0.85 });

    // Event delegation — one pair of listeners, no per-element churn,
    // works for content added later without re-scanning the DOM.
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, [role="button"], input, textarea, select');
    const onOver = (e: MouseEvent) => { if (isInteractive(e.target)) grow(); };
    const onOut = (e: MouseEvent) => { if (isInteractive(e.target)) shrink(); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

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
