'use client';

import React from 'react';
import { Flag, ShieldAlert } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export interface SuspiciousSubmissionItem {
  id: string;
  studentDisplay: string;
  similarityPercent: number; // 0..100
  reasonSummary: string;
}

export interface SuspiciousAnswersListCardProps {
  items?: SuspiciousSubmissionItem[];
  onInspectItem?: (id: string) => void;
  onViewAll?: () => void;
}

export function SuspiciousAnswersListCard({
  items = [
    { id: '1', studentDisplay: 'سارا محمدی', similarityPercent: 93, reasonSummary: 'تشابه گام دوم انتگرال' },
    { id: '2', studentDisplay: 'امیرحسین رضایی', similarityPercent: 89, reasonSummary: 'جایگذاری پارامتر برگه مجاور' },
    { id: '3', studentDisplay: 'مهدی کریمی', similarityPercent: 87, reasonSummary: 'خطای جبری مشترک در مخرج' },
  ],
  onInspectItem,
  onViewAll,
}: SuspiciousAnswersListCardProps) {
  return (
    <section
      dir="rtl"
      aria-labelledby="suspicious-card-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-warning" aria-hidden="true" />
          <h3 id="suspicious-card-title" className="text-sm font-extrabold text-text-primary">
            پاسخ‌های مشکوک
          </h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm px-1"
          >
            مشاهده همه ←
          </button>
        )}
      </div>

      {/* Explicit non-verdict framing required by product trust & privacy audit */}
      <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-text-secondary">
        <ShieldAlert className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
        <span>صرفاً سیگنال کمکی برای بازبینی دبیر است و حکم تخلف محسوب نمی‌شود.</span>
      </div>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onInspectItem?.(item.id)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-raised/70 px-3.5 py-2.5 text-start transition-colors duration-fast hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <div>
                <div className="text-xs font-bold text-text-primary">{item.studentDisplay}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{item.reasonSummary}</div>
              </div>
              <span
                className={`rounded-md border px-2.5 py-1 text-xs font-extrabold ${
                  item.similarityPercent >= 90
                    ? 'border-danger/40 bg-danger/15 text-danger'
                    : 'border-warning/40 bg-warning/15 text-warning'
                }`}
              >
                {formatFaPercent(item.similarityPercent)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
