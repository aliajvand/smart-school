import {
  SparkMetric,
  StudentProgressPoint,
  GradeDistributionBucket,
  SuspiciousAnswerItem,
  RecentActivityItem,
  HandwritingEvaluationData,
  RegradeTimelineStep,
  ShapFeatureAttribution,
  AtRiskStudent,
  AudioLessonData,
  ParametricVariable,
  QuestionVariant,
  IntegrityNode,
  IntegrityEdge,
  AnswerClusterGroup,
} from '@/types/platform';

/**
 * Centralized Mock Platform Data for «مدرسه هوشمند آینده»
 * Source of truth for editable copy, labels, student profiles, and telemetry.
 */

// ==========================================
// 1. TEACHER & PRINCIPAL DASHBOARD DATA
// ==========================================

export const TEACHER_USER_PROFILE = {
  name: 'علی اجوند',
  roleTitle: 'دبیر ریاضی و حسابان پیشرفته',
  avatarUrl: '/assets/mockups/avatar-teacher.png',
  unreadNotifications: 3,
};

export const PRINCIPAL_USER_PROFILE = {
  name: 'دکتر محمدرضا صادقی',
  roleTitle: 'مدیر مجتمع آموزشی هوشمند',
  avatarUrl: '/assets/mockups/avatar-teacher.png',
  unreadNotifications: 5,
};

export const TEACHER_KPI_METRICS: SparkMetric[] = [
  {
    title: 'دانش‌آموزان کلاس‌های من',
    numericValue: 128,
    deltaPercent: 8,
    isPositiveDelta: true,
    tone: 'cyan',
    sparkPoints: [100, 110, 115, 120, 122, 125, 128],
    unitLabel: 'نفر',
  },
  {
    title: 'برگه تصحیح‌شده هوشمند',
    numericValue: 450,
    deltaPercent: 20,
    isPositiveDelta: true,
    tone: 'indigo',
    sparkPoints: [280, 310, 350, 390, 410, 430, 450],
    unitLabel: 'برگه',
  },
  {
    title: 'نرخ تسلط مفهومی',
    numericValue: 98,
    deltaPercent: 2,
    isPositiveDelta: true,
    isPercent: true,
    tone: 'emerald',
    sparkPoints: [92, 94, 93, 95, 96, 97, 98],
  },
  {
    title: 'نیازمند بازبینی دستی دبیر',
    numericValue: 2,
    deltaPercent: 12,
    isPositiveDelta: false,
    tone: 'amber',
    sparkPoints: [8, 6, 7, 5, 4, 3, 2],
    unitLabel: 'مورد',
  },
];

export const PRINCIPAL_KPI_METRICS: SparkMetric[] = [
  {
    title: 'کل دانش‌آموزان فعال مجتمع',
    numericValue: 12500,
    deltaPercent: 8,
    isPositiveDelta: true,
    isCompact: true,
    tone: 'cyan',
    sparkPoints: [11200, 11600, 11900, 12100, 12300, 12450, 12500],
    unitLabel: 'نفر',
  },
  {
    title: 'آزمون‌های تحلیلی ماه',
    numericValue: 1420,
    deltaPercent: 15,
    isPositiveDelta: true,
    isCompact: true,
    tone: 'indigo',
    sparkPoints: [980, 1050, 1150, 1240, 1310, 1380, 1420],
    unitLabel: 'جلسه',
  },
  {
    title: 'میانگین تراز کل مدرسه',
    numericValue: 94,
    deltaPercent: 3,
    isPositiveDelta: true,
    isPercent: true,
    tone: 'emerald',
    sparkPoints: [88, 89, 91, 90, 92, 93, 94],
  },
  {
    title: 'پرونده‌های فعال EWS',
    numericValue: 18,
    deltaPercent: 5,
    isPositiveDelta: false,
    tone: 'amber',
    sparkPoints: [28, 25, 23, 22, 20, 19, 18],
    unitLabel: 'دانش‌آموز',
  },
];

export const STUDENT_PROGRESS_SERIES: StudentProgressPoint[] = [
  { period: 'هفته ۱', classAvg: 25, schoolAvg: 20 },
  { period: 'هفته ۲', classAvg: 58, schoolAvg: 45 },
  { period: 'هفته ۳', classAvg: 87, schoolAvg: 68 },
  { period: 'هفته ۴', classAvg: 92, schoolAvg: 74 },
];

