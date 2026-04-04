import { siteConfig } from '@/lib/data';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us — Start Your Engineering Project',
  description: 'Get in touch with Tetra Design & Concepts for civil and structural engineering consultations in Uganda. Request a quote for your road, bridge, building, or water project.',
  alternates: { canonical: 'https://tetradesignandconcepts.com/contact' },
  openGraph: {
    title: 'Contact Tetra Design & Concepts | Engineering Consultations Uganda',
    description: 'Start your engineering project. Contact Uganda\'s leading civil and structural engineering firm for a free consultation and quote.',
    url: 'https://tetradesignandconcepts.com/contact',
  },
};

const contactDetails = [
  {
    label: 'Location', value: siteConfig.address,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#6D28D9" /></svg>,
  },
  {
    label: 'Phone', value: siteConfig.phone,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="#6D28D9" /></svg>,
  },
  {
    label: 'Email', value: siteConfig.email,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#6D28D9" /></svg>,
  },
];

export default function ContactPage() {
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
        }}>CONTACT</div>

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '36px', height: '2px', background: '#6D28D9' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#6D28D9', fontWeight: 500 }}>
              Get in Touch
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700, textTransform: 'uppercase',
            color: '#111827', lineHeight: 0.95,
          }}>
            Start Your<br />
            <span style={{ color: '#6D28D9' }}>Project</span>
          </h1>
          <p style={{
            color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.75,
            maxWidth: '460px', marginTop: '1.25rem',
          }}>
            Tell us about your engineering project. We respond within 24 hours
            with an initial assessment.
          </p>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────── */}
      <section style={{ padding: '4rem 2rem 6rem', background: '#FAFAFA' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem', alignItems: 'start',
        }}>
          {/* Contact details */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
              fontSize: '1.5rem', fontWeight: 600,
              textTransform: 'uppercase', color: '#111827',
              marginBottom: '2rem',
            }}>Contact Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              {contactDetails.map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px', height: '42px',
                    border: '1px solid #DDD6FE', background: '#F5F3FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, borderRadius: '4px',
                  }}>{icon}</div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                      fontSize: '0.65rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '0.25rem',
                    }}>{label}</div>
                    <div style={{ color: '#374151', fontSize: '0.9rem' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office hours */}
            <div style={{
              border: '1px solid #E5E7EB', background: '#FFFFFF',
              padding: '1.5rem', borderRadius: '4px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#6D28D9', marginBottom: '1rem',
              }}>Office Hours</h3>
              {[
                { day: 'Monday – Friday', time: '8:00 AM – 5:00 PM' },
                { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
                { day: 'Sunday', time: 'Closed' },
              ].map(({ day, time }) => (
                <div key={day} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6',
                }}>
                  <span style={{ color: '#6B7280', fontSize: '0.83rem' }}>{day}</span>
                  <span style={{ color: '#374151', fontSize: '0.83rem', fontWeight: 500 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
