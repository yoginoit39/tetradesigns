import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';

const oswald = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-oswald',
  display: 'swap',
});

const barlow = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-barlow',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tetradesignandconcepts.com'),
  title: {
    default: 'Tetra Design & Concepts | Civil & Structural Engineering Uganda',
    template: '%s | Tetra Design & Concepts',
  },
  description:
    'Leading civil and structural engineering firm in Kampala, Uganda. Over 30 years delivering roads, bridges, buildings, water systems, and geotechnical services — on time and to budget.',
  keywords: [
    'civil engineering Uganda',
    'structural engineering Kampala',
    'construction company Uganda',
    'geotechnical investigations Uganda',
    'engineering firm Kampala',
    'roads bridges Uganda',
    'water treatment Uganda',
    'Tetra Design Concepts',
    'project management Uganda',
    'foundation engineering',
  ],
  authors: [{ name: 'Tetra Design & Concepts', url: 'https://tetradesignandconcepts.com' }],
  creator: 'Tetra Design & Concepts',
  publisher: 'Tetra Design & Concepts',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: 'https://tetradesignandconcepts.com',
    siteName: 'Tetra Design & Concepts',
    title: 'Tetra Design & Concepts | Civil & Structural Engineering Uganda',
    description:
      'Over 30 years of engineering excellence in Uganda. Roads, bridges, buildings, and water systems — delivered on time and to budget.',
    images: [
      {
        url: '/projects/kasanje.jpg',
        width: 1200,
        height: 630,
        alt: 'Tetra Design & Concepts — Engineering Projects Uganda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tetra Design & Concepts | Civil Engineering Uganda',
    description:
      'Leading civil and structural engineering firm in Kampala, Uganda. 30+ years. 200+ projects.',
    images: ['/projects/kasanje.jpg'],
  },
  alternates: { canonical: 'https://tetradesignandconcepts.com' },
  verification: {
    google: 'your-google-verification-code', // replace when ready
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Tetra Design & Concepts',
  url: 'https://tetradesignandconcepts.com',
  logo: 'https://tetradesignandconcepts.com/projects/kasanje.jpg',
  description:
    'Civil and structural engineering firm in Kampala, Uganda. Over 30 years experience delivering infrastructure on time and to budget.',
  foundingDate: '1994',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kampala',
    addressCountry: 'UG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 0.3476,
    longitude: 32.5825,
  },
  telephone: '+256000000000',
  email: 'info@tetradesignandconcepts.com',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  serviceType: [
    'Civil Engineering', 'Structural Engineering',
    'Geotechnical Investigations', 'Project Management',
    'Foundation Engineering', 'Road Design',
  ],
  areaServed: { '@type': 'Country', name: 'Uganda' },
  priceRange: '$$',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${oswald.variable} ${barlow.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#6D28D9" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <CustomCursor />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
