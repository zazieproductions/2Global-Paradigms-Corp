import { type FC } from 'react';
import { ArrowRight } from 'lucide-react';
import { useInvestigation } from '@/hooks/use-investigation';
import { getSeal, SEALS } from '@/content/puzzles/seals';
import { OrderPlate, PlanetGlyph } from '@/components/ui/order-marks';

/** Dashboard banner that keeps the investigation front-and-centre. */
export const CaseBanner: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const arg = useInvestigation();
  const cur = arg.currentSeal ? getSeal(arg.currentSeal) : null;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left relative overflow-hidden p-4 rounded-lg border border-fuchsia-800/50 bg-gradient-to-r from-fuchsia-950/40 via-[#0c0914] to-[#0b0d16] hover:border-fuchsia-500/70 transition-colors cursor-pointer group"
    >
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <OrderPlate size={44} className="shrink-0" />
          <div>
            <p className="text-[10px] tracking-[0.35em] text-fuchsia-400">
              {arg.finaleComplete ? 'CASE CLOSED' : 'ACTIVE INVESTIGATION'} · THE SEVEN SEALS
            </p>
            {cur ? (
              <>
                <p className="font-order text-lg text-slate-100 flex items-center gap-2">
                  <PlanetGlyph glyph={cur.glyph} style={{ color: cur.accent }} />
                  Seal {cur.numeral}: {cur.title}
                </p>
                <p className="text-[11px] text-slate-400 max-w-2xl">{cur.objective}</p>
              </>
            ) : (
              <p className="font-order text-lg text-slate-100">
                SILENTIUM. The Choir is silent, and the archive stays open.
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-1" role="img" aria-label={`${arg.solved.length} of 7 seals broken`}>
            {SEALS.map((s) => (
              <PlanetGlyph
                key={s.id}
                glyph={s.glyph}
                className="text-base"
                style={{
                  color: arg.isSolved(s.id) ? s.accent : 'var(--color-seal-sealed)'
                }}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded bg-fuchsia-700 group-hover:bg-fuchsia-600 text-white text-[11px] font-bold tracking-wider">
            {arg.solved.length === 0
              ? 'OPEN THE CASE FILE'
              : arg.finaleComplete
                ? 'REVIEW THE CASE'
                : 'CONTINUE'}{' '}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </button>
  );
};
