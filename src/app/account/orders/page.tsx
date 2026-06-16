import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { formatINR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const orders = await prisma.order.findMany({ where: { userId: user!.id }, include: { items: true, payment: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      {orders.length === 0 && <p className="text-neutral-500">No orders yet.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-white/10 p-4">
            <div className="flex justify-between"><span className="font-mono">{o.orderNumber}</span><span className="rounded-md bg-nexora-600/20 px-2 py-1 text-xs text-nexora-300">{o.status}</span></div>
            <div className="mt-2 text-sm text-neutral-400">{o.items.length} item(s) · {formatINR(o.total)} · {o.paymentMethod}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