export const GRADE_DISTRIBUTION_DATA: GradeDistributionBucket[] = [
  { rangeLabel: '۰ - ۲۵', count: 4, percent: 8 },
  { rangeLabel: '۲۵ - ۵۰', count: 9, percent: 18 },
  { rangeLabel: '۵۰ - ۷۵', count: 18, percent: 36, highlighted: true },
  { rangeLabel: '۷۵ - ۹۰', count: 12, percent: 24 },
  { rangeLabel: '۹۰ - ۱۰۰', count: 7, percent: 14 },
];

export const SUSPICIOUS_ANSWERS_LIST: SuspiciousAnswerItem[] = [
  {
    id: 'sus-1',
    studentName: 'سارا محمدی',
    similarityScore: 93,
    matchedStudentName: 'امیرحسین رضایی',
    matchedQuestionTitle: 'مساله ۳: انتگرال معین مساحت زیر منحنی',
    status: 'pending_review',
  },
  {
    id: 'sus-2',
    studentName: 'امیرحسین رضایی',
    similarityScore: 89,
    matchedStudentName: 'مهدی کریمی',
    matchedQuestionTitle: 'مساله ۳: انتگرال معین مساحت زیر منحنی',
    status: 'pending_review',
  },
  {
    id: 'sus-3',
    studentName: 'مهدی کریمی',
    similarityScore: 87,
    matchedStudentName: 'سارا محمدی',
    matchedQuestionTitle: 'مساله ۲: بسط دوجمله‌ای نیوتن',
    status: 'pending_review',
  },
];

export const CANONICAL_HANDWRITING_EVALUATION: HandwritingEvaluationData = {
  scoreAwarded: 95,
  maxScore: 100, // Canonical score: ۹۵ / ۱۰۰
  accuracyPercent: 95,
  formulaLatex: '\\int_{-1}^{1} x^2 dx = \\left[ \\frac{x^3}{3} \\right]_{-1}^{1} = \\frac{2}{3}',
  detectedSteps: [
    {
      stepNumber: 1,
      description: 'تشخیص صحیح تابع و پادمشتق x^3 / 3',
      isCorrect: true,
      confidence: 99,
    },
    {
      stepNumber: 2,
      description: 'جایگذاری کران بالا x = 1 و کران پایین x = -1',
      isCorrect: true,
      confidence: 97,
    },
    {
      stepNumber: 3,
      description: 'محاسبه کسر جبری ۱/۳ - (-۱/۳) = ۲/۳ بدون خطای علامت',
      isCorrect: true,
      confidence: 95,
    },
  ],
  sparkPoints: [80, 85, 90, 88, 92, 95],
};

export const REGRADE_WORKFLOW_STEPS: RegradeTimelineStep[] = [
  {
    id: 'step-1',
    label: 'ثبت درخواست بازبینی',
    roleDescription: 'توسط دانش‌آموز (امیرحسین رضایی)',
    status: 'completed',
    timestamp: 'دیروز ساعت ۱۶:۲۰',
    assignee: 'دانش‌آموز',
    notes: '«به نظر می‌رسد ضریب منفی در صورت سوال ۲ اشتباه خوانده شده است.»',
  },
  {
    id: 'step-2',
    label: 'بررسی آموزشی دبیر',
    roleDescription: 'استاد علی اجوند (دبیر ریاضی)',
    status: 'active',
    timestamp: 'امروز ساعت ۰۹:۱۵',
    assignee: 'علی اجوند',
    notes: 'در حال بازبینی تطبیق دست‌خط با راه‌حل استاندارد.',
  },
  {
    id: 'step-3',
    label: 'نظر مشاور تحصیلی',
    roleDescription: 'بررسی شاخص‌های استرس و روند تحصیلی',
    status: 'pending',
    assignee: 'مشاور پایه دوازدهم',
  },
  {
    id: 'step-4',
    label: 'تایید نهایی نمره',
    roleDescription: 'ثبت نمره نهایی در کارنامه رسمی مدرسه',
    status: 'pending',
    assignee: 'معاون آموزشی',
  },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-1',
    title: 'آزمون جامع فیزیک دوازدهم تصحیح شد',
    description: '۴۵ برگه با دقت ۹۶٪ توسط سامانه ارزیابی شد.',
    timeAgo: '۳ دقیقه پیش',
    statusTone: 'emerald',
    iconType: 'check',
  },
  {
    id: 'act-2',
    title: 'نسخه بازبینی دستی ارسال شد',
    description: 'درخواست بازبینی نمره امیرحسین رضایی به کارتابل افزوده شد.',
    timeAgo: '۱۰ دقیقه پیش',
    statusTone: 'amber',
    iconType: 'alert',
  },
  {
    id: 'act-3',
    title: 'گزارش پیشرفت هفتگی کلاس تجربی آماده شد',
    description: 'شاخص تسلط مبحث انتگرال در ۳ کلاس بارگذاری گردید.',
    timeAgo: '۲ ساعت پیش',
    statusTone: 'indigo',
    iconType: 'document',
  },
];

