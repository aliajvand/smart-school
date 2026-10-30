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
  Settings,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'داشبورد دبیر و مدیر',
    sublabel: 'Teacher & Principal',
    icon: LayoutDashboard,
  },
  {
    href: '/counselor',
    label: 'مشاوره و پایش EWS',
    sublabel: 'Counselor & Warning',
    icon: ShieldAlert,
  },
  {
    href: '/student',
    label: 'کلاس هوشمند دانش‌آموز',
    sublabel: 'Student Smart Class',
    icon: GraduationCap,
  },
  {
    href: '/studio',
    label: 'استودیو و رادار تقلب',
    sublabel: 'Studio & Integrity',
    icon: BookOpen,
  },
  {
    href: '/mobile-preview',
    label: 'پیش‌نمایش موبایل',
    sublabel: 'Flutter Simulator',
    icon: Smartphone,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[264px] shrink-0 flex-col justify-between border-s border-border/80 bg-surface/90 p-5 backdrop-blur-glass min-h-screen">
      <div>
        {/* Brand Lockup */}
        <Link
          href="/dashboard"
          className="flex flex-col items-center text-center pb-6 mb-6 border-b border-border/80 group"
        >
          <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-panel border border-ai-cyan/30 bg-surface-raised shadow-ai transition-transform duration-fast group-hover:scale-105">
            <img
              src="/assets/svg/brand-icon.svg"
              alt="نشان مدرسه هوشمند آینده"
              className="h-14 w-14"
            />
          </div>
          <h1 className="text-base font-extrabold tracking-tight text-text-primary">
            مدرسه هوشمند آینده
          </h1>
          <p dir="ltr" className="text-[11px] text-text-muted mt-0.5">
            AI-Powered Smart School
          </p>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="منوی اصلی سامانه" className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                  isActive
                    ? 'bg-gradient-to-l from-ai-violet to-ai-indigo text-text-primary shadow-ai'
                    : 'text-text-muted hover:bg-surface-raised hover:text-text-secondary'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-text-primary' : 'text-text-muted'}`} />
                <div className="min-w-0 text-start">
                  <div className="truncate">{item.label}</div>
                  <div dir="ltr" className="text-[10px] opacity-70 truncate font-normal">
                    {item.sublabel}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom AI Promo Card */}
      <div className="relative overflow-hidden rounded-panel border border-ai-indigo/30 bg-gradient-to-b from-surface-elevated to-surface p-4 text-center shadow-panel">
        <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-bold text-warning">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>قدرت هوش مصنوعی</span>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          در خدمت آموزش هدفمند، ارزشیابی تشخیصی و تصحیح هوشمند برگه‌های دست‌نویس
        </p>
      </div>
    </aside>
  );
}
