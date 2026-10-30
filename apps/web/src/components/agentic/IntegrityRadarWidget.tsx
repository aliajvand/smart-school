'use client';

import React, { useMemo, useState } from 'react';
import { ShieldAlert, Info, Check, X } from 'lucide-react';
import { formatFaPercent } from '@/lib/formatters';

export interface RadarNode {
  id: string;
  label: string;
  riskScore?: number;
  anomalyCount?: number;
}

export interface RadarEdge {
  source: string;
  target: string;
  similarity: number; // 0..100
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
  nodes?: RadarNode[];
  edges?: RadarEdge[];
  selectedNodeId?: string;
  onSelectNode?: (id: string) => void;
  onReviewEdge?: (source: string, target: string, decision: 'reviewed' | 'dismissed') => void;
  coverageLabel?: string;
  labels?: IntegrityRadarLabels;
}

const defaultNodes: RadarNode[] = [
  { id: 'st-sara', label: 'سارا محمدی', riskScore: 92 },
  { id: 'st-amir', label: 'امیرحسین رضایی', riskScore: 89 },
  { id: 'st-mehdi', label: 'مهدی کریمی', riskScore: 87 },
  { id: 'st-nima', label: 'نیما علوی', riskScore: 45 },
  { id: 'st-maryam', label: 'مریم کمالی', riskScore: 32 },
];

const defaultEdges: RadarEdge[] = [
  {
    source: 'st-sara',
    target: 'st-amir',
    similarity: 92,
    evidence: ['همپوشانی خطای جبری یکسان در مخرج کسر'],
    reviewState: 'unreviewed',
  },
  {
    source: 'st-amir',
    target: 'st-mehdi',
    similarity: 89,
    evidence: ['ساختار حل کاملاً یکسان بدون مراحل میانی'],
    reviewState: 'unreviewed',
  },
  {
    source: 'st-sara',
    target: 'st-mehdi',
    similarity: 87,
    evidence: ['همبستگی پارامتری مشکوک در نسخه آزمون'],
    reviewState: 'unreviewed',
  },
];

