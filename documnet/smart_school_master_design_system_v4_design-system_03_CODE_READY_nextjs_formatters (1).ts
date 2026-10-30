/**
 * Canonical Persian Locale Formatting Utilities (`fa-IR`)
 * Ensures consistent Persian numerals across all browsers without relying on font-specific OpenType flags.
 */

const faIntFormatter = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 });
const faDecimalFormatter = new Intl.NumberFormat('fa-IR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatFaNumber(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return decimals > 0
    ? new Intl.NumberFormat('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
    : faIntFormatter.format(value);
}

export function formatFaPercent(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  const clamped = Math.max(0, Math.min(100, value));
  return `${formatFaNumber(clamped, decimals)}٪`;
}

export function formatFaCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1000) {
    return `${faDecimalFormatter.format(value / 1000)} هزار`;
  }
  return faIntFormatter.format(value);
}

export function formatFaScore(awarded: number, maxScore: number): string {
  return `${faDecimalFormatter.format(awarded)} / ${faDecimalFormatter.format(maxScore)}`;
}

export function formatLtrTimestamp(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60).toString().padStart(2, '0');
  const secs = (safe % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
