import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import Image from 'next/image';
import AdminProductManager from '@/components/AdminProductManager';
import AdminUPISettings from '@/components/AdminUPISettings';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') redirect('/login');

  const [productCount, orderCount, userCount, revenueAgg, pendingPayments, products, categories, brands, upiSetting] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.payment.findMany({ where: { status: 'SUBMITTED' }, include: { order: true }, take: 20 }),
    prisma.product.findMany({ include: { category: true, brand: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.setting.findUnique({ where: { key: 'UPI_ID' } })
  ]);

  const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-white/10 p-6"><div className="text-sm text-neutral-500">{label}</div><div className="mt-1 text-2xl font-black">{value}</div></div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="Products" value={productCount} />
        <Stat label="Orders" value={orderCount} />
        <Stat label="Users" value={userCount} />
        <Stat label="Revenue" value={formatINR(revenueAgg._sum.total ?? 0)} />
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Payment Verification</h2>
        <p className="text-sm text-neutral-500">Review uploaded UPI screenshots, then approve/reject.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {pendingPayments.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 p-4">
              <div className="font-mono text-sm">{p.order.orderNumber}</div>
              <div className="text-sm">{formatINR(p.amount)}</div>
              {p.screenshotUrl ? (
                <div className="relative mt-2 h-40 w-full overflow-hidden rounded-lg"><Image src={p.screenshotUrl} alt="screenshot" fill className="object-cover" /></div>
              ) : <p className="mt-2 text-xs text-neutral-500">No screenshot</p>}
              <form action="/api/admin/payments" method="post" className="mt-3 flex gap-2">
                <input type="hidden" name="paymentId" value={p.id} />
                <button name="action" value="approve" className="btn-primary !py-1.5 text-sm">Approve</button>
                <button name="action" value="reject" className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-400">Reject</button>
              </form>
            </div>
          ))}
          {pendingPayments.length === 0 && <p className="text-neutral-500">No pending payments.</p>}
        </div>
      </section>
      <AdminProductManager products={products} categories={categories} brands={brands} />
      <AdminUPISettings initialUpiId={upiSetting?.value ?? process.env.NEXT_PUBLIC_UPI_ID ?? 'nexora@upi'} />
      <p className="mt-10 text-sm text-neutral-500">TODO: order management, coupons, banners, analytics charts.</p>
    </div>
  );
}
