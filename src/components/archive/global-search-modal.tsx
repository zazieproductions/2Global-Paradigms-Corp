import { useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import type {
  ArchiveEntry,
  ContentStatus,
  MediaType,
  RecordFormat,
  RecordKind,
  SearchFilters
} from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { getArchiveEntries } from '@/lib/archive/records';
import { getFacets } from '@/lib/search/search-index';
import { useArchiveSearch } from '@/hooks/use-archive-search';
import { Modal } from '@/components/ui/modal';
import { FileIcon } from '@/components/ui/file-icon';
import { SystemNotice } from '@/components/ui/system-notice';
import { cn } from '@/lib/utils/cn';

interface Category {
  id: string;
  label: string;
  kinds?: RecordKind[];
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Records' },
  { id: 'documents', label: 'Documents', kinds: ['document'] },
  { id: 'personnel', label: 'Personnel', kinds: ['personnel'] },
  { id: 'stations', label: 'Stations', kinds: ['office'] },
  { id: 'programs', label: 'Programs', kinds: ['project'] },
  { id: 'products', label: 'Products', kinds: ['product'] },
  { id: 'comms', label: 'Emails & Memos', kinds: ['email', 'meeting', 'press', 'newsletter'] },
  { id: 'audio', label: 'Audio', kinds: ['audio'] },
  {
    id: 'corporate',
    label: 'Corporate & History',
    kinds: ['department', 'timeline', 'annual-report', 'training', 'job', 'dead-link', 'restoration-log']
  }
];

const KIND_TINT: Partial<Record<RecordKind, string>> = {
  document: 'text-cyan-400',
  personnel: 'text-emerald-400',
  office: 'text-purple-400',
  project: 'text-rose-400',
  product: 'text-amber-400',
  email: 'text-blue-400',
  press: 'text-indigo-400',
  audio: 'text-cyan-400'
};

const SUGGESTIONS = [
  'Vesper',
  'Svalbard',
  '14.8Hz',
  'Palimpsest',
  'Reson-8',
  'Site 19',
  'Compound 88-T',
  'Borehole 4'
];

const MEDIA_TYPES: MediaType[] = ['text', 'audio', 'data', 'web'];

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onOpenDocument: (id: string) => void;
}

export function GlobalSearchModal({ open, onClose, onOpenDocument }: GlobalSearchModalProps) {
  if (!open) return null;
  return <SearchPalette onClose={onClose} onOpenDocument={onOpenDocument} />;
}

