# SKILL_AUDIT.md
## Audit of Discovered and Applied Google Antigravity Skills

**Project:** «مدرسه هوشمند آینده» (AI-Powered Smart School & Assessment Platform)  
**Date:** 2026-10-30  
**Status:** Audited & Installed  
**Source Package:** `@rmyndharis/antigravity-skills@1.2.0`  

---

### 1. Discovered Skills & Installation Verification

The skills catalog was queried directly via `npx --yes @rmyndharis/antigravity-skills@1.2.0 list`. The vault contains 306 specialized engineering skills. The following core skills required for this platform were selected, inspected, and installed into `.agent/skills/`:

| Skill Identifier | Category | Target Application | Status | Justification & Applied Role |
| :--- | :--- | :--- | :--- | :--- |
| `nextjs-app-router-patterns` | Frontend Architecture | `/apps/web` | Installed | Next.js 15 App Router best practices, server vs client component isolation, layout composition. |
| `react-modernization` | Frontend Architecture | `/apps/web` | Installed | React 19 concurrent patterns, transition hooks, modern component lifecycle. |
| `typescript-pro` | Type Engineering | `/apps/web`, Contracts | Installed | Strict type definitions, disciminated unions, generic component typing, zero `any` policy. |
| `tailwind-design-system` | Design System | Shared Tokens | Installed | RGB channel alpha support (`rgb(var(...) / <alpha-value>)`), dark-first tokens, elevation & aura rules. |
| `wcag-audit-patterns` | Accessibility | All Frontends | Installed | High-contrast glassmorphism, screen reader fallbacks (`sr-only` tables/lists), keyboard focus states, RTL semantics. |
| `frontend-mobile-development-component-scaffold` | Mobile Architecture | `/apps/mobile` & `/mobile-preview` | Installed | Clean architecture for mobile components, Riverpod state models, responsive device framing. |
| `fastapi-pro` | Backend Architecture | `/apps/backend` | Installed | FastAPI modular routers, Pydantic v2 schemas, dependency injection, async service layer. |
| `prompt-engineering-patterns` | AI Architecture | Neuro-Symbolic Core | Installed | Safe prompt templates, non-deterministic boundary validation, LLM structured JSON output validation. |

---

### 2. Environment Verification

- **Node.js:** v24.12.0
- **npm:** 11.6.2
- **Python:** 3.13.9
- **Git:** 2.55.0.windows.3
- **Flutter / Dart CLI:** Strictly guarded — NOT executed in accordance with Phase 0 / Phase 5 instructions. Statically generated Dart workspace under `/apps/mobile/`.

---

### 3. Integration Guidelines

1. **RTL & Persian Typography:** Scoped `.math-ltr` and `.code-ltr` for JetBrains Mono; Vazirmatn / IRANSansX for RTL Persian text.
2. **Numeric Determinism:** All numbers, percentages, and scores routed through `formatFaNumber`, `formatFaPercent`, `formatFaCompact`, and `formatFaScore` using `Intl.NumberFormat('fa-IR')`.
3. **No Direct Execution of Unknown Scripts:** All skills installed from pinned version `@rmyndharis/antigravity-skills@1.2.0`.
