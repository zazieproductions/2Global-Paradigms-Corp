import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Radio, Zap, Eraser, KeyRound, Terminal, VolumeX, Lock } from 'lucide-react';
import { GANDER_BEACON, SIGNAL_KEYS } from '../../data/signalPuzzles';
import {
  buildMorseTimeline,
  classifyKeyPress,
  morseDecodeLetter,
  morseEncodeWord,
  morseTimelineLength
} from '../../lib/signalCiphers';
import { gpcAudio } from '../../lib/audioEngine';
import { useSignalChain } from '../../lib/signalChainContext';

export const GanderBeacon: React.FC = () => {
  const chain = useSignalChain();
  const [wpm, setWpm] = useState(GANDER_BEACON.defaultWpm);
  const [lampOn, setLampOn] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  const [partial, setPartial] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [manualKeying, setManualKeying] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [keyerLog, setKeyerLog] = useState<string[]>([]);

  const bufferRef = useRef('');
  const rafRef = useRef<number | null>(null);
  const gapTimerRef = useRef<number | null>(null);
  const pressStartRef = useRef<number>(0);
  const stackRef = useRef<string[]>([]);
  const successFiredRef = useRef(false);

  const unit = 1.2 / Math.max(4, wpm);
  const dashThresholdMs = Math.round(unit * 1.8 * 1000);
  const decoded = letters.map((l) => morseDecodeLetter(l) ?? '?').join('');
  const preambleMorse = morseEncodeWord(GANDER_BEACON.preamble);

  const pushLog = useCallback((line: string) => {
    setKeyerLog((prev) => [`[${new Date().toISOString().slice(11, 19)}] ${line}`, ...prev].slice(0, 7));
  }, []);

  const commitLetter = useCallback(() => {
    const code = bufferRef.current;
    bufferRef.current = '';
    setPartial('');
    if (!code) return;
    stackRef.current = [...stackRef.current, code];
    setLetters(stackRef.current);
  }, []);

  const clearBuffer = useCallback(() => {
    bufferRef.current = '';
    stackRef.current = [];
    setLetters([]);
    setPartial('');
    setRecovered(false);
    successFiredRef.current = false;
    pushLog('READOUT BUFFER CLEARED');
  }, [pushLog]);

  const checkSuccess = useCallback(
    (word: string) => {
      if (successFiredRef.current) return;
      if (word === SIGNAL_KEYS.one) {
        successFiredRef.current = true;
        setRecovered(true);
        chain.noteDiscovered(SIGNAL_KEYS.one);
        gpcAudio.playUiSound('grant');
        pushLog(`PREAMBLE RESOLVED: ${word} — HOUSE KEY RECOVERED`);
      }
    },
    [chain, pushLog]
  );

  // ── TRANSMIT: the relay keys its own preamble ────────────────────────────
  const handleTransmit = () => {
    if (isTransmitting) return;
    gpcAudio.playUiSound('click');
    clearBuffer();
    const timeline = buildMorseTimeline(GANDER_BEACON.preamble, wpm);
    const total = morseTimelineLength(timeline) + 0.4;
    const startAt = gpcAudio.scheduleMorseBursts(timeline, GANDER_BEACON.keyerFrequencyHz);

    if (startAt === null) {
      pushLog('KEYER OFFLINE — AUDIO CONTEXT UNAVAILABLE');
      return;
    }

    setIsTransmitting(true);
    pushLog(`CARRIER UP — ${GANDER_BEACON.keyerFrequencyHz.toFixed(1)} Hz — ${wpm} WPM`);
    pushLog('PREAMBLE INBOUND — 7 CHARACTERS — UNATTENDED KEYING');

    let idx = 0;
    const loop = () => {
      const t = gpcAudio.now() - startAt;

      while (idx < timeline.length && t >= timeline[idx].start) {
        const el = timeline[idx];
        bufferRef.current += el.sym;
        setPartial(bufferRef.current);
        if (el.endsLetter) commitLetter();
        idx++;
      }

      const current = timeline[idx - 1];
      setLampOn(!!current && t < current.start + current.dur);

      if (t > total) {
        setLampOn(false);
        setIsTransmitting(false);
        checkSuccess(stackRef.current.map((c) => morseDecodeLetter(c) ?? '').join(''));
        pushLog('CARRIER DOWN — PREAMBLE COMPLETE');
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  // ── HAND KEYING ─────────────────────────────────────────────────────────
  const pressKey = useCallback(() => {
    if (isTransmitting) return;
    if (gapTimerRef.current !== null) {
      window.clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
    pressStartRef.current = performance.now();
    setManualKeying(true);
    setLampOn(true);
    gpcAudio.startMorseKey(GANDER_BEACON.keyerFrequencyHz);
  }, [isTransmitting]);

  const releaseKey = useCallback(() => {
    if (!manualKeying) return;
    const held = (performance.now() - pressStartRef.current) / 1000;
    setManualKeying(false);
    setLampOn(false);
    gpcAudio.stopMorseKey();

    const sym = classifyKeyPress(held, wpm);
    bufferRef.current += sym;
    setPartial(bufferRef.current);

    // Letter break: if no further press arrives within ~2.2 units, commit.
    if (gapTimerRef.current !== null) window.clearTimeout(gapTimerRef.current);
    gapTimerRef.current = window.setTimeout(() => {
      commitLetter();
      const word = [...stackRef.current, bufferRef.current]
        .map((c) => morseDecodeLetter(c) ?? '')
        .join('');
      checkSuccess(word);
      gapTimerRef.current = null;
    }, unit * 2.2 * 1000);
  }, [checkSuccess, commitLetter, manualKeying, unit, wpm]);

  // Space bar keying
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      // never key the beacon while a modal (terminal, viewer…) has the floor
      if (document.querySelector('[data-gpc-modal="true"]')) return;
      e.preventDefault();
      pressKey();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      releaseKey();
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [pressKey, releaseKey]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (gapTimerRef.current) window.clearTimeout(gapTimerRef.current);
      gpcAudio.stopMorseKey();
      gpcAudio.stopMorseBursts();
    },
    []
  );

  const muted = gpcAudio.isMuted();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* KEYING CONSOLE */}
        <div className="lg:col-span-3 p-4 bg-[#0a0e18] border border-amber-500/40 rounded-lg space-y-4 shadow-xl">
          <div className="flex items-start justify-between border-b border-[#182335] pb-3 gap-3">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase">
                STAGE 01 // GANDER RELAY KEYING POSITION
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">620 Hz Morse Keyer — Unattended Preamble</h2>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Trigger the key yourself, or command the relay to transmit its stored preamble. The keying lamp
                follows the tone; the readout decodes dot and dash as you send.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] text-slate-500">STATION</div>
              <div className="text-[10px] text-cyan-300 font-bold">23 / OFF-BOOK</div>
            </div>
          </div>

          {/* Lamp + key */}
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center">
            <div className="flex flex-col items-center gap-2 p-3 bg-[#05070d] border border-[#162133] rounded">
              <span className="text-[9px] tracking-widest text-slate-500">KEYING LAMP</span>
              <div
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-75 ${
                  lampOn
                    ? 'bg-amber-300 border-amber-200 shadow-[0_0_60px_18px_rgba(252,211,77,0.55)]'
                    : 'bg-[#1a1305] border-[#3a2c0c] shadow-[inset_0_0_18px_rgba(0,0,0,0.9)]'
                }`}
              >
                <Zap
                  className={`w-8 h-8 transition-colors ${lampOn ? 'text-amber-900' : 'text-[#4a3a12]'}`}
                />
              </div>
              <span
                className={`text-[10px] font-bold tracking-widest ${
                  lampOn ? 'text-amber-300' : 'text-slate-600'
                }`}
              >
                {lampOn ? 'KEY DOWN // TONE LIVE' : 'KEY UP // SILENT'}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  pressKey();
                }}
                onMouseUp={releaseKey}
                onMouseLeave={() => manualKeying && releaseKey()}
                onTouchStart={(e) => {
                  e.preventDefault();
                  pressKey();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseKey();
                }}
                disabled={isTransmitting}
                className={`w-full py-8 rounded-lg border-2 font-bold text-sm tracking-widest cursor-pointer transition-all select-none ${
                  isTransmitting
                    ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : manualKeying
                    ? 'bg-amber-300 border-amber-100 text-black shadow-[0_0_28px_rgba(252,211,77,0.5)] scale-[0.99]'
                    : 'bg-gradient-to-b from-[#1d2740] to-[#111827] border-[#2b3a58] text-slate-200 hover:border-amber-400/70 hover:text-amber-200'
                }`}
              >
                {isTransmitting ? 'RELAY IS TRANSMITTING' : manualKeying ? '••• KEYING •••' : 'HOLD TO KEY  ( SPACE )'}
              </button>

              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 bg-[#05070d] border border-[#162133] rounded">
                  <span className="text-slate-500 block">TONE</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {GANDER_BEACON.keyerFrequencyHz.toFixed(1)} Hz
                  </span>
                </div>
                <div className="p-2 bg-[#05070d] border border-[#162133] rounded">
                  <span className="text-slate-500 block">DOT UNIT</span>
                  <span className="text-cyan-300 font-bold font-mono">{Math.round(unit * 1000)} ms</span>
                </div>
                <div className="p-2 bg-[#05070d] border border-[#162133] rounded">
                  <span className="text-slate-500 block">DASH OVER</span>
                  <span className="text-rose-300 font-bold font-mono">{dashThresholdMs} ms</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                  <span>KEYING SPEED:</span>
                  <span className="text-amber-300 font-bold font-mono">{wpm} WPM</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={20}
                  step={1}
                  value={wpm}
                  onChange={(e) => setWpm(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTransmit}
              disabled={isTransmitting}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs cursor-pointer transition-colors ${
                isTransmitting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              {isTransmitting ? 'RECEIVING…' : 'TRANSMIT PREAMBLE'}
            </button>
            <button
              onClick={() => {
                gpcAudio.playUiSound('click');
                clearBuffer();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded font-bold text-xs bg-[#111827] hover:bg-[#1a2438] border border-[#24304a] text-slate-300 cursor-pointer transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
              CLEAR READOUT
            </button>
            {muted && (
              <span className="flex items-center gap-1.5 text-[10px] text-rose-300 px-2 py-1.5 bg-rose-950/40 border border-rose-800/60 rounded">
                <VolumeX className="w-3.5 h-3.5" />
                AUDIO MUTED — UNMUTE IN THE HEADER TO HEAR THE 620 Hz TONE
              </span>
            )}
          </div>
        </div>

        {/* READOUT */}
        <div className="lg:col-span-2 p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-4 shadow-xl">
          <div className="border-b border-[#182335] pb-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">STAGE 01 // DOT-DASH READOUT</span>
            <h3 className="text-xs font-bold text-white mt-0.5">Live Decode Buffer</h3>
          </div>

          {/* Elements */}
          <div className="min-h-[64px] p-2.5 bg-[#04060a] border border-[#162133] rounded">
            <div className="flex flex-wrap items-end gap-1.5">
              {letters.concat(partial ? [partial] : []).length === 0 && (
                <span className="text-[10px] text-slate-600">
                  NO KEYING LOGGED — HOLD THE KEY OR PRESS TRANSMIT
                </span>
              )}
              {letters.concat(partial ? [partial] : []).map((code, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-[11px] font-bold ${
                      morseDecodeLetter(code) ? 'text-emerald-300' : 'text-slate-600'
                    }`}
                  >
                    {morseDecodeLetter(code) ?? '·'}
                  </span>
                  <div className="flex gap-0.5">
                    {code.split('').map((sym, j) => (
                      <span
                        key={j}
                        className={`block ${sym === '.' ? 'w-2 h-2 rounded-full' : 'w-5 h-2 rounded-full'} ${
                          sym === '.' ? 'bg-amber-400' : 'bg-amber-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decoded slots */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 block">DECODED PREAMBLE:</span>
            <div className="flex flex-wrap gap-1.5">
              {GANDER_BEACON.preamble.split('').map((ch, i) => {
                const got = decoded[i];
                return (
                  <span
                    key={i}
                    className={`w-8 h-9 flex items-center justify-center rounded border font-bold text-sm ${
                      got
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-[#05070d] border-[#162133] text-slate-700'
                    }`}
                  >
                    {got || '_'}
                  </span>
                );
              })}
            </div>
            <p className="text-[9px] text-slate-600 font-mono break-all">
              REFERENCE TRACE: {preambleMorse}
            </p>
          </div>

          {/* Success / next step */}
          {recovered ? (
            <div className="p-3 bg-emerald-950/30 border border-emerald-600/60 rounded space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                <KeyRound className="w-3.5 h-3.5" />
                PREAMBLE RESOLVED — KEY ONE RECOVERED
              </div>
              <div className="text-[10px] text-slate-300 space-y-0.5">
                <div>
                  HOUSE NAME: <span className="text-emerald-300 font-bold">{GANDER_BEACON.houseName}</span>
                </div>
                <div>
                  ESTATE: <span className="text-slate-400">{GANDER_BEACON.houseLocation}</span>
                </div>
              </div>
              <div className="p-2 bg-[#04060a] border border-emerald-900/60 rounded text-[10px] text-slate-400">
                The Ravensport carrier is sealed with this word. Transmit it at the terminal (
                <span className="text-cyan-300 font-bold">~</span> or{' '}
                <span className="text-cyan-300 font-bold">GPC://CLI</span>):
                <div className="mt-1 text-emerald-300 font-bold font-mono">
                  key {SIGNAL_KEYS.one}
                </div>
              </div>
              <button
                onClick={() => {
                  const res = chain.submitKey(SIGNAL_KEYS.one);
                  gpcAudio.playUiSound(res.ok ? 'grant' : 'deny');
                  pushLog(res.message);
                }}
                disabled={chain.isSolved(1)}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded font-bold text-[11px] cursor-pointer transition-colors ${
                  chain.isSolved(1)
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                {chain.isSolved(1) ? 'KEY ONE TRANSMITTED — STAGE 02 OPEN' : 'TRANSMIT KEY ONE'}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-[#05070d] border border-[#162133] rounded text-[10px] text-slate-500 leading-relaxed">
              <Lock className="w-3.5 h-3.5 inline mr-1 text-slate-600" />
              Seven characters resolve to one word — the name of the house. Recover it by receiving the
              preamble, or key it yourself on the straight key.
            </div>
          )}

          {/* Keyer log */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 tracking-widest">KEYER LOG</span>
            <div className="p-2 bg-[#04060a] border border-[#162133] rounded font-mono text-[9px] text-slate-500 space-y-0.5 min-h-[54px]">
              {keyerLog.length === 0 ? (
                <div>IDLE — AWAITING KEYING</div>
              ) : (
                keyerLog.map((l, i) => (
                  <div key={i} className={i === 0 ? 'text-cyan-300' : ''}>
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lore strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-[#182335] pb-2">
            <span className="text-[10px] text-amber-400 font-bold">STATION DOSSIER // {GANDER_BEACON.code}</span>
            <span className="text-[9px] text-rose-300 font-bold">{GANDER_BEACON.registerNote}</span>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px]">
            <dt className="text-slate-500">STATION</dt>
            <dd className="text-slate-300">{GANDER_BEACON.stationName}</dd>
            <dt className="text-slate-500">COORDINATES</dt>
            <dd className="text-slate-300">{GANDER_BEACON.coordinates}</dd>
            <dt className="text-slate-500">WINDOW</dt>
            <dd className="text-slate-300">{GANDER_BEACON.transmissionWindow}</dd>
            <dt className="text-slate-500">TONE</dt>
            <dd className="text-amber-300 font-bold">{GANDER_BEACON.keyerFrequencyHz.toFixed(1)} Hz SINE</dd>
          </dl>
          <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside pt-1">
            {GANDER_BEACON.operatorNotes.map((n, i) => (
              <li key={i} className="leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-2">
          <div className="border-b border-[#182335] pb-2">
            <span className="text-[10px] text-cyan-400 font-bold">INTERCEPT LOG // LAST WINDOW</span>
          </div>
          <div className="p-2.5 bg-[#04060a] border border-[#162133] rounded font-mono text-[10px] text-slate-400 space-y-0.5">
            {GANDER_BEACON.interceptLog.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            The preamble carries no message traffic. It has never once been followed by a message. It is the
            key, repeated, forever.
          </p>
        </div>
      </div>
    </div>
  );
};
