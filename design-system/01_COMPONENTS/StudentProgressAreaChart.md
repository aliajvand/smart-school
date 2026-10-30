# StudentProgressAreaChart

## 1. Role & User Experience Intent
Main dual-series spline chart («روند پیشرفت دانش‌آموزان») comparing the teacher's class trajectory («کلاس شما» in `ai-violet`) against the school benchmark («میانگین مدرسه» in `ai-cyan`), with time-range filter pills (`هفته | ماه | ترم | سال`), a callout tooltip (`هفته ۳: ۸۷٪`), and a screen-reader accessible data table fallback (`sr-only`).

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel backdrop-blur-glass`.
- Series Encoding (Color + Dash Pattern): Class series uses solid `stroke-ai-violet`; School benchmark uses dashed `stroke-ai-cyan` (`strokeDasharray="6 4"`) so series remain distinguishable without color perception.
- Persian Numerals: All axis ticks (`۰` تا `۱۰۰`) and tooltips (`۸۷٪`) use `formatFaNumber` / `formatFaPercent`.

## 3. Visual States Specification
- Interactive period tabs with `aria-pressed`, keyboard focus rings, and an accessible `<table>` summary for screen readers.

## 4. API & Prop Contract
```ts
export interface ProgressDataPoint {
  periodLabel: string;
  classScore: number;
  schoolAverage: number;
}

export interface StudentProgressAreaChartProps {
  data?: ProgressDataPoint[];
  initialRange?: 'هفته' | 'ماه' | 'ترم' | 'سال';
}
```

## 5. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React, { useState } from 'react';
import { formatFaNumber, formatFaPercent } from '@/lib/formatters';

export interface ProgressDataPoint {
  periodLabel: string;
  classScore: number;
  schoolAverage: number;
}

const defaultData: ProgressDataPoint[] = [
  { periodLabel: 'هفته ۱', classScore: 68, schoolAverage: 62 },
  { periodLabel: 'هفته ۲', classScore: 76, schoolAverage: 69 },
  { periodLabel: 'هفته ۳', classScore: 87, schoolAverage: 74 },
  { periodLabel: 'هفته ۴', classScore: 91, schoolAverage: 78 },
];

export function StudentProgressAreaChart({ data = defaultData }: { data?: ProgressDataPoint[] }) {
  const [range, setRange] = useState<'هفته' | 'ماه' | 'ترم' | 'سال'>('ماه');

  return (
    <section
      dir="rtl"
      aria-labelledby="progress-chart-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-6 shadow-panel backdrop-blur-glass"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 id="progress-chart-title" className="text-base font-extrabold text-text-primary">
          روند پیشرفت دانش‌آموزان
        </h3>
        <div role="group" aria-label="بازه زمانی نمودار" className="inline-flex rounded-lg bg-canvas p-1 border border-border">
          {(['هفته', 'ماه', 'ترم', 'سال'] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={range === item}
              onClick={() => setRange(item)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                range === item
                  ? 'bg-ai-violet text-text-primary shadow'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 text-xs text-text-secondary mb-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ai-violet" aria-hidden="true" />
          <span>کلاس شما (خط ممتد)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ai-cyan" aria-hidden="true" />
          <span>میانگین مدرسه (خط‌چین)</span>
        </span>
      </div>

      <div className="relative h-56 w-full" aria-hidden="true">
        <svg viewBox="0 0 600 200" className="h-full w-full overflow-visible">
          <path
            d="M20,145 C140,100 220,105 320,75 C420,45 500,40 580,42"
            fill="none"
            className="stroke-ai-violet"
            strokeWidth="3"
          />
          <path
            d="M20,160 C140,125 220,130 320,105 C420,85 500,78 580,78"
            fill="none"
            className="stroke-ai-cyan"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <circle cx="320" cy="75" r="5" className="fill-text-primary stroke-ai-violet" strokeWidth="3" />
        </svg>
        <div className="absolute left-[48%] top-4 -translate-x-1/2 rounded-lg border border-ai-violet/40 bg-surface-elevated/95 px-3.5 py-2 text-center shadow-panel">
          <div className="text-[11px] text-text-secondary">هفته ۳</div>
          <div className="text-sm font-extrabold text-text-primary">{formatFaPercent(87)}</div>
        </div>
      </div>

      {/* Screen-reader accessible table equivalent */}
      <table className="sr-only">
        <caption>جدول مقایسه‌ای روند پیشرفت کلاس شما و میانگین مدرسه</caption>
        <thead>
          <tr>
            <th scope="col">دوره</th>
            <th scope="col">میانگین کلاس شما</th>
            <th scope="col">میانگین مدرسه</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.periodLabel}>
              <td>{d.periodLabel}</td>
              <td>{formatFaPercent(d.classScore)}</td>
              <td>{formatFaPercent(d.schoolAverage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

## 6. Flutter Mobile Blueprint
Uses `CustomPainter` with `Semantics` summary and `SchoolTokens` (`t.aiViolet`, `t.aiCyan`).

## 7. Interactive Micro-interactions
Respects `prefers-reduced-motion: reduce`.