export function IntegrityRadarWidget({
  nodes = defaultNodes,
  edges = defaultEdges,
  selectedNodeId,
  onSelectNode,
  onReviewEdge,
  labels,
}: IntegrityRadarWidgetProps) {
  const [edgeList, setEdgeList] = useState<RadarEdge[]>(edges);
  const [selectedNode, setSelectedNode] = useState<string>(selectedNodeId || nodes[0]?.id || '');

  const copy = {
    title: labels?.title ?? 'رادار کشف تقلب و شباهت پاسخ‌ها',
    disclaimer:
      labels?.disclaimer ??
      'تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست.',
    unreviewedBadge: labels?.unreviewedBadge ?? 'الگوی مشترک نیازمند بررسی دبیر',
    markReviewedBtn: labels?.markReviewedBtn ?? 'ثبت بررسی دبیر',
    dismissBtn: labels?.dismissBtn ?? 'رد شباهت',
  };

  // Fixed coordinates on SVG canvas for the 5 students (star / pentagram layout)
  const nodePositions: Record<string, { x: number; y: number }> = {
    'st-sara': { x: 200, y: 55 },
    'st-amir': { x: 330, y: 125 },
    'st-mehdi': { x: 300, y: 250 },
    'st-nima': { x: 100, y: 250 },
    'st-maryam': { x: 70, y: 125 },
  };

  const handleDecision = (source: string, target: string, decision: 'reviewed' | 'dismissed') => {
    setEdgeList((prev) =>
      prev.map((e) =>
        (e.source === source && e.target === target) || (e.source === target && e.target === source)
          ? { ...e, reviewState: decision }
          : e
      )
    );
    onReviewEdge?.(source, target, decision);
  };

  return (
    <section
      dir="rtl"
      aria-labelledby="radar-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h3 id="radar-title" className="text-sm font-extrabold text-text-primary">
          {copy.title}
        </h3>
        <span className="text-xs font-semibold text-ai-cyan">
          تحلیل گراف ۵ گره و ۳ یال فعال
        </span>
      </div>

      {/* Mandatory Non-verdict disclaimer */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-text-secondary">
        <ShieldAlert className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
        <span>{copy.disclaimer}</span>
      </div>

      {/* Graph and Edge Review Details */}
      <div className="grid gap-5 lg:grid-cols-12 items-center">
        {/* SVG Network Graph */}
        <div dir="ltr" className="lg:col-span-7 flex justify-center">
          <svg
            viewBox="0 0 400 310"
            className="w-full max-w-[380px] h-auto overflow-visible select-none"
            role="img"
            aria-label="گراف شباهت پاسخ‌های دانش‌آموزان با الگوهای خطوط متمایز"
          >
            {/* Edges with accessible strokeDasharray patterns */}
            {edgeList.map((edge) => {
              const p1 = nodePositions[edge.source] || { x: 100, y: 100 };
              const p2 = nodePositions[edge.target] || { x: 200, y: 200 };
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              let stroke = 'rgb(var(--color-warning-rgb))';
              let dash = '6 4'; // dashed for unreviewed
              let width = 2.5;

              if (edge.reviewState === 'reviewed') {
                stroke = 'rgb(var(--color-ai-violet-rgb))';
                dash = 'none'; // solid for reviewed
                width = 2.5;
              } else if (edge.reviewState === 'dismissed') {
                stroke = 'rgb(var(--color-border-strong-rgb))';
                dash = '2 4'; // dotted for dismissed
                width = 1.5;
              }

              return (
                <g key={`${edge.source}-${edge.target}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={stroke}
                    strokeDasharray={dash}
                    strokeWidth={width}
                  />
                  {/* Percentage label on edge */}
                  <rect
                    x={midX - 18}
                    y={midY - 10}
                    width="36"
                    height="20"
                    rx="4"
                    fill="rgb(var(--color-surface-rgb))"
                    stroke="rgb(var(--color-border-rgb))"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    className="fill-text-primary text-[11px] font-bold font-mono"
                  >
                    {edge.similarity}٪
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id] || { x: 150, y: 150 };
              const isSelected = selectedNode === node.id;
              const hasAlert = (node.riskScore ?? 0) >= 80;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedNode(node.id);
                    onSelectNode?.(node.id);
                  }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 26 : 22}
                    fill="rgb(var(--color-surface-raised-rgb))"
                    stroke={
                      isSelected
                        ? 'rgb(var(--color-ai-cyan-rgb))'
                        : hasAlert
                        ? 'rgb(var(--color-warning-rgb))'
                        : 'rgb(var(--color-border-rgb))'
                    }
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  {/* User Initial or Alert Icon */}
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    className="fill-text-primary text-xs font-bold"
                  >
                    {node.label.slice(0, 1)}
                  </text>

                  {/* Accessible legible node label text >= 12px */}
                  <text
                    x={pos.x}
                    y={pos.y + 36}
                    textAnchor="middle"
                    className="fill-text-secondary text-[12px] font-bold"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend and Edge Actions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl border border-border bg-surface-raised/70 p-4 space-y-3">
            <h4 className="text-xs font-bold text-text-primary">راهنمای بصری خطوط ارتباطی:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 border-b-2 border-dashed border-warning" />
                <span className="text-text-secondary">خط‌چین زرد: نیازمند بررسی دبیر</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 bg-ai-violet" />
                <span className="text-text-secondary">خط ممتد بنفش: بررسی شده توسط دبیر</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 border-b-2 border-dotted border-border-strong" />
                <span className="text-text-secondary">نقطه‌چین تیره: رد شباهت و بی‌خطر</span>
              </div>
            </div>

            {/* Selected pair actions */}
            <div className="mt-3 pt-3 border-t border-border/80">
              <p className="text-xs font-bold text-ai-cyan mb-2">اقدام روی یال منتخب (سارا ↔ امیرحسین):</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDecision('st-sara', 'st-amir', 'reviewed')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-ai-violet/50 bg-ai-violet/20 py-2 text-xs font-bold text-text-primary hover:bg-ai-violet/30"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{copy.markReviewedBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision('st-sara', 'st-amir', 'dismissed')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2 text-xs font-bold text-text-muted hover:text-text-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{copy.dismissBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Table Fallback for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>فهرست جفت‌های دانش‌آموزی دارای سیگنال شباهت پاسخ</caption>
          <thead>
            <tr>
              <th scope="col">دانش‌آموز اول</th>
              <th scope="col">دانش‌آموز دوم</th>
              <th scope="col">درصد شباهت</th>
              <th scope="col">وضعیت بررسی</th>
            </tr>
          </thead>
          <tbody>
            {edgeList.map((e) => (
              <tr key={`${e.source}-${e.target}`}>
                <td>{nodes.find((n) => n.id === e.source)?.label}</td>
                <td>{nodes.find((n) => n.id === e.target)?.label}</td>
                <td>{formatFaPercent(e.similarity)}</td>
                <td>{e.reviewState === 'unreviewed' ? 'در انتظار بررسی' : e.reviewState === 'reviewed' ? 'بررسی شده' : 'رد شده'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
