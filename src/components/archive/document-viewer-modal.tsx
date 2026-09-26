import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  History,
  Link2,
  Printer,
  Tag
} from 'lucide-react';
import type { DocumentRecord } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { findEntry, relatedEntries } from '@/lib/archive/records';
import { downloadFile, downloadJson, toTextFilename } from '@/lib/utils/download';
import { sha256Hex } from '@/lib/utils/sha256';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { SystemNotice } from '@/components/ui/system-notice';
import { FileIcon } from '@/components/ui/file-icon';
import { DocumentStamp } from '@/components/ui/document-stamp';
import { cn } from '@/lib/utils/cn';

const TOOL_BTN =
  'flex items-center gap-1 px-2 py-1 bg-hover hover:bg-active text-slate-300 border border-line-bright rounded text-label cursor-pointer';

interface DocumentViewerModalProps {
  /** The `?doc=` value. When set but unresolved, a missing-file notice is shown. */
  requestedId: string | null;
  document: DocumentRecord | undefined;
  onClose: () => void;
  isGlobalUnredacted: boolean;
  onToggleUnredacted: () => void;
}

export function DocumentViewerModal({
  requestedId,
  document,
  onClose,
  isGlobalUnredacted,
  onToggleUnredacted
}: DocumentViewerModalProps) {
  if (!requestedId) return null;
  if (!document) {
    return (
      <Modal
        open
        onClose={onClose}
        title="PARADIGM-OS // DOSSIER VIEWER"
        icon={FileText}
        tone="warning"
        size="md"
      >
        <SystemNotice kind="missing" title="Record not found in vault index" code="ERR-404">
          The identifier <span className="text-amber-300">{requestedId}</span> does not resolve to any
          recovered record. It may have been purged under Directive 17, re-filed under a new code, or never
          existed. Try the archive search.
        </SystemNotice>
      </Modal>
    );
  }
  // Keyed so local state (copy flag, local de-scramble) resets per document.
  return (
    <DocumentSheet
      key={document.id}
      document={document}
      onClose={onClose}
      isGlobalUnredacted={isGlobalUnredacted}
      onToggleUnredacted={onToggleUnredacted}
    />
  );
}

