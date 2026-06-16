import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Nexora — The Future of Shopping',
  description: 'Premium futuristic multi-category e-commerce platform.',
  manifest: '/manifest.webmanifest',
  keywords: ['ecommerce', 'shopping', 'nexora', 'electronics', 'fashion'],
  openGraph: { title: 'Nexora', description: 'The Future of Shopping', type: 'website' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative overflow-x-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
        <Providers>
          <Navbar />
          <main className="relative min-h-screen z-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
