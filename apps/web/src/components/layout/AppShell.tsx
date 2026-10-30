'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface AppShellProps {
  children: React.ReactNode;
  apiStatus?: 'connected' | 'offline_mock' | 'error';
  agentMessage?: string;
  agentProgress?: number;
}

export function AppShell({
  children,
  apiStatus = 'offline_mock',
  agentMessage,
  agentProgress,
}: AppShellProps) {
  const [roleScope, setRoleScope] = useState<'teacher' | 'principal'>('teacher');

  return (
    <div dir="rtl" lang="fa" className="flex min-h-screen bg-canvas text-text-primary font-sans">
      {/* Right Sidebar (RTL primary navigation) */}
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

        <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
