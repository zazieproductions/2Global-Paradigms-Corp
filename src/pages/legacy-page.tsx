import { Link } from 'react-router-dom';
import { Activity, ArrowDownRight, History } from 'lucide-react';
import { RESTORATION_LOGS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { Badge } from '@/components/ui/badge';
import type { BadgeTone } from '@/components/ui/badge';
import { Panel, SectionLabel } from '@/components/ui/panel';
import { SystemNotice } from '@/components/ui/system-notice';
import { ViewHeader } from '@/components/ui/view-header';
import type { RestorationLog } from '@/types';

const ACTION_TONE = {
  recovered: 'info',
  restored: 'success',
  reindexed: 'signal',
  repaired: 'success',
  quarantined: 'warning',
  lost: 'danger'
} satisfies Record<RestorationLog['action'], BadgeTone>;

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const AFFECTED_RECORDS = new Set(RESTORATION_LOGS.flatMap((entry) => entry.affected)).size;
const LATEST_ENTRY = RESTORATION_LOGS[RESTORATION_LOGS.length - 1];

/** The live in-world operator ledger for the recovered archive mirror. */
export default function LegacyPage() {
  return (
    <ArchivePage className="space-y-6">
      <ViewHeader
        icon={History}
        iconClassName="text-amber-400"
        title="Restoration Ledger"
        subtitle="GPC // MIRROR RECOVERY OPERATIONS"
        aside={
          <>
            <Badge tone="warning">{RESTORATION_LOGS.length} LOGS</Badge>
            {LATEST_ENTRY && <Badge tone="neutral">UPDATED {formatDate(LATEST_ENTRY.date)}</Badge>}
          </>
        }
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Panel tone="signal" as="section" aria-labelledby="ledger-overview">
          <div className="flex items-center justify-between gap-3 mb-4">
            <SectionLabel icon={<Activity className="w-3.5 h-3.5" aria-hidden />}>
              MIRROR STATUS // POSTOJNA MASTER VOLUME
            </SectionLabel>
            <span className="text-micro text-slate-500 font-mono">PROVISIONAL</span>
          </div>
          <h2 id="ledger-overview" className="sr-only">
            Current archive mirror integrity estimate
          </h2>

          {LATEST_ENTRY ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <span className="text-caption text-slate-400">MIRROR INTEGRITY ESTIMATE</span>
                  <span className="text-xl font-bold text-cyan-300 font-mono">{LATEST_ENTRY.integrity}%</span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-inset border border-line"
                  role="progressbar"
                  aria-label="Latest mirror integrity estimate"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={LATEST_ENTRY.integrity}
                >
                  <div
                    className="h-full bg-gradient-to-r from-cyan-700 via-cyan-500 to-emerald-400"
                    style={{ width: `${LATEST_ENTRY.integrity}%` }}
                  />
                </div>
                <p className="mt-2 text-micro text-slate-500">
                  Operator estimate following {LATEST_ENTRY.code}. Hash verification is not implied.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                <div className="p-3 rounded border border-line bg-inset">
                  <span className="block text-micro text-slate-500">LOGGED ACTIONS</span>
                  <span className="block mt-1 text-lg font-bold text-slate-100 font-mono">
                    {RESTORATION_LOGS.length.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="p-3 rounded border border-line bg-inset">
                  <span className="block text-micro text-slate-500">AFFECTED RECORDS</span>
                  <span className="block mt-1 text-lg font-bold text-slate-100 font-mono">
                    {AFFECTED_RECORDS.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-label text-slate-400">No operator entries are mounted.</p>
          )}
        </Panel>

        <SystemNotice kind="info" title="Integrity estimates are provisional" code="RESTORE // MIRROR">
          A record marked recovered or repaired may still have missing body text, unresolved citations or
          unverified source data. Check each entry before relying on a reconstructed copy.
        </SystemNotice>

        <section aria-labelledby="ledger-entries">
          <div className="flex items-center justify-between gap-3 mb-3">
            <SectionLabel>OPERATOR ACTIVITY</SectionLabel>
            <span className="text-micro text-slate-500 font-mono">LATEST ENTRY FIRST</span>
          </div>
          <h2 id="ledger-entries" className="sr-only">
            Restoration log entries
          </h2>

          {RESTORATION_LOGS.length > 0 ? (
            <ol className="relative space-y-4 border-l border-line-strong ml-2 pl-5 sm:pl-7">
              {[...RESTORATION_LOGS].reverse().map((entry) => (
                <li key={entry.id} id={entry.id} className="relative">
                  <span
                    className="absolute -left-[1.68rem] sm:-left-[2.18rem] top-5 flex h-3 w-3 items-center justify-center rounded-full border border-cyan-500/60 bg-panel shadow-[0_0_10px_rgba(34,211,238,0.16)]"
                    aria-hidden="true"
                  >
                    <span className="h-1 w-1 rounded-full bg-cyan-300" />
                  </span>

                  <Panel as="article" aria-labelledby={`${entry.id}-title`} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <time
                          dateTime={entry.date}
                          className="text-caption font-bold text-slate-200 font-mono"
                        >
                          {formatDate(entry.date)}
                        </time>
                        <Badge tone={ACTION_TONE[entry.action]}>{entry.action.toUpperCase()}</Badge>
                      </div>
                      <span className="text-micro text-slate-500 font-mono">{entry.code}</span>
                    </div>

                    <h3
                      id={`${entry.id}-title`}
                      className="text-label sm:text-base font-bold text-white leading-snug"
                    >
                      {entry.title}
                    </h3>

                    <p className="text-label text-slate-300 leading-relaxed">{entry.notes}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-line-subtle">
                      <div>
                        <span className="block text-micro text-slate-500">RESPONSIBLE OPERATOR</span>
                        <span className="block mt-1 text-caption text-slate-300 font-mono">
                          {entry.operator}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-micro text-slate-500">INTEGRITY ESTIMATE</span>
                          <span className="text-caption text-cyan-300 font-mono">{entry.integrity}%</span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-inset">
                          <div
                            className="h-full bg-cyan-600/80"
                            style={{ width: `${entry.integrity}%` }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {entry.affected.length > 0 ? (
                        <>
                          <span className="text-micro text-slate-500 mr-1">AFFECTED</span>
                          {entry.affected.map((record) => (
                            <Badge key={record} tone="neutral">
                              {record}
                            </Badge>
                          ))}
                        </>
                      ) : (
                        <span className="text-micro text-slate-500">AFFECTED INDEX / VOLUME METADATA</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} tone="info">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Panel>
                </li>
              ))}
            </ol>
          ) : (
            <Panel as="div" className="text-label text-slate-400">
              No restoration entries are currently available.
            </Panel>
          )}
        </section>

        <Panel
          as="nav"
          aria-label="Archive destinations"
          className="flex flex-wrap items-center gap-x-2 gap-y-1.5"
        >
          <SectionLabel>CONTINUE INTO THE ARCHIVE</SectionLabel>
          <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" aria-hidden />
          <Link
            to="/documents"
            className="text-caption text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
          >
            Document vault
          </Link>
          <span className="text-slate-600" aria-hidden>
            ·
          </span>
          <Link
            to="/stations"
            className="text-caption text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
          >
            Station network
          </Link>
        </Panel>
      </div>
    </ArchivePage>
  );
}
