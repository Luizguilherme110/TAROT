'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError('Senha incorreta.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink-950 px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-900 p-8">
        <h1 className="font-display text-xl text-parchment-100">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Senha"
          autoFocus
          className="mt-6 w-full rounded-full border border-white/10 bg-ink-950 px-4 py-3 text-parchment-100 placeholder:text-parchment-400/60 focus:border-gold-400/50 focus:outline-none"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gold-400 px-6 py-3 font-display text-sm font-medium text-ink-950 transition-opacity duration-200 disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
