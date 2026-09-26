import { useState, useMemo } from 'react';
import { FileText, Search, Eye, LayoutGrid, List } from 'lucide-react';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { DOCUMENTS } from '@/content';
import { useArchiveUi } from '@/app/archive-ui-context';
import { useProgression } from '@/hooks/use-progression';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { DocumentStamp } from '@/components/ui/document-stamp';
import { SystemNotice } from '@/components/ui/system-notice';

const documents = DOCUMENTS;
type SortKey = 'date-desc' | 'date-asc' | 'code';

const categories = ['all', ...new Set(documents.map((d) => d.category))];
const departments = ['all', ...new Set(documents.map((d) => d.departmentName))];

export default function DocumentsPage() {
  const { openDocument } = useArchiveUi();
  const { isDiscovered } = useProgression();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClearance, setSelectedClearance] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<SortKey>('date-desc');

  const filteredDocs = useMemo(() => {
    return documents
      .filter((doc) => {
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
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
        return a.code.localeCompare(b.code);
      });
  }, [selectedCategory, selectedClearance, selectedDept, searchQuery, sortBy]);

  return (
    <ArchivePage>
      <ViewHeader
        icon={FileText}
        iconClassName="text-cyan-400"
        title="MASTER CLASSIFIED DOCUMENT VAULT"
        subtitle={`${documents.length} Index Records // Postojna Caverns Repository Synchronized`}
        aside={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-raised border border-line-strong rounded p-0.5">
              <button
                type="button"
                aria-pressed={viewMode === 'table'}
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
                aria-label="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid Dossier View"
                aria-label="Grid dossier view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <span className="text-label px-2.5 py-1 bg-raised border border-line-strong rounded text-slate-300 font-bold">
              {filteredDocs.length} / {documents.length} RECORDS
            </span>
          </div>
        }
      />

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 p-3 bg-panel border border-line-strong rounded-lg">
        {/* Search Box */}
        <div className="relative flex items-center bg-canvas border border-line-strong rounded px-2.5 py-1.5 focus-within:border-cyan-500">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
          <input
            type="search"
            aria-label="Search documents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, codes, authors..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-canvas border border-line-strong text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Categories ({categories.length - 1})</option>
          {categories
            .filter((c) => c !== 'all')
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        {/* Clearance Filter */}
        <select
          aria-label="Filter by clearance level"
          value={selectedClearance}
          onChange={(e) => setSelectedClearance(e.target.value)}
          className="bg-canvas border border-line-strong text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
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

        {/* Date Sort */}
        <select
          aria-label="Sort order"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="bg-canvas border border-line-strong text-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="date-desc">Sort: Date (Newest First)</option>
          <option value="date-asc">Sort: Date (Oldest First)</option>
          <option value="code">Sort: Document Code</option>
        </select>
      </div>

      {filteredDocs.length === 0 && (
        <SystemNotice kind="empty" title="Query returned no records">
          No index entries match these filters. Sanitised files may have been re-filed under a different
          department.
        </SystemNotice>
      )}

      {/* Table View */}
      {filteredDocs.length === 0 ? null : viewMode === 'table' ? (
        <div className="bg-panel border border-line-strong rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <caption className="sr-only">Document index, {filteredDocs.length} records</caption>
              <thead>
                <tr className="bg-hover border-b border-line-strong text-slate-400 text-caption uppercase font-mono">
                  <th scope="col" className="p-3">
                    CODE / CLASSIFICATION
                  </th>
                  <th scope="col" className="p-3">
                    DOCUMENT TITLE & CATEGORY
                  </th>
                  <th scope="col" className="p-3 hidden md:table-cell">
                    DEPARTMENT
                  </th>
                  <th scope="col" className="p-3 hidden lg:table-cell">
                    AUTHOR
                  </th>
                  <th scope="col" className="p-3">
                    DATE
                  </th>
                  <th scope="col" className="p-3 text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      openDocument(doc);
                    }}
                    className="hover:bg-hover cursor-pointer transition-colors group"
                  >
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors font-mono flex items-center gap-1">
                          {doc.code}
                          {isDiscovered(doc.id) && (
                            <Eye
                              className="w-3 h-3 text-emerald-500"
                              role="img"
                              aria-label="Previously opened"
                            />
                          )}
                        </span>
                        <DocumentStamp stamp={doc.classificationStamp} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors text-label">
                            {doc.title}
                          </span>
                          {doc.isWhistleblowerLeak && (
                            <span className="text-nano px-1 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                              LEAK
                            </span>
                          )}
                        </div>
                        <span className="text-caption text-slate-500 block truncate max-w-[340px]">
                          {doc.summary}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-slate-400 text-label truncate max-w-[160px]">
                      {doc.departmentName}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-slate-400 text-label">{doc.author}</td>
                    <td className="p-3 text-slate-400 font-mono text-label">{doc.date}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        aria-label={`View ${doc.code}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          gpcAudio.playUiSound('click');
                          openDocument(doc);
                        }}
                        className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-800 text-caption font-bold cursor-pointer transition-colors"
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
            <button
              type="button"
              aria-haspopup="dialog"
              key={doc.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                openDocument(doc);
              }}
              className="w-full text-left p-4 rounded-lg bg-panel hover:bg-hover border border-line-strong hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
            >
              <span className="block space-y-2">
                <span className="flex items-center justify-between border-b border-line pb-2">
                  <span className="font-bold text-cyan-300 font-mono text-xs">{doc.code}</span>
                  <DocumentStamp stamp={doc.classificationStamp} />
                </span>

                <span className="block font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-xs leading-snug">
                  {doc.title}
                </span>

                <span className="block text-caption text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </span>
              </span>

              <span className="pt-2 border-t border-line-subtle flex items-center justify-between text-caption text-slate-500">
                <span>{doc.date}</span>
                <span className="text-cyan-400 font-bold group-hover:underline">OPEN DOSSIER →</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </ArchivePage>
  );
}
