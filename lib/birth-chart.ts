// The birth date was collected from the very first version of the quiz and then
// never read — BirthDateStep even promises the reader it adds "uma camada
// numerológica à sua leitura". This file makes that promise true.
//
// Everything here is derived, not stored: same date in, same reading out, no
// per-report cost and nothing to keep in sync with the database.
//
// Only the *derivation* lives here, because the sign label is shown for free in
// the echo. The paragraphs a reader pays to read are in lib/report-full.ts,
// which never reaches the browser.

export type ZodiacSign =
  | 'aries'
  | 'touro'
  | 'gemeos'
  | 'cancer'
  | 'leao'
  | 'virgem'
  | 'libra'
  | 'escorpiao'
  | 'sagitario'
  | 'capricornio'
  | 'aquario'
  | 'peixes';

type SignRange = { sign: ZodiacSign; label: string; from: [number, number] };

// Ordered by start date. Capricorn opens the list because it owns the turn of
// the year: any date before Aquarius starts belongs to it, on either side of
// January 1st, which is what makes a single "last range that started" lookup
// work without a wrap-around special case.
const SIGN_RANGES: SignRange[] = [
  { sign: 'capricornio', label: 'Capricórnio', from: [1, 1] },
  { sign: 'aquario', label: 'Aquário', from: [1, 20] },
  { sign: 'peixes', label: 'Peixes', from: [2, 19] },
  { sign: 'aries', label: 'Áries', from: [3, 21] },
  { sign: 'touro', label: 'Touro', from: [4, 20] },
  { sign: 'gemeos', label: 'Gêmeos', from: [5, 21] },
  { sign: 'cancer', label: 'Câncer', from: [6, 21] },
  { sign: 'leao', label: 'Leão', from: [7, 23] },
  { sign: 'virgem', label: 'Virgem', from: [8, 23] },
  { sign: 'libra', label: 'Libra', from: [9, 23] },
  { sign: 'escorpiao', label: 'Escorpião', from: [10, 23] },
  { sign: 'sagitario', label: 'Sagitário', from: [11, 22] },
  { sign: 'capricornio', label: 'Capricórnio', from: [12, 22] },
];

function parseIsoBirthDate(isoDate: string): { year: number; month: number; day: number } | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return undefined;
  const [, rawYear, rawMonth, rawDay] = match;
  const year = Number(rawYear);
  const month = Number(rawMonth);
  const day = Number(rawDay);
  // Round-trip through Date so 2001-02-30 is rejected rather than silently
  // rolling into March and handing back the wrong sign.
  const candidate = new Date(year, month - 1, day);
  if (candidate.getFullYear() !== year || candidate.getMonth() !== month - 1 || candidate.getDate() !== day) {
    return undefined;
  }
  return { year, month, day };
}

export function getZodiacSign(isoDate: string): { sign: ZodiacSign; label: string } | undefined {
  const parsed = parseIsoBirthDate(isoDate);
  if (!parsed) return undefined;

  let match = SIGN_RANGES[0];
  for (const range of SIGN_RANGES) {
    const [fromMonth, fromDay] = range.from;
    if (parsed.month > fromMonth || (parsed.month === fromMonth && parsed.day >= fromDay)) {
      match = range;
    }
  }
  return { sign: match.sign, label: match.label };
}

export function getLifePathNumber(isoDate: string): number | undefined {
  const parsed = parseIsoBirthDate(isoDate);
  if (!parsed) return undefined;

  let total = [...`${parsed.year}${parsed.month}${parsed.day}`].reduce((sum, digit) => sum + Number(digit), 0);
  while (total > 9) {
    total = [...`${total}`].reduce((sum, digit) => sum + Number(digit), 0);
  }
  return total;
}
