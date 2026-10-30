# PROJECT_AUDIT.md
## Comprehensive Initial Repository & Asset Audit
### «مدرسه هوشمند آینده» — AI-Powered Smart School & Assessment Platform

**Audit Date:** 2026-10-30  
**Lead Auditor:** Principal AI Engineering Director & Chief Software Architect  
**Repository State:** Initialized (Git initialized at `D:\startup\school`)  

---

### 1. Executive Summary & Inventory

The repository contains extensive pre-audit specifications and assets from version 4.0 (`smart_school_master_design_system_v4_audited` and `design-system`):
- **Mockup Inventory (6 high-craft visual references in `/design-system/02_ASSETS/mockups/`):**
  1. `00_desktop_workspace_presentation.jpg` (596 KB): Panoramic curved ultrawide presentation showing the complete Bento dashboard with RGB ambient lighting.
  2. `00_main_teacher_dashboard_mockup.png` (1.59 MB): Complete teacher and academic lead dashboard with dual-series area chart, AI Assistant bento card, suspicious answers list, grade distribution, recent activities, handwriting evaluation, and regrade stepper.
  3. `01_counselor_ews_dashboard_mockup.jpg` (542 KB): School counselor & Early Warning System (EWS) portal with risk progression area chart, AI counselor assistant, SHAP/factors analysis bar chart, student priority queue, and consultation stepper.
  4. `02_student_smart_classroom_mockup.jpg` (578 KB): Student smart classroom showing interactive class audio player with waveform, topic-synchronized notes, 5-minute pop quiz with math expressions, handwriting feedback, and estimated Taraz interval.
  5. `03_parametric_studio_and_integrity_mockup.jpg` (618 KB): Parametric question builder with variable chips, 5 student variant previews, integrity radar network graph with similarity weights, Gradescope-style answer cluster deck, and handwriting evaluation canvas.
  6. `04_flutter_mobile_aruco_scanner_mockup.jpg` (596 KB): Mobile companion dual-mockup featuring student home/voice notes/pop-quiz on the left and full-screen camera ArUco marker detection with perspective-corrected exam paper grading on the right.

- **Vector Asset Inventory (7 canonical SVGs in `/design-system/02_ASSETS/svg/`):**
  - `brand-icon.svg`: Glowing Neural Book emblem.
  - `wordmark-horizontal.svg`: Typography logo with English/Persian lockup.
  - `app-icon-512.svg`: High-resolution application icon.
  - `agent-idle.svg`, `agent-listening.svg`, `agent-thinking.svg`, `agent-flagged.svg`: 4 stateful AI agent status icons.

- **Component Specifications (14 audited specifications in `/design-system/01_COMPONENTS/`):**
  - `AgentStatusPill.md`
  - `AIAssistantBentoCard.md`
  - `AnswerClusterDeck.md`
  - `ClassAudioWaveformPlayer.md`
  - `GradeDistributionBarChart.md`
  - `HandwritingEvaluationCanvas.md`
  - `IntegrityRadarWidget.md`
  - `KPIMetricSparkCard.md`
  - `ParametricQuestionBuilderCard.md`
  - `RecentActivitiesTimeline.md`
  - `RegradeTimelineStepper.md`
  - `StudentProgressAreaChart.md`
  - `StudentTrendSparkline.md`
  - `SuspiciousAnswersListCard.md`

- **Foundational Architecture Documents (in `/design-system/00_FOUNDATIONS/`):**
  - `brand_identity_and_assets.md`
  - `dashboard_bento_architecture.md`
  - `design_tokens.md`
  - `multi_role_screens_architecture.md`
  - `typography_and_rtl_architecture.md`

