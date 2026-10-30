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

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Control Bar for Simulator */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel border border-border bg-surface/90 p-4 shadow-panel backdrop-blur-glass">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-ai-cyan" />
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">
                شبیه‌ساز تعاملی اپلیکیشن موبایل مدرسه هوشمند (Flutter Mobile Preview)
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                تست و بررسی رابط کاربری Flutter بدون نیاز به راه‌اندازی شبیه‌ساز نیتیو
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

        {/* Mandatory Simulation Disclaimer */}
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-text-secondary flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
            <span>
              <strong>توجه فنی:</strong> ماژول‌های دوربین سخت‌افزاری، تبدیل فوریه ASR و پردازش ماتریسی OpenCV FFI در این پنجره مرورگر شبیه‌سازی (Simulated) شده‌اند.
            </span>
          </div>
          <span className="text-[11px] font-mono text-ai-cyan">
            ENV: NEXT_PUBLIC_SIMULATED_MOBILE
          </span>
        </div>

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

                  {/* Simulated Camera Viewfinder with 4 ArUco Corner Markers */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-dashed border-ai-cyan/50 bg-surface-raised flex items-center justify-center p-3">
                    {/* Simulated Paper Background */}
                    <div
                      className={`relative w-full h-full rounded-xl bg-slate-900 border border-border p-3 flex flex-col justify-between transition-transform duration-base ${
                        isPerspectiveCorrected ? 'scale-100 rotate-0' : 'scale-95 -rotate-2'
                      }`}
                    >
                      {/* 4 ArUco Markers at corners */}
                      <div className="absolute top-2 start-2 h-7 w-7 rounded bg-black border-2 border-ai-cyan flex items-center justify-center text-[9px] font-mono font-bold text-ai-cyan">
                        #0
                      </div>
                      <div className="absolute top-2 end-2 h-7 w-7 rounded bg-black border-2 border-ai-cyan flex items-center justify-center text-[9px] font-mono font-bold text-ai-cyan">
                        #1
                      </div>
                      <div className="absolute bottom-2 start-2 h-7 w-7 rounded bg-black border-2 border-ai-cyan flex items-center justify-center text-[9px] font-mono font-bold text-ai-cyan">
                        #2
                      </div>
                      <div className="absolute bottom-2 end-2 h-7 w-7 rounded bg-black border-2 border-ai-cyan flex items-center justify-center text-[9px] font-mono font-bold text-ai-cyan">
                        #3
                      </div>

                      {/* Paper Content Preview */}
                      <div className="pt-8 px-2 space-y-2">
                        <div className="flex justify-between text-[10px] text-text-muted border-b border-border pb-1">
                          <span>آزمون فیزیک دوازدهم</span>
                          <span>دانش‌آموز: سارا محمدی</span>
                        </div>
                        <div
                          dir="ltr"
                          className="math-ltr py-4 text-center font-mono text-base font-bold text-ai-cyan"
                        >
                          ∫₋₁¹ x² dx = [x³/3]₋₁¹ = 2/3
                        </div>
                      </div>

                      {/* Realtime Detected Score Badge */}
                      <div className="flex items-center justify-between rounded-lg border border-success/40 bg-success/20 p-2 text-xs font-bold text-success">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>تصحیح هوشمند Instant AI:</span>
                        </div>
                        <span className="font-mono text-sm">{formatFaScore(95, 100)}</span>
                      </div>
                    </div>

                    {/* Camera Bounding Wireframe Overlay */}
                    <div className="absolute inset-4 pointer-events-none rounded-xl border border-ai-cyan/70 shadow-ai animate-agent-pulse" />
                  </div>

                  {/* Quality Indicators & Controls */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-border bg-surface p-2.5">
                      <span className="text-[10px] text-text-muted block">شاخص وضوح (Laplacian):</span>
                      <span className="font-bold text-success">۸۴٪ — شارپنس عالی</span>
                    </div>
                    <div className="rounded-xl border border-border bg-surface p-2.5">
                      <span className="text-[10px] text-text-muted block">هم‌راستایی زوایا:</span>
                      <span className="font-bold text-ai-cyan">۰٫۴° انحراف (تطبیق شد)</span>
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
                      onClick={() => setIsScanningActive(!isScanningActive)}
                      className="flex-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-ai-indigo to-ai-cyan text-xs font-bold text-text-primary shadow-ai"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span>{isScanningActive ? 'تصحیح مجدد' : 'شروع اسکن'}</span>
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
                  <div className="rounded-2xl border border-border bg-surface p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-ai-cyan text-canvas"
                      >
                        {isPlayingAudio ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ms-0.5" />}
                      </button>
                      <span dir="ltr" className="math-ltr font-mono text-[11px] font-bold text-ai-cyan">
                        {formatLtrTimestamp(audioSeconds)} / 28:50
                      </span>
                    </div>

                    {/* Mini Waveform */}
                    <div className="flex h-10 items-center gap-1 px-1">
                      {[30, 60, 90, 45, 80, 100, 70, 50, 65, 85, 95, 40, 60, 75, 90, 55, 35].map((val, i) => (
                        <div
                          key={i}
                          style={{ height: `${val}%` }}
                          className={`flex-1 rounded-full ${i < 8 ? 'bg-ai-cyan' : 'bg-surface-raised'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timestamped Topics */}
                  <div className="space-y-1.5">
                    <h5 className="text-[11px] font-bold text-text-muted">نکات هماهنگ با صوت:</h5>
                    {[
                      { time: '00:00', title: 'مقدمه بردار مکان و سرعت' },
                      { time: '03:14', title: 'تحلیل مساحت زیر نمودار v-t', active: true },
                      { time: '10:00', title: 'حل مثال سقوط آزاد با شتاب g' },
                    ].map((t) => (
                      <div
                        key={t.time}
                        className={`flex items-center justify-between rounded-lg border p-2 text-xs ${
                          t.active
                            ? 'border-ai-cyan/50 bg-ai-cyan/10 font-bold text-text-primary'
                            : 'border-border bg-surface/50 text-text-secondary'
                        }`}
                      >
                        <span>{t.title}</span>
                        <span dir="ltr" className="math-ltr font-mono text-[10px] text-ai-cyan">
                          {t.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mini Pop Quiz */}
                  <div className="rounded-2xl border border-border bg-surface p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-warning">کوییز ۵ دقیقه‌ای</span>
                      <span className="text-[10px] text-danger font-bold">۰۴:۴۵ مانده</span>
                    </div>
                    <div
                      dir="ltr"
                      className="math-ltr rounded bg-canvas/70 p-2 text-center font-mono text-xs text-math font-bold"
                    >
                      z² = -3 ⟹ ((x² - 1)ˣ + b) = ?
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'opt-1', label: '۴۱' },
                        { id: 'opt-2', label: '۱۶۳' },
                        { id: 'opt-3', label: '۱۷ (پاسخ صحیح)' },
                        { id: 'opt-4', label: '۲۹' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedQuizOption(opt.id)}
                          className={`rounded-lg border p-1.5 text-center text-xs font-bold ${
                            selectedQuizOption === opt.id
                              ? 'border-success bg-success/20 text-success'
                              : 'border-border bg-surface-raised'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
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
