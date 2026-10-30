'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { KPIMetricSparkCard } from '@/components/agentic/KPIMetricSparkCard';
import { ParametricQuestionBuilderCard } from '@/components/agentic/ParametricQuestionBuilderCard';
import { IntegrityRadarWidget } from '@/components/agentic/IntegrityRadarWidget';
import { AnswerClusterDeck } from '@/components/agentic/AnswerClusterDeck';
import { HandwritingEvaluationCanvas } from '@/components/agentic/HandwritingEvaluationCanvas';
import {
  STUDIO_KPI_METRICS,
  PARAMETRIC_VARIABLES,
  GENERATED_QUESTION_VARIANTS,
  INTEGRITY_RADAR_NODES,
  INTEGRITY_RADAR_EDGES,
  ANSWER_CLUSTERS,
  CANONICAL_HANDWRITING_EVALUATION,
} from '@/data/mock-platform-data';

export default function StudioPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Row 1: 4 Studio KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STUDIO_KPI_METRICS.map((kpi) => (
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

        {/* Row 2: Parametric Question Builder (Full width or split) */}
        <div>
          <ParametricQuestionBuilderCard
            parameters={PARAMETRIC_VARIABLES.map((v) => ({
              id: v.symbol,
              symbol: v.symbol,
              label: v.name,
              min: v.min,
              max: v.max,
              step: v.step,
              unit: v.unit,
            }))}
            variants={GENERATED_QUESTION_VARIANTS.map((v) => ({
              id: v.variantId,
              statement: v.title,
              answer: v.renderedFormula,
              valid: true,
              studentName: v.studentName,
            }))}
          />
        </div>

        {/* Row 3: Integrity Radar Widget (8 cols) + Handwriting Evaluation (4 cols) */}
        <div className="grid gap-5 xl:grid-cols-12 items-start">
          <div className="xl:col-span-8">
            <IntegrityRadarWidget
              nodes={INTEGRITY_RADAR_NODES.map((n) => ({
                id: n.id,
                label: n.name,
                riskScore: n.riskScore,
              }))}
              edges={INTEGRITY_RADAR_EDGES.map((e) => ({
                source: e.sourceId,
                target: e.targetId,
                similarity: e.similarityScore,
                evidence: [e.reason],
                reviewState: 'unreviewed',
              }))}
            />
          </div>

          <div className="xl:col-span-4">
            <HandwritingEvaluationCanvas
              scoreAwarded={CANONICAL_HANDWRITING_EVALUATION.scoreAwarded}
              maxScore={CANONICAL_HANDWRITING_EVALUATION.maxScore}
              formulaLatex={CANONICAL_HANDWRITING_EVALUATION.formulaLatex}
            />
          </div>
        </div>

        {/* Row 4: Answer Cluster Deck (Gradescope-style batch grading) */}
        <div>
          <AnswerClusterDeck
            clusters={ANSWER_CLUSTERS.map((c) => ({
              id: c.clusterId,
              label: c.clusterName,
              similarity: c.similarityPercent / 100,
              confidence: c.confidenceScore / 100,
              reviewRequired: c.status === 'flagged' || c.status === 'pending',
              answers: c.representativeStudents.map((st, i) => ({
                studentId: `st-${i}`,
                displayName: st,
                answer: c.sampleAnswerLatex,
              })),
            }))}
          />
        </div>
      </div>
    </AppShell>
  );
}
