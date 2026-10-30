# IMPLEMENTATION_STATUS.md
## Living Implementation Status: «مدرسه هوشمند آینده»

**Current Milestone:** Milestone 3 Completed (Verified) ➔ Proceeding to Milestone 4 (Flutter Mobile)  
**Last Updated:** 2026-10-30 12:10 Local Time  
**Branch:** `resume/integration`  
**Backup Tag:** `backup/pre-resume-20261030-1050`  

---

### Status Labels Key
- `VERIFIED`: Executed and passed all automated checks.
- `IMPLEMENTED`: Code exists, statically checked, not yet run in integration.
- `PARTIAL`: Incomplete implementation.
- `MOCK`: Synthetic/illustrative data or simulation.
- `HYBRID`: Real algorithmic logic with mock fallback.
- `BLOCKED`: Blocked by external toolchain with exact error.
- `NOT IMPLEMENTED`: Not started.

---

### Component & Route Status Table

| Subsystem / Route / Component | Status | Verification Evidence / Details |
| :--- | :--- | :--- |
| **Formatters (`src/lib/formatters.ts`)** | `VERIFIED` | 5/5 Vitest tests passed. Persian numerals (`fa-IR`), percent (`٪`), compact (`هزار`), scores (`۹۵ / ۱۰۰`), LTR timestamps (`03:14`). |
| **Design Tokens & CSS Variables** | `VERIFIED` | RGB channel tokens, Tailwind opacity modifiers (`bg-surface/85`, `border-border/80`), `@media (prefers-reduced-motion)` verified. |
| **Quality Gate 2 Repo Checks** | `VERIFIED` | `scripts/quality-gate-checks.mjs`: zero non-logical utilities, zero raw hex colors, zero `eval(`. |
| **Route: `/dashboard`** | `VERIFIED` | Prerendered in Next.js 15 build (6.25 kB). Integrated with live backend data and `useBackendStatus` hook. Shows live/mock pill, role switcher, 4 KPI cards, dual-series area chart, AI Assistant bento card, suspicious answers list with non-verdict disclaimer, grade distribution, recent activities, handwriting canvas (`۹۵ / ۱۰۰`), regrade stepper. |
| **Route: `/counselor`** | `VERIFIED` | Prerendered in Next.js 15 build (5.27 kB). Privacy audit header, 4 EWS KPI cards, risk trend chart, SHAP panel labeled «سهم نسبی در پیش‌بینی مدل — نه لزوماً علت» (MOCK), purpose-of-access modal, audit trail table, draft outreach with explicit human approval checkbox before send. |
| **Route: `/student`** | `VERIFIED` | Prerendered in Next.js 15 build (4.11 kB). Student KPI cards, Taraz uncertainty interval (`۹۳۰۰ تا ۹۶۰۰`), waveform audio player with timestamped topic anchors, 5-minute pop quiz with timer & radio feedback, handwriting evaluation, regrade tracker. |
| **Route: `/studio`** | `VERIFIED` | Prerendered in Next.js 15 build (8.55 kB). Parametric question builder with variable chips (`v₀, θ, g, a, b`), domain validation, 5 student variants, integrity radar network graph with solid/dashed/dotted edges, Gradescope-style answer cluster deck with batch grading + reversible undo. |
| **Route: `/mobile-preview`** | `VERIFIED` | Prerendered in Next.js 15 build (4.00 kB). Dual-device frame (iPhone 15 Pro, Pixel 8). ArUco camera scanner simulation with 4 corner markers (#0, #1, #2, #3), Laplacian blur meter (84%), perspective correction toggle, Instant AI score (`۹۵ / ۱۰۰`). Classroom audio & pop quiz screen. Clear simulation disclaimer. |
| **14 Agentic Components** | `VERIFIED` | `AgentStatusPill`, `KPIMetricSparkCard`, `StudentTrendSparkline`, `AIAssistantBentoCard`, `HandwritingEvaluationCanvas`, `SuspiciousAnswersListCard`, `RegradeTimelineStepper`, `StudentProgressAreaChart`, `GradeDistributionBarChart`, `RecentActivitiesTimeline`, `ClassAudioWaveformPlayer`, `ParametricQuestionBuilderCard`, `IntegrityRadarWidget`, `AnswerClusterDeck`. All compile with strict TypeScript, no warnings. |
| **FastAPI Backend (`apps/backend`)** | `VERIFIED` | 43/43 Pytest tests passed. Running on `http://127.0.0.1:8000`. OpenAPI schema exported to `apps/backend/openapi.json` (17 paths, full Pydantic v2 schemas). |
| **Web ↔ Backend Integration** | `VERIFIED` | `scripts/verify-web-backend-integration.mjs`: 11/11 live HTTP endpoints verified against running FastAPI backend with real requests, role propagation (`X-Demo-Role`), and graceful mock fallback. 10/10 Vitest tests passed. |
| **Flutter Mobile: `/apps/mobile`** | `NOT IMPLEMENTED` | Scheduled for Milestone 4 (Flutter 3.47.4 available). |

---

### Blockers
None.

---

### Decisions
1. Fixed root `.gitignore` which previously matched `lib/` without prefix, incorrectly ignoring `apps/web/src/lib/` and `apps/mobile/lib/`.
2. Created `apps/web/src/lib/api-client.ts` with transparent fallback to mock constants upon any network disruption or backend downtime.
3. Added `apps/web/src/hooks/useBackendStatus.ts` providing 15-second heartbeat probing and displaying dynamic connection pills in `Header.tsx`.
4. Verified 11/11 live endpoints in `scripts/verify-web-backend-integration.mjs` against the running server.

---

### NEXT 3 ACTIONS
1. **Milestone 4 (Flutter Mobile Structure):** Scaffold `apps/mobile/` with `flutter create --project-name smart_school .`, register `SchoolTokens` (ThemeExtension), bidi text helpers, and `api_client.dart`.
2. **Milestone 4 Screens:** Implement required mobile screens: `MobileShellScreen`, `ArUcoScannerScreen` (with 4 corner markers, blur meter, instant AI score `۹۵ / ۱۰۰`), `StudentSmartClassroomScreen` (audio player + 5-min pop quiz), `TeacherDashboardMobileScreen`, `CounselorEwsMobileScreen`.
3. **Milestone 4 Verification:** Run `flutter pub get`, `flutter analyze`, and `flutter test`. Report exact results and status.

---

### Exact Run Commands
```bash
# Web verification (all gates)
npm --prefix apps/web run gate:m1

# Backend tests
python -m pytest -v

# Live integration verification
node scripts/verify-web-backend-integration.mjs

# Mobile checks (Milestone 4)
cd apps/mobile
flutter pub get
flutter analyze
flutter test
```
