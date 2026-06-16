'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setErr('Invalid email or password'); else router.push('/account');
  }
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
        <button className="btn-primary w-full">Login</button>
      </form>
      <button onClick={() => signIn('google', { callbackUrl: '/account' })} className="mt-3 w-full rounded-xl border border-white/20 py-2.5 hover:bg-white/10">Continue with Google</button>
      <p className="mt-4 text-sm text-neutral-500">No account? <Link href="/register" className="text-nexora-400">Register</Link></p>
    </div>
  );
}
