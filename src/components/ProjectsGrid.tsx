'use client';

import { useState } from 'react';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string | null;
  tags: string[];
};

type Props = {
  projects: Project[];
  categories: string[];
};

export default function ProjectsGrid({ projects, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      {/* ── FILTER BAR ───────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0.9rem 2rem' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: '0.75rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#9CA3AF',
          }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </span>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: cat === activeCategory ? '1px solid #6D28D9' : '1px solid transparent',
                  padding: '0 0 2px 0',
                  fontSize: '0.78rem',
                  color: cat === activeCategory ? '#6D28D9' : '#9CA3AF',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  fontWeight: cat === activeCategory ? 500 : 400,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  if (cat !== activeCategory) e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={e => {
                  if (cat !== activeCategory) e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ─────────────────────────────────── */}
      <section style={{ padding: '3rem 2rem 6rem', background: '#FAFAFA' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#9CA3AF' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>◇</div>
              <p style={{ fontFamily: 'var(--font-oswald), Oswald, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                No projects in this category
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}>
              {filtered.map((project, i) => (
                <div key={project.id} className="project-card" style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px', overflow: 'hidden',
                }}>
                  {/* Image */}
                  <div style={{
                    width: '100%', aspectRatio: '16/9',
                    position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${['#F5F3FF', '#EDE9FE', '#F3F4F6'][i % 3]} 0%, ${['#EDE9FE', '#DDD6FE', '#E5E7EB'][i % 3]} 100%)`,
                  }}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <>
                        <div style={{
                          position: 'absolute', inset: 0,
                          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(109,40,217,${0.03 + (i % 3) * 0.01}) 12px, rgba(109,40,217,${0.03 + (i % 3) * 0.01}) 13px)`,
                        }} />
                        <div style={{
                          position: 'absolute', bottom: '-0.5rem', right: '1rem',
                          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                          fontSize: '4.5rem', fontWeight: 700, color: 'rgba(109,40,217,0.1)', lineHeight: 1,
                        }}>{String(i + 1).padStart(2, '0')}</div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.25">
                            <rect x="8" y="20" width="32" height="22" stroke="#6D28D9" strokeWidth="1.5" fill="none" />
                            <rect x="16" y="8" width="16" height="12" stroke="#6D28D9" strokeWidth="1.5" fill="none" />
                            <rect x="12" y="28" width="6" height="6" stroke="#6D28D9" strokeWidth="1" fill="none" />
                            <rect x="22" y="28" width="6" height="6" stroke="#6D28D9" strokeWidth="1" fill="none" />
                            <line x1="24" y1="8" x2="24" y2="4" stroke="#6D28D9" strokeWidth="1.5" />
                            <line x1="4" y1="42" x2="44" y2="42" stroke="#6D28D9" strokeWidth="2" />
                          </svg>
                        </div>
                      </>
                    )}
                    <div style={{
                      position: 'absolute', top: '0.75rem', left: '0.75rem',
                      background: '#6D28D9', color: '#fff',
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                      padding: '0.2rem 0.6rem', borderRadius: '2px', zIndex: 1,
                    }}>{project.year}</div>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
                        {project.category}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{project.location}</span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '1.1rem', fontWeight: 600,
                      textTransform: 'uppercase', color: '#111827', marginBottom: '0.65rem',
                    }}>{project.title}</h3>

                    <p style={{ color: '#6B7280', fontSize: '0.84rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                      {project.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          background: '#F5F3FF', color: '#6D28D9',
                          border: '1px solid #DDD6FE',
                          fontSize: '0.62rem', letterSpacing: '0.08em',
                          padding: '0.15rem 0.5rem', borderRadius: '2px', textTransform: 'uppercase',
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
