'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; label: string };

/** Fixed vertical dot navigation that tracks the section in view. */
export default function SectionNav({ sections }: { sections: Item[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const els = sections
      .map(s => document.getElementById(s.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;

    const io = new IntersectionObserver(
      entries => {
        // pick the most-visible intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav className="section-nav" aria-label="Section navigation" style={{
      position: 'fixed', right: '1.6rem', top: '50%', transform: 'translateY(-50%)',
      zIndex: 150, display: 'flex', flexDirection: 'column', gap: '0.9rem',
      alignItems: 'flex-end',
    }}>
      {sections.map(s => {
        const on = active === s.id;
        const show = hovered === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={on ? 'true' : undefined}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              textDecoration: 'none', justifyContent: 'flex-end',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 600,
              color: '#6D28D9',
              background: 'rgba(255,255,255,0.72)',
              padding: '0.25rem 0.5rem', borderRadius: '2px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              opacity: show ? 1 : 0,
              transform: show ? 'translateX(0)' : 'translateX(6px)',
              transition: 'opacity 0.3s, transform 0.3s',
              whiteSpace: 'nowrap', pointerEvents: 'none',
            }}>{s.label}</span>
            <span style={{
              width: on ? '12px' : '8px', height: on ? '12px' : '8px',
              borderRadius: '50%', flexShrink: 0,
              background: on ? '#6D28D9' : 'rgba(109,40,217,0.18)',
              border: `1.5px solid ${on ? '#6D28D9' : 'rgba(109,40,217,0.5)'}`,
              boxShadow: on ? '0 0 0 4px rgba(109,40,217,0.15)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </a>
        );
      })}
    </nav>
  );
}
