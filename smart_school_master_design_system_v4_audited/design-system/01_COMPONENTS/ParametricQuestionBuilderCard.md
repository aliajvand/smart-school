# ParametricQuestionBuilderCard

## 1. Role & User Experience Intent

A teacher authoring card for variable-based STEM questions. Colored
chips identify formula parameters and the preview button shows five
deterministic sample variants before publication, helping teachers catch
invalid ranges and ambiguous questions.

## 2. Design Tokens & Styling Mapping

Panel `#0F172A`, raised field `#111C32`, border `#293449`,
violet/indigo/cyan parameter chips, success emerald for valid
constraints, amber for out-of-range values. Formula preview is always
LTR and monospace; question instructions follow page direction. Chips
need text labels and not color alone to distinguish parameter type.

## 3. Visual States Specification

-   **Idle / Default:** editable formula and parameter chips; preview
    action available when required fields are valid.
-   **Thinking / Agent Processing:** preview button shows progress and
    generated variants are skeletonized.
-   **Success / Verified:** five variants render with validation status;
    teacher must explicitly publish.
-   **Warning / Action Required:** invalid range or duplicate answer
    appears with inline explanation.
-   **Error / Flagged:** generation failed; retain all teacher input and
    provide retry.

## 4. API & Prop Contract

``` ts
export interface ParameterSpec { id: string; symbol: string; label: string; min: number; max: number; step?: number; unit?: string; color?: 'violet'|'indigo'|'cyan'; }
export interface QuestionVariant { id: string; statement: string; answer: string; valid: boolean; }
export interface ParametricQuestionBuilderCardProps { title: string; prompt: string; formula: string; parameters: ParameterSpec[]; variants?: QuestionVariant[]; isGenerating?: boolean; error?: string; onParameterChange: (id: string, patch: Partial<ParameterSpec>) => void; onPreview: () => void; onPublish?: () => void; }
```

