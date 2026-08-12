'use client';

import { useState } from 'react';

export function NameStep({ value, onSubmit }: { value: string; onSubmit: (value: string) => void }) {
  const [name, setName] = useState(value);
  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">
        Antes de continuarmos, como você gostaria de ser chamado(a) na sua leitura?
      </h2>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value.slice(0, 60))}
        placeholder="Seu nome ou apelido"
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 placeholder:text-parchment-400/60 focus:border-gold-400"
      />
      <button
        type="button"
        disabled={name.trim().length === 0}
        onClick={() => onSubmit(name.trim())}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
