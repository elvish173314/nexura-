'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';

type P = { id: string; name: string; price: number; image: string };

export function AddToCartButtons({ product }: { product: P }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const line = { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 };
  return (
    <div className="mt-6 flex gap-3">
      <button onClick={() => add(line)} className="btn-primary flex-1">Add to Cart</button>
      <button onClick={() => { add(line); router.push('/checkout'); }} className="flex-1 rounded-xl border border-white/20 px-5 py-2.5 font-medium hover:bg-white/10">Buy Now</button>
    </div>
  );
}
