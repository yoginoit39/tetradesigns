'use client';

import dynamic from 'next/dynamic';

const HeroBuildingScene = dynamic(
  () => import('./HeroBuildingScene'),
  { ssr: false, loading: () => null },
);

export default function HeroBuildingLoader() {
  return <HeroBuildingScene />;
}
