# StudentTrendSparkline

## 1. Role & User Experience Intent

A compact trend view for teachers/counselors to notice changes in
learning outcomes and decide whether supportive outreach may help. It
must not diagnose students or make automatic disciplinary decisions.

## 2. Design Tokens & Styling Mapping

Surface `#0F172A`, trend line cyan/indigo, improving/verified emerald,
early-warning amber, critical coral only when policy-defined thresholds
are met. Use LTR axes/date labels and locale-aware surrounding text.
Missing data must be shown as gaps, not zero.

## 3. Visual States Specification

-   **Idle / Default:** trend line with period labels and accessible
    textual summary.
-   **Thinking / Agent Processing:** trend refresh indicator, previous
    data remains visible.
-   **Success / Verified:** positive trend marker and last-updated
    timestamp.
-   **Warning / Action Required:** EWS indicator with reason and
    supportive next step; counselor referral is a suggestion requiring
    authorized human review.
-   **Error / Flagged:** stale/insufficient data notice; suppress
    threshold claims if sample count is inadequate.

## 4. API & Prop Contract

``` ts
export interface TrendPoint { period: string; score: number | null; }
export interface StudentTrendSparklineProps { studentLabel: string; points: TrendPoint[]; average?: number; delta?: number; ewsLevel: 'none'|'watch'|'urgent'; ewsReason?: string; lastUpdated: string; onOpenHistory?: () => void; onReferToCounselor?: () => void; }
```

