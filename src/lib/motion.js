// Shared animation presets so every screen moves the same way.

export const spring = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 };
export const softSpring = { type: 'spring', stiffness: 140, damping: 22 };
export const ease = [0.22, 1, 0.36, 1]; // easeOutQuint-ish

/** Route transition: fade + rise in, quick fade out. */
export const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeIn' } },
};

/** Parent that staggers its children as they enter. */
export const stagger = (delay = 0.06, start = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
});

export const riseIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};
