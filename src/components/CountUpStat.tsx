'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = { value: string; label: string; dark?: boolean };

function parseTarget(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export default function CountUpStat({ value, label, dark }: Props) {
  const { num, suffix } = parseTarget(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: num,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => setDisplay(Math.round(obj.val)),
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-oswald), Oswald, sans-serif',
        fontWeight: 700, fontSize: '3rem', color: '#6D28D9',
        lineHeight: 1, marginBottom: '0.4rem', letterSpacing: '-0.02em',
      }}>
        {display}{suffix}
      </div>
      <div style={{
        fontSize: '0.68rem', letterSpacing: '0.18em',
        textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
      }}>{label}</div>
    </div>
  );
}
