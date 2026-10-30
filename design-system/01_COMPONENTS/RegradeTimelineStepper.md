# RegradeTimelineStepper

## 1. Role & User Experience Intent

An interactive four-stage tracker for a regrade appeal: Student Filed →
Teacher Review → Counselor Note → Principal Approved. It explains who
owns the next step, what evidence is required, and whether an appeal is
pending, returned, or resolved.

## 2. Design Tokens & Styling Mapping

Panel `#0F172A`, inactive `#475569`, current processing gradient
violet/indigo/cyan, completed emerald, attention amber, blocked/error
coral. Stage sequence remains chronological regardless of RTL; in RTL
visual flow runs right-to-left while accessible stage numbers remain
explicit.

## 3. Visual States Specification

-   **Idle / Default:** current stage highlighted; future stages muted
    and locked when prerequisites are unmet.
-   **Thinking / Agent Processing:** assigned reviewer action is
    pending; show timestamp and owner.
-   **Success / Verified:** completed stages show date and audit event;
    final approval is explicit.
-   **Warning / Action Required:** missing evidence or reviewer note is
    requested.
-   **Error / Flagged:** appeal returned/blocked; show reason and
    allowed next action, not a dead end.

## 4. API & Prop Contract

``` ts
export type RegradeStageId = 'student_filed'|'teacher_review'|'counselor_note'|'principal_approved';
export interface RegradeStage { id: RegradeStageId; label: string; state: 'upcoming'|'current'|'completed'|'needs_action'|'blocked'; owner?: string; timestamp?: string; note?: string; }
export interface RegradeTimelineStepperProps { stages: RegradeStage[]; currentStage: RegradeStageId; onOpenStage: (id: RegradeStageId) => void; onSubmitEvidence?: (id: RegradeStageId) => void; }
```

Flutter: provide `List<RegradeStage>` and callbacks; stage transitions
must be enforced by the backend state machine, never by UI alone.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { Check, Circle, Clock3, AlertTriangle, FileUp } from 'lucide-react';
import type { RegradeTimelineStepperProps, RegradeStage } from './types';
const order: RegradeStage['id'][]=['student_filed','teacher_review','counselor_note','principal_approved'];
const iconFor=(s:RegradeStage['state'])=>s==='completed'?Check:s==='needs_action'||s==='blocked'?AlertTriangle:s==='current'?Clock3:Circle;
export function RegradeTimelineStepper(p: RegradeTimelineStepperProps) {
  const sorted=[...p.stages].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
  return <section className="rounded-2xl border border-border/80 bg-surface/85 p-5"><h2 className="font-semibold text-slate-100">Regrade appeal</h2><p className="mt-1 text-sm text-slate-400">Each transition is recorded in the appeal audit trail.</p><ol className="mt-5 grid gap-3 md:grid-cols-4">{sorted.map((s,i)=>{const Icon=iconFor(s.state);const color=s.state==='completed'?'text-emerald-300 border-emerald-500/40 bg-emerald-500/10':s.state==='needs_action'?'text-amber-300 border-amber-500/40 bg-amber-500/10':s.state==='blocked'?'text-rose-300 border-rose-500/40 bg-rose-500/10':s.state==='current'?'text-cyan-200 border-indigo-400/50 bg-indigo-500/10':'text-slate-400 border-slate-700 bg-slate-950/40';return <li key={s.id} className="relative"><button onClick={()=>p.onOpenStage(s.id)} className={`min-h-36 w-full rounded-xl border p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${color}`}><div className="flex items-center justify-between"><span className="text-xs opacity-80">Stage {i+1} of 4</span><Icon size={17}/></div><h3 className="mt-3 text-sm font-semibold">{s.label}</h3>{s.owner&&<p className="mt-1 text-xs opacity-80">Owner: {s.owner}</p>}{s.timestamp&&<p dir="ltr" className="mt-2 text-xs opacity-70">{s.timestamp}</p>}{s.note&&<p className="mt-2 line-clamp-2 text-xs opacity-80">{s.note}</p>}</button>{s.state==='needs_action'&&p.onSubmitEvidence&&<button onClick={()=>p.onSubmitEvidence!(s.id)} className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs text-amber-200"><FileUp size={14}/>Submit evidence</button>}</li>;})}</ol></section>;
}
```

## 6. Flutter Mobile Blueprint

``` dart
enum RegradeStageState { upcoming, current, completed, needsAction, blocked }
class RegradeStage { const RegradeStage({required this.id,required this.label,required this.state,this.owner,this.timestamp,this.note}); final String id,label; final RegradeStageState state; final String? owner,timestamp,note; }
class RegradeTimelineStepper extends StatelessWidget {
  const RegradeTimelineStepper({super.key,required this.stages,required this.onOpenStage,this.onSubmitEvidence}); final List<RegradeStage> stages; final ValueChanged<String> onOpenStage; final ValueChanged<String>? onSubmitEvidence;
  @override Widget build(BuildContext context){final t=Theme.of(context).extension<SchoolTokens>()!;final ordered=[...stages]..sort((a,b)=>['student_filed','teacher_review','counselor_note','principal_approved'].indexOf(a.id).compareTo(['student_filed','teacher_review','counselor_note','principal_approved'].indexOf(b.id)));return Card(color:t.surface,child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text('درخواست بازبینی نمره',style:TextStyle(color:t.textPrimary,fontWeight:FontWeight.w600)),const SizedBox(height:12),...ordered.asMap().entries.map((entry){final i=entry.key,s=entry.value;final color=s.state==RegradeStageState.completed?t.success:s.state==RegradeStageState.needsAction?t.warning:s.state==RegradeStageState.blocked?t.danger:s.state==RegradeStageState.current?t.aiCyan:t.textMuted;return InkWell(onTap:()=>onOpenStage(s.id),borderRadius:BorderRadius.circular(12),child:Padding(padding:const EdgeInsets.symmetric(vertical:10),child:Row(crossAxisAlignment:CrossAxisAlignment.start,children:[Column(children:[Container(width:30,height:30,decoration:BoxDecoration(shape:BoxShape.circle,color:color.withValues(alpha:.12),border:Border.all(color:color)),child:Center(child:Text('${i+1}',style:TextStyle(color:color,fontWeight:FontWeight.bold)))),if(i<ordered.length-1)Container(width:2,height:42,color:t.border)]),const SizedBox(width:12),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(s.label,style:TextStyle(color:t.textPrimary,fontWeight:FontWeight.w600)),if(s.owner!=null)Text(s.owner!,style:TextStyle(color:t.textMuted,fontSize:12)),if(s.note!=null)Text(s.note!,style:TextStyle(color:t.textSecondary,fontSize:12)),if(s.timestamp!=null)Text(s.timestamp!,textDirection:TextDirection.ltr,style:TextStyle(color:t.textMuted,fontSize:11)),if(s.state==RegradeStageState.needsAction&&onSubmitEvidence!=null)TextButton(onPressed:()=>onSubmitEvidence!(s.id),child:const Text('ارسال مستند'))]))])));})])));}
}
```

## 7. Interactive Micro-interactions

Stage transitions use 180ms emphasis; completed checkmarks fade in. Do
not let client-side animation imply approval before the server returns
an authorized transition. Flutter: `HapticFeedback.selectionClick()` on
opening a stage; medium impact only after a confirmed final approval,
and only if the user has not disabled haptics.

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
