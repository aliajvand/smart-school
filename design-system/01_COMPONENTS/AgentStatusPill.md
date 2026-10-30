# AgentStatusPill

## 1. Role & User Experience Intent
A compact, floating progress indicator for teachers and administrators. It makes background AI work observable (generation, grading, transcription) without pretending that the model is infallible. The status text is the primary source of meaning; glow is secondary and stops when work completes.

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 backdrop-blur-glass border border-border/80 rounded-pill shadow-panel`.
- Active Thinking Halo: `shadow-ai border-ai-violet/50` paired with `animate-agent-pulse motion-reduce:animate-none`.
- Semantic Status Tokens: `text-ai-cyan`, `text-success`, `text-warning`, `text-danger`, `text-text-muted`.
- Numeral Formatting: Progress percentages use `formatFaPercent(progress)` (`Intl.NumberFormat('fa-IR')`).

## 3. Visual States Specification
- **Idle (`idle`):** Muted dot (`bg-text-muted`), neutral glass fill, text «آماده‌به‌کار».
- **Thinking (`thinking`):** Gradient dot (`from-ai-violet via-ai-indigo to-ai-cyan`), `animate-agent-pulse motion-reduce:animate-none`, `shadow-ai`, `aria-live="polite"`.
- **Success (`success`):** `text-success` icon, explicit Persian count, animation stops.
- **Warning (`warning`):** `text-warning` icon, review-oriented label.
- **Error (`error`):** `text-danger` icon, concise failure reason, retry action.

## 4. API & Prop Contract
```ts
export type AgentStatus = 'idle' | 'thinking' | 'success' | 'warning' | 'error';

export interface AgentStatusPillProps {
  status: AgentStatus;
  message: string;
  detail?: string;
  progress?: number; // 0..100; formatted via formatFaPercent
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}
```

## 5. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Circle, ArrowUpLeft } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export type AgentStatus = 'idle' | 'thinking' | 'success' | 'warning' | 'error';

export interface AgentStatusPillProps {
  status: AgentStatus;
  message: string;
  detail?: string;
  progress?: number;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const styles = {
  idle: { icon: Circle, color: 'text-text-muted', dot: 'bg-text-muted' },
  thinking: { icon: Sparkles, color: 'text-ai-cyan', dot: 'bg-gradient-to-r from-ai-violet via-ai-indigo to-ai-cyan' },
  success: { icon: CheckCircle2, color: 'text-success', dot: 'bg-success' },
  warning: { icon: AlertTriangle, color: 'text-warning', dot: 'bg-warning' },
  error: { icon: AlertCircle, color: 'text-danger', dot: 'bg-danger' },
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
  const s = styles[status];
  const Icon = s.icon;
  const isThinking = status === 'thinking';

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      className={`inline-flex max-w-full items-center gap-3 rounded-pill border bg-surface/85 px-4 py-2.5 text-sm text-text-primary backdrop-blur-glass transition-all duration-base ease-standard ${
        isThinking ? 'border-ai-violet/50 shadow-ai' : 'border-border/80 shadow-panel'
      } ${className}`}
    >
      <span
        className={`relative flex h-2.5 w-2.5 shrink-0 rounded-pill ${s.dot} ${
          isThinking ? 'animate-agent-pulse motion-reduce:animate-none' : ''
        }`}
        aria-hidden="true"
      />
      <Icon className={`h-4 w-4 shrink-0 ${s.color}`} aria-hidden="true" />
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
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-pill px-2.5 text-xs font-semibold text-ai-cyan hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span>{actionLabel}</span>
          <ArrowUpLeft className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
```

## 6. Flutter Mobile Blueprint
```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import 'school_tokens.dart';

enum AgentStatus { idle, thinking, success, warning, error }

class AgentStatusPill extends StatelessWidget {
  const AgentStatusPill({
    super.key,
    required this.status,
    required this.message,
    this.detail,
    this.progress,
    this.onAction,
    this.actionLabel,
  });

  final AgentStatus status;
  final String message;
  final String? detail;
  final double? progress;
  final VoidCallback? onAction;
  final String? actionLabel;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).extension<SchoolTokens>()!;
    final color = switch (status) {
      AgentStatus.success => t.success,
      AgentStatus.warning => t.warning,
      AgentStatus.error => t.danger,
      AgentStatus.thinking => t.aiCyan,
      AgentStatus.idle => t.textMuted,
    };

    return ClipRRect(
      borderRadius: BorderRadius.circular(t.radiusPill),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: t.blurGlassSigma, sigmaY: t.blurGlassSigma),
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: t.space4, vertical: t.space2),
          decoration: BoxDecoration(
            color: t.surface.withValues(alpha: 0.85),
            border: Border.all(
              color: status == AgentStatus.thinking ? t.aiViolet.withValues(alpha: 0.55) : t.border,
            ),
            borderRadius: BorderRadius.circular(t.radiusPill),
            boxShadow: status == AgentStatus.thinking ? t.aiAuraShadow : t.panelShadow,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              SizedBox(width: t.space2),
              Flexible(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(message, style: TextStyle(color: t.textPrimary, fontWeight: FontWeight.w600)),
                    if (detail != null)
                      Text(detail!, style: TextStyle(color: t.textMuted, fontSize: 12)),
                  ],
                ),
              ),
              if (progress != null) ...[
                SizedBox(width: t.space2),
                Text(
                  SchoolTokens.formatFaPercent(progress!),
                  style: TextStyle(color: t.textSecondary, fontWeight: FontWeight.bold),
                ),
              ],
              if (onAction != null && actionLabel != null)
                TextButton(onPressed: onAction, child: Text(actionLabel!)),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 7. Interactive Micro-interactions
- Uses `animate-agent-pulse` from `tailwind.config.ts` and automatically disables looping animations when `prefers-reduced-motion: reduce` is active (`motion-reduce:animate-none`).
