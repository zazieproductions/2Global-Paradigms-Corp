import type { MeetingRecord } from '@/types';

/**
 * Board and directorate minutes.
 *
 * The minutes are the archive's transcript of record, so they read like
 * minutes: procedural, passive, and evasive. The redacted discussions were
 * transcribed from audio by AIRS and carry the voices of the room, including
 * the interruptions. Nobody in these rooms makes a speech.
 */
export const MEETING_RECORDS: MeetingRecord[] = [
  {
    id: 'meet-01',
    meetingCode: 'MIN-1989-BOARD-EMERGENCY',
    title: 'Emergency Board Session: Station 07 Borehole 4 Breach & Co-Founder Disavowal',
    date: '1989-11-12 14:00 GMT',
    location: 'Tower Obsidian, The Obsidian Boardroom (Floor 54), London',
    chairperson: 'Dame Eleanor Cross',
    attendees: [
      'Dame Eleanor Cross (Co-Founder)',
      'Dr. Arthur Sedley (Co-Founder - IN ABSENTIA)',
      'Lord Malcolm Ashby (Board Director)',
      'Major-General Keith Alford (Defense Liaison)',
      'Julian Thorne (Chief Archivist)'
    ],
    agenda: [
      '1. Review of physical telemetry from Spitsbergen Borehole 4 (-820m).',
      '2. Disavowal and official termination of Dr. Arthur Sedley.',
      '3. Reclassification of the 14.8Hz harmonic frequency under Defense Category Alpha.'
    ],
    minutes:
      'Called to order 14:05. The board reviewed the physical telemetry recovered from Borehole 4 following the 4 November breakthrough. The drill entered a void at 812 metres and the array recorded a sustained 14.8Hz carrier with a 312Hz overtone for eleven hours before the cable failed. Dr. Sedley had gone down at 09:20 against the advice of the drilling superintendent and did not come back up. The lift was recovered at 13:40 with the cage empty and the intercom still live. Lord Ashby asked twice whether the carrier was still present at the collar. It was.',
    motionsPassed: [
      'Motion 89-01: Dr. Arthur Sedley is declared legally deceased as of 1989-11-04. His name, papers and research notes transfer to AIRS for retrospective redaction.',
      'Motion 89-02: Borehole 4 is sealed with 600 metric tons of barite concrete. No memorial and no marker.',
      'Motion 89-03: Vesting of the Sedley family trust is deferred pending review. Project Vesper is authorised to begin municipal harmonic testing in the United Kingdom.'
    ],
    redactedDiscussion:
      "[AIRS LEVEL 5 RESTRICTED]: Cross opposed the disavowal motion for eleven minutes and then voted for it. In the audio she can be heard asking Thorne to keep the intercom recording. Thorne replied that the tape had already gone to the vault. Ashby asked what would be said to Sedley's family and was told there would be a car accident in Switzerland. General Alford noted that the Defence Ministry would want the site under its own classification within the year, and that the company should get its paperwork in first.",
    clearance: 'Level 5 - Black Dossier'
  },
  {
    id: 'meet-02',
    meetingCode: 'MIN-1994-RESON8-RECALL',
    title: 'Executive Crisis Committee: Reson-8 Consumer Recall Strategy',
    date: '1994-05-02 09:30 EST',
    location: 'Rosslyn Sub-Complex, Crisis Room 01, Arlington, VA',
    chairperson: 'Nigel Ashby (Managing Director)',
    attendees: [
      'Nigel Ashby (Managing Director)',
      'Dr. Naomi Chen (Lead Acoustician)',
      'Harrison Blake (Communications Director)',
      'Philip Warrender (Legal Counsel)'
    ],
    agenda: [
      '1. Review of class-action filings and coroner reports regarding Reson-8 sleep devices.',
      '2. Voluntary recall announcement vs. mandatory federal recall.',
      '3. Destruction protocol for 140,000 returned units at Site 19.'
    ],
    minutes:
      'Convened 09:40. Chen presented the bench results: 216Hz and 222.8Hz oscillators, 6.8Hz beat, and a mains transformer that had never been screened. In a pre-war house with unshielded wiring the room itself became the second radiator. Two coroners had already written the phrase "auditory hallucination" in their reports and neither had been able to explain it. Blake had the draft of a recall notice quoting a $48.2M settlement reserve. Warrender objected to the phrase "we regret" and it stayed in.',
    motionsPassed: [
      'Motion 94-01: Voluntary recall issued on the stated grounds of power cord overheating. Wording to avoid the words acoustic, frequency and sleep in the same sentence.',
      'Motion 94-02: Litigation reserve of £48.2M moved to Swiss escrow. Families to be settled individually and separately, at the figure requested, without admission.',
      'Motion 94-03: All returned units shipped to Site 19 under armed guard and pressed into the salt vaults. Serial numbers destroyed at the plant.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 4 RESTRICTED]: Blake reported that three US networks had agreed to hold investigative pieces; the consideration was a package of transit contracts announced in the same quarter. Warrender asked whether the network lawyers knew what they were holding and Blake said they had not asked. Chen, who is not recorded speaking again for the remainder of the meeting, was asked for a medical opinion on the term "sleep paralysis" and gave a definition of eleven words.',
    clearance: 'Level 4 - Top Secret'
  },
  {
    id: 'meet-03',
    meetingCode: 'MIN-2011-OAKHAVEN-REVIEW',
    title: 'Ethics & Operational Review: Project Vesper Oakhaven Field Trial',
    date: '2011-10-04 11:00 EST',
    location: 'Rosslyn Sub-Complex, Vault 02, Arlington, VA',
    chairperson: 'Dr. Naomi Chen',
    attendees: [
      'Dr. Naomi Chen (Director, PEFD)',
      'Dr. Tobias Voss (Director, BECM)',
      'Dr. Diane Kowalski (Neurological Hygiene Officer)',
      'Agent Paul Kiernan (Security Officer)'
    ],
    agenda: [
      '1. Review of the September 18 Oakhaven mass dissociation event.',
      '2. Post-trial medical monitoring and memory dampening metrics.',
      '3. Adjustments to municipal transit broadcast power thresholds.'
    ],
    minutes:
      'Chen opened with the footage from the Oakhaven county substation incident of 18 September, taken from three municipal cameras. During the 18:00 Vesper broadcast, 61% of the intersection froze in place. Kowalski had 42 people through the clinic by the end of the week: dizziness, vomiting, and a fixed stare she described in the log as "looking at the fountain, but the fountain was behind them". Thirty-nine recovered inside forty-eight hours. Three did not, and are still under sedation at the Rosslyn annex under a different diagnosis.',
    motionsPassed: [
      'Motion 11-01: Vesper broadcast amplitude permanently capped at -18dB over ambient urban noise. Cap to be enforced in firmware, not in policy.',
      'Motion 11-02: Oakhaven trial disavowed as an unauthorised field experiment by a contractor who will not be named. Case file folded into Project Palimpsest.',
      'Motion 11-03: Expansion into enclosed transit networks authorised where reverberation is measurable and the route can be closed for an evening.'
    ],
    redactedDiscussion:
      "[AIRS LEVEL 4 RESTRICTED]: Voss asked whether the county would ask for the test data, and Kiernan said the county would be asking about the substation instead. No one in the room had seen the substation report. Voss volunteered that the following twelve months of Oakhaven tax compliance had been the strongest in the county's history, and that this fact should be in the file but not in the summary. Chen asked him to leave. He did not.",
    clearance: 'Level 4 - Top Secret'
  },
  {
    id: 'meet-04',
    meetingCode: 'MIN-2016-HERITAGE-ALLOCATION',
    title: 'Civic Continuity Steering Group: Tier-1 Heritage Cohort Seat Allocation',
    date: '2016-04-18 10:00 CET',
    location: 'Swiss Alps Redoubt, Council Chamber 01, Grimsel Pass',
    chairperson: 'Mara Finch',
    attendees: [
      'Mara Finch (Director, CCDR)',
      'Dame Eleanor Cross (Board President)',
      'Helena Cross (Executive VP)',
      'Martin Sedley (Deputy Director, CCDR)'
    ],
    agenda: [
      '1. Finalization of the 10,000-seat Tier-1 Heritage Cohort roster.',
      '2. Sovereign continuity retainer contracts and treaty alignments.',
      '3. Subterranean provisioning for 720 days of autonomous isolation.'
    ],
    minutes:
      'The group signed off the roster in the morning and spent the afternoon on the reserve list, which is where the difficulty was. Eighteen partner governments had taken 60% of the seats for named individuals; the remaining 4,000 went to staff, seed stock and a list of trades the group agreed should include a dentist and two obstetricians. Martin Sedley asked whether the roster would be published. It will not. Sedley noted for the record that the enrolment letters sent to the 8,000th member were dated 1972 and that nobody had explained the date.',
    motionsPassed: [
      'Motion 16-01: Titanium-RFID biometric credentials approved for production. Duplicates of every credential to be held at Grimsel only.',
      'Motion 16-02: 720-day reserves confirmed at Grimsel Pass, Woomera and Jeju Island (100% capacity), with secondary provisioning at Site 19 and Postojna.',
      'Motion 16-03: Mandatory psychological screening for all secondary heirs and for any spouse holding a duplicate credential.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 5 RESTRICTED]: Dame Eleanor confirmed that the airlocks at all fourteen redoubts will seal automatically on an un-attenuated surge above 12dB and that no manual override will be fitted, by design, including to her own. Helena Cross asked what the residents would be told if the doors sealed. There is a four-second silence on the tape before her mother answers: "That it is a practice."',
    clearance: 'Level 5 - Black Dossier'
  },
  {
    id: 'meet-05',
    meetingCode: 'MIN-2020-PALIMPSEST-SECURITY',
    title: 'Special Security Session: Counter-Leak Measures & Postojna Hash Migration',
    date: '2020-02-10 16:00 GMT',
    location: 'Tower Obsidian, Secure Briefing Room 4B, London',
    chairperson: 'CEO Nigel Ashby',
    attendees: [
      'CEO Nigel Ashby (Chairman)',
      'Vincent Adeyemi (Senior Curator & Redaction Officer)',
      'Agent Paul Kiernan (Special Agent, TOPN)',
      'Philip Warrender (Legal Counsel)'
    ],
    agenda: [
      '1. Status of the manhunt for whistleblower Dr. Ewan Thorne.',
      '2. Audit of the 48GB exfiltrated Station 07 telemetry files.',
      '3. Deployment of real-time SHA-256 hash re-encoders in Postojna Caverns.'
    ],
    minutes:
      'Ashby opened by asking how many copies existed. Kiernan said thirty-two mirrors were down, and that he was not going to say how many were up. The leaked set is the 2019 exfiltration: borehole audio, the 1989 intercom tape, and personnel files from the consumer division. Adeyemi reported the Postojna hash migration complete for everything before 2016, which does not invalidate any copy already outside the building; it only makes an external copy detectable, which is what they bought. Warrender advised against the reward and was overruled in four minutes.',
    motionsPassed: [
      'Motion 20-01: £250,000 reward authorised for information leading to the location of Dr. Ewan Thorne. Notices placed in the trade press only.',
      'Motion 20-02: All intranet endpoints to run automatic keyword and waveform redaction. Redactions to be visible in the document, not silent.',
      'Motion 20-03: Termination of Julian Thorne confirmed, with medical memory remediation completed on 7 February. Personnel file to read as retirement.'
    ],
    redactedDiscussion:
      "[AIRS LEVEL 5 RESTRICTED]: Kiernan reported that Thorne's relay is still transmitting a 14.8Hz sub-carrier every Friday at 03:14 UTC and that the payload is unchanged since November. There is no geolocation. Ashby asked whether Thorne was doing it to be found. Kiernan said no, and that the Friday schedule was the only thing about it that looked like a courtesy.",
    clearance: 'Level 5 - Black Dossier'
  },
  {
    id: 'meet-06',
    meetingCode: 'MIN-2022-CHRONO-AUDIT',
    title: 'SFPC Directorate Quarterly: Predictive Chronology Variance Assessment',
    date: '2022-07-14 14:30 GMT',
    location: 'Tower Obsidian, Predictive War Room (Floor 44), London',
    chairperson: 'Dr. Thaddeus Holt',
    attendees: [
      'Dr. Thaddeus Holt (Director, SFPC)',
      'Dr. Evelyn Reed (Lead Chronological Modeler)',
      'Dr. Anya Sharma (Demographic Variance Modeler)',
      'Zhenya Petrov (Quantitative Forecaster)'
    ],
    agenda: [
      '1. Performance review of the ChronoForecast v8.2 probability engine.',
      '2. Analysis of the 432-day periodic cycle in global civil unrest.',
      '3. Calibration of Project Echo-State synthetic twin cities.'
    ],
    minutes:
      "Reed presented the 432-day cycle: 84 cities, four centuries of unrest data, and a periodicity that survives every correction the team has been able to throw at it. The engine's error against the last nineteen cycles is under 2%, which is better than the instruments. Sharma reported that carrier-tone injection moved unrest probability by roughly a third in the pilot cities. Petrov asked whether the 432-day period would hold past 2026 and was asked to keep that question in the annex.",
    motionsPassed: [
      'Motion 22-01: Predictive horizon extended from 90 to 720 days. Variance disclosure to clients remains capped at 30 days.',
      'Motion 22-02: Echo-State integrated with live transit card telemetry in London and Tokyo. The 8.8 million London agents to be refreshed quarterly.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 4 RESTRICTED]: Holt raised the unconstrained runs. When the engine is allowed to run past 2026 without a floor, every branch converges on a single stationary state, dated 13 months out from the run, with no events and no variance. Reed has named it the Null Interval in her own notes. Nobody in the room proposes publishing it. Petrov can be heard closing his folder before the vote.',
    clearance: 'Level 4 - Top Secret'
  },
  {
    id: 'meet-07',
    meetingCode: 'MIN-2023-SITE19-CONTAINMENT',
    title: 'SISO Operational Briefing: Salt Lake Trench Structural Integrity',
    date: '2023-09-08 10:00 MST',
    location: 'Site 19, Sub-Level 3 Operations Room, Utah',
    chairperson: 'Chief Engineer Sarah Lin',
    attendees: [
      'Chief Engineer Sarah Lin (Chief Engineer, SISO)',
      'Commander J. R. Calderon (Operations Commander)',
      'Frank Bedell (Security Officer)',
      'Niall O’Connor (Maintenance Supervisor)'
    ],
    agenda: [
      '1. Review of Sub-Level 6 acoustic vibration sensor data.',
      '2. Injection schedule for 40,000 tons of acoustic dampening grout.',
      '3. Surface acoustic camouflage protocols along the Great Salt Lake boundary.'
    ],
    minutes:
      'Lin reported the micro-fractures in the salt dome had stabilised after the third grout pass, with the 32.4Hz containment tone holding at 114dB in Chamber 04 and no leakage above the detection floor at the perimeter fence. Calderon walked through the camouflage: a brine pumping concession and a bird survey, both real, both funded through the end of 2025. O’Connor asked for two more hands on Sub-Level 5 and did not get them; the request is minuted.',
    motionsPassed: [
      'Motion 23-01: Containment tone at 114dB maintained continuously. Any interruption above four minutes to be reported to the Operations Commander personally and not in writing.',
      'Motion 23-02: Sub-Level 6 access restricted to staff in Class-A acoustic protection. O’Connor to be issued a key he is not to use without Lin present.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 4 RESTRICTED]: Lin noted that under sustained acoustic pressure the salt is recrystallising into concentric hexagonal sheets, and that the chamber floor has risen 11mm since spring. Bedell asked what happens if it keeps rising. Lin said the grout columns would be cut and re-poured, which is a two-year job, and then said off the record that she has been measuring the rise against the tone and does not have a theory she is willing to write down.',
    clearance: 'Level 4 - Top Secret'
  },
  {
    id: 'meet-08',
    meetingCode: 'MIN-2024-MONOLITH-TELEMETRY',
    title: 'Joint Directorate Session: Project Monolith Mantle Beacon Analysis',
    date: '2024-04-22 15:00 GMT',
    location: 'Tower Obsidian, The Obsidian Penthouse, London',
    chairperson: 'CEO Nigel Ashby',
    attendees: [
      'CEO Nigel Ashby (Chairman)',
      'Dr. Henrik Lindqvist (Director, ASIAN)',
      'Dr. Tariq Al-Mansoor (Lead Oceanographer)',
      'Dr. Naomi Chen (Director, PEFD)',
      'Helena Cross (Executive VP)'
    ],
    agenda: [
      '1. Review of synchronized 54Hz/14.8Hz telemetry from Diego Garcia, Svalbard, and the Azores.',
      "2. Calculation of signal transit times through the D'' mantle layer.",
      '3. Strategic implications for the 2026-2030 corporate continuity mandate.'
    ],
    minutes:
      'Al-Mansoor and Lindqvist presented the three-station triangulation. The deep beacon has drifted 0.05% toward 15.0Hz over 24 months, is phase-locked to core rotation, and carries structure: the pulses are not even, and Al-Mansoor has been treating the unevenness as encoding since January. Ashby asked what it says. Lindqvist said the team has a candidate reading and does not want to say it aloud in a room with five people in it. The budget line was approved without discussion.',
    motionsPassed: [
      'Motion 24-01: Project Monolith budget increased to £920M annually for three years.',
      'Motion 24-02: Two additional hydrophone arrays, Cayman Trench and South Atlantic, installed under a seismic-survey cover.',
      'Motion 24-03: Draft Executive Directive 01 governing the 15.0Hz phase transition. Directive 01 to be held in the vault, not the intranet.'
    ],
    redactedDiscussion:
      "[AIRS LEVEL 5 RESTRICTED]: Chen argued the drift is coupled to the company's own surface transmitters and asked for the injection schedule to be curtailed pending a review. Ashby asked what curtailing would do to the municipal contracts and Chen did not answer. Cross put three versions of a phased schedule to the room. Lindqvist took the last one apart line by line, then voted for it anyway. The vote on the schedule was three to two and is recorded in the appendix that is not attached to these minutes.",
    clearance: 'Level 5 - Black Dossier'
  },
  {
    id: 'meet-09',
    meetingCode: 'MIN-2024-BEHAVIORAL-METRICS',
    title: 'BECM Compliance Review: Cellular Carrier Sub-Harmonic Deployment',
    date: '2024-11-12 11:30 JST',
    location: 'Tokyo Chiyoda Deep Tower, B3 Executive Suite',
    chairperson: 'Dr. Tobias Voss',
    attendees: [
      'Dr. Tobias Voss (Director, BECM)',
      'Dr. Brigitte Laroche (Lead Behavioral Analyst)',
      'Dr. Hiroshi Tanaka (Neural Synchronization Specialist)',
      'Dr. Ronald Abernathy (Psychological Vetting Officer)'
    ],
    agenda: [
      '1. Review of pilot cellular carrier acoustic injection in East Asian transit networks.',
      '2. Employee internal psychological stability index results.',
      '3. Finalization of the 2025 mandatory compliance diagnostic.'
    ],
    minutes:
      'Laroche presented the transit pilots: impulsive assembly down 38.6% across six networks, measured by patrol reports rather than cameras. Tanaka, who built the phone-coil delivery, said the effect is real and that he does not like the second-order finding, which the group then spent fifty minutes on: staff who score low on the internal diagnostic are the same staff who report a whisper in the air conditioning, and the overlap is 71%. Abernathy proposed the diagnostic be made mandatory annually for Level 3 and above. Laroche seconded before he finished.',
    motionsPassed: [
      'Motion 24-04: Mandatory annual Cognitive Stability Diagnostic for all Level 3+ employees, effective January 2025. A score below 75% triggers a referral, not a suspension.',
      'Motion 24-05: Behavioural tracking integrated into the intranet portal. Any colleague may request their own tracking record, which nobody on the committee expects anyone to do.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 3 RESTRICTED]: Tanaka asked whether the whispers predate the deployment. Nobody had the baseline. Abernathy said his own caseload is eleven people and twelve of them have asked for the drops. Laroche corrected him to eleven. The recording ends before the correction is resolved.',
    clearance: 'Level 3 - Secret'
  },
  {
    id: 'meet-10',
    meetingCode: 'MIN-2025-EXECUTIVE-CONTINUITY',
    title: 'Annual Executive Governance Council: 2026 Strategic Horizon & Lockdown Readiness',
    date: '2025-09-18 16:00 GMT',
    location: 'Tower Obsidian, Floor 54, London & Encrypted Swiss Video Link',
    chairperson: 'CEO Nigel Ashby',
    attendees: [
      'CEO Nigel Ashby (Chairman)',
      'Dame Eleanor Cross (Co-Founder - via Swiss Alps Video Link)',
      'Helena Cross (Executive VP)',
      'Mara Finch (Director, CCDR)',
      'Chief Engineer Sarah Lin (Chief Engineer, SISO)'
    ],
    agenda: [
      '1. Final inspection report on the 14 Aethelgard subterranean redoubts.',
      '2. Sovereign continuity contract renewals for 2026.',
      '3. Verification of autonomous governance protocols under Executive Directive 01.'
    ],
    minutes:
      "All fourteen redoubts certified for 720 days of autonomous operation, with two exceptions noted and accepted: Jeju has eleven fewer berths than the roster and Woomera's ventilation requires a part that ships in February. Finch reported the Heritage Cohort roster closed at 10,000 with a reserve of 340. Lin confirmed Postojna holds the synchronised copies and that the originals remain in their own archive, which she said was not her decision to explain. Ashby signed the directive in the room. The drill was set for December.",
    motionsPassed: [
      'Motion 25-01: 2026 budget approved at £9.82bn, with the Monolith line protected from the discretionary freeze.',
      'Motion 25-02: Full lockdown readiness drill scheduled for December 2025 across all 22 field stations. Drill to be announced as a fire regulation exercise.',
      'Motion 25-03: Permanent archival seal placed on all records prior to 1990. Access by countersignature of two directors, one of whom must be a Cross.'
    ],
    redactedDiscussion:
      '[AIRS LEVEL 5 RESTRICTED]: The video link dropped twice. On the second return, Dame Eleanor Cross can be heard mid-sentence and does not repeat the beginning. She speaks for ninety seconds about the redoubts, about the families who will not be in them, and about her own decision not to leave the Grimsel complex again, and then asks Helena to make sure the staff who built the chambers are looked after in the surface plan. Helena says she will. There is no further discussion, and the meeting closes at 16:41.',
    clearance: 'Level 5 - Black Dossier'
  }
];
