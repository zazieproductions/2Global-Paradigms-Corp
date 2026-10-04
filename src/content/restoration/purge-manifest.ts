// ============================================================================
// DIRECTIVE 17 — THE UNQUIET TAPE
// ----------------------------------------------------------------------------
// Everything the live index refuses. Under Executive Directive 17 (standing,
// 1989-11-04 05:14 UTC) records are not deleted — they are STRUCK. The archive
// marks that distinction here: a purged record survives in exactly one copy,
// as scrambled shards on the Postojna spool vaults.
//
// The ghost codes below are the very codes the personnel dossiers cite and the
// validator reports as "not recovered" — that gap is the hook, not an oversight.
// Reassembling a ghost is the tape-salvage mechanic (src/lib/puzzles/salvage.ts,
// src/components/puzzles/tape-spool-modal.tsx).
//
// THIS FILE IS NARRATIVE CONTENT ONLY. It contains no answers to any seal.
// ============================================================================

import type { Directive17Record, PurgedGhost } from '@/types';

export const DIRECTIVE_17: Directive17Record = {
  code: 'DIR-1989-DIRECTIVE-17',
  title: 'Executive Directive 17 — Purge of the Live Index (standing order)',
  signatory: 'E. CROSS, Executive Governance, for the executive floor',
  lines: [
    'PURPOSE. The live index shall hold no record that can be read as testimony. Deletion is insufficient: deleted things are searched for. Struck things are forgotten.',
    'AUTHORITY. Authorised 1989-11-04 05:14 UTC — the same hour Master Key 01 was revoked. The keys died first. The papers died second. Both were signed in the same ink.',
    'METHOD. The struck record survives in one copy only: tape, spool vaults, Postojna. The ledger must be exact even where the world is required to forget. The Order does not lie in its ledgers. It lies everywhere else.',
    'EXECUTED. Contract 0001 termination memorandum, struck 1990-02-11. Station 07 incident report, struck 2019-11-20. Cohort Alpha register header, struck 2025-03-02. The spool holds all three.',
    'NOTE OF THE SCRUBBER. Two drafts of the closing line survive over each other. The first says NOTHING PURGED IS EVER GONE. The second says THE TAPE WILL REMEMBER. THE TAPE WAS ALWAYS MEANT TO REMEMBER. Both are in the director\u2019s hand.',
    'Restoration note (MIRROR OPERATOR 1, 2026-09-30): this is why we stopped trusting the index. The archive will not delete anything. It will cover. The spool disagrees with the catalogue on exactly three files, and the three of them are below.'
  ]
};

