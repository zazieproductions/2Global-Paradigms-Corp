import { type FC } from 'react';
import { ArrowRight } from 'lucide-react';
import { useInvestigation } from '@/hooks/use-investigation';
import { useDirectives } from '@/hooks/use-directives';
import { getSeal, SEALS } from '@/content/puzzles/seals';
import { OrderSigil, PlanetGlyph } from '@/components/ui/sigils';

/** Dashboard banner that keeps the investigation front-and-centre. */
export const CaseBanner: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const investigation = useInvestigation();
  const dir = useDirectives();
  const cur = investigation.currentSeal ? getSeal(investigation.currentSeal) : null;
  const step = dir.current?.milestones.find((m) => !m.done);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left relative overflow-hidden p-4 rounded-lg border border-fuchsia-800/50 bg-gradient-to-r from-fuchsia-950/40 via-[#0c0914] to-[#0b0d16] hover:border-fuchsia-500/70 transition-colors cursor-pointer group"
    >
      <div
        className="absolute -right-10 -top-10 text-fuchsia-400/10 ovp-spin-slow pointer-events-none"
        aria-hidden
      >
        <OrderSigil size={200} />
      </div>
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="text-fuchsia-300 ovp-breathe shrink-0" aria-hidden>
            <OrderSigil size={48} />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.35em] text-fuchsia-400">
              {investigation.finaleComplete ? 'CASE CLOSED' : 'ACTIVE INVESTIGATION'} · THE SEVEN SEALS
            </p>
            {cur ? (
              <>
                <p className="font-occult text-lg text-slate-100 flex items-center gap-2">
                  <PlanetGlyph glyph={cur.glyph} style={{ color: cur.accent }} />
                  Seal {cur.numeral}: {cur.title}
                </p>
                <p className="text-[11px] text-slate-400 max-w-2xl">{cur.objective}</p>
                {dir.current && (
                  <p className="text-[11px] text-cyan-300/90 max-w-2xl mt-1">
                    FIELD DIRECTIVE {dir.current.def.numeral} — {dir.current.def.codename}{' '}
                    <span className="text-slate-500 tabular-nums">
                      ({dir.current.milestones.filter((m) => m.done).length}/{dir.current.milestones.length})
                    </span>
                    {step && <span className="text-slate-400"> · next: {step.def.label}</span>}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-occult text-lg text-slate-100">
                  SILENTIUM — the Choir is silent. The archive remains open.
                </p>
                <p className="text-[11px] text-cyan-300/90">
                  FIELD DIRECTIVES {dir.completedDirectives}/{dir.totalDirectives} cleared · FIELD INTEL{' '}
                  {dir.intel.length} filed
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div
            className="flex gap-1"
            role="img"
            aria-label={`${investigation.solved.length} of 7 seals broken`}
          >
            {SEALS.map((s) => (
              <PlanetGlyph
                key={s.id}
                glyph={s.glyph}
                className="text-base"
                style={{
                  color: investigation.isSolved(s.id) ? s.accent : 'var(--color-seal-sealed)',
                  textShadow: investigation.isSolved(s.id) ? `0 0 8px ${s.accent}` : undefined
                }}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 px-3 py-2 rounded bg-fuchsia-700 group-hover:bg-fuchsia-600 text-white text-[11px] font-bold tracking-wider">
            {investigation.solved.length === 0
              ? 'OPEN THE CASE FILE'
              : investigation.finaleComplete
                ? 'REVIEW THE CASE'
                : 'CONTINUE'}{' '}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </button>
  );
};
