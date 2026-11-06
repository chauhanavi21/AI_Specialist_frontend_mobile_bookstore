import React from 'react';
import { motion } from 'framer-motion';
import { riseIn } from '../lib/motion';

/** Fades and lifts its children into view once, when they scroll on screen. */
export default function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag
      variants={riseIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}
