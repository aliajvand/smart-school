# AGENT_SQUAD_LOG.md
## Autonomous Multi-Team Engineering Log & Review Records
### «مدرسه هوشمند آینده» — AI-Powered Smart School & Assessment Platform

---

### Team Organization Structure

#### TEAM 1 — FOUNDATION & DESIGN SYSTEM
- **Principal Software Architect:** Leads monorepo architecture, application boundaries, and shared typing.
- **Design System Architect:** Enforces token hierarchy, dark glassmorphism, and AI aura halo discipline.
- **Frontend Infrastructure Engineer:** Next.js 15 App Router configuration, Tailwind build pipeline, SVG assets.
- **TypeScript Architecture Specialist:** Strict type safety, discriminated unions, zero `any` policy.
- **Accessibility and RTL Specialist:** Bidirectional text isolation, `.math-ltr`/`.code-ltr` scoping, `sr-only` table fallbacks.

#### TEAM 2 — TEACHER & PRINCIPAL EXPERIENCE
- **Senior Product Designer:** High-fidelity execution of `/dashboard` matching `00_main_teacher_dashboard_mockup.png`.
- **Senior React Engineer:** Bento grid interactive layout, role-scope switcher (`teacher` vs `principal`).
- **Data Visualization Engineer:** Area chart dual series, grade distribution bars, SVG sparklines.
- **Education Domain Engineer:** Pedagogical metrics, regrade stepper workflow, teacher evaluation ergonomics.
- **Frontend QA Engineer:** State boundary testing, loading/error states, responsive stacking.

#### TEAM 3 — COUNSELOR & EARLY WARNING SYSTEM (EWS)
- **Applied ML Engineer:** Personal historical baseline modelling, EWMA trends, SHAP feature attribution.
- **Data Visualization Specialist:** Risk trend curve, SHAP horizontal breakdown, priority risk chips.
- **Backend Integration Engineer:** REST contracts for student telemetry and counselor alerts.
- **Privacy and RBAC Engineer:** Human-in-the-loop outreach gates, minor protection policies, audit logging.
- **Senior Frontend Engineer:** High-craft `/counselor` interface matching `01_counselor_ews_dashboard_mockup.jpg`.

#### TEAM 4 — STUDENT SMART CLASSROOM
- **Learning Experience Designer:** Engaging, low-anxiety student UX matching `02_student_smart_classroom_mockup.jpg`.
- **Senior React Engineer:** Waveform player, synchronized notes, 5-minute pop quiz modal.
- **Audio Processing Engineer:** HTML5 Web Audio API waveform visualization, seek/scrub mechanics, timestamp synchronization.
- **Assessment UX Engineer:** Instant feedback on handwritten steps, Taraz uncertainty range (`۹۳۰۰ تا ۹۶۰۰`).
- **Accessibility QA Engineer:** Keyboard-navigable audio controls, screen reader announcements.

#### TEAM 5 — PARAMETRIC STUDIO & INTEGRITY RADAR
- **Scientific Computing Engineer:** Symbolic constraint formulation, domain range generation.
- **Mathematics and SymPy Specialist:** Safe math evaluation, syntax checking, variant calibration.
- **Graph Visualization Engineer:** Force/coordinate-based network graph for similarity radar, solid/dashed/dotted edge types.
- **Assessment Integrity Specialist:** Non-verdict framing, multi-signal clustering (HDBSCAN / AST error isomorphism), Gradescope-inspired review deck.
- **Senior Frontend Engineer:** `/studio` authoring environment matching `03_parametric_studio_and_integrity_mockup.jpg`.

#### TEAM 6 — MOBILE, BACKEND & INTEGRATION
- **Flutter Architect:** Riverpod state management, `SchoolTokens` ThemeExtension, clean layer architecture.
- **FastAPI Backend Architect:** Python 3.13 / FastAPI service structure, Pydantic v2 schemas, async endpoints.
- **AI Infrastructure Engineer:** LLM provider abstraction layer (`AI_PROVIDER`, `AI_MODEL_NAME`), mock fallback provider.
- **API Integration Engineer:** API v1 endpoints for dashboard, counselor, studio, integrity, and audio.
- **DevOps and Integration QA Engineer:** Verification scripts, test runners, `FLUTTER_TOMORROW_CHECKLIST.md`.

---

### Milestone 0: Environment Audit & Initial Setup (Completed)
- **Date:** 2026-10-30
- **Team Perspectives Consulted:**
  - *Principal Architect:* Verified directory structure. Initialized root git repo. Preserved all existing user assets in `smart_school_master_design_system_v4_audited/`. Copied `design-system/` to root.
  - *Frontend Infrastructure Engineer:* Node.js v24.12.0 and npm 11.6.2 verified.
  - *Accessibility & RTL Specialist:* Reviewed `03_CODE_READY/nextjs/globals.css` and `formatters.ts`. Verified Persian numeral formatting with `Intl.NumberFormat('fa-IR')`.
  - *DevOps / Integration QA:* Verified Python 3.13.9. Confirmed Flutter CLI is absent, enforcing the strict Phase 5 static generation and Phase 3 `/mobile-preview` web strategy.
  - *AI Infrastructure Engineer:* Installed 8 core Antigravity skills from pinned package `@rmyndharis/antigravity-skills@1.2.0` into `.agent/skills/`.
- **Decisions Recorded:**
  - Single source of truth for design tokens: `rgb(var(...) / <alpha-value>)` in CSS and `school_tokens.dart` in Flutter.
  - Canonical handwriting score across all screens: `۹۵ / ۱۰۰`.
  - Centralized mock data: `/apps/web/src/data/mock-platform-data.ts`.
- **Status:** Phase 0 Completed. Proceeding to Phase 1.
