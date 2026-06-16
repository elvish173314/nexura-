'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatINR, discountPct } from '@/lib/utils';
import { useCart } from '@/store/cart';

export type ProductCardData = {
  id: string; slug: string; name: string; price: number;
  comparePrice?: number | null; images: string[]; rating: number; numReviews: number;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const add = useCart((s) => s.add);
  const off = discountPct(p.price, p.comparePrice);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -10, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 card-hover"
    >
      <Link href={`/products/${p.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image src={p.images[0]} alt={p.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
          {off > 0 && <span className="absolute left-2 top-2 rounded-md bg-nexora-600 px-2 py-1 text-xs text-white">{off}% OFF</span>}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${p.slug}`} className="line-clamp-1 font-medium hover:text-nexora-400">{p.name}</Link>
        <div className="mt-1 text-sm text-amber-400">★ {p.rating.toFixed(1)} <span className="text-neutral-500">({p.numReviews})</span></div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold">{formatINR(p.price)}</span>
          {p.comparePrice && <span className="text-sm text-neutral-500 line-through">{formatINR(p.comparePrice)}</span>}
        </div>
        <button
          onClick={() => add({ productId: p.id, name: p.name, price: p.price, image: p.images[0], quantity: 1 })}
          className="btn-primary mt-3 w-full !py-2 text-sm"
        >Add to Cart</button>
      </div>
    </motion.div>
  );
}
