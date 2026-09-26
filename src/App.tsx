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
import { HelpCircle, Play, Pause, Square, Radio, ShieldAlert } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [clearance, setClearance] = useState<ClearanceLevel>('Level 2 - Confidential');
  const [isUnredacted, setIsUnredacted] = useState<boolean>(false);
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
        setIsUnredacted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootDone, isSearchOpen, isTerminalOpen, isSecretSafeOpen]);

  return (
    <div
      className={`flex flex-col w-screen h-screen bg-[#05070c] text-slate-200 overflow-hidden font-mono select-none ${
        isCrtEnabled ? 'crt-scanlines' : ''
      }`}
    >
      {/* Cold Boot Terminal — ARG boot / loading sequence */}
      {!bootDone && (
        <BootSequence
          onComplete={(callsign, executiveOverride) => {
            setOperatorCallsign(callsign || 'GUEST_INVESTIGATOR');
            if (executiveOverride) {
              setClearance('Level 5 - Black Dossier');
              setIsUnredacted(true);
            }
            setBootDone(true);
            gpcAudio.playUiSound('grant');
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
        onToggleUnredacted={() => setIsUnredacted(!isUnredacted)}
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
        onToggleUnredacted={() => setIsUnredacted(!isUnredacted)}
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
        onToggleUnredacted={() => setIsUnredacted(!isUnredacted)}
        documents={DOCUMENTS}
        onSelectDocument={(doc) => setSelectedDoc(doc)}
      />

      <SecretBypassModal
        isOpen={isSecretSafeOpen}
        onClose={() => setIsSecretSafeOpen(false)}
        onSetClearance={(lvl) => setClearance(lvl)}
        onEnableUnredacted={() => setIsUnredacted(true)}
      />

      <ClearanceModal
        isOpen={isClearanceModalOpen}
        onClose={() => setIsClearanceModalOpen(false)}
        currentClearance={clearance}
        onSetClearance={(lvl) => setClearance(lvl)}
        onEnableUnredacted={() => setIsUnredacted(true)}
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
                <span>GLOBAL PARADIGMS CORP. // ARCHIVE INVESTIGATION GUIDE</span>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[11px] leading-relaxed text-slate-300">
              <p>
                Welcome to the complete interactive web archive of <strong className="text-white">Global Paradigms Corporation (GPC)</strong>, an international strategic-forecasting, civic-continuity, and environmental-psychoacoustics consultancy operating from 1971 to 2026.
              </p>
              <div className="p-3 bg-[#070b13] border border-[#182335] rounded space-y-1.5 text-[10px]">
                <strong className="text-cyan-300 block">KEY FEATURES & ARG INVESTIGATION SECRETS:</strong>
                <div>• <span className="text-white font-bold">Cold Boot Terminal:</span> Every reload starts inside a live BIOS-style boot. Type hidden <span className="text-cyan-300 font-mono">Channel 9</span> commands while it runs (<span className="text-cyan-300 font-mono">help</span>, <span className="text-cyan-300 font-mono">vesper</span>, <span className="text-cyan-300 font-mono">thorne</span>, <span className="text-cyan-300 font-mono">skip</span>, <span className="text-amber-400 font-mono">432-88</span>) — executive codes grant Level 5 on session init. <kbd className="px-1 py-0.5 bg-slate-800 rounded">ESC</kbd> fast-forwards.</div>
                <div>• <span className="text-white font-bold">165 Unique Records:</span> Dossiers, meeting minutes, technical schematics, incident logs, and leaked memos.</div>
                <div>• <span className="text-white font-bold">Redaction De-Scrambler:</span> Toggle the top bar eye button to decrypt and reveal hidden cleartext across all files.</div>
                <div>• <span className="text-white font-bold">Command Terminal Backdoor:</span> Click <span className="text-cyan-400 font-mono">GPC://CLI</span> or press <kbd className="px-1 py-0.5 bg-slate-800 rounded">~</kbd> to access command line tools (<span className="text-cyan-300 font-mono">scan</span>, <span className="text-cyan-300 font-mono">leak-dump</span>, <span className="text-cyan-300 font-mono">override 432-88</span>).</div>
                <div>• <span className="text-white font-bold">Audio Lab & DSP Synthesizer:</span> Play real procedural Web Audio captures of the 14.8Hz planetary carrier, Project Vesper chimes, and deep trench pulses.</div>
                <div>• <span className="text-white font-bold">Whistleblower Safe:</span> Open the key icon in the top header and enter the 4-digit code (<span className="text-amber-400 font-mono">1480</span>, <span className="text-amber-400 font-mono">1989</span>, or <span className="text-amber-400 font-mono">0432</span>) to elevate clearance to Level 5.</div>
                <div>• <span className="text-white font-bold">Employee Modules & Careers:</span> Take interactive compliance quizzes with printable certificates or submit job applications.</div>
              </div>
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
