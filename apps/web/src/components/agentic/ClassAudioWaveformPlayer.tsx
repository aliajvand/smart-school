'use client';

import React, { useState } from 'react';
import { Play, Pause, Clock3, AudioLines, RotateCcw } from 'lucide-react';
import { formatLtrTimestamp } from '@/lib/formatters';

export interface AudioTopic {
  id: string;
  title: string;
  startSeconds?: number;
  timestampSeconds?: number;
  summary?: string;
  confidence?: number;
}

export interface ClassAudioWaveformPlayerProps {
  title?: string;
  courseTitle?: string;
  durationSeconds?: number;
  samples?: number[];
  topics?: AudioTopic[];
  initialSeconds?: number;
  onSeek?: (seconds: number) => void;
}

const defaultSamples = [
  12, 24, 45, 68, 85, 92, 78, 64, 52, 60,
  74, 90, 82, 70, 55, 40, 62, 88, 95, 75,
  60, 45, 55, 70, 84, 92, 80, 65, 50, 40,
  48, 62, 78, 90, 85, 72, 58, 48, 65, 82,
  94, 88, 70, 55, 65, 80, 90, 75, 60, 40
];

const defaultTopics: AudioTopic[] = [
  {
    id: 'top-1',
    startSeconds: 0,
    title: 'مقدمه و یادآوری بردار سرعت و مکان',
    summary: 'بررسی مفهوم شیب خط در نمودار مکان-زمان و تعریف سرعت لحظه‌ای.',
  },
  {
    id: 'top-2',
    startSeconds: 194, // 03:14
    title: 'توضیح حرکت شتاب‌دار و اثبات روابط',
    summary: 'تحلیل مساحت زیر نمودار سرعت-زمان و اثبات فرمول مستقل از زمان.',
  },
  {
    id: 'top-3',
    startSeconds: 600, // 10:00
    title: 'حل مثال نمونه: سقوط آزاد با شتاب ثابت',
    summary: 'بررسی سقوط گلوله از ارتفاع h با شتاب گرانشی g=9.8.',
  },
  {
    id: 'top-4',
    startSeconds: 1320, // 22:00
    title: 'نکات تستی کنکور و خطاهای رایج علامت شتاب',
    summary: 'قرارداد جهت مثبت محور و تفکیک حرکت کندشونده از تندشونده.',
  },
];

export function ClassAudioWaveformPlayer({
  title = 'پلیر صوتی کلاس و جزوه هوشمند',
  courseTitle = 'کلاس فیزیک ۳ — جلسه ۶: توضیح حرکت شتاب‌دار',
  durationSeconds = 1730, // 28:50
  samples = defaultSamples,
  topics = defaultTopics,
  initialSeconds = 194, // 03:14
  onSeek,
}: ClassAudioWaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(initialSeconds);

  const seek = (sec: number) => {
    const clamped = Math.max(0, Math.min(durationSeconds, sec));
    setCurrentSeconds(clamped);
    onSeek?.(clamped);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      dir="rtl"
      aria-label={title}
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isPlaying ? 'توقف پخش صوتی' : 'پخش صوت کلاس'}
            onClick={togglePlay}
            className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-ai-indigo to-ai-cyan text-canvas shadow-ai transition-transform duration-fast hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ms-0.5" />}
          </button>

          <div>
            <h3 className="text-sm font-extrabold text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
              <AudioLines className="h-3.5 w-3.5 text-ai-cyan" aria-hidden="true" />
              <span>{courseTitle}</span>
            </p>
          </div>
        </div>

        {/* Timestamps in LTR monospace */}
        <div
          dir="ltr"
          className="math-ltr flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 font-mono text-xs font-bold text-text-secondary"
        >
          <span className="text-ai-cyan">{formatLtrTimestamp(currentSeconds)}</span>
          <span className="text-text-muted">/</span>
          <span>{formatLtrTimestamp(durationSeconds)}</span>
        </div>
      </div>

      {/* Waveform Bar Visualizer */}
      <div
        dir="ltr"
        role="slider"
        aria-label="موقعیت زمانی صوت"
        aria-valuemin={0}
        aria-valuemax={durationSeconds}
        aria-valuenow={currentSeconds}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seek(currentSeconds + 5);
          if (e.key === 'ArrowLeft') seek(currentSeconds - 5);
        }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          seek(((e.clientX - r.left) / r.width) * durationSeconds);
        }}
        className="relative my-4 flex h-16 cursor-pointer items-center gap-[3px] rounded-lg border border-border/60 bg-canvas/60 px-3 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {samples.map((sample, i) => {
          const sec = (i / Math.max(1, samples.length - 1)) * durationSeconds;
          const played = sec <= currentSeconds;
          const isTopicNearby = topics.some((t) => {
            const topicSec = t.startSeconds ?? t.timestampSeconds ?? 0;
            return Math.abs(topicSec - sec) < 25;
          });

          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-colors duration-fast ${
                played
                  ? 'bg-ai-cyan shadow-sm'
                  : isTopicNearby
                  ? 'bg-ai-violet/80'
                  : 'bg-surface-raised'
              }`}
              style={{ height: `${Math.max(14, Math.min(100, sample))}%` }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Interactive Topic Markers */}
      <div className="space-y-2 mt-4">
        <h4 className="text-xs font-bold text-text-muted">نکات و سرفصل‌های نشانه‌گذاری شده:</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {topics.map((t) => {
            const topicSec = t.startSeconds ?? t.timestampSeconds ?? 0;
            const isActive = Math.abs(topicSec - currentSeconds) < 60;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => seek(topicSec)}
                className={`flex items-start justify-between gap-2.5 rounded-xl border p-3 text-start transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                  isActive
                    ? 'border-ai-cyan/50 bg-ai-cyan/10 shadow-ai'
                    : 'border-border bg-surface-raised/70 hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-text-primary">{t.title}</div>
                  {t.summary && (
                    <div className="text-[11px] text-text-secondary mt-1 line-clamp-1">
                      {t.summary}
                    </div>
                  )}
                </div>
                <span
                  dir="ltr"
                  className="math-ltr inline-flex shrink-0 items-center gap-1 rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-ai-cyan border border-border"
                >
                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                  <span>{formatLtrTimestamp(topicSec)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
