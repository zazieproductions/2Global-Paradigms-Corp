import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Lock,
  KeyRound,
  Terminal,
  Unlock,
  Table2,
  Lightbulb,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { RAVENSPORT_INTERCEPT, SIGNAL_KEYS } from '../../data/signalPuzzles';
import { legibilityScore, lettersOnly, vigenereDecrypt } from '../../lib/signalCiphers';
import { gpcAudio } from '../../lib/audioEngine';
import { useSignalChain } from '../../lib/signalChainContext';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const RavensportCarrier: React.FC = () => {
  const chain = useSignalChain();
  const cipherLetters = useMemo(() => RAVENSPORT_INTERCEPT.trafficGroups.join(''), []);
  const [keyInput, setKeyInput] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [hintShown, setHintShown] = useState(false);
  const [gateInput, setGateInput] = useState('');
  const [gateMsg, setGateMsg] = useState<string | null>(null);
  const [workbenchLog, setWorkbenchLog] = useState<string[]>([
    'CARRIER UNSEALED — 89 FIVE-LETTER GROUPS LOADED INTO DECRYPT BUFFER',
    'AWAITING KEY MATERIAL'
  ]);

  const cleanKey = lettersOnly(keyInput);
  const plaintext = useMemo(
    () => (cleanKey ? vigenereDecrypt(cipherLetters, cleanKey) : ''),
    [cipherLetters, cleanKey]
  );
  const legibility = cleanKey ? legibilityScore(plaintext) : 0;
  const isDecoded = cleanKey.length > 0 && plaintext.includes(SIGNAL_KEYS.two);

  const decodedFiredRef = useRef(false);

  const handleKeyChange = useCallback(
    (value: string) => {
      const v = value.toUpperCase();
      setKeyInput(v);
      setFocusIndex(0);

      const k = lettersOnly(v);
      if (!k) {
        decodedFiredRef.current = false;
        return;
      }
      if (vigenereDecrypt(cipherLetters, k).includes(SIGNAL_KEYS.two) && !decodedFiredRef.current) {
        decodedFiredRef.current = true;
        chain.noteDiscovered(SIGNAL_KEYS.two);
        gpcAudio.playUiSound('grant');
        setWorkbenchLog((prev) => [
          `TRAFFIC DECODED — KEY ${k} — AUTHORISATION WORD RECOVERED: ${SIGNAL_KEYS.two}`,
          ...prev
        ].slice(0, 8));
      }
    },
    [chain, cipherLetters]
  );

  const legibilityLabel =
    legibility === 0
      ? 'NO KEY'
      : legibility < 0.3
      ? 'NOISE'
      : legibility < 0.55
      ? 'PARTIAL — CLOSE'
      : 'LEGIBLE ENGLISH';

  const legibilityColor =
    legibility === 0 ? 'text-slate-500' : legibility < 0.3 ? 'text-rose-400' : legibility < 0.55 ? 'text-amber-400' : 'text-emerald-400';

  const stripLength = 44;
  const keyRow = useMemo(() => {
    if (!cleanKey) return '';
    let out = '';
    for (let i = 0; i < stripLength; i++) out += cleanKey[i % cleanKey.length];
    return out;
  }, [cleanKey]);

  const activeKeyLetter = cleanKey ? cleanKey[focusIndex % cleanKey.length] : null;
  const activeCipherLetter = cipherLetters[focusIndex] ?? null;
  const activePlainLetter = plaintext[focusIndex] ?? null;

  const submitGate = (raw: string) => {
    const res = chain.submitKey(raw);
    gpcAudio.playUiSound(res.ok ? 'grant' : 'deny');
    setGateMsg(res.message);
    setGateInput('');
  };

  // ── SEALED ──────────────────────────────────────────────────────────────
  if (!chain.isStageOpen(2)) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-[#0a0e18] border border-rose-600/50 rounded-lg shadow-2xl space-y-5">
        <div className="flex items-start gap-3 border-b border-[#182335] pb-4">
          <div className="p-2.5 rounded bg-rose-950 border border-rose-700 text-rose-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase">STAGE 02 // SEALED TRAFFIC</span>
            <h2 className="text-base font-bold text-white mt-0.5">{RAVENSPORT_INTERCEPT.title}</h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {RAVENSPORT_INTERCEPT.stationName}. Intercepted {RAVENSPORT_INTERCEPT.interceptDate}. The 89
              five-letter groups are held behind the house key carried by the Gander beacon preamble.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#04060a] border border-[#162133] rounded space-y-3">
          <div className="text-[10px] text-slate-400 leading-relaxed">
            Sealed at the gate. Recover key one from <span className="text-amber-300 font-bold">STAGE 01</span>{' '}
            and transmit it at the terminal (
            <span className="text-cyan-300 font-bold">~</span> or{' '}
            <span className="text-cyan-300 font-bold">GPC://CLI</span>):
          </div>
          <pre className="text-[11px] text-emerald-300 font-bold bg-black/40 border border-emerald-900/50 rounded px-3 py-2">
            key &lt;house name&gt;
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
              placeholder="TRANSMIT KEY ONE…"
              className="flex-1 px-3 py-2 bg-[#05070d] border border-[#24304a] rounded text-amber-200 text-xs font-mono tracking-[0.3em] focus:outline-none focus:border-amber-400 placeholder:text-slate-700 placeholder:tracking-normal"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              UNSEAL CARRIER
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
          <div className="p-3 bg-[#05070d] border border-[#162133] rounded">
            <span className="text-slate-500 block">CARRIER</span>
            <span className="text-slate-300">{RAVENSPORT_INTERCEPT.carrierFrequency}</span>
          </div>
          <div className="p-3 bg-[#05070d] border border-[#162133] rounded">
            <span className="text-slate-500 block">MODULATION</span>
            <span className="text-slate-300">{RAVENSPORT_INTERCEPT.modulation}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── OPEN: WORK BENCH ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* INTERCEPTED TRAFFIC */}
        <div className="lg:col-span-2 p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#182335] pb-2">
            <div>
              <span className="text-[10px] text-rose-400 font-bold uppercase">
                STAGE 02 // INTERCEPTED TRAFFIC
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                {RAVENSPORT_INTERCEPT.title}
              </h2>
            </div>
            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
              <Unlock className="w-3 h-3" /> UNSEALED
            </span>
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px]">
            <dt className="text-slate-500">STATION</dt>
            <dd className="text-slate-300">{RAVENSPORT_INTERCEPT.stationName}</dd>
            <dt className="text-slate-500">INTERCEPTED</dt>
            <dd className="text-slate-300">{RAVENSPORT_INTERCEPT.interceptDate}</dd>
            <dt className="text-slate-500">CARRIER</dt>
            <dd className="text-slate-300">{RAVENSPORT_INTERCEPT.carrierFrequency}</dd>
            <dt className="text-slate-500">MODULATION</dt>
            <dd className="text-slate-300">{RAVENSPORT_INTERCEPT.modulation}</dd>
            <dt className="text-slate-500">CIPHER</dt>
            <dd className="text-cyan-300 font-bold">{RAVENSPORT_INTERCEPT.cipher}</dd>
            <dt className="text-slate-500">GROUPS</dt>
            <dd className="text-slate-300">
              {RAVENSPORT_INTERCEPT.trafficGroups.length} × {RAVENSPORT_INTERCEPT.groupSize} LETTERS (
              {cipherLetters.length} CHARS)
            </dd>
          </dl>

          <div className="p-3 bg-[#04060a] border border-[#162133] rounded max-h-64 overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 font-mono text-[10px]">
              {RAVENSPORT_INTERCEPT.trafficGroups.map((g, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-slate-700">{String(i + 1).padStart(3, '0')}</span>
                  <span className="text-rose-200 tracking-[0.12em]">{g}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 tracking-widest">OPERATOR NOTES</span>
            <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside">
              {RAVENSPORT_INTERCEPT.operatorNotes.map((n, i) => (
                <li key={i} className="leading-relaxed">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DECRYPTOR WORKBENCH */}
        <div className="lg:col-span-3 p-4 bg-[#0a0e18] border border-cyan-500/40 rounded-lg space-y-4 shadow-xl">
          <div className="border-b border-[#182335] pb-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">
              STAGE 02 // LIVE VIGENÈRE DECRYPTOR WORKBENCH
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Type the key — plaintext resolves character by character
            </h3>
          </div>

          {/* Key input */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={keyInput}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="KEY MATERIAL…"
                spellCheck={false}
                className="flex-1 px-3 py-2.5 bg-[#05070d] border border-[#24304a] rounded text-amber-200 text-sm font-mono tracking-[0.35em] focus:outline-none focus:border-amber-400 placeholder:text-slate-700 placeholder:tracking-normal"
              />
              <button
                onClick={() => {
                  gpcAudio.playUiSound('keystroke');
                  handleKeyChange('');
                }}
                className="px-3 py-2 bg-[#111827] hover:bg-[#1a2438] border border-[#24304a] text-slate-300 rounded text-xs font-bold cursor-pointer"
              >
                CLEAR KEY
              </button>
              {chain.isSolved(1) && (
                <button
                  onClick={() => {
                    gpcAudio.playUiSound('keystroke');
                    handleKeyChange(SIGNAL_KEYS.one);
                  }}
                  className="px-3 py-2 bg-[#111827] hover:bg-[#1a2438] border border-emerald-700/60 text-emerald-300 rounded text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  LOAD KEY ONE
                </button>
              )}
              <button
                onClick={() => {
                  gpcAudio.playUiSound('unredact');
                  setHintShown(true);
                  setWorkbenchLog((prev) =>
                    prev[0]?.includes('KEY MATERIAL') ? prev : [`KEY MATERIAL ADVISORY: ${RAVENSPORT_INTERCEPT.keyHint}`, ...prev].slice(0, 8)
                  );
                }}
                className="px-3 py-2 bg-[#111827] hover:bg-[#1a2438] border border-amber-700/60 text-amber-300 rounded text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                HINT
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px]">
              <span className="text-slate-500">TRAFFIC LEGIBILITY:</span>
              <span className={`font-bold font-mono ${legibilityColor}`}>
                {Math.round(legibility * 100)}% — {legibilityLabel}
              </span>
              <div className="flex-1 min-w-[120px] h-1.5 bg-[#05070d] border border-[#162133] rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    legibility < 0.3 ? 'bg-rose-500' : legibility < 0.55 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.round(legibility * 100)}%` }}
                />
              </div>
            </div>

            {hintShown && (
              <div className="p-2 bg-amber-950/20 border border-amber-700/50 rounded text-[10px] text-amber-200 leading-relaxed">
                {RAVENSPORT_INTERCEPT.keyHint} SOURCE: {RAVENSPORT_INTERCEPT.keySource}.
              </div>
            )}
          </div>

          {/* Aligned CIPHER / KEY / PLAIN strip */}
          <div className="p-3 bg-[#04060a] border border-[#162133] rounded overflow-x-auto scrollbar-thin">
            <div className="font-mono text-[11px] space-y-1 min-w-max">
              <div className="flex">
                <span className="w-16 text-slate-600 shrink-0">CIPHER</span>
                {cipherLetters
                  .slice(0, stripLength)
                  .split('')
                  .map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setFocusIndex(i)}
                      className={`w-[15px] text-center ${
                        focusIndex === i ? 'text-rose-300 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
              </div>
              <div className="flex">
                <span className="w-16 text-slate-600 shrink-0">KEY</span>
                {(keyRow || '—'.repeat(stripLength))
                  .split('')
                  .map((ch, i) => (
                    <span key={i} className={`w-[15px] text-center ${cleanKey ? 'text-amber-400' : 'text-slate-800'}`}>
                      {ch}
                    </span>
                  ))}
              </div>
              <div className="flex">
                <span className="w-16 text-slate-600 shrink-0">PLAIN</span>
                {(cleanKey ? plaintext.slice(0, stripLength) : '·'.repeat(stripLength))
                  .split('')
                  .map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setFocusIndex(i)}
                      className={`w-[15px] text-center ${
                        !cleanKey
                          ? 'text-slate-800'
                          : focusIndex === i
                          ? 'text-emerald-300 font-bold'
                          : 'text-emerald-500/80'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
              </div>
            </div>
            <div className="text-[9px] text-slate-600 mt-2">
              Click any character to load it into the tabula recta below (position {focusIndex + 1}).
            </div>
          </div>

          {/* Plaintext output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 font-bold">DECRYPTED TRAFFIC</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setGrouped(true)}
                  className={`px-2 py-0.5 text-[9px] rounded cursor-pointer ${
                    grouped ? 'bg-cyan-500 text-black font-bold' : 'bg-[#111827] text-slate-400'
                  }`}
                >
                  GROUPS OF 5
                </button>
                <button
                  onClick={() => setGrouped(false)}
                  className={`px-2 py-0.5 text-[9px] rounded cursor-pointer ${
                    !grouped ? 'bg-cyan-500 text-black font-bold' : 'bg-[#111827] text-slate-400'
                  }`}
                >
                  RUN-ON
                </button>
              </div>
            </div>
            <div
              className={`p-3 rounded border min-h-[120px] max-h-64 overflow-y-auto scrollbar-thin font-mono text-[11px] leading-relaxed ${
                !cleanKey
                  ? 'bg-[#04060a] border-[#162133] text-slate-700'
                  : isDecoded
                  ? 'bg-emerald-950/20 border-emerald-600/60 text-emerald-200'
                  : 'bg-[#04060a] border-rose-900/50 text-rose-200/70'
              }`}
            >
              {!cleanKey
                ? 'NO KEY LOADED — 89 GROUPS REMAIN CIPHER TEXT'
                : grouped
                ? (plaintext.match(/.{1,5}/g) ?? []).join(' ')
                : plaintext}
            </div>
          </div>

          {/* Tabula recta */}
          <div className="space-y-2">
            <button
              onClick={() => setShowTable((s) => !s)}
              className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer"
            >
              <Table2 className="w-3.5 h-3.5" />
              {showTable ? 'HIDE' : 'SHOW'} TABULA RECTA (26 × 26)
            </button>
            {showTable && (
              <div className="p-2 bg-[#04060a] border border-[#162133] rounded overflow-x-auto scrollbar-thin">
                <div className="min-w-max font-mono text-[7px] leading-[9px]">
                  <div className="flex">
                    <span className="w-[11px]" />
                    {ALPHABET.map((c) => (
                      <span
                        key={c}
                        className={`w-[11px] text-center ${
                          activeCipherLetter === c ? 'text-rose-300 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {ALPHABET.map((rowLetter, r) => (
                    <div key={rowLetter} className="flex">
                      <span
                        className={`w-[11px] text-center ${
                          activeKeyLetter === rowLetter ? 'text-amber-300 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {rowLetter}
                      </span>
                      {ALPHABET.map((_, c) => {
                        const letter = ALPHABET[(r + c) % 26];
                        const isRow = activeKeyLetter === rowLetter;
                        const isCol = activeCipherLetter === ALPHABET[c];
                        const isCell = isRow && isCol && activePlainLetter === letter;
                        return (
                          <span
                            key={c}
                            className={`w-[11px] text-center ${
                              isCell
                                ? 'bg-amber-400 text-black font-bold'
                                : isRow && isCol
                                ? 'bg-amber-900/60 text-amber-200'
                                : isRow
                                ? 'bg-cyan-950/50 text-cyan-200'
                                : isCol
                                ? 'bg-rose-950/40 text-rose-200'
                                : 'text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Workbench log */}
          <div className="p-2 bg-[#04060a] border border-[#162133] rounded font-mono text-[9px] text-slate-500 space-y-0.5">
            {workbenchLog.map((l, i) => (
              <div key={i} className={i === 0 ? 'text-cyan-300' : ''}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEXT STEP */}
      {isDecoded && (
        <div className="p-4 bg-emerald-950/25 border border-emerald-600/60 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
            <KeyRound className="w-4 h-4" />
            TRAFFIC DECODED — OPERATION LULLABY GRID RECOVERED
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            The plaintext names its own authorisation word. That word unseals the Hold-Tone Spectral Print at
            Station 23. Transmit it at the terminal (
            <span className="text-cyan-300 font-bold">~</span>) or below:
          </p>
          <pre className="text-[11px] text-emerald-300 font-bold bg-black/40 border border-emerald-900/50 rounded px-3 py-2">
            key {SIGNAL_KEYS.two}
          </pre>
          <button
            onClick={() => {
              const res = chain.submitKey(SIGNAL_KEYS.two);
              gpcAudio.playUiSound(res.ok ? 'grant' : 'deny');
              setWorkbenchLog((prev) => [res.message, ...prev].slice(0, 8));
            }}
            disabled={chain.isSolved(2)}
            className={`px-4 py-2 rounded font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
              chain.isSolved(2)
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            {chain.isSolved(2) ? 'KEY TWO TRANSMITTED — STAGE 03 OPEN' : 'TRANSMIT KEY TWO'}
          </button>
        </div>
      )}

      {!isDecoded && cleanKey.length > 0 && (
        <div className="p-3 bg-[#0a0e18] border border-amber-700/40 rounded flex items-start gap-2 text-[10px] text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Output is not English. The key repeats across the whole 442-character traffic — a single wrong
            letter scrambles every seventh character. Check the legibility meter as you type.
          </span>
        </div>
      )}
    </div>
  );
};
