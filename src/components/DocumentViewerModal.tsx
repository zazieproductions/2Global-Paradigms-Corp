import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Building2,
  User,
  Calendar,
  Tag,
  CheckCircle2,
  AlertOctagon,
  Copy,
  ExternalLink
} from 'lucide-react';
import { DocumentRecord, ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';
import { useArg } from '../arg/ArgContext';
import { clearanceRank } from '../arg/levels';
import { renderRedacted, stripRedactions } from '../arg/Redacted';
import { ChoirGlyph, OrderSigil } from '../arg/sigils';
import { LEVEL_CORRESPONDENCE } from '../arg/seals';

// Choir Script marginalia on the Order's own documents (only codex letters used)
const MARGINALIA = ['HE IS SINGING', 'THE SONG RISES', 'ORDER IS ETERNAL', 'DESCEND', 'THE CHOIR HEARS'];
const EARNED_BY: Record<number, string> = {
  2: 'Seal I — The Square of Lead',
  3: 'Seal II — The Wheel of Days',
  4: 'Seal IV — The Three Voices',
  5: 'Seal VI — The Mercury Wheel'
};

interface DocumentViewerModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
  isGlobalUnredacted: boolean;
  onToggleUnredacted: () => void;
  onNavigateToPersonnel?: (personnelId: string) => void;
  onNavigateToStation?: (stationId: string) => void;
  onNavigateToProgram?: (programId: string) => void;
  clearance: ClearanceLevel;
  onOpenSanctum: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  isGlobalUnredacted,
  onToggleUnredacted,
  onNavigateToPersonnel,
  onNavigateToStation,
  onNavigateToProgram,
  clearance,
  onOpenSanctum
}) => {
  const arg = useArg();
  const [localUnredact, setLocalUnredact] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const docRank = clearanceRank(document.clearance);
  const isSealed = docRank > clearanceRank(clearance);
  const isOrderDoc = document.tags.includes('Order');
  const showUnredacted = arg.descramblerUnlocked && (isGlobalUnredacted || localUnredact);
  const contentToDisplay = showUnredacted && document.redactedContent ? document.redactedContent : stripRedactions(document.content);
  const marginalia = MARGINALIA[document.code.length % MARGINALIA.length];

  const sealedDeny = () => {
    gpcAudio.playUiSound('deny');
    arg.notify('RECORD SEALED', 'You cannot export what you are not permitted to read.', '🜔', '#f43f5e');
  };

  const handleDownloadTxt = () => {
    if (isSealed) return sealedDeny();
    gpcAudio.playUiSound('print');
    const blob = new Blob([
      `GLOBAL PARADIGMS CORPORATION // ARCHIVE RECORD\n` +
      `CODE: ${document.code}\n` +
      `TITLE: ${document.title}\n` +
      `CLASSIFICATION: ${document.classificationStamp} (${document.clearance})\n` +
      `DEPARTMENT: ${document.departmentName}\n` +
      `AUTHOR: ${document.author}\n` +
      `DATE: ${document.date}\n` +
      `===================================================\n\n` +
      `SUMMARY:\n${document.summary}\n\n` +
      `RECORD TEXT:\n${contentToDisplay}\n\n` +
      `TAGS: ${document.tags.join(', ')}\n` +
      `SECURITY VERIFICATION HASH: SHA256-${Date.now().toString(16).toUpperCase()}\n`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.downloadableFilename || `${document.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (isSealed) return sealedDeny();
    gpcAudio.playUiSound('print');
    const exported = showUnredacted
      ? document
      : { ...document, content: stripRedactions(document.content), redactedContent: '[WITHHELD — DE-SCRAMBLER REQUIRED]' };
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.code}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (isSealed) return sealedDeny();
    gpcAudio.playUiSound('print');
    window.print();
  };

  const handleCopy = () => {
    if (isSealed) return sealedDeny();
    gpcAudio.playUiSound('click');
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStampColor = (stamp: DocumentRecord['classificationStamp']) => {
    switch (stamp) {
      case 'BLACK LEVEL // SANITIZED':
        return 'border-rose-600 text-rose-500 bg-rose-950/20';
      case 'TOP SECRET // EYES ONLY':
        return 'border-red-600 text-red-500 bg-red-950/20';
      case 'SECRET // NOFORN':
        return 'border-amber-600 text-amber-500 bg-amber-950/20';
      case 'CONFIDENTIAL':
        return 'border-cyan-600 text-cyan-500 bg-cyan-950/20';
      default:
        return 'border-slate-600 text-slate-400 bg-slate-900/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-[#23314a] rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1422] border-b border-[#1c273c]">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-cyan-950 border border-cyan-800">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-slate-200 tracking-wider text-xs">
                PARADIGM-OS // DOSSIER VIEWER: {document.code}
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-500">
                [{document.category.toUpperCase()}]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Redact toggle */}
            <button
              onClick={() => {
                if (!arg.descramblerUnlocked) {
                  gpcAudio.playUiSound('deny');
                  arg.notify('DE-SCRAMBLER LOCKED', 'Available from Level 3. Break Seal II — The Wheel of Days.', '♃', '#60a5fa');
                  return;
                }
                if (isGlobalUnredacted && localUnredact === false) {
                  onToggleUnredacted();
                  return;
                }
                gpcAudio.playUiSound('unredact');
                setLocalUnredact(!localUnredact);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold border cursor-pointer transition-all ${
                showUnredacted
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-[#121927] hover:bg-[#182338] text-slate-300 border-[#22304d]'
              }`}
            >
              {showUnredacted ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showUnredacted ? 'DE-SCRAMBLED' : 'REDACTED'}</span>
            </button>

            {/* Download Text */}
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1 px-2 py-1 bg-[#121927] hover:bg-[#182338] text-slate-300 border border-[#22304d] rounded text-[11px] cursor-pointer"
              title="Download Raw Transcript (.TXT)"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">TXT</span>
            </button>

            {/* Download JSON */}
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1 px-2 py-1 bg-[#121927] hover:bg-[#182338] text-slate-300 border border-[#22304d] rounded text-[11px] cursor-pointer"
              title="Export Metadata (.JSON)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 bg-[#121927] hover:bg-[#182338] text-slate-300 border border-[#22304d] rounded cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 bg-[#121927] hover:bg-[#182338] text-slate-300 border border-[#22304d] rounded cursor-pointer"
              title="Copy Document Text"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                gpcAudio.playUiSound('click');
                onClose();
              }}
              className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white rounded cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isSealed ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#07090e] text-slate-200 scrollbar-thin flex items-center justify-center">
            <div className="max-w-lg text-center space-y-4">
              <div className="mx-auto w-fit text-rose-400/80 ovp-breathe">
                <OrderSigil size={110} showText />
              </div>
              <p className="font-occult text-2xl text-slate-100">This record is sealed.</p>
              <p className="text-[11px] text-slate-400">
                <span className="text-cyan-300">{document.code}</span> — “{document.title}”
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                It is classified <span className="text-amber-300 font-bold">{document.clearance}</span>
                {' '}({LEVEL_CORRESPONDENCE[docRank].planet} · {LEVEL_CORRESPONDENCE[docRank].metal}). Your clearance is{' '}
                <span className="text-amber-300">{clearance}</span>.
              </p>
              <p className="text-[11px] text-slate-300">
                The wax holds until you break <span className="text-fuchsia-300 font-bold">{EARNED_BY[docRank]}</span>.
              </p>
              <div className="p-3 rounded bg-black/50 border border-slate-800 text-[10px] text-slate-500 italic">
                Abstract (unclassified): {document.summary}
              </div>
              <button
                onClick={onOpenSanctum}
                className="px-5 py-2 rounded border border-fuchsia-700 text-fuchsia-300 hover:bg-fuchsia-950/50 cursor-pointer font-occult tracking-widest text-xs"
              >
                GO TO THE SEVEN SEALS
              </button>
            </div>
          </div>
        ) : (
        /* Fake PDF Paper Document Viewer Canvas */
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#07090e] text-slate-200 scrollbar-thin">
          <div className="max-w-3xl mx-auto bg-[#0a0d16] border border-[#222e44] p-6 md:p-10 rounded shadow-2xl relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              {isOrderDoc ? (
                <span className="text-slate-100">
                  <OrderSigil size={460} showText strokeWidth={0.6} />
                </span>
              ) : (
                <span className="text-8xl font-black rotate-[-35deg] tracking-widest text-slate-100">
                  GLOBAL PARADIGMS
                </span>
              )}
            </div>

            {/* Top Official Letterhead */}
            <div className="border-b-2 border-slate-700 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-cyan-500 text-black font-black flex items-center justify-center text-[10px]">
                    GPC
                  </div>
                  <h1 className="text-sm md:text-base font-bold text-white tracking-widest uppercase">
                    GLOBAL PARADIGMS CORPORATION
                  </h1>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  DIVISION OF STRATEGIC ARCHIVES // POSTOJNA REPOSITORY MASTER RECORD
                </p>
              </div>

              {/* Classification Stamp */}
              <div
                className={`border-2 border-dashed px-3 py-1 rounded text-center rotate-[-3deg] uppercase font-black text-xs tracking-wider ${getStampColor(
                  document.classificationStamp
                )}`}
              >
                {document.classificationStamp}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d131f] border border-[#1b273d] p-3 rounded mb-6 text-[10px]">
              <div>
                <span className="text-slate-500 block">DOCUMENT ID:</span>
                <span className="text-cyan-300 font-bold">{document.code}</span>
              </div>
              <div>
                <span className="text-slate-500 block">DATE OF RECORD:</span>
                <span className="text-slate-200">{document.date}</span>
              </div>
              <div>
                <span className="text-slate-500 block">AUTHOR / SOURCE:</span>
                <span className="text-slate-200 truncate block">{document.author}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SECURITY LEVEL:</span>
                <span className="text-amber-400 font-bold">{document.clearance}</span>
              </div>
            </div>

            {/* Whistleblower Alert Banner if applicable */}
            {document.isWhistleblowerLeak && (
              <div className="mb-6 p-3 bg-rose-950/40 border border-rose-500/60 rounded flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                <div className="text-[11px] text-rose-200">
                  <span className="font-bold">UNAUTHORIZED EXFILTRATION RECORD:</span> This document is indexed under Project Palimpsest counter-leak operations. Possession by un-cleared personnel constitutes an actionable breach of GPC Non-Disclosure covenants.
                </div>
              </div>
            )}

            {/* Document Title & Category */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {document.category}
              </span>
              <h2 className="text-base md:text-lg font-bold text-white mt-2 leading-snug">
                {document.title}
              </h2>
            </div>

            {/* Executive Summary */}
            <div className="mb-6 p-3 bg-[#0e1422] border-l-2 border-cyan-500 text-slate-300 leading-relaxed text-[11px]">
              <span className="text-slate-400 font-bold block mb-1">RECORD ABSTRACT:</span>
              {document.summary}
            </div>

            {/* Full Document Body (with highlighted redactions) */}
            <div className="mb-8 font-mono text-[11px] text-slate-200 leading-relaxed space-y-4 whitespace-pre-line border-t border-b border-slate-800/80 py-6">
              {showUnredacted ? contentToDisplay : renderRedacted(contentToDisplay)}
            </div>

            {/* Choir Script marginalia — only the Order's own records carry it */}
            {isOrderDoc && (
              <div className="mb-6 p-3 rounded border border-rose-900/40 bg-rose-950/10">
                <p className="text-[9px] tracking-[0.3em] text-rose-400/70 mb-2">MARGINALIA · CHOIR SCRIPT (HAND-INKED)</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {marginalia.split(' ').map((w, wi) => (
                    <span key={wi} className="flex gap-0.5">
                      {w.split('').map((ch, ci) => (
                        <span key={ci} className="flex flex-col items-center">
                          <ChoirGlyph letter={ch} size={20} color="#fb7185" />
                          <span className="text-[9px] font-occult text-rose-300/80 h-3">{arg.knownLetters.has(ch) ? ch : ''}</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Entities Links */}
            <div className="border-t border-[#1a2538] pt-4 mt-6">
              <span className="text-[10px] text-slate-400 font-bold block mb-2">
                INDEXED REPOSITORY CROSS-REFERENCES:
              </span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {document.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"
                  >
                    <Tag className="w-3 h-3 text-cyan-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Signature Block */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-[10px] text-slate-500">
              <div>
                <span>AUTHENTICATION HASH: </span>
                <span className="font-mono text-cyan-400">SHA256: 8f9b4c027e19d8a3</span>
                <br />
                <span>ARCHIVAL VAULT: Postojna Karst Sub-Chamber 04</span>
              </div>
              <div className="text-right">
                <div className="h-8 border-b border-slate-600 w-48 mb-1 flex items-end justify-center font-serif italic text-slate-300 text-xs">
                  {document.author.split(' ')[0]} {document.author.split(' ')[1] || ''}
                </div>
                <span>AUTHORIZED SIGNATORY BLOCK</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
