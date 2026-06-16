'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function SectionReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