function SearchPalette({ onClose, onOpenDocument }: Omit<GlobalSearchModalProps, 'open'>) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [adv, setAdv] = useState<{
    tier: string;
    department: string;
    project: string;
    status: string;
    media: string;
    format: string;
    yearFrom: string;
    yearTo: string;
  }>({ tier: '', department: '', project: '', status: '', media: '', format: '', yearFrom: '', yearTo: '' });
  const [active, setActive] = useState(0);

  const facets = useMemo(() => getFacets(), []);
  const counts = useMemo(() => {
    const byKind = new Map<RecordKind, number>();
    for (const e of getArchiveEntries()) byKind.set(e.kind, (byKind.get(e.kind) ?? 0) + 1);
    return byKind;
  }, []);

  const filters = useMemo<SearchFilters>(() => {
    const kinds = CATEGORIES.find((c) => c.id === category)?.kinds;
    return {
      kinds,
      clearanceTiers: adv.tier ? [Number(adv.tier)] : undefined,
      departments: adv.department ? [adv.department] : undefined,
      projects: adv.project ? [adv.project] : undefined,
      statuses: adv.status ? [adv.status as ContentStatus] : undefined,
      mediaTypes: adv.media ? [adv.media as MediaType] : undefined,
      formats: adv.format ? [adv.format as RecordFormat] : undefined,
      dateFrom: adv.yearFrom ? `${adv.yearFrom.padStart(4, '0')}-01-01` : undefined,
      dateTo: adv.yearTo ? `${adv.yearTo.padStart(4, '0')}-12-31` : undefined
    };
  }, [category, adv]);

  const hasAdvanced = Object.values(adv).some(Boolean);
  const hasQuery = query.trim().length > 0 || hasAdvanced;
  const { results } = useArchiveSearch(hasQuery ? query : '', filters, 40);
  const shown = hasQuery ? results : [];
  const activeIndex = Math.min(active, Math.max(shown.length - 1, 0));

  const select = (e: ArchiveEntry) => {
    gpcAudio.playUiSound('click');
    onClose();
    if (e.kind === 'document') onOpenDocument(e.id);
    else navigate(e.route);
  };

  const onKeyDown = (ev: KeyboardEvent) => {
    if (!shown.length) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setActive((i) => Math.min(i + 1, shown.length - 1));
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      select(shown[activeIndex].entry);
    }
  };

  const countFor = (c: Category) => (c.kinds ? c.kinds.reduce((n, k) => n + (counts.get(k) ?? 0), 0) : null);
  const setAdvField = (k: keyof typeof adv) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAdv((a) => ({ ...a, [k]: e.target.value }));
    setActive(0);
  };
  const selectCls = 'field w-full text-caption py-1.5 sm:py-1';

  return (
    <Modal
      open
      onClose={onClose}
      title="Archive search"
      hideTitleBar
      variant="window"
      size="2xl"
      position="top"
      initialFocusRef={inputRef}
      className="max-w-3xl h-[85dvh] sm:h-auto shadow-glow-lg shadow-signal/25"
      bodyClassName="flex flex-col"
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 p-3.5 bg-hover border-b border-line-strong">
        <Search className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search the archive"
          aria-expanded={shown.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={shown.length ? `${listId}-${activeIndex}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          maxLength={120}
          placeholder={`Search ${counts.get('document') ?? 0} documents, ${counts.get('personnel') ?? 0} personnel, ${counts.get('office') ?? 0} stations, project dossiers, frequency codes...`}
          className="flex-1 min-w-0 bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="tap-target text-slate-400 hover:text-white p-1.5"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls={`${listId}-filters`}
          className={cn(
            'p-1.5 rounded border text-label',
            showFilters || hasAdvanced
              ? 'bg-cyan-950 border-cyan-600 text-cyan-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          )}
          title="Advanced filters"
          aria-label="Advanced filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-label border border-slate-700"
          aria-label="Close search"
        >
          ESC
        </button>
      </div>

      {/* Categories */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 bg-inset border-b border-line text-caption overflow-x-auto overscroll-x-contain scrollbar-none [-webkit-overflow-scrolling:touch]"
        role="group"
        aria-label="Record type"
      >
        {CATEGORIES.map((cat) => {
          const n = countFor(cat);
          return (
            <button
              type="button"
              key={cat.id}
              aria-pressed={category === cat.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setCategory(cat.id);
                setActive(0);
              }}
              className={cn(
                'tap-target px-2.5 py-1.5 sm:py-1 rounded transition-colors whitespace-nowrap cursor-pointer border',
                category === cat.id
                  ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
              )}
            >
              {cat.label}
              {n !== null && ` (${n})`}
            </button>
          );
        })}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div
          id={`${listId}-filters`}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 py-2.5 bg-inset border-b border-line text-caption"
        >
          <label className="space-y-0.5">
            <span className="meta-label">Classification</span>
            <select className={selectCls} value={adv.tier} onChange={setAdvField('tier')}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((t) => (
                <option key={t} value={t}>
                  Level {t}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Department</span>
            <select className={selectCls} value={adv.department} onChange={setAdvField('department')}>
              <option value="">Any</option>
              {facets.departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Project</span>
            <select className={selectCls} value={adv.project} onChange={setAdvField('project')}>
              <option value="">Any</option>
              {facets.projects.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Format</span>
            <select className={selectCls} value={adv.format} onChange={setAdvField('format')}>
              <option value="">Any</option>
              {facets.formats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">File status</span>
            <select className={selectCls} value={adv.status} onChange={setAdvField('status')}>
              <option value="">Any</option>
              {facets.statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Media</span>
            <select className={selectCls} value={adv.media} onChange={setAdvField('media')}>
              <option value="">Any</option>
              {MEDIA_TYPES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Year from</span>
            <input
              className={selectCls}
              type="number"
              inputMode="numeric"
              min={facets.yearRange?.[0]}
              max={facets.yearRange?.[1]}
              placeholder={String(facets.yearRange?.[0] ?? '')}
              value={adv.yearFrom}
              onChange={setAdvField('yearFrom')}
            />
          </label>
          <label className="space-y-0.5">
            <span className="meta-label">Year to</span>
            <input
              className={selectCls}
              type="number"
              inputMode="numeric"
              min={facets.yearRange?.[0]}
              max={facets.yearRange?.[1]}
              placeholder={String(facets.yearRange?.[1] ?? '')}
              value={adv.yearTo}
              onChange={setAdvField('yearTo')}
            />
          </label>
          {hasAdvanced && (
            <button
              type="button"
              className="col-span-2 sm:col-span-4 justify-self-end text-caption text-cyan-400 hover:text-cyan-300 underline"
              onClick={() =>
                setAdv({
                  tier: '',
                  department: '',
                  project: '',
                  status: '',
                  media: '',
                  format: '',
                  yearFrom: '',
                  yearTo: ''
                })
              }
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-2 scrollbar-thin min-h-[8rem]">
        {!hasQuery ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <Search className="w-8 h-8 text-slate-600" aria-hidden />
            <p className="text-xs">
              Type a keyword, project name, station code, frequency (14.8Hz), or author to search the entire
              GPC archive.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => {
                    setQuery(sug);
                    inputRef.current?.focus();
                  }}
                  className="tap-target px-2 py-1 rounded bg-slate-800/80 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 border border-slate-700 text-caption"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : shown.length === 0 ? (
          <SystemNotice
            kind="empty"
            title={`No classified records matching "${query.trim() || 'current filters'}"`}
            className="m-2"
          >
            Check spelling, widen the filters, or try the Redaction De-Scrambler — some records only name
            their subject in cleartext.
          </SystemNotice>
        ) : (
          <ul id={listId} role="listbox" aria-label="Search results" className="space-y-1.5">
            {shown.map((res, i) => {
              const e = res.entry;
              const isActive = i === activeIndex;
              return (
                <li
                  key={`${e.kind}-${e.id}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => select(e)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'tap-row p-2.5 rounded bg-raised border cursor-pointer transition-all flex items-center justify-between gap-3 group',
                    isActive ? 'bg-hover border-cyan-500/50' : 'border-line-strong'
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 rounded bg-shell border border-line-strong mt-0.5 shrink-0">
                      <FileIcon
                        kind={e.kind}
                        format={e.format}
                        className={KIND_TINT[e.kind] ?? 'text-slate-400'}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-bold truncate text-label transition-colors',
                            isActive ? 'text-cyan-300' : 'text-slate-200'
                          )}
                        >
                          {e.title}
                        </span>
                        <span className="text-micro px-1.5 py-px rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                          {e.code}
                        </span>
                      </div>
                      <p className="text-caption text-slate-400 truncate mt-0.5">{res.snippet}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-micro px-1.5 py-px rounded bg-slate-800/80 text-cyan-400 uppercase">
                      {e.kind.replace('-', ' ')}
                    </span>
                    <ArrowRight
                      className={cn(
                        'w-3.5 h-3.5 transition-colors',
                        isActive ? 'text-cyan-400' : 'text-slate-500'
                      )}
                      aria-hidden
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="px-3 py-2 bg-hover border-t border-line-strong flex items-center justify-between text-caption text-slate-500">
        <span aria-live="polite">{hasQuery ? `${shown.length} matching records found` : 'Index ready'}</span>
        <span className="hidden sm:inline">↑↓ to move | ENTER to open | ESC to close</span>
      </div>
    </Modal>
  );
}