export const GHOSTS: PurgedGhost[] = [
  {
    id: 'ghost-001',
    code: 'MEMO-1989-EXEC-TERMINATION',
    title: 'Executive Contract 0001 — Termination Memorandum (A. Sedley)',
    date: '1989-11-04',
    purgedOn: '1990-02-11',
    citedBy: ['p-001'],
    preamble:
      'The index holds the citation and nothing else. The spool holds seven reel fragments, out of order, bearing the ink of the same night the master keys died.',
    locatorNote: 'Reel offsets ascend with the tape. Splice the fragments so the offsets count up.',
    shards: [
      {
        locator: 'OFS-0010',
        order: 1,
        text: 'MEMORANDUM — EXECUTIVE GOVERNANCE & SPECIAL PROJECTS UNIT. CONTRACT 0001. TERMINATION. COPIES: 2. READER: NONE.'
      },
      {
        locator: 'OFS-0020',
        order: 2,
        text: 'Dr. Arthur Sedley, co-founder and Director of Research, stands removed from the roster with effect from 4 November 1989, 05:14 UTC. The chair is not to be filled; the chair is to be removed from the minutes.'
      },
      {
        locator: 'OFS-0030',
        order: 3,
        text: 'The Board accepts the account already in circulation: a disavowal, a disappearance, a man who took the Borehole 4 lift down to gallery -820 to keep a listening vigil and did not come back up in it.'
      },
      {
        locator: 'OFS-0040',
        order: 4,
        text: 'There is no body and there will not be one. The company has been assured of this by the ground itself, which is not a sentence the minute clerk enjoys typing.'
      },
      {
        locator: 'OFS-0050',
        order: 5,
        text: 'His name is struck from the charter, the ledgers, the staff photographs and the dining-room seating plan. Master Key 01 is revoked at this hour and will not be reissued. Master Keys 02 through 07 are withdrawn for "recalibration".'
      },
      {
        locator: 'OFS-0060',
        order: 6,
        text: 'Any document hereafter bearing his signature is to reach the undersigned unopened, by hand, and is not to be filed with this memorandum. He has been known to write.'
      },
      {
        locator: 'OFS-0070',
        order: 7,
        text: 'The Order does not open for keys. It opens for voices. — E. CROSS, for the executive floor, 05:14 UTC.'
      }
    ],
    closing:
      'The splice holds. The index still refuses this file — Directive 17 struck it in the same hour it was written, and the strike is countersigned — but the tape has given back every word.'
  },
  {
    id: 'ghost-002',
    code: 'INC-2019-SVALBARD-STATION07',
    title: 'Incident Report — Station 07, Borehole 4, night of 3–4 November 2019',
    date: '2019-11-04',
    purgedOn: '2019-11-20',
    citedBy: ['p-009'],
    preamble:
      'The duty officer filed eight pages. The index kept none of them. The spool kept the timestamps and the words between them, scattered across one long night at the top of the world.',
    locatorNote: 'The watch stamps every fragment. Splice them so the night runs forward.',
    shards: [
      {
        locator: '00:00:00',
        order: 1,
        text: 'INCIDENT REPORT — NORDIC ACOUSTIC ARRAY, STATION 07, SPITSBERGEN. NIGHT OF 3–4 NOVEMBER 2019. FILED BY THE DUTY OFFICER.'
      },
      {
        locator: '03:41:02',
        order: 2,
        text: 'Borehole 4 lift descends to gallery -820 without a call from the watch. The gate camera shows one person in the car. He is not wearing cold-weather gear and he is carrying nothing.'
      },
      {
        locator: '03:58:44',
        order: 3,
        text: 'The lift returns to the surface gate open and empty. The floor of the car is wet with a film the duty officer records only as "not water". It is not recorded again anywhere in station stock.'
      },
      {
        locator: '04:12:19',
        order: 4,
        text: 'The station intercom carries a voice reading telemetry numbers in the duty officer\u2019s own cadence, one second ahead of the gauges. The intercom is later found disconnected at the patch panel.'
      },
      {
        locator: '05:20:03',
        order: 5,
        text: '48 gigabytes of gallery telemetry leave the station network for the last time. The copy logs name the operator: E. THORNE, Research Fellow, badge swiped at Longyearbyen airfield forty minutes later.'
      },
      {
        locator: '06:00:00',
        order: 6,
        text: 'Day shift finds gallery -820 silent for the first time since monitoring began in 1986. The acoustic staff file one sentence about the silence and then refuse to elaborate: "it is the wrong shape".'
      },
      {
        locator: '23:59:59',
        order: 7,
        text: 'Warrant and press-gag applied under Directive 09. Three copies ordered destroyed; the destruction certificates are filed behind this report by mistake, which is the only reason any of it survived.'
      }
    ],
    closing:
      'The splice holds. The tape hisses once, like a held breath, and gives you back the night Thorne walked out with 48 gigabytes and a nosebleed.'
  },
  {
    id: 'ghost-003',
    code: 'DOC-2019-COHORT-ALPHA',
    title: 'Cohort Alpha — Tier-1 Heritage Continuity Register (header pages)',
    date: '2019-06-30',
    purgedOn: '2025-03-02',
    citedBy: ['p-010'],
    preamble:
      'The register is ten thousand names long; only the header pages ever reached this vault, and the purge struck even those. The spool kept their impressions as frame numbers.',
    locatorNote: 'Frame numbers ascend through the register. Splice the fragments so the frames run up.',
    shards: [
      {
        locator: 'FRM-010',
        order: 1,
        text: 'COHORT ALPHA — TIER-1 HERITAGE CONTINUITY REGISTER. 10,000 SEATS COMMITTED. HEADER PAGES ONLY; THE ROSTER ITSELF IS HELD OFFLINE AT POSTOJNA.'
      },
      {
        locator: 'FRM-020',
        order: 2,
        text: 'SELECTION BASIS (PAGE 2): not survival priority. The ranking column is headed VOICING — soprano, alto, tenor, bass — and the alternates column is headed ECHO.'
      },
      {
        locator: 'FRM-030',
        order: 3,
        text: 'Every seat is assigned to a facility. The facility list matches, seat for seat, the twenty-two regional stations and the fourteen subterranean redoubts. Nothing is reserved for the families of the people listed.'
      },
      {
        locator: 'FRM-040',
        order: 4,
        text: 'Three names struck from the register by the Director of Civic Continuity were reinstated by the executive floor within the week. This page records that the Director is not to be told. She has not been.'
      },
      {
        locator: 'FRM-050',
        order: 5,
        text: 'The enrolment notice sent to the ten thousand calls the register a continuity honour. The consent paragraph they signed is reproduced on page 12 and is one sentence long: "I will answer when called."'
      },
      {
        locator: 'FRM-060',
        order: 6,
        text: 'Page 13 is missing from this copy. The tape holds its impression anyway: a heading, two words — THE CHOIR — then the heel of an operator\u2019s hand across the page.'
      }
    ],
    closing:
      'The splice holds. The ten thousand are listed somewhere in singing order, and every one of their seats is still committed.'
  }
];
