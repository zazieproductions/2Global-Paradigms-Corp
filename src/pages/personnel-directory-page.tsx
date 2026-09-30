import { useState, useMemo } from 'react';
import { Users, Search, FileText } from 'lucide-react';
import type { Personnel } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { PERSONNEL } from '@/content';
import { linkedDocumentsFor } from '@/lib/archive/records';
import { ghostForCode, isGhostCode } from '@/lib/puzzles/salvage';
import { useArchiveUi } from '@/app/archive-ui-context';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { Modal } from '@/components/ui/modal';
import { SystemNotice } from '@/components/ui/system-notice';

const personnel = PERSONNEL;

const getClearanceBadge = (clr: Personnel['clearance']) => {
  if (clr.includes('Level 5')) return 'text-rose-400 font-bold';
  if (clr.includes('Level 4')) return 'text-amber-400 font-bold';
  if (clr.includes('Level 3')) return 'text-cyan-400';
  if (clr.includes('Level 2')) return 'text-blue-400';
  return 'text-slate-400';
};

const getStatusBadge = (status: Personnel['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
    case 'Missing':
      return 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse font-bold';
    case 'Terminated':
      return 'bg-slate-900 text-slate-500 border-slate-700';
    case 'Quarantined':
      return 'bg-amber-950/80 text-amber-300 border-amber-600 font-bold';
    default:
      return 'bg-blue-950/80 text-blue-300 border-blue-700';
  }
};

