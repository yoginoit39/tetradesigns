'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ITEMS = [
  '30+ Years of Excellence',
  'Civil Engineering',
  'Structural Design',
  'Roads & Bridges',
  'Kampala, Uganda',
  'Built to Last',
  'Geotechnical Studies',
  'Project Management',
];

const SEP = <span style={{ margin: '0 1.5rem', color: '#6D28D9', opacity: 0.5 }}>·</span>;

export default function Marquee({ inverted = false }: { inverted?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const child = el.children[0] as HTMLElement;
    if (!child) return;

    const w = child.offsetWidth;
    gsap.set(el, { x: 0 });

    animRef.current = gsap.to(el, {
      x: -w,
      ease: 'none',
      duration: 28,
      repeat: -1,
    });

    return () => { animRef.current?.kill(); };
  }, []);

  const renderItems = () => ITEMS.flatMap((item, i) => [
    <span key={`item-${i}`} style={{
      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
      fontSize: '0.7rem', letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: inverted ? 'rgba(255,255,255,0.4)' : '#C4B5FD',
      whiteSpace: 'nowrap',
    }}>{item}</span>,
    <span key={`sep-${i}`} style={{ margin: '0 1.5rem', color: '#6D28D9', opacity: inverted ? 0.4 : 0.6 }}>·</span>,
  ]);

  return (
    <div style={{
      overflow: 'hidden',
      background: inverted ? '#111827' : '#FAFAFA',
      borderTop: inverted ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB',
      borderBottom: inverted ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E5E7EB',
      padding: '0.85rem 0',
    }}>
      <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', willChange: 'transform' }}>
        {/* Two identical copies so the loop is seamless */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingRight: '0' }}>
          {renderItems()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {renderItems()}
        </div>
      </div>
    </div>
  );
}
