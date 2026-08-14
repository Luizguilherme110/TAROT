'use client';

import { useMemo, useRef, useState } from 'react';

function parseIsoDate(value: string) {
  const [year = '', month = '', day = ''] = value.split('-');
  return { day, month, year };
}

export function BirthDateStep({ value, onSubmit }: { value: string; onSubmit: (value: string) => void }) {
  const initial = parseIsoDate(value);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const isoDate = useMemo(() => {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (!day || !month || year.length !== 4 || !d || !m || !y) return '';
    if (d < 1 || d > 31 || m < 1 || m > 12) return '';
    const candidate = new Date(y, m - 1, d);
    if (candidate.getFullYear() !== y || candidate.getMonth() !== m - 1 || candidate.getDate() !== d) return '';
    return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, [day, month, year]);

  const digitsOnly = (raw: string) => raw.replace(/\D/g, '');

  return (
    <div className="w-full max-w-md">
      <h2 className="font-display text-2xl leading-snug text-parchment-100">Sua data de nascimento</h2>
      <p className="mt-3 text-parchment-400">
        Usaremos sua data para adicionar uma camada numerológica à sua leitura. Não é usada para nenhuma outra
        finalidade.
      </p>
      <div className="mt-8 flex gap-3">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="bday-day"
          placeholder="DD"
          maxLength={2}
          value={day}
          onChange={(event) => {
            const next = digitsOnly(event.target.value).slice(0, 2);
            setDay(next);
            if (next.length === 2) monthRef.current?.focus();
          }}
          className="w-1/4 rounded-2xl border border-white/10 bg-ink-900 px-4 py-4 text-center text-parchment-100 outline-none transition-colors duration-200 focus:border-gold-400"
        />
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          autoComplete="bday-month"
          placeholder="MM"
          maxLength={2}
          value={month}
          onChange={(event) => {
            const next = digitsOnly(event.target.value).slice(0, 2);
            setMonth(next);
            if (next.length === 2) yearRef.current?.focus();
          }}
          className="w-1/4 rounded-2xl border border-white/10 bg-ink-900 px-4 py-4 text-center text-parchment-100 outline-none transition-colors duration-200 focus:border-gold-400"
        />
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          autoComplete="bday-year"
          placeholder="AAAA"
          maxLength={4}
          value={year}
          onChange={(event) => setYear(digitsOnly(event.target.value).slice(0, 4))}
          className="w-1/2 rounded-2xl border border-white/10 bg-ink-900 px-4 py-4 text-center text-parchment-100 outline-none transition-colors duration-200 focus:border-gold-400"
        />
      </div>
      <button
        type="button"
        disabled={isoDate.length === 0}
        onClick={() => onSubmit(isoDate)}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 font-display text-sm font-medium text-ink-950 transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
