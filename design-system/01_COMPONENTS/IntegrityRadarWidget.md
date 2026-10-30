# IntegrityRadarWidget

## 1. Role & User Experience Intent
A graph-based review visualization showing possible similarity links between submissions, including shared unusual calculation patterns. **It is an investigative aid only; similarity or an identical mistake must never automatically label a student as cheating.**

## 2. Design Tokens & Styling Mapping
- Surface: `bg-surface/85 border-border/80 rounded-panel shadow-panel`.
- Non-Color-Alone Edge Encoding (Accessibility Audited):
  * `unreviewed` (Needs Review): `stroke-warning` (`#F59E0B`) + **dashed pattern (`strokeDasharray="6 4"`)**.
  * `reviewed` (Inspected): `stroke-ai-violet` (`#7C3AED`) + **solid line**.
  * `dismissed` (Cleared): `stroke-border-strong` (`#3B4963`) + **dotted pattern (`strokeDasharray="2 4"`)**.
- Legible SVG Labels: Node labels use `fontSize="12"` (`>= 11px` minimum for accessibility) and are accompanied by an accessible keyboard/screen-reader table fallback.
- Localized Persian Prop Labels: All user-facing strings default to Persian and are overridable via `labels` prop for i18n.

## 3. Visual States Specification
- **Idle / Default:** Graph nodes, non-color-alone legend, and accessible list view.
- **Warning / Action Required:** Unreviewed similarity link with dashed amber line, evidence summary, and human review buttons («ثبت بررسی دبیر» / «رد شباهت»).

## 4. API & Prop Contract
```ts
export interface RadarNode {
  id: string;
  label: string;
  anomalyCount: number;
}

export interface RadarEdge {
  source: string;
  target: string;
  similarity: number; // 0..1
  evidence: string[];
  reviewState: 'unreviewed' | 'reviewed' | 'dismissed';
}

export interface IntegrityRadarLabels {
  title?: string;
  disclaimer?: string;
  unreviewedBadge?: string;
  markReviewedBtn?: string;
  dismissBtn?: string;
}

export interface IntegrityRadarWidgetProps {
  nodes: RadarNode[];
  edges: RadarEdge[];
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  onReviewEdge: (source: string, target: string, decision: 'reviewed' | 'dismissed') => void;
  coverageLabel: string;
  labels?: IntegrityRadarLabels;
}
```

