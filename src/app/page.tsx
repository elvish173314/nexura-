import { prisma } from '@/lib/prisma';
import { Hero3D } from '@/components/Hero3D';
import { ProductCard } from '@/components/ProductCard';
import { SectionReveal } from '@/components/SectionReveal';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function section(where: any) {
  return prisma.product.findMany({ where, take: 8, orderBy: { createdAt: 'desc' } });
}

export default async function Home() {
  const [trending, bestSellers, flash, categories, banners] = await Promise.all([
    section({ isTrending: true }),
    section({ isBestSeller: true }),
    section({ flashDeal: true }),
    prisma.category.findMany({ take: 16 }),
    prisma.banner.findMany({ where: { active: true }, orderBy: { position: 'asc' } })
  ]);

  const BannerRow = ({ items }: { title?: string; items: any[] }) => (
    <SectionReveal className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((banner) => (
          <Link key={banner.id} href={banner.link ?? '/products'} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-1">
            <div className="relative h-52 w-full">
              <Image src={banner.image} alt={banner.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">Summer Sale</p>
              <h3 className="text-xl font-bold text-white">{banner.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </SectionReveal>
  );

  const Row = ({ title, items }: { title: string; items: any[] }) => (
    <SectionReveal className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <Link href="/products" className="text-sm text-nexora-400 hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} p={p as any} />)}
      </div>
    </SectionReveal>
  );

  return (
    <>
      <Hero3D />
      <SectionReveal className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">Featured Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link key={c.id} href={`/products?category=${c.slug}`} className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center card-hover">
              {c.image && <div className="relative mx-auto mb-2 h-16 w-16 overflow-hidden rounded-full"><Image src={c.image} alt={c.name} fill className="object-cover" /></div>}
              <div className="text-xs font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </SectionReveal>
      <BannerRow items={banners} />
      <Row title="⚡ Flash Deals" items={flash} />
      <Row title="🔥 Trending Now" items={trending} />
      <Row title="🏆 Best Sellers" items={bestSellers} />
      <SectionReveal className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="glass rounded-3xl p-10">
          <h2 className="text-3xl font-bold">Join the Nexora Newsletter</h2>
          <p className="mt-2 text-neutral-400">Exclusive deals, early access, and premium drops.</p>
          <form className="mx-auto mt-6 flex max-w-md gap-2">
            <input placeholder="your@email.com" className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3" />
            <button className="btn-primary">Subscribe</button>
          </form>
        </div>
      </SectionReveal>
    </>
  );
}
