'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * App Router template re-mounts on every navigation, so this gives each
 * route a smooth crossfade in. Opacity only — a transform here would create
 * a containing block and break the fixed dot-nav / progress bar.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    // Reset to top on every route change (through Lenis when active)
    const w = window as unknown as { __lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void } };
    if (w.__lenis) w.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Recompute scroll-trigger positions for the freshly mounted page
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
