'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { formatFaNumber } from '@/lib/formatters';

export interface TrendPoint {
  period: string;
  score: number | null;
}

export interface StudentTrendSparklineProps {
  studentLabel: string;
  points: TrendPoint[];
  average?: number;
  delta?: number;
  ewsLevel: 'none' | 'watch' | 'urgent';
  ewsReason?: string;
  lastUpdated: string;
  onOpenHistory?: () => void;
  onReferToCounselor?: () => void;
}

export function StudentTrendSparkline({
  studentLabel,
  points,
  delta,
  ewsLevel,
  ewsReason,
  lastUpdated,
  onOpenHistory,
  onReferToCounselor,
}: StudentTrendSparklineProps) {
  const vals = points.map((x) => x.score).filter((x): x is number => x !== null && Number.isFinite(x));

  const path = useMemo(() => {
    if (vals.length < 2) return '';
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    return vals
      .map((v, i) => `${i ? 'L' : 'M'} ${8 + (i * 84) / (vals.length - 1)} ${34 - ((v - min) / range) * 26}`)
      .join(' ');
  }, [vals]);

  const warning = ewsLevel !== 'none';
  const Icon = (delta ?? 0) > 0 ? TrendingUp : (delta ?? 0) < 0 ? TrendingDown : Minus;

  const badgeConfig = {
    none: {
      text: 'وضعیت مطلوب',
      style: 'bg-success/15 text-success border-success/30',
    },
    watch: {
      text: 'رصد و پیگیری',
      style: 'bg-warning/15 text-warning border-warning/30',
    },
    urgent: {
      text: 'اولویت بررسی حمایتی',
      style: 'bg-danger/15 text-danger border-danger/30',
    },
  }[ewsLevel];

  const latestVal = vals.length ? vals[vals.length - 1] : null;

  return (
    <section
      dir="rtl"
      aria-label={`نمودار روند آموزشی ${studentLabel}`}
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-text-muted">روند یادگیری و آزمون‌ها</p>
          <h3 className="mt-1 font-bold text-text-primary">{studentLabel}</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeConfig.style}`}
        >
          {warning && <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />}
          <span>{badgeConfig.text}</span>
        </span>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <span className="text-2xl font-extrabold text-text-primary">
          {latestVal !== null ? formatFaNumber(latestVal, 1) : '—'}
        </span>
        <span
          className={`mb-1 inline-flex items-center gap-1 text-xs font-bold ${
            (delta ?? 0) > 0
              ? 'text-success'
              : (delta ?? 0) < 0
              ? 'text-warning'
              : 'text-text-muted'
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {delta === undefined
              ? 'بدون مقایسه'
              : `${delta > 0 ? '+' : ''}${formatFaNumber(delta, 1)} نمره`}
          </span>
        </span>
      </div>

      <svg
        viewBox="0 0 100 40"
        role="img"
        aria-label={`نمودار تغییر نمرات در طول ${formatFaNumber(vals.length)} بازه ارزیابی`}
        className="mt-2 h-16 w-full overflow-visible"
      >
        <path
          d={path}
          fill="none"
          stroke="rgb(var(--color-ai-cyan-rgb))"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {vals.length > 0 && (
          <circle
            cx={8 + ((vals.length - 1) * 84) / Math.max(1, vals.length - 1)}
            cy={
              34 -
              ((vals[vals.length - 1] - Math.min(...vals)) /
                (Math.max(...vals) - Math.min(...vals) || 1)) *
                26
            }
            r="3.5"
            fill="rgb(var(--color-math-rgb))"
          />
        )}
      </svg>

      {warning && ewsReason && (
        <p
          className={`mt-2.5 rounded-xl border p-3 text-xs leading-relaxed ${
            ewsLevel === 'urgent'
              ? 'border-danger/30 bg-danger/10 text-danger'
              : 'border-warning/30 bg-warning/10 text-warning'
          }`}
        >
          {ewsReason}
        </p>
      )}

      <p className="mt-3 text-[11px] text-text-muted">
        به‌روزرسانی: {lastUpdated} • روند، یک سیگنال حمایتی آموزشی است و به معنای تشخیص نهایی نیست.
      </p>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {onOpenHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="min-h-11 rounded-lg border border-border bg-surface-raised px-3.5 text-xs font-semibold text-text-secondary hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            مشاهده سوابق تحلیلی
          </button>
        )}
        {onReferToCounselor && warning && (
          <button
            type="button"
            onClick={onReferToCounselor}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-warning/40 bg-warning/15 px-3.5 text-xs font-bold text-warning hover:bg-warning/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <span>درخواست بررسی مشاور</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
