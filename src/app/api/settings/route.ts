import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: 'UPI_ID' } });
  return NextResponse.json({ upiId: setting?.value ?? 'nexora@upi' });
}
