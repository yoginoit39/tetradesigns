'use client';

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function ScrollReveal({
  children, delay = 0, direction = 'up', distance = 36, className, style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const y = direction === 'up' ? distance : 0;

    gsap.from(el, {
      opacity: 0,
      x,
      y,
      duration: 0.85,
      delay: delay / 1000,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
