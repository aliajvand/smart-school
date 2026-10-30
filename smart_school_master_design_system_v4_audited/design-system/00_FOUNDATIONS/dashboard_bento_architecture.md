# Dashboard Bento Grid & Shell Architecture (v4.0 Audited)

Matches the exact visual layout of **`00_main_teacher_dashboard_mockup.png`** while enforcing role-scoped data boundaries and semantic tokens:
- **Right Sidebar (RTL Primary Navigation):** Fixed `264px` width on desktop (`lg:w-[264px]`), featuring the glowing **Neural Book Emblem** (`/assets/svg/brand-icon.svg`), school title («مدرسه هوشمند آینده / AI-Powered Smart School»), 7 navigation items with active pill glow (`from-ai-violet to-ai-indigo shadow-ai`), and the bottom AI promotional card (without exposing internal LLM model names in the UI).
- **Top Header Bar:** Displays the teacher profile («علی اجوند — معلم ریاضی») with a role-scope selector (`نمای کلاس‌های من` vs. `نمای کل مدرسه — ویژه مدیر`), notification bell with coral badge (`۳`), dark-mode toggle, global RTL search bar, and the floating `<AgentStatusPill />` («در حال تولید ۵۵ نسخه پارامتریک...»).
- **Role-Scoped KPI Row (Row 1):**
  * **Teacher Scope (Default):** `۱۲۸ دانش‌آموز کلاس‌ها` (teacher's own students), `۴۵۰ برگه تصحیح‌شده`, `۹۸٪ نرخ موفقیت`, `۲ نیازمند بازبینی دبیر`.
  * **Principal / Admin Scope:** `۱۲٫۵ هزار دانش‌آموز فعال` (formatted with Persian numerals via `formatFaCompact(12500)`).
- **Canonical Handwriting Score:** Standardized to **`۹۵ / ۱۰۰`** (`formatFaScore(95, 100)`) across all specs and components.

---

## Complete Next.js 15 Dashboard Page Shell (`app/dashboard/page.tsx`)

```tsx
'use client';

import React, { useState } from 'react';
import {
  Home, FileCheck2, BookOpen, Users, BarChart3, Bot, Settings,
  Bell, Moon, Search, Sparkles
} from 'lucide-react';
import { AgentStatusPill } from '@/components/agentic/AgentStatusPill';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { StudentProgressAreaChart } from '@/components/agentic/StudentProgressAreaChart';
import { AIAssistantBentoCard } from '@/components/agentic/AIAssistantBentoCard';
import { SuspiciousAnswersListCard } from '@/components/agentic/SuspiciousAnswersListCard';
import { GradeDistributionBarChart } from '@/components/agentic/GradeDistributionBarChart';
import { RecentActivitiesTimeline } from '@/components/agentic/RecentActivitiesTimeline';
import { formatFaNumber, formatFaScore } from '@/lib/formatters';

export default function SmartSchoolDashboard() {
  const [scope, setScope] = useState<'teacher' | 'school'>('teacher');

  return (
    <div dir="rtl" className="min-h-screen bg-canvas text-text-primary flex font-sans selection:bg-ai-violet/30">
      {/* 1. Right Sidebar (RTL Navigation) */}
      <aside className="hidden lg:flex w-[264px] shrink-0 flex-col justify-between border-l border-border/80 bg-surface/90 p-5 backdrop-blur-glass">
        <div>
          <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-border/80">
            <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-panel border border-ai-cyan/30 bg-surface-raised shadow-ai">
              <img src="/assets/svg/brand-icon.svg" alt="نشان مدرسه هوشمند آینده" className="h-16 w-16" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-text-primary">مدرسه هوشمند آینده</h1>
            <p dir="ltr" className="text-[11px] text-text-muted">AI-Powered Smart School</p>
          </div>

          <nav aria-label="منوی اصلی" className="space-y-1.5">
            {[
              { label: 'داشبورد', icon: Home, active: true },
              { label: 'آزمون‌ها', icon: FileCheck2, active: false },
              { label: 'کلاس‌ها', icon: BookOpen, active: false },
              { label: 'دانش‌آموزان', icon: Users, active: false },
              { label: 'تحلیل و گزارش‌ها', icon: BarChart3, active: false },
              { label: 'دستیار هوشمند', icon: Bot, active: false },
              { label: 'تنظیمات', icon: Settings, active: false },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={item.active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    item.active
                      ? 'bg-gradient-to-l from-ai-violet to-ai-indigo text-text-primary shadow-ai'
                      : 'text-text-muted hover:bg-surface-raised hover:text-text-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Promo Banner (No internal model names exposed in UI) */}
        <div className="relative overflow-hidden rounded-panel border border-ai-indigo/30 bg-gradient-to-b from-surface-elevated to-surface p-4 text-center shadow-panel">
          <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold text-warning">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>قدرت هوش مصنوعی</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">در خدمت آموزش بهتر و تصحیح گام‌به‌گام برگه‌ها</p>
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 bg-canvas/85 px-6 py-4 backdrop-blur-glass">
          <AgentStatusPill
            status="thinking"
            message="در حال تولید ۵۵ نسخه پارامتریک..."
            progress={78}
          />

          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="جستجو در دانش‌آموزان، آزمون‌ها و کلاس‌ها"
              placeholder="جستجو در دانش‌آموزان، آزمون‌ها و ..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-4 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Role Scope Switcher (Teacher Class Scope vs. Principal School Scope) */}
            <button
              type="button"
              onClick={() => setScope(scope === 'teacher' ? 'school' : 'teacher')}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:border-focus"
            >
              {scope === 'teacher' ? 'محدوده: کلاس‌های من (۱۲۸ نفر)' : 'محدوده: کل مدرسه (۱۲٫۵ هزار)'}
            </button>

            <button type="button" aria-label="تغییر تم" className="relative rounded-lg border border-border bg-surface p-2.5 text-text-secondary hover:text-text-primary">
              <Moon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" aria-label="اعلان‌ها" className="relative rounded-lg border border-border bg-surface p-2.5 text-text-secondary hover:text-text-primary">
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-text-primary">
                {formatFaNumber(3)}
              </span>
            </button>
            <div className="flex items-center gap-3 pr-2 border-r border-border">
              <div className="text-right">
                <div className="text-sm font-bold text-text-primary">علی اجوند</div>
                <div className="text-[11px] text-text-muted">معلم ریاضی</div>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-ai-violet/60 bg-surface-raised" aria-hidden="true" />
            </div>
          </div>
        </header>

        {/* 12-Column Bento Grid */}
        <main className="p-6 grid grid-cols-12 gap-5">
          {/* Row 1: 4 Role-Scoped KPI Cards */}
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KPIMetricSparkCard
              title={scope === 'teacher' ? 'دانش‌آموزان کلاس‌های من' : 'دانش‌آموز فعال کل مجموعه'}
              numericValue={scope === 'teacher' ? 128 : 12500}
              isCompactThousands={scope === 'school'}
              deltaPercent={8}
              tone="cyan"
              sparkPoints={[42, 48, 45, 56, 62, 58, 72]}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KPIMetricSparkCard
              title="برگه تصحیح‌شده"
              numericValue={450}
              deltaPercent={20}
              tone="violet"
              sparkPoints={[30, 38, 42, 50, 58, 65, 80]}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KPIMetricSparkCard
              title="نرخ موفقیت"
              numericValue={98}
              isPercent
              deltaPercent={2}
              tone="emerald"
              sparkPoints={[88, 90, 91, 94, 95, 96, 98]}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KPIMetricSparkCard
              title="نیاز به بازبینی دبیر"
              numericValue={2}
              deltaPercent={12}
              tone="amber"
              sparkPoints={[6, 5, 4, 4, 3, 2, 2]}
            />
          </div>

          {/* Row 2: Progress Spline (8 Cols) + AI Assistant Bento Card (4 Cols) */}
          <div className="col-span-12 xl:col-span-8">
            <StudentProgressAreaChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <AIAssistantBentoCard />
          </div>

          {/* Row 3: Activities (4 Cols) + Grade Distribution (4 Cols) + Suspicious Submissions (4 Cols) */}
          <div className="col-span-12 lg:col-span-4">
            <RecentActivitiesTimeline />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <GradeDistributionBarChart />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <SuspiciousAnswersListCard />
          </div>

          {/* Row 4: Canonical Handwriting Score Card (۹۵ / ۱۰۰) */}
          <section className="col-span-12 rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-text-primary">ارزیابی دست‌خط با دقت بالا (پیشنهاد اولیه هوش مصنوعی)</h3>
              <p className="text-xs text-text-muted mt-1">فرمول شناسایی‌شده در کادر پاسخ: <span className="math-ltr px-1 text-math">∫₋₁¹ x² dx = [x³/3]₋₁¹ = 2/3</span></p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-success/40 bg-success/15 px-4 py-2 text-sm font-extrabold text-success">
              <span>نمره پیشنهادی: {formatFaScore(95, 100)}</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
```
