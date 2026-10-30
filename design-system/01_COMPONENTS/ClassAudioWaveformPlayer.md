# ClassAudioWaveformPlayer

## 1. Role & User Experience Intent

Lets students replay a lesson recording, scrub the waveform, and jump
from generated notes to the exact audio timestamp. It supports review
and accessibility; transcript timestamps must map to the media timeline
rather than approximate note position.

## 2. Design Tokens & Styling Mapping

Surface `#0F172A`, waveform idle `#475569`, played waveform `#06B6D4`,
active topic marker `#7C3AED`, border `#293449`, focus `#67E8F9`. Player
controls are direction-neutral; timestamps and waveform coordinates use
LTR. Persian topic labels remain RTL.

## 3. Visual States Specification

-   **Idle / Default:** waveform visible, play button available, elapsed
    and total time in LTR tabular numerals.
-   **Thinking / Agent Processing:** if waveform/transcript is still
    processing, show an amber/indigo processing badge; playback remains
    available if audio is ready.
-   **Success / Verified:** transcript has timestamped topic anchors;
    selecting a topic seeks to that exact second.
-   **Warning / Action Required:** transcript confidence is low; mark
    anchor as machine-generated and allow correction.
-   **Error / Flagged:** audio failed or is unavailable; show retry and
    do not display a fake seek position.

## 4. API & Prop Contract

``` ts
export interface AudioTopic { id: string; title: string; startSeconds: number; confidence?: number; }
export interface ClassAudioWaveformPlayerProps { src: string; title: string; durationSeconds: number; samples: number[]; topics: AudioTopic[]; currentSeconds: number; isPlaying: boolean; isProcessing?: boolean; error?: string; onSeek: (seconds: number) => void; onPlayPause: () => void; }
```

Flutter: pass `AudioPlayerController` abstraction with `position`,
`duration`, `play()`, `pause()`, and `seek(Duration)`. Keep the media
implementation replaceable (for example, `just_audio`). Validate
`startSeconds` against duration.

## 5. Next.js / Tailwind CSS Blueprint

``` tsx
'use client';
import { Play, Pause, Clock3, AudioLines } from 'lucide-react';
import type { ClassAudioWaveformPlayerProps } from './types';
const fmt = (n: number) => `${Math.floor(Math.max(0,n)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,n)%60).toString().padStart(2,'0')}`;
export function ClassAudioWaveformPlayer(p: ClassAudioWaveformPlayerProps) {
  const duration = Math.max(1, p.durationSeconds);
  const seek = (s: number) => p.onSeek(Math.max(0, Math.min(p.durationSeconds, s)));
  return <section className="rounded-2xl border border-border/80 bg-surface/85 p-4 backdrop-blur-md" aria-label={p.title}>
    <div className="flex items-center gap-3"><button aria-label={p.isPlaying ? 'Pause audio' : 'Play audio'} onClick={p.onPlayPause} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-cyan-500 text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{p.isPlaying ? <Pause size={18}/> : <Play size={18}/>}</button><div className="min-w-0 flex-1"><h3 className="truncate font-medium text-slate-100">{p.title}</h3><div className="mt-1 flex items-center gap-2 text-xs text-slate-400"><AudioLines size={14}/>{p.isProcessing ? 'Preparing transcript…' : 'Class recording'}</div></div><span dir="ltr" className="math-ltr font-mono text-xs tabular-nums text-slate-300">{fmt(p.currentSeconds)} / {fmt(p.durationSeconds)}</span></div>
    <div className="mt-4 flex h-14 items-center gap-[3px]" role="slider" aria-label="Audio position" aria-valuemin={0} aria-valuemax={p.durationSeconds} aria-valuenow={p.currentSeconds} tabIndex={0} onKeyDown={e => { if(e.key==='ArrowRight') seek(p.currentSeconds+5); if(e.key==='ArrowLeft') seek(p.currentSeconds-5); }} onClick={e => { const r=e.currentTarget.getBoundingClientRect(); seek(((e.clientX-r.left)/r.width)*p.durationSeconds); }}>
      {p.samples.slice(0,180).map((sample,i) => { const sec=(i/Math.max(1,p.samples.length-1))*p.durationSeconds; const played=sec<=p.currentSeconds; const topic=p.topics.some(t=>Math.abs(t.startSeconds-sec)<2); return <button key={i} type="button" aria-label={`Seek to ${fmt(sec)}`} onClick={e=>{e.stopPropagation();seek(sec)}} className={`min-w-0 flex-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${topic?'bg-violet-400':played?'bg-cyan-400':'bg-slate-600'}`} style={{height:`${Math.max(12,Math.min(100,Math.abs(sample)*100))}%`}}/>; })}
    </div>
    <input aria-label="Seek audio" className="mt-2 w-full accent-cyan-400" type="range" min={0} max={p.durationSeconds} step={0.1} value={Math.min(p.durationSeconds,p.currentSeconds)} onChange={e=>seek(Number(e.target.value))}/>
    <div className="mt-4 space-y-2">{p.topics.map(t=><button key={t.id} onClick={()=>seek(t.startSeconds)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-800 px-3 py-2 text-start hover:border-violet-500/50 hover:bg-white/[.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><span className="text-sm text-slate-200">{t.title}</span><span dir="ltr" className="inline-flex shrink-0 items-center gap-1 math-ltr font-mono text-xs text-violet-200"><Clock3 size={13}/>{fmt(t.startSeconds)}</span></button>)}</div>
    {p.error && <p role="alert" className="mt-3 text-sm text-rose-300">{p.error}</p>}
  </section>;
}
```

