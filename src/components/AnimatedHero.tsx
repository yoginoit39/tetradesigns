'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';

gsap.registerPlugin();

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-label-line', { scaleX: 0, transformOrigin: 'left', duration: 0.7 })
      .from('.hero-label-text', { opacity: 0, x: -12, duration: 0.5 }, '-=0.3')
      .from('.hero-word', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.2')
      .from('.hero-desc', { opacity: 0, y: 24, duration: 0.7 }, '-=0.4')
      .from('.hero-btn', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, '-=0.4');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* Label */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <span className="hero-label-line" style={{ width: '36px', height: '1px', background: '#6D28D9', display: 'block', flexShrink: 0 }} />
        <span className="hero-label-text" style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          fontSize: '0.68rem', letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#A78BFA', fontWeight: 500,
        }}>Est. 1994 · Kampala, Uganda</span>
      </div>

      {/* Heading */}
      <h1 className="hero-heading" style={{
        fontFamily: 'var(--font-oswald), sans-serif',
        fontWeight: 800,
        lineHeight: 0.92,
        marginBottom: '1.75rem',
        textTransform: 'uppercase',
        display: 'flex', flexDirection: 'column', gap: '0.06em',
      }}>
        {[
          { text: 'Building', color: '#F2EDE6' },
          { text: "Uganda's", color: '#A78BFA' },
          { text: 'Infrastructure', color: '#F2EDE6' },
        ].map(({ text, color }) => (
          <span key={text} style={{ display: 'block', whiteSpace: 'nowrap' }}>
            <span className="hero-word" style={{ display: 'block', color }}>{text}</span>
          </span>
        ))}
      </h1>

      <p className="hero-desc" style={{
        color: 'rgba(230,220,208,0.62)', fontSize: '0.95rem', lineHeight: 1.85,
        maxWidth: '420px', marginBottom: '2.5rem',
        fontFamily: 'var(--font-barlow), sans-serif', fontWeight: 400,
      }}>
        Over 30 years of civil and structural engineering expertise.
        Roads, bridges, buildings, and water systems across Uganda —
        delivered on time and to budget.
      </p>

      <div className="r-hero-btns">
        <Link href="/projects" className="hero-btn" style={{
          background: '#6D28D9', color: '#fff',
          fontFamily: 'var(--font-oswald), sans-serif',
          fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '0.9rem 2.1rem',
          textDecoration: 'none', display: 'inline-block', borderRadius: '2px',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#5B21B6'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6D28D9'; }}
        >View Our Projects</Link>

        <Link href="/contact" className="hero-btn" style={{
          border: '1px solid rgba(230,220,208,0.22)', color: 'rgba(230,220,208,0.75)',
          fontFamily: 'var(--font-oswald), sans-serif',
          fontWeight: 500, fontSize: '0.8rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '0.9rem 2.1rem',
          textDecoration: 'none', display: 'inline-block', borderRadius: '2px',
          transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(230,220,208,0.5)'; e.currentTarget.style.color = '#F2EDE6'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(230,220,208,0.22)'; e.currentTarget.style.color = 'rgba(230,220,208,0.75)'; }}
        >Get in Touch</Link>
      </div>
    </div>
  );
}
