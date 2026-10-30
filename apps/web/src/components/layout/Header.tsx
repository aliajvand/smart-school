'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, Moon, Database, ShieldCheck, UserCheck, LogOut, LogIn } from 'lucide-react';
import { AgentStatusPill } from '@/components/agentic/AgentStatusPill';
import { useAuth, UserRole } from '@/context/AuthContext';

export interface HeaderProps {
  roleScope: 'teacher' | 'principal';
  onRoleScopeChange: (scope: 'teacher' | 'principal') => void;
  apiStatus?: 'connected' | 'offline_mock' | 'error';
  agentMessage?: string;
  agentProgress?: number;
}

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  student: { label: 'دانش‌آموز', color: 'border-ai-cyan/40 bg-ai-cyan/15 text-ai-cyan' },
  teacher: { label: 'معلم و مربی', color: 'border-ai-indigo/40 bg-ai-indigo/15 text-text-primary' },
  counselor: { label: 'مشاور EWS', color: 'border-warning/40 bg-warning/15 text-warning' },
  principal: { label: 'مدیر کل مدرسه', color: 'border-success/40 bg-success/15 text-success' },
};

export function Header({
  roleScope,
  onRoleScopeChange,
  apiStatus = 'offline_mock',
  agentMessage = 'در حال تولید ۵۵ نسخه پارامتریک...',
  agentProgress = 78,
}: HeaderProps) {
  const router = useRouter();
  const { user, role, quickLogin, logout, isAuthenticated } = useAuth();

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
  const currentRoleConfig = ROLE_LABELS[role] || ROLE_LABELS.teacher;

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const target = e.target.value as UserRole;
    await quickLogin(target);
    if (target === 'student') router.push('/student');
    else if (target === 'counselor') router.push('/counselor');
    else if (target === 'teacher') router.push('/dashboard');
    else if (target === 'principal') router.push('/dashboard');
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-canvas/85 px-4 sm:px-6 py-3 backdrop-blur-glass">
      {/* 1. Floating AI Status Pill */}
      <AgentStatusPill
        status="thinking"
        message={agentMessage}
        progress={agentProgress}
      />

      {/* 2. Global RTL Search Bar */}
      <div className="relative flex-1 max-w-xs hidden xl:block">
        <Search
          className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="جستجو در دانش‌آموزان، آزمون‌ها و کلاس‌ها"
          placeholder="جستجو در دانش‌آموزان، آزمون‌ها و ..."
          className="w-full rounded-lg border border-border bg-surface py-1.5 ps-10 pe-4 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
        />
      </div>

      {/* 3. Controls, Badges & Profile */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Data Source Badge */}
        <div
          role="status"
          aria-label={apiStatusConfig.text}
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${apiStatusConfig.classes}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{apiStatusConfig.text}</span>
        </div>

        {/* 4-Role Quick Switcher Dropdown */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface p-1">
          <span className="text-[10px] text-text-muted ps-1.5 font-bold hidden sm:inline">نقش فعال:</span>
          <select
            value={role}
            onChange={handleRoleChange}
            className={`rounded-md border px-2 py-0.5 text-xs font-extrabold focus:outline-none cursor-pointer ${currentRoleConfig.color}`}
            aria-label="انتخاب نقش کاربری"
          >
            <option value="student">🎓 دانش‌آموز (سارا حسینی)</option>
            <option value="teacher">👨‍🏫 معلم / مربی (دکتر مرادی)</option>
            <option value="counselor">🧠 مشاور EWS (استاد کمالی)</option>
            <option value="principal">🏛️ مدیر کل (مهندس رضایی)</option>
          </select>
        </div>

        {/* Scope Switcher (Teacher vs Principal) */}
        {(role === 'teacher' || role === 'principal') && (
          <div className="hidden lg:flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => onRoleScopeChange('teacher')}
              aria-pressed={roleScope === 'teacher'}
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-colors ${
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
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-colors ${
                roleScope === 'principal'
                  ? 'bg-ai-indigo text-text-primary shadow-ai'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              کل مجتمع (۱۲٫۵k)
            </button>
          </div>
        )}

        {/* Login / Logout Button */}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            title="خروج از حساب کاربری"
            className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-text-secondary hover:text-danger hover:border-danger/40 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">خروج</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 rounded-lg bg-ai-indigo px-2.5 py-1.5 text-xs font-bold text-text-primary shadow-ai"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>ورود</span>
          </Link>
        )}

        {/* Theme & Notifications */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="اعلان‌ها"
            className="relative rounded-lg border border-border bg-surface p-1.5 text-text-secondary hover:text-text-primary"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span
              className="absolute -top-1 -end-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-extrabold text-white"
            >
              ۳
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
