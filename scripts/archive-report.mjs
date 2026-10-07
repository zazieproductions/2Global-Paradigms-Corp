#!/usr/bin/env node
/**
 * archive:report — regenerate the machine-derived reference in docs/generated/.
 *
 *   npm run archive:report         write the files
 *   npm run archive:report:check   fail (exit 1) if they are out of date
 *
 * Everything in docs/generated/ is DERIVED. Never edit it by hand: edit the
 * collection in src/content/** (or the canon registry in src/lib/archive/canon.ts)
 * and re-run. Output is deterministic — no timestamps — so the check mode can
 * diff byte-for-byte in CI.
 */
import { createServer } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'docs', 'generated');
const CHECK = process.argv.includes('--check');

const server = await createServer({
  configFile: join(ROOT, 'vite.config.ts'),
  server: { middlewareMode: true },
  logLevel: 'error'
});

const content = await server.ssrLoadModule('@/content');
const seals = await server.ssrLoadModule('@/content/puzzles/seals');
const choir = await server.ssrLoadModule('@/lib/puzzles/choir-script');
const records = await server.ssrLoadModule('@/lib/archive/records');
const nav = await server.ssrLoadModule('@/config/navigation');
const clearance = await server.ssrLoadModule('@/config/clearance');
const canon = await server.ssrLoadModule('@/lib/archive/canon');
const investigation = await server.ssrLoadModule('@/lib/puzzles/investigation');
const termMod = await server.ssrLoadModule('@/content/puzzles/terminal-text');
const puzzlesConfig = await server.ssrLoadModule('@/config/puzzles');
const purge = await server.ssrLoadModule('@/content/restoration/purge-manifest');

await server.close();

const entries = records.getArchiveEntries();
const esc = (s) =>
  String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
const tier = (c) => (c ? Number(/Level (\d)/.exec(c)?.[1] ?? 0) : 0);

// ---------------------------------------------------------------------------
// Shared fragments
// ---------------------------------------------------------------------------

const HEADER = (title, purpose) =>
  `<!-- GENERATED FILE — DO NOT EDIT. -->\n` +
  `<!-- Regenerate with: npm run archive:report   Verify with: npm run archive:report:check -->\n\n` +
  `# ${title}\n\n${purpose}\n`;

const COLLECTIONS = [
  ['document', 'Documents', 'DOCUMENTS', 'src/content/documents/'],
  ['personnel', 'Personnel', 'PERSONNEL', 'src/content/personnel/personnel.ts'],
  ['office', 'Offices & stations', 'REGIONAL_STATIONS', 'src/content/offices/stations.ts'],
  ['project', 'Projects', 'INTERNAL_PROGRAMS', 'src/content/projects/programs.ts'],
  ['department', 'Departments', 'DEPARTMENTS', 'src/content/departments/departments.ts'],
  ['product', 'Recalled products', 'DISCONTINUED_PRODUCTS', 'src/content/corporate/discontinued-products.ts'],
  ['audio', 'Audio artifacts', 'AUDIO_ARTIFACTS', 'src/content/audio/audio-artifacts.ts'],
  ['email', 'Email threads', 'EMAIL_THREADS', 'src/content/communications/emails.ts'],
  ['meeting', 'Meeting minutes', 'MEETING_RECORDS', 'src/content/communications/meetings.ts'],
  ['press', 'Press releases', 'PRESS_RELEASES', 'src/content/communications/press-releases.ts'],
  ['timeline', 'Timeline entries', 'TIMELINE_ENTRIES', 'src/content/history/timeline.ts'],
  ['newsletter', 'Newsletters', 'NEWSLETTERS', 'src/content/communications/newsletters.ts'],
  ['training', 'Training modules', 'TRAINING_MODULES', 'src/content/corporate/training-modules.ts'],
  ['job', 'Job postings', 'JOB_POSTINGS', 'src/content/corporate/job-postings.ts'],
  ['dead-link', 'Dead links', 'DEAD_LINKS', 'src/content/web/dead-links.ts'],
  ['annual-report', 'Annual reports', 'ANNUAL_REPORTS', 'src/content/corporate/annual-reports.ts'],
  ['restoration-log', 'Restoration logs', 'RESTORATION_LOGS', 'src/content/restoration/restoration-logs.ts']
];

const byKind = new Map(COLLECTIONS.map(([kind]) => [kind, entries.filter((e) => e.kind === kind)]));
const years = entries.map((e) => e.year).filter((y) => y !== null);
const corpusChars = entries.reduce((n, e) => n + (e.summary?.length ?? 0) + (e.body?.length ?? 0), 0);

