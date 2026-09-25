import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { projects, stats } from '@/lib/data';
import AnimatedHero from '@/components/AnimatedHero';
import ScrollReveal from '@/components/ScrollReveal';
import CountUpStat from '@/components/CountUpStat';
import Marquee from '@/components/Marquee';
import HeroBuildingLoader from '@/components/three/HeroBuildingLoader';
import BentoProjectsGallery from '@/components/BentoProjectsGallery';
import ServicesSection from '@/components/ServicesSection';
import Parallax from '@/components/Parallax';
import SectionNav from '@/components/SectionNav';

export const metadata: Metadata = {
  title: 'Civil & Structural Engineering Uganda | 30+ Years of Excellence',
  description:
    'Tetra Design & Concepts — Uganda\'s trusted civil and structural engineering firm since 1994. Delivering roads, bridges, buildings, and water infrastructure across Uganda.',
  alternates: { canonical: 'https://tetradesignandconcepts.com' },
};

export default function HomePage() {
  return (
    <>
      <SectionNav sections={[
        { id: 'hero', label: 'Home' },
        { id: 'services', label: 'Services' },
        { id: 'projects', label: 'Projects' },
        { id: 'why', label: 'Why Tetra' },
        { id: 'contact-cta', label: 'Contact' },
      ]} />

      {/* ── HERO ──────────────────────────────────────── */}
      <section id="hero" style={{
        height: '100svh', minHeight: '640px',
        position: 'relative', zIndex: 1,
        overflow: 'hidden', background: '#0C0A09',
      }}>
        {/* Blueprint grid texture on dark bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        {/* Right panel — Three.js wireframe building construction */}
        <div className="hero-image-panel" style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '45%',
          overflow: 'hidden',
        }}>
          <HeroBuildingLoader />
          {/* Soft left-edge blend into the dark text panel */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to right, #0C0A09 0%, rgba(12,10,9,0.1) 15%, transparent 40%)',
          }} />
        </div>

        {/* Left text panel */}
        <div className="hero-text-panel" style={{
          position: 'relative', zIndex: 2,
          height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(2rem, 4vw, 5rem)',
          paddingTop: '72px', paddingBottom: '3rem',
        }}>
          <AnimatedHero />
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: 'clamp(2rem, 4vw, 5rem)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div className="scroll-hint-arrow">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 9l5 5 5-5" stroke="rgba(230,220,208,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{
              fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(230,220,208,0.28)',
              textTransform: 'uppercase', fontFamily: 'var(--font-barlow), sans-serif',
            }}>Scroll</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Marquee />
      </div>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <section
        style={{
          background: '#F2EDE6',
          position: 'relative', zIndex: 1,
          borderTop: '3px solid #6D28D9',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}
        className="r-section-sm"
      >
        <div className="r-container r-grid-stats">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} direction="up">
              <CountUpStat value={stat.value} label={stat.label} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── SHOWREEL ──────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        <div className="showreel-ratio" style={{ position: 'relative', width: '100%', background: '#0C0A09' }}>
          <video autoPlay muted loop playsInline preload="metadata" poster="/video-poster.jpg" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }}>
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Parallax amount={140} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '36px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
                <span style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Showreel</span>
                <span style={{ width: '36px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
              </div>
              <h2 style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                fontWeight: 700, textTransform: 'uppercase',
                color: '#FFFFFF', textAlign: 'center', lineHeight: 1,
                padding: '0 1rem',
              }}>Engineering in Motion</h2>
            </Parallax>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#6D28D9' }} />
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────── */}
      <div id="services"><ServicesSection /></div>

      {/* ── FEATURED PROJECTS — scrubbed bento gallery ── */}
      <div id="projects"><BentoProjectsGallery /></div>

      {/* ── WHY TETRA ─────────────────────────────────── */}
      <section
        id="why"
        style={{ background: '#F2EDE6', position: 'relative', zIndex: 1 }}
        className="r-section"
      >
        <div className="r-container">
          <ScrollReveal direction="up" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '30px', height: '2px', background: '#6D28D9' }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>Why Choose Us</span>
            </div>
          </ScrollReveal>
          <div className="r-grid-why" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            {[
              { num: '01', title: 'On Time', body: 'We have a 100% on-time delivery record across 200+ projects. Schedules are commitments, not estimates.' },
              { num: '02', title: 'To Budget', body: 'Accurate cost estimation from day one. No surprise overruns. Your budget is respected.' },
              { num: '03', title: 'Fully Licensed', body: 'Fully registered and licensed engineers operating to the highest professional standards in Uganda.' },
              { num: '04', title: 'Local Expertise', body: 'Deep knowledge of Ugandan terrain, regulation, and construction practice built over 30 years.' },
            ].map((item, i) => (
              <ScrollReveal key={item.num} delay={i * 90} variant="scale">
                <div className="card-dark" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', padding: '2.5rem', height: '100%' }}>
                  <div style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '2rem', fontWeight: 700, color: 'rgba(109,40,217,0.1)', marginBottom: '0.75rem' }}>{item.num}</div>
                  <h3 style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', color: '#6D28D9', marginBottom: '0.65rem', letterSpacing: '0.06em' }}>{item.title}</h3>
                  <p style={{ color: '#6A707C', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVERTED MARQUEE ─────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Marquee inverted />
      </div>

      {/* ── CTA BAND ──────────────────────────────────── */}
      <section id="contact-cta" style={{
        background: '#6D28D9', textAlign: 'center',
        position: 'relative', zIndex: 1, overflow: 'hidden',
        padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.025) 20px, rgba(255,255,255,0.025) 21px)',
        }} />
        <ScrollReveal direction="up" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              fontWeight: 700, textTransform: 'uppercase',
              color: '#FFFFFF', marginBottom: '1rem',
            }}>
              Ready to Build Something Exceptional?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '2.5rem', fontFamily: 'var(--font-barlow), sans-serif' }}>
              Bring your construction project to life with Uganda&apos;s most experienced engineering team.
            </p>
            <Link href="/contact" className="tdc-btn tdc-btn--invert">
              Start Your Project
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
