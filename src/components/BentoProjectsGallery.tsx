'use client';

import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

/* ─── Card ────────────────────────────────────────────────────── */
function BentoCard({
  project,
  style,
  sizes,
  variant = 'default',
  delay = 0,
}: {
  project: (typeof projects)[0];
  style: React.CSSProperties;
  sizes: string;
  variant?: 'large' | 'wide' | 'default';
  delay?: number;
}) {
  const isLarge = variant === 'large';
  const isWide  = variant === 'wide';

  return (
    <ScrollReveal delay={delay} direction="up" style={{ ...style, position: 'relative' }}>
      <div
        className="project-card-dark"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '3px',
          background: '#0F0D0C',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '100%',
          minHeight: isLarge ? '420px' : '200px',
        }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
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

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: isLarge
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.92) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(0,0,0,0.88) 100%)',
        }} />

        {/* Year badge */}
        <div style={{
          position: 'absolute', top: '0.8rem', left: '0.8rem',
          background: '#6D28D9', color: '#fff',
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
          padding: '0.18rem 0.55rem', borderRadius: '2px', zIndex: 1,
        }}>{project.year}</div>

        {/* Text */}
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
            lineHeight: 1.1, marginBottom: isLarge ? '0.65rem' : 0,
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
                  background: 'rgba(109,40,217,0.2)', color: '#A78BFA',
                  border: '1px solid rgba(109,40,217,0.28)',
                  fontSize: '0.6rem', letterSpacing: '0.08em',
                  padding: '0.18rem 0.5rem', borderRadius: '2px',
                }}>{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Hover border glow */}
        <div className="bento-card-border" style={{
          position: 'absolute', inset: 0,
          border: '1px solid transparent', borderRadius: '3px', pointerEvents: 'none',
          transition: 'border-color 0.35s',
        }} />
      </div>
    </ScrollReveal>
  );
}

/* ─── Gallery ────────────────────────────────────────────────── */
export default function BentoProjectsGallery() {
  const [p1, p2, p3, p4] = projects;

  return (
    <section
      className="bento-section"
      style={{
        background: '#0C0A09',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto', width: '100%',
        padding: 'clamp(4rem, 6vw, 6rem) clamp(1.25rem, 2.5vw, 2rem)',
        display: 'flex', flexDirection: 'column', gap: '2rem',
      }}>

        {/* Header */}
        <ScrollReveal direction="up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}>
                <span style={{ width: '30px', height: '2px', background: '#6D28D9', display: 'block' }} />
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
            <Link href="/projects" style={{
              border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(242,237,230,0.6)',
              fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.4rem',
              textDecoration: 'none', borderRadius: '2px', whiteSpace: 'nowrap',
              transition: 'border-color 0.2s, color 0.2s',
            }}>View All →</Link>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="bento-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.75fr 1fr 1fr',
          gridTemplateRows: 'auto',
          gap: '10px',
        }}>
          <BentoCard project={p1} style={{ gridColumn: '1', gridRow: '1 / 3' }} sizes="(max-width: 900px) 100vw, 42vw" variant="large" delay={0} />
          <BentoCard project={p2} style={{ gridColumn: '2', gridRow: '1' }} sizes="(max-width: 900px) 100vw, 24vw" delay={80} />
          <BentoCard project={p3} style={{ gridColumn: '3', gridRow: '1' }} sizes="(max-width: 900px) 100vw, 24vw" delay={160} />
          <BentoCard project={p4} style={{ gridColumn: '2 / 4', gridRow: '2' }} sizes="(max-width: 900px) 100vw, 48vw" variant="wide" delay={240} />
        </div>
      </div>
    </section>
  );
}
