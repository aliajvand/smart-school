# Typography & Bidirectional (RTL/LTR) Architecture (v4.0 Audited)

Version: 4.0.0  
Primary Persian Font: **Vazirmatn** (with optional enterprise drop-in **IRANSansX**)  
STEM / Formula / Code Font: **JetBrains Mono** + **KaTeX** (Scoped strictly to `.math-ltr` and `.code-ltr`)

---

## 1. Bidirectional & Numeral Rules (Audited)

1. **Scoped Monospace Rule (Critical Fix):** Never apply `font-family: var(--font-mono-ltr)` to generic `[dir="ltr"]` selectors, because English UI phrases, emails, or LTR sub-trees would unintentionally render in monospace. Instead:
   - `[dir="ltr"]` only sets `direction: ltr; unicode-bidi: isolate;`.
   - `.math-ltr` and `.code-ltr` set `direction: ltr; unicode-bidi: isolate; font-family: var(--font-mono-ltr); font-variant-numeric: tabular-nums;`.
2. **Programmatic Persian Numerals (`Intl.NumberFormat('fa-IR')`):** Do not assume OpenType `ss01` or `fd` flags are present in every subset of Vazirmatn. All numbers, percentages (`۹۸٪`), compact counts (`۱۲٫۵ هزار`), and scores (`۹۵ / ۱۰۰`) must pass through `formatFaNumber`, `formatFaPercent`, `formatFaCompact`, or `formatFaScore` from `03_CODE_READY/nextjs/formatters.ts` (and `SchoolTokens.toFaDigits` in Flutter).
3. **Role-Scoped KPI Formatting:**
   - **Teacher View (`/dashboard`):** Displays class-level active student count (e.g., `۱۲۸ دانش‌آموز کلاس‌ها`) and canonical score `۹۵ / ۱۰۰`.
   - **Principal / Multi-Branch Admin View:** Displays school-wide active student count (`۱۲٫۵ هزار دانش‌آموز فعال`).

---

## 2. Type Scale & Line-Height Tokens

| Token Name | Size (px / rem) | Line Height | Weight | Primary Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-hero` | `32px` / `2.0rem` | `1.35` | `800` (ExtraBold) | KPI Big Numbers (`۹۸٪`, `۴۵۰`, `۱۲۸`) |
| `heading-xl` | `24px` / `1.5rem` | `1.40` | `700` (Bold) | Page Headers («مدرسه هوشمند آینده») |
| `heading-lg` | `18px` / `1.125rem` | `1.45` | `700` (Bold) | Bento Card Titles («روند پیشرفت دانش‌آموزان») |
| `heading-md` | `16px` / `1.0rem` | `1.50` | `600` (SemiBold) | Sub-panels, Modal Headers, Student Names |
| `body-base` | `14px` / `0.875rem` | `1.65` | `400` / `500` | Primary Persian UI Copy, Question Prompts |
| `body-sm` | `12px` / `0.75rem` | `1.60` | `500` (Medium) | Timestamps («۳ دقیقه پیش»), Axis Labels (`>= 11px` in SVG) |
| `mono-math` | `14px` / `0.875rem` | `1.50` | `500` (Medium) | `.math-ltr` KaTeX Formulas, Parametric Variables (`[v_0: 10..50]`) |
