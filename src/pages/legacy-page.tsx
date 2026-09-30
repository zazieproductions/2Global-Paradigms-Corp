import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, ExternalLink, History, Quote, Table2 } from 'lucide-react';
import { ERA_ONE, ERA_TWO, LEGACY_PAGE, absoluteUrl } from '@/config/seo';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { Panel, SectionLabel } from '@/components/ui/panel';
import { Badge } from '@/components/ui/badge';
import { SystemNotice } from '@/components/ui/system-notice';
import { FictionNotice } from '@/components/ui/fiction-notice';
import { cn } from '@/lib/utils/cn';

/**
 * THE LEGACY FILE — the out-of-world provenance page for this domain.
 *
 * Everything else in the archive is in-world: records belonging to a fictional
 * company. This page is not. It documents what the real URL actually was — a
 * 2006 fan hoax built during The Lost Experience, twenty years dark, and a
 * 2026 reopening as an original work — and it is the page that carries the
 * site's SEO and generative-engine weight. See docs/SEO.md.
 *
 * Structure is deliberate. Answer first, then a fact table, then the eras,
 * then questions phrased the way people actually ask them, then sources.
 * Real headings, real lists, real tables, short paragraphs: the formats both
 * search engines and answer engines extract most reliably.
 *
 * Copy lives in `@/config/seo` so no fact is stated twice in two places, and
 * so `src/tests/seo.test.ts` can hold this page, `index.html` and `llms.txt`
 * to the same account.
 */
