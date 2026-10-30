# CLAUDE_MASTER_REVIEW_AND_SPEC.md (v4.0 — All Audit Items Resolved)

## 1. Resolution Summary of Claude's v3 Audit

Every single technical, visual, accessibility, and product-risk item raised in your v3 review has been resolved in this v4 package:

| # | Audit Finding in v3 | Exact Fix Implemented in v4 |
| :--- | :--- | :--- |
| **1** | Missing `02_ASSETS/svg/` directory in v3 ZIP | Restored all **7 canonical SVG files** (`brand-icon.svg`, `wordmark-horizontal.svg`, `app-icon-512.svg`, `agent-idle.svg`, `agent-listening.svg`, `agent-thinking.svg`, `agent-flagged.svg`) inside `/design-system/02_ASSETS/svg/`. |
| **2** | Dangerous `[dir="ltr"]` rule forcing `JetBrains Mono` on all LTR text | Fixed in `03_CODE_READY/nextjs/globals.css`: `[dir="ltr"]` now only sets `direction: ltr; unicode-bidi: isolate;`. Monospace (`var(--font-mono-ltr)`) is scoped strictly to `.math-ltr` and `.code-ltr`. |
| **3** | Unverified `ss01` numeral assumption & Latin digits in `Math.round(...)%` | Added `03_CODE_READY/nextjs/formatters.ts` using `Intl.NumberFormat('fa-IR')` (`formatFaNumber`, `formatFaPercent`, `formatFaCompact`, `formatFaScore`) and `SchoolTokens.toFaDigits` in Flutter. All components now render deterministic Persian numerals (`۹۸٪`, `۱۲٫۵ هزار`, `۹۵ / ۱۰۰`). |
| **4** | Tailwind hex CSS variables broke opacity modifiers (`bg-surface/85`) | Converted all CSS color variables in `globals.css` to **RGB channels** (`--color-surface-rgb: 15 23 42`) and mapped them in `tailwind.config.ts` via `rgb(var(--color-surface-rgb) / <alpha-value>)`. |
| **5** | Missing `animate-agent-pulse` keyframe, motion/blur tokens, and incomplete Dart tokens | Added `keyframes` (`agent-pulse`, `aura-sweep`), `animation`, `backdropBlur`, and `transitionDuration` to `tailwind.config.ts`. Expanded `school_tokens.dart` with `radiusCard`, `radiusControl`, `radiusPill`, `blurGlassSigma`, `space1..6`, `motionFast/Base/Slow`, `aiAuraGradient`, `panelShadow`, and `aiAuraShadow`. |
| **6** | Components bypassed semantic tokens with raw `slate`/`cyan` classes | Refactored all 14 component blueprints in `01_COMPONENTS/` to use semantic classes (`bg-surface/85`, `border-border/80`, `text-text-primary`, `text-ai-cyan`, `text-warning`, `text-danger`, `text-success`). |
| **7** | Hardcoded English strings in `IntegrityRadarWidget` | Replaced with Persian defaults (`رادار بررسی شباهت پاسخ‌ها`, `ثبت بررسی دبیر`, `رد شباهت`) and exposed an optional `labels` prop for full i18n customization. |
| **8** | Mockup vs. Spec score/count mismatch (`۹۵ / ۱۰۵` vs `۹۵ / ۱۰۰`, `۱۲.۵k` in teacher view, missing Flutter mobile mockup) | • Standardized handwriting score to **`۹۵ / ۱۰۰`** (`formatFaScore(95, 100)`).<br>• Added role-scope switcher in `SmartSchoolDashboard`: Teacher view shows `۱۲۸ دانش‌آموز کلاس‌های من`; Principal view shows `۱۲٫۵ هزار دانش‌آموز فعال`.<br>• Replaced the 3 busy wireframe PNGs with the **4 high-craft dark glassmorphic mockups** matching `00_main_teacher_dashboard_mockup.png` (including `04_flutter_mobile_aruco_scanner_mockup.jpg`).<br>• Removed `Gemini 3.8 Pro Active` badge from UI; model selection is strictly a backend env variable (`AI_MODEL_NAME`). |
| **9** | Accessibility & `prefers-reduced-motion` gaps in the 6 Bento widgets & `IntegrityRadarWidget` | • Added `sr-only` accessible `<table>` / `<ul>` equivalents to `StudentProgressAreaChart` and `GradeDistributionBarChart`.<br>• Added stroke dash differentiation (`6 4` dashed vs. solid vs. `2 4` dotted) to `IntegrityRadarWidget` edges and increased SVG node font size from `8` to `12`.<br>• Added global `@media (prefers-reduced-motion: reduce)` and `motion-reduce:animate-none`. |
| **10** | Product & Minor-Protection Risks (Suspicious card framing, EWS outreach to minors, SHAP causal wording, Konkoor Taraz point estimate, benchmark claims, npm script) | • Added mandatory non-verdict banner to `SuspiciousAnswersListCard`.<br>• Gated Counselor EWS behind RBAC + audit logs; AI only drafts academic check-in templates that require **explicit human counselor approval** before sending.<br>• Renamed SHAP section to «سهم ویژگی‌ها در پیش‌بینی مدل (SHAP Feature Attribution)» with non-causal disclaimer.<br>• Changed Konkoor Taraz to an uncertainty range (`۹۳۰۰ تا ۹۶۰۰ ±۱۵۰`).<br>• Framed literature MAE ($0.24$ vs $0.70$) as a target hypothesis to be validated on local Persian handwriting datasets.<br>• Pinned `@rmyndharis/antigravity-skills@1.2.0` and added `--dry-run` mode to `setup_antigravity_skills.sh`. |

---

## 2. Complete Directory Map of v4 ZIP

- `CLAUDE_MASTER_REVIEW_AND_SPEC.md` (This document)
- `GEMINI.md`
- `implementation_plan.md`
- `setup_antigravity_skills.sh` (Version-pinned with `--dry-run` support)
- `design-system/`
  - `README.md`
  - `00_FOUNDATIONS/`
    - `design_tokens.md`
    - `typography_and_rtl_architecture.md`
    - `dashboard_bento_architecture.md`
    - `multi_role_screens_architecture.md`
    - `brand_identity_and_assets.md`
  - `01_COMPONENTS/` (14 audited component `.md` files)
  - `02_ASSETS/`
    - `svg/` (All 7 canonical vector SVGs)
    - `mockups/` (All 6 high-resolution dark glassmorphic mockups: Teacher, Desktop Presentation, Counselor EWS, Student Classroom, Parametric Studio, and Flutter Mobile Scanner)
  - `03_CODE_READY/`
    - `nextjs/globals.css`
    - `nextjs/tailwind.config.ts`
    - `nextjs/formatters.ts`
    - `flutter/school_tokens.dart`
