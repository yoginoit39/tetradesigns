'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ─── Card component ──────────────────────────────────────────── */
function BentoCard({
  project,
  className,
  style,
  sizes,
  variant = 'default',
}: {
  project: (typeof projects)[0];
  className: string;
  style: React.CSSProperties;
  sizes: string;
  variant?: 'large' | 'wide' | 'default';
}) {
  const isLarge = variant === 'large';
  const isWide  = variant === 'wide';

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '3px',
        background: '#0F0D0C',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Image or placeholder */}
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
          sizes={sizes}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #111018 0%, #0C0A14 100%)',
        }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none" opacity="0.12">
            <rect x="8" y="20" width="32" height="20" stroke="#A78BFA" strokeWidth="1.5" fill="none"/>
            <rect x="16" y="8" width="16" height="12" stroke="#A78BFA" strokeWidth="1.5" fill="none"/>
            <line x1="24" y1="8" x2="24" y2="4" stroke="#A78BFA" strokeWidth="1.5"/>
            <line x1="8" y1="40" x2="40" y2="40" stroke="#A78BFA" strokeWidth="2"/>
          </svg>
        </div>
      )}

      {/* Bottom gradient for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isLarge
          ? 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.92) 100%)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.88) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Year badge */}
      <div style={{
        position: 'absolute', top: '0.8rem', left: '0.8rem',
        background: '#6D28D9', color: '#fff',
        fontFamily: 'var(--font-oswald), sans-serif',
        fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
        padding: '0.18rem 0.55rem', borderRadius: '2px',
        zIndex: 1,
      }}>{project.year}</div>

      {/* Text content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: isLarge ? '1.75rem' : isWide ? '1.25rem 1.5rem' : '1.1rem',
        zIndex: 1,
      }}>
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: '#A78BFA', marginBottom: '0.35rem', fontWeight: 500,
        }}>{project.category}</div>

        <h3 style={{
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: isLarge ? '1.55rem' : isWide ? '1.2rem' : '1rem',
          fontWeight: 700, textTransform: 'uppercase', color: '#F2EDE6',
          lineHeight: 1.1,
          marginBottom: isLarge ? '0.65rem' : '0',
        }}>{project.title}</h3>

        {isLarge && (
          <p style={{
            color: 'rgba(242,237,230,0.5)', fontSize: '0.82rem',
            lineHeight: 1.65, marginTop: '0.4rem', maxWidth: '360px',
          }}>{project.description}</p>
        )}

        {isLarge && (
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                background: 'rgba(109,40,217,0.2)',
                color: '#A78BFA',
                border: '1px solid rgba(109,40,217,0.28)',
                fontSize: '0.6rem', letterSpacing: '0.08em',
                padding: '0.18rem 0.5rem', borderRadius: '2px',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Hover border glow (CSS handles via class) */}
      <div className="bento-card-border" style={{
        position: 'absolute', inset: 0,
        border: '1px solid transparent',
        borderRadius: '3px', pointerEvents: 'none',
        transition: 'border-color 0.35s',
      }} />
    </div>
  );
}

/* ─── Gallery ────────────────────────────────────────────────── */
export default function BentoProjectsGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    /* Desktop only — on mobile cards are just visible */
    if (!window.matchMedia('(min-width: 900px)').matches) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: '+=900',
        scrub: 1.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    /* Section label line draws in */
    tl.from('.bento-label-line', { scaleX: 0, transformOrigin: 'left', duration: 1.5 });
    tl.from('.bento-header-text', { y: 20, duration: 2 }, '-=1');
    tl.from('.bento-header-link', { x: 20, duration: 2 }, '-=1.5');

    /* Cards enter staggered — no opacity so they're always visible */
    tl.from('.bc-1', {
      scale: 0.9,
      duration: 5, ease: 'power2.out',
    }, '-=1');

    tl.from('.bc-2', {
      x: 80,
      duration: 3.5, ease: 'power2.out',
    }, '-=4');

    tl.from('.bc-3', {
      x: 80, y: -40,
      duration: 3.5, ease: 'power2.out',
    }, '-=3');

    tl.from('.bc-4', {
      y: 80,
      duration: 3.5, ease: 'power2.out',
    }, '-=3');

  }, { scope: sectionRef });

  const [p1, p2, p3, p4] = projects;

  return (
    <section
      ref={sectionRef}
      className="bento-section"
      style={{
        background: '#0C0A09',
        position: 'relative',
        zIndex: 1,
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto', width: '100%',
        padding: 'clamp(3rem, 5vw, 5rem) clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 2.5vw, 2rem)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        minHeight: 0,
      }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="bento-header-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}>
              <span className="bento-label-line" style={{ width: '30px', height: '2px', background: '#6D28D9', display: 'block' }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#A78BFA', fontWeight: 500 }}>
                Our Work
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: 700, textTransform: 'uppercase', color: '#F2EDE6',
            }}>Featured Projects</h2>
          </div>
          <Link href="/projects" className="bento-header-link" style={{
            border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(242,237,230,0.6)',
            fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.4rem',
            textDecoration: 'none', borderRadius: '2px', whiteSpace: 'nowrap',
            transition: 'border-color 0.2s, color 0.2s',
          }}>View All →</Link>
        </div>

        {/* ── Bento grid ── */}
        <div className="bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.75fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '10px',
          flex: 1,
          minHeight: 0,
        }}>
          {/* Card 1 — large portrait (left, both rows) */}
          <BentoCard
            project={p1}
            className="bc-1"
            style={{ gridColumn: '1', gridRow: '1 / 3' }}
            sizes="(max-width: 900px) 100vw, 42vw"
            variant="large"
          />

          {/* Card 2 — square top middle */}
          <BentoCard
            project={p2}
            className="bc-2"
            style={{ gridColumn: '2', gridRow: '1' }}
            sizes="(max-width: 900px) 100vw, 24vw"
          />

          {/* Card 3 — square top right */}
          <BentoCard
            project={p3}
            className="bc-3"
            style={{ gridColumn: '3', gridRow: '1' }}
            sizes="(max-width: 900px) 100vw, 24vw"
          />

          {/* Card 4 — wide landscape (bottom right, spans 2 cols) */}
          <BentoCard
            project={p4}
            className="bc-4"
            style={{ gridColumn: '2 / 4', gridRow: '2' }}
            sizes="(max-width: 900px) 100vw, 48vw"
            variant="wide"
          />
        </div>
      </div>
    </section>
  );
}
