# Nexora — The Future of Shopping

A premium, futuristic, multi-category e-commerce platform built entirely with **free & open-source** technology. Designed to feel like a blend of Amazon, Flipkart, Apple, and a modern luxury brand.

## ✨ Tech Stack

| Layer | Tech |
|------|------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS, glassmorphism, dark/light mode (next-themes) |
| Animation | Framer Motion, GSAP |
| 3D | Three.js via React Three Fiber + drei |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth (Credentials + Google OAuth) |
| State | Zustand (cart, persisted) |
| Payments | **Manual UPI** (QR + UPI ID + screenshot upload) & **COD** — no gateways |

## 🚀 Getting Started

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env
#   - DATABASE_URL  -> free Postgres (Neon / Supabase / Railway)
#   - NEXTAUTH_SECRET -> openssl rand -base64 32
#   - GOOGLE_CLIENT_ID / SECRET (optional, free)
#   - NEXT_PUBLIC_UPI_ID -> your UPI id for manual payments

# 3. Create schema + seed sample catalog (16 categories, 128 products)
npm run db:push
npm run db:seed

# 4. Run
npm run dev   # http://localhost:3000
```

### Demo accounts (after seeding)
- **Admin:** `admin@nexora.com` / `Admin@123`
- **User:** `user@nexora.com` / `User@123`

## 🆓 Free Deployment
- **App:** Vercel (free tier)
- **DB:** Neon / Supabase / Railway free Postgres
- **Screenshots/storage:** Supabase Storage or UploadThing free tier

No Stripe, no Razorpay, no paid OTP/AI/courier APIs.

## 🗂️ Project Structure
```
prisma/            schema.prisma + seed.ts (all entities, sample data)
src/
  app/             App Router pages + API routes
    api/           auth, register, orders, admin/payments
    products/      listing (filters/sort) + [slug] detail
    cart, checkout, login, register, account, admin
  components/      Navbar, Footer, Hero3D, ProductCard, Gallery, ...
  lib/             prisma, auth, utils
  store/           cart (zustand)
public/            manifest.webmanifest (PWA)
```

## ✅ Implemented in this foundation
- Full **Prisma schema**: users, products, categories, brands, orders, order items, payments, coupons, gift cards, reviews, Q&A, addresses, wishlist, cart, recently-viewed, notifications, banners, return requests.
- **Seed data**: 16 categories × 8 products (128), 8 brands, coupons, banners, admin + demo user.
- **Auth**: credentials + Google, registration API, role-based admin guard.
- **Storefront**: 3D animated hero, featured categories, flash deals, trending, best sellers, newsletter; dark/light toggle; sticky glass navbar.
- **Catalog**: product listing with category/brand/price/rating filters + sort (price/rating/newest); search.
- **Product page**: gallery with hover-zoom, specs, reviews, related products, stock; add-to-cart / buy-now.
- **Cart**: persisted, quantity edit, totals.
- **Checkout**: manual **UPI** (auto-generated QR + UPI ID + screenshot URL) and **COD**; creates order + payment.
- **Orders**: user order history with status.
- **Admin**: dashboard stats (products/orders/users/revenue) + **payment verification** (view screenshot, approve/reject → updates order status).
- **PWA**: web manifest + SEO metadata.

## 🛣️ Roadmap (clearly-marked TODOs in code)
- Persisted wishlist / compare / recently-viewed / save-for-later APIs
- File upload for payment screenshots (Supabase Storage / UploadThing free)
- 360° product viewer (R3F model), product videos
- Full admin CRUD: products, inventory, orders, coupons, banners, returns/refunds, analytics charts
- Coupons & gift cards at checkout; invoice PDF generation
- Address management, order tracking timeline, notification center
- i18n, web push notifications, parallax/particle background polish

> This is a production-ready **foundation**: architecture, schema, auth, seeded catalog, core storefront + checkout + admin work end-to-end. Advanced features are scaffolded with TODOs to iterate on.