- **Code-Ready Artifacts (in `/design-system/03_CODE_READY/`):**
  - `nextjs/globals.css`: Full RGB CSS variables and safe RTL/LTR typography isolation.
  - `nextjs/tailwind.config.ts`: Tailwind configuration with RGB `<alpha-value>` composability, keyframes, and animations.
  - `nextjs/formatters.ts`: Deterministic Persian number formatting via `Intl.NumberFormat('fa-IR')`.
  - `flutter/school_tokens.dart`: Complete `ThemeExtension<SchoolTokens>` with `toFaDigits` helper.

---

### 2. Technical Stack & Environment Audit

| Subsystem | Target Technology | Host Environment Detection | Status & Action |
| :--- | :--- | :--- | :--- |
| **Node.js Runtime** | Node 20+ LTS | Node `v24.12.0`, npm `11.6.2` | Verified. Fully compatible with Next.js 15. |
| **Python Runtime** | Python 3.11+ | Python `3.13.9` | Verified. Fully compatible with FastAPI, Pydantic v2, SymPy. |
| **Version Control** | Git 2.x | Git `2.55.0.windows.3` | Initialized at repository root (`D:\startup\school`). |
| **Flutter / Dart CLI** | Flutter 3.x | **CLI Not Installed / Guarded** | **Strict Guardrail Active:** No flutter/dart CLI commands will be run. Complete Flutter source code will be statically generated in `/apps/mobile/` and accompanied by `FLUTTER_TOMORROW_CHECKLIST.md`. High-fidelity interactive web preview provided at `/mobile-preview`. |

---

### 3. Identified Architectural Inconsistencies & Gaps (Resolved in Architecture)

1. **Monorepo Structure Gaps:** The repository originally contained design assets in `smart_school_master_design_system_v4_audited` and loose files in `documnet`. The canonical monorepo structure (`/apps/web`, `/apps/backend`, `/apps/mobile`, `/design-system`) is now being created at root.
2. **Numeric Representation:** In previous revisions, hardcoded English numbers (`12.5k`, `95 / 105`) conflicted with Persian UI. The design system enforces `Intl.NumberFormat('fa-IR')` across all components and sets canonical handwriting score to `۹۵ / ۱۰۰`.
3. **Role Scope Distinction:** Teacher scope (`۱۲۸ دانش‌آموز کلاس‌های من`) vs. Principal scope (`۱۲٫۵ هزار دانش‌آموز فعال`) must be reactive across KPI widgets.
4. **Safety & Non-Verdict Framing:** Academic integrity indicators (suspicious answer lists, similarity radar) must display clear investigative disclaimers, never automated guilt verdicts. Counselor EWS messages must be framed as non-causal statistical associations and require explicit human counselor sign-off before outreach to minors.
5. **AI Provider Decoupling:** Never hardcode LLM model names in the UI. All AI integration must be configured through environment variables (`AI_PROVIDER`, `AI_MODEL_NAME`, `AI_API_KEY`).

---

### 4. Implementation Phasing Strategy

- **Phase 0:** Audit, git initialization, skills audit, organization setup. (Current)
- **Phase 1:** Foundation & Design System (`/apps/web` setup, Tailwind RGB tokens, typography, formatters, shared components, centralized mock data).
- **Phase 2:** Core Web Product:
  - `/dashboard`: Teacher & Principal Dashboard
  - `/counselor`: Counselor & Early Warning System (EWS) Portal
  - `/student`: Student Smart Classroom & Voice-to-Note
  - `/studio`: Parametric Question Studio & Integrity Radar
- **Phase 3:** Mobile Web Preview (`/mobile-preview`): Interactive device framing with ArUco document scanner simulation and class audio player.
- **Phase 4:** FastAPI Backend (`/apps/backend`): Pydantic v2 schemas, modular API v1 routers, SymPy math validation, mock repositories, and test suite.
- **Phase 5:** Mobile Source Generation (`/apps/mobile`): Complete Flutter Riverpod workspace with `SchoolTokens`, screens, and `FLUTTER_TOMORROW_CHECKLIST.md`.
- **Phase 6:** Verification & QA: Build verification, TypeScript validation, test execution, end-to-end routing check, and final delivery report.
