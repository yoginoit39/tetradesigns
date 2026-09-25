'use client';

import dynamic from 'next/dynamic';

const StructureViewer = dynamic(
  () => import('./StructureViewer'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '420px',
        background: 'radial-gradient(ellipse at 50% 40%, #16121F 0%, #0C0A09 70%)',
        border: '1px solid rgba(109,40,217,0.22)',
        borderRadius: '4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '28px', height: '28px',
          border: '2px solid rgba(109,40,217,0.25)',
          borderTopColor: '#6D28D9',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      </div>
    ),
  }
);

export default function StructureViewerLoader() {
  return <StructureViewer />;
}
