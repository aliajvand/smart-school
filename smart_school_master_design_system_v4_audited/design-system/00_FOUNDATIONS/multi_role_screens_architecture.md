# Multi-Role Screens Architecture (Teacher, Counselor, Student, Parametric Studio & Flutter Mobile — v4.0 Audited)

Version: 4.0.0  
Visual Reference: All 5 role mockups reside in `/design-system/02_ASSETS/mockups/`:
1. `00_main_teacher_dashboard_mockup.png` — Main Teacher & Academic Lead Dashboard
2. `01_counselor_ews_dashboard_mockup.jpg` — School Counselor & Early Warning System (EWS) Portal
3. `02_student_smart_classroom_mockup.jpg` — Student Smart Classroom, Voice-to-Note & Pop-Quiz Portal
4. `03_parametric_studio_and_integrity_mockup.jpg` — Parametric Question Studio, Answer Clustering & Integrity Radar
5. `04_flutter_mobile_aruco_scanner_mockup.jpg` — Flutter iOS/Android ArUco Handwritten Exam Scanner & Mobile Audio Note App

---

## 1. Audited Product, Privacy & Statistical Safeguards (Addressing Claude's Review)

1. **SHAP Feature Attribution Framing (Not Causal Diagnosis):**
   - Never label SHAP values as «ریشه‌یابی قطعی» (root cause). Use **«سهم ویژگی‌ها در پیش‌بینی مدل (SHAP Feature Attribution)»** with a clear note that feature weights reflect statistical association in the model, not clinical or personal causation.
2. **Minor Protection, RBAC, Audit Log & Human-in-the-Loop Outreach:**
   - The Counselor EWS Portal is strictly gated behind `role === 'counselor' | 'principal'` with server-side RBAC and access audit logging (`audit_log_id`).
   - **No Unsupervised AI Outreach to Minors:** The AI agent never sends automated psychological or personal messages directly to under-18 students. Instead, the system drafts a supportive academic check-in template that the **human counselor must review, edit, and explicitly approve** before dispatch.
   - **Structured Academic Check-in Only:** Students select from structured academic checkboxes (e.g., «نیاز به مرور مجدد مبحث»، «عدم دسترسی به اینترنت در جلسه آنلاین»، «درخواست جلسه رفع اشکال») rather than storing sensitive personal/medical health records in general ticket text.
3. **Konkoor & Final Exam Taraz Uncertainty Interval:**
   - Never present a single deterministic Konkoor Taraz number as a guarantee. Always display a **confidence interval and disclaimer**, e.g.: **`تراز تخمینی: بازه ۹۳۰۰ تا ۹۶۰۰ (±۱۵۰ — تخمین آماری غیررسمی)`**.

---

## 2. Counselor & EWS Portal Blueprint (`app/counselor/page.tsx`)

