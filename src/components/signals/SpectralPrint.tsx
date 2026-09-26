import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Lock,
  KeyRound,
  Terminal,
  Play,
  Square,
  Snowflake,
  VolumeX,
  ScrollText,
  ShieldAlert
} from 'lucide-react';
import { SPIRAL_PRINT, FINAL_DISCLOSURE } from '../../data/signalPuzzles';
import { textToMatrixColumns } from '../../lib/signalCiphers';
import { gpcAudio } from '../../lib/audioEngine';
import { useSignalChain } from '../../lib/signalChainContext';

const CANVAS_W = 1200;
const CANVAS_H = 182;
const AXIS_W = 64;
const WATER_W = CANVAS_W - AXIS_W;
const ROWS = SPIRAL_PRINT.glyphRows;
const ROW_H = CANVAS_H / ROWS; // 26px per frequency bin
const COLUMN_PX = 20; // horizontal pixels per dot-matrix column

interface SpectroStop {
  v: number;
  c: [number, number, number];
}

const SPECTRO_STOPS: SpectroStop[] = [
  { v: 0.0, c: [4, 6, 10] },
  { v: 0.12, c: [10, 28, 58] },
  { v: 0.3, c: [12, 80, 120] },
  { v: 0.5, c: [14, 170, 190] },
  { v: 0.7, c: [60, 220, 120] },
  { v: 0.85, c: [250, 220, 80] },
  { v: 1.0, c: [255, 255, 255] }
];

