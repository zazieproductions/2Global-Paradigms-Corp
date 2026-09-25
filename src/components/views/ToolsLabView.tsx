import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Activity,
  Sliders,
  ShieldAlert,
  Terminal,
  Zap,
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
  AlertTriangle,
  Brain,
  Layers,
  Lock,
  Unlock
} from 'lucide-react';
import { gpcAudio } from '../../lib/audioEngine';

export const ToolsLabView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('calc');

  // Tool 1: Civic Evacuation Calculator State
  const [density, setDensity] = useState(8500); // people/km2
  const [harmonicTension, setHarmonicTension] = useState(42); // %
  const [weatherIndex, setWeatherIndex] = useState(68); // %
  const [transitCapacity, setTransitCapacity] = useState(70); // %

  const evacuationFailureProb = Math.min(
    99.9,
    Math.max(2.1, Math.round(((density / 10000) * 35 + harmonicTension * 0.45 + (100 - transitCapacity) * 0.3) * 10) / 10)
  );
  const throughputHours = (density / (1200 * (transitCapacity / 100))).toFixed(1);

  // Tool 2: Redaction Reconstruction Utility State
  const scrambledSentences = [
    {
      scrambled: 'T-E  14.8-Z  C-RR-ER  IS  N-T  G-OT-ER-AL;  IT  IS  AN  AR-IF-CI-L  BE-C-N.',
      clear: 'THE 14.8HZ CARRIER IS NOT GEOTHERMAL; IT IS AN ARTIFICIAL BEACON.',
      unlocked: false
    },
    {
      scrambled: 'DR.  AR-IS  TH-RN-  EX-IL-TR-TED  48GB  FR-M  ST-TI-N  07  BO-EH-LE  4.',
      clear: 'DR. ARIS THORNE EXFILTRATED 48GB FROM STATION 07 BOREHOLE 4.',
      unlocked: false
    },
    {
      scrambled: 'AL-  140,000  RE-ON-8  UN-TS  WE-E  EN-OM-ED  IN  UT-H  SA-T  VA-LT-S.',
      clear: 'ALL 140,000 RESON-8 UNITS WERE ENTOMBED IN UTAH SALT VAULTS.',
      unlocked: false
    }
  ];
  const [reconstructedIdx, setReconstructedIdx] = useState<number[]>([]);

  const handleDeobfuscate = (idx: number) => {
    gpcAudio.playUiSound('unredact');
    if (!reconstructedIdx.includes(idx)) {
      setReconstructedIdx([...reconstructedIdx, idx]);
    }
  };

  // Tool 3: Employee Behavioral Sync Meter State
  const [qAnswers, setQAnswers] = useState<Record<number, number>>({});
  const [syncScore, setSyncScore] = useState<number | null>(null);

  const handleScoreDiagnostic = () => {
    gpcAudio.playUiSound('scan');
    let total = 0;
    Object.values(qAnswers).forEach((val) => (total += val));
    const finalScore = Math.min(100, Math.max(12, Math.round((total / 12) * 100)));
    setSyncScore(finalScore);
    if (finalScore >= 75) {
      gpcAudio.playUiSound('grant');
    } else {
      gpcAudio.playUiSound('deny');
    }
  };

  // Tool 4: Subterranean Telemetry Live Packet Stream
  const [streamPackets, setStreamPackets] = useState<string[]>([]);
  const [isLiveActive, setIsLiveActive] = useState(true);

  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      const stations = ['SVALBARD-07', 'UTAH-SITE19', 'DIEGO-GARCIA', 'ATACAMA-05', 'AZORES-14', 'TIKSI-17'];
      const st = stations[Math.floor(Math.random() * stations.length)];
      const hz = (14.802 + (Math.random() - 0.5) * 0.02).toFixed(3);
      const amp = (82 + Math.random() * 14).toFixed(1);
      const packet = `[${new Date().toISOString().split('T')[1].slice(0, 8)}] PKT: ${st} | FREQ: ${hz}Hz | AMPL: ${amp}dB | STATUS: 0xOK`;
      setStreamPackets((prev) => [packet, ...prev.slice(0, 14)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              SUB-AUDIBLE SOFTWARE TOOLS & INTRANET UTILITIES
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            5 Interactive Analytical Diagnostics, Calculators & Telemetry Decoders
          </p>
        </div>

        {/* Tool Switcher */}
        <div className="flex items-center gap-1 bg-[#0d131f] border border-[#1f2c42] rounded p-0.5 text-[11px] overflow-x-auto">
          {[
            { id: 'calc', label: 'Evacuation Calculator' },
            { id: 'recon', label: 'Redaction Reconstruction' },
            { id: 'meter', label: 'Behavioral Sync Tracker' },
            { id: 'stream', label: 'Seismic Telemetry Feed' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setActiveTool(t.id);
              }}
              className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap ${
                activeTool === t.id
                  ? 'bg-emerald-600 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool 1: Civic Evacuation Probability Calculator */}
      {activeTool === 'calc' && (
        <div className="max-w-3xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-[#182335] pb-3">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">TOOL 01 // CCDR & SFPC MODEL</span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Civic Evacuation Bottleneck & Panic Velocity Probability Calculator
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Models transit throughput constraints and public panic likelihood under variable municipal population densities and sub-harmonic audio tension levels.
            </p>
          </div>

          <div className="space-y-4">
            {/* Population Density */}
            <div>
              <div className="flex justify-between text-slate-300 text-xs mb-1">
                <span>POPULATION DENSITY:</span>
                <span className="text-cyan-300 font-bold font-mono">{density.toLocaleString()} / km²</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Harmonic Tension Index */}
            <div>
              <div className="flex justify-between text-slate-300 text-xs mb-1">
                <span>INFRASONIC HARMONIC TENSION:</span>
                <span className="text-rose-400 font-bold font-mono">{harmonicTension}% (Carrier Stress)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={harmonicTension}
                onChange={(e) => setHarmonicTension(Number(e.target.value))}
                className="w-full accent-rose-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Transit Network Capacity */}
            <div>
              <div className="flex justify-between text-slate-300 text-xs mb-1">
                <span>MUNICIPAL TRANSIT CAPACITY:</span>
                <span className="text-emerald-400 font-bold font-mono">{transitCapacity}% Operational</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={transitCapacity}
                onChange={(e) => setTransitCapacity(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Results Output Box */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[#070b13] border border-[#182335] rounded-lg">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">ESTIMATED TRANSIT EVACUATION TIME:</span>
              <span className="text-xl font-bold text-white font-mono">{throughputHours} Hours</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">PANIC COLLAPSE PROBABILITY:</span>
              <span
                className={`text-xl font-bold font-mono ${
                  evacuationFailureProb > 65
                    ? 'text-rose-400 animate-pulse'
                    : evacuationFailureProb > 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {evacuationFailureProb}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: Redaction Reconstruction Utility */}
      {activeTool === 'recon' && (
        <div className="max-w-3xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-[#182335] pb-3">
            <span className="text-[10px] text-rose-400 font-bold uppercase">TOOL 02 // AIRS DE-SCRAMBLER</span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Project Palimpsest Text De-Obfuscation Utility
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Click individual redaction tokens to execute cryptographic character reconstruction against the Postojna Caverns master hash tree.
            </p>
          </div>

          <div className="space-y-4">
            {scrambledSentences.map((s, idx) => {
              const isRevealed = reconstructedIdx.includes(idx);
              return (
                <div
                  key={idx}
                  className="p-4 bg-[#070b13] border border-[#182335] rounded space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">CORRUPTED SEGMENT 0{idx + 1}:</span>
                    <button
                      onClick={() => handleDeobfuscate(idx)}
                      className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                        isRevealed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                      }`}
                    >
                      {isRevealed ? 'RECONSTRUCTED' : 'DE-SCRAMBLE'}
                    </button>
                  </div>
                  <p
                    className={`font-mono text-xs leading-relaxed p-2.5 rounded border transition-all ${
                      isRevealed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-[#04060a] border-slate-800 text-slate-500'
                    }`}
                  >
                    {isRevealed ? s.clear : s.scrambled}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tool 3: Behavioral Sync Tracker */}
      {activeTool === 'meter' && (
        <div className="max-w-3xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-[#182335] pb-3">
            <span className="text-[10px] text-amber-400 font-bold uppercase">TOOL 03 // BECM DIAGNOSTIC</span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Employee Cognitive Stability & Bio-Harmonic Sync Diagnostic
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Mandatory self-assessment required for Level 3+ clearance renewal. Measures personal auditory pareidolia, temporal orientation, and organizational loyalty.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '1. Do you ever hear rhythmic spoken words or choral harmonies inside the building HVAC ducts?',
                opts: ['Never (0 pts)', 'Occasionally during evening shifts (2 pts)', 'Frequently in quiet rooms (3 pts)']
              },
              {
                q: '2. Have you experienced waking dreams featuring geometric black monoliths rising from ice?',
                opts: ['Never (0 pts)', 'Once or twice after field rotation (2 pts)', 'Regularly every Friday (3 pts)']
              },
              {
                q: '3. What is your emotional response when hearing a sudden 14.8Hz sub-audible tone?',
                opts: ['Immediate calm and compliance (3 pts)', 'Mild curiosity (1 pt)', 'Acute panic and headache (0 pts)']
              },
              {
                q: '4. Would you report an immediate colleague if you observed them copying unencrypted files?',
                opts: ['Instantly without hesitation (3 pts)', 'Depends on the colleague (1 pt)', 'No (0 pts)']
              }
            ].map((item, qIdx) => (
              <div key={qIdx} className="p-3.5 bg-[#070b13] border border-[#182335] rounded space-y-2">
                <span className="font-bold text-slate-200 text-xs">{item.q}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {item.opts.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        gpcAudio.playUiSound('click');
                        setQAnswers({ ...qAnswers, [qIdx]: optIdx + 1 });
                      }}
                      className={`p-2 rounded text-[10px] border cursor-pointer text-left transition-colors ${
                        qAnswers[qIdx] === optIdx + 1
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-[#05070d] border-[#151c2a] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleScoreDiagnostic}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs"
              >
                CALCULATE HARMONIC SYNC INDEX
              </button>

              {syncScore !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">SYNCHRONIZATION SCORE:</span>
                  <span
                    className={`text-base font-bold font-mono px-3 py-1 rounded border ${
                      syncScore >= 75
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                    }`}
                  >
                    {syncScore}% ({syncScore >= 75 ? 'COMPLIANT' : 'REMEDIATION REQUIRED'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: Subterranean Seismic Telemetry Live Feed */}
      {activeTool === 'stream' && (
        <div className="max-w-3xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#182335] pb-3">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase">TOOL 04 // ASIAN TELEMETRY BUFFER</span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Real-Time Lithospheric Seismic & Acoustic Packet Buffer
              </h2>
            </div>
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer ${
                isLiveActive ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isLiveActive ? 'PAUSE FEED' : 'RESUME FEED'}
            </button>
          </div>

          <div className="bg-[#04060a] p-4 rounded border border-[#141d2e] font-mono text-[11px] space-y-1.5 text-slate-300 max-h-72 overflow-y-auto">
            {streamPackets.map((pkt, idx) => (
              <div key={idx} className={idx === 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                {pkt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