```tsx
'use client';
import React from 'react';
import { ShieldAlert, Lock, UserCheck } from 'lucide-react';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { formatFaPercent } from '@/lib/formatters';

export default function CounselorEWSDashboard() {
  const shapFeatures = [
    { label: 'تاخیر در تحویل ۲ تمرین حسابان', share: 48, barClass: 'from-danger to-warning' },
    { label: 'غیبت در ۲ جلسه آنلاین روز آلودگی هوا', share: 32, barClass: 'from-warning to-ai-violet' },
    { label: 'کاهش زمان مرور جزوه صوتی کلاس', share: 20, barClass: 'from-ai-violet to-ai-cyan' },
  ];

  const priorityQueue = [
    { id: 'st-109', name: 'امیرحسین رضایی', grade: 'دوازدهم ریاضی • تغییر شیب نمرات حسابان', statusLabel: 'اولویت بررسی بالا', score: 88 },
    { id: 'st-104', name: 'سارا محمدی', grade: 'دوازدهم تجربی • ۳ غیبت متوالی زیست', statusLabel: 'نیازمند پیگیری آموزشی', score: 74 },
    { id: 'st-112', name: 'مهدی کریمی', grade: 'یازدهم ریاضی • تاخیر در تکالیف هندسه', statusLabel: 'رصد پشتیبان', score: 61 },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-canvas p-6 text-text-primary grid grid-cols-12 gap-5 font-sans">
      {/* Privacy & RBAC Audit Banner */}
      <div className="col-span-12 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/90 px-4 py-2.5 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-2 font-semibold text-ai-cyan">
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span>دسترسی محدود نقش مشاور پایه (ثبت در لاگ ممیزی حریم خصوصی)</span>
        </span>
        <span>تمامی پیام‌های حمایتی پیش از ارسال به دانش‌آموز نیازمند تایید انسانی مشاور هستند.</span>
      </div>

      {/* Row 1: 4 Role-Scoped KPI Cards */}
      <div className="col-span-12 sm:col-span-6 xl:col-span-3">
        <KPIMetricSparkCard title="دانش‌آموزان تحت پایش پایه" numericValue={320} deltaPercent={12} tone="cyan" sparkPoints={[40, 48, 52, 60, 68, 75, 82]} />
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-3">
        <KPIMetricSparkCard title="پرونده‌های نیازمند بررسی مشاور" numericValue={7} deltaPercent={2} tone="amber" sparkPoints={[12, 15, 11, 18, 14, 9, 7]} />
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-3">
        <KPIMetricSparkCard title="جلسات مشاوره برگزارشده" numericValue={24} deltaPercent={20} tone="violet" sparkPoints={[10, 14, 16, 15, 20, 22, 24]} />
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-3">
        <KPIMetricSparkCard title="بهبود روند پس از جلسه" numericValue={89} isPercent deltaPercent={8} tone="emerald" sparkPoints={[70, 74, 76, 80, 84, 86, 89]} />
      </div>

      {/* Row 2 Right (8 Cols): SHAP Feature Attribution + Human-Approved Outreach */}
      <section className="col-span-12 xl:col-span-8 rounded-panel border border-border/80 bg-surface/85 p-6 shadow-panel backdrop-blur-glass">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-extrabold text-text-primary">
              سهم ویژگی‌ها در پیش‌بینی مدل هشدار زودهنگام (SHAP Feature Attribution)
            </h2>
            <p className="text-xs text-text-muted mt-1">
              نسبت‌های زیر سهم آماری هر متغیر در خروجی مدل را نشان می‌دهند و به معنای علیت قطعی یا تشخیص فردی نیستند.
            </p>
          </div>
          <span className="rounded-pill border border-warning/40 bg-warning/15 px-3.5 py-1 text-xs font-bold text-warning">
            پرونده منتخب: امیرحسین رضایی (دوازدهم ریاضی)
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-canvas/70 p-4 space-y-4">
            <h3 className="text-xs font-bold text-ai-cyan">سهم متغیرهای آموزشی در سیگنال بررسی:</h3>
            {shapFeatures.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-secondary font-medium">{f.label}</span>
                  <span className="font-extrabold text-text-primary">{formatFaPercent(f.share)} سهم مدل</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-surface-raised overflow-hidden">
                  <div style={{ width: `${f.share}%` }} className={`h-full rounded-full bg-gradient-to-l ${f.barClass}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-canvas/70 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-warning">
                <UserCheck className="h-4 w-4" aria-hidden="true" />
                <span>پیش‌نویس پیام حمایتی (نیازمند تایید و ارسال توسط مشاور)</span>
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed my-3 bg-surface p-3 rounded-lg border border-border">
              گزینه انتخابی دانش‌آموز در فرم آموزشی: «عدم حضور در جلسه آنلاین روز آلودگی هوا و نیاز به جزوه صوتی جلسه چهارشنبه»
            </p>
            <div className="flex gap-2.5">
              <button type="button" className="flex-1 rounded-lg bg-success/20 border border-success/40 py-2.5 text-xs font-bold text-success hover:bg-success/30">
                تایید مشاور و ارسال جزوه جبرانی
              </button>
              <button type="button" className="flex-1 rounded-lg bg-ai-indigo py-2.5 text-xs font-bold text-text-primary hover:bg-ai-violet">
                هماهنگی جلسه مشاوره با اطلاع والدین
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2 Left (4 Cols): Priority Queue */}
      <section className="col-span-12 xl:col-span-4 rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-text-primary">نوبت بررسی حمایتی مشاور</h3>
          <span className="text-xs text-ai-violet font-semibold">مشاهده همه ←</span>
        </div>
        <div className="space-y-3">
          {priorityQueue.map((st) => (
            <div key={st.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-raised/70 p-3">
              <div>
                <div className="text-xs font-bold text-text-primary">{st.name}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{st.grade}</div>
              </div>
              <span className="rounded-md border border-warning/40 bg-warning/15 px-2.5 py-1 text-xs font-bold text-warning">
                {st.statusLabel} ({formatFaPercent(st.score)})
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```
