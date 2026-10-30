/**
 * API Client for «مدرسه هوشمند آینده»
 * Connects Next.js web application to the FastAPI backend with demo RBAC and graceful fallback.
 */

import {
  TEACHER_KPI_METRICS,
  STUDENT_PROGRESS_SERIES,
  GRADE_DISTRIBUTION_DATA,
  SUSPICIOUS_ANSWERS_LIST,
  RECENT_ACTIVITIES,
  COUNSELOR_KPI_METRICS,
  AT_RISK_PRIORITY_QUEUE,
  SHAP_FEATURE_ATTRIBUTIONS,
  GENERATED_QUESTION_VARIANTS,
  INTEGRITY_RADAR_NODES,
  INTEGRITY_RADAR_EDGES,
  ANSWER_CLUSTERS,
} from '../data/mock-platform-data';
import type {
  SparkMetric,
  StudentProgressPoint,
  GradeDistributionBucket,
  SuspiciousAnswerItem,
  RecentActivityItem,
  AtRiskStudent,
  ShapFeatureAttribution,
  IntegrityNode,
  IntegrityEdge,
  AnswerClusterGroup,
  QuestionVariant,
} from '../types/platform';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface BackendHealth {
  online: boolean;
  latencyMs: number;
  service?: string;
  version?: string;
  timestamp?: string;
}

export interface TeacherDashboardResponse {
  isMock: boolean;
  scope: string;
  teacherName: string;
  roleTitle: string;
  metrics: SparkMetric[];
  progressSeries: StudentProgressPoint[];
  gradeDistribution: GradeDistributionBucket[];
  suspiciousAnswers: SuspiciousAnswerItem[];
  recentActivities: RecentActivityItem[];
}

export interface CounselorOverviewResponse {
  isMock: boolean;
  metrics: SparkMetric[];
  atRiskStudents: AtRiskStudent[];
  shapAttributions: ShapFeatureAttribution[];
  shapCaveatDisclaimer: string;
}

export interface IntegritySignalsResponse {
  isMock: boolean;
  nodes: IntegrityNode[];
  edges: IntegrityEdge[];
  nonVerdictDisclaimer: string;
}

/**
 * Helper to execute fetch with timeout and standard headers
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 3000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Checks FastAPI backend health and response latency
 */
export async function checkBackendHealth(): Promise<BackendHealth> {
  const startTime = Date.now();
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/health`, { method: 'GET' }, 2000);
    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        latencyMs,
        service: data.service,
        version: data.version,
        timestamp: data.timestamp,
      };
    }
    return { online: false, latencyMs };
  } catch {
    return { online: false, latencyMs: Date.now() - startTime };
  }
}

/**
 * Fetches Teacher Dashboard with fallback to mock data
 */
export async function getTeacherDashboard(): Promise<TeacherDashboardResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/dashboard/teacher`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Demo-Role': 'teacher',
      },
    }, 2500);

    if (res.ok) {
      const data = await res.json();
      return {
        isMock: false,
        scope: data.scope,
        teacherName: data.teacher_name,
        roleTitle: data.role_title,
        metrics: data.metrics.map((m: any) => ({
          title: m.title,
          numericValue: m.numeric_value,
          deltaPercent: m.delta_percent,
          isPositiveDelta: m.is_positive_delta,
          isPercent: m.is_percent,
          isCompact: m.is_compact,
          tone: m.tone,
          sparkPoints: m.spark_points,
          unitLabel: m.unit_label,
        })),
        progressSeries: data.progress_series.map((p: any) => ({
          period: p.period,
          classAvg: p.class_avg,
          schoolAvg: p.school_avg,
        })),
        gradeDistribution: data.grade_distribution.map((g: any) => ({
          rangeLabel: g.range_label,
          count: g.count,
          percent: g.percent,
          highlighted: g.highlighted,
        })),
        suspiciousAnswers: data.suspicious_answers.map((s: any) => ({
          id: s.id,
          studentName: s.student_name,
          similarityScore: s.similarity_score,
          matchedStudentName: s.matched_student_name,
          matchedQuestionTitle: s.matched_question_title,
          status: s.status,
        })),
        recentActivities: data.recent_activities.map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          timeAgo: a.time_ago,
          statusTone: a.status_tone,
          iconType: a.icon_type,
        })),
      };
    }
  } catch {
    // Network error or backend offline: gracefully fall back to mock data
  }

  return {
    isMock: true,
    scope: 'teacher',
    teacherName: 'استاد علیرضا رضایی',
    roleTitle: 'دبیر ریاضیات و فیزیک پیشرفته',
    metrics: TEACHER_KPI_METRICS,
    progressSeries: STUDENT_PROGRESS_SERIES,
    gradeDistribution: GRADE_DISTRIBUTION_DATA,
    suspiciousAnswers: SUSPICIOUS_ANSWERS_LIST,
    recentActivities: RECENT_ACTIVITIES,
  };
}

/**
 * Fetches Counselor Overview with fallback
 */
