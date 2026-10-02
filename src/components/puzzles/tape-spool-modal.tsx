/**
 * THE TAPE SPOOL — the Directive 17 salvage surface.
 *
 * A purged record arrives as scrambled shard fragments. The player splices
 * them back together by ordering the reel locators ascending (offsets, watch
 * timestamps, frame numbers). `isSpliceCorrect()` judges the order — this
 * component only renders its verdict. A spliced ghost is re-readable at any
 * time, and once all three are spliced the spool replays Directive 17 itself.
 */
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CassetteTape, ShieldAlert, Undo2 } from 'lucide-react';
import type { PurgedGhost, SalvageShard } from '@/types';
import { DIRECTIVE_17 } from '@/content';
import {
  allGhostsSalvaged,
  getGhost,
  ghostBody,
  isSpliceCorrect,
  moveShard,
  scrambledShards
} from '@/lib/puzzles/salvage';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { notify } from '@/hooks/use-investigation';
import { Modal } from '@/components/ui/modal';
import { SystemNotice } from '@/components/ui/system-notice';
import { cn } from '@/lib/utils/cn';

interface TapeSpoolModalProps {
  /** `PurgedGhost.id` to replay, or null when the spool is closed. */
  ghostId: string | null;
  onClose: () => void;
}

export function TapeSpoolModal({ ghostId, onClose }: TapeSpoolModalProps) {
  const ghost = ghostId ? getGhost(ghostId) : undefined;
  if (!ghost) return null;
  // Keyed so the scramble and any local state reset when a different ghost opens.
  return <TapeSpool key={ghost.id} ghost={ghost} onClose={onClose} />;
}

function TapeSpool({ ghost, onClose }: { ghost: PurgedGhost; onClose: () => void }) {
  const progression = useProgression();
  const { state, salvageGhost } = progression;
  const salvaged = state.investigation.salvaged.includes(ghost.id);
  const directiveComplete = allGhostsSalvaged(state);

  const [order, setOrder] = useState<SalvageShard[]>(() => scrambledShards(ghost));
  const [failed, setFailed] = useState(false);
  const [spliced, setSpliced] = useState(false);
  const solved = salvaged || spliced;

  const handleSplice = () => {
    if (isSpliceCorrect(order.map((s) => s.order))) {
      gpcAudio.playUiSound('grant');
      salvageGhost(ghost.id);
      setSpliced(true);
      setFailed(false);
      const completesDirective = !directiveComplete && state.investigation.salvaged.length + 1 >= 3;
      notify(
        'TAPE GHOST SPLICED',
        completesDirective
          ? `${ghost.code} — and with it, the last of the struck files. The spool is replaying Directive 17.`
          : `${ghost.code} — the tape remembers. The live index still refuses it.`,
        '◧',
        'var(--color-alert)'
      );
    } else {
      gpcAudio.playUiSound('deny');
      setFailed(true);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      variant="window"
      size="2xl"
      tone="warning"
      icon={CassetteTape}
      title={
        <span className="text-slate-200 tracking-wider text-xs">
          <span className="hidden sm:inline">GPC://TAPE_SPOOL // SECTOR SALVAGE: </span>
          {ghost.code}
        </span>
      }
      bodyClassName="p-3 sm:p-5 bg-canvas"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Ghost header */}
        <div className="p-3 sm:p-4 rounded border border-amber-700/40 bg-amber-950/10 space-y-1.5">
          <p className="text-micro tracking-[0.3em] text-amber-400/80">
            TAPE GHOST · STRUCK UNDER DIRECTIVE 17 · {ghost.purgedOn}
          </p>
          <h3 className="text-sm md:text-base font-bold text-white leading-snug">{ghost.title}</h3>
          <p className="text-caption text-slate-400">Original record: {ghost.date}</p>
          <p className="text-label text-slate-300 leading-relaxed">{ghost.preamble}</p>
          <p className="text-caption text-amber-300/90 italic">{ghost.locatorNote}</p>
        </div>

        {solved ? (
          <RecoveredGhost ghost={ghost} justSpliced={spliced} />
        ) : (
          <>
            {/* Shards out of order */}
            <ol className="space-y-2" aria-label="Tape fragments, in current spool order">
              {order.map((shard, i) => (
                <li
                  key={shard.locator}
                  className="flex items-start gap-2 sm:gap-3 p-2.5 rounded border border-line bg-panel"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        gpcAudio.playUiSound('click');
                        setOrder((l) => moveShard(l, i, -1));
                        setFailed(false);
                      }}
                      disabled={i === 0}
                      aria-label={`Move fragment ${shard.locator} earlier`}
                      className="tap-target p-1.5 rounded border border-line-bright bg-hover text-slate-300 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        gpcAudio.playUiSound('click');
                        setOrder((l) => moveShard(l, i, 1));
                        setFailed(false);
                      }}
                      disabled={i === order.length - 1}
                      aria-label={`Move fragment ${shard.locator} later`}
                      className="tap-target p-1.5 rounded border border-line-bright bg-hover text-slate-300 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" aria-hidden />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-caption text-amber-300/90 font-bold">
                      {shard.locator}
                      <span className="text-slate-600 font-normal">
                        {' '}
                        · fragment {i + 1} of {order.length}
                      </span>
                    </p>
                    <p className="text-label text-slate-300 leading-relaxed">{shard.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSplice}
                className="tap-target px-5 py-2.5 rounded border border-amber-500/70 bg-amber-950/60 text-amber-200 hover:bg-amber-900/60 font-bold tracking-widest text-label cursor-pointer"
              >
                SPLICE THE TAPE
              </button>
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setOrder(scrambledShards(ghost));
                  setFailed(false);
                }}
                className="tap-target flex items-center gap-1.5 px-3 py-2.5 rounded border border-line-bright bg-hover text-slate-400 hover:text-slate-200 text-caption cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" aria-hidden /> re-spool
              </button>
            </div>

            <div aria-live="polite">
              {failed && (
                <SystemNotice kind="denied" compact title="The reels fight each other" code="SPLICE-X">
                  The sprocket holes will not line up in this order. The tape only plays one way — walk the
                  fragments back to their places.
                </SystemNotice>
              )}
            </div>
          </>
        )}

        {/* The payoff: Directive 17 itself, once every ghost is spliced. */}
        {directiveComplete && <DirectiveSealed />}
      </div>
    </Modal>
  );
}

