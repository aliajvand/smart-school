# AnswerClusterDeck

## 1. Role & User Experience Intent

Batch-grading deck that groups identical or near-identical answers. The
teacher can apply a score to a cluster only after inspecting
representative samples and the clustering explanation; every bulk action
must be reversible and audited.

## 2. Design Tokens & Styling Mapping

Panel `#0F172A`, cluster cards `#111C32`, similarity indicator
violet/indigo, accepted emerald, review amber, suspected anomaly coral.
Similarity percentages and answer expressions are LTR; student names
follow locale direction. Do not reveal one student's work to another
student.

## 3. Visual States Specification

-   **Idle / Default:** cluster count, representative answer, and
    affected-paper count are visible.
-   **Thinking / Agent Processing:** clustering progress shown with
    provisional labels and no bulk action enabled.
-   **Success / Verified:** teacher-approved score is applied to
    selected cluster and confirmation count is shown.
-   **Warning / Action Required:** low-confidence or mixed-rubric
    cluster requires individual review.
-   **Error / Flagged:** cluster inconsistency or failed operation; no
    partial silent success; provide retry/undo where safe.

## 4. API & Prop Contract

``` ts
export interface ClusterAnswer { studentId: string; displayName: string; answer: string; currentScore?: number; }
export interface AnswerCluster { id: string; label: string; similarity: number; answers: ClusterAnswer[]; confidence: number; reviewRequired: boolean; }
export interface AnswerClusterDeckProps { clusters: AnswerCluster[]; isLoading?: boolean; onInspect: (clusterId: string) => void; onApplyScore: (clusterId: string, score: number) => Promise<void>; onExcludeStudent?: (clusterId: string, studentId: string) => void; }
```