export default function LegacyPage() {
  return (
    <ArchivePage className="space-y-6">
      <ViewHeader
        icon={History}
        iconClassName="text-amber-400"
        title={LEGACY_PAGE.title}
        subtitle={LEGACY_PAGE.subtitle}
        aside={
          <>
            <Badge tone="warning">OUT OF WORLD</Badge>
            <Badge tone="neutral">{ERA_ONE.window}</Badge>
            <Badge tone="success">{ERA_TWO.window}</Badge>
          </>
        }
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <SystemNotice
          kind="info"
          title="This file is not part of the fiction"
          code="PROV-001"
          action={
            <Link to="/" className="text-caption text-cyan-400 hover:text-cyan-300 underline">
              Enter the archive
            </Link>
          }
        >
          The records in this archive belong to an invented company. This page does not: it describes the real
          history of the real domain you are standing on, including a hoax that was never authorized by anyone
          and a reopening that is an original work. Nothing below is in-world, and nothing below is a clue.
        </SystemNotice>

        {/* ── The answer, first ─────────────────────────────────────────── */}
        <Panel tone="warning" as="section" aria-labelledby="legacy-lede">
          <SectionLabel className="mb-3">SUMMARY // READ THIS FIRST</SectionLabel>
          <h2 id="legacy-lede" className="sr-only">
            What globalparadigmscorp.com is
          </h2>
          <div className="space-y-3 text-label text-slate-300 leading-relaxed">
            {LEGACY_PAGE.lede.map((paragraph, i) => (
              <p key={i} className={cn(i === 0 && 'text-slate-100 font-bold')}>
                {paragraph}
              </p>
            ))}
          </div>
        </Panel>

        {/* ── The extractable fact table ────────────────────────────────── */}
        <Panel as="section" aria-labelledby="legacy-facts">
          <SectionLabel icon={<Table2 className="w-3.5 h-3.5" aria-hidden />} className="mb-3">
            THE RECORD, IN ROWS
          </SectionLabel>
          <h2 id="legacy-facts" className="sr-only">
            Key facts about globalparadigmscorp.com
          </h2>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-caption border-collapse">
              <caption className="sr-only">Key facts about globalparadigmscorp.com</caption>
              <tbody>
                {LEGACY_PAGE.factTable.map((row) => (
                  <tr key={row.field} className="border-b border-line-subtle last:border-0 align-top">
                    <th
                      scope="row"
                      className="text-left font-normal text-slate-500 py-2 pr-4 whitespace-nowrap w-1/3"
                    >
                      {row.field}
                    </th>
                    <td className="text-left text-slate-200 py-2">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* ── The eras ──────────────────────────────────────────────────── */}
        {LEGACY_PAGE.sections.map((section) => (
          <Panel key={section.id} as="section" aria-labelledby={`legacy-${section.id}`}>
            {section.eyebrow && (
              <SectionLabel className="mb-2 text-amber-400/80">{section.eyebrow}</SectionLabel>
            )}
            <h2
              id={`legacy-${section.id}`}
              className="text-base font-bold text-white tracking-wide mb-3 font-occult"
            >
              {section.heading}
            </h2>

            {section.paragraphs && (
              <div className="space-y-3 text-label text-slate-300 leading-relaxed">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            {section.list && (
              <ul className="mt-4 space-y-1.5 text-label text-slate-300 list-none">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-amber-500 shrink-0" aria-hidden>
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.quotes && (
              <div className="mt-4 space-y-3">
                {section.quotes.map((quote) => (
                  <figure
                    key={quote.label}
                    className="bg-inset border border-line border-l-2 border-l-amber-600/60 rounded p-3.5"
                  >
                    <figcaption className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                      <span className="text-caption font-bold text-amber-300 uppercase tracking-wider">
                        {quote.label}
                      </span>
                      <span className="text-micro text-slate-500">{quote.source}</span>
                    </figcaption>
                    <blockquote className="text-label text-slate-400 leading-relaxed font-mono">
                      <Quote className="inline w-3 h-3 mr-1.5 text-slate-600 align-super" aria-hidden />
                      {quote.text}
                    </blockquote>
                    {quote.attribution && (
                      <p className="mt-2 text-caption text-slate-500 italic">— {quote.attribution}</p>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {/* The 2006 clients and invented staff, as tables. */}
            {section.staffTable && (
              <div className="mt-4 space-y-4">
                <div>
                  <SectionLabel className="mb-2">CLIENTS LISTED ON THE 2006 HOMEPAGE</SectionLabel>
                  <ul className="flex flex-wrap gap-2">
                    {ERA_ONE.clients.map((client) => (
                      <li key={client}>
                        <Badge tone="danger" size="sm">
                          {client}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-caption text-slate-500">
                    All three are fictional clients of a fictional firm. Two were invented for a television
                    franchise this site has no connection to; the third is a real company that was named
                    without its knowledge.
                  </p>
                </div>

                <div className="overflow-x-auto scrollbar-thin">
                  <SectionLabel className="mb-2">STAFF LISTED ON THE 2006 HOMEPAGE</SectionLabel>
                  <table className="w-full text-caption border-collapse">
                    <caption className="sr-only">Invented staff named on the 2006 hoax page</caption>
                    <thead>
                      <tr className="border-b border-line-strong text-left">
                        <th scope="col" className="py-1.5 pr-4 font-bold text-slate-400">
                          NAME
                        </th>
                        <th scope="col" className="py-1.5 font-bold text-slate-400">
                          RECORD
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ERA_ONE.staff.map((person) => (
                        <tr key={person.name} className="border-b border-line-subtle last:border-0 align-top">
                          <th
                            scope="row"
                            className="py-2 pr-4 text-left font-bold text-slate-200 whitespace-nowrap"
                          >
                            {person.name}
                          </th>
                          <td className="py-2 text-left text-slate-400">{person.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-caption text-slate-500">
                  The 2006 page also linked to a real organisation, {ERA_ONE.linkedOut.name} (
                  {ERA_ONE.linkedOut.url}), from its Terms of Use. The link is recorded here and not
                  reproduced, because it is the one part of Era I that pointed at something real.
                </p>
              </div>
            )}

            {section.callout && (
              <div className="mt-4 flex gap-2.5 p-3 rounded border border-rose-800/60 bg-rose-950/20">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden />
                <p className="text-caption text-rose-200/90 leading-relaxed">{section.callout}</p>
              </div>
            )}
          </Panel>
        ))}

        {/* ── Questions, phrased the way they are asked ─────────────────── */}
        <Panel as="section" aria-labelledby="legacy-faq">
          <SectionLabel className="mb-3">QUESTIONS THE ARCHIVE IS ASKED</SectionLabel>
          <h2 id="legacy-faq" className="text-base font-bold text-white tracking-wide mb-4 font-occult">
            Frequently asked
          </h2>
          <dl className="space-y-5">
            {LEGACY_PAGE.faq.map((entry) => (
              <div key={entry.q}>
                <dt>
                  <h3 className="text-label font-bold text-cyan-300 leading-relaxed">{entry.q}</h3>
                </dt>
                <dd className="mt-1.5 text-label text-slate-400 leading-relaxed">{entry.a}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        {/* ── Sources ───────────────────────────────────────────────────── */}
        <Panel as="section" aria-labelledby="legacy-sources">
          <SectionLabel icon={<BookOpen className="w-3.5 h-3.5" aria-hidden />} className="mb-3">
            SOURCES FOR ERA I
          </SectionLabel>
          <h2 id="legacy-sources" className="sr-only">
            Sources for the 2006 hoax
          </h2>
          <p className="text-caption text-slate-500 mb-3">
            We are the authoritative source for Era II and for the fact of the reopening. We are not the
            authoritative source for Era I — these are. Every 2006 detail on this page is drawn from them.
          </p>
          <ul className="space-y-3">
            {LEGACY_PAGE.sources.map((source) => (
              <li key={source.url} className="text-caption">
                <a
                  href={source.url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1.5 font-bold"
                >
                  {source.title}
                  <ExternalLink className="w-3 h-3 shrink-0" aria-hidden />
                </a>
                <span className="text-slate-500"> · {source.publisher}</span>
                <p className="mt-1 text-slate-400 leading-relaxed">{source.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 pt-3 border-t border-line-subtle text-caption text-slate-500">
            Canonical address of this page:{' '}
            <span className="text-slate-400 break-all">{absoluteUrl('/legacy')}</span>
          </p>
        </Panel>

        {/* ── Onward ────────────────────────────────────────────────────── */}
        <Panel tone="success" as="nav" aria-label="Into the archive">
          <SectionLabel className="mb-3">ERA II // WHERE TO GO NEXT</SectionLabel>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/" className="text-caption text-cyan-300 hover:text-cyan-200 underline">
              Command Dashboard — boot the terminal
            </Link>
            <span className="text-slate-600" aria-hidden>
              ·
            </span>
            <Link to="/sanctum" className="text-caption text-fuchsia-300 hover:text-fuchsia-200 underline">
              The Seven Seals — the main investigation
            </Link>
            <span className="text-slate-600" aria-hidden>
              ·
            </span>
            <Link to="/documents" className="text-caption text-cyan-300 hover:text-cyan-200 underline">
              Master Document Vault — {ERA_TWO.records} records
            </Link>
            <span className="text-slate-600" aria-hidden>
              ·
            </span>
            <Link to="/timeline" className="text-caption text-cyan-300 hover:text-cyan-200 underline">
              Historical Timeline ({ERA_TWO.inWorldSpan})
            </Link>
          </div>
        </Panel>

        <FictionNotice variant="long" className="pt-1" />
      </div>
    </ArchivePage>
  );
}
