'use client';

import React from 'react';
import { Check, Circle, Clock3, AlertTriangle, FileUp } from 'lucide-react';

export type RegradeStageId = 'student_filed' | 'teacher_review' | 'counselor_note' | 'principal_approved';

export interface RegradeStage {
  id: RegradeStageId;
  label: string;
  roleDescription: string;
  state: 'upcoming' | 'current' | 'completed' | 'needs_action' | 'blocked';
  owner?: string;
  timestamp?: string;
  notes?: string;
}

export interface RegradeTimelineStepperProps {
  stages?: RegradeStage[];
  currentStageId?: RegradeStageId;
  onOpenStage?: (id: RegradeStageId) => void;
  onSubmitEvidence?: (id: RegradeStageId) => void;
}

const defaultStages: RegradeStage[] = [
  {
    id: 'student_filed',
    label: 'ثبت درخواست',
    roleDescription: 'توسط دانش‌آموز (امیرحسین رضایی)',
    state: 'completed',
    timestamp: 'دیروز ساعت ۱۶:۲۰',
    owner: 'امیرحسین رضایی',
    notes: '«به نظر می‌رسد ضریب منفی در صورت سوال ۲ اشتباه خوانده شده است.»',
  },
  {
    id: 'teacher_review',
    label: 'بررسی معلم',
    roleDescription: 'استاد علی اجوند (دبیر ریاضی)',
    state: 'current',
    timestamp: 'امروز ساعت ۰۹:۱۵',
    owner: 'علی اجوند',
    notes: 'در حال بازبینی تطبیق دست‌خط با راه‌حل استاندارد.',
  },
  {
    id: 'counselor_note',
    label: 'نظر مشاور',
    roleDescription: 'مشاور پایه دوازدهم',
    state: 'upcoming',
    owner: 'مشاور پایه',
  },
  {
    id: 'principal_approved',
    label: 'تایید نهایی',
    roleDescription: 'معاون آموزشی مجتمع',
    state: 'upcoming',
    owner: 'معاونت آموزشی',
  },
];

const iconMap = {
  completed: Check,
  current: Clock3,
  needs_action: AlertTriangle,
  blocked: AlertTriangle,
  upcoming: Circle,
};

const stateColors = {
  completed: 'text-success border-success/40 bg-success/15',
  current: 'text-ai-cyan border-ai-indigo/50 bg-ai-indigo/15 ring-2 ring-ai-cyan/30',
  needs_action: 'text-warning border-warning/40 bg-warning/15',
  blocked: 'text-danger border-danger/40 bg-danger/15',
  upcoming: 'text-text-muted border-border bg-surface-raised/40',
};

export function RegradeTimelineStepper({
  stages = defaultStages,
  onOpenStage,
  onSubmitEvidence,
}: RegradeTimelineStepperProps) {
  return (
    <section
      dir="rtl"
      aria-label="مراحل فرآیند بررسی درخواست بازبینی نمره"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary">وضعیت درخواست بازبینی</h3>
          <p className="text-xs text-text-muted mt-0.5">
            گردش کار بررسی چندمرحله‌ای با ثبت لاگ ممیزی
          </p>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((s, index) => {
          const Icon = iconMap[s.state] || Circle;
          const colorClass = stateColors[s.state] || stateColors.upcoming;
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                onClick={() => onOpenStage?.(s.id)}
                className={`flex min-h-[140px] w-full flex-col justify-between rounded-xl border p-3.5 text-start transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${colorClass}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>مرحله {index + 1} از ۴</span>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </div>
                  <h4 className="mt-2 text-sm font-extrabold text-text-primary">{s.label}</h4>
                  <p className="mt-0.5 text-xs text-text-secondary">{s.roleDescription}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-border/50 text-[11px]">
                  {s.timestamp && (
                    <span className="block text-text-muted">{s.timestamp}</span>
                  )}
                  {s.notes && (
                    <span className="block text-text-secondary truncate mt-0.5 font-medium">
                      {s.notes}
                    </span>
                  )}
                </div>
              </button>

              {s.state === 'needs_action' && onSubmitEvidence && (
                <button
                  type="button"
                  onClick={() => onSubmitEvidence(s.id)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-warning hover:underline"
                >
                  <FileUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>ارسال مستند تکمیلی</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
