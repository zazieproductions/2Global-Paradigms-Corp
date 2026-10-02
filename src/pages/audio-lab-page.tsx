import { useEffect, useRef, useState } from 'react';
import { Activity, FileText, Headphones, Pause, Play, Radio, Sliders, Square } from 'lucide-react';
import type { AudioArtifact } from '@/types';
import { AUDIO_ARTIFACTS } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { CANVAS_COLORS, SPECTRUM_STOPS } from '@/lib/audio/palette';
import { useAudioStatus } from '@/hooks/use-audio-status';
import { useProgression } from '@/hooks/use-progression';
import { useDirectives } from '@/hooks/use-directives';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { ClassificationStamp } from '@/components/ui/classification-stamp';
import { cn } from '@/lib/utils/cn';

const artifacts = AUDIO_ARTIFACTS;

const SCOPE_WIDTH = 800;
const SCOPE_HEIGHT = 176;
const FFT_BINS = 256;
const SPECTRUM_BARS = 64;
const WAVEFORMS: OscillatorType[] = ['sine', 'triangle', 'square', 'sawtooth'];

/** Draws one oscilloscope + spectrum frame from the engine's analyser. */
function drawScope(
  ctx: CanvasRenderingContext2D,
  freq: Uint8Array<ArrayBuffer>,
  time: Uint8Array<ArrayBuffer>,
  glow: boolean
) {
  const { width, height } = ctx.canvas;
  gpcAudio.getFrequencyData(freq);
  gpcAudio.getTimeDomainData(time);

  ctx.fillStyle = CANVAS_COLORS.canvas;
  ctx.fillRect(0, 0, width, height);

  // Graticule
  ctx.strokeStyle = CANVAS_COLORS.grid;
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

  // Spectrum bars
  const barWidth = width / SPECTRUM_BARS - 1;
  for (let i = 0; i < SPECTRUM_BARS; i++) {
    const val = freq[i * 3] || 0;
    const barHeight = (val / 255) * (height * 0.7);
    const x = i * (barWidth + 1);
    const y = height - barHeight;
    const grad = ctx.createLinearGradient(0, height, 0, y);
    for (const [stop, color] of SPECTRUM_STOPS) grad.addColorStop(stop, color);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  // Time-domain trace
  ctx.lineWidth = 2;
  ctx.strokeStyle = CANVAS_COLORS.signal;
  ctx.shadowColor = CANVAS_COLORS.signal;
  ctx.shadowBlur = glow ? 8 : 0;
  ctx.beginPath();
  const slice = width / FFT_BINS;
  for (let i = 0; i < FFT_BINS; i++) {
    const y = (time[i] / 128) * (height / 2);
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * slice, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export default function AudioLabPage() {
  const recordId = useRecordParam();
  const [selectedArtifact, setSelectedArtifact] = useState<AudioArtifact>(() =>
    pickRecord(artifacts, recordId, artifacts[0])
  );
  const { currentArtifactId: playingId, isSynthActive: isSynthRunning } = useAudioStatus();
  const reducedMotion = useReducedMotion();
  const { state, setPreference } = useProgression();
  const { audioPlayed } = useDirectives();
  const soundOn = state.preferences.sound;
  const [synthFreq, setSynthFreq] = useState(14.8);
  const [synthWave, setSynthWave] = useState<OscillatorType>('sine');
  const [synthModFreq, setSynthModFreq] = useState(0.35);
  const [synthModDepth] = useState(40);
  const [synthResonance, setSynthResonance] = useState(4.5);
  const [audioBlocked, setAudioBlocked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const freqDataRef = useRef(new Uint8Array(FFT_BINS));
  const timeDataRef = useRef(new Uint8Array(FFT_BINS));

  const isActive = !!playingId || isSynthRunning;

  // Render loop: only animates while something is sounding. With reduced
  // motion it refreshes at ~6 fps without glow. Idle state is one static frame.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const frame = () => drawScope(ctx, freqDataRef.current, timeDataRef.current, !reducedMotion);
    frame();
    if (!isActive) return;
    if (reducedMotion) {
      const id = window.setInterval(frame, 160);
      return () => window.clearInterval(id);
    }
    let raf = 0;
    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isActive, reducedMotion]);

  const handleTogglePlayArtifact = (artifact: AudioArtifact) => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
    if (playingId === artifact.id) return;
    setSelectedArtifact(artifact);
    const started = gpcAudio.playArtifact(artifact.synthesisPreset, artifact.id);
    setAudioBlocked(!started);
    // Playing a capture is an observable step in the field directives run.
    if (started) audioPlayed(artifact.id);
  };

  const handleStopAll = () => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
  };

  const handleToggleLiveSynth = () => {
    if (isSynthRunning) {
      gpcAudio.stopLiveSynth();
      return;
    }
    gpcAudio.stopAllArtifacts();
    gpcAudio.startLiveSynth(synthFreq, synthWave, synthModFreq, synthModDepth, synthResonance);
    audioPlayed();
  };

  const handleSynthParamChange = (freq: number, modF: number, res: number) => {
    setSynthFreq(freq);
    setSynthModFreq(modF);
    setSynthResonance(res);
    if (isSynthRunning) gpcAudio.updateLiveSynth(freq, modF, synthModDepth, res);
  };

  const scopeState = playingId
    ? 'PLAYING ARTIFACT'
    : isSynthRunning
      ? 'LIVE SYNTHESIZER ACTIVE'
      : 'IDLE CARRIER MONITOR';

  return (
    <ArchivePage className="space-y-6">
      <ViewHeader
        icon={Radio}
        title="INFRASOUND ACOUSTIC LAB & DSP SCANNER"
        subtitle={`${artifacts.length} Recovered Audio Artifacts + Real-Time Sub-Audible Frequency Synthesizer`}
        aside={
          <>
            {isActive && (
              <button
                type="button"
                onClick={handleStopAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-600 rounded font-bold cursor-pointer transition-colors shadow-md text-xs motion-safe:animate-pulse"
              >
                <Square className="w-3.5 h-3.5" />
                <span>STOP ALL STREAMS</span>
              </button>
            )}
            <span className="text-label px-2.5 py-1 bg-raised border border-line-strong rounded text-cyan-400 font-bold">
              WEB AUDIO DSP: ACTIVE
            </span>
          </>
        }
      />

      <p className="flex items-start gap-2 text-caption text-slate-400 -mt-2">
        <Headphones className="w-3.5 h-3.5 shrink-0 mt-px text-slate-500" />
        <span>
          Nothing plays until you press play. Recordings are synthesised live in your browser and loop until
          stopped — keep your volume moderate. Every artifact has a full written transcript, so no clue
          requires listening.
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scope + selected artifact */}
        <div className="lg:col-span-2 space-y-5">
          <section
            className="p-4 bg-panel border border-cyan-500/40 rounded-lg shadow-xl space-y-3"
            aria-labelledby="scope-title"
          >
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 id="scope-title" className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Activity className={cn('w-4 h-4 text-cyan-400', isActive && 'motion-safe:animate-pulse')} />
                <span>REAL-TIME SPECTROGRAM & OSCILLOSCOPE (2048-POINT FFT)</span>
              </h2>
              <span className="text-caption text-slate-400" aria-live="polite">
                {scopeState}
              </span>
            </div>

            <div className="relative w-full h-44 bg-void border border-line-strong rounded overflow-hidden">
              <canvas
                ref={canvasRef}
                width={SCOPE_WIDTH}
                height={SCOPE_HEIGHT}
                className="w-full h-full block"
                role="img"
                aria-label={`Oscilloscope and frequency spectrum. Status: ${scopeState.toLowerCase()}.`}
              />
              <div
                className="absolute top-2 left-3 pointer-events-none text-micro text-cyan-400/80 font-mono"
                aria-hidden
              >
                BASELINE: 14.802 Hz // SAMPLING: 48.0 kHz // 32-BIT FLOAT
              </div>
            </div>
          </section>

          <article
            className="p-5 bg-panel border border-line-strong rounded-lg space-y-4 shadow-lg"
            aria-labelledby="artifact-title"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line-strong pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400 text-sm font-mono">{selectedArtifact.code}</span>
                  <ClassificationStamp level={selectedArtifact.classification} />
                </div>
                <h2 id="artifact-title" className="text-base font-bold text-white">
                  {selectedArtifact.title}
                </h2>
              </div>

              <button
                type="button"
                aria-pressed={playingId === selectedArtifact.id}
                onClick={() => handleTogglePlayArtifact(selectedArtifact)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded font-bold cursor-pointer transition-all shadow-md text-xs text-black',
                  playingId === selectedArtifact.id
                    ? 'bg-amber-500 shadow-glow-sm shadow-amber-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 shadow-glow-sm shadow-signal/40'
                )}
              >
                {playingId === selectedArtifact.id ? (
                  <>
                    <Pause className="w-4 h-4 fill-black" />
                    <span>STOP ARTIFACT</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>PLAY RECORDING</span>
                  </>
                )}
              </button>
            </div>

            {!soundOn && (
              <p role="status" className="flex flex-wrap items-center gap-2 text-caption text-amber-300">
                <span>Archive audio is muted, so playback will be silent.</span>
                <button
                  type="button"
                  onClick={() => {
                    setPreference('sound', true);
                    gpcAudio.toggleSound(true);
                  }}
                  className="px-2 py-0.5 rounded border border-amber-600/60 hover:bg-amber-950/40"
                >
                  UNMUTE
                </button>
              </p>
            )}

            {audioBlocked && (
              <p role="status" className="text-caption text-amber-300">
                Audio output unavailable in this browser session. The transcript below contains the full
                recording.
              </p>
            )}

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
              <div>
                <dt className="text-slate-500">RECORDING DATE:</dt>
                <dd className="text-slate-200 truncate">{selectedArtifact.recordingDate}</dd>
              </div>
              <div>
                <dt className="text-slate-500">LOCATION:</dt>
                <dd className="text-purple-300 truncate">{selectedArtifact.recordedAt}</dd>
              </div>
              <div>
                <dt className="text-slate-500">CARRIER FREQUENCY:</dt>
                <dd className="text-cyan-300 font-bold truncate">{selectedArtifact.carrierFrequency}</dd>
              </div>
              <div>
                <dt className="text-slate-500">DURATION:</dt>
                <dd className="text-emerald-400 font-bold">{selectedArtifact.durationSeconds} Seconds</dd>
              </div>
            </dl>

            <div className="space-y-1">
              <h3 className="text-caption text-slate-400 font-bold">RECORD ABSTRACT:</h3>
              <p className="text-label text-slate-300 leading-relaxed bg-inset p-3 rounded border border-line">
                {selectedArtifact.summary}
              </p>
            </div>

            {selectedArtifact.audioDescription && (
              <p className="text-caption text-slate-400">
                <span className="font-bold text-slate-300">WHAT IT SOUNDS LIKE: </span>
                {selectedArtifact.audioDescription}
              </p>
            )}

            <div className="space-y-1">
              <h3 className="text-caption text-cyan-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                RECOVERED AUDIO TRANSCRIPT & OPERATOR LOG:
              </h3>
              <div
                className="p-3 bg-void border border-line rounded font-mono text-caption text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto"
                tabIndex={0}
                aria-label={`Transcript of ${selectedArtifact.code}`}
              >
                {selectedArtifact.transcript}
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded text-caption text-amber-200 leading-normal">
              <span className="font-bold block text-amber-300 mb-0.5">FOURIER SPECTRAL ANALYSIS:</span>
              {selectedArtifact.spectralNotes}
            </div>
          </article>
        </div>

        {/* Artifact list + synth */}
        <div className="space-y-6">
          <section className="space-y-2" aria-labelledby="artifact-list-title">
            <h2
              id="artifact-list-title"
              className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white"
            >
              RECOVERED AUDIO ARCHIVE ({artifacts.length})
            </h2>

            <ul className="space-y-1.5">
              {artifacts.map((art) => {
                const isSelected = selectedArtifact.id === art.id;
                const isPlaying = playingId === art.id;
                return (
                  <li
                    key={art.id}
                    className={cn(
                      'rounded-lg border transition-all flex items-stretch',
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-glow-sm shadow-signal/20'
                        : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        gpcAudio.playUiSound('click');
                        setSelectedArtifact(art);
                      }}
                      className="flex-1 min-w-0 text-left p-3 space-y-0.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300 text-label font-mono">{art.code}</span>
                        {isPlaying && (
                          <span className="text-nano px-1 py-px rounded bg-cyan-400 text-black font-bold motion-safe:animate-pulse">
                            PLAYING
                          </span>
                        )}
                      </span>
                      <span className="block font-bold text-xs truncate text-slate-200">{art.title}</span>
                      <span className="block text-caption text-slate-500 truncate">
                        {art.carrierFrequency}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePlayArtifact(art)}
                      aria-label={isPlaying ? `Stop ${art.code}` : `Play ${art.code}`}
                      className="m-3 ml-0 self-start p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-black rounded transition-colors text-slate-300"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className="p-4 bg-panel border border-emerald-500/40 rounded-lg space-y-4 shadow-xl"
            aria-labelledby="synth-title"
          >
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 id="synth-title" className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Sliders className="w-4 h-4" />
                <span>INFRASOUND SYNTHESIZER</span>
              </h2>
              <button
                type="button"
                aria-pressed={isSynthRunning}
                onClick={handleToggleLiveSynth}
                className={cn(
                  'px-2.5 py-1 rounded font-bold text-caption cursor-pointer transition-all',
                  isSynthRunning
                    ? 'bg-rose-600 text-white shadow-glow-sm shadow-rose-500/40 motion-safe:animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-sm shadow-emerald-500/30'
                )}
              >
                {isSynthRunning ? 'STOP SYNTH' : 'START SYNTH'}
              </button>
            </div>

            <div className="space-y-3 text-caption">
              <div>
                <label htmlFor="synth-freq" className="flex justify-between text-slate-400 mb-1">
                  <span>CARRIER FREQUENCY:</span>
                  <span className="text-cyan-300 font-bold font-mono">{synthFreq.toFixed(1)} Hz</span>
                </label>
                <input
                  id="synth-freq"
                  type="range"
                  min="5"
                  max="450"
                  step="0.5"
                  value={synthFreq}
                  onChange={(e) =>
                    handleSynthParamChange(Number(e.target.value), synthModFreq, synthResonance)
                  }
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <fieldset>
                <legend className="text-slate-400 block mb-1">WAVEFORM TOPOLOGY:</legend>
                <div className="grid grid-cols-4 gap-1">
                  {WAVEFORMS.map((w) => (
                    <button
                      type="button"
                      key={w}
                      aria-pressed={synthWave === w}
                      aria-label={w}
                      onClick={() => {
                        setSynthWave(w);
                        if (isSynthRunning) {
                          gpcAudio.startLiveSynth(synthFreq, w, synthModFreq, synthModDepth, synthResonance);
                        }
                      }}
                      className={cn(
                        'py-1 rounded uppercase text-micro transition-colors cursor-pointer border',
                        synthWave === w
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold'
                          : 'bg-canvas border-slate-800 text-slate-400 hover:text-slate-200'
                      )}
                    >
                      {w.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="synth-lfo" className="flex justify-between text-slate-400 mb-1">
                  <span>LFO WARBLE RATE:</span>
                  <span className="text-pink-300 font-bold font-mono">{synthModFreq.toFixed(2)} Hz</span>
                </label>
                <input
                  id="synth-lfo"
                  type="range"
                  min="0.05"
                  max="8"
                  step="0.05"
                  value={synthModFreq}
                  onChange={(e) => handleSynthParamChange(synthFreq, Number(e.target.value), synthResonance)}
                  className="w-full accent-pink-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="synth-q" className="flex justify-between text-slate-400 mb-1">
                  <span>Q-FACTOR RESONANCE:</span>
                  <span className="text-amber-300 font-bold font-mono">{synthResonance.toFixed(1)}</span>
                </label>
                <input
                  id="synth-q"
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={synthResonance}
                  onChange={(e) => handleSynthParamChange(synthFreq, synthModFreq, Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </ArchivePage>
  );
}
