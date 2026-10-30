'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, FileText, Sparkles, User } from 'lucide-react';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  statusTone: 'emerald' | 'amber' | 'violet' | 'coral' | 'cyan' | 'indigo';
  iconType?: 'check' | 'alert' | 'document' | 'sparkles' | 'user';
}

export interface RecentActivitiesTimelineProps {
  activities?: ActivityItem[];
  title?: string;
}

const defaultActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'آزمون فیزیک تصحیح شد',
    description: '۴۵ برگه با دقت ۹۶٪ توسط سامانه ارزیابی شد.',
    timeAgo: '۳ دقیقه پیش',
    statusTone: 'emerald',
    iconType: 'check',
  },
  {
    id: 'act-2',
    title: 'نسخه بازبینی ارسال شد',
    description: 'درخواست بازبینی نمره امیرحسین رضایی به کارتابل افزوده شد.',
    timeAgo: '۱۰ دقیقه پیش',
    statusTone: 'amber',
    iconType: 'alert',
  },
  {
    id: 'act-3',
    title: 'گزارش پیشرفت کلاس آماده شد',
    description: 'شاخص تسلط مبحث انتگرال در ۳ کلاس بارگذاری گردید.',
    timeAgo: '۲ ساعت پیش',
    statusTone: 'violet',
    iconType: 'document',
  },
];

const toneConfig = {
  emerald: { bg: 'bg-success/15 border-success/30 text-success' },
  amber: { bg: 'bg-warning/15 border-warning/30 text-warning' },
  violet: { bg: 'bg-ai-violet/15 border-ai-violet/30 text-ai-violet' },
  coral: { bg: 'bg-danger/15 border-danger/30 text-danger' },
  cyan: { bg: 'bg-ai-cyan/15 border-ai-cyan/30 text-ai-cyan' },
  indigo: { bg: 'bg-ai-indigo/15 border-ai-indigo/30 text-ai-indigo' },
};

const iconMap = {
  check: CheckCircle2,
  alert: AlertTriangle,
  document: FileText,
  sparkles: Sparkles,
  user: User,
};

export function RecentActivitiesTimeline({
  activities = defaultActivities,
  title = 'آخرین فعالیت‌ها',
}: RecentActivitiesTimelineProps) {
  return (
    <section
      dir="rtl"
      aria-labelledby="recent-activities-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-ai-cyan" aria-hidden="true" />
        <h3 id="recent-activities-title" className="text-sm font-extrabold text-text-primary">
          {title}
        </h3>
      </div>

      <ul className="space-y-3.5">
        {activities.map((item) => {
          const Icon = item.iconType ? iconMap[item.iconType] : CheckCircle2;
          const tone = toneConfig[item.statusTone] || toneConfig.emerald;
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${tone.bg}`}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-text-primary truncate">
                    {item.title}
                  </h4>
                  <span className="shrink-0 text-[10px] text-text-muted">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