function DocumentSheet({
  document,
  onClose,
  isGlobalUnredacted
}: Omit<DocumentViewerModalProps, 'requestedId' | 'document'> & { document: DocumentRecord }) {
  const navigate = useNavigate();
  const [localUnredact, setLocalUnredact] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const showUnredacted = isGlobalUnredacted || localUnredact;
  const body = showUnredacted && document.redactedContent ? document.redactedContent : document.content;
  const hash = useMemo(() => sha256Hex(document.content).slice(0, 16), [document.content]);
  const entry = findEntry({ kind: 'document', id: document.id });
  const related = useMemo(
    () => (entry ? relatedEntries(entry).filter((e) => e.kind !== 'department') : []),
    [entry]
  );

  const handleDownloadTxt = () => {
    gpcAudio.playUiSound('print');
    downloadFile(
      toTextFilename(document.downloadableFilename || document.code),
      [
        'GLOBAL PARADIGMS CORPORATION // ARCHIVE RECORD',
        `CODE: ${document.code}`,
        `TITLE: ${document.title}`,
        `CLASSIFICATION: ${document.classificationStamp} (${document.clearance})`,
        `DEPARTMENT: ${document.departmentName}`,
        `AUTHOR: ${document.author}`,
        `DATE: ${document.date}`,
        '===================================================',
        '',
        `SUMMARY:\n${document.summary}`,
        '',
        `RECORD TEXT:\n${body}`,
        '',
        `TAGS: ${document.tags.join(', ')}`,
        `SECURITY VERIFICATION HASH: SHA256-${hash.toUpperCase()}`,
        '',
        '-- Fictional record from Global Paradigms Corp., an original story by Zazie Productions. --'
      ].join('\n')
    );
  };

  const handleDownloadJson = () => {
    gpcAudio.playUiSound('print');
    // Cleartext only leaves the viewer when the de-scrambler is on.
    const { redactedContent, editorialNote: _note, ...rest } = document;
    void _note;
    downloadJson(`${document.code}.json`, showUnredacted ? { ...rest, redactedContent } : rest);
  };

  const handleCopy = async () => {
    gpcAudio.playUiSound('click');
    try {
      await navigator.clipboard.writeText(body);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const headerActions = (
    <>
      <button
        type="button"
        onClick={() => {
          gpcAudio.playUiSound('unredact');
          setLocalUnredact((v) => !v);
        }}
        aria-pressed={showUnredacted}
        disabled={isGlobalUnredacted}
        title={isGlobalUnredacted ? 'Global de-scrambler is on' : 'De-scramble this record only'}
        className={cn(
          'flex items-center gap-1 px-2.5 py-1 rounded text-label font-semibold border cursor-pointer transition-all',
          showUnredacted
            ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
            : 'bg-hover hover:bg-active text-slate-300 border-line-bright'
        )}
      >
        {showUnredacted ? (
          <Eye className="w-3.5 h-3.5 text-rose-400" aria-hidden />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden />
        )}
        <span>{showUnredacted ? 'DE-SCRAMBLED' : 'REDACTED'}</span>
      </button>
      <button
        type="button"
        onClick={handleDownloadTxt}
        className={TOOL_BTN}
        title="Download Raw Transcript (.TXT)"
        aria-label="Download as text"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
        <span className="hidden sm:inline">TXT</span>
      </button>
      <button
        type="button"
        onClick={handleDownloadJson}
        className={TOOL_BTN}
        title="Export Metadata (.JSON)"
        aria-label="Export metadata as JSON"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
        <span className="hidden sm:inline">JSON</span>
      </button>
      <button
        type="button"
        onClick={() => {
          gpcAudio.playUiSound('print');
          window.print();
        }}
        className={cn(TOOL_BTN, 'hidden sm:flex p-1.5')}
        title="Print Document"
        aria-label="Print document"
      >
        <Printer className="w-3.5 h-3.5 text-slate-400" aria-hidden />
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(TOOL_BTN, 'p-1.5')}
        title="Copy Document Text"
        aria-label="Copy document text"
      >
        {copyState === 'copied' ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
        ) : (
          <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copyState === 'copied'
          ? 'Copied to clipboard'
          : copyState === 'failed'
            ? 'Clipboard unavailable'
            : ''}
      </span>
    </>
  );

  return (
    <Modal
      open
      onClose={onClose}
      variant="window"
      size="4xl"
      tone="neutral"
      icon={FileText}
      title={
        <span className="text-slate-200 tracking-wider text-xs">
          PARADIGM-OS // DOSSIER VIEWER: {document.code}
          <span className="hidden sm:inline-block ml-2 text-caption text-slate-500 font-normal">
            [{document.category.toUpperCase()}]
          </span>
        </span>
      }
      headerActions={headerActions}
      bodyClassName="p-4 md:p-8 bg-canvas"
    >
      <article className="print-visible max-w-3xl mx-auto bg-panel border border-line-bright p-6 md:p-10 rounded shadow-2xl relative">
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden"
          aria-hidden
        >
          <span className="text-8xl font-black rotate-[-35deg] tracking-widest text-slate-100">
            GLOBAL PARADIGMS
          </span>
        </div>

        {/* Letterhead */}
        <header className="border-b-2 border-slate-700 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded bg-cyan-500 text-black font-black flex items-center justify-center text-caption"
                aria-hidden
              >
                GPC
              </div>
              <p className="text-sm md:text-base font-bold text-white tracking-widest uppercase">
                GLOBAL PARADIGMS CORPORATION
              </p>
            </div>
            <p className="text-caption text-slate-400 mt-0.5">
              DIVISION OF STRATEGIC ARCHIVES // POSTOJNA REPOSITORY MASTER RECORD
            </p>
          </div>
          <DocumentStamp
            stamp={document.classificationStamp}
            variant="stamp"
            className="self-start md:self-auto"
          />
        </header>

        {/* Metadata */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-raised border border-line-strong p-3 rounded mb-6 text-caption">
          <div>
            <dt className="text-slate-500">DOCUMENT ID:</dt>
            <dd className="text-cyan-300 font-bold break-all">{document.code}</dd>
          </div>
          <div>
            <dt className="text-slate-500">DATE OF RECORD:</dt>
            <dd className="text-slate-200">{document.date}</dd>
          </div>
          <div>
            <dt className="text-slate-500">AUTHOR / SOURCE:</dt>
            <dd className="text-slate-200 truncate">{document.author}</dd>
          </div>
          <div>
            <dt className="text-slate-500">SECURITY LEVEL:</dt>
            <dd className="text-amber-400 font-bold">{document.clearance}</dd>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <dt className="text-slate-500">SOURCE PATH:</dt>
            <dd className="text-slate-400 break-all">{entry?.sourcePath}</dd>
          </div>
          <div>
            <dt className="text-slate-500">FILE STATUS:</dt>
            <dd className="uppercase text-slate-300">{entry?.status ?? 'recovered'}</dd>
          </div>
        </dl>

        {entry?.status === 'partial' && (
          <SystemNotice kind="info" compact title="Partial reconstruction" code="MIRROR-RST" className="mb-6">
            This record was rebuilt from index stubs by the restoration team. Body text is templated; metadata
            is original.
          </SystemNotice>
        )}

        {document.isWhistleblowerLeak && (
          <div
            className="mb-6 p-3 bg-rose-950/40 border border-rose-500/60 rounded flex items-center gap-3"
            role="note"
          >
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" aria-hidden />
            <p className="text-label text-rose-200">
              <span className="font-bold">UNAUTHORIZED EXFILTRATION RECORD:</span> This document is indexed
              under Project Palimpsest counter-leak operations. Possession by un-cleared personnel constitutes
              an actionable breach of GPC Non-Disclosure covenants.
            </p>
          </div>
        )}

        <div className="mb-4">
          <span className="text-caption uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {document.category}
          </span>
          <h3 className="text-base md:text-lg font-bold text-white mt-2 leading-snug">{document.title}</h3>
        </div>

        <div className="mb-6 p-3 bg-hover border-l-2 border-cyan-500 text-slate-300 leading-relaxed text-label">
          <span className="text-slate-400 font-bold block mb-1">RECORD ABSTRACT:</span>
          {document.summary}
        </div>

        <div
          className="mb-8 font-mono text-label text-slate-200 leading-relaxed whitespace-pre-line border-t border-b border-slate-800/80 py-6"
          aria-live="polite"
        >
          {body}
        </div>

        {document.revisions && document.revisions.length > 0 && (
          <section className="border-t border-line-strong pt-4 mt-6">
            <h4 className="text-caption text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
              REVISION HISTORY:
            </h4>
            <ol className="space-y-1.5 text-caption">
              {document.revisions.map((r) => (
                <li key={r.revision} className="flex flex-wrap gap-x-2 text-slate-400">
                  <span className="text-cyan-300 font-bold">{r.revision}</span>
                  <span>{r.date}</span>
                  <span className="text-slate-300">{r.editor}</span>
                  <span className="basis-full sm:basis-auto">— {r.summary}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-line-strong pt-4 mt-6">
            <h4 className="text-caption text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
              LINKED RECORDS:
            </h4>
            <ul className="flex flex-wrap gap-2 text-caption">
              {related.map((r) => (
                <li key={`${r.kind}:${r.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      navigate(r.route);
                    }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-raised border border-line-bright hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 cursor-pointer"
                  >
                    <FileIcon kind={r.kind} className="w-3 h-3 text-cyan-400" />
                    <span>{r.title}</span>
                    <Badge tone="neutral">{r.kind.toUpperCase()}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="border-t border-line-strong pt-4 mt-6">
          <h4 className="text-caption text-slate-400 font-bold mb-2">INDEXED REPOSITORY CROSS-REFERENCES:</h4>
          <ul className="flex flex-wrap gap-2 text-caption">
            {document.tags.map((t) => (
              <li
                key={t}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"
              >
                <Tag className="w-3 h-3 text-cyan-400" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-caption text-slate-500">
          <div>
            <span>AUTHENTICATION HASH: </span>
            <span className="font-mono text-cyan-400">SHA256: {hash}</span>
            <br />
            <span>ARCHIVAL VAULT: Postojna Karst Sub-Chamber 04</span>
          </div>
          <div className="text-right">
            <div className="h-8 border-b border-slate-600 w-48 mb-1 flex items-end justify-center font-serif italic text-slate-300 text-xs">
              {document.author.split(' ').slice(0, 2).join(' ')}
            </div>
            <span>AUTHORIZED SIGNATORY BLOCK</span>
          </div>
        </footer>
      </article>
    </Modal>
  );
}
