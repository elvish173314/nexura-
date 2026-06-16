'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/store/cart';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { data: session } = useSession();
  const count = useCart((s) => s.count());
  const [q, setQ] = useState('');
  return (
    <motion.header initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut' }} className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-2xl font-black tracking-tight gradient-text">NEXORA</Link>
        <form action="/products" className="hidden flex-1 md:block">
          <input
            name="q" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search premium products..."
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 outline-none focus:border-nexora-500"
          />
        </form>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/products" className="hover:text-nexora-400">Shop</Link>
          <Link href="/wishlist" className="hover:text-nexora-400">Wishlist</Link>
          <Link href="/cart" className="relative hover:text-nexora-400">
            Cart
            {count > 0 && <span className="absolute -right-3 -top-2 rounded-full bg-nexora-600 px-1.5 text-xs text-white">{count}</span>}
          </Link>
          {session?.user ? (
            <>
              {(session.user as any).role === 'ADMIN' && <Link href="/admin" className="hover:text-nexora-400">Admin</Link>}
              <Link href="/account" className="hover:text-nexora-400">Account</Link>
              <button onClick={() => signOut()} className="hover:text-nexora-400">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !px-4 !py-1.5">Login</Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}
