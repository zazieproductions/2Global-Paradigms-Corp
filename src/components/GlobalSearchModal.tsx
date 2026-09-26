import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  FileText,
  User,
  MapPin,
  FolderLock,
  PackageX,
  Mail,
  Newspaper,
  Radio,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  DocumentRecord,
  Personnel,
  RegionalStation,
  InternalProgram,
  DiscontinuedProduct,
  EmailThread,
  MeetingRecord,
  PressRelease,
  TimelineEntry,
  AudioArtifact,
  ActiveTab
} from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentRecord[];
  personnel: Personnel[];
  stations: RegionalStation[];
  programs: InternalProgram[];
  products: DiscontinuedProduct[];
  emails: EmailThread[];
  meetings: MeetingRecord[];
  pressReleases: PressRelease[];
  timeline: TimelineEntry[];
  audioArtifacts: AudioArtifact[];
  onSelectDocument: (doc: DocumentRecord) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  documents,
  personnel,
  stations,
  programs,
  products,
  emails,
  meetings,
  pressReleases,
  timeline,
  audioArtifacts,
  onSelectDocument,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const results: Array<{
      id: string;
      type: 'document' | 'personnel' | 'station' | 'program' | 'product' | 'email' | 'meeting' | 'press' | 'timeline' | 'audio';
      title: string;
      code: string;
      snippet: string;
      category: string;
      rawObj: any;
    }> = [];

    // Search Documents
    if (categoryFilter === 'all' || categoryFilter === 'documents') {
      documents.forEach((d) => {
        if (
          d.title.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          results.push({
            id: d.id,
            type: 'document',
            title: d.title,
            code: d.code,
            snippet: d.summary,
            category: d.category,
            rawObj: d
          });
        }
      });
    }

    // Search Personnel
    if (categoryFilter === 'all' || categoryFilter === 'personnel') {
      personnel.forEach((p) => {
        if (
          p.name.toLowerCase().includes(q) ||
          p.employeeId.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.departmentName.toLowerCase().includes(q) ||
          p.biography.toLowerCase().includes(q)
        ) {
          results.push({
            id: p.id,
            type: 'personnel',
            title: p.name,
            code: p.employeeId,
            snippet: `${p.title} (${p.departmentName}) — ${p.biography.slice(0, 120)}...`,
            category: 'Personnel',
            rawObj: p
          });
        }
      });
    }

    // Search Stations
    if (categoryFilter === 'all' || categoryFilter === 'stations') {
      stations.forEach((st) => {
        if (
          st.name.toLowerCase().includes(q) ||
          st.code.toLowerCase().includes(q) ||
          st.region.toLowerCase().includes(q) ||
          st.frequencyBand.toLowerCase().includes(q) ||
          st.description.toLowerCase().includes(q)
        ) {
          results.push({
            id: st.id,
            type: 'station',
            title: st.name,
            code: st.code,
            snippet: `${st.region} [${st.frequencyBand}] — ${st.description.slice(0, 120)}...`,
            category: 'Station',
            rawObj: st
          });
        }
      });
    }

    // Search Programs
    if (categoryFilter === 'all' || categoryFilter === 'programs') {
      programs.forEach((pr) => {
        if (
          pr.name.toLowerCase().includes(q) ||
          pr.code.toLowerCase().includes(q) ||
          pr.objective.toLowerCase().includes(q) ||
          pr.classifiedReality.toLowerCase().includes(q)
        ) {
          results.push({
            id: pr.id,
            type: 'program',
            title: pr.name,
            code: pr.code,
            snippet: pr.objective,
            category: 'Program',
            rawObj: pr
          });
        }
      });
    }

    // Search Products
    if (categoryFilter === 'all' || categoryFilter === 'products') {
      products.forEach((prod) => {
        if (
          prod.name.toLowerCase().includes(q) ||
          prod.modelCode.toLowerCase().includes(q) ||
          prod.actualAnomaly.toLowerCase().includes(q)
        ) {
          results.push({
            id: prod.id,
            type: 'product',
            title: prod.name,
            code: prod.modelCode,
            snippet: prod.actualAnomaly,
            category: 'Product',
            rawObj: prod
          });
        }
      });
    }

    // Search Emails
    if (categoryFilter === 'all' || categoryFilter === 'comms') {
      emails.forEach((em) => {
        if (
          em.subject.toLowerCase().includes(q) ||
          em.threadCode.toLowerCase().includes(q) ||
          em.messages.some((m) => m.body.toLowerCase().includes(q))
        ) {
          results.push({
            id: em.id,
            type: 'email',
            title: em.subject,
            code: em.threadCode,
            snippet: em.messages[0]?.body.slice(0, 140) || '',
            category: 'Email',
            rawObj: em
          });
        }
      });

      meetings.forEach((meet) => {
        if (
          meet.title.toLowerCase().includes(q) ||
          meet.meetingCode.toLowerCase().includes(q) ||
          meet.minutes.toLowerCase().includes(q)
        ) {
          results.push({
            id: meet.id,
            type: 'meeting',
            title: meet.title,
            code: meet.meetingCode,
            snippet: meet.minutes.slice(0, 140),
            category: 'Meeting',
            rawObj: meet
          });
        }
      });
    }

    // Search Press Releases
    if (categoryFilter === 'all') {
      pressReleases.forEach((pr) => {
        if (
          pr.headline.toLowerCase().includes(q) ||
          pr.releaseNumber.toLowerCase().includes(q) ||
          pr.bodyParagraphs.some((p) => p.toLowerCase().includes(q))
        ) {
          results.push({
            id: pr.id,
            type: 'press',
            title: pr.headline,
            code: pr.releaseNumber,
            snippet: pr.bodyParagraphs[0].slice(0, 140),
            category: 'Press Release',
            rawObj: pr
          });
        }
      });

      audioArtifacts.forEach((art) => {
        if (
          art.title.toLowerCase().includes(q) ||
          art.code.toLowerCase().includes(q) ||
          art.transcript.toLowerCase().includes(q)
        ) {
          results.push({
            id: art.id,
            type: 'audio',
            title: art.title,
            code: art.code,
            snippet: art.summary.slice(0, 140),
            category: 'Audio Artifact',
            rawObj: art
          });
        }
      });
    }

    return results.slice(0, 40);
  }, [query, categoryFilter, documents, personnel, stations, programs, products, emails]);

  if (!isOpen) return null;

  const handleResultClick = (result: any) => {
    gpcAudio.playUiSound('click');
    if (result.type === 'document') {
      onSelectDocument(result.rawObj);
      onClose();
    } else if (result.type === 'personnel') {
      onNavigateTab('personnel');
      onClose();
    } else if (result.type === 'station') {
      onNavigateTab('stations');
      onClose();
    } else if (result.type === 'program') {
      onNavigateTab('programs');
      onClose();
    } else if (result.type === 'product') {
      onNavigateTab('products');
      onClose();
    } else if (result.type === 'email' || result.type === 'meeting') {
      onNavigateTab('communications');
      onClose();
    } else if (result.type === 'press') {
      onNavigateTab('communications');
      onClose();
    } else if (result.type === 'audio') {
      onNavigateTab('audio');
      onClose();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'personnel':
        return <User className="w-4 h-4 text-emerald-400" />;
      case 'station':
        return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'program':
        return <FolderLock className="w-4 h-4 text-rose-400" />;
      case 'product':
        return <PackageX className="w-4 h-4 text-amber-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'meeting':
        return <FileText className="w-4 h-4 text-slate-400" />;
      case 'press':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'audio':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-black/80 backdrop-blur-md p-3 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-3.5 bg-[#0e1422] border-b border-[#1c273c]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 174 documents, 45 personnel, 22 stations, project dossiers, frequency codes..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#080b12] border-b border-[#182335] text-[10px] overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'documents', label: 'Documents (174)' },
            { id: 'personnel', label: 'Personnel (45)' },
            { id: 'stations', label: 'Stations (22)' },
            { id: 'programs', label: 'Programs (14)' },
            { id: 'products', label: 'Products (8)' },
            { id: 'comms', label: 'Emails & Memos' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setCategoryFilter(cat.id);
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
          {!query.trim() ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
              <Search className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Type a keyword, project name, station code, frequency (14.8Hz), or author to search the entire GPC archive.</p>
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                {['Vesper', 'Svalbard', '14.8Hz', 'Palimpsest', 'Reson-8', 'Site 19', 'Compound 88-T', 'Borehole 4'].map(
                  (sug) => (
                    <button
                      key={sug}
                      onClick={() => setQuery(sug)}
                      className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 border border-slate-700 text-[10px]"
                    >
                      {sug}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No classified records matching "{query}".</p>
              <p className="text-[10px] mt-1 text-slate-600">Check spelling or try enabling the Redaction De-Scrambler.</p>
            </div>
          ) : (
            searchResults.map((res) => (
              <div
                key={`${res.type}-${res.id}`}
                onClick={() => handleResultClick(res)}
                className="p-2.5 rounded bg-[#0d121c] hover:bg-[#131b2a] border border-[#1a2538] hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-[#080c14] border border-[#1b2538] mt-0.5 shrink-0">
                    {getResultIcon(res.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate text-[11px]">
                        {res.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                        {res.code}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {res.snippet}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-400 uppercase">
                    {res.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="px-3 py-2 bg-[#0e1422] border-t border-[#1c273c] flex items-center justify-between text-[10px] text-slate-500">
          <span>{searchResults.length} matching records found</span>
          <span>ENTER to select | ESC to close</span>
        </div>
      </div>
    </div>
  );
};
