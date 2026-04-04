'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ConstructionScene = dynamic(
  () => import('./ConstructionScene'),
  { ssr: false, loading: () => null }
);

/**
 * Fixed canvas behind all page content.
 * GSAP ScrollTrigger (scrub: 1.5) drives scrollRef — giving smooth,
 * cinema-quality scrubbing rather than raw window.scrollY jumps.
 */
export default function ConstructionSceneLoader() {
  const scrollRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate(self) {
        scrollRef.current = self.progress;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <ConstructionScene scrollRef={scrollRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
