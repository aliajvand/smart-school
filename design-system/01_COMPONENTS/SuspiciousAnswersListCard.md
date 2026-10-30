# SuspiciousAnswersListCard

## 1. Role & User Experience Intent
Compact review queue («پاسخ‌های نیازمند بررسی شباهت») surfacing submissions that share unusual formula paths or cross-parameter values. **Crucial Product Trust Rule:** Always displays the explicit disclaimer *«سیگنال کمکی برای بازبینی دبیر است، نه حکم تقلب»* directly on the card, and uses role-gated pseudonyms or authorized teacher-only view with audit logging.

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel backdrop-blur-glass`.
- Badge Tokens: `border-warning/40 bg-warning/15 text-warning` for medium similarity, `border-danger/40 bg-danger/15 text-danger` for high similarity (`>= 85%`), paired with an icon + text label (never color alone).
- Persian Numerals: Formatted via `formatFaPercent(item.similarity)`.

## 3. Visual States Specification
- Default list with explicit non-verdict disclaimer banner, keyboard-focusable rows, and reduced-motion compliance.

## 4. API & Prop Contract
```ts
export interface SuspiciousSubmissionItem {
  id: string;
  studentDisplay: string; // Role-gated name or pseudonym
  similarityPercent: number; // 0..100
  reasonSummary: string;
}

export interface SuspiciousAnswersListCardProps {
  items: SuspiciousSubmissionItem[];
  onInspectItem: (id: string) => void;
  onViewAll?: () => void;
}
```

## 5. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React from 'react';
import { Flag, ShieldAlert } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export interface SuspiciousSubmissionItem {
  id: string;
  studentDisplay: string;
  similarityPercent: number;
  reasonSummary: string;
}

export interface SuspiciousAnswersListCardProps {
  items?: SuspiciousSubmissionItem[];
  onInspectItem?: (id: string) => void;
  onViewAll?: () => void;
}

export function SuspiciousAnswersListCard({
  items = [
    { id: '1', studentDisplay: 'سارا محمدی (کد ۱۰۴)', similarityPercent: 92, reasonSummary: 'تشابه گام دوم انتگرال' },
    { id: '2', studentDisplay: 'امیرحسین رضایی (کد ۱۰۹)', similarityPercent: 89, reasonSummary: 'جایگذاری پارامتر برگه مجاور' },
    { id: '3', studentDisplay: 'مهدی کریمی (کد ۱۱۲)', similarityPercent: 87, reasonSummary: 'خطای جبری مشترک در مخرج' },
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
            پاسخ‌های نیازمند بررسی شباهت
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

      {/* Explicit non-verdict framing required by product & privacy audit */}
      <p className="mb-3.5 flex items-center gap-1.5 rounded-lg border border-warning/25 bg-warning/10 px-2.5 py-1.5 text-[11px] text-text-secondary">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
        <span>صرفاً سیگنال کمکی برای بازبینی دبیر است و حکم تخلف محسوب نمی‌شود.</span>
      </p>

      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onInspectItem?.(item.id)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-raised/70 px-3.5 py-2.5 text-right transition-colors duration-fast hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <div>
                <div className="text-xs font-bold text-text-primary">{item.studentDisplay}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{item.reasonSummary}</div>
              </div>
              <span className="rounded-md border border-danger/40 bg-danger/15 px-2.5 py-1 text-xs font-extrabold text-danger">
                {formatFaPercent(item.similarityPercent)} شباهت
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

## 6. Flutter Mobile Blueprint
Uses `SchoolTokens` (`t.surface`, `t.warning`, `t.danger`) and includes the mandatory non-verdict disclaimer banner at the top of the card.

## 7. Interactive Micro-interactions
Clicking a row opens the side-by-side paper comparison modal (`IntegrityRadarWidget` detail view) and logs an audit event on the backend.
