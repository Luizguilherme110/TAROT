import { describe, it, expect } from 'vitest';
import { getLifePathNumber, getZodiacSign } from '../birth-chart';

describe('getZodiacSign', () => {
  it('reads the sign from the month and day', () => {
    expect(getZodiacSign('1994-07-30')?.label).toBe('Leão');
    expect(getZodiacSign('1988-11-05')?.label).toBe('Escorpião');
  });

  it('places both ends of the year in Capricorn', () => {
    expect(getZodiacSign('1990-12-25')?.sign).toBe('capricornio');
    expect(getZodiacSign('1990-01-05')?.sign).toBe('capricornio');
  });

  it('puts a boundary date in the sign that starts that day', () => {
    expect(getZodiacSign('2000-03-21')?.label).toBe('Áries');
    expect(getZodiacSign('2000-03-20')?.label).toBe('Peixes');
  });

  it('returns undefined for a missing or malformed date', () => {
    expect(getZodiacSign('')).toBeUndefined();
    expect(getZodiacSign('30/07/1994')).toBeUndefined();
  });

  it('rejects a date that does not exist rather than rolling it into the next month', () => {
    expect(getZodiacSign('2001-02-30')).toBeUndefined();
  });
});

describe('getLifePathNumber', () => {
  it('reduces the digits of the whole date to a single digit', () => {
    // 1994-07-30 -> 1+9+9+4+7+3+0 = 33 -> 3+3 = 6
    expect(getLifePathNumber('1994-07-30')).toBe(6);
  });

  it('always lands between 1 and 9', () => {
    for (const date of ['1999-12-31', '2000-01-01', '1975-06-15', '1988-08-08']) {
      const number = getLifePathNumber(date);
      expect(number).toBeGreaterThanOrEqual(1);
      expect(number).toBeLessThanOrEqual(9);
    }
  });

  it('returns undefined for an unusable date', () => {
    expect(getLifePathNumber('')).toBeUndefined();
  });
});
