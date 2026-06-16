'use client';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const heroWords = ['Shopping', 'Luxury', 'Fashion', 'Deals'];

function Orb() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1.4, 64, 64]}>
        <MeshDistortMaterial color="#6366f1" distort={0.45} speed={2} roughness={0.1} metalness={0.8} />
      </Sphere>
    </Float>
  );
}

// Particle Component
function Particle({ x, y, duration }: { x: number; y: number; duration: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ x, y, opacity: 0.8, scale: 1 }}
      animate={{ y: y - 100, opacity: 0, scale: 0 }}
      transition={{ duration, ease: 'easeOut' }}
    >
      <div className="w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-sm" />
    </motion.div>
  );
}

export function Hero3D() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; duration: number }>>([]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex((current) => (current + 1) % heroWords.length);
    }, 2800);
    return () => clearInterval(wordTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * 0.7,
        duration: 2 + Math.random() * 1,
      };
      setParticles((prev) => [...prev, newParticle].slice(-20));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={1.2} />
          <Orb />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} />
        </Canvas>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} duration={p.duration} />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: 30 },
          show: { opacity: 1, y: 0, transition: { staggerChildren: 0.16, delayChildren: 0.1 } }
        }}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4"
      >
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          className="text-5xl font-black md:text-7xl"
        >
          The Future of{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="gradient-text inline-block"
            >
              {heroWords[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="mt-5 max-w-xl text-lg text-neutral-300"
        >
          16 categories. Thousands of premium products. A luxury experience built for 2026.
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            <Link href="/products" className="btn-primary">Shop Now</Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            <Link href="/products?filter=flash" className="rounded-xl border border-white/20 px-5 py-2.5 hover:bg-white/10">Flash Deals</Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
