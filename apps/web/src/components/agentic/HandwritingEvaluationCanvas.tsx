'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ScanSearch, Check } from 'lucide-react';
import { formatFaScore, formatFaNumber } from '@/lib/formatters';

export type EvaluationState = 'idle' | 'thinking' | 'success' | 'warning' | 'error';

export interface StepAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: EvaluationState;
  label: string;
  explanation?: string;
  score?: number;
  maxScore?: number;
}

export interface RubricItem {
  id: string;
  title: string;
  awarded: number;
  max: number;
  note?: string;
}

export interface HandwritingEvaluationCanvasProps {
  scoreAwarded?: number;
  maxScore?: number;
  formulaLatex?: string;
  annotations?: StepAnnotation[];
  rubric?: RubricItem[];
  selectedAnnotationId?: string;
  onAnnotationSelect?: (id: string) => void;
  onScoreChange?: (rubricId: string, score: number) => void;
}

const stateStyles: Record<EvaluationState, { border: string; bg: string; text: string }> = {
  idle: {
    border: 'border-border-strong',
    bg: 'bg-surface/40',
    text: 'text-text-muted',
  },
  thinking: {
    border: 'border-ai-cyan animate-pulse',
    bg: 'bg-ai-cyan/10',
    text: 'text-ai-cyan',
  },
  success: {
    border: 'border-success',
    bg: 'bg-success/15',
    text: 'text-success',
  },
  warning: {
    border: 'border-warning',
    bg: 'bg-warning/15',
    text: 'text-warning',
  },
  error: {
    border: 'border-danger',
    bg: 'bg-danger/15',
    text: 'text-danger',
  },
};

export function HandwritingEvaluationCanvas({
  scoreAwarded = 95,
  maxScore = 100,
  formulaLatex = '\\int_{-1}^{1} x^2 dx = \\left[ \\frac{x^3}{3} \\right]_{-1}^{1} = \\frac{2}{3}',
  annotations = [
    {
      id: 'step-1',
      x: 0.05,
      y: 0.15,
      width: 0.35,
      height: 0.7,
      state: 'success',
      label: 'پادمشتق x³ / 3',
      explanation: 'تشخیص صحیح فرمول انتگرال‌گیری توانی',
    },
    {
      id: 'step-2',
      x: 0.42,
      y: 0.15,
      width: 0.3,
      height: 0.7,
      state: 'success',
      label: 'جایگذاری کران‌ها [x³/3]₋₁¹',
      explanation: 'قرار دادن دقیق کران بالا ۱ و کران پایین -۱',
    },
    {
      id: 'step-3',
      x: 0.74,
      y: 0.15,
      width: 0.22,
      height: 0.7,
      state: 'success',
      label: 'پاسخ نهایی ۲/۳',
      explanation: 'محاسبه بدون خطای علامت جبری',
    },
  ],
  rubric = [
    { id: 'rub-1', title: 'تشخیص پادمشتق صحیح', awarded: 40, max: 40, note: 'تابع اولیه کاملاً درست تعیین شد' },
    { id: 'rub-2', title: 'محاسبه کران‌های معین', awarded: 35, max: 35, note: 'قضیه اساسی حسابان رعایت شد' },
    { id: 'rub-3', title: 'ساده‌سازی کسر جبری', awarded: 20, max: 25, note: 'کسر ۵ نمره به دلیل عدم درج مرحله تفریق میانی' },
  ],
  selectedAnnotationId,
  onAnnotationSelect,
  onScoreChange,
}: HandwritingEvaluationCanvasProps) {
  return (
    <section
      dir="rtl"
      aria-label="بخش ارزیابی دست‌خط با هوش مصنوعی"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
            <ScanSearch className="h-4 w-4 text-ai-cyan" aria-hidden="true" />
            <span>ارزیابی دست‌خط با دقت بالا</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            تصحیح گام‌به‌گام دست‌خط دانش‌آموز بر اساس بارم‌بندی استاندارد
          </p>
        </div>

        <div className="flex items-center gap-2.5 rounded-full border border-success/30 bg-success/15 px-3.5 py-1.5 text-xs font-bold text-success">
          <Check className="h-4 w-4" aria-hidden="true" />
          <span>نمره ارزیابی: {formatFaScore(scoreAwarded, maxScore)}</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12 items-start">
        {/* Canvas Display with Bounding Boxes */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-canvas/80 p-4">
          <div className="relative flex min-h-[140px] w-full items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface/60 p-4">
            {/* Interactive Annotations Over Simulated Canvas */}
            <div className="relative w-full max-w-md py-4">
              <div
                dir="ltr"
                className="math-ltr flex items-center justify-center text-center text-xl sm:text-2xl text-math font-mono tracking-wider"
              >
                ∫₋₁¹ x² dx = [x³/3]₋₁¹ = 2/3
              </div>

              {/* Bounding box overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {annotations.map((a) => {
                  const s = stateStyles[a.state] || stateStyles.idle;
                  const isSelected = selectedAnnotationId === a.id;
                  return (
                    <div
                      key={a.id}
                      style={{
                        left: `${a.x * 100}%`,
                        top: `${a.y * 100}%`,
                        width: `${a.width * 100}%`,
                        height: `${a.height * 100}%`,
                      }}
                      className={`absolute pointer-events-auto cursor-pointer rounded border-2 ${s.border} ${s.bg} transition-all duration-fast ${
                        isSelected ? 'ring-2 ring-focus ring-offset-2 ring-offset-canvas' : ''
                      }`}
                      onClick={() => onAnnotationSelect?.(a.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${a.label}: ${a.state}`}
                    >
                      <span className="absolute -top-5 start-0 truncate rounded bg-canvas px-1.5 py-0.5 text-[10px] font-bold text-text-primary border border-border">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-[11px] text-text-muted text-center">
            باکس‌های سبز نشان‌دهنده مراحل تایید شده توسط سیستم ارزیابی بصری هستند.
          </p>
        </div>

        {/* Rubric Breakdown and Teacher Override */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-lg border border-border bg-surface-raised/70 p-3.5 space-y-3">
            <h4 className="text-xs font-bold text-text-primary">ریز بارم تصحیح گام‌به‌گام</h4>
            {rubric.map((r) => (
              <div key={r.id} className="space-y-1.5 border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">{r.title}</span>
                  <span className="font-extrabold text-ai-cyan">
                    {formatFaScore(r.awarded, r.max)}
                  </span>
                </div>
                {r.note && <p className="text-[11px] text-text-muted">{r.note}</p>}
                {onScoreChange && (
                  <input
                    type="range"
                    aria-label={`تغییر نمره ${r.title}`}
                    min={0}
                    max={r.max}
                    step={1}
                    value={r.awarded}
                    onChange={(e) => onScoreChange(r.id, Number(e.target.value))}
                    className="w-full accent-ai-cyan cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
