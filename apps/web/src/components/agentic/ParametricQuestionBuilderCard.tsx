'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle2, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { formatFaNumber } from '@/lib/formatters';

export interface ParameterSpec {
  id: string;
  symbol: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color?: 'violet' | 'indigo' | 'cyan';
}

export interface QuestionVariantItem {
  id: string;
  statement: string;
  answer: string;
  valid: boolean;
  studentName?: string;
}

export interface ParametricQuestionBuilderCardProps {
  title?: string;
  prompt?: string;
  formula?: string;
  parameters?: ParameterSpec[];
  variants?: QuestionVariantItem[];
  isGenerating?: boolean;
  error?: string;
  onParameterChange?: (id: string, patch: Partial<ParameterSpec>) => void;
  onPreview?: () => void;
  onPublish?: () => void;
}

const defaultParameters: ParameterSpec[] = [
  { id: 'p-1', symbol: 'v₀', label: 'سرعت اولیه', min: 10, max: 30, step: 5, unit: 'm/s', color: 'cyan' },
  { id: 'p-2', symbol: 'θ', label: 'زاویه پرتاب', min: 15, max: 75, step: 15, unit: 'درجه', color: 'indigo' },
  { id: 'p-3', symbol: 'g', label: 'شتاب گرانش', min: 9.8, max: 10, step: 0.2, unit: 'm/s²', color: 'violet' },
  { id: 'p-4', symbol: 'a', label: 'ضریب متغیر a', min: 1, max: 5, step: 1, color: 'cyan' },
  { id: 'p-5', symbol: 'b', label: 'ضریب متغیر b', min: 2, max: 10, step: 2, color: 'indigo' },
];

const defaultVariants: QuestionVariantItem[] = [
  {
    id: 'v-1',
    studentName: 'امیرحسین رضایی',
    statement: 'محاسبه انتگرال با پارامترهای a=1, b=2',
    answer: 'x² (1 + 2) + 1 = 3x² + 1',
    valid: true,
  },
  {
    id: 'v-2',
    studentName: 'سارا محمدی',
    statement: 'محاسبه انتگرال با پارامترهای a=2, b=4',
    answer: 'x² (2 + 4) + 1 = 6x² + 1',
    valid: true,
  },
  {
    id: 'v-3',
    studentName: 'مهدی کریمی',
    statement: 'محاسبه انتگرال با پارامترهای a=3, b=6',
    answer: 'x² (3 + 6) + 1 = 9x² + 1',
    valid: true,
  },
  {
    id: 'v-4',
    studentName: 'نیما علوی',
    statement: 'محاسبه انتگرال با پارامترهای a=4, b=8',
    answer: 'x² (4 + 8) + 1 = 12x² + 1',
    valid: true,
  },
  {
    id: 'v-5',
    studentName: 'مریم کمالی',
    statement: 'محاسبه انتگرال با پارامترهای a=5, b=10',
    answer: 'x² (5 + 10) + 1 = 15x² + 1',
    valid: true,
  },
];

const chipStyles = {
  violet: 'border-ai-violet/40 bg-ai-violet/15 text-text-primary',
  indigo: 'border-ai-indigo/40 bg-ai-indigo/15 text-text-primary',
  cyan: 'border-ai-cyan/40 bg-ai-cyan/15 text-text-primary',
};

