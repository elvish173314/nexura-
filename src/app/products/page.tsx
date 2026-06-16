import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type SP = { [k: string]: string | undefined };

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const { q, category, brand, min, max, rating, sort, filter } = searchParams;

  const where: any = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (category) where.category = { slug: category };
  if (brand) where.brand = { slug: brand };
  if (rating) where.rating = { gte: Number(rating) };
  if (filter === 'flash') where.flashDeal = true;
  if (min || max) where.price = { gte: Number(min || 0), lte: Number(max || 9_999_999) };

  const orderBy =
    sort === 'price_asc' ? { price: 'asc' as const }
    : sort === 'price_desc' ? { price: 'desc' as const }
    : sort === 'rating' ? { rating: 'desc' as const }
    : { createdAt: 'desc' as const };

  const [products, categories, brands] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: 60 }),
    prisma.category.findMany(),
    prisma.brand.findMany()
  ]);

  return (
    <div className="mx-auto max-w-7xl gap-8 px-4 py-8 md:grid md:grid-cols-[260px_1fr]">
      <aside className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">Categories</h3>
          <div className="flex flex-wrap gap-2 md:flex-col">
            {categories.map((c) => (
              <Link key={c.id} href={`/products?category=${c.slug}`} className="text-sm text-neutral-400 hover:text-nexora-400">{c.name}</Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Sort</h3>
          <div className="flex flex-col gap-1 text-sm text-neutral-400">
            <Link href="?sort=newest">Newest</Link>
            <Link href="?sort=price_asc">Price: Low to High</Link>
            <Link href="?sort=price_desc">Price: High to Low</Link>
            <Link href="?sort=rating">Top Rated</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold">Brands</h3>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <Link key={b.id} href={`/products?brand=${b.slug}`} className="rounded-md border border-white/15 px-2 py-1 text-xs hover:bg-white/10">{b.name}</Link>
            ))}
          </div>
        </div>
      </aside>
      <div>
        <h1 className="mb-6 text-2xl font-bold">{q ? `Results for "${q}"` : 'All Products'} <span className="text-sm text-neutral-500">({products.length})</span></h1>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.id} p={p as any} />)}
        </div>
        {products.length === 0 && <p className="text-neutral-500">No products match your filters.</p>}
      </div>
    </div>
  );
}
