'use client';

import Link from 'next/link';
import { navLinks, siteConfig } from '@/lib/data';

export default function Footer() {
  return (
    <footer style={{
      background: '#111827',
      borderTop: '1px solid #1F2937',
      padding: '4rem 2rem 2rem',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem', marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {/* Minimal TDC mark in footer */}
              <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
                <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#9CA3AF" strokeWidth="3" />
                <polygon points="40,16 64,40 40,64 16,40" fill="#6D28D9" opacity="0.85" />
                <line x1="24" y1="30" x2="36" y2="30" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="30" y1="30" x2="30" y2="48" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M37 30 L37 48 Q52 39 37 30" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M58 33 Q50 28 50 39 Q50 50 58 47" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.1em', color: '#F9FAFB',
              }}>TETRA DESIGN & CONCEPTS</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '250px' }}>
              Over 30 years of civil and structural engineering excellence in Uganda. Built to last.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '0.7rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#6D28D9', marginBottom: '1.25rem',
            }}>Navigation</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: '#6B7280', textDecoration: 'none', fontSize: '0.875rem',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D8B4FE')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                >{link.label}</Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '0.7rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#6D28D9', marginBottom: '1.25rem',
            }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Civil Engineering', 'Structural Engineering', 'Geotechnical Investigations', 'Project Management'].map(s => (
                <span key={s} style={{ color: '#6B7280', fontSize: '0.875rem' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '0.7rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#6D28D9', marginBottom: '1.25rem',
            }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[siteConfig.address, siteConfig.phone, siteConfig.email].map(v => (
                <span key={v} style={{ color: '#6B7280', fontSize: '0.875rem' }}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1F2937', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ color: '#374151', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Tetra Design & Concepts. All rights reserved.
          </span>
          <span style={{ color: '#374151', fontSize: '0.8rem' }}>
            Kampala, Uganda · Est. {siteConfig.founded}
          </span>
        </div>
      </div>
    </footer>
  );
}