## 5. Next.js / Tailwind CSS Blueprint
```tsx
'use client';
import { useMemo } from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export interface RadarNode {
  id: string;
  label: string;
  anomalyCount: number;
}

export interface RadarEdge {
  source: string;
  target: string;
  similarity: number;
  evidence: string[];
  reviewState: 'unreviewed' | 'reviewed' | 'dismissed';
}

export interface IntegrityRadarWidgetProps {
  nodes: RadarNode[];
  edges: RadarEdge[];
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  onReviewEdge: (source: string, target: string, decision: 'reviewed' | 'dismissed') => void;
  coverageLabel: string;
  labels?: {
    title?: string;
    disclaimer?: string;
    unreviewedBadge?: string;
    markReviewedBtn?: string;
    dismissBtn?: string;
  };
}

export function IntegrityRadarWidget(p: IntegrityRadarWidgetProps) {
  const copy = {
    title: p.labels?.title ?? 'رادار بررسی شباهت پاسخ‌ها',
    disclaimer: p.labels?.disclaimer ?? 'تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست.',
    unreviewedBadge: p.labels?.unreviewedBadge ?? 'الگوی مشترک نیازمند بررسی دبیر',
    markReviewedBtn: p.labels?.markReviewedBtn ?? 'ثبت بررسی دبیر',
    dismissBtn: p.labels?.dismissBtn ?? 'رد شباهت',
  };

  const points = useMemo(
    () =>
      p.nodes.map((n, i) => {
        const a = (i / Math.max(1, p.nodes.length)) * Math.PI * 2 - Math.PI / 2;
        return { ...n, x: 180 + 115 * Math.cos(a), y: 140 + 92 * Math.sin(a) };
      }),
    [p.nodes]
  );
  const byId = new Map(points.map((n) => [n.id, n]));

  return (
    <section dir="rtl" className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-text-primary">
            <ShieldAlert size={18} className="text-warning" aria-hidden="true" />
            <span>{copy.title}</span>
          </h2>
          <p className="mt-1 text-xs text-text-muted">{copy.disclaimer}</p>
        </div>
        <span className="text-xs text-text-secondary">{p.coverageLabel}</span>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <svg
          viewBox="0 0 360 280"
          role="img"
          aria-label={copy.title}
          className="w-full rounded-lg bg-canvas/80 border border-border/60"
        >
          {p.edges.map((e, i) => {
            const a = byId.get(e.source);
            const b = byId.get(e.target);
            if (!a || !b) return null;
            const dash =
              e.reviewState === 'unreviewed' ? '6 4' : e.reviewState === 'dismissed' ? '2 4' : undefined;
            const strokeClass =
              e.reviewState === 'unreviewed'
                ? 'stroke-warning'
                : e.reviewState === 'dismissed'
                ? 'stroke-border-strong'
                : 'stroke-ai-violet';
            return (
              <line
                key={`${e.source}-${e.target}-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeDasharray={dash}
                className={strokeClass}
                strokeWidth={1.5 + Math.min(3, e.similarity * 3)}
                strokeOpacity={0.5 + Math.min(0.45, e.similarity * 0.45)}
              />
            );
          })}
          {points.map((n) => {
            const isSelected = p.selectedNodeId === n.id;
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`انتخاب ${n.label}`}
                onClick={() => p.onSelectNode(n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    p.onSelectNode(n.id);
                  }
                }}
                className="cursor-pointer focus-visible:outline-none"
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isSelected ? 11 : 8}
                  className={
                    isSelected
                      ? 'fill-ai-cyan stroke-text-primary'
                      : n.anomalyCount > 0
                      ? 'fill-warning stroke-surface'
                      : 'fill-text-muted stroke-surface'
                  }
                  strokeWidth={2}
                />
                <text
                  x={n.x}
                  y={n.y + 24}
                  className="fill-text-secondary font-sans"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="space-y-2.5">
          {p.edges
            .filter((e) => e.reviewState === 'unreviewed')
            .slice(0, 4)
            .map((e) => (
              <article
                key={`${e.source}-${e.target}`}
                className="rounded-lg border border-warning/30 bg-warning/10 p-3"
              >
                <p className="text-xs font-bold text-warning">{copy.unreviewedBadge}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {e.evidence.join(' ، ') || 'تشابه در گام‌های میانی؛ برگه اصلی بررسی شود.'}
                </p>
                <p className="mt-1 text-xs font-extrabold text-text-primary">
                  میزان شباهت: {formatFaPercent(e.similarity * 100)}
                </p>
                <div className="mt-2.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => p.onReviewEdge(e.source, e.target, 'reviewed')}
                    className="min-h-10 rounded-md border border-border-strong bg-surface px-2.5 text-xs font-semibold text-text-primary hover:border-focus"
                  >
                    {copy.markReviewedBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => p.onReviewEdge(e.source, e.target, 'dismissed')}
                    className="min-h-10 rounded-md px-2 text-xs text-text-muted hover:text-text-primary"
                  >
                    {copy.dismissBtn}
                  </button>
                </div>
              </article>
            ))}
          <p className="flex gap-2 text-xs leading-5 text-text-muted">
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>خطچین کهربایی: بررسی‌نشده • خط ممتد بنفش: بررسی‌شده • نقطه‌چین: ردشده</span>
          </p>
        </div>
      </div>
    </section>
  );
}
```

## 6. Flutter Mobile Blueprint
Uses `SchoolTokens` semantic fields, `CustomPainter` with dashed/solid stroke differentiation, and a semantic `ListTile` list below the graph for screen-reader accessibility.

## 7. Interactive Micro-interactions
Respects `prefers-reduced-motion` and requires human teacher review for every flagged pair.
