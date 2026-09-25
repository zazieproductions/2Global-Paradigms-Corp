import React, { useEffect, useRef } from 'react';
import { Activity, Square, Radio } from 'lucide-react';
import { gpcAudio } from '../lib/audioEngine';

interface AudioPlayerBarProps {
  isArtifactPlaying: boolean;
  isSynthActive: boolean;
  currentArtifactId: string | null;
  artifacts: { id: string; code: string; title: string; synthesisPreset: string }[];
  onStopAll: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isArtifactPlaying,
  isSynthActive,
  currentArtifactId,
  artifacts,
  onStopAll
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isActive = isArtifactPlaying || isSynthActive;

  useEffect(() => {
    if (!isActive) return;

    const freqArr = new Uint8Array(256);
    const timeArr = new Uint8Array(256);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      gpcAudio.getFrequencyData(freqArr);
      gpcAudio.getTimeDomainData(timeArr);

      // Fill background
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, w, h);

      // Draw frequency bars
      const barCount = 64;
      const barW = w / barCount;
      for (let i = 0; i < barCount; i++) {
        const v = freqArr[i] || 0;
        const barH = (v / 255) * h;
        const x = i * barW;
        const y = h - barH;

        const grad = ctx.createLinearGradient(0, h, 0, y);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.6, '#39ff14');
        grad.addColorStop(1, '#ff0055');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barW - 1, barH);
      }

      // Draw oscilloscope line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const slice = w / 128;
      for (let i = 0; i < 128; i++) {
        const v = timeArr[i] / 128.0;
        const y = v * h;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * slice, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  const currentArtifact = artifacts.find((a) => a.id === currentArtifactId);

  if (!isActive) return null;

  return (
    <div className="h-14 bg-[#070b14] border-t border-cyan-500/30 flex items-center px-4 gap-4 shrink-0 z-40 select-none">
      {/* Stop Button */}
      <button
        onClick={() => {
          gpcAudio.playUiSound('click');
          onStopAll();
        }}
        className="p-2 rounded bg-rose-900/50 hover:bg-rose-600 text-rose-200 cursor-pointer transition-colors shrink-0"
        title="Stop All Audio"
      >
        <Square className="w-4 h-4 fill-rose-400" />
      </button>

      {/* Status */}
      <div className="flex items-center gap-2 text-[11px] text-slate-300 shrink-0">
        <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
        {isSynthActive ? (
          <span className="font-bold text-cyan-300">LIVE INFRASOUND SYNTHESIZER ACTIVE</span>
        ) : currentArtifact ? (
          <span className="font-bold text-cyan-300">PLAYING: {currentArtifact.title}</span>
        ) : (
          <span className="font-bold text-cyan-300">AUDIO ENGINE ACTIVE</span>
        )}
      </div>

      {/* Canvas Waveform */}
      <div className="flex-1 h-8 bg-[#04060a] rounded border border-[#18253a] overflow-hidden">
        <canvas ref={canvasRef} width={400} height={32} className="w-full h-full block" />
      </div>

      {/* Small indicator */}
      <span className="text-[10px] text-slate-500 shrink-0 hidden md:inline">DSP ANALYSIS: ONLINE</span>
    </div>
  );
};
