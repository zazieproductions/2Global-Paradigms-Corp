import { useEffect, useRef } from 'react';
import { Activity, Square } from 'lucide-react';
import { AUDIO_ARTIFACTS } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { CANVAS_COLORS, SPECTRUM_STOPS } from '@/lib/audio/palette';
import { useAudioStatus } from '@/hooks/use-audio-status';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/** Persistent transport bar. Only rendered while something is playing. */
export function AudioPlayerBar() {
  const { currentArtifactId, isSynthActive } = useAudioStatus();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isActive = !!currentArtifactId || isSynthActive;

  useEffect(() => {
    if (!isActive || reducedMotion) return;
    const freqArr = new Uint8Array(256);
    const timeArr = new Uint8Array(256);
    let frame = 0;

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const { width: w, height: h } = canvas;
      gpcAudio.getFrequencyData(freqArr);
      gpcAudio.getTimeDomainData(timeArr);

      ctx.fillStyle = CANVAS_COLORS.scope;
      ctx.fillRect(0, 0, w, h);

      const barCount = 64;
      const barW = w / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = ((freqArr[i] || 0) / 255) * h;
        const y = h - barH;
        const grad = ctx.createLinearGradient(0, h, 0, y);
        SPECTRUM_STOPS.forEach(([o, c]) => grad.addColorStop(o, c));
        ctx.fillStyle = grad;
        ctx.fillRect(i * barW, y, barW - 1, barH);
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = CANVAS_COLORS.signal;
      ctx.shadowColor = CANVAS_COLORS.signal;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const slice = w / 128;
      for (let i = 0; i < 128; i++) {
        const y = (timeArr[i] / 128) * h;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * slice, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [isActive, reducedMotion]);

  if (!isActive) return null;
  const current = AUDIO_ARTIFACTS.find((a) => a.id === currentArtifactId);
  const label = isSynthActive
    ? 'LIVE INFRASOUND SYNTHESIZER ACTIVE'
    : current
      ? `PLAYING: ${current.title}`
      : 'AUDIO ENGINE ACTIVE';

  return (
    <div
      className="min-h-14 bg-inset border-t border-cyan-500/30 flex items-center px-3 md:px-4 safe-x pb-[env(safe-area-inset-bottom)] gap-3 md:gap-4 shrink-0 z-40"
      role="region"
      aria-label="Audio playback"
    >
      <button
        type="button"
        onClick={() => {
          gpcAudio.playUiSound('click');
          gpcAudio.stopAll();
        }}
        className="tap-target p-2 rounded bg-rose-900/50 hover:bg-rose-600 text-rose-200 cursor-pointer transition-colors shrink-0"
        title="Stop All Audio"
        aria-label="Stop all audio"
      >
        <Square className="w-4 h-4 fill-rose-400" aria-hidden />
      </button>

      <div className="flex items-center gap-2 text-label text-slate-300 min-w-0" aria-live="polite">
        <Activity className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" aria-hidden />
        <span className="font-bold text-cyan-300 truncate">{label}</span>
      </div>

      <div
        className="flex-1 h-8 bg-void rounded border border-line-strong overflow-hidden hidden md:block"
        aria-hidden
      >
        <canvas ref={canvasRef} width={400} height={32} className="w-full h-full block" />
      </div>

      <span className="text-caption text-slate-500 shrink-0 hidden md:inline">ANALYSER</span>
    </div>
  );
}
