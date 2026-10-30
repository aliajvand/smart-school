'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Circle } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'success' | 'warning' | 'error';

export interface AgentStatusPillProps {
  status: AgentStatus;
  message: string;
  detail?: string;
  progress?: number;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: Circle,
    textColor: 'text-text-muted',
    dotClass: 'bg-text-muted',
    borderClass: 'border-border/80',
    ariaLabel: 'دستیار در حالت آماده‌به‌کار',
  },
  listening: {
    icon: Sparkles,
    textColor: 'text-ai-cyan',
    dotClass: 'bg-ai-cyan',
    borderClass: 'border-ai-cyan/40 shadow-ai',
    ariaLabel: 'دستیار در حال شنیدن',
  },
  thinking: {
    icon: Sparkles,
    textColor: 'text-ai-cyan',
    dotClass: 'bg-gradient-to-r from-ai-violet via-ai-indigo to-ai-cyan',
    borderClass: 'border-ai-violet/50 shadow-ai',
    ariaLabel: 'دستیار در حال پردازش',
  },
  success: {
    icon: CheckCircle2,
    textColor: 'text-success',
    dotClass: 'bg-success',
    borderClass: 'border-success/40',
    ariaLabel: 'عملیات با موفقیت انجام شد',
  },
  warning: {
    icon: AlertTriangle,
    textColor: 'text-warning',
    dotClass: 'bg-warning',
    borderClass: 'border-warning/40',
    ariaLabel: 'هشدار یا نیاز به بازبینی',
  },
  error: {
    icon: AlertCircle,
    textColor: 'text-danger',
    dotClass: 'bg-danger',
    borderClass: 'border-danger/40',
    ariaLabel: 'خطا در اجرای فرآیند',
  },
} as const;

export function AgentStatusPill({
  status,
  message,
  detail,
  progress,
  onAction,
  actionLabel,
  className = '',
}: AgentStatusPillProps) {
  const conf = statusConfig[status] || statusConfig.idle;
  const Icon = conf.icon;
  const isThinking = status === 'thinking' || status === 'listening';

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      aria-label={`${conf.ariaLabel}: ${message}`}
      className={`inline-flex max-w-full items-center gap-3 rounded-pill border bg-surface/85 px-4 py-2.5 text-sm text-text-primary backdrop-blur-glass transition-all duration-base ease-standard ${conf.borderClass} ${className}`}
    >
      <span
        className={`relative flex h-2.5 w-2.5 shrink-0 rounded-pill ${conf.dotClass} ${
          isThinking ? 'animate-agent-pulse motion-reduce:animate-none' : ''
        }`}
        aria-hidden="true"
      />
      <Icon className={`h-4 w-4 shrink-0 ${conf.textColor}`} aria-hidden="true" />
      <span className="min-w-0">
        <span className="block truncate font-semibold">{message}</span>
        {detail && <span className="block truncate text-xs text-text-muted">{detail}</span>}
      </span>
      {typeof progress === 'number' && (
        <span className="shrink-0 text-xs font-bold text-text-secondary">
          {formatFaPercent(progress)}
        </span>
      )}
      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="ms-1.5 shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-text-secondary hover:border-focus hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
