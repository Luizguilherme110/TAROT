'use client';

import { useState } from 'react';

export function BirthDateStep({ value, onSubmit }: { value: string; onSubmit: (value: string) => void }) {
  const [date, setDate] = useState(value);
  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">Sua data de nascimento</h2>
      <p className="mt-3 text-parchment-400">
        Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra
        finalidade.
      </p>
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="mt-8 w-full rounded-2xl border border-white/10 bg-ink-900 px-5 py-4 text-parchment-100 outline-none transition-colors duration-200 focus:border-gold-400"
      />
      <button
        type="button"
        disabled={date.length === 0}
        onClick={() => onSubmit(date)}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
