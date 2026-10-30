'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  Smartphone,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface AppShellProps {
  children: React.ReactNode;
  apiStatus?: 'connected' | 'offline_mock' | 'error';
  agentMessage?: string;
  agentProgress?: number;
}

const mobileNavItems = [
  { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/counselor', label: 'مشاور EWS', icon: ShieldAlert },
  { href: '/student', label: 'دانش‌آموز', icon: GraduationCap },
  { href: '/studio', label: 'استودیو', icon: BookOpen },
  { href: '/mobile-preview', label: 'شبیه‌ساز', icon: Smartphone },
];

export function AppShell({
  children,
  apiStatus = 'offline_mock',
  agentMessage,
  agentProgress,
}: AppShellProps) {
  const [roleScope, setRoleScope] = useState<'teacher' | 'principal'>('teacher');
  const pathname = usePathname();

  return (
    <div dir="rtl" lang="fa" className="flex min-h-screen bg-canvas text-text-primary font-sans">
      {/* Right Sidebar (RTL primary navigation on desktop) */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          roleScope={roleScope}
          onRoleScopeChange={setRoleScope}
          apiStatus={apiStatus}
          agentMessage={agentMessage}
          agentProgress={agentProgress}
        />

        <main className="flex-1 p-4 sm:p-5 md:p-6 pb-24 lg:pb-6 overflow-x-hidden">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (UI/UX Pro Responsive Feature) */}
        <nav
          aria-label="ناوبری سریع موبایل"
          className="lg:hidden fixed bottom-0 start-0 end-0 z-40 border-t border-border/80 bg-surface/95 px-2 py-2 backdrop-blur-glass shadow-lg"
        >
          <div className="flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    isActive
                      ? 'text-ai-cyan'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-transform ${
                      isActive ? 'bg-ai-cyan/15 scale-105' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
