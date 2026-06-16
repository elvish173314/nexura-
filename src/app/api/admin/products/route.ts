import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: Number(body.price),
      comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
      images: Array.isArray(body.images) ? body.images : [],
      stock: Number(body.stock),
      rating: Number(body.rating),
      numReviews: Number(body.numReviews),
      specs: body.specs ?? null,
      isFeatured: Boolean(body.isFeatured),
      isTrending: Boolean(body.isTrending),
      isBestSeller: Boolean(body.isBestSeller),
      flashDeal: Boolean(body.flashDeal),
      categoryId: body.categoryId,
      brandId: body.brandId || undefined
    }
  });

  return NextResponse.json(product);
}
