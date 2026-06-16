'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  const dark = theme === 'dark';
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="h-9 w-9 rounded-lg border border-white/15 grid place-items-center hover:bg-white/10 transition"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