// ==========================================
// 2. COUNSELOR & EWS DATA
// ==========================================

export const COUNSELOR_KPI_METRICS: SparkMetric[] = [
  {
    title: 'دانش‌آموزان تحت پایش پایه',
    numericValue: 320,
    deltaPercent: 12,
    isPositiveDelta: true,
    tone: 'cyan',
    sparkPoints: [40, 48, 52, 60, 68, 75, 82],
    unitLabel: 'نفر',
  },
  {
    title: 'پرونده‌های نیازمند بررسی مشاور',
    numericValue: 7,
    deltaPercent: 2,
    isPositiveDelta: false,
    tone: 'amber',
    sparkPoints: [12, 15, 11, 18, 14, 9, 7],
    unitLabel: 'پرونده',
  },
  {
    title: 'جلسات مشاوره برگزارشده',
    numericValue: 24,
    deltaPercent: 20,
    isPositiveDelta: true,
    tone: 'violet',
    sparkPoints: [10, 14, 16, 15, 20, 22, 24],
    unitLabel: 'جلسه',
  },
  {
    title: 'بهبود روند پس از جلسه',
    numericValue: 89,
    deltaPercent: 8,
    isPositiveDelta: true,
    isPercent: true,
    tone: 'emerald',
    sparkPoints: [70, 74, 76, 80, 84, 86, 89],
  },
];

export const COUNSELOR_PROGRESS_SERIES: StudentProgressPoint[] = [
  { period: 'هفته ۱', classAvg: 22, schoolAvg: 18 },
  { period: 'هفته ۲', classAvg: 65, schoolAvg: 42 },
  { period: 'هفته ۳', classAvg: 78, schoolAvg: 55 },
  { period: 'هفته ۴', classAvg: 85, schoolAvg: 60 },
];

export const SHAP_FEATURE_ATTRIBUTIONS: ShapFeatureAttribution[] = [
  {
    featureKey: 'homework_delay',
    label: 'تاخیر در تحویل ۲ تمرین حسابان متوالی',
    sharePercent: 48,
    barGradient: 'from-danger to-warning',
    direction: 'risk_increasing',
  },
  {
    featureKey: 'online_absence',
    label: 'غیبت در ۲ جلسه آنلاین روز آلودگی هوا',
    sharePercent: 32,
    barGradient: 'from-warning to-ai-violet',
    direction: 'risk_increasing',
  },
  {
    featureKey: 'audio_review_reduction',
    label: 'کاهش زمان مرور جزوه صوتی کلاس',
    sharePercent: 20,
    barGradient: 'from-ai-violet to-ai-cyan',
    direction: 'risk_increasing',
  },
];

