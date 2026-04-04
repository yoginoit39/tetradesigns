'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/data';

function TDCLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#9CA3AF" strokeWidth="3" />
      <polygon points="40,16 64,40 40,64 16,40" fill="#6D28D9" opacity="0.9" />
      <clipPath id="inner-clip">
        <polygon points="40,16 64,40 40,64 16,40" />
      </clipPath>
      <g clipPath="url(#inner-clip)" opacity="0.25">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="16" y1={20 + i * 4} x2="64" y2={20 + i * 4} stroke="#fff" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={20 + i * 4} y1="16" x2={20 + i * 4} y2="64" stroke="#fff" strokeWidth="0.5" />
        ))}
      </g>
      <line x1="24" y1="30" x2="36" y2="30" stroke="#E8EDF5" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="30" x2="30" y2="48" stroke="#E8EDF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M37 30 L37 48 Q52 39 37 30" stroke="#E8EDF5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M58 33 Q50 28 50 39 Q50 50 58 47" stroke="#E8EDF5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isHero = pathname === '/';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        background: menuOpen ? 'transparent' : (scrolled || !isHero ? '#F2EDE6' : 'transparent'),
        borderBottom: scrolled || !isHero ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 1.5rem', height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 201 }}>
            <TDCLogo size={40} />
            <div>
              <div style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700, fontSize: '1rem',
                color: isHero && !scrolled && !menuOpen ? '#F2EDE6' : '#0C0A09',
                letterSpacing: '0.08em', lineHeight: 1,
                transition: 'color 0.3s',
              }}>TETRA</div>
              <div style={{
                fontFamily: 'var(--font-barlow), Barlow, sans-serif',
                fontSize: '0.55rem', color: '#6D28D9',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>Design & Concepts</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="nav-desktop">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link" style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 500, fontSize: '0.85rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none',
                color: pathname === link.href ? '#A78BFA' : (isHero && !scrolled ? 'rgba(230,220,208,0.75)' : '#3C4250'),
                transition: 'color 0.3s',
                position: 'relative',
              }}>
                {link.label}
                {pathname === link.href && (
                  <span style={{
                    position: 'absolute', bottom: '-4px',
                    left: 0, right: 0, height: '2px',
                    background: '#6D28D9', borderRadius: '1px',
                  }} />
                )}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary" style={{
              background: '#6D28D9', color: '#fff',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontWeight: 600, fontSize: '0.8rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.6rem 1.4rem', textDecoration: 'none', borderRadius: '2px',
            }}>Get a Quote</Link>
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', padding: '0.5rem',
              position: 'relative', zIndex: 201,
            }}
            className="nav-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div style={{ width: '26px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', height: '2px', background: '#6D28D9',
                  borderRadius: '2px',
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0) opacity(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </div>
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: '#F2EDE6',
        display: 'flex', flexDirection: 'column',
        padding: '88px 1.75rem 3rem',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        overflowY: 'auto',
      }}>
        {/* Menu links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0' }}>
          {navLinks.map((link, i) => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontWeight: 700, fontSize: 'clamp(2rem, 8vw, 3rem)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              textDecoration: 'none', display: 'block',
              color: pathname === link.href ? '#6D28D9' : '#0A0C12',
              padding: '0.9rem 0',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              transition: `opacity 0.4s ease ${menuOpen ? 0.1 + i * 0.07 : 0}s, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${menuOpen ? 0.1 + i * 0.07 : 0}s`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateX(0)' : 'translateX(-24px)',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#6D28D9'; e.currentTarget.style.paddingLeft = '0.5rem'; }}
              onMouseLeave={e => { e.currentTarget.style.color = pathname === link.href ? '#6D28D9' : '#0A0C12'; e.currentTarget.style.paddingLeft = '0'; }}
            >
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.22)', marginRight: '0.75rem' }}>
                0{i + 1}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom CTA + info */}
        <div style={{
          marginTop: '2.5rem',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.4s ease ${menuOpen ? 0.4 : 0}s, transform 0.4s ease ${menuOpen ? 0.4 : 0}s`,
        }}>
          <Link href="/contact" style={{
            display: 'block', background: '#6D28D9', color: '#fff',
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '1rem 2rem',
            textDecoration: 'none', textAlign: 'center', borderRadius: '2px',
            marginBottom: '2rem',
          }}>Get a Free Quote</Link>
          <div style={{
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '0.72rem', color: '#8A90A0', fontFamily: 'var(--font-barlow), Barlow, sans-serif' }}>
              Est. 1994 · Kampala, Uganda
            </span>
            <span style={{ fontSize: '0.72rem', color: '#8A90A0', fontFamily: 'var(--font-barlow), Barlow, sans-serif' }}>
              info@tetradesignandconcepts.com
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-hamburger { display: none !important; }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
