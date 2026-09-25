'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

/**
 * Floating glass "pill" navigation: a detached frosted capsule with a
 * sliding indicator that glides under the active / hovered link. Shrinks
 * and gains a glow once the page is scrolled. Mobile keeps the full-screen
 * overlay menu.
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverHref, setHoverHref] = useState<string | null>(null);
  const [ind, setInd] = useState({ left: 0, width: 0, visible: false });
  const pathname = usePathname();

  const linksRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const lastY = useRef(0);

  /* Scrolled state + hide on scroll-down / reveal on scroll-up */
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      setScrolled(y > 40);
      if (y < 80) setHidden(false);                 // always show near the top
      else if (dy > 8) setHidden(true);             // scrolling down → tuck away
      else if (dy < -8) setHidden(false);           // scrolling up → float back
      if (Math.abs(dy) > 8) lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setHoverHref(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* Sliding indicator — follows hover, falls back to the active route */
  const target = hoverHref ?? pathname;
  const measure = useCallback(() => {
    const el = itemRefs.current[target];
    const c = linksRef.current;
    if (el && c) {
      const r = el.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      setInd({ left: r.left - cr.left, width: r.width, visible: true });
    } else {
      setInd(s => ({ ...s, visible: false }));
    }
  }, [target]);

  useEffect(() => {
    measure();
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <>
      <header className="nav-shell" aria-label="Primary">
        <div className={`nav-pill${scrolled ? ' nav-pill--scrolled' : ''}${menuOpen ? ' nav-pill--open' : ''}${hidden && !menuOpen ? ' nav-pill--hidden' : ''}`}>
          {/* Brand */}
          <Link href="/" className="nav-brand" aria-label="Tetra Design & Concepts — home">
            <TDCLogo size={32} />
            <span className="nav-wordmark">
              <span className="nav-wordmark-main">TETRA</span>
              <span className="nav-wordmark-sub">Design &amp; Concepts</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop nav-links" ref={linksRef} onMouseLeave={() => setHoverHref(null)}>
            <span
              className="nav-indicator"
              style={{ left: ind.left, width: ind.width, opacity: ind.visible ? 1 : 0 }}
              aria-hidden="true"
            />
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={el => { itemRefs.current[link.href] = el; }}
                  className={`nav-item${active ? ' nav-item--active' : ''}`}
                  onMouseEnter={() => setHoverHref(link.href)}
                  onFocus={() => setHoverHref(link.href)}
                  onBlur={() => setHoverHref(null)}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <span className="nav-desktop nav-divider" aria-hidden="true" />

          <Link href="/contact" className="nav-desktop nav-cta btn-primary">Get a Quote</Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="nav-burger">
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: '#F2EDE6',
        display: 'flex', flexDirection: 'column',
        padding: '96px 1.75rem 3rem',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        overflowY: 'auto',
      }}>
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

        <div style={{
          marginTop: '2.5rem',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.4s ease ${menuOpen ? 0.4 : 0}s, transform 0.4s ease ${menuOpen ? 0.4 : 0}s`,
        }}>
          <Link href="/contact" style={{
            display: 'block', background: '#6D28D9', color: '#fff',
            fontFamily: 'var(--font-barlow), sans-serif',
            fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', padding: '1rem 2rem',
            textDecoration: 'none', textAlign: 'center', borderRadius: '999px',
            marginBottom: '2rem',
          }}>Get a Free Quote</Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
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
        .nav-shell {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; justify-content: center;
          padding: 14px 16px 0;
          pointer-events: none;
        }
        .nav-pill {
          pointer-events: auto;
          display: flex; align-items: center; gap: 6px;
          padding: 8px 10px 8px 14px;
          border-radius: 999px;
          background: rgba(14, 12, 11, 0.62);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 8px 28px -14px rgba(0,0,0,0.55);
          transform: translateY(0);
          opacity: 1;
          transition: padding 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, background 0.35s, border-color 0.35s,
                      transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease;
        }
        .nav-pill--hidden {
          transform: translateY(-140%);
          opacity: 0;
          pointer-events: none;
        }
        .nav-pill--scrolled {
          padding: 6px 8px 6px 12px;
          background: rgba(14, 12, 11, 0.78);
          border-color: rgba(167,139,250,0.22);
          box-shadow: 0 14px 44px -14px rgba(0,0,0,0.7), 0 0 0 1px rgba(109,40,217,0.12), 0 0 40px -12px rgba(109,40,217,0.45);
        }
        .nav-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; padding-right: 6px; }
        .nav-wordmark { display: flex; flex-direction: column; line-height: 1; }
        .nav-wordmark-main {
          font-family: var(--font-oswald), Oswald, sans-serif;
          font-weight: 700; font-size: 0.92rem; letter-spacing: 0.1em; color: #F2EDE6;
        }
        .nav-wordmark-sub {
          font-family: var(--font-barlow), sans-serif;
          font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #A78BFA; margin-top: 3px;
        }
        .nav-links { position: relative; display: flex; align-items: center; gap: 2px; margin: 0 6px; }
        .nav-indicator {
          position: absolute; top: 0; bottom: 0;
          border-radius: 999px;
          background: rgba(109,40,217,0.32);
          box-shadow: inset 0 0 0 1px rgba(167,139,250,0.35);
          transition: left 0.42s cubic-bezier(0.16,1,0.3,1), width 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.25s;
          pointer-events: none;
        }
        .nav-item {
          position: relative; z-index: 1;
          padding: 9px 15px; border-radius: 999px;
          font-family: var(--font-barlow), sans-serif;
          font-weight: 500; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(242,237,230,0.66); text-decoration: none;
          transition: color 0.25s;
          white-space: nowrap;
        }
        .nav-item:hover, .nav-item--active { color: #F2EDE6; }
        .nav-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.1); margin: 0 6px; }
        .nav-cta {
          background: #6D28D9; color: #fff;
          font-family: var(--font-barlow), sans-serif;
          font-weight: 600; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 10px 18px; border-radius: 999px; text-decoration: none; white-space: nowrap;
        }
        .nav-hamburger {
          background: none; border: none; padding: 8px; margin-left: 2px;
          border-radius: 999px; display: none;
        }
        .nav-burger { width: 22px; display: flex; flex-direction: column; gap: 5px; }
        .nav-burger span {
          display: block; height: 2px; background: #C4B5FD; border-radius: 2px;
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s;
        }
        .nav-desktop { display: flex; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-pill { padding: 6px 8px 6px 12px; }
          .nav-shell { padding-top: 10px; }
        }
      `}</style>
    </>
  );
}
