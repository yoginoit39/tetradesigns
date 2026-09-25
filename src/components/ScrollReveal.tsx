'use client';

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Variant = 'slide' | 'clip' | 'scale';

type Props = {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  distance?: number;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
};

export default function ScrollReveal({
  children, delay = 0, direction = 'up', distance = 48, variant = 'slide', className, style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show immediately, no animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clipPath: 'none', scale: 1 });
      return;
    }

    const st = {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    };

    if (variant === 'clip') {
      // Headline wipe-in from bottom
      gsap.from(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        y: distance * 0.5,
        duration: 1.0,
        delay: delay / 1000,
        ease: 'power4.out',
        scrollTrigger: st,
      });
      return;
    }

    if (variant === 'scale') {
      gsap.from(el, {
        opacity: 0,
        scale: 0.9,
        y: distance * 0.4,
        duration: 1.0,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: st,
      });
      return;
    }

    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const y = direction === 'up' ? distance : 0;

    gsap.from(el, {
      opacity: 0,
      x,
      y,
      duration: 0.9,
      delay: delay / 1000,
      ease: 'power3.out',
      scrollTrigger: st,
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
