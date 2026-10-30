'use client';

import React, { useState } from 'react';
import { Sparkles, Timer, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { ClassAudioWaveformPlayer } from '@/components/agentic/ClassAudioWaveformPlayer';
import { HandwritingEvaluationCanvas } from '@/components/agentic/HandwritingEvaluationCanvas';
import { RegradeTimelineStepper } from '@/components/agentic/RegradeTimelineStepper';
import {
  STUDENT_KPI_METRICS,
  CLASS_AUDIO_LESSON,
  POP_QUIZ_MATH_QUESTION,
  CANONICAL_HANDWRITING_EVALUATION,
  REGRADE_WORKFLOW_STEPS,
} from '@/data/mock-platform-data';
import { formatFaNumber } from '@/lib/formatters';

export default function StudentClassroomPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizTimer, setQuizTimer] = useState(300); // 5 minutes

  const handleOptionSelect = (id: string) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(id);
    }
  };

  const handleQuizSubmit = () => {
    setIsAnswerSubmitted(true);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Row 1: 4 Student KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STUDENT_KPI_METRICS.map((kpi) => (
            <KPIMetricSparkCard
              key={kpi.title}
              title={kpi.title}
              numericValue={kpi.numericValue}
              deltaPercent={kpi.deltaPercent}
              isPercent={kpi.isPercent}
              isCompactThousands={kpi.isCompact}
              tone={kpi.tone}
              sparkPoints={kpi.sparkPoints}
              unitLabel={kpi.unitLabel}
            />
          ))}
        </div>

        {/* Taraz Uncertainty Interval Notice */}
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-xs text-text-secondary flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-warning shrink-0" />
            <span className="font-bold text-text-primary">
              تراز تخمینی کنکور و آزمون‌های کشوری: بازه ۹۳۰۰ تا ۹۶۰۰ (±۱۵۰)
            </span>
          </div>
          <span className="text-[11px] text-text-muted">
            تخمین آماری غیررسمی، نه تضمین نتیجه. بر اساس میانگین نمرات تکوینی شما محاسبه شده است.
          </span>
        </div>

        {/* Row 2: Audio Player & Synchronized Notes */}
        <div>
          <ClassAudioWaveformPlayer
            title={CLASS_AUDIO_LESSON.title}
            courseTitle={CLASS_AUDIO_LESSON.sessionTitle}
            durationSeconds={CLASS_AUDIO_LESSON.totalDurationSeconds}
            samples={CLASS_AUDIO_LESSON.waveformPeaks}
            topics={CLASS_AUDIO_LESSON.topics}
            initialSeconds={CLASS_AUDIO_LESSON.currentPlaybackSeconds}
          />
        </div>

        {/* Row 3: 5-Minute Pop Quiz Card */}
        <section
          dir="rtl"
          aria-labelledby="quiz-section-title"
          className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 id="quiz-section-title" className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-ai-cyan" />
                <span>{POP_QUIZ_MATH_QUESTION.title}</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                سنجش سریع تسلط مفهومی بر روابط جلسه ۶ حرکت شتاب‌دار
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/15 px-3 py-1 text-xs font-bold text-danger">
              <Timer className="h-3.5 w-3.5" />
              <span>زمان باقیمانده: ۰۴:۴۵</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-12 items-center">
            {/* Formula Expression */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-canvas/70 p-4">
              <p className="text-xs font-semibold text-text-muted mb-2">صورت مسئله پارامتریک:</p>
              <div
                dir="ltr"
                className="math-ltr py-3 text-center font-mono text-xl sm:text-2xl font-bold text-math"
              >
                {POP_QUIZ_MATH_QUESTION.formulaLatex}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="lg:col-span-6 space-y-2.5">
              <p className="text-xs font-bold text-text-secondary">یکی از واریانت‌های زیر را انتخاب کنید:</p>
              <div className="grid grid-cols-2 gap-2.5">
                {POP_QUIZ_MATH_QUESTION.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let optStyle = 'border-border bg-surface-raised/70 hover:border-border-strong';
                  if (isSelected) {
                    optStyle = 'border-ai-cyan bg-ai-cyan/15 text-ai-cyan shadow-ai';
                  }
                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      optStyle = 'border-success bg-success/20 text-success';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-danger bg-danger/20 text-danger';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs font-bold transition-all duration-fast ${optStyle}`}
                    >
                      <span>{opt.label}</span>
                      <span className="font-mono text-sm">{opt.value}</span>
                    </button>
                  );
                })}
              </div>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleQuizSubmit}
                  className="mt-3 w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-violet to-ai-indigo px-4 text-xs font-bold text-text-primary shadow-ai disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>ثبت پاسخ و دریافت فیدبک هوشمند</span>
                </button>
              ) : (
                <div className="mt-3 rounded-lg border border-success/40 bg-success/15 p-3 text-xs font-bold text-success text-center">
                  پاسخ شما با موفقیت ثبت شد! گزینه ۳ (واریانت ۳) با راه‌حل استاندارد مطابقت دارد.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Row 4: Handwriting Step Feedback & Regrade Tracker */}
        <div className="grid gap-5 xl:grid-cols-12 items-start">
          <div className="xl:col-span-7">
            <HandwritingEvaluationCanvas
              scoreAwarded={CANONICAL_HANDWRITING_EVALUATION.scoreAwarded}
              maxScore={CANONICAL_HANDWRITING_EVALUATION.maxScore}
              formulaLatex={CANONICAL_HANDWRITING_EVALUATION.formulaLatex}
            />
          </div>
          <div className="xl:col-span-5">
            <RegradeTimelineStepper stages={REGRADE_WORKFLOW_STEPS as any} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
