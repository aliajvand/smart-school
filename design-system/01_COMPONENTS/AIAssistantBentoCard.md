# AIAssistantBentoCard

## 1. Role & User Experience Intent
The centerpiece conversational AI widget on the right side of the dashboard («دستیار هوشمند آموزشی — آماده پاسخگویی به سوالات شماست...»). Because this card represents the active AI agent, it is one of the designated components permitted to use `shadow-ai` and the neon AI aura border (`border-ai-indigo/40`).

## 2. Design Tokens & Styling Mapping
- Card Surface: `bg-gradient-to-b from-surface-elevated via-surface to-canvas border border-ai-indigo/40 rounded-panel shadow-ai`.
- CTA Button: Pill button with `bg-gradient-to-r from-ai-indigo via-ai-violet to-ai-cyan text-text-primary shadow-ai`.

## 3. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export function AIAssistantBentoCard({ onStartChat }: { onStartChat?: () => void }) {
  return (
    <section
      dir="rtl"
      aria-labelledby="ai-assistant-card-title"
      className="relative flex flex-col items-center justify-between overflow-hidden rounded-panel border border-ai-indigo/40 bg-gradient-to-b from-surface-elevated via-surface to-canvas p-6 text-center shadow-ai"
    >
      <div className="relative my-2 flex h-36 w-36 items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-ai-violet/30 to-ai-cyan/30 blur-2xl animate-agent-pulse motion-reduce:animate-none"
        />
        <img
          src="/assets/svg/agent-thinking.svg"
          alt="آواتار دستیار هوشمند آموزشی"
          className="relative h-32 w-32"
        />
      </div>

      <div className="space-y-1.5">
        <h3 id="ai-assistant-card-title" className="text-lg font-extrabold text-text-primary">
          دستیار هوشمند آموزشی
        </h3>
        <p className="text-xs text-text-secondary">
          آماده پاسخگویی به سوالات، طرح آزمون پارامتریک و تحلیل نمرات شماست...
        </p>
      </div>

      <button
        type="button"
        onClick={onStartChat}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill border border-ai-violet/40 bg-gradient-to-r from-ai-indigo via-ai-violet to-ai-cyan px-6 py-2.5 text-xs font-bold text-text-primary shadow-ai transition-transform duration-fast hover:scale-[1.02] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span>شروع گفت‌وگو</span>
        <Sparkles className="h-3.5 w-3.5 text-text-primary" aria-hidden="true" />
      </button>
    </section>
  );
}
```