// ---------------------------------------------------------------------------
// 1. CORPUS.md
// ---------------------------------------------------------------------------

function corpusDoc() {
  const out = [];
  out.push(
    HEADER(
      'Corpus ledger',
      'Measured from the live collections. This is the authoritative count of the archive: the sidebar\n' +
        'badges, `README.md` and every other document quote these numbers, and `archive:report:check`\n' +
        'fails CI if they disagree.'
    )
  );
  out.push('## Totals\n');
  out.push('| Measure | Value |');
  out.push('| --- | ---: |');
  out.push(`| Records | ${entries.length} |`);
  out.push(`| Record kinds | ${byKind.size} |`);
  out.push(`| In-world date span | ${Math.min(...years)} – ${Math.max(...years)} |`);
  out.push(`| Narrative characters (summaries + bodies) | ${corpusChars.toLocaleString('en-GB')} |`);
  out.push(`| Puzzle definitions | ${content.PUZZLES.length} |`);
  out.push(`| Terminal commands listed by \`help\` | ${content.TERMINAL_HELP.length} |`);
  out.push(`| Choir Script glyphs | ${Object.keys(choir.CHOIR_ALPHABET).length} |`);
  out.push('');

  out.push('## Records by kind\n');
  out.push('| Kind | Records | Id range | Code prefixes | Source |');
  out.push('| --- | ---: | --- | --- | --- |');
  for (const [kind, label, , file] of COLLECTIONS) {
    const list = byKind.get(kind) ?? [];
    const ids = list.map((e) => e.id).sort();
    const range = ids.length
      ? ids[0] === ids.at(-1)
        ? `\`${ids[0]}\``
        : `\`${ids[0]}\` … \`${ids.at(-1)}\``
      : '—';
    const codeShape = shapeOf(list.map((e) => e.code).filter(Boolean));
    out.push(`| \`${kind}\` — ${label} | ${list.length} | ${range} | ${codeShape} | \`${file}\` |`);
  }
  out.push('');
  out.push(
    'Id prefixes are stable and never reused. `documents` spans three id spaces — `doc-001…doc-025` ' +
      '(hand-authored core), `doc-026…doc-165` (templated catalogue) and `ovp-001…ovp-009` ' +
      "(the Order's own evidence files) — which is why its id range reads `doc-001 … ovp-009`."
  );
  out.push('');
  out.push('## Directive 17 — records the live index refuses\n');
  out.push(
    'The totals above count what the live index holds. Under Executive Directive 17 (standing, ' +
      '1989-11-04 05:14 UTC) some records are not deleted but **struck**: they survive in one copy only, ' +
      'as scrambled shards on the Postojna spool vaults, and are recovered through the tape-salvage ' +
      'mechanic (`src/lib/puzzles/salvage.ts`). They are deliberately absent from the counts above and ' +
      'deliberately present in the unresolved-reference warnings — that overlap is the hook.'
  );
  out.push('');
  out.push(`| Measure | Value |`);
  out.push(`| --- | ---: |`);
  out.push(`| Standing order | \`${purge.DIRECTIVE_17.code}\` |`);
  out.push(`| Purged records (ghosts) | ${purge.GHOSTS.length} |`);
  out.push(`| Shards across all ghosts | ${purge.GHOSTS.reduce((n, g) => n + g.shards.length, 0)} |`);
  out.push('');
  out.push('| Ghost | Code the index refuses | Original | Struck on | Cited by | Shards |');
  out.push('| --- | --- | --- | --- | --- | ---: |');
  for (const g of purge.GHOSTS) {
    out.push(
      `| \`${g.id}\` | \`${g.code}\` | ${g.date} | ${g.purgedOn} | ${g.citedBy
        .map((p) => `\`${p}\``)
        .join(', ')} | ${g.shards.length} |`
    );
  }
  out.push('');
  out.push(
    'Each ghost code is also cited by the personnel dossier listed above, which is how the mechanic is ' +
      'found: the dossier points at a document the index cannot produce. `INV-TAPE-01…04` keep the two ' +
      'sides in step — a ghost that starts resolving in the live index is a canon error, not a fix.'
  );
  out.push('');

  out.push('## Clearance distribution\n');
  out.push('| Tier | Records | Share |');
  out.push('| --- | ---: | ---: |');
  for (const t of clearance.CLEARANCE_TIERS) {
    const n = entries.filter((e) => tier(e.classification) === t.tier).length;
    out.push(`| ${t.label} | ${n} | ${((n / entries.length) * 100).toFixed(1)}% |`);
  }
  const unclassified = entries.filter((e) => e.classification === null).length;
  out.push(
    `| _no classification_ | ${unclassified} | ${((unclassified / entries.length) * 100).toFixed(1)}% |`
  );
  out.push('');
  out.push(
    '_No classification_ covers kinds that are not clearance-gated (products, job postings, dead links,\n' +
      'newsletters, training modules, restoration logs, departments, timeline entries whose classification\n' +
      'is narrative rather than a gate).'
  );
  out.push('');

  out.push('## Sidebar sections\n');
  out.push('| Route | Label | Badge |');
  out.push('| --- | --- | --- |');
  for (const item of nav.NAV_ITEMS) {
    out.push(`| \`${item.path}\` | ${esc(item.label)} | ${esc(item.badge)} |`);
  }
  out.push('');
  out.push('## Legacy redirects\n');
  out.push('| From | To |');
  out.push('| --- | --- |');
  for (const [from, to] of Object.entries(nav.LEGACY_REDIRECTS)) out.push(`| \`${from}\` | \`${to}\` |`);
  out.push('');
  out.push(
    'Edge redirects live in `vercel.json` and `public/_redirects`; the in-app half is pinned by `routes.test.tsx`.'
  );
  return out.join('\n') + '\n';
}