Flutter: expose async
`Future<void> Function(String clusterId, double score)` and track
pending IDs so only the active cluster action is disabled.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { useState } from 'react';
import { UsersRound, Eye, CheckCircle2, AlertTriangle, Undo2 } from 'lucide-react';
import type { AnswerClusterDeckProps } from './types';
export function AnswerClusterDeck({ clusters, isLoading, onInspect, onApplyScore }: AnswerClusterDeckProps) {
  const [scores,setScores] = useState<Record<string,number>>({}); const [pending,setPending] = useState<string|null>(null); const [message,setMessage] = useState('');
  async function apply(id:string){ setPending(id); setMessage(''); try { await onApplyScore(id,scores[id] ?? 1); setMessage('Score applied. Review the audit record before leaving.'); } catch { setMessage('Could not apply score. No success was recorded; retry after checking the connection.'); } finally { setPending(null); } }
  return <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-50">Answer clusters</h2><p className="text-sm text-slate-400">Inspect representative work before batch grading.</p></div><span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{clusters.length} groups</span></div>{message && <p role="status" className="mb-3 text-sm text-cyan-200">{message}</p>}<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{clusters.map(c=><article key={c.id} className="rounded-2xl border border-border/80 bg-surface/85 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-medium text-slate-100">{c.label}</h3><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><UsersRound size={14}/>{c.answers.length} papers</p></div><span className={`rounded-full px-2 py-1 text-xs ${c.reviewRequired?'bg-amber-500/10 text-amber-300':'bg-emerald-500/10 text-emerald-300'}`}>{c.reviewRequired?'Review required':'High confidence'}</span></div><div dir="ltr" className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 math-ltr font-mono text-sm text-indigo-200">{c.answers[0]?.answer ?? 'No representative answer'}</div><div className="mt-3 flex items-center justify-between text-xs text-slate-400"><span>Similarity</span><span dir="ltr">{Intl.NumberFormat("fa-IR").format(Math.round(c.similarity*100))}٪</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width:`${Math.max(0,Math.min(100,c.similarity*100))}%`}}/></div><label className="mt-4 block text-xs text-slate-400">Score to apply<input type="number" min={0} max={100} step={0.25} value={scores[c.id] ?? 1} onChange={e=>setScores(s=>({...s,[c.id]:Math.max(0,Math.min(100,Number(e.target.value)))}))} className="mt-1 min-h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-slate-100"/></label><div className="mt-3 flex gap-2"><button onClick={()=>onInspect(c.id)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 text-sm text-slate-200"><Eye size={15}/>Inspect</button><button disabled={!!pending || c.reviewRequired || isLoading} onClick={()=>apply(c.id)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/15 text-sm font-semibold text-emerald-300 disabled:opacity-40">{pending===c.id?'Applying…':<><CheckCircle2 size={15}/>Apply</>}</button></div>{c.reviewRequired && <p className="mt-2 flex items-center gap-1 text-xs text-amber-300"><AlertTriangle size={13}/>Review each answer before batch grading.</p>}</article>)}</div></section>;
}
```

## 6. Flutter Mobile Blueprint

``` dart
class AnswerCluster { const AnswerCluster({required this.id,required this.label,required this.count,required this.representative,required this.similarity,required this.reviewRequired}); final String id,label,representative; final int count; final double similarity; final bool reviewRequired; }
class AnswerClusterDeck extends StatelessWidget {
  const AnswerClusterDeck({super.key,required this.clusters,required this.onInspect,required this.onApplyScore}); final List<AnswerCluster> clusters; final ValueChanged<String> onInspect; final Future<void> Function(String,double) onApplyScore;
  @override Widget build(BuildContext context){final t=Theme.of(context).extension<SchoolTokens>()!;return GridView.builder(shrinkWrap:true,physics:const NeverScrollableScrollPhysics(),gridDelegate:const SliverGridDelegateWithMaxCrossAxisExtent(maxCrossAxisExtent:360,mainAxisExtent:270,crossAxisSpacing:12,mainAxisSpacing:12),itemCount:clusters.length,itemBuilder:(context,i){final c=clusters[i];return Card(color:t.surface,shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(18),side:BorderSide(color:t.border)),child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(c.label,style:TextStyle(color:t.textPrimary,fontWeight:FontWeight.w600)),Text('${c.count} papers • ${(c.similarity*100).round()}% similarity',style:TextStyle(color:t.textMuted,fontSize:12)),const SizedBox(height:12),Expanded(child:Container(width:double.infinity,padding:const EdgeInsets.all(10),decoration:BoxDecoration(color:t.canvas,borderRadius:BorderRadius.circular(10)),child:Text(c.representative,textDirection:TextDirection.ltr,style:TextStyle(color:t.math,fontFamily:'JetBrainsMono')))),if(c.reviewRequired) Padding(padding:const EdgeInsets.only(top:6),child:Text('بازبینی فردی لازم است',style:TextStyle(color:t.warning,fontSize:12))),Row(children:[TextButton(onPressed:()=>onInspect(c.id),child:const Text('بررسی')),const Spacer(),FilledButton(onPressed:c.reviewRequired?null:()=>showDialog(context:context,builder:(d)=>_ScoreDialog(onSubmit:(score)async{Navigator.pop(d);await onApplyScore(c.id,score);})),child:const Text('نمره گروه'))])])));}); }
}
class _ScoreDialog extends StatefulWidget { const _ScoreDialog({required this.onSubmit}); final ValueChanged<double> onSubmit; @override State<_ScoreDialog> createState()=>_ScoreDialogState(); }
class _ScoreDialogState extends State<_ScoreDialog>{double score=1;@override Widget build(BuildContext context)=>AlertDialog(title:const Text('تأیید نمره گروه'),content:Slider(value:score,min:0,max:20,divisions:80,label:score.toStringAsFixed(2),onChanged:(v)=>setState(()=>score=v)),actions:[TextButton(onPressed:()=>Navigator.pop(context),child:const Text('لغو')),FilledButton(onPressed:()=>widget.onSubmit(score),child:const Text('تأیید'))]);}
```

## 7. Interactive Micro-interactions

Cards enter with a 180ms fade/translate; avoid animating every student
row. Bulk apply requires a confirmation dialog and a server-side
transaction with audit log and undo strategy. Flutter: selection haptic
on inspect; confirmation haptic only after the server confirms success.
Never enable batch scoring for a low-confidence cluster.

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
