/**
 * Core Type Contracts for «مدرسه هوشمند آینده»
 * Strict types across teacher, counselor, student, studio, and mobile preview domains.
 */

export type UserRole = 'teacher' | 'principal' | 'counselor' | 'student';

export type AgentStatusType = 'idle' | 'listening' | 'thinking' | 'flagged';

export interface AgentStatusInfo {
  status: AgentStatusType;
  message: string;
  progress?: number;
  lastUpdated?: string;
}

export interface SparkMetric {
  title: string;
  numericValue: number;
  deltaPercent: number;
  isPositiveDelta?: boolean;
  isPercent?: boolean;
  isCompact?: boolean;
  tone: 'cyan' | 'violet' | 'indigo' | 'emerald' | 'amber' | 'coral';
  sparkPoints: number[];
  unitLabel?: string;
}

export interface StudentProgressPoint {
  period: string; // e.g., 'هفته ۱', 'هفته ۲'
  classAvg: number;
  schoolAvg: number;
}

export interface GradeDistributionBucket {
  rangeLabel: string;
  count: number;
  percent: number;
  highlighted?: boolean;
}

export interface SuspiciousAnswerItem {
  id: string;
  studentName: string;
  avatarUrl?: string;
  similarityScore: number; // 0 to 100
  matchedStudentName: string;
  matchedQuestionTitle: string;
  status: 'pending_review' | 'dismissed' | 'confirmed';
}

export interface RecentActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  statusTone: 'emerald' | 'amber' | 'violet' | 'coral' | 'cyan' | 'indigo';
  iconType: 'check' | 'alert' | 'document' | 'user' | 'sparkles';
}

export interface HandwritingEvaluationData {
  scoreAwarded: number;
  maxScore: number; // Canonical: 100
  accuracyPercent: number;
  formulaLatex: string;
  detectedSteps: {
    stepNumber: number;
    description: string;
    isCorrect: boolean;
    confidence: number;
  }[];
  sparkPoints: number[];
}

export type RegradeStepStatus = 'completed' | 'active' | 'pending';

export interface RegradeTimelineStep {
  id: string;
  label: string;
  roleDescription: string;
  status: RegradeStepStatus;
  timestamp?: string;
  assignee?: string;
  notes?: string;
}

export interface ShapFeatureAttribution {
  featureKey: string;
  label: string;
  sharePercent: number;
  barGradient: string;
  direction: 'risk_increasing' | 'protective';
}

export interface AtRiskStudent {
  id: string;
  name: string;
  gradeAndMajor: string;
  riskScore: number; // 0 - 100
  priorityLabel: string;
  statusTone: 'danger' | 'warning' | 'violet';
  dominantFactors: string[];
  suggestedAction: string;
  outreachApproved?: boolean;
}

export interface SynchronizedNoteTopic {
  id: string;
  timestampSeconds: number;
  title: string;
  summary: string;
  isActive?: boolean;
}

export interface AudioLessonData {
  id: string;
  title: string;
  courseTitle: string;
  sessionTitle: string;
  totalDurationSeconds: number;
  currentPlaybackSeconds: number;
  waveformPeaks: number[];
  topics: SynchronizedNoteTopic[];
}

export interface ParametricVariable {
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  defaultValue: number;
}

export interface QuestionVariant {
  variantId: string;
  title: string;
  studentName?: string;
  variableAssignments: Record<string, number>;
  renderedFormula: string;
  expectedAnswer: number | string;
  difficultyScore: number;
}

export interface IntegrityNode {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  riskScore?: number;
  hasFlag?: boolean;
}

export interface IntegrityEdge {
  sourceId: string;
  targetId: string;
  similarityScore: number; // 0 - 100
  edgeStyle: 'solid' | 'dashed' | 'dotted'; // solid: severe flag, dashed: statistical suspicion, dotted: parameter correlation
  reason: string;
}

export interface AnswerClusterGroup {
  clusterId: string;
  clusterName: string;
  sampleAnswerLatex: string;
  studentCount: number;
  similarityPercent: number;
  confidenceScore: number;
  status: 'reviewed' | 'pending' | 'flagged';
  representativeStudents: string[];
}
