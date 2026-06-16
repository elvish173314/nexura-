import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  'Electronics', 'Mobile Phones', 'Laptops', 'Fashion', 'Shoes', 'Watches',
  'Home & Kitchen', 'Furniture', 'Books', 'Sports', 'Beauty & Personal Care',
  'Toys', 'Automotive', 'Grocery', 'Pet Supplies', 'Health & Fitness'
];

const BRANDS = ['Nexora', 'Aurora', 'Vortex', 'Lumen', 'Zenith', 'Equinox', 'Pulse', 'Nova', 'Cetaphil'];

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const pick = <T,>(a: T[], i: number) => a[i % a.length];
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

async function main() {
  console.log('Seeding Nexora...');
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.question.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();

  const brands = await Promise.all(
    BRANDS.map((name) => prisma.brand.create({ data: { name, slug: slug(name) } }))
  );

  for (let c = 0; c < CATEGORIES.length; c++) {
    const name = CATEGORIES[c];
    const category = await prisma.category.create({
      data: { name, slug: slug(name), image: img(`cat-${slug(name)}`) }
    });

    for (let p = 1; p <= 8; p++) {
      const brand = pick(brands, c + p);
      const base = 499 + ((c * 7 + p) % 40) * 350;
      const productName = `${brand.name} ${name} Series ${p}`;
      await prisma.product.create({
        data: {
          name: productName,
          slug: slug(`${productName}-${c}-${p}`),
          description: `Premium ${name} product engineered by ${brand.name}. Crafted with high-quality materials, modern design, and reliable performance for everyday excellence.`,
          price: base,
          comparePrice: Math.round(base * 1.35),
          images: [img(`${slug(name)}-${p}-1`), img(`${slug(name)}-${p}-2`), img(`${slug(name)}-${p}-3`)],
          stock: 5 + ((p * 13) % 60),
          rating: 3.6 + ((p * 3) % 14) / 10,
          numReviews: 12 + ((p * 7) % 400),
          specs: { Warranty: '1 Year', Color: pick(['Black','Silver','Blue','Gold'], p), Material: 'Premium' },
          isFeatured: p % 4 === 0,
          isTrending: p % 3 === 0,
          isBestSeller: p % 5 === 0,
          flashDeal: p % 6 === 0,
          categoryId: category.id,
          brandId: brand.id
        }
      });
    }

    if (name === 'Beauty & Personal Care') {
      const cetaphilBrand = brands.find((b) => b.slug === slug('Cetaphil'));
      if (cetaphilBrand) {
        await prisma.product.create({
          data: {
            name: 'Cetaphil Gentle Skin Hydrating Face Wash',
            slug: 'cetaphil-gentle-skin-hydrating-face-wash',
            description: 'Paraben-free, sulphate-free gentle cleanser with niacinamide and Vitamin B5 for dry to normal sensitive skin.',
            price: 399,
            comparePrice: 499,
            images: [img('cetaphil-facewash-1'), img('cetaphil-facewash-2'), img('cetaphil-facewash-3')],
            stock: 40,
            rating: 4.7,
            numReviews: 842,
            specs: {
              Size: '118ml',
              'Skin Type': 'Dry to Normal',
              'Free From': 'Paraben, Sulphate',
              'Key Ingredients': 'Niacinamide, Vitamin B5'
            },
            isFeatured: true,
            isTrending: true,
            isBestSeller: true,
            categoryId: category.id,
            brandId: cetaphilBrand.id
          }
        });
      }
    }

    console.log(`  + ${name} (8 products)`);
  }

  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: 'PERCENT', value: 10, minSpend: 999 },
      { code: 'NEXORA500', type: 'FLAT', value: 500, minSpend: 4999 },
      { code: 'FESTIVE20', type: 'PERCENT', value: 20, minSpend: 2999 }
    ]
  });

  await prisma.banner.createMany({
    data: [
      { title: 'The Future of Shopping', image: img('banner-1'), position: 1, link: '/products' },
      { title: 'Flash Deals Live Now', image: img('banner-2'), position: 2, link: '/products?filter=flash' },
      { title: 'Summer Sale 2026', image: img('banner-3'), position: 3, link: '/products' }
    ]
  });

  await prisma.setting.create({ data: { key: 'UPI_ID', value: 'nexora@upi' } });

  const adminPass = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@nexora.com' },
    update: {},
    create: { name: 'Nexora Admin', email: 'admin@nexora.com', passwordHash: adminPass, role: 'ADMIN' }
  });

  const userPass = await bcrypt.hash('User@123', 10);
  await prisma.user.upsert({
    where: { email: 'user@nexora.com' },
    update: {},
    create: { name: 'Demo User', email: 'user@nexora.com', passwordHash: userPass, role: 'USER' }
  });

  console.log('Seed complete. Admin: admin@nexora.com / Admin@123');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
