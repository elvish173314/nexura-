import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { items, paymentMethod, screenshotUrl } = await req.json();
  if (!items?.length) return NextResponse.json({ error: 'Empty cart' }, { status: 400 });

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const order = await prisma.order.create({
    data: {
      orderNumber: 'NX' + Date.now().toString(36).toUpperCase(),
      userId: user.id,
      subtotal, total: subtotal,
      paymentMethod,
      status: paymentMethod === 'UPI_MANUAL' ? 'PAYMENT_REVIEW' : 'CONFIRMED',
      items: { create: items.map((i: any) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })) },
      payment: { create: { method: paymentMethod, amount: subtotal, screenshotUrl: screenshotUrl || null, status: paymentMethod === 'UPI_MANUAL' ? 'SUBMITTED' : 'PENDING' } }
    }
  });
  return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
}
