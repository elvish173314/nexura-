import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const form = await req.formData();
  const paymentId = String(form.get('paymentId'));
  const action = String(form.get('action'));
  const approve = action === 'approve';
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: approve ? 'APPROVED' : 'REJECTED', verifiedAt: new Date(), verifiedBy: session!.user!.email! }
  });
  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: approve ? 'CONFIRMED' : 'CANCELLED' }
  });
  return NextResponse.redirect(new URL('/admin', req.url));
}