export function ParametricQuestionBuilderCard({
  title = 'طراح آزمون پارامتریک',
  prompt = 'تعریف متغیرهای تصادفی با تضمین هم‌ترازی سطح دشواری سوالات (IRT)',
  formula = '\\int x^2 dx = x^2 (a + b) + 1',
  parameters = defaultParameters,
  variants = defaultVariants,
  isGenerating = false,
  error,
  onParameterChange,
  onPreview,
  onPublish,
}: ParametricQuestionBuilderCardProps) {
  const [params, setParams] = useState<ParameterSpec[]>(parameters);
  const [showVariants, setShowVariants] = useState(true);

  const isValid = params.every(
    (x) => Number.isFinite(x.min) && Number.isFinite(x.max) && x.min <= x.max && (x.step ?? 1) > 0
  );

  const handleUpdate = (id: string, patch: Partial<ParameterSpec>) => {
    const updated = params.map((p) => (p.id === id ? { ...p, ...patch } : p));
    setParams(updated);
    onParameterChange?.(id, patch);
  };

  return (
    <section
      dir="rtl"
      aria-label="سامانه طراحی سوال پارامتریک"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ai-cyan" aria-hidden="true" />
            <span>{title}</span>
          </h3>
          <p className="mt-1 text-xs text-text-muted">{prompt}</p>
        </div>
        <span className="rounded-full border border-ai-violet/40 bg-ai-violet/15 px-3 py-1 text-xs font-bold text-text-primary">
          ۵۵ نسخه پارامتریک فعال
        </span>
      </header>

      {/* Formula Display Box */}
      <div className="rounded-xl border border-border bg-canvas/70 p-4">
        <div
          dir="ltr"
          className="math-ltr overflow-x-auto text-lg sm:text-xl font-mono text-ai-cyan font-bold tracking-wider"
        >
          {formula}
        </div>

        {/* Parameter Chips */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {params.map((v) => (
            <div
              key={v.id}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                chipStyles[v.color ?? 'indigo']
              }`}
            >
              <span dir="ltr" className="math-ltr font-mono font-bold text-ai-cyan">
                [{v.symbol}:
              </span>
              <span>{v.label}</span>
              <input
                type="number"
                aria-label={`حداقل مقدار ${v.label}`}
                value={v.min}
                onChange={(e) => handleUpdate(v.id, { min: Number(e.target.value) })}
                className="w-14 rounded border border-border bg-surface px-1.5 py-0.5 text-center text-xs font-bold text-text-primary focus:border-focus focus:outline-none"
              />
              <span>تا</span>
              <input
                type="number"
                aria-label={`حداکثر مقدار ${v.label}`}
                value={v.max}
                onChange={(e) => handleUpdate(v.id, { max: Number(e.target.value) })}
                className="w-14 rounded border border-border bg-surface px-1.5 py-0.5 text-center text-xs font-bold text-text-primary focus:border-focus focus:outline-none"
              />
              <span dir="ltr" className="math-ltr font-mono text-ai-cyan">
                ]
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isValid && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-xs font-bold text-warning">
          <AlertTriangle className="h-4 w-4" />
          <span>دامنه پارامترها نامعتبر است (حداقل باید کمتر یا مساوی حداکثر باشد و گام بزرگتر از صفر).</span>
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs font-bold text-danger">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          disabled={!isValid || isGenerating}
          onClick={() => {
            setShowVariants(true);
            onPreview?.();
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-ai-violet via-ai-indigo to-ai-cyan px-5 text-xs font-bold text-text-primary shadow-ai hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <Eye className="h-4 w-4" />
          <span>{isGenerating ? 'در حال تولید...' : 'پیش‌نمایش ۵ نسخه دانش‌آموز'}</span>
        </button>

        {onPublish && (
          <button
            type="button"
            disabled={!isValid || isGenerating || !variants.length}
            onClick={onPublish}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-success/40 bg-success/15 px-4 text-xs font-bold text-success hover:bg-success/25 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Send className="h-4 w-4" />
            <span>تایید و انتشار آزمون</span>
          </button>
        )}
      </div>

      {showVariants && variants.length > 0 && (
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-bold text-text-secondary">
            ۵ نسخه تولید شده برای دانش‌آموزان:
          </h4>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {variants.slice(0, 5).map((v, i) => (
              <article
                key={v.id}
                className="rounded-xl border border-border bg-surface-raised/70 p-3"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-ai-cyan">
                    {v.studentName ? v.studentName : `نسخه ${formatFaNumber(i + 1)}`}
                  </span>
                  {v.valid ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>معتبر</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-warning">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>نیازمند بازبینی</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-secondary">{v.statement}</p>
                <div
                  dir="ltr"
                  className="math-ltr mt-2 rounded bg-canvas/80 px-2 py-1 font-mono text-xs text-ai-indigo font-bold"
                >
                  {v.answer}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
