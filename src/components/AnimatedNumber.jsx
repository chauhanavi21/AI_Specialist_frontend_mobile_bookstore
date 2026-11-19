import React, { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

/** Counts smoothly from the previous value to the new one. `format` turns a number into text. */
export default function AnimatedNumber({ value, format = String, className = '' }) {
  const ref = useRef(null);
  const from = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduce) {
      node.textContent = format(value);
      from.current = value;
      return undefined;
    }
    const controls = animate(from.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(Math.round(v));
      },
      onComplete: () => {
        from.current = value;
      },
    });
    return () => {
      controls.stop();
      from.current = value;
    };
  }, [value, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{format(value)}</span>;
}
