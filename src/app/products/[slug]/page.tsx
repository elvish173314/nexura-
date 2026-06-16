import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { AddToCartButtons } from '@/components/AddToCartButtons';
import { formatINR, discountPct } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { brand: true, category: true, reviews: { include: { user: true } }, questions: { include: { user: true } } }
  });
  if (!product) return notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } }, take: 4
  });

  const off = discountPct(product.price, product.comparePrice);
  const specs = (product.specs as Record<string, string>) ?? {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <div className="text-sm text-nexora-400">{product.brand?.name} · {product.category.name}</div>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 text-amber-400">★ {product.rating.toFixed(1)} ({product.numReviews} reviews)</div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-black">{formatINR(product.price)}</span>
            {product.comparePrice && <span className="text-lg text-neutral-500 line-through">{formatINR(product.comparePrice)}</span>}
            {off > 0 && <span className="rounded-md bg-nexora-600 px-2 py-1 text-sm text-white">{off}% OFF</span>}
          </div>
          <p className="mt-2 text-sm">{product.stock > 0 ? <span className="text-emerald-400">In stock ({product.stock})</span> : <span className="text-red-400">Out of stock</span>}</p>
          <p className="mt-4 text-neutral-400">{product.description}</p>
          <AddToCartButtons product={{ id: product.id, name: product.name, price: product.price, image: product.images[0] }} />
          <div className="mt-8">
            <h3 className="font-semibold">Specifications</h3>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/10 py-1"><dt className="text-neutral-500">{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Reviews &amp; Ratings</h2>
        {product.reviews.length === 0 && <p className="mt-2 text-neutral-500">No reviews yet.</p>}
        <div className="mt-4 space-y-3">
          {product.reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 p-4">
              <div className="text-amber-400">{'★'.repeat(r.rating)}</div>
              <p className="mt-1 text-sm">{r.comment}</p>
              <p className="mt-1 text-xs text-neutral-500">{r.user.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} p={p as any} />)}
        </div>
      </section>
    </div>
  );
}