export const AT_RISK_PRIORITY_QUEUE: AtRiskStudent[] = [
  {
    id: 'st-109',
    name: 'امیرحسین رضایی',
    gradeAndMajor: 'دوازدهم ریاضی • تغییر شیب نمرات حسابان',
    riskScore: 88,
    priorityLabel: 'اولویت بررسی بالا',
    statusTone: 'danger',
    dominantFactors: ['افت نمره آزمون دوره‌ای', 'غیبت در آزمون تکوینی', 'تاخیر در تمرین'],
    suggestedAction: 'هماهنگی جلسه مشاوره آنلاین و ارسال بسته مرور جبرانی',
    outreachApproved: false,
  },
  {
    id: 'st-104',
    name: 'سارا محمدی',
    gradeAndMajor: 'دوازدهم تجربی • ۳ غیبت متوالی زیست‌شناسی',
    riskScore: 74,
    priorityLabel: 'نیازمند پیگیری آموزشی',
    statusTone: 'warning',
    dominantFactors: ['عدم دسترسی به بستر آنلاین', 'کاهش فعالیت در کوییزها'],
    suggestedAction: 'ارسال جزوه صوتی جلسه و چک‌این وضعیت اینترنت',
    outreachApproved: false,
  },
  {
    id: 'st-112',
    name: 'مهدی کریمی',
    gradeAndMajor: 'یازدهم ریاضی • تاخیر در تکالیف هندسه',
    riskScore: 61,
    priorityLabel: 'رصد پشتیبان',
    statusTone: 'violet',
    dominantFactors: ['عدم تطابق سرعت یادگیری', 'افت زمان مطالعه در سامانه'],
    suggestedAction: 'معرفی ویدیوهای مکمل هندسه تحلیلی',
    outreachApproved: true,
  },
];

// ==========================================
// 3. STUDENT SMART CLASSROOM DATA
// ==========================================

export const STUDENT_USER_PROFILE = {
  name: 'علی اجوند',
  roleTitle: 'دانش‌آموز پایه دوازدهم ریاضی',
  avatarUrl: '/assets/mockups/avatar-teacher.png',
  tarazEstimate: {
    min: 9300,
    max: 9600,
    uncertaintyMargin: 150,
    pointEstimate: 9480,
  },
};

export const STUDENT_KPI_METRICS: SparkMetric[] = [
  {
    title: 'معدل تراز شده دروس',
    numericValue: 19.15,
    deltaPercent: 13,
    isPositiveDelta: true,
    tone: 'cyan',
    sparkPoints: [18.2, 18.5, 18.8, 19.0, 19.15],
    unitLabel: 'از ۲۰',
  },
  {
    title: 'جزوه صوتی هوشمند مطالعه شده',
    numericValue: 42,
    deltaPercent: 14,
    isPositiveDelta: false,
    tone: 'violet',
    sparkPoints: [50, 48, 45, 43, 42],
    unitLabel: 'جلسه',
  },
  {
    title: 'کوییز کلاسی تکمیل‌شده',
    numericValue: 18,
    deltaPercent: 12,
    isPositiveDelta: true,
    tone: 'indigo',
    sparkPoints: [10, 12, 14, 16, 18],
    unitLabel: 'آزمونک',
  },
  {
    title: 'تراز تخمینی کنکور (بازه ۹۳۰۰ تا ۹۶۰۰)',
    numericValue: 9480,
    deltaPercent: 13,
    isPositiveDelta: true,
    tone: 'amber',
    sparkPoints: [9100, 9250, 9380, 9420, 9480],
  },
];

export const CLASS_AUDIO_LESSON: AudioLessonData = {
  id: 'lesson-phys-12-06',
  title: 'پلیر صوتی کلاس و جزوه هوشمند',
  courseTitle: 'کلاس فیزیک ۳ — پایه دوازدهم ریاضی',
  sessionTitle: 'جلسه ۶: تحلیل شتاب ثابت و معادلات حرکت',
  totalDurationSeconds: 1730, // 28:50
  currentPlaybackSeconds: 194, // 03:14
  waveformPeaks: [
    12, 24, 45, 68, 85, 92, 78, 64, 52, 60,
    74, 90, 82, 70, 55, 40, 62, 88, 95, 75,
    60, 45, 55, 70, 84, 92, 80, 65, 50, 40,
    48, 62, 78, 90, 85, 72, 58, 48, 65, 82,
    94, 88, 70, 55, 65, 80, 90, 75, 60, 40
  ],
  topics: [
    {
      id: 'top-1',
      timestampSeconds: 0,
      title: 'مقدمه و یادآوری بردار سرعت و مکان',
      summary: 'بررسی مفهوم شیب خط در نمودار مکان-زمان و تعریف سرعت لحظه‌ای.',
      isActive: false,
    },
    {
      id: 'top-2',
      timestampSeconds: 194, // 03:14
      title: 'تعریف شتاب و حرکت با شتاب ثابت',
      summary: 'تحلیل مساحت زیر نمودار سرعت-زمان و اثبات فرمول مستقل از زمان.',
      isActive: true,
    },
    {
      id: 'top-3',
      timestampSeconds: 600, // 10:00
      title: 'حل مثال نمونه: سقوط آزاد با مقاومت ناچیز هوا',
      summary: 'بررسی سقوط گلوله از ارتفاع h با شتاب گرانشی g=9.8.',
      isActive: false,
    },
    {
      id: 'top-4',
      timestampSeconds: 1320, // 22:00
      title: 'نکات تستی کنکور و خطاهای رایج علامت شتاب',
      summary: 'قرارداد جهت مثبت محور و تفکیک حرکت کندشونده از تندشونده.',
      isActive: false,
    },
  ],
};

