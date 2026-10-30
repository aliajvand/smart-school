# Design Tokens — Smart School & Assessment Platform (v4.0 Production Audited)

Version: 4.0.0  
Theme: Dark-first / Cyber-Educational / AI-agentic  
Targets: Next.js 15 + Tailwind CSS + shadcn/ui; Flutter 3.x + Material 3 + Riverpod

## 1. Token Principles

- **Semantic & Alpha-Composable First:** All color tokens are defined as space-separated RGB channels (`--color-surface-rgb: 15 23 42`) mapped into Tailwind with `rgb(var(--color-surface-rgb) / <alpha-value>)`. This guarantees that opacity modifiers such as `bg-surface/85`, `border-border/80`, and `bg-ai-violet/15` work natively without raw hex values.
- **Halo Discipline (AI Presence Only):** Neon aura gradients (`from-ai-violet via-ai-indigo to-ai-cyan` and `shadow-ai`) are reserved strictly for active AI agent states (`AgentStatusPill` in `thinking` state, `AIAssistantBentoCard`, and active navigation indicators). Standard Bento data cards use `bg-surface/85 border-border/80 shadow-panel`.
- **Accessible by Default:** Never communicate status through color alone; pair color with icon, label, stroke dash pattern, and text.
- **Motion is Informative:** Animation signals a real operation and stops when the operation stops. Respect `prefers-reduced-motion` (`motion-reduce:animate-none`) and Flutter `MediaQuery.disableAnimationsOf(context)`.
- **Safe Bidirectional Isolation:** Persian UI is RTL (`dir="rtl"`, `lang="fa"`). Only `.math-ltr` and `.code-ltr` switch to `JetBrains Mono`; generic `[dir="ltr"]` elements preserve the standard sans-serif UI font.
- **Locale-Verified Persian Numerals:** Do not rely on unverified font feature flags (`ss01`/`fd`) alone. All user-facing counts, percentages (`۹۸٪`), and scores (`۹۵ / ۱۰۰`) must be formatted via `Intl.NumberFormat('fa-IR')` (see `03_CODE_READY/nextjs/formatters.ts` and `SchoolTokens.toFaDigits` in Dart).

## 2. Semantic Color Tokens (RGB Channel Architecture)

| Semantic Token | Hex Equivalent | CSS RGB Variable | Tailwind Utility (`<alpha-value>` supported) | Flutter `SchoolTokens` Field |
| :--- | :--- | :--- | :--- | :--- |
| Canvas / Deep Void Carbon | `#070A12` | `--color-canvas-rgb: 7 10 18` | `bg-canvas` | `canvas` |
| Surface / Frosted Obsidian | `#0F172A` | `--color-surface-rgb: 15 23 42` | `bg-surface`, `bg-surface/85` | `surface` |
| Raised Surface | `#111C32` | `--color-surface-raised-rgb: 17 28 50` | `bg-surface-raised` | `surfaceRaised` |
| Elevated Surface | `#17233B` | `--color-surface-elevated-rgb: 23 35 59` | `bg-surface-elevated` | `surfaceElevated` |
| Border Default | `#293449` | `--color-border-rgb: 41 52 73` | `border-border`, `border-border/80` | `border` |
| Border Strong | `#3B4963` | `--color-border-strong-rgb: 59 73 99` | `border-border-strong` | `borderStrong` |
| Primary Text | `#F8FAFC` | `--color-text-primary-rgb: 248 250 252` | `text-text-primary` | `textPrimary` |
| Secondary Text | `#CBD5E1` | `--color-text-secondary-rgb: 203 213 225` | `text-text-secondary` | `textSecondary` |
| Muted Text | `#94A3B8` | `--color-text-muted-rgb: 148 163 184` | `text-text-muted` | `textMuted` |
| Disabled Text | `#64748B` | `--color-text-disabled-rgb: 100 116 139` | `text-text-disabled` | `textDisabled` |
| Neon Violet (AI) | `#7C3AED` | `--color-ai-violet-rgb: 124 58 237` | `text-ai-violet`, `bg-ai-violet/15` | `aiViolet` |
| Electric Indigo (AI) | `#4F46E5` | `--color-ai-indigo-rgb: 79 70 229` | `text-ai-indigo`, `bg-ai-indigo/15` | `aiIndigo` |
| Cyan Glow (AI) | `#06B6D4` | `--color-ai-cyan-rgb: 6 182 212` | `text-ai-cyan`, `bg-ai-cyan/15` | `aiCyan` |
| Verified Emerald | `#10B981` | `--color-success-rgb: 16 185 129` | `text-success`, `bg-success/15` | `success` |
| Warning Amber | `#F59E0B` | `--color-warning-rgb: 245 158 11` | `text-warning`, `bg-warning/15` | `warning` |
| Danger / Flagged Coral | `#F43F5E` | `--color-danger-rgb: 244 63 94` | `text-danger`, `bg-danger/15` | `danger` |
| Math Accent | `#A5B4FC` | `--color-math-rgb: 165 180 252` | `text-math` | `math` |
| Focus Ring | `#67E8F9` | `--color-focus-rgb: 103 232 249` | `ring-focus` | `focus` |

## 3. Ready-to-Use Code References

- Next.js CSS Variables & Safe Bidirectional Rules: `03_CODE_READY/nextjs/globals.css`
- Tailwind Config with Keyframes (`animate-agent-pulse`, `animate-aura-sweep`) & RGB Alpha: `03_CODE_READY/nextjs/tailwind.config.ts`
- Locale-Safe Persian Numeral Formatters (`Intl.NumberFormat('fa-IR')`): `03_CODE_READY/nextjs/formatters.ts`
- Complete Flutter `SchoolTokens` (`ThemeExtension` with colors, radii, spacing, blur, shadows, motion durations, and `toFaDigits`): `03_CODE_READY/flutter/school_tokens.dart`
