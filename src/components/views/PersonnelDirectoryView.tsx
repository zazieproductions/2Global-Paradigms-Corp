import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Shield,
  Building2,
  MapPin,
  Mail,
  FileText,
  UserCheck,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Personnel, DocumentRecord } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface PersonnelDirectoryViewProps {
  personnel: Personnel[];
  documents: DocumentRecord[];
  onSelectDocument: (doc: DocumentRecord) => void;
}

export const PersonnelDirectoryView: React.FC<PersonnelDirectoryViewProps> = ({
  personnel,
  documents,
  onSelectDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);

  const departments = useMemo(() => {
    const depts = new Set(personnel.map((p) => p.departmentName));
    return ['all', ...Array.from(depts)];
  }, [personnel]);

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
  }, [personnel, selectedDept, selectedStatus, searchQuery]);

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

  const getClearanceBadge = (clr: Personnel['clearance']) => {
    if (clr.includes('Level 5')) return 'text-rose-400 font-bold';
    if (clr.includes('Level 4')) return 'text-amber-400 font-bold';
    if (clr.includes('Level 3')) return 'text-cyan-400';
    if (clr.includes('Level 2')) return 'text-blue-400';
    return 'text-slate-400';
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              PERSONNEL ROSTER & BIOMETRIC DIRECTORY
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            45 Active, Quarantined & Disavowed Officers // Global Paradigms Corp.
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-[#0d131f] border border-[#1f2c42] rounded text-slate-300 font-bold self-start md:self-auto">
          {filteredPersonnel.length} / {personnel.length} PROFILES
        </span>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-[#0a0e18] border border-[#1b263b] rounded-lg">
        <div className="relative flex items-center bg-[#06080e] border border-[#1b2538] rounded px-2.5 py-1.5 focus-within:border-cyan-500">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, employee ID, title..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-[#06080e] border border-[#1b2538] text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Departments (10)</option>
          {departments.filter((d) => d !== 'all').map((d) => (
            <option key={d} value={d}>
              {d.length > 28 ? `${d.slice(0, 26)}...` : d}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#06080e] border border-[#1b2538] text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
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
          <div
            key={person.id}
            onClick={() => {
              gpcAudio.playUiSound('click');
              setSelectedPerson(person);
            }}
            className="p-4 rounded-lg bg-[#0a0e18] hover:bg-[#0e1627] border border-[#1b263b] hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#182335] pb-2">
                <span className="font-bold text-cyan-300 font-mono text-[11px]">{person.employeeId}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border ${getStatusBadge(person.status)}`}>
                  {person.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-start gap-3">
                {/* Seed Avatar */}
                <div className="w-10 h-10 rounded bg-gradient-to-br from-[#121b2d] to-[#0a0f19] border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm shrink-0">
                  {person.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors text-xs truncate">
                    {person.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {person.title}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">
                    {person.departmentName}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {person.biography}
              </p>
            </div>

            <div className="pt-2 border-t border-[#151f30] flex items-center justify-between text-[10px]">
              <span className={getClearanceBadge(person.clearance)}>
                {person.clearance.split(' - ')[0]}
              </span>
              <span className="text-emerald-400 font-bold group-hover:underline">VIEW PROFILE →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Personnel Dossier Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none font-mono text-xs">
          <div className="bg-[#0b0f19] border border-emerald-500/40 rounded-lg max-w-2xl w-full p-6 shadow-[0_0_60px_rgba(16,185,129,0.2)] flex flex-col space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#1c273c] pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Users className="w-4 h-4" />
                <span>OFFICER DOSSIER: {selectedPerson.employeeId}</span>
              </div>
              <button
                onClick={() => setSelectedPerson(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded bg-gradient-to-br from-emerald-950 to-[#070b13] border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-lg shrink-0">
                {selectedPerson.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white">{selectedPerson.name}</h2>
                <p className="text-xs text-emerald-400">{selectedPerson.title}</p>
                <p className="text-[10px] text-slate-400">{selectedPerson.departmentName}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px]">
                  <span className={`px-1.5 py-0.2 rounded border ${getStatusBadge(selectedPerson.status)}`}>
                    {selectedPerson.status.toUpperCase()}
                  </span>
                  <span className="text-amber-400 font-bold">{selectedPerson.clearance}</span>
                </div>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-2 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
              <div>
                <span className="text-slate-500 block">ASSIGNED STATION:</span>
                <span className="text-slate-200">{selectedPerson.stationName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">HIRE DATE:</span>
                <span className="text-slate-200">{selectedPerson.hireDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">INTERNAL EMAIL:</span>
                <span className="text-cyan-300">{selectedPerson.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">VOICE EXTENSION:</span>
                <span className="text-slate-200">{selectedPerson.phoneExtension}</span>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">CAREER BIOGRAPHY:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070b13] p-3 rounded border border-[#182335]">
                {selectedPerson.biography}
              </p>
            </div>

            {/* Classified Security Notes */}
            <div className="space-y-1">
              <span className="text-[10px] text-rose-400 font-bold block">
                CLASSIFIED SECURITY AUDIT & BEHAVIORAL NOTES:
              </span>
              <p className="text-[11px] text-rose-200 leading-relaxed bg-rose-950/20 p-3 rounded border border-rose-600/40 font-mono">
                {selectedPerson.classifiedNotes}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