Flutter: use `CustomPainter` or `fl_chart`; provide a textual trend
summary and explicit threshold metadata from an approved policy service.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, ArrowUpRight } from 'lucide-react';
import type { StudentTrendSparklineProps } from './types';
export function StudentTrendSparkline(p: StudentTrendSparklineProps) {
  const vals=p.points.map(x=>x.score).filter((x):x is number=>x!==null&&Number.isFinite(x));
  const path=useMemo(()=>{if(vals.length<2)return '';const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;return vals.map((v,i)=>`${i?'L':'M'} ${8+i*84/(vals.length-1)} ${34-(v-min)/range*26}`).join(' ');},[p.points]);
  const warning=p.ewsLevel!=='none'; const Icon=(p.delta??0)>0?TrendingUp:(p.delta??0)<0?TrendingDown:Minus;
  return <section className="rounded-2xl border border-border/80 bg-surface/85 p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-xs text-slate-400">Learning trend</p><h3 className="mt-1 font-semibold text-slate-100">{p.studentLabel}</h3></div><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${p.ewsLevel==='urgent'?'bg-rose-500/10 text-rose-300':p.ewsLevel==='watch'?'bg-amber-500/10 text-amber-300':'bg-emerald-500/10 text-emerald-300'}`}>{warning&&<ShieldAlert size={13}/>} {p.ewsLevel==='urgent'?'Priority review':p.ewsLevel==='watch'?'Monitor':'No current alert'}</span></div><div className="mt-3 flex items-end gap-3"><span dir="ltr" className="math-ltr font-mono text-2xl text-slate-50">{vals.length?vals[vals.length-1].toFixed(1):'—'}</span><span className={`mb-1 inline-flex items-center gap-1 text-xs ${(p.delta??0)>0?'text-emerald-300':(p.delta??0)<0?'text-amber-300':'text-slate-400'}`}><Icon size={14}/>{p.delta===undefined?'No comparison':`${p.delta>0?'+':''}${p.delta.toFixed(1)} pts`}</span></div><svg viewBox="0 0 100 40" role="img" aria-label={`Score trend across ${vals.length} available periods`} className="mt-2 h-16 w-full overflow-visible"><path d={path} fill="none" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>{vals.length>0&&<circle cx={8+(vals.length-1)*84/Math.max(1,vals.length-1)} cy={34-(vals[vals.length-1]-Math.min(...vals))/(Math.max(...vals)-Math.min(...vals)||1)*26} r="3" fill="#A5F3FC"/>}</svg>{warning&&p.ewsReason&&<p className={`mt-2 rounded-xl p-3 text-sm ${p.ewsLevel==='urgent'?'bg-rose-500/5 text-rose-200':'bg-amber-500/5 text-amber-200'}`}>{p.ewsReason}</p>}<p className="mt-2 text-xs text-slate-500">Updated {p.lastUpdated}. Trend is an educational support signal, not a diagnosis.</p><div className="mt-3 flex flex-wrap gap-2">{p.onOpenHistory&&<button onClick={p.onOpenHistory} className="min-h-11 rounded-xl border border-slate-700 px-3 text-sm text-slate-200">View history</button>}{p.onReferToCounselor&&warning&&<button onClick={p.onReferToCounselor} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-500/30 px-3 text-sm text-amber-200">Request counselor review<ArrowUpRight size={14}/></button>}</div></section>;
}
```

## 6. Flutter Mobile Blueprint

``` dart
class TrendPoint { const TrendPoint(this.period,this.score); final String period; final double? score; }
class StudentTrendSparkline extends StatelessWidget {
  const StudentTrendSparkline({super.key,required this.studentLabel,required this.points,required this.ewsLevel,required this.lastUpdated,this.ewsReason,this.onOpenHistory,this.onRefer}); final String studentLabel,ewsLevel,lastUpdated; final String? ewsReason; final List<TrendPoint> points; final VoidCallback? onOpenHistory,onRefer;
  @override Widget build(BuildContext context){final t=Theme.of(context).extension<SchoolTokens>()!;final vals=points.where((p)=>p.score!=null).map((p)=>p.score!).toList();final alert=ewsLevel!='none';final color=ewsLevel=='urgent'?t.danger:ewsLevel=='watch'?t.warning:t.success;return Card(color:t.surface,child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text('Learning trend',style:TextStyle(color:t.textMuted,fontSize:12)),Row(children:[Expanded(child:Text(studentLabel,style:TextStyle(color:t.textPrimary,fontWeight:FontWeight.w600))),Chip(label:Text(ewsLevel=='urgent'?'Priority review':ewsLevel=='watch'?'Monitor':'No alert'),side:BorderSide(color:color),backgroundColor:color.withValues(alpha:.1))]),SizedBox(height:64,width:double.infinity,child:CustomPaint(painter:_SparkPainter(vals,t.aiCyan))),if(alert&&ewsReason!=null)Container(width:double.infinity,padding:const EdgeInsets.all(10),decoration:BoxDecoration(color:color.withValues(alpha:.08),borderRadius:BorderRadius.circular(10)),child:Text(ewsReason!,style:TextStyle(color:color))),Text('به‌روزرسانی: $lastUpdated • نشانه آموزشی است، نه تشخیص',style:TextStyle(color:t.textMuted,fontSize:11)),Wrap(children:[if(onOpenHistory!=null)TextButton(onPressed:onOpenHistory,child:const Text('مشاهده سوابق')),if(alert&&onRefer!=null)TextButton(onPressed:onRefer,child:const Text('درخواست بررسی مشاور'))])])));}
}
class _SparkPainter extends CustomPainter { _SparkPainter(this.values,this.color); final List<double> values; final Color color; @override void paint(Canvas c,Size s){if(values.length<2)return;final min=values.reduce((a,b)=>a<b?a:b),max=values.reduce((a,b)=>a>b?a:b),range=max-min==0?1:max-min;final path=Path();for(var i=0;i<values.length;i++){final p=Offset(i*s.width/(values.length-1),s.height-4-(values[i]-min)/range*(s.height-8));i==0?path.moveTo(p.dx,p.dy):path.lineTo(p.dx,p.dy);}c.drawPath(path,Paint()..color=color..strokeWidth=2.2..style=PaintingStyle.stroke..strokeCap=StrokeCap.round..strokeJoin=StrokeJoin.round);}@override bool shouldRepaint(covariant _SparkPainter old)=>old.values!=values||old.color!=color; }
```

## 7. Interactive Micro-interactions

Trend line draws over 260ms; EWS badge appears without alarm-like
shaking. Thresholds must be versioned, explainable, and configured by
school policy with minimum data sufficiency. Flutter haptics are not
appropriate for passive risk display; use a confirmation haptic only
after the user submits a referral request.

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
