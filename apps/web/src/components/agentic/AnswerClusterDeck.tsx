'use client';

import React, { useState } from 'react';
import { UsersRound, Eye, CheckCircle2, AlertTriangle, Undo2 } from 'lucide-react';
import { formatFaPercent, formatFaNumber } from '@/lib/formatters';

export interface ClusterAnswerItem {
  studentId: string;
  displayName: string;
  answer: string;
  currentScore?: number;
}

export interface AnswerCluster {
  id: string;
  label: string;
  similarity: number; // 0..1
  answers: ClusterAnswerItem[];
  confidence: number;
  reviewRequired: boolean;
  score?: number;
}

export interface AnswerClusterDeckProps {
  clusters?: AnswerCluster[];
  isLoading?: boolean;
  onInspect?: (clusterId: string) => void;
  onApplyScore?: (clusterId: string, score: number) => Promise<void>;
  onExcludeStudent?: (clusterId: string, studentId: string) => void;
}

const defaultClusters: AnswerCluster[] = [
  {
    id: 'cls-1',
    label: 'خوشه راه‌حل استاندارد دقیق',
    similarity: 0.96,
    confidence: 0.98,
    reviewRequired: false,
    answers: [
      { studentId: 'st-1', displayName: 'سارا محمدی', answer: '\\frac{x^3}{3} \\Big|_{-1}^{1} = \\frac{2}{3}', currentScore: 20 },
      { studentId: 'st-2', displayName: 'امیرحسین رضایی', answer: '\\frac{x^3}{3} \\Big|_{-1}^{1} = \\frac{2}{3}', currentScore: 20 },
    ],
  },
  {
    id: 'cls-2',
    label: 'خوشه خطای علامت در کران پایین',
    similarity: 0.92,
    confidence: 0.9,
    reviewRequired: true,
    answers: [
      { studentId: 'st-3', displayName: 'مهدی کریمی', answer: '\\frac{1}{3} - \\frac{1}{3} = 0', currentScore: 12 },
      { studentId: 'st-4', displayName: 'نیما علوی', answer: '\\frac{1}{3} - \\frac{1}{3} = 0', currentScore: 12 },
    ],
  },
  {
    id: 'cls-3',
    label: 'خوشه تغییر متغیر بدون تغییر کران‌ها',
    similarity: 0.87,
    confidence: 0.85,
    reviewRequired: true,
    answers: [
      { studentId: 'st-5', displayName: 'مریم کمالی', answer: 'u = x^2 \\implies \\int u du', currentScore: 8 },
    ],
  },
];

export function AnswerClusterDeck({
  clusters = defaultClusters,
  isLoading = false,
  onInspect,
  onApplyScore,
}: AnswerClusterDeckProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [appliedHistory, setAppliedHistory] = useState<Record<string, number>>({});

  const handleApply = async (id: string) => {
    setPending(id);
    setMessage('');
    const scoreVal = scores[id] ?? 20;
    try {
      if (onApplyScore) {
        await onApplyScore(id, scoreVal);
      }
      setAppliedHistory((prev) => ({ ...prev, [id]: scoreVal }));
      setMessage(`نمره ${formatFaNumber(scoreVal)} برای خوشه اعمال و در لاگ ممیزی ثبت شد.`);
    } catch {
      setMessage('خطا در اعمال نمره گروهی. تغییری ثبت نشد.');
    } finally {
      setPending(null);
    }
  };

  const handleUndo = (id: string) => {
    setAppliedHistory((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setMessage('نمره گروهی با موفقیت لغو (Undo) شد.');
  };

  return (
    <section dir="rtl" aria-label="خوشه‌بندی پاسخ‌ها">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary">
            خوشه‌بندی پاسخ‌ها (Answer Clustering)
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            گروه‌بندی پاسخ‌های مشابه بر اساس درخت نحو انتزاعی (AST) جهت تصحیح سریع
          </p>
        </div>
        <span className="rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-bold text-text-secondary">
          {formatFaNumber(clusters.length)} خوشه فعال
        </span>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg border border-ai-cyan/30 bg-ai-cyan/15 px-3 py-2 text-xs font-bold text-ai-cyan"
        >
          <span>{message}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((c) => {
          const isApplied = !!appliedHistory[c.id];
          return (
            <article
              key={c.id}
              className="rounded-panel border border-border/80 bg-surface/85 p-4 shadow-panel backdrop-blur-glass flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{c.label}</h4>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-text-muted">
                      <UsersRound className="h-3.5 w-3.5" />
                      <span>{formatFaNumber(c.answers.length)} برگه ثبت شده</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      c.reviewRequired
                        ? 'border border-warning/30 bg-warning/15 text-warning'
                        : 'border border-success/30 bg-success/15 text-success'
                    }`}
                  >
                    {c.reviewRequired ? 'نیازمند بررسی' : 'اطمینان بالا'}
                  </span>
                </div>

                {/* Representative Math Answer */}
                <div
                  dir="ltr"
                  className="math-ltr my-3 rounded-lg border border-border bg-canvas/80 p-2.5 font-mono text-xs text-ai-cyan font-bold truncate text-center"
                >
                  {c.answers[0]?.answer ?? 'بدون نمونه پاسخ'}
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                  <span>میزان شباهت الگوی حل:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {formatFaPercent(Math.round(c.similarity * 100))}
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-ai-cyan to-ai-indigo"
                    style={{ width: `${c.similarity * 100}%` }}
                  />
                </div>

                {/* Score Input */}
                <div className="mt-3.5">
                  <label className="block text-[11px] text-text-secondary font-semibold">
                    نمره اختصاصی به این خوشه:
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      aria-label={`نمره برای ${c.label}`}
                      value={scores[c.id] ?? 20}
                      onChange={(e) =>
                        setScores((s) => ({
                          ...s,
                          [c.id]: Math.max(0, Math.min(20, Number(e.target.value))),
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-center text-xs font-bold text-text-primary focus:border-focus focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onInspect?.(c.id)}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-raised text-xs font-bold text-text-secondary hover:border-border-strong hover:text-text-primary"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>بازبینی نمونه</span>
                </button>

                {isApplied ? (
                  <button
                    type="button"
                    onClick={() => handleUndo(c.id)}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-warning/40 bg-warning/15 px-3 text-xs font-bold text-warning hover:bg-warning/25"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    <span>لغو نمره</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!!pending || isLoading}
                    onClick={() => handleApply(c.id)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-success/20 border border-success/40 text-xs font-bold text-success hover:bg-success/30 disabled:opacity-50"
                  >
                    {pending === c.id ? (
                      'در حال ثبت...'
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>اعمال گروهی</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