export default function PersonnelDirectoryPage() {
  const { openDocument, openDialog } = useArchiveUi();
  const recordId = useRecordParam();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(() =>
    pickRecord(personnel, recordId)
  );

  const departments = useMemo(() => {
    const depts = new Set(personnel.map((p) => p.departmentName));
    return ['all', ...Array.from(depts)];
  }, []);

  const filteredPersonnel = useMemo(() => {
    return personnel.filter((p) => {
      if (selectedDept !== 'all' && p.departmentName !== selectedDept) return false;
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.employeeId.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.biography.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedDept, selectedStatus, searchQuery]);

  return (
    <ArchivePage>
      <ViewHeader
        icon={Users}
        iconClassName="text-emerald-400"
        title="PERSONNEL ROSTER & BIOMETRIC DIRECTORY"
        subtitle={`${personnel.length} Active, Quarantined & Disavowed Officers // Global Paradigms Corp.`}
        aside={
          <span className="text-label px-2.5 py-1 bg-raised border border-line-strong rounded text-slate-300 font-bold self-start md:self-auto">
            {filteredPersonnel.length} / {personnel.length} PROFILES
          </span>
        }
      />

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-panel border border-line-strong rounded-lg">
        <div className="relative flex items-center bg-canvas border border-line-strong rounded px-2.5 py-1.5 focus-within:border-cyan-500">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
          <input
            type="search"
            aria-label="Search personnel"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, employee ID, title..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter by department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-canvas border border-line-strong text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Departments ({departments.length - 1})</option>
          {departments
            .filter((d) => d !== 'all')
            .map((d) => (
              <option key={d} value={d}>
                {d.length > 28 ? `${d.slice(0, 26)}...` : d}
              </option>
            ))}
        </select>

        <select
          aria-label="Filter by status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-canvas border border-line-strong text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active Duty</option>
          <option value="Missing">Missing / Whistleblower</option>
          <option value="Quarantined">Bio-Harmonic Quarantine</option>
          <option value="Terminated">Disavowed / Terminated</option>
        </select>
      </div>

      {/* Personnel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPersonnel.map((person) => (
          <button
            type="button"
            aria-haspopup="dialog"
            key={person.id}
            onClick={() => {
              gpcAudio.playUiSound('click');
              setSelectedPerson(person);
            }}
            className="w-full text-left p-4 rounded-lg bg-panel hover:bg-hover border border-line-strong hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <span className="block space-y-2">
              <span className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-bold text-cyan-300 font-mono text-label">{person.employeeId}</span>
                <span className={`text-micro px-1.5 py-px rounded border ${getStatusBadge(person.status)}`}>
                  {person.status.toUpperCase()}
                </span>
              </span>

              <span className="flex items-start gap-3">
                {/* Seed Avatar */}
                <span className="w-10 h-10 rounded bg-gradient-to-br from-hover to-panel border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm shrink-0">
                  {person.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span className="block min-w-0">
                  <span className="block font-bold text-slate-100 group-hover:text-emerald-300 transition-colors text-xs truncate">
                    {person.name}
                  </span>
                  <span className="block text-caption text-slate-400 truncate mt-0.5">{person.title}</span>
                  <span className="block text-micro text-slate-500 truncate">{person.departmentName}</span>
                </span>
              </span>

              <span className="block text-caption text-slate-400 line-clamp-2 leading-relaxed">
                {person.biography}
              </span>
            </span>

            <span className="pt-2 border-t border-line-subtle flex items-center justify-between text-caption">
              <span className={getClearanceBadge(person.clearance)}>{person.clearance.split(' - ')[0]}</span>
              <span className="text-emerald-400 font-bold group-hover:underline">VIEW PROFILE →</span>
            </span>
          </button>
        ))}
      </div>

      {filteredPersonnel.length === 0 && (
        <SystemNotice kind="empty" title="No officers match this query">
          The roster returned zero profiles for these filters. Personnel purged under Directive 17 are not
          indexed.
        </SystemNotice>
      )}

      {/* Personnel Dossier Modal */}
      <Modal
        open={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        title={selectedPerson ? `OFFICER DOSSIER: ${selectedPerson.employeeId}` : ''}
        icon={Users}
        tone="success"
        size="2xl"
        footer={
          <button
            type="button"
            onClick={() => setSelectedPerson(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
          >
            Close Dossier
          </button>
        }
      >
        {selectedPerson && (
          <PersonnelDossier
            person={selectedPerson}
            onOpenDocument={openDocument}
            onOpenSalvage={(code) => {
              const ghost = ghostForCode(code);
              if (ghost) openDialog({ type: 'tape-spool', ghostId: ghost.id });
            }}
          />
        )}
      </Modal>
    </ArchivePage>
  );
}

/** Body of the officer dossier dialog, including linked records. */
function PersonnelDossier({
  person,
  onOpenDocument,
  onOpenSalvage
}: {
  person: Personnel;
  onOpenDocument: (id: string) => void;
  /** Open the tape spool on a cited file that Directive 17 struck. */
  onOpenSalvage: (code: string) => void;
}) {
  const { found, missing } = linkedDocumentsFor(person);
  const ghostLinks = missing.filter((c) => isGhostCode(c));
  const unexplained = missing.filter((c) => !isGhostCode(c));
  return (
    <div className="space-y-4 text-slate-200">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded bg-gradient-to-br from-emerald-950 to-inset border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-lg shrink-0">
          {person.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">{person.name}</h2>
          <p className="text-xs text-emerald-400">{person.title}</p>
          <p className="text-caption text-slate-400">{person.departmentName}</p>
          <div className="flex items-center gap-2 pt-1 text-caption">
            <span className={`px-1.5 py-px rounded border ${getStatusBadge(person.status)}`}>
              {person.status.toUpperCase()}
            </span>
            <span className="text-amber-400 font-bold">{person.clearance}</span>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-2 gap-2 bg-inset border border-line p-3 rounded text-caption">
        <div>
          <span className="text-slate-500 block">ASSIGNED STATION:</span>
          <span className="text-slate-200">{person.stationName}</span>
        </div>
        <div>
          <span className="text-slate-500 block">HIRE DATE:</span>
          <span className="text-slate-200">{person.hireDate}</span>
        </div>
        <div>
          <span className="text-slate-500 block">INTERNAL EMAIL:</span>
          <span className="text-cyan-300">{person.email}</span>
        </div>
        <div>
          <span className="text-slate-500 block">VOICE EXTENSION:</span>
          <span className="text-slate-200">{person.phoneExtension}</span>
        </div>
      </div>

      {/* Biography */}
      <div className="space-y-1">
        <span className="text-caption text-slate-400 font-bold block">CAREER BIOGRAPHY:</span>
        <p className="text-label text-slate-300 leading-relaxed bg-inset p-3 rounded border border-line">
          {person.biography}
        </p>
      </div>

      {/* Classified Security Notes */}
      <div className="space-y-1">
        <span className="text-caption text-rose-400 font-bold block">
          CLASSIFIED SECURITY AUDIT & BEHAVIORAL NOTES:
        </span>
        <p className="text-label text-rose-200 leading-relaxed bg-rose-950/20 p-3 rounded border border-rose-600/40 font-mono">
          {person.classifiedNotes}
        </p>
      </div>

      {/* Linked records */}
      <section className="space-y-1.5" aria-labelledby="dossier-linked">
        <h3 id="dossier-linked" className="text-caption text-cyan-400 font-bold">
          LINKED ARCHIVE RECORDS ({found.length}):
        </h3>
        {found.length > 0 ? (
          <ul className="space-y-1">
            {found.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => onOpenDocument(doc.id)}
                  className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 bg-inset border border-line hover:border-cyan-500/60 rounded text-caption"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden />
                  <span className="text-cyan-300 font-bold shrink-0">{doc.code}</span>
                  <span className="text-slate-300 truncate">{doc.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <SystemNotice kind="empty" compact title="No linked records recovered" />
        )}
        {ghostLinks.length > 0 && (
          <SystemNotice
            kind="denied"
            compact
            title={`${ghostLinks.length} referenced file(s) struck under Directive 17`}
            code="DIR-17"
          >
            <p className="mb-1.5">The live index refuses these citations. The tape remembers them.</p>
            <ul className="flex flex-wrap gap-1.5">
              {ghostLinks.map((code) => (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => onOpenSalvage(code)}
                    className="tap-target px-2 py-1 rounded border border-amber-600/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 text-caption cursor-pointer"
                  >
                    {code} — PURGED · REPLAY THE TAPE GHOST
                  </button>
                </li>
              ))}
            </ul>
          </SystemNotice>
        )}
        {unexplained.length > 0 && (
          <SystemNotice
            kind="missing"
            compact
            title={`${unexplained.length} referenced file(s) not in vault`}
          >
            {unexplained.join(', ')}
          </SystemNotice>
        )}
      </section>
    </div>
  );
}
