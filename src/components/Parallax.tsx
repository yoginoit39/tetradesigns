'use client';

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  amount?: number;      // px of vertical travel across the viewport pass
  className?: string;
  style?: React.CSSProperties;
};

/** Wrap anything to give it scroll-linked vertical parallax. */
export default function Parallax({ children, amount = 80, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(
      el,
      { y: -amount / 2 },
      {
        y: amount / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
