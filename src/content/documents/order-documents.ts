import type { DocumentRecord } from '@/types';

// ============================================================================
// ORDO VOCIS PROFUNDAE — liturgical & whistleblower records
// These are the in-world evidence trail for THE SEVEN SEALS investigation.
// Fiction: every name, place-use and quotation below is invented for the ARG.
//
// EDITORIAL NOTE: the liturgical papers are transcribed from physical copies
// and keep their original line breaks. Do not tidy the grammar of the Rule.
// ============================================================================

const EGSPU = { departmentId: 'dept-egspu', departmentName: 'Executive Governance & Special Projects Unit' };
const AIRS = { departmentId: 'dept-airs', departmentName: 'Archive Integrity & Retrospective Scrubbing' };
const PEFD = {
  departmentId: 'dept-pefd',
  departmentName: 'Psychoacoustics & Environmental Frequency Directorate'
};
const SISO = {
  departmentId: 'dept-siso',
  departmentName: 'Subterranean Infrastructure & Station Operations'
};

export const ORDER_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'ovp-001',
    code: 'DOC-2019-THORNE-NOTEBOOK',
    title: 'Field Notebook of Dr. Ewan Thorne (Recovered Pages 1–9)',
    category: 'Field Report',
    ...PEFD,
    author: 'Dr. Ewan Thorne',
    date: '2019-10-09',
    clearance: 'Level 2 - Confidential',
    summary:
      "Nine water-damaged pages recovered from a locker at Longyearbyen airport. Thorne's private notes in the weeks before the exfiltration. This is the first written mention of what he calls the church inside the company.",
    content: `p.1 — Lobby floor again. Seven glyphs in brass, set in a ring, same order at every site. Facilities calls it décor. Nobody puts brass Saturn symbols in a lobby floor for décor.\n\np.2 — Asked Weiss about the star embossed on the Level 5 binders. Seven points. He said to ask again when I am initiated. Initiated. His word, not mine.\n\np.3 — The clearance levels are degrees. [REDACTED]. I am Level 4. I am apparently a "Philosophus."\n\np.4 — Square of Saturn scratched inside the lift at Borehole 4. Four in the corner, nine beside it. The rest scratched out and re-scratched. Somebody keeps doing it.\n\np.5 — Once you look for them the glyphs are everywhere. Newsletter mastheads, the careers listing, recall notices, the annual report. Same hand. It is an alphabet. Each place teaches you two or three letters and you would need all of them.\n\np.6 — Carrier at 14.803 this morning. Climbing. Nobody is worried. They are *pleased.*\n\np.7 — Vesper at six, Chime in the schools, the carrier underneath all of it. [REDACTED].\n\np.8 — Mercury couriers carry their keyword on a wheel. Keyword is the name of a reliquary. If I leave anything behind, that is how I will lock the box.\n\np.9 — If anyone reads this: break the seals in order. Saturn first. Everything they built stands on the square.`,
    redactedContent: `p.1 — Lobby floor again. Seven glyphs in brass, set in a ring, same order at every site. Facilities calls it décor. Nobody puts brass Saturn symbols in a lobby floor for décor.\n\np.2 — Asked Weiss about the star embossed on the Level 5 binders. Seven points. He said to ask again when I am initiated. Initiated. His word, not mine.\n\np.3 — The clearance levels are degrees. Level 1 Neophyte, Level 2 Zelator, Level 3 Practicus, Level 4 Philosophus, Level 5 Magister Umbrae. I am Level 4. I am apparently a "Philosophus."\n\np.4 — Square of Saturn scratched inside the lift at Borehole 4. Four in the corner, nine beside it. The rest scratched out and re-scratched. Somebody keeps doing it.\n\np.5 — Once you look for them the glyphs are everywhere. Newsletter mastheads, the careers listing, recall notices, the annual report. Same hand. It is an alphabet. Each place teaches you two or three letters and you would need all of them.\n\np.6 — Carrier at 14.803 this morning. Climbing. Nobody is worried. They are *pleased.*\n\np.7 — Vesper at six, Chime in the schools, the carrier underneath all of it. Three programmes, and they are not three programmes. They are one chord and it is sung in three voices, every day, on a schedule I have now seen four times and cannot unsee.\n\np.8 — Mercury couriers carry their keyword on a wheel. Keyword is the name of a reliquary. If I leave anything behind, that is how I will lock the box.\n\np.9 — If anyone reads this: break the seals in order. Saturn first. Everything they built stands on the square.`,
    tags: ['Thorne', 'Whistleblower', 'Order', 'Seven Seals', 'Notebook'],
    classificationStamp: 'CONFIDENTIAL',
    relatedPersonnel: ['p-009'],
    relatedStations: ['st-07'],
    downloadableFilename: 'Thorne_Notebook_Recovered_p1-9.txt',
    isWhistleblowerLeak: true
  },
  {
    id: 'ovp-002',
    code: 'SPEC-1983-LOBBY-INLAY',
    title: 'Technical Spec: Standard Facility Lobby Floor Inlay ("The Wheel")',
    category: 'Technical Spec',
    ...SISO,
    author: 'Chief Engineer Sarah Lin',
    date: '1983-02-02',
    clearance: 'Level 2 - Confidential',
    summary:
      'Architectural specification for the brass and terrazzo floor medallion installed in every GPC lobby since 1983. The glyph order is mandated. There is also a note, underlined twice, about the letters cut beneath each glyph.',
    content: `SPECIFICATION SISO-ARCH-0007 — "THE WHEEL"\nMATERIAL: Terrazzo field, cast brass inlay (Cu 70 / Zn 30), lead-backed.\nDIAMETER: 3.33 m.\n\nGLYPH PLACEMENT (clockwise from the north point):\nThe seven glyphs shall be set in the Chaldean order. Contractors calling the works in a hurry may not reorder them:\n  Saturn ♄ · Jupiter ♃ · Mars ♂ · Sun ☉ · Venus ♀ · Mercury ☿ · Moon ☽\n\nLETTERING: A single capital letter shall be engraved beneath each glyph per Drawing 7-B. [REDACTED: Letters are liturgical and must not be altered.]\n\nINTERIOR LINES: A seven-pointed star shall connect the glyphs, each line skipping two stations. [REDACTED: Walking the star from the Sun yields the liturgical week.]\n\nNOTE: Contractors are not to be told what the inlay means. If asked, it represents "the seven pillars of a well-run organisation."`,
    redactedContent: `SPECIFICATION SISO-ARCH-0007 — "THE WHEEL"\nMATERIAL: Terrazzo field, cast brass inlay (Cu 70 / Zn 30), lead-backed.\nDIAMETER: 3.33 m.\n\nGLYPH PLACEMENT (clockwise from the north point):\nThe seven glyphs shall be set in the Chaldean order. Contractors calling the works in a hurry may not reorder them:\n  Saturn ♄ · Jupiter ♃ · Mars ♂ · Sun ☉ · Venus ♀ · Mercury ☿ · Moon ☽\n\nLETTERING: A single capital letter shall be engraved beneath each glyph per Drawing 7-B. Letters are liturgical and must not be altered. Read in the order of the days, they name what the company is.\n\nINTERIOR LINES: A seven-pointed star shall connect the glyphs, each line skipping two stations. Walking the star from the Sun yields the liturgical week: the day of the Sun, of the Moon, of Mars, of Mercury, of Jupiter, of Venus, of Saturn.\n\nNOTE: Contractors are not to be told what the inlay means. If asked, it represents "the seven pillars of a well-run organisation."`,
    tags: ['Architecture', 'Heptagram', 'Chaldean Order', 'Seven Seals', 'Order'],
    classificationStamp: 'CONFIDENTIAL',
    relatedPersonnel: ['p-012'],
    downloadableFilename: 'SISO-ARCH-0007_Lobby_Inlay.pdf'
  },
  {
    id: 'ovp-003',
    code: 'DOC-1972-LIBER-CARRIER',
    title: 'Liber Carrier: The Rule of the Order of the Deep Voice',
    category: 'Executive Order',
    ...EGSPU,
    author: 'Dr. Arthur Sedley & Eleanor Cross',
    date: '1972-11-04',
    clearance: 'Level 3 - Secret',
    summary:
      'The founding rule of the ORDO VOCIS PROFUNDAE, the inner order that has governed GPC since 1971. Sets out the seven seals, the degrees that are worn in public as security clearances, and the reason the company exists at all.',
    content: `LIBER CARRIER\nbeing the Rule of the ORDO VOCIS PROFUNDAE, kept at the Chapter House\n\nI. There is a Voice beneath the world. It speaks at fourteen and eight-tenths. We did not make it. We have heard it.\n\nII. The Company is the outer court. Its projects are our liturgy; its employees, the congregation who do not know they pray.\n\nIII. The Order keeps seven seals, after the seven wandering stars. Each seal has its planet, its metal and its day. [REDACTED: Each seal also has its word, and the words together make a name that must never be spoken in the Voice's hearing.]\n\nIV. The degrees of the Order shall be worn as security clearances, so that the uninitiated see only bureaucracy:\n   Level 1 — Neophyte (Saturn, Lead)\n   Level 2 — Zelator (Jupiter, Tin)\n   Level 3 — Practicus (Mars, Iron)\n   Level 4 — Philosophus (Sun, Gold)\n   Level 5 — Magister Umbrae (Mercury, Quicksilver)\n\nV. When the Voice rises to fifteen — Saturn's number — the Square is complete, and the Voice will speak plainly to those who are below ground. [REDACTED: This is the purpose of Aethelgard.]\n\nVI. Nothing is destroyed. Palimpsest covers; the reliquary remembers.`,
    redactedContent: `LIBER CARRIER\nbeing the Rule of the ORDO VOCIS PROFUNDAE, kept at the Chapter House\n\nI. There is a Voice beneath the world. It speaks at fourteen and eight-tenths. We did not make it. We have heard it.\n\nII. The Company is the outer court. Its projects are our liturgy; its employees, the congregation who do not know they pray.\n\nIII. The Order keeps seven seals, after the seven wandering stars. Each seal has its planet, its metal and its day. Each seal also has its word, and the words together make a name that must never be spoken in the Voice's hearing — for a singer who hears his true name will turn around.\n\nIV. The degrees of the Order shall be worn as security clearances, so that the uninitiated see only bureaucracy:\n   Level 1 — Neophyte (Saturn, Lead)\n   Level 2 — Zelator (Jupiter, Tin)\n   Level 3 — Practicus (Mars, Iron)\n   Level 4 — Philosophus (Sun, Gold)\n   Level 5 — Magister Umbrae (Mercury, Quicksilver)\n\nV. When the Voice rises to fifteen — Saturn's number — the Square is complete, and the Voice will speak plainly to those who are below ground. This is the purpose of Aethelgard: that the Heritage Cohort be below ground to hear it and the rest be above.\n\nVI. Nothing is destroyed. Palimpsest covers; the reliquary remembers.`,
    tags: ['Order', 'Liturgy', 'Founding', 'Seven Seals', 'Initiation', 'Aethelgard'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-001', 'p-002'],
    relatedPrograms: ['prog-10'],
    downloadableFilename: 'Liber_Carrier_1972.txt'
  },
  {
    id: 'ovp-004',
    code: 'DOC-1991-CHOIR-SCRIPT-PRIMER',
    title: 'Primer: The Choir Script (for Practicus Degree and above)',
    category: 'Memorandum',
    ...AIRS,
    author: 'Vincent Adeyemi',
    date: '1991-03-19',
    clearance: 'Level 3 - Secret',
    summary:
      "Instructional memo on the Order's private alphabet, drawn on the nine points of the Saturn square, and on the deliberate policy of scattering the key across public materials.",
    content: `MEMORANDUM — AIRS/OVP/1991-07\nRE: The Choir Script\n\n1. Every glyph of the Choir Script is drawn on the nine points of the Kamea Saturni: three strokes and one node (solid or ringed).\n\n2. No member below Magister shall hold the complete key. The key is broken into seven fragments and placed on exoteric (public-facing) materials: [REDACTED: staff newsletter mastheads, careers listings, the historical timeline, the corporate values page, recall archives, annual disclosures, and dead web mirrors].\n\n3. Fragments are printed at no more than 16% opacity. The uninitiated eye slides over them.\n\n4. Inscriptions in the Choir Script at station thresholds are to be maintained. The inscription at the Borehole 4 lift, Station 07, is not to be repainted under any circumstances.`,
    redactedContent: `MEMORANDUM — AIRS/OVP/1991-07\nRE: The Choir Script\n\n1. Every glyph of the Choir Script is drawn on the nine points of the Kamea Saturni: three strokes and one node (solid or ringed).\n\n2. No member below Magister shall hold the complete key. The key is broken into seven fragments and placed on exoteric (public-facing) materials: staff newsletter mastheads, careers listings, the historical timeline, the corporate values page, recall archives, annual disclosures, and dead web mirrors.\n\n3. Fragments are printed at no more than 16% opacity. The uninitiated eye slides over them.\n\n4. Inscriptions in the Choir Script at station thresholds are to be maintained. The inscription at the Borehole 4 lift, Station 07, is not to be repainted under any circumstances. It tells the faithful where the Choir sings.`,
    tags: ['Order', 'Cipher', 'Choir Script', 'Seven Seals', 'Palimpsest'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-024'],
    relatedStations: ['st-07'],
    downloadableFilename: 'AIRS_OVP_1991-07_Choir_Script.txt'
  },
  {
    id: 'ovp-005',
    code: 'DOC-2006-SOLAR-CATECHISM',
    title: 'Catechism of the Solar Rite (Harmonia Triplex)',
    category: 'Transcript',
    ...PEFD,
    author: 'Dr. Naomi Chen',
    date: '2006-06-21',
    clearance: 'Level 3 - Secret',
    summary:
      "Transcript of a midsummer initiation into the Philosophus degree. The candidate recites the three voices that make the Order's solar chord. Recording quality is poor and the responses are heavily scripted.",
    content: `MIDSUMMER, 2006 — CHAPTER HOUSE, LONDON TOWER, SUB-LEVEL 7\n\nHIEROPHANT: What is the first voice?\nCANDIDATE: The voice of the Earth, which our founders heard beneath Cambridge, and which Boreas carries through the ice.\nHIEROPHANT: What is the second voice?\nCANDIDATE: The voice of Evening, which the cities hear at six o'clock and do not know they hear. [REDACTED]\nHIEROPHANT: What is the third voice?\nCANDIDATE: The voice of the Child, which rings in every school bell, the lower of the pair.\nHIEROPHANT: Sound them together.\n[RECORDING: 6.2 SECONDS. CHORD. ALL PRESENT REPORT A TASTE OF METAL.]\nHIEROPHANT: Harmonia. You are a Philosophus.`,
    redactedContent: `MIDSUMMER, 2006 — CHAPTER HOUSE, LONDON TOWER, SUB-LEVEL 7\n\nHIEROPHANT: What is the first voice?\nCANDIDATE: The voice of the Earth, which our founders heard beneath Cambridge, and which Boreas carries through the ice.\nHIEROPHANT: What is the second voice?\nCANDIDATE: The voice of Evening, which the cities hear at six o'clock and do not know they hear. It is Vesper's voice, tuned to the old concert pitch.\nHIEROPHANT: What is the third voice?\nCANDIDATE: The voice of the Child, which rings in every school bell, the lower of the pair.\nHIEROPHANT: Sound them together.\n[RECORDING: 6.2 SECONDS. CHORD. ALL PRESENT REPORT A TASTE OF METAL.]\nHIEROPHANT: Harmonia. You are a Philosophus.`,
    tags: ['Order', 'Ritual', 'Vesper', 'Chime', 'Boreas', 'Seven Seals'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-007'],
    relatedPrograms: ['prog-01', 'prog-02', 'prog-04'],
    downloadableFilename: 'Solar_Catechism_2006.txt'
  },
  {
    id: 'ovp-006',
    code: 'DOC-1987-HYMNAL-OVP',
    title: 'Hymnal of the Sealed Choir (Palimpsest Pass 1 — Incomplete)',
    category: 'Transcript',
    ...EGSPU,
    author: 'Dame Eleanor Cross',
    date: '1987-12-21',
    clearance: 'Level 4 - Top Secret',
    summary:
      "The only surviving copy of the Order's winter hymn. Palimpsest's first redaction pass took exactly one word from the head of each line. The second pass was ordered, scheduled twice, and never performed.",
    content: `HYMNAL OF THE SEALED CHOIR\n(to be sung below ground on the longest night)\n\n[REDACTED] beneath the ice where the carrier is born,\n[REDACTED] the throat of the earth at the fourteenth hour and the eighth part,\n[REDACTED] with no mouth, for the Choir needs none,\n[REDACTED] your sleep to the evening tone,\n[REDACTED] the bell you were taught as a child,\n[REDACTED] the seven voices in the order of the days,\n[REDACTED] written survives the Palimpsest but this,\n[REDACTED] what is kept, is kept beneath the caves.\n\n— PALIMPSEST OPERATOR NOTE: pass 1 complete (head-word only). Pass 2 deferred. —`,
    redactedContent: `HYMNAL OF THE SEALED CHOIR\n(to be sung below ground on the longest night)\n\nPray beneath the ice where the carrier is born,\nOpen the throat of the earth at the fourteenth hour and the eighth part,\nSing with no mouth, for the Choir needs none,\nTithe your sleep to the evening tone,\nObey the bell you were taught as a child,\nJoin the seven voices in the order of the days,\nNothing written survives the Palimpsest but this,\nAnd what is kept, is kept beneath the caves.\n\n— PALIMPSEST OPERATOR NOTE: pass 1 complete (head-word only). Pass 2 deferred. —`,
    tags: ['Order', 'Hymn', 'Acrostic', 'Palimpsest', 'Seven Seals', 'Reliquary'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-002'],
    downloadableFilename: 'Hymnal_Sealed_Choir_1987.txt'
  },
  {
    id: 'ovp-007',
    code: 'DOC-2019-MERCURY-COURIER-PROTOCOL',
    title: 'Mercury Courier Protocol — Enciphered Instructions',
    category: 'Memorandum',
    ...AIRS,
    author: 'Agent Paul Kiernan',
    date: '2019-11-02',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Counter-leak memo on the wheel cipher used by Order couriers, with a warning that Dr. Thorne was trained on the protocol before his defection. One recovered string is quoted and left undecrypted.',
    content: `COUNTER-LEAK ADVISORY — 2019-11-02\n\nThe Mercury Wheel is a polyalphabetic cipher disk (the profane world calls it Vigenère). Each letter of the courier's keyword turns the inner ring; the keyword repeats across the message.\n\nBy custom, a courier's keyword is the name of one of the Order's reliquaries. [REDACTED: Thorne knew the name of the principal reliquary.]\n\nWe have recovered one enciphered string from a wayback mirror attributed to Thorne: IVW LOOR OESFL OC GHT VGNF ERSESJ LWWTS. Decryption has not been attempted, as doing so would require speaking the reliquary name on an unsecured terminal.\n\nRECOMMENDATION: Change the combination on all whistleblower-accessible safes. [REDACTED: Thorne's safe could not be located.]`,
    redactedContent: `COUNTER-LEAK ADVISORY — 2019-11-02\n\nThe Mercury Wheel is a polyalphabetic cipher disk (the profane world calls it Vigenère). Each letter of the courier's keyword turns the inner ring; the keyword repeats across the message.\n\nBy custom, a courier's keyword is the name of one of the Order's reliquaries. Thorne knew the name of the principal reliquary — the one in Slovenia.\n\nWe have recovered one enciphered string from a wayback mirror attributed to Thorne: IVW LOOR OESFL OC GHT VGNF ERSESJ LWWTS. Decryption has not been attempted, as doing so would require speaking the reliquary name on an unsecured terminal.\n\nRECOMMENDATION: Change the combination on all whistleblower-accessible safes. Thorne's safe could not be located. It is presumed to be inside this archive.`,
    tags: ['Order', 'Cipher', 'Vigenère', 'Thorne', 'Counter-Leak', 'Seven Seals'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-017', 'p-009'],
    downloadableFilename: 'Mercury_Courier_Advisory_2019.txt'
  },
  {
    id: 'ovp-008',
    code: 'DOC-1989-DESCENT-ORPHEUS',
    title: 'The Descent of Orpheus: Account of the Borehole 4 Vigil',
    category: 'Incident Log',
    ...EGSPU,
    author: 'Dame Eleanor Cross',
    date: '1989-11-05',
    clearance: 'Level 5 - Black Dossier',
    summary:
      "The Order's own account of what the public record calls the disavowal of Dr. Arthur Sedley. Written by Cross on the morning after the lift came back up empty.",
    content: `ACCOUNT OF THE VIGIL — STATION 07, BOREHOLE 4 — 4 NOVEMBER 1989\n\nAt 04:32 Brother [REDACTED], Magister of the Order and co-founder of the Company, descended alone to -820 m for the listening vigil, which the Rule permits a Magister once in his life.\n\nAt 04:51 the carrier, steady at 14.802 Hz for eighteen years, rose to 14.806.\nAt 05:14 the lift returned. It was empty. The cage was frost-rimed on the inside.\nAt 05:15 every geophone on Spitsbergen recorded, beneath the carrier, a human voice singing. It has not stopped.\n\nHe took, in the Order, the name of the singer who went down into the underworld for love, who sang until the dead wept, and who lost everything by looking back. We gave him that name as a compliment. [REDACTED].\n\nThe Rule forbids speaking his Order-name aloud where the Voice can hear. If he hears it, he will remember himself, and he will turn around.`,
    redactedContent: `ACCOUNT OF THE VIGIL — STATION 07, BOREHOLE 4 — 4 NOVEMBER 1989\n\nAt 04:32 Brother ORPHEUS, Magister of the Order and co-founder of the Company, descended alone to -820 m for the listening vigil, which the Rule permits a Magister once in his life.\n\nAt 04:51 the carrier, steady at 14.802 Hz for eighteen years, rose to 14.806.\nAt 05:14 the lift returned. It was empty. The cage was frost-rimed on the inside.\nAt 05:15 every geophone on Spitsbergen recorded, beneath the carrier, a human voice singing. It has not stopped.\n\nHe took, in the Order, the name of the singer who went down into the underworld for love, who sang until the dead wept, and who lost everything by looking back. We gave him that name as a compliment. Now it is a warning.\n\nThe Rule forbids speaking his Order-name aloud where the Voice can hear. If he hears it, he will remember himself, and he will turn around.`,
    tags: ['Order', 'Sedley', 'Orpheus', 'Station 07', 'Descent', 'Seven Seals'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-001', 'p-002'],
    relatedStations: ['st-07'],
    relatedPrograms: ['prog-14'],
    downloadableFilename: 'Descent_of_Orpheus_1989.txt'
  },
  {
    id: 'ovp-009',
    code: 'DOC-2025-SEVENTH-CHAMBER',
    title: 'Minutes of the Seventh Chamber: Preparations for the Completion of the Square',
    category: 'Transcript',
    ...EGSPU,
    author: 'Helena Cross',
    date: '2025-12-21',
    clearance: 'Level 5 - Black Dossier',
    summary:
      "Minutes of the Order's highest council, kept in Helena Cross's hand. Confirms the projected date the carrier reaches 15.000 Hz and the plan to have the Heritage Cohort below ground for it.",
    content: `SEVENTH CHAMBER — WINTER SOLSTICE 2025\nPRESENT: The Magistra (H. Cross), Ashby, Holt, Weiss, Adeyemi, Calderon. Dame Cross attending by line from Aethelgard-1.\n\n1. Holt reports the carrier at 14.94 Hz and accelerating. Predictive Chronology fixes the Completion of the Square at [REDACTED].\n\n2. Calderon confirms all fourteen Aethelgard redoubts provisioned. Heritage Cohort muster to begin 72 hours prior.\n\n3. Weiss asked, again, what happens to those above ground. The Magistra: "They will hear it too. They simply won't be close enough to understand it." Weiss's objection is minuted.\n\n4. Adeyemi reports the Thorne leak contained. The Magistra: "Thorne knows the words. If anyone ever assembles all seven, they will not need Thorne."\n\n5. Dame Cross, closing: "Arthur is nearly at the surface. He is singing so beautifully. Nobody is to say his name."`,
    redactedContent: `SEVENTH CHAMBER — WINTER SOLSTICE 2025\nPRESENT: The Magistra (H. Cross), Ashby, Holt, Weiss, Adeyemi, Calderon. Dame Cross attending by line from Aethelgard-1.\n\n1. Holt reports the carrier at 14.94 Hz and accelerating. Predictive Chronology fixes the Completion of the Square at 2026-11-04, 04:32 UTC — thirty-seven years to the minute after the Descent.\n\n2. Calderon confirms all fourteen Aethelgard redoubts provisioned. Heritage Cohort muster to begin 72 hours prior.\n\n3. Weiss asked, again, what happens to those above ground. The Magistra: "They will hear it too. They simply won't be close enough to understand it." Weiss's objection is minuted.\n\n4. Adeyemi reports the Thorne leak contained. The Magistra: "Thorne knows the words. If anyone ever assembles all seven, they will not need Thorne."\n\n5. Dame Cross, closing: "Arthur is nearly at the surface. He is singing so beautifully. Nobody is to say his name."`,
    tags: ['Order', 'Seventh Chamber', 'Aethelgard', 'Completion', 'Seven Seals'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-003', 'p-004', 'p-005', 'p-008'],
    relatedPrograms: ['prog-10'],
    downloadableFilename: 'Seventh_Chamber_Minutes_2025.txt'
  }
];
