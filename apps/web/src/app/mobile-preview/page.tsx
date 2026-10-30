'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCw,
  Camera,
  Layers,
  Sparkles,
  Wifi,
  Battery,
  ShieldCheck,
  Check,
  RefreshCw,
  Upload,
  Cpu,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { formatFaScore, formatFaPercent, formatLtrTimestamp } from '@/lib/formatters';

export default function MobilePreviewPage() {
  const [activeScreen, setActiveScreen] = useState<'scanner' | 'classroom'>('scanner');
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel'>('iphone');
  const [isPerspectiveCorrected, setIsPerspectiveCorrected] = useState(true);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(194); // 03:14
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>('opt-3');

  // Live Backend OpenCV Pipeline State
  const [liveVisionData, setLiveVisionData] = useState<any>(null);
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);

  const runLiveOpenCvPipeline = async () => {
    setIsVisionLoading(true);
    setVisionError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/vision/test-synthetic-scan', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('خطا در ارتباط با سرور پردازش تصویر OpenCV.');
      }
      const data = await res.json();
      setLiveVisionData(data);
    } catch (err: any) {
      setVisionError(err.message || 'سرور بک‌اند در دسترس نیست.');
    } finally {
      setIsVisionLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsVisionLoading(true);
    setVisionError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/api/v1/vision/scan-sheet', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'خطا در ارزیابی تصویر برگه.');
      }
      const data = await res.json();
      setLiveVisionData(data);
    } catch (err: any) {
      setVisionError(err.message || 'خطا در بارگذاری برگه.');
    } finally {
      setIsVisionLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Control Bar for Simulator */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel border border-border bg-surface/90 p-4 shadow-panel backdrop-blur-glass">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-ai-cyan" />
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">
                شبیه‌ساز تعاملی اپلیکیشن موبایل و اسکنر OpenCV (Flutter & Vision Preview)
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                تست و بررسی رابط کاربری Flutter و خط لوله پردازش تصویر ArUco و تصحیح هوشمند
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Screen Tab Switcher */}
            <div className="flex rounded-lg border border-border bg-surface-raised p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveScreen('scanner')}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  activeScreen === 'scanner'
                    ? 'bg-ai-indigo text-text-primary shadow-ai'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                اسکنر پاسخ‌برگ ArUco
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen('classroom')}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  activeScreen === 'classroom'
                    ? 'bg-ai-indigo text-text-primary shadow-ai'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                کلاس صوتی و کوییز
              </button>
            </div>

            {/* Device Switcher */}
            <div className="flex rounded-lg border border-border bg-surface-raised p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDeviceModel('iphone')}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  deviceModel === 'iphone'
                    ? 'bg-surface text-ai-cyan'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                iPhone 15 Pro
              </button>
              <button
                type="button"
                onClick={() => setDeviceModel('pixel')}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  deviceModel === 'pixel'
                    ? 'bg-surface text-ai-cyan'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                Pixel 8
              </button>
            </div>
          </div>
        </div>

        {/* Live OpenCV Pipeline Trigger Card */}
        <div className="rounded-2xl border border-ai-cyan/30 bg-surface/90 p-4 backdrop-blur-glass shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ai-cyan/15 text-ai-cyan border border-ai-cyan/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-text-primary">
                موتور پردازش تصویر سرور (OpenCV + ArUco + Laplacian)
              </h3>
              <p className="text-[11px] text-text-muted">
                آزمون خط لوله تشخیص ۴ گوشه ArUco، رفع اعوجاج پرسپکتیو و تصحیح گام‌به‌گام با SymPy
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={runLiveOpenCvPipeline}
              disabled={isVisionLoading}
              className="rounded-xl bg-gradient-to-r from-ai-cyan to-ai-indigo px-4 py-2 text-xs font-bold text-text-primary shadow-ai hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isVisionLoading ? 'در حال پردازش...' : 'تست خط لوله با برگه استاندارد'}</span>
            </button>

            <label className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-colors flex items-center gap-2">
              <Upload className="h-3.5 w-3.5 text-ai-cyan" />
              <span>آپلود تصویر واقعی</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {visionError && (
          <div className="rounded-xl border border-danger/40 bg-danger/15 p-3 text-xs text-danger">
            {visionError}
          </div>
        )}

        {/* Live Vision Processing Results Display */}
        {liveVisionData && (
          <div className="rounded-2xl border border-success/40 bg-surface p-5 shadow-lg space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2 text-success font-extrabold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>نتیجه پردازش خط لوله نیتیو OpenCV و موتور ریاضی SymPy</span>
              </div>
              <span className="text-[11px] font-mono text-ai-cyan bg-canvas px-2.5 py-1 rounded border border-ai-cyan/30">
                وضعیت: {liveVisionData.alignment.status} | نمره کل: {liveVisionData.evaluation.total_score} از {liveVisionData.evaluation.max_score} ({liveVisionData.evaluation.grade_percent}٪)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-surface-raised p-3">
                <span className="text-[10px] text-text-muted block mb-1">شاخص وضوح و شارپنس (Laplacian):</span>
                <span className="text-xs font-bold text-success">
                  {liveVisionData.sharpness.score_percent}٪ — {liveVisionData.sharpness.status}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-surface-raised p-3">
                <span className="text-[10px] text-text-muted block mb-1">مارکرهای ArUco ردیابی‌شده:</span>
                <span className="text-xs font-bold text-ai-cyan">
                  {liveVisionData.alignment.markers_detected} مارکر گوشه (۴ گوشه قفل شد)
                </span>
              </div>

              <div className="rounded-xl border border-border bg-surface-raised p-3">
                <span className="text-[10px] text-text-muted block mb-1">تصحیح هموگرافی پرسپکتیو:</span>
                <span className="text-xs font-bold text-text-primary">
                  {liveVisionData.alignment.perspective_rectified ? 'انجام شد (سطح صاف A4)' : 'نیازی نبود'}
                </span>
              </div>
            </div>

            {/* Step breakdown */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-text-secondary">ارزیابی گام‌به‌گام راه‌حل دست‌نویس دانش‌آموز:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {liveVisionData.evaluation.steps.map((step: any) => (
                  <div key={step.step_index} className="rounded-xl border border-border bg-canvas p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-text-primary">
                      <span>گام {step.step_index}: {step.step_label}</span>
                      <span className="text-success font-mono">+{step.awarded_score}</span>
                    </div>
                    <div dir="ltr" className="text-[11px] font-mono text-ai-cyan bg-surface p-1.5 rounded border border-border">
                      {step.detected_latex}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted pt-1">
                      <span>دقت OCR: {Math.round(step.ocr_confidence * 100)}٪</span>
                      <span className="text-success font-semibold">تایید ریاضی SymPy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Device Presentation Stage */}
        <div className="flex justify-center py-4">
          {/* Phone Frame */}
          <div
            className={`relative mx-auto overflow-hidden border-[10px] border-surface-raised bg-canvas shadow-2xl transition-all duration-base ${
              deviceModel === 'iphone'
                ? 'w-[375px] h-[780px] rounded-[50px] ring-1 ring-border-strong'
                : 'w-[385px] h-[790px] rounded-[44px] ring-1 ring-border-strong'
            }`}
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2.5 start-1/2 -translate-x-1/2 z-50 flex h-6 w-28 items-center justify-between rounded-full bg-black px-3 text-[10px] text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-700" />
              <span className="h-2 w-2 rounded-full bg-ai-cyan/60" />
            </div>

            {/* Mobile Status Bar */}
            <div
              dir="ltr"
              className="flex items-center justify-between px-6 pt-3.5 pb-2 text-[11px] font-semibold text-text-secondary"
            >
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3.5 w-3.5" />
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Mobile Screen Content Area */}
            <div className="h-[calc(100%-74px)] overflow-y-auto px-4 py-2 text-start select-none">
              {activeScreen === 'scanner' ? (
                /* SCREEN 1: ArUco Scanner & Exam Grader */
                <div className="space-y-4">
                  {/* Scanner App Header */}
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Scan className="h-5 w-5 text-ai-cyan" />
                      <span className="text-xs font-bold text-text-primary">
                        اسکنر هوشمند پاسخ‌برگ ArUco
                      </span>
                    </div>
                    <span className="rounded-full border border-success/40 bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                      دوربین فعال
                    </span>
                  </div>

                  {/* Camera Viewfinder Simulation */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-slate-950 p-2 shadow-inner">
                    {/* Perspective Warp Overlay */}
                    <div
                      className={`relative h-full w-full rounded-xl border border-dashed border-ai-cyan/60 bg-surface/40 p-3 transition-transform duration-slow ${
                        isPerspectiveCorrected ? 'rotate-0 scale-100' : '-rotate-3 scale-95'
                      }`}
                    >
                      {/* 4 ArUco Markers Positioned at Corners */}
                      <div className="absolute top-2 start-2 flex h-7 w-7 items-center justify-center rounded border border-success bg-success/20 text-[9px] font-mono font-bold text-success">
                        #0
                      </div>
                      <div className="absolute top-2 end-2 flex h-7 w-7 items-center justify-center rounded border border-success bg-success/20 text-[9px] font-mono font-bold text-success">
                        #1
                      </div>
                      <div className="absolute bottom-2 end-2 flex h-7 w-7 items-center justify-center rounded border border-success bg-success/20 text-[9px] font-mono font-bold text-success">
                        #2
                      </div>
                      <div className="absolute bottom-2 start-2 flex h-7 w-7 items-center justify-center rounded border border-success bg-success/20 text-[9px] font-mono font-bold text-success">
                        #3
                      </div>

                      {/* Paper Simulation Content */}
                      <div className="my-8 rounded-lg bg-surface-raised/80 p-3 text-[11px] shadow-sm space-y-2 border border-border/80">
                        <div className="flex items-center justify-between border-b border-border pb-1.5">
                          <span className="font-bold text-text-primary">پاسخ‌برگ دیفرانسیل - سارا حسینی</span>
                          <span className="text-[10px] text-text-muted">کد: ۹۸۴۰۲</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] text-text-muted">سوال ۱: انتگرال معین چندجمله‌ای درجه دو</p>
                          <div dir="ltr" className="math-ltr rounded bg-canvas p-1.5 font-mono text-[10px] text-ai-cyan">
                            \int_{-1}^{1} (3x^2 - 2x + 1) \, dx = 4
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-success">
                          <span>✓ پادمشتق صحیح (F(x) = x^3 - x^2 + x)</span>
                          <span className="font-bold">+۱٫۰</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-success">
                          <span>✓ اعمال کران‌ها: (۱) - (-۳) = ۴</span>
                          <span className="font-bold">+۱٫۵</span>
                        </div>
                      </div>

                      {/* Realtime Detected Score Badge */}
                      <div className="flex items-center justify-between rounded-lg border border-success/40 bg-success/20 p-2 text-xs font-bold text-success">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>تصحیح هوشمند Instant AI:</span>
                        </div>
                        <span className="font-mono text-sm">{formatFaScore(2.5, 2.5)}</span>
                      </div>
                    </div>

                    {/* Camera Bounding Wireframe Overlay */}
                    <div className="absolute inset-4 pointer-events-none rounded-xl border border-ai-cyan/70 shadow-ai animate-agent-pulse" />
                  </div>

                  {/* Quality Indicators & Controls */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-border bg-surface p-2.5">
                      <span className="text-[10px] text-text-muted block">شاخص وضوح (Laplacian):</span>
                      <span className="font-bold text-success">۱۰۰٪ — شارپنس عالی</span>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-2.5">
                      <span className="text-[10px] text-text-muted block">هم‌راستایی زوایا:</span>
                      <span className="font-bold text-ai-cyan">۴ گوشه همگام (Homography)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPerspectiveCorrected(!isPerspectiveCorrected)}
                      className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-text-secondary hover:text-text-primary"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>{isPerspectiveCorrected ? 'نمای مایل' : 'اصلاح پرسپکتیو'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={runLiveOpenCvPipeline}
                      className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-ai-indigo to-ai-cyan text-xs font-bold text-text-primary shadow-ai"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>اجرای اسکن زنده</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* SCREEN 2: Student Smart Classroom */
                <div className="space-y-4">
                  {/* Classroom Header */}
                  <div className="flex items-center justify-between border-b border-border/80 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">کلاس فیزیک دوازدهم</h4>
                      <p className="text-[10px] text-text-muted">جلسه ۶: حرکت شتاب‌دار</p>
                    </div>
                    <span className="rounded-full border border-ai-violet/40 bg-ai-violet/15 px-2 py-0.5 text-[10px] font-bold text-ai-violet">
                      جزوه صوتی زنده
                    </span>
                  </div>

                  {/* Compact Audio Player Card */}
                  <div className="rounded-2xl border border-border bg-surface-raised p-3.5 space-y-3 shadow-panel">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-cyan text-slate-950 font-bold shadow-ai hover:scale-105 transition-transform"
                        >
                          {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ms-0.5" />}
                        </button>
                        <div>
                          <div className="text-xs font-bold text-text-primary">پادکست خلاصه تدریس</div>
                          <div className="text-[10px] text-text-muted">تولید خودکار با رونوشت ASR</div>
                        </div>
                      </div>
                      <span dir="ltr" className="font-mono text-xs font-semibold text-ai-cyan">
                        {formatLtrTimestamp(audioSeconds)} / 12:40
                      </span>
                    </div>

                    {/* Audio Waveform visualization */}
                    <div className="flex items-center gap-1 h-6 px-1">
                      {[15, 30, 60, 90, 45, 80, 100, 70, 40, 85, 95, 50, 65, 35, 75, 40, 20, 60, 85, 30].map(
                        (val, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${val}%` }}
                            className={`flex-1 rounded-full transition-all duration-fast ${
                              idx < 8 ? 'bg-ai-cyan' : 'bg-surface border border-border'
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Pop Quiz Component */}
                  <div className="rounded-2xl border border-border bg-surface p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">کوییز تشخیصی حین درس</span>
                      <span className="text-[10px] rounded bg-warning/15 text-warning font-bold px-1.5 py-0.5">
                        امتیاز +۱۰
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      در یک حرکت با شتاب ثابت، اگر سرعت اولیه صفر باشد، مسافت طی‌شده با کدام تناسب دارد؟
                    </p>

                    <div className="space-y-1.5">
                      {[
                        { id: 'opt-1', label: 'تناسب مستقیم با زمان (t)' },
                        { id: 'opt-2', label: 'تناسب با جذر زمان (√t)' },
                        { id: 'opt-3', label: 'تناسب با مربع زمان (t²)' },
                        { id: 'opt-4', label: 'مستقل از زمان است' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedQuizOption(opt.id)}
                          className={`flex w-full items-center justify-between rounded-xl border p-2 text-start text-[11px] font-medium transition-all ${
                            selectedQuizOption === opt.id
                              ? 'border-success/60 bg-success/15 text-success font-bold'
                              : 'border-border bg-surface-raised text-text-muted hover:text-text-primary'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {selectedQuizOption === opt.id && <Check className="h-3.5 w-3.5 text-success" />}
                        </button>
                      ))}
                    </div>

                    {selectedQuizOption === 'opt-3' && (
                      <div className="rounded-lg border border-success/30 bg-success/10 p-2 text-[10px] text-success font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>پاسخ صحیح! رابطه: x = (1/2) a t²</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="absolute bottom-0 inset-x-0 border-t border-border/80 bg-surface/95 px-6 py-2.5 flex items-center justify-between text-text-muted">
              <button
                type="button"
                onClick={() => setActiveScreen('scanner')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeScreen === 'scanner' ? 'text-ai-cyan' : 'hover:text-text-secondary'
                }`}
              >
                <Scan className="h-4 w-4" />
                <span>اسکنر</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('classroom')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                  activeScreen === 'classroom' ? 'text-ai-cyan' : 'hover:text-text-secondary'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>کلاس</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
