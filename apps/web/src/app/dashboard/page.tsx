'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { getTeacherDashboard } from '@/lib/api-client';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { StudentProgressAreaChart } from '@/components/agentic/StudentProgressAreaChart';
import { AIAssistantBentoCard } from '@/components/agentic/AIAssistantBentoCard';
import { SuspiciousAnswersListCard } from '@/components/agentic/SuspiciousAnswersListCard';
import { GradeDistributionBarChart } from '@/components/agentic/GradeDistributionBarChart';
import { RecentActivitiesTimeline } from '@/components/agentic/RecentActivitiesTimeline';
import { HandwritingEvaluationCanvas } from '@/components/agentic/HandwritingEvaluationCanvas';
import { RegradeTimelineStepper } from '@/components/agentic/RegradeTimelineStepper';
import {
  TEACHER_KPI_METRICS,
  PRINCIPAL_KPI_METRICS,
  STUDENT_PROGRESS_SERIES,
  GRADE_DISTRIBUTION_DATA,
  SUSPICIOUS_ANSWERS_LIST,
  RECENT_ACTIVITIES,
  CANONICAL_HANDWRITING_EVALUATION,
  REGRADE_WORKFLOW_STEPS,
} from '@/data/mock-platform-data';

export default function DashboardPage() {
  const { apiStatus } = useBackendStatus();
  const [scope, setScope] = useState<'teacher' | 'principal'>('teacher');
  const [liveTeacherMetrics, setLiveTeacherMetrics] = useState<typeof TEACHER_KPI_METRICS | null>(null);

  useEffect(() => {
    if (apiStatus === 'connected') {
      getTeacherDashboard().then((res) => {
        if (!res.isMock && res.metrics.length > 0) {
          setLiveTeacherMetrics(res.metrics);
        }
      }).catch(() => {
        // Fallback already handled
      });
    }
  }, [apiStatus]);

  const metrics = scope === 'teacher'
    ? (liveTeacherMetrics || TEACHER_KPI_METRICS)
    : PRINCIPAL_KPI_METRICS;

  return (
    <AppShell apiStatus={apiStatus}>
      <div className="space-y-6">
        {/* Row 1: 4 KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((kpi) => (
            <KPIMetricSparkCard
              key={kpi.title}
              title={kpi.title}
              numericValue={kpi.numericValue}
              deltaPercent={kpi.deltaPercent}
              isPercent={kpi.isPercent}
              isCompactThousands={kpi.isCompact}
              tone={kpi.tone}
              sparkPoints={kpi.sparkPoints}
              unitLabel={kpi.unitLabel}
            />
          ))}
        </div>

        {/* Row 2: Progress Area Chart (8 cols) + AI Assistant Bento (4 cols) */}
        <div className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <StudentProgressAreaChart data={STUDENT_PROGRESS_SERIES} />
          </div>
          <div className="xl:col-span-4">
            <AIAssistantBentoCard />
          </div>
        </div>

        {/* Row 3: Suspicious Answers (4 cols), Grade Distribution (4 cols), Recent Activities (4 cols) */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SuspiciousAnswersListCard
            items={SUSPICIOUS_ANSWERS_LIST.map((item) => ({
              id: item.id,
              studentDisplay: item.studentName,
              similarityPercent: item.similarityScore,
              reasonSummary: item.matchedQuestionTitle,
            }))}
          />
          <GradeDistributionBarChart buckets={GRADE_DISTRIBUTION_DATA} />
          <RecentActivitiesTimeline activities={RECENT_ACTIVITIES} />
        </div>

        {/* Row 4: Handwriting Evaluation Canvas (7 cols) + Regrade Timeline Stepper (5 cols) */}
        <div className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <HandwritingEvaluationCanvas
              scoreAwarded={CANONICAL_HANDWRITING_EVALUATION.scoreAwarded}
              maxScore={CANONICAL_HANDWRITING_EVALUATION.maxScore}
              formulaLatex={CANONICAL_HANDWRITING_EVALUATION.formulaLatex}
            />
          </div>
          <div className="xl:col-span-5">
            <RegradeTimelineStepper stages={REGRADE_WORKFLOW_STEPS as any} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