Use a real media controller to keep `currentSeconds` synchronized; the
component is a controlled UI, not an audio engine.

## 6. Flutter Mobile Blueprint

``` dart
class AudioTopic { const AudioTopic({required this.id, required this.title, required this.startSeconds}); final String id, title; final double startSeconds; }
class ClassAudioWaveformPlayer extends StatelessWidget {
  const ClassAudioWaveformPlayer({super.key, required this.title, required this.duration, required this.position, required this.samples, required this.topics, required this.isPlaying, required this.onSeek, required this.onPlayPause});
  final String title; final Duration duration, position; final List<double> samples; final List<AudioTopic> topics; final bool isPlaying; final ValueChanged<Duration> onSeek; final VoidCallback onPlayPause;
  String time(Duration d) => '${d.inMinutes.remainder(60).toString().padLeft(2,'0')}:${d.inSeconds.remainder(60).toString().padLeft(2,'0')}';
  @override Widget build(BuildContext context) { final t=Theme.of(context).extension<SchoolTokens>()!; final max=duration.inMilliseconds.clamp(1, 1<<31).toDouble(); return Card(color:t.surface, child: Padding(padding:const EdgeInsets.all(16), child:Column(crossAxisAlignment:CrossAxisAlignment.start, children:[Row(children:[IconButton.filled(onPressed:onPlayPause, icon:Icon(isPlaying?Icons.pause:Icons.play_arrow)), const SizedBox(width:8), Expanded(child:Text(title, style:TextStyle(color:t.textPrimary))), Text('${time(position)} / ${time(duration)}', textDirection:TextDirection.ltr, style:TextStyle(color:t.textMuted,fontFamily:'JetBrainsMono'))]), const SizedBox(height:12), SizedBox(height:56, child:Row(crossAxisAlignment:CrossAxisAlignment.center, children:List.generate(samples.length.clamp(0,180), (i){final s=samples[i].abs().clamp(.12,1.0); final played=i/(samples.length>1?samples.length-1:1) <= position.inMilliseconds/max; return Expanded(child:Padding(padding:const EdgeInsets.symmetric(horizontal:1),child:Container(height:56*s,decoration:BoxDecoration(color:played?t.aiCyan:t.border,borderRadius:BorderRadius.circular(3)))));}))), Slider(value:position.inMilliseconds.clamp(0,max).toDouble(),max:max,onChanged:(v)=>onSeek(Duration(milliseconds:v.round()))), ...topics.map((topic)=>ListTile(minTileHeight:44,title:Text(topic.title,style:TextStyle(color:t.textSecondary)),trailing:Text(time(Duration(seconds:topic.startSeconds.round())),textDirection:TextDirection.ltr,style:TextStyle(color:t.aiCyan,fontFamily:'JetBrainsMono')),onTap:()=>onSeek(Duration(milliseconds:(topic.startSeconds*1000).round())))]))); }
}
```

## 7. Interactive Micro-interactions

Waveform scrub updates at media-engine cadence, not on a 60fps React
rerender if the audio library already exposes progress events. Topic
selection seeks exactly to `startSeconds`; animate the active topic
marker over 120ms. Flutter: use `HapticFeedback.selectionClick()` on
explicit topic taps; avoid haptics during playback updates. Provide
keyboard seek ±5 seconds.

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
