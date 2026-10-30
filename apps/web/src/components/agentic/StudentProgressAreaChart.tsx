'use client';

import React, { useState } from 'react';
import { formatFaPercent, formatFaNumber } from '@/lib/formatters';

export interface ProgressDataPoint {
  period: string;
  classAvg: number;
  schoolAvg: number;
}

export interface StudentProgressAreaChartProps {
  data?: ProgressDataPoint[];
  title?: string;
  onFilterChange?: (filter: 'week' | 'month' | 'term' | 'year') => void;
}

const defaultData: ProgressDataPoint[] = [
  { period: 'هفته ۱', classAvg: 25, schoolAvg: 20 },
  { period: 'هفته ۲', classAvg: 58, schoolAvg: 45 },
  { period: 'هفته ۳', classAvg: 87, schoolAvg: 68 },
  { period: 'هفته ۴', classAvg: 92, schoolAvg: 74 },
];

export function StudentProgressAreaChart({
  data = defaultData,
  title = 'روند پیشرفت دانش‌آموزان',
  onFilterChange,
}: StudentProgressAreaChartProps) {
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'term' | 'year'>('month');

  const handleFilter = (filter: 'week' | 'month' | 'term' | 'year') => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  // SVG dimensions for chart
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const pointsCount = data.length;
  const getX = (i: number) => paddingX + (i / Math.max(pointsCount - 1, 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - paddingY - (val / 100) * (height - 2 * paddingY);

  const classPoints = data.map((d, i) => `${getX(i)},${getY(d.classAvg)}`).join(' ');
  const schoolPoints = data.map((d, i) => `${getX(i)},${getY(d.schoolAvg)}`).join(' ');

  // Area paths
  const classArea = `M ${getX(0)},${height - paddingY} ${data.map((d, i) => `L ${getX(i)},${getY(d.classAvg)}`).join(' ')} L ${getX(pointsCount - 1)},${height - paddingY} Z`;
  const schoolArea = `M ${getX(0)},${height - paddingY} ${data.map((d, i) => `L ${getX(i)},${getY(d.schoolAvg)}`).join(' ')} L ${getX(pointsCount - 1)},${height - paddingY} Z`;

  return (
    <section
      dir="rtl"
      aria-labelledby="progress-chart-title"
      className="rounded-panel border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-glass"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 id="progress-chart-title" className="text-sm font-extrabold text-text-primary">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-text-secondary">
              <span className="h-2.5 w-2.5 rounded-full bg-ai-violet" aria-hidden="true" />
              <span>کلاس شما</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-ai-cyan" aria-hidden="true" />
              <span>میانگین مدرسه</span>
            </span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex rounded-lg border border-border bg-surface-raised p-1 text-xs font-semibold">
          {[
            { id: 'week', label: 'هفته' },
            { id: 'month', label: 'ماه' },
            { id: 'term', label: 'ترم' },
            { id: 'year', label: 'سال' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFilter(f.id as any)}
              className={`rounded-md px-3 py-1 transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                activeFilter === f.id
                  ? 'bg-ai-indigo text-text-primary shadow-ai'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Dual-Series Area Chart (LTR math/coordinates) */}
      <div dir="ltr" className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="نمودار روند پیشرفت تحصیلی دانش‌آموزان به تفکیک میانگین کلاس و میانگین مدرسه"
        >
          <defs>
            <linearGradient id="classGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-ai-violet-rgb))" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(var(--color-ai-violet-rgb))" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="schoolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-ai-cyan-rgb))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(var(--color-ai-cyan-rgb))" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <g key={val}>
              <line
                x1={paddingX}
                y1={getY(val)}
                x2={width - paddingX}
                y2={getY(val)}
                stroke="rgb(var(--color-border-rgb))"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="fill-text-muted text-[10px] font-mono select-none"
              >
                {val}
              </text>
            </g>
          ))}

          {/* School Average Area & Line (Cyan) */}
          <path d={schoolArea} fill="url(#schoolGrad)" />
          <polyline
            points={schoolPoints}
            fill="none"
            stroke="rgb(var(--color-ai-cyan-rgb))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Class Average Area & Line (Violet) */}
          <path d={classArea} fill="url(#classGrad)" />
          <polyline
            points={classPoints}
            fill="none"
            stroke="rgb(var(--color-ai-violet-rgb))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point dots and highlighted tooltip on week 3 */}
          {data.map((d, i) => (
            <g key={d.period}>
              <circle
                cx={getX(i)}
                cy={getY(d.classAvg)}
                r="4"
                fill="rgb(var(--color-ai-violet-rgb))"
                stroke="rgb(var(--color-surface-rgb))"
                strokeWidth="2"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.schoolAvg)}
                r="3"
                fill="rgb(var(--color-ai-cyan-rgb))"
                stroke="rgb(var(--color-surface-rgb))"
                strokeWidth="1.5"
              />
              {/* X-axis labels */}
              <text
                x={getX(i)}
                y={height - 5}
                textAnchor="middle"
                className="fill-text-secondary text-[11px] font-semibold select-none"
              >
                {d.period}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Accessible Screen-Reader Table Fallback */}
      <div className="sr-only">
        <table>
          <caption>جدول داده‌های روند پیشرفت تحصیلی</caption>
          <thead>
            <tr>
              <th scope="col">دوره</th>
              <th scope="col">میانگین کلاس</th>
              <th scope="col">میانگین کل مدرسه</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.period}>
                <th scope="row">{d.period}</th>
                <td>{formatFaPercent(d.classAvg)}</td>
                <td>{formatFaPercent(d.schoolAvg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
