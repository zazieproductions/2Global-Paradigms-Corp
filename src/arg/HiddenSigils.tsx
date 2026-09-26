import React from 'react';
import { X } from 'lucide-react';
import { useArg } from './ArgContext';
import { FRAGMENTS } from './seals';
import { ChoirGlyph, PlanetGlyph } from './sigils';
import { gpcAudio } from '../lib/audioEngine';
import type { ActiveTab } from '../types';

// Where each fragment sits on its page (kept away from the usual header controls)
const PLACEMENT: Record<string, React.CSSProperties> = {
  'frag-news': { top: 10, left: '47%' },
  'frag-careers': { top: 12, left: '55%' },
  'frag-timeline': { top: 8, left: '43%' },
  'frag-values': { top: 14, left: '60%' },
  'frag-products': { top: 10, left: '51%' },
  'frag-reports': { top: 9, left: '39%' },
  'frag-deadlinks': { top: 12, left: '57%' }
};

/** Renders the Choir Script fragment hidden on the current page, if any. */
export const HiddenSigilLayer: React.FC<{ activeTab: ActiveTab }> = ({ activeTab }) => {
  const { fragments, collectFragment, finaleComplete } = useArg();
  const frag = FRAGMENTS.find((f) => f.tab === activeTab);
  if (!frag) return null;
  const found = fragments.includes(frag.id);
  return (
    <button
      onClick={() => {
        if (found) return;
        gpcAudio.playSealBreak();
        collectFragment(frag.id);
      }}
      className={`ovp-fragment ${found ? 'is-found' : ''} absolute z-30 p-1 rounded-full cursor-pointer`}
      style={PLACEMENT[frag.id]}
      title={found ? 'A recovered fragment of the Choir Script' : undefined}
      aria-label="Strange glyph"
    >
      <span className="flex items-center gap-0.5 px-1.5 py-1 rounded-full border border-rose-400/60 bg-black/70">
        {frag.letters.map((l) => (
          <ChoirGlyph key={l} letter={l} size={18} color={finaleComplete ? '#e2e8f0' : '#fb7185'} />
        ))}
      </span>
    </button>
  );
};

/** Toasts that appear when seals break / fragments are found. */
export const RevelationToasts: React.FC = () => {
  const { revelations, dismissRevelation } = useArg();
  return (
    <div className="fixed bottom-16 right-4 z-[60] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
      {revelations.map((r) => (
        <div
          key={r.id}
          className="ovp-revelation relative p-3 pr-8 rounded border bg-[#07060c]/95 backdrop-blur shadow-2xl"
          style={{ borderColor: r.accent || '#c026d3', boxShadow: `0 0 30px ${(r.accent || '#c026d3')}33` }}
        >
          <button onClick={() => dismissRevelation(r.id)} className="absolute top-2 right-2 text-slate-500 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex gap-3 items-start">
            {r.glyph && <PlanetGlyph glyph={r.glyph} className="text-2xl leading-none" style={{ color: r.accent }} />}
            <div>
              <p className="font-occult text-xs tracking-widest font-bold" style={{ color: r.accent }}>
                {r.title}
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{r.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