/**
 * Summarise a collection's code prefixes: `DOC-…` · `SPEC-…`.
 * Returns `—` for kinds whose `code` is not a code at all (dead links normalise
 * to the original host, which is a value rather than a scheme).
 */
function shapeOf(codes) {
  const prefixes = new Set();
  for (const code of codes) {
    const head = /^([A-Z]{2,6})-/.exec(code);
    if (head) prefixes.add(head[1]);
  }
  if (!prefixes.size) return '—';
  return [...prefixes]
    .sort()
    .map((p) => `\`${p}-…\``)
    .join(' · ');
}

// ---------------------------------------------------------------------------
// 2. CHRONOLOGY.md
// ---------------------------------------------------------------------------

function chronologyDoc() {
  const out = [];
  out.push(
    HEADER(
      'Chronology (derived)',
      'Every `/timeline` entry, in order, with the flags an auditor needs. Hand-written analysis of the\n' +
        'same period lives in [`../CHRONOLOGY.md`](../CHRONOLOGY.md); this table is the evidence it cites.'
    )
  );
  out.push('## Spine events\n');
  out.push(
    'The nine load-bearing events declared in `src/lib/archive/canon.ts`. `validateCanon()` proves\neach one against its evidence.\n'
  );
  out.push('| Id | Date | Fact | Evidence | Payoff |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const e of canon.CANON_SPINE) {
    const ev = [
      ...(e.evidence.timeline ?? []).map((x) => `\`${x}\``),
      ...(e.evidence.records ?? []).map((x) => `\`${x}\``),
      ...(e.evidence.narrates ?? []).map((x) => `\`${x}\`±`),
      ...(e.evidence.mentions ?? []).map((x) => `\`${x}\`·`)
    ].join(' ');
    out.push(`| \`${e.id}\` | ${e.date} | ${esc(e.fact)} | ${ev} | ${e.payoff ? `\`${e.payoff}\`` : '—'} |`);
  }
  out.push('');
  out.push(
    '`±` = narrating record (must fall within ±' +
      canon.NARRATION_WINDOW_DAYS +
      ' days) · `·` = mention (existence only)'
  );
  out.push('');

  for (const era of canon.CANON_ERAS) {
    const rows = content.TIMELINE_ENTRIES.filter((t) => t.era === era.label);
    out.push(`## ${era.label}\n`);
    out.push(
      `${rows.length} entries, ${rows[0]?.year}–${rows.at(-1)?.year}. ${rows.filter((r) => r.isCovert).length} covert.\n`
    );
    out.push('| Id | Date | Dept | Tier | Covert | Title |');
    out.push('| --- | --- | --- | :--: | :--: | --- |');
    for (const t of rows) {
      out.push(
        `| \`${t.id}\` | ${t.dateString} | \`${t.departmentCode}\` | ${tier(t.classification)} | ${t.isCovert ? '●' : ''} | ${esc(t.title)} |`
      );
    }
    out.push('');
  }
  out.push(
    'Covert entries carry an `internalImpact` line that contradicts or completes the public `description`.'
  );
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// 3. CLUE_LEDGER.md
// ---------------------------------------------------------------------------

function clueLedgerDoc() {
  const out = [];
  out.push(
    HEADER(
      'Clue ledger (derived)',
      'Every clue, requirement and reward in the puzzle system, with the record or route it resolves to.\n' +
        'Read this before moving, renaming or gating anything: if a row here changes, a player-facing\n' +
        'path changes with it. Narrative reading of the same data is in [`../CLUE_LEDGER.md`](../CLUE_LEDGER.md).'
    )
  );

  out.push('## Seal ladder\n');
  out.push('| Seal | Planet | Glyph | Metal | Day | Widget surface | Requires | Grants |');
  out.push('| --- | --- | :--: | --- | --- | --- | --- | --- |');
  for (const p of content.PUZZLES.filter((p) => p.id.startsWith('seal-'))) {
    const s = seals.SEALS.find((x) => x.id === Number(p.id.slice(5)));
    const req =
      (p.requires ?? [])
        .map((r) => (r.type === 'puzzle-completed' ? `\`${r.puzzleId}\`` : r.type))
        .join(', ') || '—';
    const grants =
      p.rewards
        .map((r) =>
          r.type === 'clearance'
            ? `L${tier(r.level)}`
            : r.type === 'download'
              ? `download \`${r.id}\``
              : r.type
        )
        .join(' + ') || '—';
    out.push(
      `| ${s.numeral} | ${s.planet} | ${s.glyph} | ${s.metal} | ${s.day} | \`${p.surface}\` | ${req} | ${grants} |`
    );
  }
  out.push('');

  out.push('## Clues\n');
  out.push('| Puzzle | Clue id | Pointer text | Location type | Resolves to |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const p of content.PUZZLES) {
    if (!p.clues.length) {
      out.push(`| \`${p.id}\` | — | _no clues: re-asks keys already held_ | — | — |`);
      continue;
    }
    for (const c of p.clues) {
      const loc = c.location;
      const target =
        loc.type === 'record'
          ? `\`${loc.ref.kind}:${loc.ref.id}\``
          : loc.type === 'route'
            ? `\`${loc.path}\``
            : `UI · ${esc(loc.label)}`;
      out.push(`| \`${p.id}\` | \`${c.id}\` | ${esc(c.text)} | ${loc.type} | ${target} |`);
    }
  }
  out.push('');

  out.push('## Seal pointers (narrative layer)\n');
  out.push(
    '`seals.ts` authors pointers as tabs or document codes; `definitions.ts` resolves them to clues.\nA pointer that does not resolve degrades to a plain UI label — which is how drift hides.\n'
  );
  out.push('| Seal | Label | Tab / doc code | Resolved |');
  out.push('| --- | --- | --- | --- |');
  const docByCode = new Map(content.DOCUMENTS.map((d) => [d.code, d.id]));
  for (const s of seals.SEALS) {
    for (const pt of s.pointers) {
      const resolved = pt.docCode
        ? docByCode.has(pt.docCode)
          ? `\`document:${docByCode.get(pt.docCode)}\``
          : '**UNRESOLVED**'
        : pt.tab
          ? `\`/${pt.tab}\``
          : '**UNRESOLVED**';
      out.push(
        `| ${s.numeral} | ${esc(pt.label)} | ${pt.docCode ? `\`${pt.docCode}\`` : `\`${pt.tab}\``} | ${resolved} |`
      );
    }
  }
  out.push('');

  out.push('## Hints\n');
  out.push('| Puzzle | Tier 1 | Tier 2 | Tier 3 | Reveals answer |');
  out.push('| --- | --- | --- | --- | :--: |');
  for (const p of content.PUZZLES) {
    const cell = (t) => esc(p.hints.find((h) => h.tier === t)?.label ?? '—');
    const reveals = p.hints.some((h) => h.revealsAnswer) ? '●' : '';
    out.push(`| \`${p.id}\` | ${cell(1)} | ${cell(2)} | ${cell(3)} | ${reveals} |`);
  }
  out.push('');
  out.push(
    'Tier 3 is the assisted route. Opening it before a correct answer marks the completion ASSISTED; every reward is still granted.'
  );
  out.push('');

  out.push('## Rewards\n');
  out.push('| Puzzle | Rewards |');
  out.push('| --- | --- |');
  for (const p of content.PUZZLES) {
    const r =
      p.rewards
        .map((x) =>
          x.type === 'clearance'
            ? `clearance → ${x.level}`
            : x.type === 'download'
              ? `download \`${x.id}\``
              : x.type === 'route'
                ? `route \`${x.path}\``
                : x.type === 'record'
                  ? `record \`${x.recordId}\``
                  : x.type
        )
        .join('; ') || '_none_';
    out.push(`| \`${p.id}\` | ${r} |`);
  }
  out.push('');

  out.push('## Navigation shell surface\n');
  out.push(
    'The docked archive shell (`` ` ``, dropped in a few seconds after load) navigates and reports. It is\n' +
      '**not** a puzzle surface: no command here grants clearance, reveals a redaction or moves the case on.\n' +
      'Anything that would is handed off to the backdoor (`cli` → `~`), which owns all of that.\n'
  );
  out.push('| Command | Argument | Purpose | Hand-off |');
  out.push('| --- | --- | --- | :--: |');
  for (const c of content.SHELL_COMMANDS) {
    out.push(
      `| \`${c.cmd}\` | ${c.arg ? `\`${esc(c.arg)}\`` : '—'} | ${esc(c.desc)} | ${c.handoff ? 'yes' : '—'} |`
    );
  }
  out.push('');
  out.push('Section aliases (`cd <alias>` reserves no command name):');
  out.push('');
  out.push(
    Object.entries(content.SHELL_ALIASES)
      .map(([alias, id]) => `\`${alias}\`→\`${id}\``)
      .join(' · ')
  );
  out.push('');

  out.push('## Terminal surface\n');
  out.push(
    'The terminal (`~`) is a puzzle surface in its own right. `help` lists the documented commands;\nthe aliases below are undocumented on purpose and exist only to react in-fiction to the wrong move.\n'
  );
  out.push('| Command | Documented | Purpose |');
  out.push('| --- | :--: | --- |');
  for (const h of content.TERMINAL_HELP) {
    out.push(`| \`${h.cmd}\` | ${h.order ? 'Order' : 'yes'} | ${esc(h.desc)} |`);
  }
  for (const a of termMod.TERMINAL_ALIASES) out.push(`| \`${a.cmd}\` | — | ${esc(a.note)} |`);
  out.push('');
  out.push(
    "`ORDO VOCIS PROFUNDAE` is quoted verbatim from `ovp-003` §I by `ordo`/`vox`, which is the one place\nthe Order states itself in the player's face before Seal I."
  );
  out.push('');

  out.push('### The planchette (`commune`)\n');
  out.push(
    'One line per active seal, indexed by `currentSeal − 1`; the last plays after the finale. It never\nnames an answer, which is what keeps it on the right side of the spoiler ceiling.\n'
  );
  out.push('| Active seal | Line |');
  out.push('| --- | --- |');
  termMod.COMMUNE_LINES.forEach((line, i) => {
    const label = i === 7 ? '_after the finale_' : `Seal ${seals.SEALS[i].numeral} — ${seals.SEALS[i].title}`;
    out.push(`| ${label} | ${esc(line)} |`);
  });
  out.push('');

  out.push('### Gematria annotations (`gematria <text>`)\n');
  out.push('Ordinal letter-sums the terminal will comment on. Each is a nudge, not an answer.\n');
  out.push('| Sum | Note |');
  out.push('| ---: | --- |');
  for (const [n, note] of Object.entries(termMod.GEMATRIA_NOTES)) out.push(`| ${n} | ${esc(note)} |`);
  out.push('');

  out.push('### Revoked codes\n');
  out.push('Recognised solely so the fiction can refuse them. None grants anything.\n');
  out.push('| Code | Rejected by |');
  out.push('| --- | --- |');
  for (const c of puzzlesConfig.REVOKED_CODES) out.push(`| \`${c}\` | \`override\`, the master-key prompt |`);
  out.push('');

  out.push('## Tape salvage — Directive 17\n');
  out.push(
    'The only mechanic whose payoff is a *document* rather than a clearance or a degree. Its sources are ' +
      'the unresolved references themselves: a dossier cites a code the live index cannot produce, and the ' +
      'code is recoverable from the spool. Shards are spliced into ascending locator order.'
  );
  out.push('');
  out.push('| Source (where it is found) | Payoff | Shards |');
  out.push('| --- | --- | ---: |');
  for (const g of purge.GHOSTS) {
    const who = g.citedBy.join(', ');
    out.push(
      `| dossier \`${who}\` cites \`${g.code}\`, which the index refuses | ${esc(g.title)} | ${
        g.shards.length
      } |`
    );
  }
  out.push('');
  const exc = canon.CANON_TAPE_EXCEPTIONS;
  if (exc.length) {
    out.push('### Recorded Seal-Word collisions in ghost text\n');
    out.push(
      '`INV-TAPE-04` fails CI if a Seal-Word appears in the salvage layer, which promises to carry no ' +
        'answers. These are the deliberate, reviewed exceptions — flagged as warnings, never silent.'
    );
    out.push('');
    out.push('| Ghost | Seal-Word | Why it is allowed |');
    out.push('| --- | --- | --- |');
    for (const x of exc) out.push(`| \`${x.ghostId}\` | \`${x.sealWord}\` | ${esc(x.reason)} |`);
    out.push('');
  }

  out.push('## Choir Script fragments\n');
  out.push('| Fragment | Tab | Letters | Riddle |');
  out.push('| --- | --- | --- | --- |');
  for (const f of seals.FRAGMENTS) {
    out.push(`| \`${f.id}\` | \`/${f.tab}\` | ${f.letters.join(' ')} | ${esc(f.riddle)} |`);
  }
  out.push('');
  const taught = [...new Set(seals.FRAGMENTS.flatMap((f) => f.letters))].sort();
  out.push(
    `Letters taught: **${taught.join(' ')}** (${taught.length} of ${Object.keys(choir.CHOIR_ALPHABET).length}). Seal III teaches the remainder.`
  );
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// 4. KNOWLEDGE_MATRIX.md
// ---------------------------------------------------------------------------

function knowledgeMatrixDoc() {
  const out = [];
  out.push(
    HEADER(
      'Knowledge matrix (derived)',
      'What the archive holds at each clearance tier, and what each seal unlocks. This is the generated\n' +
        'half of [`../REVELATION.md`](../REVELATION.md); the reasoning is there, the numbers are here.'
    )
  );

  out.push('## Records per kind per tier\n');
  out.push('| Kind | L1 | L2 | L3 | L4 | L5 | — |');
  out.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const [kind] of COLLECTIONS) {
    const list = byKind.get(kind) ?? [];
    const row = [1, 2, 3, 4, 5].map((t) => list.filter((e) => tier(e.classification) === t).length);
    const none = list.filter((e) => e.classification === null).length;
    out.push(`| \`${kind}\` | ${row.join(' | ')} | ${none} |`);
  }
  const totals = [1, 2, 3, 4, 5].map((t) => entries.filter((e) => tier(e.classification) === t).length);
  out.push(
    `| **total** | ${totals.join(' | ')} | ${entries.filter((e) => e.classification === null).length} |`
  );
  out.push('');

  out.push('## Unlock ladder\n');
  out.push('| Rank | Tier label | Order degree | Earned by | Also unlocks |');
  out.push('| :--: | --- | --- | --- | --- |');
  for (const t of clearance.CLEARANCE_TIERS) {
    const degree = canon.CANON_DEGREES[t.tier];
    const earned = seals.EARNED_BY[t.tier] ?? '—';
    const extra =
      t.tier === investigation.DESCRAMBLER_RANK
        ? 'Redaction De-Scrambler'
        : t.tier === 5
          ? 'Palimpsest master dump'
          : '—';
    out.push(`| ${t.tier} | ${esc(t.label)} | ${degree} | ${esc(earned)} | ${extra} |`);
  }
  out.push('');

  out.push('## Records released per seal\n');
  out.push('| Stage | Newly readable records | Cumulative readable |');
  out.push('| --- | ---: | ---: |');
  const ungated = entries.filter((e) => e.classification === null).length;
  const l1 = entries.filter((e) => tier(e.classification) === 1).length;
  out.push(`| Connection (no seal) — Level 1 + the ungated kinds | ${l1} + ${ungated} | ${l1 + ungated} |`);
  let cumulative = l1 + ungated;
  for (const rank of [2, 3, 4, 5]) {
    const n = entries.filter((e) => tier(e.classification) === rank).length;
    cumulative += n;
    const seal = seals.SEALS.find((s) => s.rewardLevel === rank);
    out.push(`| Seal ${seal.numeral} — ${seal.title} (Level ${rank}) | ${n} | ${cumulative} |`);
  }
  out.push('');
  out.push(
    'The ungated kinds — stations, departments, products, job postings, dead links, newsletters, training\n' +
      'modules and restoration logs — carry no classification at all and are readable on arrival. The\n' +
      'public surface of the company is genuinely public; that is what makes the rest read as concealment\n' +
      'rather than as an absence of content.'
  );
  out.push('');

  out.push('## Order material\n');
  const order = content.DOCUMENTS.filter((d) => d.id.startsWith('ovp-'));
  out.push('| Id | Code | Tier | Date | Title |');
  out.push('| --- | --- | :--: | --- | --- |');
  for (const d of order) {
    out.push(`| \`${d.id}\` | \`${d.code}\` | ${tier(d.clearance)} | ${d.date} | ${esc(d.title)} |`);
  }
  out.push('');
  out.push(
    'Every record above is tagged `Order`, which limits it to title-and-abstract indexing in search. See `docs/REVELATION.md`.'
  );
  out.push('');

  out.push('## Redaction surface\n');
  const redacted = content.DOCUMENTS.filter((d) => d.redactedContent);
  out.push(
    `Documents carrying a de-scrambled counterpart: **${redacted.length}** of ${content.DOCUMENTS.length}.\n`
  );
  out.push('| Id | Code | Tier | Title |');
  out.push('| --- | --- | :--: | --- |');
  for (const d of redacted)
    out.push(`| \`${d.id}\` | \`${d.code}\` | ${tier(d.clearance)} | ${esc(d.title)} |`);
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// 5. REGISTRY.md — the entity coherence surface
// ---------------------------------------------------------------------------

function registryDoc() {
  const out = [];
  out.push(
    HEADER(
      'Entity registry (derived)',
      'Who owns what, who is where, and how densely each entity is cross-referenced. This is the table to\n' +
        'read before naming a person, moving one between stations, or assigning a programme to a department:\n' +
        '`validateCanon()` will fail on a mismatch, and this is where you can see the mismatch coming.'
    )
  );

  out.push('## Departments\n');
  out.push('| Code | Name | Director | Deputy | HQ | Head | Programmes led | Timeline entries |');
  out.push('| --- | --- | --- | --- | --- | ---: | --- | ---: |');
  for (const d of content.DEPARTMENTS) {
    const progs = content.INTERNAL_PROGRAMS.filter((p) => p.leadDepartmentId === d.id)
      .map((p) => p.name.replace('Project ', ''))
      .join(', ');
    const tl = content.TIMELINE_ENTRIES.filter((t) => t.departmentCode === d.code).length;
    out.push(
      `| \`${d.code}\` | ${esc(d.name)} | ${esc(d.director)} | ${esc(d.deputyDirector)} | ${esc(d.headquarters)} | ${d.headcount} | ${progs || '—'} | ${tl} |`
    );
  }
  out.push('');

  out.push('## Programmes\n');
  out.push('| Code | Name | Dept | Director | Since | Status | Threat | People | Stations |');
  out.push('| --- | --- | --- | --- | ---: | --- | --- | ---: | ---: |');
  for (const p of content.INTERNAL_PROGRAMS) {
    out.push(
      `| \`${p.code}\` | ${esc(p.name)} | \`${p.leadDepartmentId.replace('dept-', '')}\` | ${esc(p.director)} | ${p.startYear} | ${p.status} | ${p.threatLevel} | ${p.linkedPersonnel.length} | ${p.linkedStations.length} |`
    );
  }
  out.push('');
  out.push("`Covert Active` marks the three that are the Order's work rather than the company's.");
  out.push('');

  out.push('## Stations & arrays\n');
  out.push('| Code | Name | Region | Type | Status | Lead | Est. | Band | Projects |');
  out.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const s of content.REGIONAL_STATIONS) {
    out.push(
      `| \`${s.code}\` | ${esc(s.name)} | ${esc(s.region)} | ${s.facilityType} | ${s.status} | ${esc(s.leadPersonnelName)} | ${s.establishedDate} | ${esc(s.frequencyBand)} | ${s.activeProjects.length} |`
    );
  }
  out.push('');

  out.push('## Personnel\n');
  out.push('| Id | Name | Status | Tier | Dept | Station | Hired | Linked docs | Missing | Links |');
  out.push('| --- | --- | --- | :--: | --- | --- | --- | ---: | ---: | ---: |');
  for (const p of content.PERSONNEL) {
    const linked = records.linkedDocumentsFor(p);
    const tierNum = (c) => Number(/Level (\d)/.exec(c ?? '')?.[1] ?? 0);
    out.push(
      `| \`${p.id}\` | ${esc(p.name)} | ${p.status} | ${tierNum(p.clearance)} | \`${p.departmentId.replace('dept-', '')}\` | \`${p.stationId}\` | ${p.hireDate} | ${linked.found.length} | ${linked.missing.length} | ${(p.links ?? []).length} |`
    );
  }
  out.push('');
  out.push(
    '"Missing" counts document codes that were never recovered. They are authored gaps, listed in\n' +
      '[`../CONTINUITY.md`](../CONTINUITY.md) §3, and they render in-world as "not recovered".'
  );
  out.push('');

  out.push('## Cross-reference density\n');
  const totalLinks = entries.reduce((n, e) => n + e.links.length, 0);
  const totalRelated = entries.reduce((n, e) => n + e.related.length, 0);
  const missingLinked = content.PERSONNEL.reduce(
    (n, p) => n + records.linkedDocumentsFor(p).missing.length,
    0
  );
  out.push('| Measure | Value |');
  out.push('| --- | ---: |');
  out.push(`| Typed links (\`links\`) | ${totalLinks} |`);
  out.push(`| Loose relations (\`related\`) | ${totalRelated} |`);
  out.push(
    `| Personnel \`linkedDocuments\` that resolve | ${content.PERSONNEL.reduce((n, p) => n + records.linkedDocumentsFor(p).found.length, 0)} |`
  );
  out.push(`| Personnel \`linkedDocuments\` that do not (authored gaps) | ${missingLinked} |`);
  out.push(
    `| Records with no inbound or outbound reference | ${entries.filter((e) => e.links.length + e.related.length === 0).length} |`
  );
  return out.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// 6. CANON_LEDGER.json — machine-readable, for tooling and future agents
// ---------------------------------------------------------------------------

function canonLedger() {
  return (
    JSON.stringify(
      {
        $schema: 'generated by scripts/archive-report.mjs — do not edit',
        generatedFrom: 'src/lib/archive/canon.ts + src/content/**',
        chronology: canon.CANON_CHRONOLOGY,
        eras: canon.CANON_ERAS,
        counts: canon.CANON_COUNTS,
        measured: {
          records: entries.length,
          kinds: byKind.size,
          corpusChars,
          firstYear: Math.min(...years),
          lastYear: Math.max(...years)
        },
        companies: canon.CANON_COMPANIES,
        order: canon.CANON_ORDER,
        carrier: canon.CANON_CARRIER,
        voices: canon.CANON_VOICES,
        degrees: canon.CANON_DEGREES.slice(1),
        spine: canon.CANON_SPINE,
        narrationWindowDays: canon.NARRATION_WINDOW_DAYS,
        invariants: canon.CANON_INVARIANTS,
        terminology: canon.CANON_TERMS.map((t) => ({
          canonical: t.canonical,
          banned: t.banned.map((r) => r.source),
          note: t.note
        })),
        seals: seals.SEALS.map((s) => ({
          id: s.id,
          numeral: s.numeral,
          planet: s.planet,
          glyph: s.glyph,
          metal: s.metal,
          day: s.day,
          accent: s.accent,
          title: s.title,
          subtitle: s.subtitle,
          sealWord: s.sealWord,
          rewardLevel: s.rewardLevel ?? null,
          pointers: s.pointers
        })),
        fragments: seals.FRAGMENTS,
        terminal: {
          commands: content.TERMINAL_HELP,
          aliases: termMod.TERMINAL_ALIASES,
          communeLines: termMod.COMMUNE_LINES,
          gematriaNotes: termMod.GEMATRIA_NOTES
        },
        revokedCodes: puzzlesConfig.REVOKED_CODES,
        puzzles: content.PUZZLES.map((p) => ({
          id: p.id,
          title: p.title,
          surface: p.surface,
          clues: p.clues,
          rewards: p.rewards,
          requires: p.requires ?? [],
          hintTiers: p.hints.map((h) => ({ tier: h.tier, label: h.label, revealsAnswer: !!h.revealsAnswer }))
        }))
      },
      null,
      2
    ) + '\n'
  );
}

// ---------------------------------------------------------------------------
// Write / check
// ---------------------------------------------------------------------------

const FILES = {
  'CORPUS.md': corpusDoc(),
  'CHRONOLOGY.md': chronologyDoc(),
  'CLUE_LEDGER.md': clueLedgerDoc(),
  'KNOWLEDGE_MATRIX.md': knowledgeMatrixDoc(),
  'REGISTRY.md': registryDoc(),
  'CANON_LEDGER.json': canonLedger()
};

mkdirSync(OUT, { recursive: true });
let drift = 0;
for (const [name, body] of Object.entries(FILES)) {
  const path = join(OUT, name);
  if (CHECK) {
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (current !== body) {
      console.error(`✗ docs/generated/${name} is out of date — run \`npm run archive:report\``);
      drift++;
    } else {
      console.log(`✓ docs/generated/${name}`);
    }
  } else {
    writeFileSync(path, body);
    console.log(`✓ wrote docs/generated/${name} (${(body.length / 1024).toFixed(1)} kB)`);
  }
}
if (CHECK && drift) process.exit(1);
