'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Smartphone,
  BookOpen,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

interface NavItem {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'داشبورد دبیر و مدیر',
    sublabel: 'Teacher & Principal',
    icon: LayoutDashboard,
    allowedRoles: ['teacher', 'principal', 'counselor'],
  },
  {
    href: '/counselor',
    label: 'مشاوره و پایش EWS',
    sublabel: 'Counselor & Warning',
    icon: ShieldAlert,
    allowedRoles: ['counselor', 'principal'],
  },
  {
    href: '/student',
    label: 'کلاس هوشمند دانش‌آموز',
    sublabel: 'Student Smart Class',
    icon: GraduationCap,
    allowedRoles: ['student', 'principal'],
  },
  {
    href: '/studio',
    label: 'استودیو و رادار تقلب',
    sublabel: 'Studio & Integrity',
    icon: BookOpen,
    allowedRoles: ['teacher', 'principal'],
  },
  {
    href: '/mobile-preview',
    label: 'پیش‌نمایش موبایل و اسکن',
    sublabel: 'Flutter & OpenCV Scanner',
    icon: Smartphone,
    allowedRoles: ['student', 'teacher', 'counselor', 'principal'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();

  return (
    <aside className="hidden lg:flex w-[264px] shrink-0 flex-col justify-between border-s border-border/80 bg-surface/90 p-5 backdrop-blur-glass min-h-screen">
      <div>
        {/* Brand Lockup */}
        <Link
          href="/dashboard"
          className="flex flex-col items-center text-center pb-5 mb-5 border-b border-border/80 group"
        >
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-panel border border-ai-cyan/30 bg-surface-raised shadow-ai transition-transform duration-fast group-hover:scale-105">
            <img
              src="/assets/svg/brand-icon.svg"
              alt="نشان مدرسه هوشمند آینده"
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-sm font-extrabold tracking-tight text-text-primary">
            مدرسه هوشمند آینده
          </h1>
          <p dir="ltr" className="text-[10px] text-text-muted mt-0.5">
            AI-Powered Smart School
          </p>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="منوی اصلی سامانه" className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
            const isPermitted = item.allowedRoles.includes(role);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                  isActive
                    ? 'bg-gradient-to-l from-ai-violet to-ai-indigo text-text-primary shadow-ai'
                    : isPermitted
                    ? 'text-text-muted hover:bg-surface-raised hover:text-text-secondary'
                    : 'text-text-disabled opacity-60 hover:opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-text-primary' : 'text-text-muted'}`} />
                  <div className="min-w-0 text-start">
                    <div className="truncate">{item.label}</div>
                    <div dir="ltr" className="text-[9px] opacity-70 truncate font-normal">
                      {item.sublabel}
                    </div>
                  </div>
                </div>
                {!isPermitted && (
                  <span title="دسترسی محدود به نقش‌های مجاز" className="shrink-0">
                    <Lock className="h-3 w-3 text-text-disabled" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        {/* Auth / Role Switch Quick Link */}
        <Link
          href="/login"
          className="flex items-center justify-between rounded-xl border border-ai-cyan/30 bg-surface-raised p-3 text-xs font-bold text-text-secondary hover:text-ai-cyan hover:border-ai-cyan/60 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-ai-cyan" />
            <span>ورود / خرید لایسنس</span>
          </div>
          <span className="text-[10px] bg-ai-cyan/15 text-ai-cyan px-2 py-0.5 rounded font-bold">
            ۴ نقش
          </span>
        </Link>

        {/* Bottom AI Promo Card */}
        <div className="relative overflow-hidden rounded-panel border border-ai-indigo/30 bg-gradient-to-b from-surface-elevated to-surface p-3.5 text-center shadow-panel">
          <div className="mb-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-warning">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>قدرت هوش مصنوعی</span>
          </div>
          <p className="text-[10px] text-text-secondary leading-relaxed">
            آموزش هدفمند، ارزشیابی پارامتریک و تصحیح هوشمند برگه‌های دست‌نویس با OpenCV
          </p>
        </div>
      </div>
    </aside>
  );
}
