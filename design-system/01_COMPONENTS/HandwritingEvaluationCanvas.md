# HandwritingEvaluationCanvas

## 1. Role & User Experience Intent

Teacher review workspace for student handwritten work. It aligns a paper
image with model-detected intermediate steps and rubric tags, so a
teacher can inspect evidence and override suggested scoring. Bounding
boxes are annotations, not unquestionable ground truth.

## 2. Design Tokens & Styling Mapping

Canvas background `#070A12`, paper surface `#F8FAFC`, annotation colors:
cyan `#06B6D4` for recognized steps, emerald `#10B981` accepted, amber
`#F59E0B` needs review, coral `#F43F5E` likely error. Coordinates must
be normalized to the source image; overlays scale with the image. Text
inside handwriting regions is LTR only when formula content requires it.

## 3. Visual States Specification

-   **Idle / Default:** split image/feedback view with neutral boxes and
    rubric list.
-   **Thinking / Agent Processing:** overlay detection in progress; keep
    existing annotations visible and label them provisional.
-   **Success / Verified:** accepted steps get emerald outlines and
    rubric points; teacher confirmation is still required before
    finalizing grades.
-   **Warning / Action Required:** amber box identifies uncertain OCR or
    ambiguous method.
-   **Error / Flagged:** coral box highlights a suspected calculation
    issue with explanation and manual override.

## 4. API & Prop Contract

``` ts
export type EvaluationState = 'idle'|'thinking'|'success'|'warning'|'error';
export interface StepAnnotation { id: string; x: number; y: number; width: number; height: number; state: EvaluationState; label: string; explanation?: string; score?: number; maxScore?: number; }
export interface RubricItem { id: string; title: string; awarded: number; max: number; note?: string; }
export interface HandwritingEvaluationCanvasProps { imageUrl: string; annotations: StepAnnotation[]; rubric: RubricItem[]; state: EvaluationState; onAnnotationSelect: (id: string) => void; onScoreChange: (rubricId: string, score: number) => void; selectedAnnotationId?: string; }
```

