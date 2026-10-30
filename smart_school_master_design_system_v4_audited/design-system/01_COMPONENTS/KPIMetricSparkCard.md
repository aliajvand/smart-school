# KPIMetricSparkCard

## 1. Role & User Experience Intent
Displays top-row key performance indicators with role-scoped metrics (e.g., Teacher View: «۱۲۸ دانش‌آموز کلاس‌ها», «۴۵۰ برگه تصحیح‌شده», «۹۸٪ نرخ موفقیت», «۲ نیازمند بازبینی دبیر»; Principal View: «۱۲٫۵ هزار دانش‌آموز فعال») paired with a semantic icon badge, Persian formatted numbers (`Intl.NumberFormat('fa-IR')`), and a decorative mini sparkline.

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel backdrop-blur-glass` (clean neutral card border; halo is reserved strictly for AI agent presence).
- Semantic Icon Badges: `text-ai-cyan bg-ai-cyan/15`, `text-ai-violet bg-ai-violet/15`, `text-success bg-success/15`, `text-warning bg-warning/15`.
- Accessibility & Reduced Motion: The sparkline SVG is marked `aria-hidden="true"`, while a screen-reader summary (`sr-only`) announces the metric, delta, and scope.

## 3. Visual States Specification
- `cyan`, `violet`, `emerald`, `amber` semantic icon & sparkline tones on a clean `border-border/80` Bento card.

## 4. API & Prop Contract
```ts
export type KpiTone = 'cyan' | 'violet' | 'emerald' | 'amber';

export interface KPIMetricSparkCardProps {
  title: string;
  numericValue: number;
  isPercent?: boolean;
  isCompactThousands?: boolean;
  deltaPercent: number;
  deltaPeriodLabel?: string;
  tone: KpiTone;
  sparkPoints: number[];
  icon?: React.ReactNode;
}
```

## 5. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React from 'react';
import { formatFaNumber, formatFaPercent, formatFaCompact } from '@/lib/formatters';

export type KpiTone = 'cyan' | 'violet' | 'emerald' | 'amber';

export interface KPIMetricSparkCardProps {
  title: string;
  numericValue: number;
  isPercent?: boolean;
  isCompactThousands?: boolean;
  deltaPercent: number;
  deltaPeriodLabel?: string;
  tone: KpiTone;
  sparkPoints: number[];
  icon?: React.ReactNode;
}

const toneMap = {
  cyan: { badge: 'bg-ai-cyan/15 text-ai-cyan border-ai-cyan/30', stroke: 'stroke-ai-cyan' },
  violet: { badge: 'bg-ai-violet/15 text-ai-violet border-ai-violet/30', stroke: 'stroke-ai-violet' },
  emerald: { badge: 'bg-success/15 text-success border-success/30', stroke: 'stroke-success' },
  amber: { badge: 'bg-warning/15 text-warning border-warning/30', stroke: 'stroke-warning' },
} as const;

export function KPIMetricSparkCard({
  title,
  numericValue,
  isPercent,
  isCompactThousands,
  deltaPercent,
  deltaPeriodLabel = 'نسبت به ماه قبل',
  tone,
  sparkPoints,
  icon,
}: KPIMetricSparkCardProps) {
  const t = toneMap[tone];
  const formattedValue = isPercent
    ? formatFaPercent(numericValue)
    : isCompactThousands
    ? formatFaCompact(numericValue)
    : formatFaNumber(numericValue);

  const formattedDelta = formatFaPercent(Math.abs(deltaPercent));
  const isPositive = deltaPercent >= 0;

  const max = Math.max(...sparkPoints, 1);
  const min = Math.min(...sparkPoints, 0);
  const pts = sparkPoints
    .map((v, i) => `${(i / Math.max(sparkPoints.length - 1, 1)) * 110},${32 - ((v - min) / (max - min || 1)) * 26}`)
    .join(' ');

  return (
    <article
      dir="rtl"
      aria-label={`${title}: ${formattedValue}، تغییرات: ${formattedDelta} ${deltaPeriodLabel}`}
      className="relative overflow-hidden rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-text-primary">
            {formattedValue}
          </div>
          <h3 className="mt-1.5 text-xs font-medium text-text-secondary">{title}</h3>
        </div>
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.badge}`}
        >
          {icon ?? '●'}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className={`text-xs font-bold ${isPositive ? 'text-success' : 'text-warning'}`}>
          {isPositive ? '↑' : '↓'} {formattedDelta}
          <span className="mr-1 font-normal text-text-muted">{deltaPeriodLabel}</span>
        </span>
        <svg viewBox="0 0 110 36" className="h-9 w-28 overflow-visible" aria-hidden="true">
          <polyline
            fill="none"
            className={t.stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            points={pts}
          />
        </svg>
      </div>
    </article>
  );
}
```

## 6. Flutter Mobile Blueprint
Uses `SchoolTokens.of(context)` (`t.surface`, `t.border`, `SchoolTokens.toFaDigits`) with `Semantics(label: ...)` for screen readers.

## 7. Interactive Micro-interactions
Hovering elevates border to `border-border-strong` over `140ms` (`duration-fast`); no distracting continuous animation on static KPI cards.
