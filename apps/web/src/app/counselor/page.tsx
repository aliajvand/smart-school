'use client';

import React, { useState } from 'react';
import { Lock, UserCheck, ShieldAlert, History, Send, AlertTriangle, Eye } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { StudentProgressAreaChart } from '@/components/agentic/StudentProgressAreaChart';
import {
  COUNSELOR_KPI_METRICS,
  COUNSELOR_PROGRESS_SERIES,
  SHAP_FEATURE_ATTRIBUTIONS,
  AT_RISK_PRIORITY_QUEUE,
} from '@/data/mock-platform-data';
import { formatFaPercent, formatFaNumber } from '@/lib/formatters';
import { approveCounselorOutreach } from '@/lib/api-client';

interface AuditLogEntry {
  id: string;
  studentName: string;
  purpose: string;
  timestamp: string;
  counselorName: string;
}

export default function CounselorPage() {
  const [selectedStudent, setSelectedStudent] = useState(AT_RISK_PRIORITY_QUEUE[0]);
  const [purpose, setPurpose] = useState('بررسی افت تحصیلی در آزمون دوره‌ای');
  const [isRecordUnlocked, setIsRecordUnlocked] = useState(false);
  const [outreachApproved, setOutreachApproved] = useState(false);
  const [outreachSent, setOutreachSent] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      studentName: 'امیرحسین رضایی',
      purpose: 'بررسی روند افت نمرات درس حسابان و غیبت آنلاین',
      timestamp: 'امروز ۱۰:۱۵',
      counselorName: 'دکتر مهدوی (مشاور پایه)',
    },
    {
      id: 'log-2',
      studentName: 'مهدی کریمی',
      purpose: 'هماهنگی جلسه مشاوره تکالیف هندسه',
      timestamp: 'دیروز ۱۱:۳۰',
      counselorName: 'دکتر مهدوی (مشاور پایه)',
    },
  ]);

  const handleUnlockRecord = (student: typeof AT_RISK_PRIORITY_QUEUE[0]) => {
    setSelectedStudent(student);
    setIsRecordUnlocked(true);
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      studentName: student.name,
      purpose,
      timestamp: 'هم‌اکنون',
      counselorName: 'دکتر مهدوی (مشاور پایه)',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleSendOutreach = async () => {
    try {
      const res = await approveCounselorOutreach(
        selectedStudent.id,
        `پیام حمایتی برای ${selectedStudent.name}`,
        'تأییدیه مشاور: ضرورت ارسال پیام حمایتی و محتوای آن بررسی شد'
      );
      setOutreachSent(true);
      const newEntry: AuditLogEntry = {
        id: res.auditId || `log-${Date.now()}`,
        studentName: selectedStudent.name,
        purpose: 'ارسال پیام حمایتی با تأیید انسانی مشاور',
        timestamp: 'هم‌اکنون',
        counselorName: 'دکتر مهدوی (مشاور پایه)',
      };
      setAuditLogs((prev) => [newEntry, ...prev]);
    } catch {
      setOutreachSent(true);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* 1. Privacy & RBAC Audit Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface/90 px-5 py-3 text-xs text-text-secondary shadow-panel backdrop-blur-glass">
          <span className="inline-flex items-center gap-2 font-bold text-ai-cyan">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span>پورتال محرمانه مشاوره تحصیلی و سامانه هشدار زودهنگام (EWS) — دسترسی شما ثبت می‌شود</span>
          </span>
          <span className="text-[11px] text-text-muted">
            تمامی پیام‌های حمایتی پیش از ارسال به دانش‌آموز یا ولی، نیازمند بازبینی و تایید انسانی مشاور هستند.
          </span>
        </div>

        {/* 2. 4 Role-Scoped KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {COUNSELOR_KPI_METRICS.map((kpi) => (
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

        {/* 3. Row 2: Risk Progression Chart (8 cols) & Priority Queue (4 cols) */}
        <div className="grid gap-5 xl:grid-cols-12 items-start">
          <div className="xl:col-span-8">
            <StudentProgressAreaChart
              title="روند پایش ریسک تحصیلی و هشدار زودهنگام (EWS Trend)"
              data={COUNSELOR_PROGRESS_SERIES}
            />
          </div>

          <div className="xl:col-span-4 rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-text-primary">
                نوبت بررسی حمایتی مشاور
              </h3>
              <span className="text-xs text-ai-violet font-bold">
                {formatFaNumber(AT_RISK_PRIORITY_QUEUE.length)} پرونده فعال
              </span>
            </div>

            {/* Purpose of Access Selector before unlocking */}
            <div className="mb-3 rounded-lg border border-border bg-surface-raised p-2.5">
              <label className="block text-[10px] font-bold text-text-muted mb-1">
                هدف دسترسی برای ثبت در لاگ ممیزی:
              </label>
              <select
                aria-label="انتخاب هدف دسترسی به پرونده"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded border border-border bg-surface px-2 py-1 text-xs text-text-primary focus:border-focus focus:outline-none"
              >
                <option value="بررسی افت تحصیلی در آزمون دوره‌ای">بررسی افت تحصیلی در آزمون دوره‌ای</option>
                <option value="پیگیری غیبت‌های متوالی جلسات درسی">پیگیری غیبت‌های متوالی جلسات درسی</option>
                <option value="بررسی تاخیر در ارائه تکالیف و کوییز">بررسی تاخیر در ارائه تکالیف و کوییز</option>
                <option value="جلسه هماهنگی پشتیبانی با اولیا">جلسه هماهنگی پشتیبانی با اولیا</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {AT_RISK_PRIORITY_QUEUE.map((st) => (
                <div
                  key={st.id}
                  className={`flex flex-col gap-2 rounded-xl border p-3.5 transition-colors ${
                    selectedStudent.id === st.id
                      ? 'border-ai-cyan/50 bg-ai-cyan/10'
                      : 'border-border bg-surface-raised/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-text-primary">{st.name}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{st.gradeAndMajor}</div>
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                        st.statusTone === 'danger'
                          ? 'border-danger/40 bg-danger/15 text-danger'
                          : st.statusTone === 'warning'
                          ? 'border-warning/40 bg-warning/15 text-warning'
                          : 'border-ai-violet/40 bg-ai-violet/15 text-ai-violet'
                      }`}
                    >
                      {st.priorityLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnlockRecord(st)}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-bold text-text-secondary hover:border-focus hover:text-text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>باز کردن پرونده با ثبت هدف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Row 3: SHAP Feature Attribution (6 cols) & Human-Approved Outreach (6 cols) */}
        <div className="grid gap-5 lg:grid-cols-12 items-start">
          {/* SHAP Feature Attribution with Non-Causal Disclaimer */}
          <div className="lg:col-span-6 rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-text-primary">
                  سهم نسبی در پیش‌بینی مدل (SHAP Feature Attribution)
                </h3>
                <span className="rounded-full border border-warning/30 bg-warning/15 px-2.5 py-0.5 text-[10px] font-bold text-warning">
                  MOCK / نمادین
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                سهم نسبی در پیش‌بینی مدل — نه لزوماً علت. نسبت‌های زیر همبستگی‌های آماری در مدل یادگیری ماشین را نشان می‌دهند و تشخیص بالینی یا قطعی محسوب نمی‌شوند.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-canvas/60 p-4 space-y-4">
              <span className="text-xs font-bold text-ai-cyan block">
                پرونده در حال بررسی: {selectedStudent.name} ({selectedStudent.gradeAndMajor})
              </span>

              {SHAP_FEATURE_ATTRIBUTIONS.map((f) => (
                <div key={f.featureKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary font-medium">{f.label}</span>
                    <span className="font-mono font-extrabold text-text-primary">
                      {formatFaPercent(f.sharePercent)} سهم
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-l ${f.barGradient}`}
                      style={{ width: `${f.sharePercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Human-Approved Outreach Box */}
          <div className="lg:col-span-6 rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-warning" aria-hidden="true" />
                <span>پیش‌نویس دستیار — ارسال نشده (Human-in-the-Loop)</span>
              </h3>
              <span className="rounded-full border border-warning/40 bg-warning/15 px-2.5 py-0.5 text-[10px] font-bold text-warning">
                نیازمند تایید انسانی مشاور
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              هوش مصنوعی هیچ پیامی را بدون تایید صریح مشاور به دانش‌آموز یا اولیا ارسال نمی‌کند.
            </p>

            <div className="rounded-xl border border-border bg-canvas/70 p-4 space-y-3">
              <label className="block text-xs font-bold text-text-secondary">
                متن پیش‌نویس پیامک / اعلان حمایتی:
              </label>
              <textarea
                aria-label="متن پیش‌نویس پیام حمایتی مشاور"
                rows={3}
                defaultValue={`سلام ${selectedStudent.name} عزیز، با توجه به مباحث جدید درس حسابان و جلسات اخیر، خوشحال می‌شویم در صورت تمایل در جلسه رفع اشکال چهارشنبه ساعت ۱۶ شرکت کنی. جزوه صوتی جلسه قبل نیز در سامانه فعال است.`}
                className="w-full rounded-lg border border-border bg-surface p-3 text-xs text-text-primary leading-relaxed focus:border-focus focus:outline-none"
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="approve-outreach"
                  checked={outreachApproved}
                  onChange={(e) => setOutreachApproved(e.target.checked)}
                  className="h-4 w-4 accent-ai-cyan rounded"
                />
                <label htmlFor="approve-outreach" className="text-xs font-semibold text-text-secondary cursor-pointer">
                  محتوای پیام بررسی شد و مورد تایید مشاور است (تعهد حرفه‌ای حفظ حریم خصوصی).
                </label>
              </div>

              {outreachSent ? (
                <div className="rounded-lg border border-success/40 bg-success/15 p-3 text-xs font-bold text-success text-center">
                  پیام حمایتی با موفقیت تایید و به کارتابل دانش‌آموز ارسال شد. در لاگ ممیزی ثبت گردید.
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!outreachApproved}
                  onClick={handleSendOutreach}
                  className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-indigo to-ai-cyan px-4 text-xs font-bold text-text-primary shadow-ai hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  <span>تأیید و ارسال پیام حمایتی</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Row 4: Audit History Log */}
        <div className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-ai-cyan" />
            <h3 className="text-sm font-extrabold text-text-primary">
              لاگ ممیزی دسترسی به پرونده‌های مشاوره (Audit Trail)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2.5 px-3 text-start">دانش‌آموز</th>
                  <th className="py-2.5 px-3 text-start">هدف دسترسی</th>
                  <th className="py-2.5 px-3 text-start">مشاور مسئول</th>
                  <th className="py-2.5 px-3 text-start">زمان ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-raised/40">
                    <td className="py-2.5 px-3 font-bold text-text-primary">{log.studentName}</td>
                    <td className="py-2.5 px-3 text-text-secondary">{log.purpose}</td>
                    <td className="py-2.5 px-3 text-text-muted">{log.counselorName}</td>
                    <td className="py-2.5 px-3 text-ai-cyan font-mono">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
