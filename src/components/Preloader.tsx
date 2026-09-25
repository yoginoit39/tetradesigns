'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Cinematic ~5s intro shown on first load / hard refresh only (lives in the
 * root layout, so it never reappears on in-app navigation).
 *
 * Sequence: blueprint grid in → crosshair guide lines sweep → logo draws
 * itself stroke-by-stroke → wordmark assembles → 0–100% counter + progress
 * bar → curtain wipe reveals the site.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hLineRef = useRef<HTMLDivElement>(null);
  const vLineRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const drawRefs = useRef<(SVGPathElement | null)[]>([]);

  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = 'hidden';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      html.style.overflow = '';
      setGone(true);
    };

    // Reduced motion: brief static hold, no 5s sequence
    if (reduce) {
      const t = setTimeout(finish, 900);
      return () => { clearTimeout(t); html.style.overflow = ''; };
    }

    const ctx = gsap.context(() => {
      // Prep stroke draw on every logo path
      const paths = drawRefs.current.filter(Boolean) as SVGPathElement[];
      paths.forEach(p => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });

      const tl = gsap.timeline({ onComplete: finish });

      tl
        // grid fades up
        .from(gridRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' })
        // crosshair guide lines sweep across
        .from(hLineRef.current, { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, 0.15)
        .from(vLineRef.current, { scaleY: 0, duration: 0.7, ease: 'power3.inOut' }, 0.25)
        // outer diamond draws
        .to(paths[0], { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.55)
        // inner diamond fill scales in
        .from('.pl-fill', { scale: 0, opacity: 0, transformOrigin: 'center', duration: 0.55, ease: 'back.out(1.7)' }, 1.25)
        // monogram strokes draw in
        .to(paths.slice(1), { strokeDashoffset: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out' }, 1.5)
        // wordmark letters rise
        .from('.pl-char', { yPercent: 120, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 2.3)
        .from(subRef.current, { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' }, 2.7)
        // counter 0 → 100 and progress bar fill
        .to({ v: 0 }, { v: 100, duration: 2.0, ease: 'power1.inOut', onUpdate() {
          setPct(Math.round((this.targets()[0] as { v: number }).v));
        } }, 2.5)
        .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 2.0, ease: 'power1.inOut' }, 2.5)
        // brief settle
        .to({}, { duration: 0.35 }, 4.5)
        // curtain wipe reveals the site
        .to([wordRef.current, subRef.current, pctRef.current, '.pl-logo-wrap'], { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' }, 4.75)
        .to(rootRef.current, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, 4.95);

      // continuous ring pulse independent of the timeline
      gsap.to(ringRef.current, {
        scale: 1.5, opacity: 0, duration: 1.6, ease: 'power2.out',
        repeat: -1, transformOrigin: 'center',
      });
    }, rootRef);

    // Safety: never trap the user
    const safety = setTimeout(finish, 6500);

    return () => {
      ctx.revert();
      clearTimeout(safety);
      html.style.overflow = '';
    };
  }, []);

  if (gone) return null;

  const letters = 'TETRA'.split('');

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: '#0C0A09', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.6rem',
      }}
    >
      {/* Blueprint grid */}
      <div ref={gridRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        maskImage: 'radial-gradient(circle at center, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 75%)',
      }} />

      {/* Crosshair guide lines */}
      <div ref={hLineRef} style={{
        position: 'absolute', left: 0, right: 0, top: '50%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(109,40,217,0.5), transparent)',
        transformOrigin: 'center', pointerEvents: 'none',
      }} />
      <div ref={vLineRef} style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px',
        background: 'linear-gradient(180deg, transparent, rgba(109,40,217,0.5), transparent)',
        transformOrigin: 'center', pointerEvents: 'none',
      }} />

      {/* Logo — draws itself */}
      <div className="pl-logo-wrap" style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" viewBox="0 0 80 80" fill="none" style={{ overflow: 'visible' }}>
          {/* expanding ring */}
          <circle ref={ringRef} cx="40" cy="40" r="42" fill="none" stroke="rgba(109,40,217,0.5)" strokeWidth="1" style={{ opacity: 0.5 }} />
          {/* outer diamond (draws) */}
          <path ref={el => { drawRefs.current[0] = el; }} d="M40 4 L76 40 L40 76 L4 40 Z" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinejoin="round" />
          {/* inner diamond fill (scales in) */}
          <polygon className="pl-fill" points="40,16 64,40 40,64 16,40" fill="#6D28D9" opacity="0.9" />
          {/* monogram (draws) */}
          <path ref={el => { drawRefs.current[1] = el; }} d="M24 30 H36 M30 30 V48" fill="none" stroke="#E8EDF5" strokeWidth="3" strokeLinecap="round" style={{ opacity: 0 }} />
          <path ref={el => { drawRefs.current[2] = el; }} d="M37 30 L37 48 Q52 39 37 30" fill="none" stroke="#E8EDF5" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0 }} />
          <path ref={el => { drawRefs.current[3] = el; }} d="M58 33 Q50 28 50 39 Q50 50 58 47" fill="none" stroke="#E8EDF5" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0 }} />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ textAlign: 'center', overflow: 'hidden' }}>
        <div ref={wordRef} style={{ display: 'flex', gap: '0.06em', justifyContent: 'center', overflow: 'hidden' }}>
          {letters.map((c, i) => (
            <span key={i} className="pl-char" style={{
              display: 'inline-block',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontWeight: 700, fontSize: '1.6rem', letterSpacing: '0.14em',
              color: '#F2EDE6',
            }}>{c}</span>
          ))}
        </div>
        <div ref={subRef} style={{
          fontFamily: 'var(--font-barlow), Barlow, sans-serif',
          fontSize: '0.58rem', letterSpacing: '0.34em', textTransform: 'uppercase',
          color: '#6D28D9', marginTop: '0.5rem',
        }}>Design &amp; Concepts</div>
      </div>

      {/* Progress bar + counter */}
      <div ref={pctRef} style={{
        position: 'absolute', bottom: 'clamp(2rem, 6vh, 4rem)', left: '50%',
        transform: 'translateX(-50%)', width: 'min(260px, 60vw)',
        display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center',
      }}>
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '2px' }}>
          <div ref={barRef} style={{
            height: '100%', width: '100%', transformOrigin: 'left center', transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, #6D28D9, #A78BFA)',
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-barlow), Barlow, sans-serif',
          fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(230,220,208,0.55)',
        }}>Loading {pct}%</div>
      </div>
    </div>
  );
}
