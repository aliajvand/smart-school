# GEMINI.md — Smart School & Assessment Platform (Agent Directives v4.0 Audited)

## 1. Project Identity & Workspace Topology
We are building **مدرسه هوشمند آینده (AI-Powered Smart School)** — a dark-first, AI-agentic school & assessment platform across three workspaces:
- `/apps/web`: Next.js 15 (App Router, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Framer Motion, KaTeX).
- `/apps/mobile`: Flutter 3.x (Dart, Material 3, Riverpod, CustomPainter, `SchoolTokens` ThemeExtension).
- `/apps/backend`: FastAPI (Python 3.11+, Pydantic v2, async endpoints, `google-genai` SDK configured via `AI_MODEL_NAME` env var).

## 2. Mandatory Design System Source of Truth
All visual tokens, SVGs, mockups, and component specifications reside in `/design-system/`:
- `00_FOUNDATIONS/design_tokens.md` (RGB channel tokens supporting `<alpha-value>`, keyframes, and Flutter `SchoolTokens`)
- `00_FOUNDATIONS/typography_and_rtl_architecture.md` (Scoped `.math-ltr`/`.code-ltr` monospace + `Intl.NumberFormat('fa-IR')` helpers)
- `00_FOUNDATIONS/dashboard_bento_architecture.md` (Role-scoped Teacher vs. Principal dashboard shell)
- `00_FOUNDATIONS/multi_role_screens_architecture.md` (Counselor EWS, Student Smart Classroom, Parametric Studio, and Flutter Mobile specs)
- `00_FOUNDATIONS/brand_identity_and_assets.md` (Canonical raw SVG code)
- `01_COMPONENTS/` (14 modular component specifications using semantic tokens and accessible table/list fallbacks)
- `02_ASSETS/svg/` (7 vector SVG brand and AI agent state icons)
- `02_ASSETS/mockups/` (6 high-resolution visual mockups covering all 5 role screens + desktop presentation)
- `03_CODE_READY/` (`globals.css`, `tailwind.config.ts`, `formatters.ts`, and `school_tokens.dart`)

## 3. Strict Engineering & Product Rules (Post-Audit)
1. **Never use raw hex or slate classes in components:** Always consume semantic tokens (`bg-surface/85`, `border-border/80`, `text-text-primary`, `text-ai-cyan`, `text-warning`, `text-danger`, `text-success`).
2. **Safe Bidirectional Isolation:** Only `.math-ltr` and `.code-ltr` apply `JetBrains Mono`. Generic `[dir="ltr"]` elements keep the standard UI sans font.
3. **Programmatic Persian Numerals:** Use `formatFaNumber`, `formatFaPercent`, `formatFaCompact`, and `formatFaScore` from `formatters.ts` (and `SchoolTokens.toFaDigits` in Dart).
4. **No Model Names in UI:** Never display internal LLM model identifiers in user-facing UI components; read model names strictly from backend environment config (`AI_MODEL_NAME`).
5. **Trust, Privacy & Human-in-the-Loop:**
   - Similarity scores on both `SuspiciousAnswersListCard` and `IntegrityRadarWidget` must display the explicit non-verdict disclaimer.
   - Counselor EWS outreach to minors requires human counselor review and approval before sending.
   - SHAP bars must be labeled «سهم ویژگی‌ها در پیش‌بینی مدل (SHAP Feature Attribution)», never causal diagnosis.
   - Konkoor/Final Exam Taraz estimates must be shown as an uncertainty interval (e.g., `۹۳۰۰ تا ۹۶۰۰ (±۱۵۰)`).
