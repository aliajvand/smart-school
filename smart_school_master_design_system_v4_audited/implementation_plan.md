# Implementation Plan — Phase 1 (Design System & Agentic UI v4.0) & Phase 2 (AI Core)

## Phase 1: Design System & Interactive Frontend (Current Priority)

### Step 1.1: Monorepo, Token & Asset Initialization
- Initialize `/apps/web` (Next.js 15 + Tailwind CSS) and copy `/design-system/03_CODE_READY/nextjs/globals.css`, `tailwind.config.ts`, and `formatters.ts` (`src/lib/formatters.ts`).
- Initialize `/apps/mobile` (Flutter 3.x) and register `SchoolTokens.dark` from `/design-system/03_CODE_READY/flutter/school_tokens.dart`.
- Copy all 7 SVG files from `/design-system/02_ASSETS/svg/` into `/apps/web/public/assets/svg/` and `/apps/mobile/assets/svg/`.

### Step 1.2: Implement the 14 Semantic-Token Components
Build all 14 components from `/design-system/01_COMPONENTS/` using semantic Tailwind tokens (`bg-surface/85`, `border-border/80`, `shadow-panel`, `shadow-ai` only on AI presence) and `formatters.ts`:
1. `AgentStatusPill`
2. `ParametricQuestionBuilderCard`
3. `ClassAudioWaveformPlayer`
4. `HandwritingEvaluationCanvas` (Canonical score `۹۵ / ۱۰۰`)
5. `AnswerClusterDeck`
6. `IntegrityRadarWidget` (Dashed/solid/dotted stroke patterns + `12px` labels + Persian i18n props)
7. `StudentTrendSparkline`
8. `RegradeTimelineStepper`
9. `KPIMetricSparkCard` (Role-scoped counts: `۱۲۸` class students vs. `۱۲٫۵ هزار` school-wide)
10. `AIAssistantBentoCard`
11. `StudentProgressAreaChart` (Solid vs. dashed series + `sr-only` table fallback)
12. `GradeDistributionBarChart` (`sr-only` list fallback)
13. `SuspiciousAnswersListCard` (Mandatory non-verdict disclaimer banner)
14. `RecentActivitiesTimeline`

### Step 1.3: Assemble All 5 Role Screens Matching `/design-system/02_ASSETS/mockups/`
- `/dashboard` — Teacher & Principal Dashboard (`00_main_teacher_dashboard_mockup.png`)
- `/counselor` — Counselor & EWS Portal (`01_counselor_ews_dashboard_mockup.jpg`)
- `/student` — Student Smart Classroom & Voice-to-Note (`02_student_smart_classroom_mockup.jpg`)
- `/studio` — Parametric Question Studio & Integrity Radar (`03_parametric_studio_and_integrity_mockup.jpg`)
- `MobileShell` (Flutter) — ArUco Handwritten Exam Scanner & Mobile Audio Note (`04_flutter_mobile_aruco_scanner_mockup.jpg`)

---

## Phase 2: FastAPI Backend & Empirical Validation Benchmarks
1. **Parametric Question Engine:** LLM structured JSON + `SymPy` symbolic solver + 2PL IRT calibration.
2. **Handwriting Grader:** Edge OpenCV (`ArUco` Homography + Laplacian blur check) + Multimodal VLM evaluation (empirically benchmarked on your own Persian handwritten dataset before enabling high-confidence auto-suggestions).
3. **Integrity & Clustering:** Semantic embeddings + HDBSCAN + AST error isomorphism graph.
4. **Classroom Voice-to-Note:** Opus audio compression + Silero VAD + Persian ASR + Map-Reduce Markdown note & pop-quiz generator.
5. **Early Warning System (EWS):** Personal EWMA baseline + Time-Windowed XGBoost + SHAP feature attribution cards.
