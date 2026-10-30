'use client';

import React from 'react';
import { formatFaNumber, formatFaPercent, formatFaCompact } from '@/lib/formatters';

export type KpiTone = 'cyan' | 'violet' | 'indigo' | 'emerald' | 'amber' | 'coral';

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
  unitLabel?: string;
}

const toneMap: Record<KpiTone, { badge: string; stroke: string; fillGradient: string }> = {
  cyan: {
    badge: 'bg-ai-cyan/15 text-ai-cyan border-ai-cyan/30',
    stroke: 'stroke-ai-cyan',
    fillGradient: 'from-ai-cyan/20 to-transparent',
  },
  violet: {
    badge: 'bg-ai-violet/15 text-ai-violet border-ai-violet/30',
    stroke: 'stroke-ai-violet',
    fillGradient: 'from-ai-violet/20 to-transparent',
  },
  indigo: {
    badge: 'bg-ai-indigo/15 text-ai-indigo border-ai-indigo/30',
    stroke: 'stroke-ai-indigo',
    fillGradient: 'from-ai-indigo/20 to-transparent',
  },
  emerald: {
    badge: 'bg-success/15 text-success border-success/30',
    stroke: 'stroke-success',
    fillGradient: 'from-success/20 to-transparent',
  },
  amber: {
    badge: 'bg-warning/15 text-warning border-warning/30',
    stroke: 'stroke-warning',
    fillGradient: 'from-warning/20 to-transparent',
  },
  coral: {
    badge: 'bg-danger/15 text-danger border-danger/30',
    stroke: 'stroke-danger',
    fillGradient: 'from-danger/20 to-transparent',
  },
};

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
  unitLabel,
}: KPIMetricSparkCardProps) {
  const t = toneMap[tone] || toneMap.cyan;
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
      aria-label={`${title}: ${formattedValue} ${unitLabel ? unitLabel : ''}، تغییرات: ${formattedDelta} ${deltaPeriodLabel}`}
      className="relative overflow-hidden rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass transition-all duration-base hover:border-border-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-text-primary">
              {formattedValue}
            </span>
            {unitLabel && (
              <span className="text-xs font-semibold text-text-muted">{unitLabel}</span>
            )}
          </div>
          <h3 className="mt-1.5 text-xs font-medium text-text-secondary">{title}</h3>
        </div>
        {icon && (
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.badge}`}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span
            className={`inline-flex items-center ${isPositive ? 'text-success' : 'text-danger'}`}
          >
            {isPositive ? '↑' : '↓'} {formattedDelta}
          </span>
          <span className="text-[11px] text-text-muted">{deltaPeriodLabel}</span>
        </div>

        {sparkPoints.length > 1 && (
          <svg
            aria-hidden="true"
            viewBox="0 0 110 36"
            className="h-9 w-24 overflow-visible"
          >
            <polyline
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pts}
              className={`${t.stroke} transition-all duration-base`}
            />
          </svg>
        )}
      </div>

      <span className="sr-only">
        {title} برابر است با {formattedValue}. {isPositive ? 'رشد' : 'کاهش'} {formattedDelta} {deltaPeriodLabel}.
      </span>
    </article>
  );
}
