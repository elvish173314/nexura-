'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { formatINR } from '@/lib/utils';

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  if (items.length === 0)
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><Link href="/products" className="btn-primary mt-6 inline-block">Start Shopping</Link></div>;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 rounded-xl border border-white/10 p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg"><Image src={i.image} alt={i.name} fill className="object-cover" /></div>
            <div className="flex-1"><div className="font-medium">{i.name}</div><div className="text-sm text-neutral-500">{formatINR(i.price)}</div></div>
            <input type="number" min={1} value={i.quantity} onChange={(e) => setQty(i.productId, Number(e.target.value))} className="w-16 rounded-lg border border-white/15 bg-white/5 px-2 py-1" />
            <div className="w-24 text-right font-semibold">{formatINR(i.price * i.quantity)}</div>
            <button onClick={() => remove(i.productId)} className="text-red-400 hover:underline">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 p-4">
        <span className="text-lg">Subtotal</span>
        <span className="text-2xl font-black">{formatINR(total())}</span>
      </div>
      <Link href="/checkout" className="btn-primary mt-4 inline-block w-full text-center">Proceed to Checkout</Link>
    </div>
  );
}