/** The recovered body, in tape order. */
function RecoveredGhost({ ghost, justSpliced }: { ghost: PurgedGhost; justSpliced: boolean }) {
  const body = useMemo(() => ghostBody(ghost), [ghost]);
  return (
    <section className={cn('space-y-3', justSpliced && 'ovp-revelation')} aria-label="Recovered text">
      <SystemNotice kind="info" compact title="Splice holds — recovered text follows" code="SPOOL-OK">
        {ghost.closing}
      </SystemNotice>
      <div className="p-3 sm:p-4 rounded border border-line bg-panel">
        <p className="text-micro tracking-[0.3em] text-slate-500 mb-2">
          RECOVERED TEXT · TAPE ORDER · {ghost.code}
        </p>
        <div className="font-mono text-label text-slate-200 leading-relaxed whitespace-pre-line">{body}</div>
      </div>
      <p className="text-caption text-slate-500 italic flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" aria-hidden />
        The live index still refuses this file. It exists in no vault, no search, no export — only here, on
        the spool.
      </p>
    </section>
  );
}

/** The unquiet tape's last word: the purge order that made the ghosts. */
function DirectiveSealed() {
  return (
    <section
      className="p-3 sm:p-4 rounded border border-rose-700/50 bg-rose-950/10 space-y-2 ovp-revelation"
      aria-label="Recovered directive"
    >
      <p className="text-micro tracking-[0.3em] text-rose-400/80">
        ALL GHOSTS SPLICED · THE SPOOL REPLAYS ITS OWN AUTHORIZATION
      </p>
      <h3 className="text-sm font-bold text-white">{DIRECTIVE_17.title}</h3>
      <p className="text-caption text-slate-400">
        {DIRECTIVE_17.code} · signed {DIRECTIVE_17.signatory}
      </p>
      <div className="space-y-2">
        {DIRECTIVE_17.lines.map((line, i) => (
          <p key={i} className="text-label text-rose-100/90 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
