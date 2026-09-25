import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Pause,
  Square,
  Sliders,
  Activity,
  FileText,
  Shield,
  Download
} from 'lucide-react';
import { AudioArtifact } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface AudioLabViewProps {
  artifacts: AudioArtifact[];
  onAudioStatusChange?: (status: { isArtifactPlaying: boolean; isSynthActive: boolean; currentArtifactId: string | null }) => void;
}

export const AudioLabView: React.FC<AudioLabViewProps> = ({ artifacts, onAudioStatusChange }) => {
  const [selectedArtifact, setSelectedArtifact] = useState<AudioArtifact>(artifacts[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isSynthRunning, setIsSynthRunning] = useState<boolean>(false);
  const [synthFreq, setSynthFreq] = useState<number>(14.8);
  const [synthWave, setSynthWave] = useState<OscillatorType>('sine');
  const [synthModFreq, setSynthModFreq] = useState<number>(0.35);
  const [synthModDepth, setSynthModDepth] = useState<number>(40);
  const [synthResonance, setSynthResonance] = useState<number>(4.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const freqDataRef = useRef<Uint8Array>(new Uint8Array(256));
  const timeDataRef = useRef<Uint8Array>(new Uint8Array(256));

  useEffect(() => {
    // Continuous Real-Time Canvas Oscilloscope & Spectrogram Render Loop
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Update audio analysis arrays
      gpcAudio.getFrequencyData(freqDataRef.current);
      gpcAudio.getTimeDomainData(timeDataRef.current);

      // Clear with dark grid
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = '#131c2d';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Frequency Spectrum Bars (Green/Cyan Gradient)
      const barWidth = (width / 64) - 1;
      for (let i = 0; i < 64; i++) {
        const val = freqDataRef.current[i * 3] || 0;
        const barHeight = (val / 255) * (height * 0.7);
        const x = i * (barWidth + 1);
        const y = height - barHeight;

        const grad = ctx.createLinearGradient(0, height, 0, y);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(0.6, '#39ff14');
        grad.addColorStop(1, '#ff0055');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Draw Oscilloscope Time-Domain Waveform (Cyan Glow Line)
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const sliceWidth = width / 256;
      let x = 0;
      for (let i = 0; i < 256; i++) {
        const v = timeDataRef.current[i] / 128.0;
        const y = (v * (height / 2));

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const notifyParent = (isArt: boolean, isSynth: boolean, artId: string | null) => {
    onAudioStatusChange?.({
      isArtifactPlaying: isArt,
      isSynthActive: isSynth,
      currentArtifactId: artId
    });
  };

  const handleTogglePlayArtifact = (artifact: AudioArtifact) => {
    if (playingId === artifact.id) {
      gpcAudio.stopAllArtifacts();
      gpcAudio.stopLiveSynth();
      setPlayingId(null);
      setIsSynthRunning(false);
      notifyParent(false, false, null);
    } else {
      gpcAudio.stopAllArtifacts();
      gpcAudio.stopLiveSynth();
      setIsSynthRunning(false);
      gpcAudio.playArtifact(artifact.synthesisPreset, artifact.id);
      setPlayingId(artifact.id);
      setSelectedArtifact(artifact);
      notifyParent(true, false, artifact.id);
    }
  };

  const handleStopAll = () => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
    setPlayingId(null);
    setIsSynthRunning(false);
    notifyParent(false, false, null);
  };

  const handleToggleLiveSynth = () => {
    if (isSynthRunning) {
      gpcAudio.stopLiveSynth();
      setIsSynthRunning(false);
      notifyParent(false, false, null);
    } else {
      gpcAudio.stopAllArtifacts();
      setPlayingId(null);
      gpcAudio.startLiveSynth(synthFreq, synthWave, synthModFreq, synthModDepth, synthResonance);
      setIsSynthRunning(true);
      notifyParent(false, true, null);
    }
  };

  const handleSynthParamChange = (freq: number, modF: number, modD: number, res: number) => {
    setSynthFreq(freq);
    setSynthModFreq(modF);
    setSynthModDepth(modD);
    setSynthResonance(res);
    if (isSynthRunning) {
      gpcAudio.updateLiveSynth(freq, modF, modD, res);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              INFRASOUND ACOUSTIC LAB & DSP SCANNER
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            6 Recovered Audio Artifacts + Real-Time Sub-Audible Frequency Synthesizer
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(playingId || isSynthRunning) && (
            <button
              onClick={handleStopAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-600 rounded font-bold cursor-pointer transition-colors shadow-md text-xs animate-pulse"
            >
              <Square className="w-3.5 h-3.5" />
              <span>STOP ALL STREAMS</span>
            </button>
          )}
          <span className="text-[11px] px-2.5 py-1 bg-[#0d131f] border border-[#1f2c42] rounded text-cyan-400 font-bold">
            WEB AUDIO DSP: ACTIVE
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Oscilloscope / Spectrogram & Selected Artifact Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Real-time Oscilloscope Canvas */}
          <div className="p-4 bg-[#0a0e18] border border-cyan-500/40 rounded-lg shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#182335] pb-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>REAL-TIME SPECTROGRAM & OSCILLOSCOPE (2048-POINT FFT)</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {playingId ? 'PLAYING ARTIFACT' : isSynthRunning ? 'LIVE SYNTHESIZER ACTIVE' : 'IDLE CARRIER MONITOR'}
              </span>
            </div>

            <div className="relative w-full h-44 bg-[#04060a] border border-[#18253a] rounded overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={176}
                className="w-full h-full block"
              />
              <div className="absolute top-2 left-3 pointer-events-none text-[9px] text-cyan-400/80 font-mono">
                BASELINE: 14.802 Hz // SAMPLING: 48.0 kHz // 32-BIT FLOAT
              </div>
            </div>
          </div>

          {/* Selected Artifact Dossier & Player */}
          {selectedArtifact && (
            <div className="p-5 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 text-sm font-mono">{selectedArtifact.code}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold">
                      {selectedArtifact.classification.split(' - ')[0]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedArtifact.title}</h2>
                </div>

                <button
                  onClick={() => handleTogglePlayArtifact(selectedArtifact)}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-bold cursor-pointer transition-all shadow-md text-xs ${
                    playingId === selectedArtifact.id
                      ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  }`}
                >
                  {playingId === selectedArtifact.id ? (
                    <>
                      <Pause className="w-4 h-4 fill-black" />
                      <span>PAUSE ARTIFACT</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>PLAY RECORDING</span>
                    </>
                  )}
                </button>
              </div>

              {/* Artifact Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                <div>
                  <span className="text-slate-500 block">RECORDING DATE:</span>
                  <span className="text-slate-200 truncate block">{selectedArtifact.recordingDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LOCATION:</span>
                  <span className="text-purple-300 truncate block">{selectedArtifact.recordedAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CARRIER FREQUENCY:</span>
                  <span className="text-cyan-300 font-bold truncate block">{selectedArtifact.carrierFrequency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DURATION:</span>
                  <span className="text-emerald-400 font-bold">{selectedArtifact.durationSeconds} Seconds</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">RECORD ABSTRACT:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070b13] p-3 rounded border border-[#182335]">
                  {selectedArtifact.summary}
                </p>
              </div>

              {/* Audio Transcript */}
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  RECOVERED AUDIO TRANSCRIPT & OPERATOR LOG:
                </span>
                <div className="p-3 bg-[#04060a] border border-[#182335] rounded font-mono text-[10px] text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {selectedArtifact.transcript}
                </div>
              </div>

              {/* Spectral Notes */}
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-[10px] text-amber-200 leading-normal">
                <span className="font-bold block text-amber-300 mb-0.5">FOURIER SPECTRAL ANALYSIS:</span>
                {selectedArtifact.spectralNotes}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Artifact Selector List & Live Infrasound Synth */}
        <div className="space-y-6">
          {/* Artifact Selector List */}
          <div className="space-y-2">
            <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
              RECOVERED AUDIO ARCHIVE (6)
            </div>

            <div className="space-y-1.5">
              {artifacts.map((art) => {
                const isSelected = selectedArtifact?.id === art.id;
                const isPlaying = playingId === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      setSelectedArtifact(art);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300 text-[11px] font-mono">{art.code}</span>
                        {isPlaying && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-400 text-black font-bold animate-pulse">
                            PLAYING
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-xs truncate text-slate-200">{art.title}</h3>
                      <p className="text-[10px] text-slate-500 truncate">{art.carrierFrequency}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlayArtifact(art);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-black rounded transition-colors text-slate-300"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Infrasound Synthesizer Box */}
          <div className="p-4 bg-[#0a0e18] border border-emerald-500/40 rounded-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#182335] pb-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Sliders className="w-4 h-4" />
                <span>INFRASOUND SYNTHESIZER</span>
              </div>
              <button
                onClick={handleToggleLiveSynth}
                className={`px-2.5 py-1 rounded font-bold text-[10px] cursor-pointer transition-all ${
                  isSynthRunning
                    ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isSynthRunning ? 'STOP SYNTH' : 'START SYNTH'}
              </button>
            </div>

            <div className="space-y-3 text-[10px]">
              {/* Carrier Frequency Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>CARRIER FREQUENCY:</span>
                  <span className="text-cyan-300 font-bold font-mono">{synthFreq.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="450"
                  step="0.5"
                  value={synthFreq}
                  onChange={(e) =>
                    handleSynthParamChange(
                      Number(e.target.value),
                      synthModFreq,
                      synthModDepth,
                      synthResonance
                    )
                  }
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Waveform Selector */}
              <div>
                <span className="text-slate-400 block mb-1">WAVEFORM TOPOLOGY:</span>
                <div className="grid grid-cols-4 gap-1">
                  {(['sine', 'triangle', 'square', 'sawtooth'] as OscillatorType[]).map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setSynthWave(w);
                        if (isSynthRunning) {
                          gpcAudio.startLiveSynth(
                            synthFreq,
                            w,
                            synthModFreq,
                            synthModDepth,
                            synthResonance
                          );
                        }
                      }}
                      className={`py-1 rounded uppercase text-[9px] transition-colors cursor-pointer ${
                        synthWave === w
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400 font-bold'
                          : 'bg-[#06080e] border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {w.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modulation Frequency Slider */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>LFO WARBLE RATE:</span>
                  <span className="text-pink-300 font-bold font-mono">{synthModFreq.toFixed(2)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="8"
                  step="0.05"
                  value={synthModFreq}
                  onChange={(e) =>
                    handleSynthParamChange(
                      synthFreq,
                      Number(e.target.value),
                      synthModDepth,
                      synthResonance
                    )
                  }
                  className="w-full accent-pink-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Filter Resonance */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Q-FACTOR RESONANCE:</span>
                  <span className="text-amber-300 font-bold font-mono">{synthResonance.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={synthResonance}
                  onChange={(e) =>
                    handleSynthParamChange(
                      synthFreq,
                      synthModFreq,
                      synthModDepth,
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
