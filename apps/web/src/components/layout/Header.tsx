'use client';

import React from 'react';
import { Search, Bell, Moon, Database, ShieldCheck } from 'lucide-react';
import { AgentStatusPill } from '@/components/agentic/AgentStatusPill';

export interface HeaderProps {
  roleScope: 'teacher' | 'principal';
  onRoleScopeChange: (scope: 'teacher' | 'principal') => void;
  apiStatus?: 'connected' | 'offline_mock' | 'error';
  agentMessage?: string;
  agentProgress?: number;
}

export function Header({
  roleScope,
  onRoleScopeChange,
  apiStatus = 'offline_mock',
  agentMessage = 'در حال تولید ۵۵ نسخه پارامتریک...',
  agentProgress = 78,
}: HeaderProps) {
  const apiStatusConfig = {
    connected: {
      text: 'متصل به سرور FastAPI',
      classes: 'border-success/40 bg-success/15 text-success',
      icon: ShieldCheck,
    },
    offline_mock: {
      text: 'سرور در دسترس نیست — داده نمونه',
      classes: 'border-warning/40 bg-warning/15 text-warning',
      icon: Database,
    },
    error: {
      text: 'خطا در ارتباط با سرور',
      classes: 'border-danger/40 bg-danger/15 text-danger',
      icon: Database,
    },
  }[apiStatus];

  const StatusIcon = apiStatusConfig.icon;

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 bg-canvas/85 px-6 py-3.5 backdrop-blur-glass">
      {/* 1. Floating AI Status Pill */}
      <AgentStatusPill
        status="thinking"
        message={agentMessage}
        progress={agentProgress}
      />

      {/* 2. Global RTL Search Bar */}
      <div className="relative flex-1 max-w-sm hidden md:block">
        <Search
          className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="جستجو در دانش‌آموزان، آزمون‌ها و کلاس‌ها"
          placeholder="جستجو در دانش‌آموزان، آزمون‌ها و ..."
          className="w-full rounded-lg border border-border bg-surface py-2 ps-10 pe-4 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
        />
      </div>

      {/* 3. Controls, Badges & Profile */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Data Source Badge (M3 / Gate requirement) */}
        <div
          role="status"
          aria-label={apiStatusConfig.text}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${apiStatusConfig.classes}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{apiStatusConfig.text}</span>
        </div>

        {/* Role-Scope Switcher (Explicitly labelled as Demo Control per §5) */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          <span className="text-[10px] text-text-muted px-1.5 font-medium select-none">
            کنترل نمایشی:
          </span>
          <button
            type="button"
            onClick={() => onRoleScopeChange('teacher')}
            aria-pressed={roleScope === 'teacher'}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
              roleScope === 'teacher'
                ? 'bg-ai-indigo text-text-primary shadow-ai'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            کلاس‌های من (۱۲۸)
          </button>
          <button
            type="button"
            onClick={() => onRoleScopeChange('principal')}
            aria-pressed={roleScope === 'principal'}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
              roleScope === 'principal'
                ? 'bg-ai-indigo text-text-primary shadow-ai'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            کل مجتمع (۱۲٫۵ هزار)
          </button>
        </div>

        {/* Notifications & Theme */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="اعلان‌ها"
            className="relative rounded-lg border border-border bg-surface p-2 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span
              className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-extrabold text-white"
              aria-label="۳ اعلان جدید"
            >
              ۳
            </span>
          </button>

          <button
            type="button"
            aria-label="تغییر تم"
            className="rounded-lg border border-border bg-surface p-2 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Moon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
