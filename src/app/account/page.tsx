import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Hi, {session.user.name}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/account/orders" className="rounded-xl border border-white/10 p-6 card-hover">My Orders</Link>
        <Link href="/wishlist" className="rounded-xl border border-white/10 p-6 card-hover">Wishlist</Link>
        <Link href="/account" className="rounded-xl border border-white/10 p-6 card-hover">Addresses (TODO)</Link>
      </div>
    </div>
  );
}
