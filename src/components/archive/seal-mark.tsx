import type { DocumentRecord } from '@/types';
import { clearanceTier } from '@/lib/archive/clearance';
import { LEVEL_CORRESPONDENCE } from '@/content/puzzles/seals';

/**
 * Inline marks beside a record code: a padlock when the record is classified
 * above the operator's clearance, and ✶ ORDO for the inner order's own papers.
 * Text labels carry the meaning; colour is decorative.
 */
export function SealMark({
  doc,
  clearance
}: {
  doc: Pick<DocumentRecord, 'clearance' | 'tags'>;
  clearance: string;
}) {
  const need = clearanceTier(doc.clearance);
  const sealed = need > clearanceTier(clearance);
  const isOrder = doc.tags.includes('Order');
  const corr = LEVEL_CORRESPONDENCE[need];
  if (!sealed && !isOrder) return null;
  return (
    <>
      {sealed && (
        <span
          title={`Sealed — requires Level ${need}${corr ? ` (${corr.planet})` : ''}. Break more seals in THE SEVEN SEALS.`}
          className="inline-flex items-center gap-0.5 text-micro px-1.5 rounded border border-fuchsia-700/60 bg-fuchsia-950/40 text-fuchsia-300 font-bold w-fit"
        >
          <span aria-hidden>
            🔒{'\uFE0E'} {corr?.glyph}
            {'\uFE0E'}
          </span>
          <span className="sr-only">Sealed, requires level</span> L{need}
        </span>
      )}
      {isOrder && (
        <span
          title="Ordo Vocis Profundae — inner-order material"
          className="text-micro px-1.5 rounded border border-amber-600/50 bg-amber-950/30 text-amber-300 font-bold w-fit"
        >
          <span aria-hidden>✶</span> ORDO
        </span>
      )}
    </>
  );
}
