'use client';

import { services } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

export default function ServicesSection() {
  return (
    <section
      style={{ background: '#0C0A09', position: 'relative', zIndex: 1 }}
      className="r-section"
    >
      {/* Subtle blueprint grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(109,40,217,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,0.04) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      <div className="r-container" style={{ position: 'relative' }}>

        {/* ── Header ── */}
        <ScrollReveal direction="up">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ width: '30px', height: '2px', background: '#6D28D9' }} />
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#A78BFA', fontWeight: 500 }}>
                  What We Do
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700, textTransform: 'uppercase', color: '#F2EDE6',
              }}>Our Services</h2>
            </div>
            <p style={{ color: 'rgba(242,237,230,0.4)', fontSize: '0.82rem', maxWidth: '280px', lineHeight: 1.7 }}>
              Four decades of Uganda infrastructure — every discipline, one team.
            </p>
          </div>
        </ScrollReveal>

        {/* ── 2×2 card grid ── */}
        <div
          className="services-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          {services.map((service, i) => (
            <ScrollReveal
              key={service.id}
              delay={i * 80}
              direction="up"
              style={{ height: '100%' }}
            >
              <div
                className="service-card-v2"
                style={{
                  background: '#111010',
                  padding: 'clamp(1.75rem, 3vw, 2.75rem)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Left accent bar (revealed on hover via CSS) */}
                <div className="svc-bar" style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                  background: '#6D28D9',
                }} />

                {/* Number badge + line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-oswald), sans-serif',
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                    color: '#6D28D9',
                    background: 'rgba(109,40,217,0.1)',
                    border: '1px solid rgba(109,40,217,0.22)',
                    padding: '0.18rem 0.55rem', borderRadius: '2px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ flex: 1, height: '1px', background: 'rgba(109,40,217,0.18)' }} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
                  fontWeight: 700, textTransform: 'uppercase',
                  color: '#F2EDE6', letterSpacing: '0.03em', lineHeight: 1.05,
                  marginBottom: '1rem',
                }}>
                  {service.title}
                </h3>

                {/* Description */}
                <p style={{
                  color: 'rgba(242,237,230,0.42)',
                  fontSize: '0.83rem', lineHeight: 1.85,
                  marginBottom: '1.5rem',
                }}>
                  {service.description}
                </p>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' }} />

                {/* Items */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '0.45rem 1.25rem', flex: 1,
                }}>
                  {service.items.map(item => (
                    <div key={item} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      color: 'rgba(242,237,230,0.58)', fontSize: '0.78rem',
                    }}>
                      <span style={{
                        width: '4px', height: '4px', flexShrink: 0,
                        background: '#6D28D9', borderRadius: '50%',
                      }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
