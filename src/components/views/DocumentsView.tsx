import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Tag,
  Calendar,
  Building2,
  User,
  LayoutGrid,
  List,
  AlertOctagon
} from 'lucide-react';
import { DocumentRecord, ClearanceLevel } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';
import { clearanceRank } from '../../arg/levels';
import { LEVEL_CORRESPONDENCE } from '../../arg/seals';
import { stripRedactions } from '../../arg/Redacted';

/** Sealed / Order markers shown beside each record. */
const SealMark: React.FC<{ doc: DocumentRecord; rank: number }> = ({ doc, rank }) => {
  const need = clearanceRank(doc.clearance);
  const isOrder = doc.tags?.includes('Order');
  return (
    <>
      {need > rank && (
        <span
          title={`Sealed — requires Level ${need} (${LEVEL_CORRESPONDENCE[need]?.planet}). Break more seals in THE SEVEN SEALS.`}
          className="inline-flex items-center gap-0.5 text-[9px] px-1.5 rounded border border-fuchsia-700/60 bg-fuchsia-950/40 text-fuchsia-300 font-bold w-fit"
        >
          🔒{'\uFE0E'} {LEVEL_CORRESPONDENCE[need]?.glyph}{'\uFE0E'} L{need}
        </span>
      )}
      {isOrder && (
        <span
          title="Ordo Vocis Profundae — inner-order material"
          className="text-[9px] px-1.5 rounded border border-amber-600/50 bg-amber-950/30 text-amber-300 font-bold w-fit"
        >
          ✶ ORDO
        </span>
      )}
    </>
  );
};

interface DocumentsViewProps {
  documents: DocumentRecord[];
  onSelectDocument: (doc: DocumentRecord) => void;
  isUnredacted: boolean;
  clearance: ClearanceLevel;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onSelectDocument,
  isUnredacted,
  clearance
}) => {
  const rank = clearanceRank(clearance);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClearance, setSelectedClearance] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'code'>('date-desc');

  const categories = useMemo(() => {
    const cats = new Set(documents.map((d) => d.category));
    return ['all', ...Array.from(cats)];
  }, [documents]);

  const departments = useMemo(() => {
    const depts = new Set(documents.map((d) => d.departmentName));
    return ['all', ...Array.from(depts)];
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (selectedClearance !== 'all' && !doc.clearance.includes(selectedClearance)) return false;
      if (selectedDept !== 'all' && doc.departmentName !== selectedDept) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          doc.title.toLowerCase().includes(q) ||
          doc.code.toLowerCase().includes(q) ||
          doc.author.toLowerCase().includes(q) ||
          doc.summary.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
      return a.code.localeCompare(b.code);
    });
  }, [documents, selectedCategory, selectedClearance, selectedDept, searchQuery, sortBy]);

  const getStampBadge = (stamp: DocumentRecord['classificationStamp']) => {
    switch (stamp) {
      case 'BLACK LEVEL // SANITIZED':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      case 'TOP SECRET // EYES ONLY':
        return 'bg-red-950/80 text-red-300 border-red-700';
      case 'SECRET // NOFORN':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'CONFIDENTIAL':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              MASTER CLASSIFIED DOCUMENT VAULT
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            174 Index Records // Postojna Caverns Repository Synchronized
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-[#0d131f] border border-[#1f2c42] rounded p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Dossier View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] px-2.5 py-1 bg-[#0d131f] border border-[#1f2c42] rounded text-slate-300 font-bold">
            {filteredDocs.length} / {documents.length} RECORDS
          </span>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 p-3 bg-[#0a0e18] border border-[#1b263b] rounded-lg">
        {/* Search Box */}
        <div className="relative flex items-center bg-[#06080e] border border-[#1b2538] rounded px-2.5 py-1.5 focus-within:border-cyan-500">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, codes, authors..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#06080e] border border-[#1b2538] text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Categories (10)</option>
          {categories.filter((c) => c !== 'all').map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Clearance Filter */}
        <select
          value={selectedClearance}
          onChange={(e) => setSelectedClearance(e.target.value)}
          className="bg-[#06080e] border border-[#1b2538] text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Clearance Levels</option>
          <option value="Level 1">Level 1 - General</option>
          <option value="Level 2">Level 2 - Confidential</option>
          <option value="Level 3">Level 3 - Secret</option>
          <option value="Level 4">Level 4 - Top Secret</option>
          <option value="Level 5">Level 5 - Black Dossier</option>
        </select>

        {/* Department Filter */}
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

        {/* Date Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-[#06080e] border border-[#1b2538] text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="date-desc">Sort: Date (Newest First)</option>
          <option value="date-asc">Sort: Date (Oldest First)</option>
          <option value="code">Sort: Document Code</option>
        </select>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-[#0a0e18] border border-[#1b263b] rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0d1424] border-b border-[#1c273c] text-slate-400 text-[10px] uppercase font-mono">
                  <th className="p-3">CODE / CLASSIFICATION</th>
                  <th className="p-3">DOCUMENT TITLE & CATEGORY</th>
                  <th className="p-3 hidden md:table-cell">DEPARTMENT</th>
                  <th className="p-3 hidden lg:table-cell">AUTHOR</th>
                  <th className="p-3">DATE</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151f30]">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      onSelectDocument(doc);
                    }}
                    className="hover:bg-[#0e1627] cursor-pointer transition-colors group"
                  >
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors font-mono">
                          {doc.code}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border w-fit font-bold ${getStampBadge(
                            doc.classificationStamp
                          )}`}
                        >
                          {doc.classificationStamp}
                        </span>
                        <SealMark doc={doc} rank={rank} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors text-[11px]">
                            {doc.title}
                          </span>
                          {doc.isWhistleblowerLeak && (
                            <span className="text-[8px] px-1 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                              LEAK
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[340px]">
                          {isUnredacted ? doc.summary : stripRedactions(doc.summary)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-slate-400 text-[11px] truncate max-w-[160px]">
                      {doc.departmentName}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-slate-400 text-[11px]">
                      {doc.author}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {doc.date}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gpcAudio.playUiSound('click');
                          onSelectDocument(doc);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-800 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Dossier View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                onSelectDocument(doc);
              }}
              className="p-4 rounded-lg bg-[#0a0e18] hover:bg-[#0e1627] border border-[#1b263b] hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#182335] pb-2">
                  <span className="font-bold text-cyan-300 font-mono text-xs">{doc.code}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${getStampBadge(
                      doc.classificationStamp
                    )}`}
                  >
                    {doc.classificationStamp}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  <SealMark doc={doc} rank={rank} />
                </div>
                <h3 className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-xs leading-snug">
                  {doc.title}
                </h3>

                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {isUnredacted ? doc.summary : stripRedactions(doc.summary)}
                </p>
              </div>

              <div className="pt-2 border-t border-[#151f30] flex items-center justify-between text-[10px] text-slate-500">
                <span>{doc.date}</span>
                <span className="text-cyan-400 font-bold group-hover:underline">OPEN DOSSIER →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
