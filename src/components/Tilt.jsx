import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

/**
 * Wraps children in a card that tilts toward the pointer in 3D, with a moving glare.
 * Falls back to a plain wrapper for reduced motion and coarse (touch) pointers.
 */
export default function Tilt({ children, max = 9, className = '', glare = true }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${useTransform(sx, (v) => v * 100)}% ${useTransform(sy, (v) => v * 100)}%, rgba(255,255,255,0.28), transparent 55%)`;
  const glareOpacity = useMotionValue(0);

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative h-full will-change-transform"
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}
