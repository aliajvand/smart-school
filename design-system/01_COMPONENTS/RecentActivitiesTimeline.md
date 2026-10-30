# RecentActivitiesTimeline

## 1. Role & User Experience Intent
Vertical audit feed («آخرین فعالیت‌ها») displaying real-time AI and teacher milestones using semantic tokens and screen-reader friendly `<ol>` list markup.

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel backdrop-blur-glass`.
- Dots: `bg-success`, `bg-warning`, `bg-ai-violet` paired with descriptive status text.

## 3. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React from 'react';
import { Clock } from 'lucide-react';

export interface ActivityEvent {
  id: string;
  timeAgo: string;
  title: string;
  tone: 'success' | 'warning' | 'violet';
}

const defaultEvents: ActivityEvent[] = [
  { id: '1', timeAgo: '۳ دقیقه پیش', title: 'آزمون فیزیک تصحیح شد (پیشنهاد اولیه هوش مصنوعی)', tone: 'success' },
  { id: '2', timeAgo: '۱۰ دقیقه پیش', title: 'درخواست بازبینی نمره به کارتابل دبیر ارسال شد', tone: 'warning' },
  { id: '3', timeAgo: '۲ ساعت پیش', title: 'گزارش پیشرفت هفتگی کلاس آماده شد', tone: 'violet' },
];

const dotColor = {
  success: 'bg-success',
  warning: 'bg-warning',
  violet: 'bg-ai-violet',
} as const;

export function RecentActivitiesTimeline({ events = defaultEvents }: { events?: ActivityEvent[] }) {
  return (
    <section
      dir="rtl"
      aria-labelledby="recent-activities-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-text-muted" aria-hidden="true" />
        <h3 id="recent-activities-title" className="text-sm font-extrabold text-text-primary">
          آخرین فعالیت‌ها
        </h3>
      </div>
      <ol className="relative pr-4 border-r border-border space-y-5">
        {events.map((ev) => (
          <li key={ev.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -right-[21px] top-1 h-3 w-3 rounded-full ring-4 ring-surface ${dotColor[ev.tone]}`}
            />
            <time className="text-[11px] text-text-muted block">{ev.timeAgo}</time>
            <div className="text-xs font-bold text-text-primary mt-0.5">{ev.title}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
```
