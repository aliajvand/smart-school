import { describe, it, expect } from 'vitest';
import {
  formatFaNumber,
  formatFaPercent,
  formatFaCompact,
  formatFaScore,
  formatLtrTimestamp,
} from './formatters';

describe('formatters', () => {
  it('formats Persian integers correctly', () => {
    expect(formatFaNumber(128)).toBe('۱۲۸');
    expect(formatFaNumber(0)).toBe('۰');
    expect(formatFaNumber(450)).toBe('۴۵۰');
    expect(formatFaNumber(null)).toBe('—');
    expect(formatFaNumber(undefined)).toBe('—');
  });

  it('formats Persian percentages with ٪ sign', () => {
    expect(formatFaPercent(98)).toBe('۹۸٪');
    expect(formatFaPercent(100)).toBe('۱۰۰٪');
    expect(formatFaPercent(0)).toBe('۰٪');
    expect(formatFaPercent(88)).toBe('۸۸٪');
  });

  it('formats compact Persian numbers (thousands)', () => {
    expect(formatFaCompact(12500)).toContain('۱۲٫۵');
    expect(formatFaCompact(12500)).toContain('هزار');
    expect(formatFaCompact(450)).toBe('۴۵۰');
  });

  it('formats canonical exam scores with separator', () => {
    expect(formatFaScore(95, 100)).toBe('۹۵ / ۱۰۰');
    expect(formatFaScore(20, 20)).toBe('۲۰ / ۲۰');
  });

  it('formats LTR audio timestamps mm:ss', () => {
    expect(formatLtrTimestamp(194)).toBe('03:14');
    expect(formatLtrTimestamp(1730)).toBe('28:50');
    expect(formatLtrTimestamp(0)).toBe('00:00');
  });
});
