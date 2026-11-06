import React, { lazy, Suspense, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { riseIn, stagger } from '../lib/motion';

// three.js is heavy, so it loads after first paint and only when it can actually run.
const Hero3D = lazy(() => import('./Hero3D'));

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(false);

  useEffect(() => {
    if (reduce || !webglAvailable()) return undefined;
    // Wait for the browser to be idle so the hero text paints first.
    const id = window.requestIdleCallback ? window.requestIdleCallback(() => setScene(true)) : setTimeout(() => setScene(true), 200);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, [reduce]);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      {/* Aurora backdrop: always present, so the hero looks right even without WebGL */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -top-1/3 -left-1/4 w-[70%] h-[140%] rounded-full bg-[#0f62fe]/30 blur-[110px] animate-aurora" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[65%] h-[150%] rounded-full bg-[#8a3ffc]/25 blur-[120px] animate-aurora [animation-delay:-7s]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas" />
      </div>

      {scene && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
        >
          <SceneBoundary>
            <Suspense fallback={null}>
              <Hero3D />
            </Suspense>
          </SceneBoundary>
        </motion.div>
      )}

      <motion.div
        variants={stagger(0.12, 0.1)}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center px-4 pt-16 pb-24 sm:pt-24 sm:pb-36 pointer-events-none"
      >
        <motion.p variants={riseIn} className="text-xs sm:text-sm tracking-[0.3em] uppercase text-fg2">
          The Book Worm online store
        </motion.p>
        <motion.h1 id="hero-title" variants={riseIn} className="mt-4 text-4xl sm:text-6xl font-light leading-[1.05] tracking-tight">
          Find your next <span className="gradient-text font-semibold">great read</span>
        </motion.h1>
        <motion.p variants={riseIn} className="mt-5 text-fg2 text-base sm:text-lg max-w-xl mx-auto">
          Browse by category, pick a book, and have it at your door in days. Redeem gift points on every order.
        </motion.p>
        <motion.div variants={riseIn} className="mt-8 pointer-events-auto">
          <a href="#catalogue" className="btn-primary !text-white px-6 no-underline">
            Browse the catalogue <ArrowDown size={16} aria-hidden="true" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