export const POP_QUIZ_MATH_QUESTION = {
  id: 'quiz-pop-5m',
  title: 'کوییز ۵ دقیقه‌ای هوشمند (Parametric Math Quiz)',
  remainingSeconds: 300,
  formulaLatex: 'z^2 = -3 \\implies ((x^2 - 1)^x + b) = ?',
  options: [
    { id: 'opt-1', label: 'واریانت ۱', value: '۴۱' },
    { id: 'opt-2', label: 'واریانت ۲', value: '۱۶۳' },
    { id: 'opt-3', label: 'واریانت ۳', value: '۱۷', isCorrect: true },
    { id: 'opt-4', label: 'واریانت ۴', value: '۲۹' },
  ],
};

// ==========================================
// 4. PARAMETRIC STUDIO & INTEGRITY DATA
// ==========================================

export const STUDIO_KPI_METRICS: SparkMetric[] = [
  {
    title: 'مورد مشکوک نیازمند بازبینی',
    numericValue: 2,
    deltaPercent: 13,
    isPositiveDelta: false,
    tone: 'amber',
    sparkPoints: [5, 4, 4, 3, 2],
    unitLabel: 'مورد',
  },
  {
    title: 'برگه تصحیح‌شده اتوماتیک',
    numericValue: 450,
    deltaPercent: 20,
    isPositiveDelta: true,
    tone: 'indigo',
    sparkPoints: [290, 340, 390, 420, 450],
    unitLabel: 'برگه',
  },
  {
    title: 'هم‌ترازی سختی سوالات (IRT)',
    numericValue: 99,
    deltaPercent: 22,
    isPositiveDelta: true,
    isPercent: true,
    tone: 'emerald',
    sparkPoints: [85, 90, 94, 97, 99],
  },
  {
    title: 'نسخه پارامتریک فعال',
    numericValue: 55,
    deltaPercent: 55,
    isPositiveDelta: true,
    tone: 'violet',
    sparkPoints: [10, 20, 35, 45, 55],
    unitLabel: 'نسخه',
  },
];

export const PARAMETRIC_VARIABLES: ParametricVariable[] = [
  { name: 'شتاب گرانش', symbol: 'g', min: 9.8, max: 10, step: 0.1, unit: 'm/s²', defaultValue: 9.8 },
  { name: 'سرعت اولیه', symbol: 'v₀', min: 5, max: 30, step: 5, unit: 'm/s', defaultValue: 15 },
  { name: 'زاویه پرتاب', symbol: 'θ', min: 15, max: 75, step: 15, unit: 'درجه', defaultValue: 45 },
  { name: 'ضریب متغیر a', symbol: 'a', min: 1, max: 5, step: 1, defaultValue: 2 },
  { name: 'ضریب متغیر b', symbol: 'b', min: 2, max: 10, step: 2, defaultValue: 4 },
];

