import type { CSSProperties } from 'react';
import type { ActiveTab } from '@/types';
import { FRAGMENTS } from '@/content/puzzles/seals';
import { ChoirGlyph } from '@/components/ui/sigils';
import { useInvestigation } from '@/hooks/use-investigation';
import { gpcAudio } from '@/lib/audio/audio-engine';

// Where each fragment sits on its page (kept away from the usual header controls)
const PLACEMENT: Record<string, CSSProperties> = {
  'frag-news': { top: 10, left: '47%' },
  'frag-careers': { top: 12, left: '55%' },
  'frag-timeline': { top: 8, left: '43%' },
  'frag-values': { top: 14, left: '60%' },
  'frag-products': { top: 10, left: '51%' },
  'frag-reports': { top: 9, left: '39%' },
  'frag-deadlinks': { top: 12, left: '57%' }
};

/**
 * Renders the Choir Script fragment hidden on the current page, if any.
 * Faint by design, but never hover-only: it is a real button in the tab
 * order, it brightens on keyboard focus, and the Sanctum lists every
 * fragment's page once a hint is opened.
 */
export function HiddenSigilLayer({ activeTab }: { activeTab: ActiveTab | null }) {
  const { fragments, collectFragment, finaleComplete } = useInvestigation();
  const frag = FRAGMENTS.find((f) => f.tab === activeTab);
  if (!frag) return null;
  const found = fragments.includes(frag.id);
  return (
    <button
      type="button"
      onClick={() => {
        if (found) return;
        gpcAudio.playSealBreak();
        collectFragment(frag.id);
      }}
      className={`ovp-fragment ${found ? 'is-found' : ''} absolute z-30 p-1 rounded-full cursor-pointer`}
      style={PLACEMENT[frag.id]}
      title={found ? 'A recovered fragment of the Choir Script' : undefined}
      aria-label={
        found
          ? `Recovered Choir Script fragment: ${frag.letters.join(', ')}`
          : 'Strange glyph — take the Choir Script fragment'
      }
    >
      <span className="flex items-center gap-0.5 px-1.5 py-1 rounded-full border border-rose-400/60 bg-black/70">
        {frag.letters.map((l) => (
          <ChoirGlyph
            key={l}
            letter={l}
            size={18}
            color={finaleComplete ? 'var(--color-seal-moon)' : '#fb7185'}
          />
        ))}
      </span>
    </button>
  );
}
