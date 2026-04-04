import { projects } from '@/lib/data';
import ProjectsGrid from '@/components/ProjectsGrid';

export const metadata = {
  title: 'Our Projects — Civil & Structural Engineering Portfolio Uganda',
  description: 'Browse Tetra Design & Concepts\' portfolio of 200+ engineering projects in Uganda: residential developments, commercial complexes, civil infrastructure, bridges, and water treatment facilities.',
  alternates: { canonical: 'https://tetradesignandconcepts.com/projects' },
  openGraph: {
    title: 'Engineering Projects Portfolio | Tetra Design & Concepts Uganda',
    description: '200+ civil and structural engineering projects delivered across Uganda. View our portfolio of roads, buildings, bridges, and water systems.',
    url: 'https://tetradesignandconcepts.com/projects',
    images: [{ url: '/projects/kasanje.jpg', width: 1200, height: 630, alt: 'Tetra Projects Portfolio' }],
  },
};

const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

export default function ProjectsPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <section style={{
        padding: '120px 2rem 5rem',
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #E5E7EB',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-1rem', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: 'clamp(6rem, 15vw, 14rem)', fontWeight: 700,
          color: 'rgba(109,40,217,0.04)', lineHeight: 1,
          userSelect: 'none', whiteSpace: 'nowrap',
        }}>PROJECTS</div>

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '36px', height: '2px', background: '#6D28D9' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
              Our Work
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700, textTransform: 'uppercase',
            color: '#111827', lineHeight: 0.95, maxWidth: '500px',
          }}>
            Built to<br />
            <span style={{ color: '#6D28D9' }}>Last</span>
          </h1>
          <p style={{
            color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.75,
            maxWidth: '480px', marginTop: '1.25rem',
          }}>
            A selection of civil and structural engineering projects delivered across Uganda
            over 30 years of practice.
          </p>
        </div>
      </section>

      <ProjectsGrid projects={projects} categories={allCategories} />
    </div>
  );
}
