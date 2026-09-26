import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { TerminalModal } from './components/TerminalModal';
import { SecretBypassModal } from './components/SecretBypassModal';
import { ClearanceModal } from './components/ClearanceModal';
import { TrainingModuleModal } from './components/TrainingModuleModal';
import { ApplicationModal } from './components/ApplicationModal';
import { DeadLinkViewerModal } from './components/DeadLinkViewerModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { BootSequence } from './components/BootSequence';
import { PuzzleModal } from './components/arg/PuzzleModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { DocumentsView } from './components/views/DocumentsView';
import { PersonnelDirectoryView } from './components/views/PersonnelDirectoryView';
import { StationsMapView } from './components/views/StationsMapView';
import { ProgramsView } from './components/views/ProgramsView';
import { DepartmentsView } from './components/views/DepartmentsView';
import { ProductsArchiveView } from './components/views/ProductsArchiveView';
import { AudioLabView } from './components/views/AudioLabView';
import { AnnualReportsView } from './components/views/AnnualReportsView';
import { CommunicationsView } from './components/views/CommunicationsView';
import { TimelineView } from './components/views/TimelineView';
import { NewslettersView } from './components/views/NewslettersView';
import { TrainingView } from './components/views/TrainingView';
import { CareersView } from './components/views/CareersView';
import { CompanyValuesView } from './components/views/CompanyValuesView';
import { ToolsLabView } from './components/views/ToolsLabView';
import { DeadLinksView } from './components/views/DeadLinksView';
import { SanctumView } from './components/views/SanctumView';

// Ordo Vocis Profundae — ARG layer
import { useArg } from './arg/ArgContext';
import { clearanceRank } from './arg/levels';
import { HiddenSigilLayer, RevelationToasts } from './arg/HiddenSigils';
import { PrologueModal } from './arg/PrologueModal';
import { FinaleOverlay } from './arg/FinaleOverlay';
import { OrderSigil, SigilWatermark } from './arg/sigils';

// Data
import { DOCUMENTS } from './data/documents';
import { PERSONNEL } from './data/personnel';
import { REGIONAL_STATIONS } from './data/stations';
import { INTERNAL_PROGRAMS } from './data/programs';
import { DEPARTMENTS } from './data/departments';
import { DISCONTINUED_PRODUCTS } from './data/discontinuedProducts';
import { AUDIO_ARTIFACTS } from './data/audioArtifacts';
import { ANNUAL_REPORTS } from './data/annualReports';
import { EMAIL_THREADS } from './data/emails';
import { MEETING_RECORDS } from './data/meetings';
import { PRESS_RELEASES } from './data/pressReleases';
import { TIMELINE_ENTRIES } from './data/timeline';
import { NEWSLETTERS } from './data/newsletters';
import { TRAINING_MODULES } from './data/trainingModules';
import { JOB_POSTINGS } from './data/jobPostings';
import { DEAD_LINKS } from './data/deadLinks';