Flutter:
`ParametricQuestionBuilderCard({required title, required prompt, required formula, required parameters, required onParameterChange, required onPreview, variants = const [], isGenerating = false, error, onPublish})`.
Use immutable models and validate ranges in the domain layer.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { useState } from 'react';
import { Eye, Sparkles, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import type { ParametricQuestionBuilderCardProps } from './types';

const chip = { violet: 'border-violet-500/40 bg-violet-500/10 text-violet-200', indigo: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-200', cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200' };
export function ParametricQuestionBuilderCard(p: ParametricQuestionBuilderCardProps) {
  const [showVariants, setShowVariants] = useState(false);
  const valid = p.parameters.every(x => Number.isFinite(x.min) && Number.isFinite(x.max) && x.min <= x.max && (x.step ?? 1) > 0);
  return <section className="rounded-2xl border border-border/80 bg-surface/85 p-5 shadow-panel backdrop-blur-md">
    <header className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-50">{p.title}</h2><p className="mt-1 text-sm text-slate-400">{p.prompt}</p></div><span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">Parametric</span></header>
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4"><div dir="ltr" className="overflow-x-auto math-ltr font-mono text-lg text-indigo-200">{p.formula}</div><div className="mt-3 flex flex-wrap gap-2">{p.parameters.map(v => <label key={v.id} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${chip[v.color ?? 'indigo']}`}><span dir="ltr" className="math-ltr font-mono">{v.symbol}</span><span>{v.label}</span><input aria-label={`${v.label} minimum`} type="number" value={v.min} onChange={e => p.onParameterChange(v.id, { min: Number(e.target.value) })} className="w-16 rounded bg-black/20 px-1 py-1 text-right text-slate-50" /><span>–</span><input aria-label={`${v.label} maximum`} type="number" value={v.max} onChange={e => p.onParameterChange(v.id, { max: Number(e.target.value) })} className="w-16 rounded bg-black/20 px-1 py-1 text-right text-slate-50" /></label>)}</div></div>
    {!valid && <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-amber-300"><AlertTriangle size={16}/>Check parameter ranges and step values before previewing.</p>}
    {p.error && <p role="alert" className="mt-3 text-sm text-rose-300">{p.error}</p>}
    <div className="mt-4 flex flex-wrap gap-2"><button disabled={!valid || p.isGenerating} onClick={() => { setShowVariants(true); p.onPreview(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Eye size={16}/>{p.isGenerating ? 'Generating…' : 'Preview 5 variants'}</button>{p.onPublish && <button disabled={!valid || p.isGenerating || !p.variants?.length} onClick={p.onPublish} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-500/30 px-4 text-emerald-300 disabled:opacity-50"><Send size={16}/>Publish</button>}</div>
    {showVariants && <div className="mt-4 grid gap-2 sm:grid-cols-2">{(p.variants ?? []).slice(0,5).map((v,i) => <article key={v.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="mb-2 flex items-center justify-between text-xs text-slate-400"><span>Variant {i+1}</span>{v.valid ? <CheckCircle2 className="text-emerald-400" size={15}/> : <AlertTriangle className="text-amber-400" size={15}/>}</div><p className="text-sm text-slate-200">{v.statement}</p><p dir="ltr" className="mt-2 math-ltr font-mono text-sm text-cyan-200">{v.answer}</p></article>)}</div>}
  </section>;
}
```

## 6. Flutter Mobile Blueprint

``` dart
class ParameterSpec { const ParameterSpec({required this.id, required this.symbol, required this.label, required this.min, required this.max, this.unit}); final String id, symbol, label; final double min, max; final String? unit; }
class QuestionVariant { const QuestionVariant({required this.id, required this.statement, required this.answer, required this.valid}); final String id, statement, answer; final bool valid; }
class ParametricQuestionBuilderCard extends StatelessWidget {
  const ParametricQuestionBuilderCard({super.key, required this.title, required this.prompt, required this.formula, required this.parameters, required this.variants, required this.onPreview, this.isGenerating = false, this.onPublish});
  final String title, prompt, formula; final List<ParameterSpec> parameters; final List<QuestionVariant> variants; final VoidCallback onPreview; final bool isGenerating; final VoidCallback? onPublish;
  @override Widget build(BuildContext context) { final t = Theme.of(context).extension<SchoolTokens>()!; return Card(color: t.surface, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: t.border)), child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(color: t.textPrimary)), const SizedBox(height: 6), Text(prompt, style: TextStyle(color: t.textMuted)), const SizedBox(height: 16), Container(width: double.infinity, padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: t.canvas, borderRadius: BorderRadius.circular(12)), child: Text(formula, textDirection: TextDirection.ltr, style: TextStyle(fontFamily: 'JetBrainsMono', color: t.math, fontSize: 18))), const SizedBox(height: 12), Wrap(spacing: 8, runSpacing: 8, children: parameters.map((p) => Chip(label: Text('${p.symbol}: ${p.min}–${p.max}', textDirection: TextDirection.ltr), side: BorderSide(color: t.aiIndigo), backgroundColor: t.surfaceRaised)).toList()), const SizedBox(height: 16), FilledButton.icon(onPressed: isGenerating ? null : onPreview, icon: const Icon(Icons.auto_awesome), label: Text(isGenerating ? 'در حال ساخت…' : 'پیش‌نمایش ۵ نسخه')), if (variants.isNotEmpty) ...[const SizedBox(height: 12), ...variants.take(5).map((v) => ListTile(leading: Icon(v.valid ? Icons.check_circle : Icons.warning_amber, color: v.valid ? t.success : t.warning), title: Text(v.statement), subtitle: Text(v.answer, textDirection: TextDirection.ltr)))], if (onPublish != null) Align(alignment: AlignmentDirectional.centerEnd, child: TextButton(onPressed: onPublish, child: const Text('انتشار پس از بازبینی')))]))); }
}
```

## 7. Interactive Micro-interactions

Preview: 180--240ms emphasized entrance; variant cards stagger by 35ms,
capped at five. Flutter use `AnimatedSwitcher` and
`Curves.easeOutCubic`. Trigger a light selection haptic on preview tap;
do not auto-publish or use haptics for validation errors. Persist
parameter edits before invoking generation.

## Production integration checklist

-   Import shared tokens and use semantic status values; avoid
    duplicating raw hex values inside feature code.
-   Add automated tests for keyboard behavior, screen-reader labels,
    loading/error paths, RTL layout, and reduced-motion preferences.
-   Validate authorization and data changes on the server; a UI callback
    is not a security boundary.
-   Keep all user-facing copy localizable. Persian is the primary UI
    locale; math, IDs, percentages, and timestamps use isolated LTR
    runs.