function spectroColor(n: number): string {
  const v = Math.max(0, Math.min(1, n));
  for (let i = 0; i < SPECTRO_STOPS.length - 1; i++) {
    const a = SPECTRO_STOPS[i];
    const b = SPECTRO_STOPS[i + 1];
    if (v >= a.v && v <= b.v) {
      const t = (v - a.v) / (b.v - a.v || 1);
      const r = Math.round(a.c[0] + (b.c[0] - a.c[0]) * t);
      const g = Math.round(a.c[1] + (b.c[1] - a.c[1]) * t);
      const bl = Math.round(a.c[2] + (b.c[2] - a.c[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }
  }
  return 'rgb(255,255,255)';
}

interface SpectralPrintProps {
  onGrantBlackDossier?: () => void;
}

export const SpectralPrint: React.FC<SpectralPrintProps> = ({ onGrantBlackDossier }) => {
  const chain = useSignalChain();
  const pattern = useMemo(() => textToMatrixColumns(SPIRAL_PRINT.message, 1, 4), []);

  const [running, setRunning] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [columnMs, setColumnMs] = useState(90);
  const [gain, setGain] = useState(1.15);
  const [floor, setFloor] = useState(0.08);
  const [cycles, setCycles] = useState(0);
  const [gateInput, setGateInput] = useState('');
  const [gateMsg, setGateMsg] = useState<string | null>(null);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    'SPIRAL MONITOR ONLINE — 7 FREQUENCY BINS ARMED',
    'CARRIER IDLE — PRESS START TO FEED THE SPIRAL THROUGH THE WATERFALL'
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const writeXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const accRef = useRef(0);
  const fftRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(1024));
  const barLevelsRef = useRef<number[]>(new Array(ROWS).fill(0));
  const paramsRef = useRef({ pxPerSec: 60, gain: 1.15, floor: 0.08, frozen: false });
  const lastCycleStampRef = useRef(0);
  const runningRef = useRef(false);

  const pushLog = useCallback((line: string) => {
    setConsoleLog((prev) => [`[${new Date().toISOString().slice(11, 19)}] ${line}`, ...prev].slice(0, 8));
  }, []);

  // ── CANVAS / WATERFALL ENGINE ───────────────────────────────────────────
  useEffect(() => {
    const buffer = document.createElement('canvas');
    buffer.width = WATER_W;
    buffer.height = CANVAS_H;
    const bctx = buffer.getContext('2d');
    if (bctx) {
      bctx.fillStyle = '#04060a';
      bctx.fillRect(0, 0, WATER_W, CANVAS_H);
    }
    bufferRef.current = buffer;
    writeXRef.current = 0;
  }, []);

  useEffect(() => {
    paramsRef.current = { pxPerSec: (1000 / columnMs) * COLUMN_PX, gain, floor, frozen };
  }, [columnMs, gain, floor, frozen]);

  useEffect(() => {
    const draw = (ts: number) => {
      rafRef.current = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      const buffer = bufferRef.current;
      if (!canvas || !buffer) return;

      const dt = lastTsRef.current === 0 ? 0 : Math.min(0.12, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const params = paramsRef.current;
      const isRunning = gpcAudio.isSpiralRunning();
      if (isRunning !== runningRef.current) {
        runningRef.current = isRunning;
        setRunning(isRunning);
      }

      if (isRunning && !params.frozen) {
        accRef.current += dt * params.pxPerSec;
      }

      const steps = Math.min(Math.floor(accRef.current), WATER_W);
      accRef.current -= Math.floor(accRef.current);

      if (steps > 0) {
        const binCount = gpcAudio.getSpectrogramBinCount();
        if (fftRef.current.length !== binCount) fftRef.current = new Uint8Array(binCount);
        gpcAudio.getSpectrogramData(fftRef.current);

        const bctx = buffer.getContext('2d');
        const sampleRate = gpcAudio.getSampleRate();
        const nyquist = sampleRate / 2;
        const data = fftRef.current;

        if (bctx) {
          for (let s = 0; s < steps; s++) {
            const x = writeXRef.current;
            bctx.fillStyle = '#04060a';
            bctx.fillRect(x, 0, 1, CANVAS_H);

            for (let r = 0; r < ROWS; r++) {
              // Row 0 = top of the glyph = highest frequency bin.
              const freq = SPIRAL_PRINT.binFrequenciesHz[ROWS - 1 - r];
              const center = Math.round((freq / nyquist) * binCount);
              let raw = 0;
              for (let k = -1; k <= 1; k++) {
                const idx = center + k;
                if (idx >= 0 && idx < data.length) raw = Math.max(raw, data[idx]);
              }
              const norm = Math.max(0, raw / 255 - params.floor) / (1 - params.floor);
              const boosted = Math.min(1, Math.pow(norm, 0.8) * params.gain);
              barLevelsRef.current[r] = boosted;

              bctx.fillStyle = spectroColor(boosted);
              bctx.fillRect(x, Math.round(r * ROW_H) + 1, 1, Math.round(ROW_H) - 2);
            }
            writeXRef.current = (x + 1) % WATER_W;
          }
        }
      }

      // ── Composite: waterfall (ring buffer) + axis gutter ──
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#04060a';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const split = writeXRef.current;
      ctx.drawImage(buffer, split, 0, WATER_W - split, CANVAS_H, AXIS_W, 0, WATER_W - split, CANVAS_H);
      if (split > 0) {
        ctx.drawImage(buffer, 0, 0, split, CANVAS_H, AXIS_W + (WATER_W - split), 0, split, CANVAS_H);
      }

      // Row separators
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      ctx.lineWidth = 1;
      for (let r = 1; r < ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(AXIS_W, Math.round(r * ROW_H));
        ctx.lineTo(CANVAS_W, Math.round(r * ROW_H));
        ctx.stroke();
      }

      // Glyph pitch grid — one line per character cell (5 columns + 1 gap)
      ctx.strokeStyle = 'rgba(120,180,255,0.07)';
      for (let x = AXIS_W; x < CANVAS_W; x += COLUMN_PX * (SPIRAL_PRINT.glyphColumns + 1)) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }

      // Axis gutter
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, AXIS_W, CANVAS_H);
      ctx.strokeStyle = '#1b263b';
      ctx.beginPath();
      ctx.moveTo(AXIS_W - 0.5, 0);
      ctx.lineTo(AXIS_W - 0.5, CANVAS_H);
      ctx.stroke();

      ctx.font = '9px ui-monospace, monospace';
      ctx.textBaseline = 'middle';
      for (let r = 0; r < ROWS; r++) {
        const y = r * ROW_H + ROW_H / 2;
        const freq = SPIRAL_PRINT.binFrequenciesHz[ROWS - 1 - r];
        const level = barLevelsRef.current[r] ?? 0;
        ctx.fillStyle = level > 0.35 ? '#7dd3fc' : '#475569';
        ctx.textAlign = 'right';
        ctx.fillText(`${freq}`, AXIS_W - 26, y);
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Hz', AXIS_W - 6, y);

        // Live bin-energy bar
        const barW = Math.round(level * 16);
        ctx.fillStyle = level > 0.5 ? '#fbbf24' : '#0e7490';
        ctx.fillRect(AXIS_W - 24, y - 3, barW, 6);
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.fillText(
        `SIG-03-HOLDTONE // WATERFALL 1024-PT FFT // AUDIO-FED // ${(1000 / columnMs).toFixed(1)} COL/S`,
        AXIS_W + 8,
        11
      );

      if (params.frozen) {
        ctx.fillStyle = 'rgba(56,189,248,0.9)';
        ctx.fillText('■ PRINT HELD', CANVAS_W - 88, 11);
      } else if (!isRunning) {
        ctx.fillStyle = 'rgba(248,113,113,0.85)';
        ctx.fillText('■ CARRIER IDLE — NO SIGNAL TO PAINT', CANVAS_W - 220, 11);
      }

      // Cycle bookkeeping
      if (isRunning && ts - lastCycleStampRef.current > 250) {
        lastCycleStampRef.current = ts;
        const cycleSeconds = (pattern.length * columnMs) / 1000;
        const done = gpcAudio.spiralElapsed() / cycleSeconds;
        setCycles(done);
        if (done >= 1) chain.markPrintObserved();
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chain, columnMs, pattern.length]);

  useEffect(
    () => () => {
      gpcAudio.stopSpiral();
    },
    []
  );

  const startCarrier = () => {
    gpcAudio.playUiSound('click');
    gpcAudio.startSpiral(pattern, SPIRAL_PRINT.binFrequenciesHz, columnMs / 1000, SPIRAL_PRINT.carrierFrequencyHz);
    setRunning(true);
    runningRef.current = true;
    setFrozen(false);
    pushLog(`SPIRAL ENGAGED — CARRIER ${SPIRAL_PRINT.carrierFrequencyHz} Hz — 7 BINS LIVE`);
    pushLog('SPECTRAL PRINT PAINTING — READ THE BINS, NOT THE TRANSCRIPT');
  };

  const stopCarrier = () => {
    gpcAudio.playUiSound('click');
    gpcAudio.stopSpiral();
    setRunning(false);
    runningRef.current = false;
    pushLog('SPIRAL DISENGAGED — WATERFALL HELD');
  };

  const changeSweep = (ms: number) => {
    setColumnMs(ms);
    if (gpcAudio.isSpiralRunning()) {
      gpcAudio.updateSpiralColumnDuration(ms / 1000);
      pushLog(`SWEEP RATE ADJUSTED — ${ms} ms PER COLUMN`);
    }
  };

  const submitGate = (raw: string) => {
    const res = chain.submitKey(raw);
    gpcAudio.playUiSound(res.ok ? 'grant' : 'deny');
    setGateMsg(res.message);
    setGateInput('');
    pushLog(res.message);
  };

  const muted = gpcAudio.isMuted();

  // ── SEALED ──────────────────────────────────────────────────────────────
  if (!chain.isStageOpen(3)) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-[#0a0e18] border border-rose-600/50 rounded-lg shadow-2xl space-y-5">
        <div className="flex items-start gap-3 border-b border-[#182335] pb-4">
          <div className="p-2.5 rounded bg-rose-950 border border-rose-700 text-rose-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase">STAGE 03 // PRINT SEALED</span>
            <h2 className="text-base font-bold text-white mt-0.5">{SPIRAL_PRINT.title}</h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              The waterfall will not paint without the authorisation word. That word is named inside the
              Ravensport decrypt — recover it in <span className="text-amber-300 font-bold">STAGE 02</span>.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#04060a] border border-[#162133] rounded space-y-3">
          <div className="text-[10px] text-slate-400 leading-relaxed">
            Transmit the authorisation word at the terminal (
            <span className="text-cyan-300 font-bold">~</span> or{' '}
            <span className="text-cyan-300 font-bold">GPC://CLI</span>):
          </div>
          <pre className="text-[11px] text-emerald-300 font-bold bg-black/40 border border-emerald-900/50 rounded px-3 py-2">
            key &lt;authorisation word&gt;
          </pre>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitGate(gateInput);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value.toUpperCase())}
              placeholder="AUTHORISATION WORD…"
              className="flex-1 px-3 py-2 bg-[#05070d] border border-[#24304a] rounded text-amber-200 text-xs font-mono tracking-[0.3em] focus:outline-none focus:border-amber-400 placeholder:text-slate-700 placeholder:tracking-normal"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              UNSEAL PRINT
            </button>
          </form>
          {gateMsg && (
            <div
              className={`text-[10px] font-mono ${gateMsg.includes('REJECTED') ? 'text-rose-400' : 'text-emerald-300'}`}
            >
              {gateMsg}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
          <div className="p-3 bg-[#05070d] border border-[#162133] rounded">
            <span className="text-slate-500 block">SOURCE</span>
            <span className="text-slate-300">{SPIRAL_PRINT.sourceName}</span>
          </div>
          <div className="p-3 bg-[#05070d] border border-[#162133] rounded">
            <span className="text-slate-500 block">CONTINUOUS SINCE</span>
            <span className="text-slate-300">{SPIRAL_PRINT.continuousSince}</span>
          </div>
        </dl>
      </div>
    );
  }

  // ── OPEN: THE WATERFALL ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0a0e18] border border-cyan-500/40 rounded-lg space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-3">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              STAGE 03 // REAL-TIME WATERFALL SPECTROGRAM
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              {SPIRAL_PRINT.title} — {SPIRAL_PRINT.sourceName}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-3xl">
              The spiral is fed straight into a 1024-point FFT. Every lit frequency bin is a real tone burst in
              the audio — there is no image file anywhere on this network. Hold the print to read it.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!running ? (
              <button
                onClick={startCarrier}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded text-xs cursor-pointer transition-colors shadow-[0_0_14px_rgba(0,240,255,0.35)]"
              >
                <Play className="w-3.5 h-3.5" />
                START CARRIER
              </button>
            ) : (
              <button
                onClick={stopCarrier}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs cursor-pointer transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                STOP CARRIER
              </button>
            )}
          </div>
        </div>

        {/* Waterfall */}
        <div className="relative w-full bg-[#04060a] border border-[#162133] rounded overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="w-full block"
            style={{ height: 'auto' }}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 tracking-widest">SWEEP</span>
            <div className="grid grid-cols-3 gap-1">
              {[140, 110, 90, 70, 55, 40].map((ms) => (
                <button
                  key={ms}
                  onClick={() => changeSweep(ms)}
                  className={`py-1 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                    columnMs === ms
                      ? 'bg-cyan-500 text-black'
                      : 'bg-[#111827] text-slate-400 hover:text-slate-200 border border-[#24304a]'
                  }`}
                >
                  {ms}ms
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setFrozen((f) => !f);
                gpcAudio.playUiSound('click');
                pushLog(frozen ? 'PRINT RELEASED — WATERFALL RESUMED' : 'PRINT HELD — WATERFALL FROZEN FOR READING');
              }}
              className={`w-full py-1.5 rounded text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                frozen
                  ? 'bg-sky-500 text-black'
                  : 'bg-[#111827] text-slate-300 border border-[#24304a] hover:text-white'
              }`}
            >
              <Snowflake className="w-3 h-3" />
              {frozen ? 'RELEASE PRINT' : 'HOLD PRINT'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>CONTRAST GAIN</span>
              <span className="text-amber-300 font-bold font-mono">{gain.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={0.4}
              max={2.6}
              step={0.05}
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>NOISE FLOOR</span>
              <span className="text-rose-300 font-bold font-mono">{Math.round(floor * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full accent-rose-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-500">CARRIER</span>
              <span className={running ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {running ? 'SPIRAL LIVE' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BINS ARMED</span>
              <span className="text-cyan-300 font-bold">7 (700–1660 Hz)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PRINT PASSES</span>
              <span className="text-amber-300 font-bold font-mono">{cycles.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CONTINUOUS SINCE</span>
              <span className="text-slate-300">2006-03-20</span>
            </div>
            {muted && (
              <div className="flex items-start gap-1.5 pt-1 text-rose-300">
                <VolumeX className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>ARCHIVE AUDIO MUTED — THE PRINT IS THE SOUND. UNMUTE TO PAINT IT.</span>
              </div>
            )}
          </div>
        </div>

        {/* Console log */}
        <div className="p-2 bg-[#04060a] border border-[#162133] rounded font-mono text-[9px] text-slate-500 space-y-0.5">
          {consoleLog.map((l, i) => (
            <div key={i} className={i === 0 ? 'text-cyan-300' : ''}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Operator notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-2">
          <div className="border-b border-[#182335] pb-2">
            <span className="text-[10px] text-cyan-400 font-bold">SPIRAL DOSSIER // {SPIRAL_PRINT.code}</span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px]">
            <dt className="text-slate-500">SOURCE</dt>
            <dd className="text-slate-300">{SPIRAL_PRINT.sourceName}</dd>
            <dt className="text-slate-500">UPTIME</dt>
            <dd className="text-slate-300">{SPIRAL_PRINT.continuousSince}</dd>
            <dt className="text-slate-500">CARRIER</dt>
            <dd className="text-cyan-300 font-bold">{SPIRAL_PRINT.carrierFrequencyHz} Hz (DRIFT ±6 Hz)</dd>
            <dt className="text-slate-500">MATRIX</dt>
            <dd className="text-slate-300">
              {SPIRAL_PRINT.glyphColumns}×{SPIRAL_PRINT.glyphRows} DOT MATRIX — 1 COLUMN PER BURST
            </dd>
          </dl>
          <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside pt-1">
            {SPIRAL_PRINT.operatorNotes.map((n, i) => (
              <li key={i} className="leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        </div>

        {/* Gate */}
        <div className="p-4 bg-[#0a0e18] border border-amber-500/40 rounded-lg space-y-3">
          <div className="border-b border-[#182335] pb-2">
            <span className="text-[10px] text-amber-400 font-bold">
              OBSERVED WORD GATE // TRANSMIT KEY THREE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Read the lit bins off the waterfall — five columns per letter, one blank column between glyphs.
            Transmit what the spiral has been carrying since 2006.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitGate(gateInput);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value.toUpperCase())}
              disabled={!chain.printObserved}
              placeholder={chain.printObserved ? 'OBSERVED WORD…' : 'RUN ONE FULL PRINT PASS TO ARM'}
              className="flex-1 px-3 py-2 bg-[#05070d] border border-[#24304a] rounded text-amber-200 text-xs font-mono tracking-[0.3em] focus:outline-none focus:border-amber-400 placeholder:text-slate-700 placeholder:tracking-normal disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!chain.printObserved}
              className={`px-4 py-2 rounded font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                chain.printObserved
                  ? 'bg-amber-500 hover:bg-amber-400 text-black'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              TRANSMIT
            </button>
          </form>
          {gateMsg && (
            <div
              className={`text-[10px] font-mono ${gateMsg.includes('REJECTED') ? 'text-rose-400' : 'text-emerald-300'}`}
            >
              {gateMsg}
            </div>
          )}
          {!chain.printObserved && (
            <div className="text-[9px] text-slate-600">
              GATE ARMED AFTER {((pattern.length * columnMs) / 1000).toFixed(1)}s OF CONTINUOUS PRINT —{' '}
              {(cycles * 100).toFixed(0)}% RECEIVED
            </div>
          )}
        </div>
      </div>

      {/* PAYOFF */}
      {chain.isFinalOpen() && (
        <div className="p-5 bg-gradient-to-b from-[#120a12] to-[#0a0e18] border border-rose-500/50 rounded-lg space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
          <div className="flex items-start justify-between gap-3 border-b border-rose-900/60 pb-3">
            <div className="flex items-start gap-2.5">
              <ScrollText className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-rose-400 font-bold tracking-widest">
                  {FINAL_DISCLOSURE.classificationStamp}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{FINAL_DISCLOSURE.title}</h3>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {FINAL_DISCLOSURE.code} // FILED {FINAL_DISCLOSURE.filedDate} // {FINAL_DISCLOSURE.filedBy}
                </div>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold shrink-0">
              OPENED BY OBSERVER
            </span>
          </div>

          {/* Archived print */}
          <div className="p-3 bg-[#04060a] border border-[#162133] rounded space-y-2">
            <span className="text-[9px] text-slate-500 tracking-widest">
              ARCHIVED PRINT — {SPIRAL_PRINT.message}
            </span>
            <div className="flex gap-3">
              {SPIRAL_PRINT.message.split('').map((ch, ci) => (
                <div key={ci} className="grid grid-rows-7 gap-[2px]">
                  {Array.from({ length: ROWS }).map((_, r) => (
                    <div key={r} className="flex gap-[2px]">
                      {Array.from({ length: SPIRAL_PRINT.glyphColumns }).map((_, c) => {
                        const lit = (pattern[4 + ci * (SPIRAL_PRINT.glyphColumns + 1) + c] ?? []).includes(r);
                        return (
                          <span
                            key={c}
                            className={`w-1.5 h-1.5 rounded-[1px] ${
                              lit ? 'bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.8)]' : 'bg-[#101726]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {FINAL_DISCLOSURE.body.map((para, i) => (
              <p
                key={i}
                className={`text-[11px] leading-relaxed ${
                  i === 1
                    ? 'text-cyan-300 font-bold text-base tracking-[0.35em]'
                    : i === FINAL_DISCLOSURE.body.length - 1
                    ? 'text-rose-300 font-bold'
                    : 'text-slate-300'
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {onGrantBlackDossier && (
            <button
              onClick={() => {
                gpcAudio.playUiSound('grant');
                onGrantBlackDossier();
              }}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              ACCEPT BLACK DOSSIER CLEARANCE (LEVEL 5 + DE-SCRAMBLER)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
