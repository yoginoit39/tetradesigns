'use client';

import dynamic from 'next/dynamic';

const StructureViewer = dynamic(
  () => import('./StructureViewer'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '420px',
        background: 'linear-gradient(155deg, #040918 0%, #080F28 60%, #050818 100%)',
        border: '1px solid rgba(109,40,217,0.18)',
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
