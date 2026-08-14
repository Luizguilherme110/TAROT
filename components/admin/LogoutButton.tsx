'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-white/10 px-4 py-2 text-sm text-parchment-400 transition-colors duration-200 hover:border-gold-400/40 hover:text-parchment-100"
    >
      Sair
    </button>
  );
}
