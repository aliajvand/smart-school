# IMPLEMENTATION_STATUS.md
## Living Implementation Status: «مدرسه هوشمند آینده»

**Current Milestone:** Milestone 2 Completed (Verified) ➔ Proceeding to Milestone 3 (Web ↔ Backend Integration)  
**Last Updated:** 2026-10-30 12:05 Local Time  
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
| **Route: `/dashboard`** | `VERIFIED` | Prerendered in Next.js 15 build (5.23 kB). Teacher & Principal role switcher, 4 KPI cards, dual-series area chart, AI Assistant bento card, suspicious answers list with non-verdict disclaimer, grade distribution, recent activities, handwriting canvas (`۹۵ / ۱۰۰`), regrade stepper. |
| **Route: `/counselor`** | `VERIFIED` | Prerendered in Next.js 15 build (5.27 kB). Privacy audit header, 4 EWS KPI cards, risk trend chart, SHAP panel labeled «سهم نسبی در پیش‌بینی مدل — نه لزوماً علت» (MOCK), purpose-of-access modal, audit trail table, draft outreach with explicit human approval checkbox before send. |
| **Route: `/student`** | `VERIFIED` | Prerendered in Next.js 15 build (4.11 kB). Student KPI cards, Taraz uncertainty interval (`۹۳۰۰ تا ۹۶۰۰`), waveform audio player with timestamped topic anchors, 5-minute pop quiz with timer & radio feedback, handwriting evaluation, regrade tracker. |
| **Route: `/studio`** | `VERIFIED` | Prerendered in Next.js 15 build (8.55 kB). Parametric question builder with variable chips (`v₀, θ, g, a, b`), domain validation, 5 student variants, integrity radar network graph with solid/dashed/dotted edges, Gradescope-style answer cluster deck with batch grading + reversible undo. |
| **Route: `/mobile-preview`** | `VERIFIED` | Prerendered in Next.js 15 build (4.00 kB). Dual-device frame (iPhone 15 Pro, Pixel 8). ArUco camera scanner simulation with 4 corner markers (#0, #1, #2, #3), Laplacian blur meter (84%), perspective correction toggle, Instant AI score (`۹۵ / ۱۰۰`). Classroom audio & pop quiz screen. Clear simulation disclaimer. |
| **14 Agentic Components** | `VERIFIED` | `AgentStatusPill`, `KPIMetricSparkCard`, `StudentTrendSparkline`, `AIAssistantBentoCard`, `HandwritingEvaluationCanvas`, `SuspiciousAnswersListCard`, `RegradeTimelineStepper`, `StudentProgressAreaChart`, `GradeDistributionBarChart`, `RecentActivitiesTimeline`, `ClassAudioWaveformPlayer`, `ParametricQuestionBuilderCard`, `IntegrityRadarWidget`, `AnswerClusterDeck`. All compile with strict TypeScript, no warnings. |
| **FastAPI Backend (`apps/backend`)** | `VERIFIED` | 43/43 Pytest unit & integration tests passed in 1.66s. Running on `http://127.0.0.1:8000`. OpenAPI schema exported to `apps/backend/openapi.json` (16 paths, full Pydantic v2 schemas). |
| **Math Engine (`math_engine.py`)** | `VERIFIED` | Safe SymPy evaluation via AST parsing (`safe_parse_math`). Rejects `__import__`, `os.system`, attribute access, semicolons, excessive exponents (>100), and unauthorized symbols. Evaluates parametric question variants. |
| **EWS Engine (`ews_engine.py`)** | `VERIFIED` | Exponentially Weighted Moving Average (EWMA) correctly ignores `None` (does not treat missing grades as zero). Normalizes SHAP attributions to 100%. Assesses multidimensional risk categories. |
| **Grading Engine (`grading_engine.py`)** | `VERIFIED` | Step-based rubric scoring, partial arithmetic deductions, score clamping to `[min_score, max_score]`, batch cluster scoring with reversible state. |
| **Integrity Engine (`integrity_engine.py`)**| `VERIFIED` | Token-based Jaccard similarity, edge classification (solid for high risk, dashed for moderate, dotted for low). Non-verdict disclaimer mandatory. |
| **Demo RBAC & Audit (`security.py`, `audit.py`)** | `VERIFIED` | Enforces `X-Demo-Role` header checking against allowed roles (`teacher`, `counselor`, `student`, `principal`, `super_admin`). Logs all sensitive data access into in-memory audit trail. Explicit non-production header disclaimer. |
| **Flutter Mobile: `/apps/mobile`** | `NOT IMPLEMENTED` | Scheduled for Milestone 4 (Flutter 3.47.4 available). |

---

### Blockers
None for Milestones 1 and 2.

---

### Decisions
1. Used `Intl.NumberFormat('fa-IR')` exclusively in `formatters.ts` to guarantee deterministic Persian numerals across all browsers without font OpenType flags.
2. Standardized canonical handwriting score to `۹۵ / ۱۰۰` across all web and mobile specs.
3. Added `gate:m1` script to automate Quality Gate checks (repo rules, TypeScript, Vitest, Next.js build).
4. Flutter 3.47.4 / Dart 3.13.3 is detected on the machine; when reaching Milestone 4, will run `flutter pub get`, `flutter analyze`, and `flutter test`.
5. In FastAPI backend, built server-side demo RBAC dependency with explicit non-production header `X-Demo-Role` and in-memory audit trail logging.
6. Replaced unsafe evaluation with pure SymPy AST-constrained `safe_parse_math` strictly enforcing authorized parameter symbols.
7. Generated and exported `apps/backend/openapi.json` containing all 16 endpoints and schemas for frontend/mobile client synchronization.

---

### NEXT 3 ACTIONS
1. **Milestone 3 (Web ↔ Backend Integration):** Create typed API client in `/apps/web/src/lib/api-client.ts` with network error handling, role propagation (`X-Demo-Role`), and graceful fallback to local mock data if the backend is unreachable.
2. **Milestone 3 Header & Route Hookup:** Add live backend connectivity indicator pill to `Header.tsx` («متصل به سرور بک‌اند» vs «سرور در دسترس نیست — داده نمونه») and wire pages to load live backend data when available.
3. **Milestone 4 (Flutter Mobile Implementation):** Scaffold Flutter app structure in `apps/mobile/`, implement `SchoolTokens`, core screens, and verify with `flutter pub get`, `flutter analyze`, and `flutter test`.

---

### Exact Run Commands
```bash
# Web verification (all gates)
cd apps/web
npm run gate:m1

# Backend tests (Milestone 2)
python -m pytest -v

# Backend server run
python -m uvicorn app.main:app --app-dir apps/backend --port 8000 --host 127.0.0.1
```
