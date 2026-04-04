'use client';

import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  color: '#111827',
  fontFamily: 'var(--font-barlow), Barlow, sans-serif',
  fontSize: '0.9rem',
  padding: '0.85rem 1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  borderRadius: '3px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
  fontSize: '0.65rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#6B7280',
  display: 'block',
  marginBottom: '0.4rem',
};

const projectTypes = [
  'Civil Engineering',
  'Structural Engineering',
  'Geotechnical Investigation',
  'Project Management',
  'Roads & Transport',
  'Water Supply & Treatment',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to an API route
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        border: '1px solid #E5E7EB',
        padding: '3rem',
        textAlign: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px',
          background: '#6D28D9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-oswald), Oswald, sans-serif',
          fontSize: '1.5rem', fontWeight: 600,
          textTransform: 'uppercase', color: '#111827',
          marginBottom: '0.75rem',
        }}>Message Received</h3>
        <p style={{ color: '#78716C', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Thank you for reaching out. Our team will review your enquiry
          and get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
        fontSize: '1.5rem', fontWeight: 600,
        textTransform: 'uppercase', color: '#111827',
        marginBottom: '2rem', letterSpacing: '0.04em',
      }}>Send a Message</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Name + Email row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              style={{ ...inputStyle, borderColor: focused === 'name' ? '#6D28D9' : '#E5E7EB' }}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              style={{ ...inputStyle, borderColor: focused === 'email' ? '#6D28D9' : '#E5E7EB' }}
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Phone + Project type row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              style={{ ...inputStyle, borderColor: focused === 'phone' ? '#6D28D9' : '#E5E7EB' }}
              placeholder="+256 ..."
            />
          </div>
          <div>
            <label style={labelStyle}>Project Type</label>
            <select
              value={form.projectType}
              onChange={e => setForm({ ...form, projectType: e.target.value })}
              onFocus={() => setFocused('projectType')}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle,
                borderColor: focused === 'projectType' ? '#6D28D9' : '#E5E7EB',
                cursor: 'pointer',
              }}
            >
              <option value="">Select type...</option>
              {projectTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={labelStyle}>Project Description *</label>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            style={{
              ...inputStyle,
              borderColor: focused === 'message' ? '#6D28D9' : '#E5E7EB',
              resize: 'vertical',
              minHeight: '140px',
            }}
            placeholder="Describe your project — location, scale, timeline, specific requirements..."
          />
        </div>

        <button
          type="submit"
          style={{
            background: '#6D28D9',
            color: '#ffffff',
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontWeight: 600,
            fontSize: '0.85rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '1rem 2rem',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5B21B6')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6D28D9')}
        >
          Send Enquiry →
        </button>

        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', textAlign: 'center' }}>
          We respond within 24 hours on business days.
        </p>
      </form>
    </div>
  );
}
