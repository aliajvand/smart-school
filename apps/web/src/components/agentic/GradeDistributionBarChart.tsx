'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { formatFaNumber, formatFaPercent } from '@/lib/formatters';

export interface GradeBucket {
  rangeLabel: string;
  count: number;
  percent: number;
  highlighted?: boolean;
}

export interface GradeDistributionBarChartProps {
  buckets?: GradeBucket[];
  title?: string;
  onViewMore?: () => void;
}

const defaultBuckets: GradeBucket[] = [
  { rangeLabel: '۰ - ۲۵', count: 4, percent: 8 },
  { rangeLabel: '۲۵ - ۵۰', count: 9, percent: 18 },
  { rangeLabel: '۵۰ - ۷۵', count: 18, percent: 36, highlighted: true },
  { rangeLabel: '۷۵ - ۹۰', count: 12, percent: 24 },
  { rangeLabel: '۹۰ - ۱۰۰', count: 7, percent: 14 },
];

export function GradeDistributionBarChart({
  buckets = defaultBuckets,
  title = 'توزیع نمرات کلاس',
  onViewMore,
}: GradeDistributionBarChartProps) {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <section
      dir="rtl"
      aria-labelledby="grade-distribution-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-ai-cyan" aria-hidden="true" />
          <h3 id="grade-distribution-title" className="text-sm font-extrabold text-text-primary">
            {title}
          </h3>
        </div>
        {onViewMore && (
          <button
            type="button"
            onClick={onViewMore}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm px-1"
          >
            مشاهده همه ←
          </button>
        )}
      </div>

      {/* Visual Bar Chart */}
      <div className="flex h-36 items-end justify-between gap-3 pt-4">
        {buckets.map((b) => {
          const barHeightPercent = (b.count / maxCount) * 100;
          return (
            <div key={b.rangeLabel} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-bold text-text-secondary">
                {formatFaNumber(b.count)}
              </span>

              <div className="w-full max-w-[36px] h-24 rounded-t-lg bg-surface-raised flex items-end overflow-hidden">
                <div
                  style={{ height: `${barHeightPercent}%` }}
                  className={`w-full rounded-t-lg transition-all duration-base ${
                    b.highlighted
                      ? 'bg-gradient-to-t from-ai-indigo to-ai-cyan shadow-ai'
                      : 'bg-gradient-to-t from-ai-violet/60 to-ai-violet'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <span className="text-[10px] text-text-muted truncate">
                {b.rangeLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Accessible Screen-Reader Summary */}
      <div className="sr-only">
        <h4>جزئیات آماری توزیع نمرات کلاس</h4>
        <ul>
          {buckets.map((b) => (
            <li key={b.rangeLabel}>
              بازه {b.rangeLabel}: {formatFaNumber(b.count)} دانش‌آموز ({formatFaPercent(b.percent)})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
