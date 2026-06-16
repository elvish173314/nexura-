'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) { const d = await res.json(); setErr(d.error || 'Failed'); return; }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push('/account');
  }
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
        <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2" />
        <button className="btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