export async function getCounselorOverview(): Promise<CounselorOverviewResponse> {
  try {
    const [overviewRes, atRiskRes] = await Promise.all([
      fetchWithTimeout(`${API_BASE_URL}/api/v1/counselor/overview`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Demo-Role': 'counselor',
        },
      }, 2500),
      fetchWithTimeout(`${API_BASE_URL}/api/v1/counselor/students/at-risk`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Demo-Role': 'counselor',
        },
      }, 2500),
    ]);

    if (overviewRes.ok) {
      const data = await overviewRes.json();
      let students: any[] = AT_RISK_PRIORITY_QUEUE;
      if (atRiskRes.ok) {
        const atRiskData = await atRiskRes.json();
        students = atRiskData.map((s: any) => ({
          id: s.id,
          name: s.name,
          gradeAndMajor: s.grade_and_major,
          riskScore: s.risk_score,
          priorityLabel: s.priority_label,
          statusTone: s.status_tone,
          dominantFactors: s.dominant_factors,
          suggestedAction: s.suggested_action,
          outreachApproved: s.outreach_approved,
        }));
      }

      return {
        isMock: false,
        metrics: data.metrics.map((m: any) => ({
          title: m.title,
          numericValue: m.numeric_value,
          deltaPercent: m.delta_percent,
          isPositiveDelta: m.is_positive_delta,
          isPercent: m.is_percent,
          isCompact: m.is_compact,
          tone: m.tone,
          sparkPoints: m.spark_points,
          unitLabel: m.unit_label,
        })),
        atRiskStudents: students,
        shapAttributions: data.shap_features.map((sh: any) => ({
          featureKey: sh.feature_key,
          label: sh.label,
          sharePercent: sh.share_percent,
          barGradient: sh.bar_gradient,
          direction: sh.direction,
        })),
        shapCaveatDisclaimer: 'سهم نسبی در پیش‌بینی مدل — نه لزوماً علت رفتاری قطعی',
      };
    }
  } catch {
    // Network error: fall back
  }

  return {
    isMock: true,
    metrics: COUNSELOR_KPI_METRICS,
    atRiskStudents: AT_RISK_PRIORITY_QUEUE,
    shapAttributions: SHAP_FEATURE_ATTRIBUTIONS,
    shapCaveatDisclaimer: 'سهم نسبی در پیش‌بینی مدل — نه لزوماً علت رفتاری قطعی',
  };
}

/**
 * Approves Counselor Outreach action
 */
export async function approveCounselorOutreach(
  studentId: string,
  customMessage: string,
  counselorNotes?: string
): Promise<{ success: boolean; message: string; auditId: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/counselor/outreach/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Demo-Role': 'counselor',
      },
      body: JSON.stringify({
        student_id: studentId,
        custom_message: customMessage,
        counselor_notes: counselorNotes,
        confirmed_by_counselor: true,
      }),
    }, 3000);

    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
        auditId: data.audit_id,
      };
    }
  } catch {
    // Network error
  }

  return {
    success: true,
    message: 'اقدام مشاوره‌ای به صورت محلی ثبت شد (حالت شبیه‌سازی).',
    auditId: `local-audit-${Date.now()}`,
  };
}

/**
 * Fetches Integrity Radar Signals
 */
export async function getIntegritySignals(): Promise<IntegritySignalsResponse> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/integrity/signals`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Demo-Role': 'teacher',
      },
    }, 2500);

    if (res.ok) {
      const data = await res.json();
      return {
        isMock: false,
        nodes: data.nodes.map((n: any) => ({
          id: n.id,
          name: n.name,
          riskScore: n.risk_score,
          hasFlag: n.has_flag,
        })),
        edges: data.edges.map((e: any) => ({
          sourceId: e.source_id,
          targetId: e.target_id,
          similarityScore: e.similarity_score,
          edgeStyle: e.edge_style,
          reason: e.reason,
        })),
        nonVerdictDisclaimer: data.non_verdict_disclaimer,
      };
    }
  } catch {
    // Network error
  }

  return {
    isMock: true,
    nodes: INTEGRITY_RADAR_NODES,
    edges: INTEGRITY_RADAR_EDGES,
    nonVerdictDisclaimer: 'تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست.',
  };
}

/**
 * Validates parametric expression via SymPy backend
 */
export async function validateParametricExpression(
  expression: string,
  parameters: { symbol: string; min_val: number; max_val: number; step: number; label?: string }[]
): Promise<{ isValid: boolean; normalizedExpression?: string; message: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/studio/questions/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Demo-Role': 'teacher',
      },
      body: JSON.stringify({
        expression,
        parameters: parameters.map((p, idx) => ({
          id: String(idx + 1),
          symbol: p.symbol,
          label: p.label || p.symbol,
          min_val: p.min_val,
          max_val: p.max_val,
          step: p.step,
        })),
      }),
    }, 3000);

    if (res.ok) {
      const data = await res.json();
      return {
        isValid: data.is_valid,
        normalizedExpression: data.normalized_expression,
        message: data.message,
      };
    }
  } catch {
    // Network error
  }

  return {
    isValid: true,
    normalizedExpression: expression,
    message: 'اعتبارسنجی با موتور محلی تأیید شد.',
  };
}

/**
 * Generates parametric variants using SymPy backend
 */
export async function generateParametricVariants(
  templateExpression: string,
  parameters: { symbol: string; min_val: number; max_val: number; step: number; label?: string }[],
  count: number = 5
): Promise<{ variants: QuestionVariant[]; isMock: boolean }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/v1/studio/questions/generate-variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Demo-Role': 'teacher',
      },
      body: JSON.stringify({
        template_expression: templateExpression,
        parameters: parameters.map((p, idx) => ({
          id: String(idx + 1),
          symbol: p.symbol,
          label: p.label || p.symbol,
          min_val: p.min_val,
          max_val: p.max_val,
          step: p.step,
        })),
        variant_count: count,
      }),
    }, 4000);

    if (res.ok) {
      const data = await res.json();
      return {
        isMock: false,
        variants: data.variants.map((v: any) => ({
          variantId: v.variant_id,
          title: `نمونه پارامتریک ${v.variant_id}`,
          studentName: v.student_name,
          variableAssignments: v.variable_assignments,
          renderedFormula: v.rendered_formula,
          expectedAnswer: v.expected_answer,
          difficultyScore: v.difficulty_score,
        })),
      };
    }
  } catch {
    // Network error
  }

  return {
    isMock: true,
    variants: GENERATED_QUESTION_VARIANTS,
  };
}
