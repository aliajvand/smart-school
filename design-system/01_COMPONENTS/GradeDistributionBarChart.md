# GradeDistributionBarChart

## 1. Role & User Experience Intent
Displays class score distribution («توزیع نمرات کلاس») using vertical pill-rounded gradient bars (`from-ai-violet via-ai-indigo to-ai-cyan` and `to-success`), Persian numeral axis labels (`formatFaNumber`), and a screen-reader accessible data list (`sr-only`).

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel backdrop-blur-glass`.
- Bars: Semantic tokens (`from-ai-violet`, `to-ai-cyan`, `to-success`).

## 3. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React from 'react';
import { formatFaPercent } from '@/lib/formatters';

export interface GradeBin {
  rangeLabel: string;
  percent: number;
}

const defaultBins: GradeBin[] = [
  { rangeLabel: 'زیر ۱۰', percent: 12 },
  { rangeLabel: '۱۰ تا ۱۲', percent: 24 },
  { rangeLabel: '۱۲ تا ۱۴', percent: 42 },
  { rangeLabel: '۱۴ تا ۱۶', percent: 58 },
  { rangeLabel: '۱۶ تا ۱۸', percent: 78 },
  { rangeLabel: '۱۸ تا ۲۰', percent: 88 },
];

export function GradeDistributionBarChart({
  bins = defaultBins,
  onMoreDetails,
}: {
  bins?: GradeBin[];
  onMoreDetails?: () => void;
}) {
  return (
    <section
      dir="rtl"
      aria-labelledby="grade-dist-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 id="grade-dist-title" className="text-sm font-extrabold text-text-primary">
          توزیع نمرات کلاس
        </h3>
        {onMoreDetails && (
          <button
            type="button"
            onClick={onMoreDetails}
            className="text-xs font-semibold text-ai-violet hover:text-ai-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm px-1"
          >
            مشاهده همه
          </button>
        )}
      </div>

      <div className="flex h-40 items-end justify-between gap-3 px-2 pt-4 border-b border-border/80 pb-3" aria-hidden="true">
        {bins.map((b, idx) => (
          <div key={b.rangeLabel} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              style={{ height: `${b.percent}%` }}
              className={`w-full max-w-[26px] rounded-t-md transition-all duration-base ${
                idx >= 4
                  ? 'bg-gradient-to-t from-ai-cyan to-success'
                  : idx >= 2
                  ? 'bg-gradient-to-t from-ai-indigo to-ai-cyan'
                  : 'bg-gradient-to-t from-ai-violet to-ai-indigo'
              }`}
            />
            <span className="text-[11px] text-text-muted">{b.rangeLabel}</span>
          </div>
        ))}
      </div>

      <ul className="sr-only">
        {bins.map((b) => (
          <li key={b.rangeLabel}>
            بازه نمره {b.rangeLabel}: {formatFaPercent(b.percent)} از کل کلاس
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onMoreDetails}
          className="rounded-lg border border-border-strong bg-surface-raised px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          جزئیات بیشتر ←
        </button>
      </div>
    </section>
  );
}
```
