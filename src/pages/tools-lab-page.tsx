import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { gpcAudio } from '@/lib/audio/audio-engine';
import {
  RECON_SEGMENTS,
  SYNC_DIAGNOSTIC,
  SYNC_PASS_SCORE,
  TELEMETRY_STREAM_STATIONS,
  TOOLS_LAB_TOOLS,
  type ToolId
} from '@/content/tools/tools-lab';
import { TOOLS_LAB_COUNT } from '@/config/navigation';
import { useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

const TOOL_IDS = new Set<string>(TOOLS_LAB_TOOLS.map((t) => t.id));
const PACKET_TICK_MS = 1200;
const PACKET_BUFFER = 15;

export default function ToolsLabPage() {
  const recordId = useRecordParam();
  const [activeTool, setActiveTool] = useState<ToolId>(() =>
    recordId && TOOL_IDS.has(recordId) ? (recordId as ToolId) : 'calc'
  );

  // Tool 1: Civic Evacuation Calculator State
  const [density, setDensity] = useState(8500); // people/km2
  const [harmonicTension, setHarmonicTension] = useState(42); // %
  const [transitCapacity, setTransitCapacity] = useState(70); // %

  const evacuationFailureProb = Math.min(
    99.9,
    Math.max(
      2.1,
      Math.round(((density / 10000) * 35 + harmonicTension * 0.45 + (100 - transitCapacity) * 0.3) * 10) / 10
    )
  );
  const throughputHours = (density / (1200 * (transitCapacity / 100))).toFixed(1);

  // Tool 2: Redaction Reconstruction Utility State
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
    if (finalScore >= SYNC_PASS_SCORE) {
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
      const stations = TELEMETRY_STREAM_STATIONS;
      const st = stations[Math.floor(Math.random() * stations.length)];
      const hz = (14.802 + (Math.random() - 0.5) * 0.02).toFixed(3);
      const amp = (82 + Math.random() * 14).toFixed(1);
      const packet = `[${new Date().toISOString().split('T')[1].slice(0, 8)}] PKT: ${st} | FREQ: ${hz}Hz | AMPL: ${amp}dB | STATUS: 0xOK`;
      setStreamPackets((prev) => [packet, ...prev.slice(0, PACKET_BUFFER - 1)]);
    }, PACKET_TICK_MS);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  return (
    <ArchivePage>
      <ViewHeader
        icon={Wrench}
        iconClassName="text-emerald-400"
        title="SUB-AUDIBLE SOFTWARE TOOLS & INTRANET UTILITIES"
        subtitle={`${TOOLS_LAB_COUNT} Interactive Analytical Diagnostics, Calculators & Telemetry Decoders`}
        aside={
          <div className="flex items-center gap-1 bg-raised border border-line-strong rounded p-0.5 text-label overflow-x-auto">
            {TOOLS_LAB_TOOLS.map((t) => (
              <button
                type="button"
                key={t.id}
                aria-pressed={activeTool === t.id}
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
        }
      />

      {/* Tool 1: Civic Evacuation Probability Calculator */}
      {activeTool === 'calc' && (
        <div className="max-w-3xl mx-auto bg-panel border border-line-strong rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-line pb-3">
            <span className="text-caption text-cyan-400 font-bold uppercase">
              TOOL 01 // CCDR & SFPC MODEL
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Civic Evacuation Bottleneck & Panic Velocity Probability Calculator
            </h2>
            <p className="text-label text-slate-400 mt-1 leading-relaxed">
              Models transit throughput constraints and public panic likelihood under variable municipal
              population densities and sub-harmonic audio tension levels.
            </p>
          </div>

          <div className="space-y-4">
            {/* Population Density */}
            <div>
              <label htmlFor="tool-density" className="flex justify-between text-slate-300 text-xs mb-1">
                <span>POPULATION DENSITY:</span>
                <span className="text-cyan-300 font-bold font-mono">{density.toLocaleString()} / km²</span>
              </label>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                id="tool-density"
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Harmonic Tension Index */}
            <div>
              <label
                htmlFor="tool-harmonicTension"
                className="flex justify-between text-slate-300 text-xs mb-1"
              >
                <span>INFRASONIC HARMONIC TENSION:</span>
                <span className="text-rose-400 font-bold font-mono">{harmonicTension}% (Carrier Stress)</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                id="tool-harmonicTension"
                value={harmonicTension}
                onChange={(e) => setHarmonicTension(Number(e.target.value))}
                className="w-full accent-rose-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Transit Network Capacity */}
            <div>
              <label
                htmlFor="tool-transitCapacity"
                className="flex justify-between text-slate-300 text-xs mb-1"
              >
                <span>MUNICIPAL TRANSIT CAPACITY:</span>
                <span className="text-emerald-400 font-bold font-mono">{transitCapacity}% Operational</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                id="tool-transitCapacity"
                value={transitCapacity}
                onChange={(e) => setTransitCapacity(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Results Output Box */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-inset border border-line rounded-lg">
            <div className="space-y-1">
              <span className="text-caption text-slate-500 block">ESTIMATED TRANSIT EVACUATION TIME:</span>
              <span className="text-xl font-bold text-white font-mono">{throughputHours} Hours</span>
            </div>

            <div className="space-y-1">
              <span className="text-caption text-slate-500 block">PANIC COLLAPSE PROBABILITY:</span>
              <span
                className={`text-xl font-bold font-mono ${
                  evacuationFailureProb > 65
                    ? 'text-rose-400'
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
        <div className="max-w-3xl mx-auto bg-panel border border-line-strong rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-line pb-3">
            <span className="text-caption text-rose-400 font-bold uppercase">
              TOOL 02 // AIRS DE-SCRAMBLER
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Project Palimpsest Text De-Obfuscation Utility
            </h2>
            <p className="text-label text-slate-400 mt-1 leading-relaxed">
              Click individual redaction tokens to execute cryptographic character reconstruction against the
              Postojna Caverns master hash tree.
            </p>
          </div>

          <div className="space-y-4">
            {RECON_SEGMENTS.map((s, idx) => {
              const isRevealed = reconstructedIdx.includes(idx);
              return (
                <div key={s.clear} className="p-4 bg-inset border border-line rounded space-y-2">
                  <div className="flex items-center justify-between text-caption">
                    <span className="text-slate-500">CORRUPTED SEGMENT 0{idx + 1}:</span>
                    <button
                      type="button"
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
                        : 'bg-void border-slate-800 text-slate-500'
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
        <div className="max-w-3xl mx-auto bg-panel border border-line-strong rounded-lg p-6 space-y-6 shadow-xl">
          <div className="border-b border-line pb-3">
            <span className="text-caption text-amber-400 font-bold uppercase">
              TOOL 03 // BECM DIAGNOSTIC
            </span>
            <h2 className="text-sm font-bold text-white mt-0.5">
              Employee Cognitive Stability & Bio-Harmonic Sync Diagnostic
            </h2>
            <p className="text-label text-slate-400 mt-1 leading-relaxed">
              Mandatory self-assessment required for Level 3+ clearance renewal. Measures personal auditory
              pareidolia, temporal orientation, and organizational loyalty.
            </p>
          </div>

          <div className="space-y-4">
            {SYNC_DIAGNOSTIC.map((item, qIdx) => (
              <div
                key={item.q}
                role="group"
                aria-labelledby={`sync-q-${qIdx}`}
                className="p-3.5 bg-inset border border-line rounded space-y-2"
              >
                <span id={`sync-q-${qIdx}`} className="font-bold text-slate-200 text-xs">
                  {item.q}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {item.opts.map((opt, optIdx) => (
                    <button
                      type="button"
                      key={opt}
                      aria-pressed={qAnswers[qIdx] === optIdx + 1}
                      onClick={() => {
                        gpcAudio.playUiSound('click');
                        setQAnswers({ ...qAnswers, [qIdx]: optIdx + 1 });
                      }}
                      className={`p-2 rounded text-caption border cursor-pointer text-left transition-colors ${
                        qAnswers[qIdx] === optIdx + 1
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-canvas border-line-subtle text-slate-400 hover:text-slate-200'
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
                type="button"
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
                      syncScore >= SYNC_PASS_SCORE
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        : 'bg-rose-950 text-rose-300 border-rose-600'
                    }`}
                  >
                    {syncScore}% ({syncScore >= SYNC_PASS_SCORE ? 'COMPLIANT' : 'REMEDIATION REQUIRED'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tool 4: Subterranean Seismic Telemetry Live Feed */}
      {activeTool === 'stream' && (
        <div className="max-w-3xl mx-auto bg-panel border border-line-strong rounded-lg p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <span className="text-caption text-cyan-400 font-bold uppercase">
                TOOL 04 // ASIAN TELEMETRY BUFFER
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">
                Real-Time Lithospheric Seismic & Acoustic Packet Buffer
              </h2>
            </div>
            <button
              type="button"
              aria-pressed={!isLiveActive}
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer ${
                isLiveActive ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isLiveActive ? 'PAUSE FEED' : 'RESUME FEED'}
            </button>
          </div>

          <div
            className="bg-void p-4 rounded border border-line-subtle font-mono text-label space-y-1.5 text-slate-300 max-h-72 overflow-y-auto"
            role="log"
            aria-live="off"
            aria-label="Telemetry packet buffer"
            tabIndex={0}
          >
            {streamPackets.map((pkt, idx) => (
              <div key={pkt + idx} className={idx === 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                {pkt}
              </div>
            ))}
          </div>
        </div>
      )}
    </ArchivePage>
  );
}
