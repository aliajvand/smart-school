# IMPLEMENTATION_STATUS.md
## Live Progress Checklist: «مدرسه هوشمند آینده»

**Current Phase:** Phase 1 (Foundation & Design Tokens)  
**Last Updated:** 2026-10-30  

### Status Definitions
- `Not Started`: Task scheduled.
- `In Progress`: Active implementation.
- `Implemented`: Source code written and statically reviewed.
- `Tested`: Validated via unit/build/runtime execution.
- `Blocked`: Awaiting external fix or dependency.
- `Deferred`: Out of immediate scope.

---

### Phase Checklist

| Phase | Description | Status | Verification Evidence / Changed Files |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Repository Audit, Skills, & Git Checkpoints | **Tested** | `PROJECT_AUDIT.md`, `SKILL_AUDIT.md`, `.git`, `.gitignore`, `design-system/` copied to root. |
| **Phase 1** | Foundation & Design System (`/apps/web`) | **In Progress** | `apps/web/package.json`, `apps/web/src/lib/formatters.ts`, `apps/web/src/data/mock-platform-data.ts`, `globals.css`, `tailwind.config.ts`. |
| **Phase 2.1** | Teacher & Principal Dashboard (`/dashboard`) | `Not Started` | `apps/web/src/app/dashboard/page.tsx`, 14 Bento components. |
| **Phase 2.2** | Counselor & EWS Portal (`/counselor`) | `Not Started` | `apps/web/src/app/counselor/page.tsx`, SHAP attribution, human approval workflow. |
| **Phase 2.3** | Student Smart Classroom (`/student`) | `Not Started` | `apps/web/src/app/student/page.tsx`, audio player, synchronized notes, pop quiz. |
| **Phase 2.4** | Parametric Studio & Integrity (`/studio`) | `Not Started` | `apps/web/src/app/studio/page.tsx`, variable chips, integrity radar, cluster deck. |
| **Phase 3** | Mobile Web Preview (`/mobile-preview`) | `Not Started` | `apps/web/src/app/mobile-preview/page.tsx`, ArUco camera scanner simulation. |
| **Phase 4** | FastAPI Backend (`/apps/backend`) | `Not Started` | FastAPI app, Pydantic v2 schemas, SymPy validator, API v1 routes, pytest suite. |
| **Phase 5** | Flutter Mobile Source (`/apps/mobile`) | `Not Started` | Static Dart files, Riverpod providers, `FLUTTER_TOMORROW_CHECKLIST.md`. |
| **Phase 6** | End-to-End QA, Build & Verification | `Not Started` | `npm run build`, `pytest`, `TEST_REPORT.md`. |

---

### 14 Component Contracts Status

| Component | Target Location | Status | Key Contract Attributes |
| :--- | :--- | :--- | :--- |
| 1. `AgentStatusPill` | `components/agentic/AgentStatusPill.tsx` | `Not Started` | States: idle, listening, thinking, flagged. Glowing border, progress indicator. |
| 2. `ParametricQuestionBuilderCard` | `components/agentic/ParametricQuestionBuilderCard.tsx` | `Not Started` | Variables `v₀, θ, g`, formula rendering, 5 variant cards. |
| 3. `ClassAudioWaveformPlayer` | `components/agentic/ClassAudioWaveformPlayer.tsx` | `Not Started` | Waveform, scrubber, timestamp, clickable topic note markers. |
| 4. `HandwritingEvaluationCanvas` | `components/agentic/HandwritingEvaluationCanvas.tsx` | `Not Started` | Canonical score `۹۵ / ۱۰۰`, bounding box overlay, sparkline. |
| 5. `AnswerClusterDeck` | `components/agentic/AnswerClusterDeck.tsx` | `Not Started` | Gradescope-style clustering, confidence pill, batch action. |
| 6. `IntegrityRadarWidget` | `components/agentic/IntegrityRadarWidget.tsx` | `Not Started` | Network graph, stroke dash differentiation (solid/dashed/dotted), non-verdict disclaimer. |
| 7. `StudentTrendSparkline` | `components/agentic/StudentTrendSparkline.tsx` | `Not Started` | SVG sparkline with gradient fill, tone variants (cyan, violet, emerald, amber, coral). |
| 8. `RegradeTimelineStepper` | `components/agentic/RegradeTimelineStepper.tsx` | `Not Started` | 4-step workflow: ثبت درخواست ← بررسی معلم ← نظر مشاور ← تایید نهایی. |
| 9. `KPIMetricSparkCard` | `components/agentic/KPIMetricSparkCard.tsx` | `Not Started` | Role-scoped figures (`۱۲۸` vs `۱۲٫۵ هزار`), delta percentage, sparkline. |
| 10. `AIAssistantBentoCard` | `components/agentic/AIAssistantBentoCard.tsx` | `Not Started` | 3D AI robot mascot, glowing aura rings, animated waveform bars, action button. |
| 11. `StudentProgressAreaChart` | `components/agentic/StudentProgressAreaChart.tsx` | `Not Started` | Dual series (class vs school), time range switcher, `sr-only` table fallback. |
| 12. `GradeDistributionBarChart` | `components/agentic/GradeDistributionBarChart.tsx` | `Not Started` | Bar chart with gradient fill, threshold markers, `sr-only` list fallback. |
| 13. `SuspiciousAnswersListCard` | `components/agentic/SuspiciousAnswersListCard.tsx` | `Not Started` | Student list with similarity badges, mandatory non-verdict banner. |
| 14. `RecentActivitiesTimeline` | `components/agentic/RecentActivitiesTimeline.tsx` | `Not Started` | Timestamped event stream with status icons and colored badges. |
