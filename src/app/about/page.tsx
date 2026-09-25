import { stats, services, siteConfig } from '@/lib/data';
import StructureViewerLoader from '@/components/three/StructureViewerLoader';
import LightBackdrop from '@/components/LightBackdrop';

export const metadata = {
  title: 'About Us — Engineering Excellence Since 1994',
  description: 'Tetra Design & Concepts has delivered civil and structural engineering across Uganda since 1994. Learn about our history, values, and commitment to quality infrastructure.',
  alternates: { canonical: 'https://tetradesignandconcepts.com/about' },
  openGraph: {
    title: 'About Tetra Design & Concepts | Uganda Engineering Since 1994',
    description: '30+ years of civil and structural engineering excellence in Uganda. Discover our story, expertise, and team.',
    url: 'https://tetradesignandconcepts.com/about',
  },
};

const values = [
  { title: 'Precision', desc: 'Every calculation, every design, every deliverable is held to the highest engineering standard.' },
  { title: 'Integrity', desc: 'Transparent timelines, honest cost estimates, and no surprises. We say what we mean.' },
  { title: 'Experience', desc: '30+ years of projects across Uganda means we have seen every challenge — and solved it.' },
  { title: 'Community', desc: 'Infrastructure changes lives. We are proud to build for the people of Uganda.' },
];

export default function AboutPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <LightBackdrop />

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <section style={{
        paddingTop: '120px', padding: '120px 2rem 5rem',
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #E5E7EB',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Faint watermark */}
        <div style={{
          position: 'absolute', right: '-1rem', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: 'clamp(6rem, 15vw, 14rem)', fontWeight: 700,
          color: 'rgba(109,40,217,0.04)', lineHeight: 1,
          userSelect: 'none', whiteSpace: 'nowrap',
        }}>ABOUT</div>

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '36px', height: '2px', background: '#6D28D9' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
              Who We Are
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700, textTransform: 'uppercase',
            color: '#111827', lineHeight: 0.95, maxWidth: '600px',
          }}>
            Engineering<br />
            <span style={{ color: '#6D28D9' }}>Excellence</span><br />
            Since 1994
          </h1>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem', alignItems: 'start',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600,
                textTransform: 'uppercase', color: '#111827', marginBottom: '1.5rem',
              }}>Our Story</h2>
              <p style={{ color: '#374151', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                Founded in 1994 and headquartered in the heart of Kampala, Tetra Design & Concepts
                has grown from a focused engineering consultancy into one of Uganda&apos;s most trusted
                civil and structural engineering firms.
              </p>
              <p style={{ color: '#6B7280', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                Over three decades, we have delivered water supply systems to remote communities,
                engineered bridges across challenging terrains, designed multi-storey commercial
                buildings in the capital, and managed complex infrastructure projects from inception
                to completion.
              </p>
              <p style={{ color: '#6B7280', lineHeight: 1.85, fontSize: '0.95rem' }}>
                Our approach is simple: deep technical expertise, honest client relationships,
                and an unwavering commitment to delivering on time and to budget.
              </p>
            </div>

            <div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1px', background: '#E5E7EB', border: '1px solid #E5E7EB',
                marginBottom: '2rem', borderRadius: '4px', overflow: 'hidden',
              }}>
                {stats.map(stat => (
                  <div key={stat.label} style={{ background: '#FAFAFA', padding: '2rem', textAlign: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '2.2rem', fontWeight: 700, color: '#6D28D9',
                      marginBottom: '0.35rem',
                    }}>{stat.value}</div>
                    <div style={{
                      fontSize: '0.7rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: '#9CA3AF',
                    }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{
                border: '1px solid #DDD6FE', background: '#F5F3FF',
                padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
                borderRadius: '4px',
              }}>
                <div style={{
                  width: '36px', height: '36px', background: '#6D28D9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '2px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#fff" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                    fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#4C1D95', marginBottom: '0.3rem',
                  }}>Based in Kampala, Working Across Uganda</div>
                  <p style={{ color: '#6D28D9', fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.8 }}>
                    Deployed across urban and rural projects throughout Uganda, from the capital to
                    remote regions requiring essential infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: '#F8F7FF', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ width: '30px', height: '2px', background: '#6D28D9' }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
                What Drives Us
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
              textTransform: 'uppercase', color: '#111827',
            }}>Our Values</h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem',
          }}>
            {values.map((v, i) => (
              <div key={v.title} className="card-hover" style={{
                background: '#FFFFFF', border: '1px solid #E5E7EB',
                padding: '2rem', borderRadius: '4px', position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '2.5rem', fontWeight: 700,
                  color: 'rgba(109,40,217,0.08)', lineHeight: 1, marginBottom: '0.75rem',
                }}>0{i + 1}</div>
                <h3 style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '1.1rem', fontWeight: 600,
                  textTransform: 'uppercase', color: '#6D28D9',
                  marginBottom: '0.65rem', letterSpacing: '0.06em',
                }}>{v.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRUCTURAL SHOWCASE ───────────────────────── */}
      <section style={{
        padding: '5rem 2rem',
        background: '#0C0C0C',
        borderTop: '1px solid rgba(109,40,217,0.2)',
        borderBottom: '1px solid rgba(109,40,217,0.2)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem', alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ width: '30px', height: '2px', background: '#6D28D9', display: 'block' }} />
                <span style={{
                  fontSize: '0.7rem', letterSpacing: '0.25em',
                  textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500,
                }}>Structural Analysis</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
                textTransform: 'uppercase', color: '#FFFFFF',
                marginBottom: '1.5rem', lineHeight: 0.95,
              }}>
                Engineering<br />
                <span style={{ color: '#6D28D9' }}>Precision</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                Every structure we design undergoes rigorous three-dimensional analysis. Our structural
                engineers apply advanced computational methods to ensure every beam, column, and joint
                performs to specification — in Uganda&apos;s demanding climate and terrain.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                From multi-storey complexes to long-span bridges, structural integrity is non-negotiable.
              </p>
            </div>

            <StructureViewerLoader />
          </div>
        </div>
      </section>

      {/* ── EXPERTISE ─────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ width: '30px', height: '2px', background: '#6D28D9' }} />
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
                Capabilities
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700,
              textTransform: 'uppercase', color: '#111827',
            }}>Our Expertise</h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem',
          }}>
            {services.map((service) => (
              <div key={service.id} className="border-hover" style={{
                border: '1px solid #E5E7EB', padding: '2rem', borderRadius: '4px',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: '1rem', fontWeight: 600,
                  textTransform: 'uppercase', color: '#111827',
                  marginBottom: '1rem', letterSpacing: '0.06em',
                }}>{service.title}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {service.items.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6B7280', fontSize: '0.83rem' }}>
                      <span style={{ width: '5px', height: '5px', background: '#6D28D9', borderRadius: '50%', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
