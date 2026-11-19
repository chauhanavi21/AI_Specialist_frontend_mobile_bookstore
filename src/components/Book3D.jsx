import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import BookCover from './BookCover';

/**
 * A real 3D book built from CSS transforms: front cover, back cover, spine and page block.
 * Drag (or use the arrow keys) to spin it. It idles with a gentle sway until touched.
 */
export default function Book3D({ book, width = 260, height = 370, depth = 46 }) {
  const reduce = useReducedMotion();
  const ry = useMotionValue(-28);
  const rx = useMotionValue(8);
  const sry = useSpring(ry, { stiffness: 110, damping: 16 });
  const srx = useSpring(rx, { stiffness: 110, damping: 16 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const touched = useRef(false);

  // Idle sway until the user takes over
  useEffect(() => {
    if (reduce) return undefined;
    let raf;
    const tick = (t) => {
      if (!touched.current) ry.set(-28 + Math.sin(t / 1400) * 22);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, ry]);

  const down = (e) => {
    dragging.current = true;
    touched.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (!dragging.current) return;
    ry.set(ry.get() + (e.clientX - last.current.x) * 0.6);
    rx.set(Math.max(-35, Math.min(35, rx.get() - (e.clientY - last.current.y) * 0.4)));
    last.current = { x: e.clientX, y: e.clientY };
  };
  const up = () => { dragging.current = false; };
  const key = (e) => {
    touched.current = true;
    if (e.key === 'ArrowLeft') ry.set(ry.get() - 25);
    if (e.key === 'ArrowRight') ry.set(ry.get() + 25);
    if (e.key === 'ArrowUp') rx.set(Math.min(35, rx.get() + 10));
    if (e.key === 'ArrowDown') rx.set(Math.max(-35, rx.get() - 10));
  };

  const { bg } = book.cover;
  return (
    <div
      className="book3d-scene touch-none select-none cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 ring-link"
      style={{ width, height: height + 30 }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={key}
      tabIndex={0}
      role="img"
      aria-label={`3D model of ${book.title}. Drag or use the arrow keys to rotate.`}
    >
      <motion.div className="book3d relative mx-auto" style={{ width, height, rotateY: sry, rotateX: srx }}>
        {/* front cover */}
        <div style={{ width, height, transform: `translateZ(${depth / 2}px)` }} className="shadow-2xl">
          <BookCover book={book} />
        </div>
        {/* back cover */}
        <div
          style={{ width, height, transform: `rotateY(180deg) translateZ(${depth / 2}px)`, background: bg, filter: 'brightness(.8)' }}
          className="p-6 text-xs leading-relaxed"
        >
          <p className="italic opacity-90">“{book.blurb}”</p>
          <p className="mt-4 opacity-80">{book.tagline ?? book.genres.join(' · ')}</p>
          <div className="absolute bottom-6 left-6 bg-white h-12 w-28 grid place-items-center">
            <div className="h-7 w-24" style={{ background: 'repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 4px,#000 4px 5px,#fff 5px 8px)' }} />
          </div>
        </div>
        {/* spine */}
        <div
          style={{ width: depth, height, left: -depth / 2 + 0, transform: `rotateY(-90deg) translateZ(${depth / 2}px)`, background: bg, filter: 'brightness(.65)' }}
        />
        {/* page block (right side) */}
        <div
          style={{
            width: depth - 6, height: height - 8, top: 4, left: width - (depth - 6) / 2,
            transform: `rotateY(90deg) translateZ(${(depth - 6) / 2 - 2}px)`,
            background: 'repeating-linear-gradient(0deg,#f3ecd9 0 2px,#d9d0b8 2px 3px)',
          }}
        />
        {/* top and bottom edges */}
        <div style={{ width, height: depth - 6, top: -(depth - 6) / 2 + 2, transform: `rotateX(90deg) translateZ(${(depth - 6) / 2 - 2}px)`, background: '#e4dcc4' }} />
        <div style={{ width, height: depth - 6, bottom: -(depth - 6) / 2 + 2, transform: `rotateX(-90deg) translateZ(${(depth - 6) / 2 - 2}px)`, background: '#cfc6ac' }} />
      </motion.div>
      {/* soft floor shadow */}
      <div aria-hidden="true" className="mx-auto mt-3 h-4 rounded-[50%] bg-black/50 blur-lg" style={{ width: width * 0.8 }} />
    </div>
  );
}
