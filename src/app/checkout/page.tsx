'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatINR } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [method, setMethod] = useState<'UPI_MANUAL' | 'COD'>('UPI_MANUAL');
  const [screenshot, setScreenshot] = useState<string>('');
  const [placing, setPlacing] = useState(false);
  const [upiId, setUpiId] = useState<string>(process.env.NEXT_PUBLIC_UPI_ID || 'nexora@upi');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data?.upiId) setUpiId(data.upiId); })
      .catch(() => {});
  }, []);

  const amount = total();
  const upiLink = `upi://pay?pa=${upiId}&pn=Nexora&am=${amount}&cu=INR`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

  async function placeOrder() {
    setPlacing(true);
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, paymentMethod: method, screenshotUrl: screenshot })
    });
    setPlacing(false);
    if (res.ok) { clear(); router.push('/account/orders'); }
    else alert('Please log in to place an order.');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="rounded-xl border border-white/10 p-4">
        <div className="flex justify-between"><span>Total payable</span><span className="font-black">{formatINR(amount)}</span></div>
      </div>
      <div className="mt-6 space-y-4">
        <label className="flex items-center gap-2"><input type="radio" checked={method==='UPI_MANUAL'} onChange={() => setMethod('UPI_MANUAL')} /> UPI (Manual Verification)</label>
        <label className="flex items-center gap-2"><input type="radio" checked={method==='COD'} onChange={() => setMethod('COD')} /> Cash on Delivery</label>
      </div>
      {method === 'UPI_MANUAL' && (
        <div className="mt-4 rounded-xl border border-white/10 p-4 text-center">
          <p className="text-sm text-neutral-400">Scan to pay or use UPI ID:</p>
          <p className="font-mono font-semibold">{upiId}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="UPI QR" className="mx-auto mt-3 rounded-lg" />
          <p className="mt-3 text-sm">After paying, upload your payment screenshot URL:</p>
          <input value={screenshot} onChange={(e) => setScreenshot(e.target.value)} placeholder="Paste uploaded screenshot URL" className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
          <p className="mt-1 text-xs text-neutral-500">TODO: wire file upload to free storage (e.g. Supabase Storage / UploadThing free tier).</p>
        </div>
      )}
      <button disabled={placing} onClick={placeOrder} className="btn-primary mt-6 w-full">{placing ? 'Placing...' : 'Place Order'}</button>
    </div>
  );
}