Flutter: use `InteractiveViewer` + `Stack`/`Positioned` and normalized
`[0,1]` rectangles. Scores must be validated server-side and edits
audited.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { CheckCircle2, AlertTriangle, XCircle, ScanSearch } from 'lucide-react';
import type { HandwritingEvaluationCanvasProps } from './types';
const stateClass = { idle:'border-slate-400', thinking:'border-cyan-300 animate-pulse', success:'border-emerald-400', warning:'border-amber-400', error:'border-rose-400' } as const;
export function HandwritingEvaluationCanvas(p: HandwritingEvaluationCanvasProps) {
  return <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 p-3"><div className="relative mx-auto w-full max-w-3xl"><img src={p.imageUrl} alt="Student handwritten answer sheet" className="block h-auto w-full rounded-lg bg-slate-100" />{p.annotations.map(a=><button key={a.id} aria-label={`${a.label}: ${a.state}`} aria-pressed={p.selectedAnnotationId===a.id} onClick={()=>p.onAnnotationSelect(a.id)} className={`absolute rounded-md border-2 bg-cyan-400/10 ${stateClass[a.state]} ${p.selectedAnnotationId===a.id?'ring-2 ring-white ring-offset-2 ring-offset-slate-950':''}`} style={{left:`${a.x*100}%`,top:`${a.y*100}%`,width:`${a.width*100}%`,height:`${a.height*100}%`}}><span className="absolute -top-6 start-0 max-w-40 truncate rounded bg-slate-950/95 px-2 py-1 text-[10px] text-white">{a.label}</span></button>)}</div></div>
    <aside className="rounded-2xl border border-border/80 bg-surface/85 p-4"><h2 className="flex items-center gap-2 font-semibold text-slate-100"><ScanSearch size={17} className="text-cyan-300"/>Rubric review</h2><p className="mt-1 text-xs text-slate-400">AI suggestions are provisional until teacher confirmation.</p><div className="mt-4 space-y-3">{p.rubric.map(r=><div key={r.id} className="rounded-xl border border-slate-800 p-3"><div className="flex items-start justify-between gap-2"><span className="text-sm text-slate-200">{r.title}</span><span dir="ltr" className="math-ltr font-mono text-xs text-slate-300">{r.awarded}/{r.max}</span></div>{r.note && <p className="mt-1 text-xs text-slate-400">{r.note}</p>}<input aria-label={`Score for ${r.title}`} type="range" min={0} max={r.max} step={0.5} value={Math.min(r.max,Math.max(0,r.awarded))} onChange={e=>p.onScoreChange(r.id,Number(e.target.value))} className="mt-2 w-full accent-cyan-400"/></div>)}</div><div className="mt-4 space-y-2">{p.annotations.map(a=><button key={a.id} onClick={()=>p.onAnnotationSelect(a.id)} className="flex min-h-11 w-full items-start gap-2 rounded-lg p-2 text-start hover:bg-white/5"><span className="mt-0.5">{a.state==='success'?<CheckCircle2 size={16} className="text-emerald-400"/>:a.state==='warning'?<AlertTriangle size={16} className="text-amber-400"/>:a.state==='error'?<XCircle size={16} className="text-rose-400"/>:<ScanSearch size={16} className="text-cyan-300"/>}</span><span><span className="block text-sm text-slate-200">{a.label}</span>{a.explanation && <span className="block text-xs text-slate-400">{a.explanation}</span>}</span></button>)}</div></aside>
  </section>;
}
```

Use a Next.js `<Image>` with known dimensions or a secured image proxy
in production; this snippet uses `<img>` to keep normalized overlay
geometry obvious.

## 6. Flutter Mobile Blueprint

``` dart
class StepAnnotation { const StepAnnotation({required this.id,required this.x,required this.y,required this.width,required this.height,required this.label,required this.state}); final String id,label,state; final double x,y,width,height; }
class HandwritingEvaluationCanvas extends StatelessWidget {
  const HandwritingEvaluationCanvas({super.key,required this.image,required this.annotations,required this.selectedId,required this.onSelect}); final ImageProvider image; final List<StepAnnotation> annotations; final String? selectedId; final ValueChanged<String> onSelect;
  @override Widget build(BuildContext context){ final t=Theme.of(context).extension<SchoolTokens>()!; return LayoutBuilder(builder:(context,c)=>Row(crossAxisAlignment:CrossAxisAlignment.start,children:[Expanded(flex:3,child:Container(color:t.canvas,child:InteractiveViewer(minScale:1,maxScale:4,child:AspectRatio(aspectRatio:0.72,child:LayoutBuilder(builder:(context,box){final size=Size(box.maxWidth,box.maxHeight);return Stack(fit:StackFit.expand,children:[Image(image:image,fit:BoxFit.contain),...annotations.map((a){final color=a.state=='success'?t.success:a.state=='warning'?t.warning:a.state=='error'?t.danger:t.aiCyan;return Positioned(left:a.x*size.width,top:a.y*size.height,width:a.width*size.width,height:a.height*size.height,child:GestureDetector(onTap:()=>onSelect(a.id),child:Container(decoration:BoxDecoration(color:color.withValues(alpha:.10),border:Border.all(color:color,width:selectedId==a.id?3:2),borderRadius:BorderRadius.circular(4)))));})]);})))),const SizedBox(width:12),Expanded(flex:2,child:Column(children:annotations.map((a)=>ListTile(selected:a.id==selectedId,title:Text(a.label),leading:Icon(Icons.crop_free,color:a.state=='error'?t.danger:a.state=='warning'?t.warning:t.aiCyan),onTap:()=>onSelect(a.id))).toList()))])); }
}
```

## 7. Interactive Micro-interactions

Selecting a box highlights its rubric row and vice versa (120--180ms).
Avoid automatic camera zoom on every annotation. Flutter
`InteractiveViewer` handles zoom; haptic selection click only on a
deliberate annotation tap. Ensure zoom, scroll, and focus are usable
with keyboard/switch access.

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