export const GENERATED_QUESTION_VARIANTS: QuestionVariant[] = [
  {
    variantId: 'v-01',
    title: 'نسخه دانش‌آموز ۱',
    studentName: 'امیرحسین رضایی',
    variableAssignments: { 'v₀': 10, 'θ': 30, g: 9.8, a: 1, b: 2 },
    renderedFormula: '\\int x^2 dx = x^2 (1 + 2) + 1',
    expectedAnswer: '17',
    difficultyScore: 0.72,
  },
  {
    variantId: 'v-02',
    title: 'نسخه دانش‌آموز ۲',
    studentName: 'سارا محمدی',
    variableAssignments: { 'v₀': 15, 'θ': 45, g: 9.8, a: 2, b: 4 },
    renderedFormula: '\\int x^2 dx = x^2 (2 + 4) + 1',
    expectedAnswer: '31',
    difficultyScore: 0.74,
  },
  {
    variantId: 'v-03',
    title: 'نسخه دانش‌آموز ۳',
    studentName: 'مهدی کریمی',
    variableAssignments: { 'v₀': 20, 'θ': 60, g: 10, a: 3, b: 6 },
    renderedFormula: '\\int x^2 dx = x^2 (3 + 6) + 1',
    expectedAnswer: '48',
    difficultyScore: 0.75,
  },
  {
    variantId: 'v-04',
    title: 'نسخه دانش‌آموز ۴',
    studentName: 'نیما علوی',
    variableAssignments: { 'v₀': 25, 'θ': 45, g: 9.8, a: 4, b: 8 },
    renderedFormula: '\\int x^2 dx = x^2 (4 + 8) + 1',
    expectedAnswer: '65',
    difficultyScore: 0.73,
  },
  {
    variantId: 'v-05',
    title: 'نسخه دانش‌آموز ۵',
    studentName: 'مریم کمالی',
    variableAssignments: { 'v₀': 30, 'θ': 30, g: 10, a: 5, b: 10 },
    renderedFormula: '\\int x^2 dx = x^2 (5 + 10) + 1',
    expectedAnswer: '82',
    difficultyScore: 0.76,
  },
];

export const INTEGRITY_RADAR_NODES: IntegrityNode[] = [
  { id: 'st-sara', name: 'سارا محمدی', riskScore: 92, hasFlag: true },
  { id: 'st-amir', name: 'امیرحسین رضایی', riskScore: 89, hasFlag: true },
  { id: 'st-mehdi', name: 'مهدی کریمی', riskScore: 87, hasFlag: true },
  { id: 'st-nima', name: 'نیما علوی', riskScore: 45, hasFlag: false },
  { id: 'st-maryam', name: 'مریم کمالی', riskScore: 32, hasFlag: false },
];

export const INTEGRITY_RADAR_EDGES: IntegrityEdge[] = [
  {
    sourceId: 'st-sara',
    targetId: 'st-amir',
    similarityScore: 92,
    edgeStyle: 'solid',
    reason: 'همپوشانی خطای جبری مشابه در مرحله ۳ انتگرال',
  },
  {
    sourceId: 'st-amir',
    targetId: 'st-mehdi',
    similarityScore: 89,
    edgeStyle: 'dashed',
    reason: 'شباهت ساختار گرافیکی پاسخ بدون درج مراحل میانی',
  },
  {
    sourceId: 'st-sara',
    targetId: 'st-mehdi',
    similarityScore: 87,
    edgeStyle: 'dotted',
    reason: 'همبستگی پارامتری مشکوک در نسخه آزمون جایگزین',
  },
];

export const ANSWER_CLUSTERS: AnswerClusterGroup[] = [
  {
    clusterId: 'cls-1',
    clusterName: 'خوشه راه‌حل استاندارد دقیق',
    sampleAnswerLatex: '\\frac{x^3}{3} \\Big|_{-1}^{1} = \\frac{2}{3}',
    studentCount: 23,
    similarityPercent: 96,
    confidenceScore: 98,
    status: 'reviewed',
    representativeStudents: ['سارا محمدی', 'امیرحسین رضایی'],
  },
  {
    clusterId: 'cls-2',
    clusterName: 'خوشه خطای علامت در کران پایین',
    sampleAnswerLatex: '\\frac{1}{3} - \\frac{1}{3} = 0',
    studentCount: 13,
    similarityPercent: 92,
    confidenceScore: 90,
    status: 'pending',
    representativeStudents: ['مهدی کریمی', 'نیما علوی'],
  },
  {
    clusterId: 'cls-3',
    clusterName: 'خوشه تغییر متغیر بدون تغییر کران‌ها',
    sampleAnswerLatex: 'u = x^2 \\implies \\int u du',
    studentCount: 7,
    similarityPercent: 87,
    confidenceScore: 85,
    status: 'flagged',
    representativeStudents: ['مریم کمالی'],
  },
];