import {
  ActiveTab,
  ClearanceLevel,
  DocumentRecord,
  TrainingModule,
  JobPosting,
  DeadLink
} from './types';
import { gpcAudio } from './lib/audioEngine';
import { HelpCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const arg = useArg();
  // A manually lowered clearance is remembered only for the degree it was chosen at;
  // when a seal raises the earned level, the operator is elevated automatically.
  const [clearanceChoice, setClearanceChoice] = useState<{ level: ClearanceLevel; at: number } | null>(null);
  const clearance: ClearanceLevel =
    clearanceChoice && clearanceChoice.at === arg.earnedLevel ? clearanceChoice.level : arg.maxClearance;
  const [unredactedWanted, setIsUnredactedRaw] = useState<boolean>(false);
  const isUnredacted = unredactedWanted && arg.descramblerUnlocked;

  // Clearance is EARNED by breaking seals — it can be lowered, never raised past the earned degree.
  const setClearance = (lvl: ClearanceLevel) => {
    if (clearanceRank(lvl) > arg.earnedLevel) {
      gpcAudio.playUiSound('deny');
      arg.notify('CLEARANCE NOT EARNED', `Your degree is Level ${arg.earnedLevel}. Break the next seal to rise further.`, '🔒\uFE0E', '#f43f5e');
      return;
    }
    setClearanceChoice({ level: lvl, at: arg.earnedLevel });
  };

  // The Redaction De-Scrambler only works from Level 3 (Seal II).
  const setIsUnredacted = (v: boolean | ((p: boolean) => boolean)) => {
    const next = typeof v === 'function' ? v(isUnredacted) : v;
    if (next && !arg.descramblerUnlocked) {
      gpcAudio.playUiSound('deny');
      arg.notify('DE-SCRAMBLER LOCKED', 'Palimpsest\'s cover can only be lifted from Level 3. Break Seal II — The Wheel of Days.', '♃', '#60a5fa');
      return;
    }
    setIsUnredactedRaw(next);
  };

  const [showPrologue, setShowPrologue] = useState<boolean>(false);

  const openDocByCode = (code: string) => {
    const doc = DOCUMENTS.find((d) => d.code === code);
    if (doc) setSelectedDoc(doc);
  };
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Cold boot terminal (ARG boot sequence)
  const [bootDone, setBootDone] = useState<boolean>(false);
  const [operatorCallsign, setOperatorCallsign] = useState<string>('GUEST_INVESTIGATOR');

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [selectedTrainingModule, setSelectedTrainingModule] = useState<TrainingModule | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedDeadLink, setSelectedDeadLink] = useState<DeadLink | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isSecretSafeOpen, setIsSecretSafeOpen] = useState<boolean>(false);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isPuzzleOpen, setIsPuzzleOpen] = useState<boolean>(false);

  // Audio engine state
  const [audioState, setAudioState] = useState<{
    isArtifactPlaying: boolean;
    isSynthActive: boolean;
    currentArtifactId: string | null;
  }>({
    isArtifactPlaying: false,
    isSynthActive: false,
    currentArtifactId: null
  });

  const handleStopAllAudio = () => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
    setAudioState({ isArtifactPlaying: false, isSynthActive: false, currentArtifactId: null });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bootDone) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isSearchOpen || isTerminalOpen || isSecretSafeOpen) {
        // If modals are open, only handle Escape and modal-specific shortcuts
        if (e.key === 'Escape') {
          if (isSearchOpen) { setIsSearchOpen(false); return; }
          if (isTerminalOpen) { setIsTerminalOpen(false); return; }
          if (isSecretSafeOpen) { setIsSecretSafeOpen(false); return; }
        }
        return;
      }

      if (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        gpcAudio.playUiSound('click');
        setIsSearchOpen(true);
      } else if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        gpcAudio.playUiSound('scan');
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        gpcAudio.playUiSound('unredact');
        setIsUnredacted((prev: boolean) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootDone, isSearchOpen, isTerminalOpen, isSecretSafeOpen, isUnredacted, arg.descramblerUnlocked]);

  return (
    <div
      className={`flex flex-col w-screen h-screen bg-[#05070c] text-slate-200 overflow-hidden font-mono select-none ${
        isCrtEnabled ? 'crt-scanlines' : ''
      }`}
    >
      {/* Cold Boot Terminal — ARG boot / loading sequence */}
      {!bootDone && (
        <BootSequence
          onComplete={(callsign) => {
            setOperatorCallsign(callsign || 'GUEST_INVESTIGATOR');
            setBootDone(true);
            gpcAudio.playUiSound('grant');
            if (!arg.prologueSeen) setTimeout(() => setShowPrologue(true), 700);
          }}
        />
      )}

      {/* Top Application Bar */}
      <TopHeader
        clearance={clearance}
        callsign={operatorCallsign}
        onOpenClearanceModal={() => setIsClearanceModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        isUnredacted={isUnredacted}
        onToggleUnredacted={() => setIsUnredacted((p) => !p)}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={() => setIsCrtEnabled(!isCrtEnabled)}
        isSoundMuted={isSoundMuted}
        onToggleSound={() => {
          const next = !isSoundMuted;
          setIsSoundMuted(next);
          gpcAudio.toggleSound(!next);
        }}
        onOpenSecretSafe={() => setIsSecretSafeOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenPuzzle={() => setIsPuzzleOpen(true)}
      />

      {/* Main Content Workspace Split */}
      <div className="flex flex-1 w-full min-h-0 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(t) => setActiveTab(t)}
          documentCount={DOCUMENTS.length}
          personnelCount={PERSONNEL.length}
          stationCount={REGIONAL_STATIONS.length}
          programCount={INTERNAL_PROGRAMS.length}
          productCount={DISCONTINUED_PRODUCTS.length}
          audioCount={AUDIO_ARTIFACTS.length}
          reportCount={ANNUAL_REPORTS.length}
          jobCount={JOB_POSTINGS.length}
          clearance={clearance}
          isOpen={true}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 flex flex-col min-w-0 h-full bg-[#06080e] overflow-hidden relative">
          {/* The Order's sigil — grows more visible the deeper you go */}
          <div className="pointer-events-none absolute inset-0 z-20 mix-blend-screen">
            <SigilWatermark intensity={arg.finaleComplete ? 0.01 : 0.012 + arg.solved.length * 0.006} />
          </div>
          {/* Choir Script fragment hidden on this page (Seal III) */}
          <HiddenSigilLayer activeTab={activeTab} />

          {activeTab === 'sanctum' && (
            <SanctumView
              onNavigateTab={(t) => setActiveTab(t)}
              onOpenDocCode={openDocByCode}
              onOpenSafe={() => setIsSecretSafeOpen(true)}
              isUnredacted={isUnredacted}
              onToggleUnredacted={() => setIsUnredacted((p) => !p)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              documents={DOCUMENTS}
              personnel={PERSONNEL}
              stations={REGIONAL_STATIONS}
              programs={INTERNAL_PROGRAMS}
              clearance={clearance}
              isUnredacted={isUnredacted}
              onSelectDocument={(doc) => setSelectedDoc(doc)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onOpenSecretSafe={() => setIsSecretSafeOpen(true)}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              documents={DOCUMENTS}
              onSelectDocument={(doc) => setSelectedDoc(doc)}
              isUnredacted={isUnredacted}
              clearance={clearance}
            />
          )}

          {activeTab === 'personnel' && (
            <PersonnelDirectoryView
              personnel={PERSONNEL}
              documents={DOCUMENTS}
              onSelectDocument={(doc) => setSelectedDoc(doc)}
            />
          )}

          {activeTab === 'stations' && (
            <StationsMapView stations={REGIONAL_STATIONS} />
          )}

          {activeTab === 'programs' && (
            <ProgramsView programs={INTERNAL_PROGRAMS} />
          )}

          {activeTab === 'departments' && (
            <DepartmentsView departments={DEPARTMENTS} />
          )}

          {activeTab === 'products' && (
            <ProductsArchiveView products={DISCONTINUED_PRODUCTS} />
          )}

          {activeTab === 'audio' && (
            <AudioLabView
              artifacts={AUDIO_ARTIFACTS}
              onAudioStatusChange={(s) => setAudioState(s)}
            />
          )}

          {activeTab === 'reports' && (
            <AnnualReportsView reports={ANNUAL_REPORTS} />
          )}

          {activeTab === 'communications' && (
            <CommunicationsView
              emails={EMAIL_THREADS}
              meetings={MEETING_RECORDS}
              pressReleases={PRESS_RELEASES}
              isUnredacted={isUnredacted}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView timeline={TIMELINE_ENTRIES} />
          )}

          {activeTab === 'newsletters' && (
            <NewslettersView newsletters={NEWSLETTERS} />
          )}

          {activeTab === 'training' && (
            <TrainingView
              modules={TRAINING_MODULES}
              onOpenModule={(m) => setSelectedTrainingModule(m)}
            />
          )}

          {activeTab === 'careers' && (
            <CareersView
              jobPostings={JOB_POSTINGS}
              onOpenApplyModal={(j) => setSelectedJob(j)}
            />
          )}

          {activeTab === 'values' && <CompanyValuesView />}

          {activeTab === 'tools' && <ToolsLabView />}

          {activeTab === 'deadlinks' && (
            <DeadLinksView
              deadLinks={DEAD_LINKS}
              onOpenDeadLinkModal={(link) => setSelectedDeadLink(link)}
            />
          )}
        </main>
      </div>

      {/* Persistent Bottom Audio Player */}
      <AudioPlayerBar
        isArtifactPlaying={audioState.isArtifactPlaying}
        isSynthActive={audioState.isSynthActive}
        currentArtifactId={audioState.currentArtifactId}
        artifacts={AUDIO_ARTIFACTS}
        onStopAll={handleStopAllAudio}
      />

      {/* MODALS */}
      <DocumentViewerModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        isGlobalUnredacted={isUnredacted}
        onToggleUnredacted={() => setIsUnredacted((p) => !p)}
        clearance={clearance}
        onOpenSanctum={() => {
          setSelectedDoc(null);
          setActiveTab('sanctum');
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={DOCUMENTS}
        personnel={PERSONNEL}
        stations={REGIONAL_STATIONS}
        programs={INTERNAL_PROGRAMS}
        products={DISCONTINUED_PRODUCTS}
        emails={EMAIL_THREADS}
        meetings={MEETING_RECORDS}
        pressReleases={PRESS_RELEASES}
        timeline={TIMELINE_ENTRIES}
        audioArtifacts={AUDIO_ARTIFACTS}
        onSelectDocument={(doc) => setSelectedDoc(doc)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        operatorCallsign={operatorCallsign}
        clearance={clearance}
        onSetClearance={(lvl) => setClearance(lvl)}
        isUnredacted={isUnredacted}
        onToggleUnredacted={() => setIsUnredacted((p) => !p)}
        documents={DOCUMENTS}
        onSelectDocument={(doc) => setSelectedDoc(doc)}
      />

      {isPuzzleOpen && (
        <PuzzleModal
          onClose={() => setIsPuzzleOpen(false)}
          onComplete={() => {
            setActiveTab('sanctum');
            arg.addJournal(
              'Gateway Transmission solved: VESPAR · 987316 · COLD. The well is open — the Seven Seals await.',
              'system'
            );
            arg.notify(
              'GATEWAY TRANSMISSION COMPLETE',
              'Three keys kept: VESPAR · 987316 · COLD. The case file is open — begin with Saturn.',
              '✦',
              '#d946ef'
            );
            gpcAudio.playUiSound('grant');
          }}
        />
      )}

      <SecretBypassModal
        isOpen={isSecretSafeOpen}
        onClose={() => setIsSecretSafeOpen(false)}
        onEnableUnredacted={() => setIsUnredactedRaw(true)}
        onGoToSanctum={() => {
          setIsSecretSafeOpen(false);
          setActiveTab('sanctum');
        }}
      />

      {/* ORDO VOCIS PROFUNDAE overlays */}
      <RevelationToasts />
      {bootDone && showPrologue && (
        <PrologueModal
          callsign={operatorCallsign}
          onBegin={() => {
            arg.markPrologueSeen();
            setShowPrologue(false);
            setActiveTab('sanctum');
          }}
          onDismiss={() => {
            arg.markPrologueSeen();
            setShowPrologue(false);
          }}
        />
      )}
      {arg.finaleActive && (
        <FinaleOverlay
          callsign={operatorCallsign}
          onComplete={() => {
            arg.completeFinale();
            arg.setFinaleActive(false);
            setActiveTab('sanctum');
          }}
        />
      )}

      <ClearanceModal
        isOpen={isClearanceModalOpen}
        onClose={() => setIsClearanceModalOpen(false)}
        currentClearance={clearance}
        onSetClearance={(lvl) => setClearance(lvl)}
        onEnableUnredacted={() => setIsUnredacted(true)}
        onOpenSanctum={() => {
          setIsClearanceModalOpen(false);
          setActiveTab('sanctum');
        }}
      />

      <TrainingModuleModal
        module={selectedTrainingModule}
        onClose={() => setSelectedTrainingModule(null)}
      />

      <ApplicationModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      <DeadLinkViewerModal
        deadLink={selectedDeadLink}
        onClose={() => setSelectedDeadLink(null)}
      />

      {/* Help / Guide Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none font-mono text-xs">
          <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-lg max-w-2xl w-full p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#1c273c] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <HelpCircle className="w-5 h-5" />
                <span>ARCHIVE INVESTIGATION GUIDE // HOW TO PLAY</span>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed text-slate-300 max-h-[65vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="flex gap-4 items-start">
                <div className="text-fuchsia-300 shrink-0 hidden sm:block"><OrderSigil size={64} /></div>
                <p>
                  You have connected to the leaked internal archive of <strong className="text-white">Global Paradigms Corporation</strong> — a
                  "strategic forecasting & civic continuity" consultancy, 1971–2026. On the surface: a corporation. Underneath: the
                  <strong className="text-fuchsia-300"> Ordo Vocis Profundae</strong>, an occult order that has steered the company around a
                  mysterious 14.8 Hz signal under the Earth. A whistleblower, <strong className="text-white">Dr. Aris Thorne</strong>, has left you a trail.
                </p>
              </div>

              <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-900/50 rounded space-y-1.5 text-[10px]">
                <strong className="text-fuchsia-300 block tracking-wider">HOW TO PLAY — THE SEVEN SEALS</strong>
                <div>1. Open <span className="text-white font-bold">The Seven Seals</span> (top of the sidebar). Each seal is one puzzle, with a clear objective.</div>
                <div>2. Answers are hidden across this archive: documents, dossiers, stations, audio, emails, even the public "corporate" pages.</div>
                <div>3. Breaking seals raises your <span className="text-amber-300">clearance</span>. Records above your clearance show as <span className="text-rose-300">SEALED</span> until earned.</div>
                <div>4. Each seal gives a <span className="text-white font-bold">Seal-Word</span>. Keep them — together they spell the final answer.</div>
                <div>5. Stuck? Every seal has 3 escalating hints (the last one gives the answer). No penalty.</div>
                <div>6. Progress saves automatically in this browser. You can purge it from the case file.</div>
              </div>

              <div className="p-3 bg-[#070b13] border border-[#182335] rounded space-y-1.5 text-[10px]">
                <strong className="text-cyan-300 block tracking-wider">YOUR INSTRUMENTS</strong>
                <div>• <span className="text-white font-bold">Search</span> <kbd className="px-1 py-0.5 bg-slate-800 rounded">/</kbd> — full-text search across 174 records, personnel, stations, programs.</div>
                <div>• <span className="text-white font-bold">Terminal</span> <kbd className="px-1 py-0.5 bg-slate-800 rounded">~</kbd> — <span className="font-mono text-cyan-300">help</span>, <span className="font-mono text-cyan-300">cat</span>, <span className="font-mono text-cyan-300">seals</span>, <span className="font-mono text-cyan-300">gematria</span>, <span className="font-mono text-cyan-300">invoke</span>… and some commands it won't list.</div>
                <div>• <span className="text-white font-bold">Redaction De-Scrambler</span> <kbd className="px-1 py-0.5 bg-slate-800 rounded">U</kbd> — lifts Palimpsest's black bars. Unlocks at Level 3.</div>
                <div>• <span className="text-white font-bold">Audio Lab</span> — procedural Web Audio captures & a live synthesizer. Some answers are heard, not read.</div>
                <div>• <span className="text-white font-bold">Whistleblower Safe</span> (brass key, top bar) — Thorne's safe. You will learn the combination.</div>
                <div>• <span className="text-white font-bold">Cold Boot</span> — during the boot, you can type on Channel 9. Try <span className="font-mono text-cyan-300">help</span>. <kbd className="px-1 py-0.5 bg-slate-800 rounded">ESC</kbd> fast-forwards.</div>
                <div>• <span className="text-white font-bold">✦ Gateway Transmission</span> (top bar) — a guided beginner trail that opens the case: three easy keys (Vesper Sequence → The Signal → The Waveform) with "field notes" on every step. It cannot raise your clearance — only the seals can.</div>
              </div>
              <p className="text-[10px] text-slate-500 italic">Look closely at the public pages. The Order signs its work faintly.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors"
              >
                ENTER ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
