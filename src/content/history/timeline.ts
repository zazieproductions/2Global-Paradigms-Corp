import type { TimelineEntry } from '@/types';

/**
 * Corporate chronology as it appears in the internal archive.
 *
 * House style: entries are written by different hands over fifty years. Some
 * are proud, some are bored, some are careful. The public wording is what the
 * company said at the time; the internal line is what somebody typed into the
 * record afterwards.
 */
export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'tl-01',
    year: 1971,
    dateString: '1971-04-12',
    title: 'Paradigms Systems Ltd. founded in Cambridge',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'EGSPU',
    classification: 'Level 1 - General',
    description:
      "Dr. Arthur Sedley and Eleanor Cross incorporate Paradigms Systems Ltd. at a solicitor's office on Sidney Street and begin selling risk forecasts to banks. First year turnover is £14,000. The company has no product and one client.",
    internalImpact:
      'Sedley has already started the ground-noise work in the back of the office. The founding document lists a research programme that nobody outside the two of them has read.',
    isCovert: false
  },
  {
    id: 'tl-02',
    year: 1974,
    dateString: '1974-09-18',
    title: 'The Cambridge baseline is measured',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'PEFD',
    classification: 'Level 4 - Top Secret',
    description:
      'Seismology work on the Fens picks up a continuous 14.8Hz signal in the bedrock. Sedley checks the instrument four times, then has Cross check it. Research quietly moves off the economics books and onto a private account.',
    internalImpact:
      'The Global Baseline Carrier is written up in eleven pages of longhand. Page 9 contains the sentence that the rest of the company is built on, and page 9 is not in the archive.',
    isCovert: true
  },
  {
    id: 'tl-03',
    year: 1978,
    dateString: '1978-06-14',
    title: 'First evening broadcast, London Underground Central Line',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'PEFD',
    classification: 'Level 4 - Top Secret',
    description:
      'Tones are played through the Central Line public address after the last service, three nights running. Platform staff are told it is a fire-system test and are paid overtime to stay away from the platforms.',
    internalImpact:
      'Passenger agitation incidents fall by a fifth in the following quarter and the loss sheets are the cleanest anyone has seen. The programme that comes out of this night eventually becomes Vesper, and the same three stations are still on the schedule.',
    isCovert: true
  },
  {
    id: 'tl-04',
    year: 1979,
    dateString: '1979-09-20',
    title: 'Site 19 broken open in the Utah salt flats',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'SISO',
    classification: 'Level 3 - Secret',
    description:
      'Drilling begins west of the Great Salt Lake. A press notice in the local paper describes a potash exploration programme, which is what the land is nominally leased for.',
    internalImpact:
      'The salt gives the company somewhere to be loud. Every containment tone in use today was calibrated in Chamber 01, and the first calibration was done by ear.',
    isCovert: true
  },
  {
    id: 'tl-05',
    year: 1982,
    dateString: '1982-08-15',
    title: 'Rosslyn sub-complex opens',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'EGSPU',
    classification: 'Level 2 - Confidential',
    description:
      'The North American headquarters opens in Arlington with three sub-basement levels that do not appear on the building plan filed with the county. The filed plan shows a plant room of unremarkable size.',
    internalImpact:
      'Rosslyn is where the client-facing work happens. It is also the only GPC site that has never once been audited by the people who built it, which Cross has been asked about twice and has not answered twice.',
    isCovert: false
  },
  {
    id: 'tl-06',
    year: 1984,
    dateString: '1984-10-05',
    title: 'Paradigms International becomes Global Paradigms Corporation',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'CCDR',
    classification: 'Level 1 - General',
    description:
      'The group consolidates under one name and one set of accounts. Contracts carry over without amendment, which took longer to arrange than the rebranding itself.',
    internalImpact:
      "Ground is broken at Grimsel Pass in the same week, three hundred metres inside a mountain. Both events were announced in the same press release because the second one needed the first one's activity to hide behind.",
    isCovert: false
  },
  {
    id: 'tl-07',
    year: 1985,
    dateString: '1985-09-08',
    title: 'Mojave corridor powered up (Sector 44)',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'SISO',
    classification: 'Level 3 - Secret',
    description:
      'Eighty miles of surface transducers are switched on in the Nevada desert to see how far a very low tone will carry. It carries 1,200 miles on the first attempt, further than the model allowed for, and takes four days to switch off properly.',
    internalImpact:
      'Stentor is built on the Mojave result. Two of the transducers are still out there under the sand because nobody has been able to justify the recovery cost, and the site file has been amended twice to explain the power draw.',
    isCovert: true
  },
  {
    id: 'tl-08',
    year: 1986,
    dateString: '1986-11-10',
    title: 'Station 07 opens on Spitsbergen',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'ASIAN',
    classification: 'Level 1 - General',
    description:
      'The Svalbard station opens as a twelve-person atmospheric research post under the Svalbard Treaty. It has a wet lab, a darkroom nobody uses, and one borehole that predates the buildings it sits between.',
    internalImpact:
      'Borehole 4 was drilled to 820 metres the previous winter by a crew who were told they were working for a mining survey. The drillers were paid in cash and none of them were Norwegian, which Lindqvist chose personally.',
    isCovert: false
  },
  {
    id: 'tl-09',
    year: 1987,
    dateString: '1987-10-19',
    title: 'Clients warned ahead of Black Monday',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'SFPC',
    classification: 'Level 3 - Secret',
    description:
      'The forecasting desk tells its sovereign and banking clients to be out of equities three days before the crash. Twelve of them move. The rest thank the company afterwards for the warning and ask why they were not more insistent.',
    internalImpact:
      'The desk did not predict the crash. It predicted a valuation gap of the size the crash filled, and no one has ever established which model produced the date. £3.2bn of client capital is preserved and GPC is now a name that treasuries take calls from.',
    isCovert: true
  },
  {
    id: 'tl-10',
    year: 1989,
    dateString: '1989-03-01',
    title: 'Tokyo Chiyoda Deep Tower signs its first tenant',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'BECM',
    classification: 'Level 1 - General',
    description:
      'The Pacific Basin office opens with a trading floor, a canteen on B3 and a basement that goes further down than the tower next door. The name over the door is Paradigms, which is why the lobby brass is a talking point in the district.',
    internalImpact:
      'Japan runs two grid frequencies, 50Hz east and 60Hz west, and the tower sits close enough to the boundary to work both. The first grid harmonics work is done here by a team of four and the file has never been declassified.',
    isCovert: false
  },
  {
    id: 'tl-11',
    year: 1989,
    dateString: '1989-11-04',
    title: 'Borehole 4 breaks through. Sedley goes down',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'EGSPU',
    classification: 'Level 5 - Black Dossier',
    description:
      'The drill enters a void at 812 metres. At 09:20 that morning Sedley takes the inspection cage down alone against the advice of the drilling superintendent. The cage comes back at 05:14 the next morning, empty, and the intercom has been live the entire time.',
    internalImpact:
      'Borehole 4 is sealed with 600 tonnes of barite concrete by the end of the month. Directive 09 removes Sedley from the record as a co-founder and replaces him with a motor accident in Switzerland, which his family was told on the same day.',
    isCovert: true
  },
  {
    id: 'tl-12',
    year: 1989,
    dateString: '1989-11-20',
    title: 'Project Vesper chartered',
    era: 'Early Foundations (1971-1989)',
    departmentCode: 'PEFD',
    classification: 'Level 4 - Top Secret',
    description:
      'Vesper moves from trial to standing programme eleven days after the borehole is sealed, with a charter that runs to four pages and a schedule written to the hour.',
    internalImpact:
      'The first standing deployments are Birmingham, Manchester and Lyon, all on the same evening, all on the same 18:00 schedule. Nobody in the delivery team asked why the schedule was fixed before the cities were chosen.',
    isCovert: true
  },
  {
    id: 'tl-13',
    year: 1991,
    dateString: '1991-11-20',
    title: 'Woomera redoubt dug out',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'CCDR',
    classification: 'Level 3 - Secret',
    description:
      'Work begins in South Australia on a continuity depot with an air filtration plant built for two years of closed operation. Local land records show a storage lease held by an agricultural name that does not exist.',
    internalImpact:
      "Woomera completes Aethelgard's southern arc. The Aethelgard file now has three continents and a schedule that assumes all fourteen sites will be finished before the carrier reaches 15.0Hz, which at the time of writing is 35 years away.",
    isCovert: true
  },
  {
    id: 'tl-14',
    year: 1992,
    dateString: '1992-04-10',
    title: 'Reson-8 sleep machine goes on sale',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'PEFD',
    classification: 'Level 1 - General',
    description:
      'The consumer division launches a two-oscillator bedside unit on the back of a television campaign. The product is priced at £149 in the UK and $229 in the US and is sold as a non-pharmaceutical answer to insomnia.',
    internalImpact:
      'The specification went out with an unscreened mains transformer because the screened one added 40p to the build cost. That 40p is the whole of the Reson-8 story. 140,000 units are sold by the spring of 1994.',
    isCovert: false
  },
  {
    id: 'tl-15',
    year: 1992,
    dateString: '1992-06-18',
    title: 'Yellowknife lab commissioned',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'BHRR',
    classification: 'Level 2 - Confidential',
    description:
      'A sub-permafrost clinic and quarantine block opens northwest of the town. The posted purpose is occupational noise trauma in the resource industry, which does exist as a problem and gives the site a plausible phone manner.',
    internalImpact:
      'The clinic begins with one question: what does a person look like after a year of 14.8Hz, and can it be un-done. Compound 88-T comes out of this building nine years later and the first volunteer for it is on the staff list.',
    isCovert: false
  },
  {
    id: 'tl-16',
    year: 1994,
    dateString: '1994-05-18',
    title: 'Reson-8 recalled. Palimpsest begins',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'AIRS',
    classification: 'Level 5 - Black Dossier',
    description:
      'The recall is announced as a power cord fault. Eighty-two hospital admissions and four deaths are in the coroner files by then, across four countries, and every patient described the same voice behind the wall.',
    internalImpact:
      "Palimpsest is chartered the same week to make the company's own record of the deaths disappear, and the archive starts keeping two copies of everything: one to show and one to keep. The kept copy is where this document comes from.",
    isCovert: true
  },
  {
    id: 'tl-17',
    year: 1995,
    dateString: '1995-04-12',
    title: 'Atacama station opened at 4,800 m',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 2 - Confidential',
    description:
      'A high-altitude station is completed on the Chilean plateau with two cryogenic arrays and a staff of eleven. The nearest settled place is three hours away on a road that is not maintained in winter.',
    internalImpact:
      'The site detects the Southern Hemisphere refraction path within its first year, and the numbers are so clean that the first reviewer assumed the instrument had failed. The station has run continuously since, on a rotation of eight weeks on and four off.',
    isCovert: false
  },
  {
    id: 'tl-18',
    year: 1998,
    dateString: '1998-03-22',
    title: 'Postojna caverns acquired',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'AIRS',
    classification: 'Level 3 - Secret',
    description:
      'GPC buys the concession on the deep limestone galleries at Postojna and installs climate control, a reading room and eleven storage chambers. The purchase is made through a subsidiary that does not trade.',
    internalImpact:
      'Chambers 7 to 11 are dug after acquisition and do not appear on the plans. The true originals live here, and so does the Palimpsest operator desk, sixty metres under a place that takes tourists every day of the year.',
    isCovert: true
  },
  {
    id: 'tl-19',
    year: 1998,
    dateString: '1998-10-14',
    title: 'Janitor begins at Site 19',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'SISO',
    classification: 'Level 4 - Top Secret',
    description:
      'Heavy hydraulic grouting is injected into the deep fractures under the salt dome to damp vibration that had begun to run on its own. The first pour is 9,000 tonnes and it does not hold.',
    internalImpact:
      'Janitor establishes the containment jacks: the 32.4Hz tone held inside Chamber 04, which is loud enough to be felt through the floor of the canteen and is described in the induction booklet as plant noise.',
    isCovert: true
  },
  {
    id: 'tl-20',
    year: 1999,
    dateString: '1999-07-14',
    title: 'Gotland Deep sensor 4 listening',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 2 - Confidential',
    description:
      'A bedrock sensor is sunk on Gotland and brought online with a two-line entry in the station log. The calibration sheet is signed by a technician whose handwriting nobody has been able to match to a staff record.',
    internalImpact:
      'Svalbard, Gotland and Grimsel give Europe a triangle, and with a triangle you can say where a sound came from. From 1999 the company can locate the carrier to within a kilometre, which is the single most useful thing it has ever been able to do.',
    isCovert: false
  },
  {
    id: 'tl-21',
    year: 1999,
    dateString: '1999-12-31',
    title: 'Millennium night: nothing happens',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'CCDR',
    classification: 'Level 1 - General',
    description:
      'Continuity desks stay staffed across eighteen partner states from 30 December to 3 January. No client loses an operational hour. The company releases a two-paragraph statement on the 3rd and the phones are quiet.',
    internalImpact:
      'Grimsel and Woomera are both occupied for the first time, on a drill, by people who spend the night in the chambers. It is the only occasion on which either site has been full and it is the reason both are certified today.',
    isCovert: false
  },
  {
    id: 'tl-22',
    year: 2000,
    dateString: '2000-08-10',
    title: 'ParaCalm nursery unit released',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'PEFD',
    classification: 'Level 1 - General',
    description:
      'A womb-sound generator is marketed to parents of colicky infants in three finishes. The "rainstorm" programme is the best seller by a wide margin and appears in the launch photography.',
    internalImpact:
      'The synthesis chip puts a 14.8Hz sub-harmonic under the rainstorm preset, which was not specified and which the acceptance tests were not run against. Eleven thousand units are in homes before anyone notices the pattern in the follow-up calls.',
    isCovert: false
  },
  {
    id: 'tl-23',
    year: 2001,
    dateString: '2001-12-04',
    title: 'Diego Garcia hydrophone 12 hears something deep',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 5 - Black Dossier',
    description:
      'An abyssal recorder at 5,400 metres logs a phase-locked 14.8Hz pulse arriving from below the crust. The same pulse arrives at Svalbard in the same second. There is no path between the two stations that sound can take in one second.',
    internalImpact:
      "Monolith is chartered the following month to find out what is making it, and the programme has now been funded for twenty-five years without producing an answer that satisfies the people paying for it. Lindqvist's standing note to new staff is one sentence and is not encouraging.",
    isCovert: true
  },
  {
    id: 'tl-24',
    year: 2002,
    dateString: '2002-09-14',
    title: 'ParaCalm recalled into concrete',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'AIRS',
    classification: 'Level 4 - Top Secret',
    description:
      'The nursery line is withdrawn after paediatric reports of delayed speech and a fixation on painted surfaces. Returned units go into cells at Site 19 and the disposal contractor is not given a manifest.',
    internalImpact:
      'Hypnos is chartered to keep the sleep work going under enterprise control rather than consumer packaging. The medical lead who wrote the recall assessment asks for and is given a transfer to a station with no families on it.',
    isCovert: true
  },
  {
    id: 'tl-25',
    year: 2003,
    dateString: '2003-05-18',
    title: 'The standing column over the Atacama',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 3 - Secret',
    description:
      'Morales finds a 4.2Hz pressure column standing thirty-five kilometres high over the plateau, holding station against a jet stream that should tear it apart in an afternoon.',
    internalImpact:
      "The column turns out to be a waveguide. High-altitude bending becomes the company's preferred route for intercontinental work and the Atacama file gets a new annex every year, all of them classified Level 3 because Level 4 would require the air force to be told.",
    isCovert: true
  },
  {
    id: 'tl-26',
    year: 2004,
    dateString: '2004-09-12',
    title: 'Nigel Ashby becomes chief executive',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'EGSPU',
    classification: 'Level 1 - General',
    description:
      'Ashby, an adviser to the board since 2001, takes over from Dame Eleanor Cross, who stays on as board president. The outgoing chief executive leaves with a settlement and a non-disclosure agreement.',
    internalImpact:
      'The outgoing man had refused to sign the 2003 Vesper expansion. Ashby signs it in his first week and consolidates every covert acoustic programme under the executive office, where the paper trail is shortest.',
    isCovert: false
  },
  {
    id: 'tl-27',
    year: 2004,
    dateString: '2004-10-18',
    title: 'Black Ridge station 16 opens in West Virginia',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'SISO',
    classification: 'Level 2 - Confidential',
    description:
      'A monitoring post is set up in disused coal workings in the Appalachians to study how a tone travels the eastern seaboard. The ventilation shaft is 300 metres deep and the lift takes four minutes.',
    internalImpact:
      "Black Ridge becomes Stentor's eastern transmitter. Zimmerman's later note on the seam is not a metaphor: the gallery resonates in perfect fifths and the company has been quietly retuning the mountain for two decades.",
    isCovert: false
  },
  {
    id: 'tl-28',
    year: 2006,
    dateString: '2006-03-20',
    title: 'Chime bells roll out across the districts',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'PEFD',
    classification: 'Level 3 - Secret',
    description:
      'GPC wins school bell and public address contracts in 4,200 districts across six states on a noise standard it wrote itself and offered to the standards body for free.',
    internalImpact:
      'Two-point-eight million children now hear the approved pair five days a week. The programme is priced below cost and always has been, which the finance committee queried once, in 2007, and never again.',
    isCovert: true
  },
  {
    id: 'tl-29',
    year: 2006,
    dateString: '2006-05-18',
    title: 'Mount Kenya array activated',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 2 - Confidential',
    description:
      'An infrasound cluster is installed on the mountain to listen for acoustic ducting along the Rift Valley. The permitting took four years and the installation took eleven days.',
    internalImpact:
      'The network reaches eleven permanent stations, which is the number the 1974 paper said would be needed to hear the whole planet at once. Cross attended the switch-on and said three words to the crew, none of which were recorded.',
    isCovert: false
  },
  {
    id: 'tl-30',
    year: 2008,
    dateString: '2008-02-11',
    title: 'Tristan da Cunha hydrophone in the water',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 3 - Secret',
    description:
      'A deep-ocean station is moored off Tristan da Cunha to watch the South Atlantic magnetic anomaly, which is the only place in the ocean where compasses misbehave and every ship that comes near is asked to leave.',
    internalImpact:
      'The station logs the correlation between magnetic fluctuation and sub-seabed pulses that the company has been trying to explain since 2001. The correlation is 0.98 and remains in the annex, unexplained, twenty years later.',
    isCovert: true
  },
  {
    id: 'tl-31',
    year: 2008,
    dateString: '2008-09-22',
    title: 'Financial crisis and the VeriPulse withdrawals',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'PEFD',
    classification: 'Level 4 - Top Secret',
    description:
      'HVAC dampening is deployed in client banks in London and New York in the week of the collapse while VeriPulse wristbands are pulled after thirty-four seizures on one Frankfurt trading floor.',
    internalImpact:
      'Bank runs in the client cities fall by 44% and £34m is paid out quietly to thirty-four people in Frankfurt. Both stories are in the same internal week, and the press release from that week does not mention either.',
    isCovert: true
  },
  {
    id: 'tl-32',
    year: 2009,
    dateString: '2009-04-14',
    title: 'Stillwater trials in Lake Mead',
    era: 'Millennial Expansion (1990-2009)',
    departmentCode: 'ASIAN',
    classification: 'Level 4 - Top Secret',
    description:
      'Ultrasonic arrays are run in two municipal reservoirs to test whether water retains a standing wave and whether it can be broken up before it reaches the tap. It can, but only from very close.',
    internalImpact:
      "The trial produces the company's least comfortable finding to date: the carrier survives in mains water for hours. Every reservoir serving a client city has been on the list since, and the list is revised every February.",
    isCovert: true
  },
  {
    id: 'tl-33',
    year: 2011,
    dateString: '2011-09-18',
    title: 'The Oakhaven incident',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'PEFD',
    classification: 'Level 4 - Top Secret',
    description:
      'A whole-town broadcast is run under a county contract at 18:00. For about four minutes most of the intersection stops moving at once, and the substation floods go unnoticed until the next morning.',
    internalImpact:
      'Forty-two residents are treated at the Rosslyn annex with Compound 88-T. Three do not recover their baseline, and one of them still lives with a carer in a house that GPC pays for and has never listed on any register.',
    isCovert: true
  },
  {
    id: 'tl-34',
    year: 2011,
    dateString: '2011-10-10',
    title: 'VesperTone HVAC units withdrawn',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'AIRS',
    classification: 'Level 3 - Secret',
    description:
      'All commercial units are pulled after a Dallas tower evacuates because eight hundred people develop simultaneous dizziness and a headache that starts at the same hour every afternoon.',
    internalImpact:
      'Municipal strategy moves off the buildings and onto trolley buses, station platforms and mobile handsets, where the company does not have to ask permission and there is no plant room to be inspected.',
    isCovert: true
  },
  {
    id: 'tl-35',
    year: 2012,
    dateString: '2012-06-01',
    title: 'Cicada turned loose on I-80',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'PEFD',
    classification: 'Level 3 - Secret',
    description:
      'Two hundred miles of piezoelectric plates are buried beneath the interstate to harvest tyre vibration and put a low tone behind every vehicle that passes. The plates are installed under a pavement telemetry contract.',
    internalImpact:
      'Fatigue and reaction time are measurable better in the test corridor and worse in the control corridor, which nobody expected. The difference is a feature and the cycle counts confirm entrainment at highway speed.',
    isCovert: true
  },
  {
    id: 'tl-36',
    year: 2012,
    dateString: '2012-11-05',
    title: 'Tiksi station opens on the Laptev Sea',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'SISO',
    classification: 'Level 2 - Confidential',
    description:
      'A permafrost station with a very deep borehole opens at Tiksi with a staff of nine and a winter that lasts from October to May. The helicopter contract is with a company whose only other client is the institute.',
    internalImpact:
      "Tiksi closes the Eurasian Arctic margin and, incidentally, the gap in the Asian array that had been open since 1986. Sleptsov's annual thermal log is the only record of what the permafrost is doing, and it is kept because it is useful, not because it is required.",
    isCovert: false
  },
  {
    id: 'tl-37',
    year: 2013,
    dateString: '2013-05-15',
    title: 'Omniscan poles appear in Manchester and Chicago',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'PEFD',
    classification: 'Level 1 - General',
    description:
      'Acoustic traffic radar is installed at pedestrian crossings in two cities on a road-safety budget, replacing inductive loops at a third of the price. The city press photographs are very good.',
    internalImpact:
      'The calibration loop puts nineteen-point-eight hertz out of the array, which does nothing to traffic and a great deal to eyeballs. The number of people who understood what they were looking at is, at this point, four.',
    isCovert: false
  },
  {
    id: 'tl-38',
    year: 2014,
    dateString: '2014-06-20',
    title: 'Compound 88-T formulated at Yellowknife',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'BHRR',
    classification: 'Level 4 - Top Secret',
    description:
      'The clinic combines the ParaCalm sedative line with a 7.83Hz burst timed to the sleep spindle, which produces a clean two-week window of retrograde amnesia in every subject who completes the course.',
    internalImpact:
      "Morpheus is now the standard response to any staff exposure, and the exposure register is held at Yellowknife rather than in personnel, which is a distinction that has been raised twice by the works council and resolved twice in the company's favour.",
    isCovert: true
  },
  {
    id: 'tl-39',
    year: 2015,
    dateString: '2015-01-20',
    title: 'Cayman Trough laboratory moored',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'ASIAN',
    classification: 'Level 3 - Secret',
    description:
      'A platform is moored at 6,000 metres over the hydrothermal vents to see whether the vent field acts as a lens. It does: twenty-four decibels of gain, measured across the vent field in the first fortnight.',
    internalImpact:
      'Natural focusing changes the Monolith budget overnight. If the vents can amplify a signal by 24dB then the company can use the seabed as an antenna, and the two installations that follow are both sited on hydrothermal fields.',
    isCovert: true
  },
  {
    id: 'tl-40',
    year: 2015,
    dateString: '2015-07-02',
    title: 'Echo-State shown to clients in Tokyo',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'SFPC',
    classification: 'Level 1 - General',
    description:
      'Synthetic twins of London and Tokyo are demonstrated at the Pacific Urban Resilience Summit to a room of municipal clients. The London model is up to 8.8 million agents and runs four days of city time in ninety minutes.',
    internalImpact:
      'The demo build has one variable switched off. In the internal build the same engine is asked what a city does when the carrier doubles, and the answer for London is in a file that has been read by six people.',
    isCovert: false
  },
  {
    id: 'tl-41',
    year: 2015,
    dateString: '2015-11-18',
    title: 'Omniscan poles taken out overnight',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'AIRS',
    classification: 'Level 3 - Secret',
    description:
      'Four hundred and eighty poles are removed across two weekends under a notice describing a 5G fibre upgrade, after three hundred and twenty reports of nausea across the two cities.',
    internalImpact:
      'The casualty records are sealed and moved to Postojna, which is where the archive keeps the things it intends to outlive. Two of the poles are never accounted for, and the disposal manifest lists them as scrapped without a site.',
    isCovert: true
  },
  {
    id: 'tl-42',
    year: 2016,
    dateString: '2016-04-18',
    title: 'Vitruvian fitted at Tower Obsidian',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'PEFD',
    classification: 'Level 3 - Secret',
    description:
      'Passive resonators and damped floors go into the penthouse and then into thirty-four client headquarters, sold as architectural acoustics and priced as insulation.',
    internalImpact:
      'Whoever sits in a Vitruvian room is out of the broadcast, which is the point of the product: the people who paid for the quiet hour do not have to hear it. Ashby had the hum put back in his own office in 2018 and the reason is not minuted.',
    isCovert: true
  },
  {
    id: 'tl-43',
    year: 2016,
    dateString: '2016-08-14',
    title: 'Jeju Island vault completed',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'CCDR',
    classification: 'Level 3 - Secret',
    description:
      'A redoubt is completed in a lava tube in South Korea, sealed behind a stainless bulkhead and fitted with its own hydroponics. The site is provisioned for 720 days and holds eleven fewer berths than the roster expects.',
    internalImpact:
      'Aethelgard now has East Asia, which the 1984 schedule did not anticipate and which cost £310m more than the estimate. The berth shortfall is recorded and accepted, in that order, in the same sentence.',
    isCovert: true
  },
  {
    id: 'tl-44',
    year: 2017,
    dateString: '2017-06-20',
    title: 'Azores Node 14 commissioned',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'ASIAN',
    classification: 'Level 3 - Secret',
    description:
      'A seabed station is anchored on the Mid-Atlantic Ridge at 3,200 metres with sapphire transducers and a fibre cable back to Horta. The sensors are better than the array was specified for.',
    internalImpact:
      'Node 14 catches coupling between the European and North American grids, which means the carrier is riding the power interconnectors. The finding changes the Monolith model and is the reason the Azores file carries a Level 3 stamp over a Level 2 project.',
    isCovert: true
  },
  {
    id: 'tl-45',
    year: 2018,
    dateString: '2018-09-12',
    title: 'Station 22 opens in Patagonia',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'CCDR',
    classification: 'Level 2 - Confidential',
    description:
      'A coastal granite redoubt is finished in southern Chile, which completes the twenty-two-station network the founders drew in 1974. The station has a wet lab, a seed vault and a very good kitchen for a bunker.',
    internalImpact:
      'The grid is closed. Every point on the surface of the planet is now within range of at least two stations, and the coverage map went into the annual report in 2019 with the stations described as environmental monitoring posts.',
    isCovert: false
  },
  {
    id: 'tl-46',
    year: 2019,
    dateString: '2019-11-04',
    title: 'Thorne takes 48GB out of Station 07',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'TOPN',
    classification: 'Level 5 - Black Dossier',
    description:
      'A research fellow walks out of Svalbard with the borehole audio, the 1989 intercom tape and the consumer division personnel files. He is through Longyearbyen before the first mirror goes up and off the mainland before anyone thinks to look.',
    internalImpact:
      'Thirty-two mirrors are taken down over the following four months and the reward is set at £250,000 in the trade press. Julian Thorne, who had nothing to do with the leak and shares a surname with the man who did, is remediated and retired.',
    isCovert: true
  },
  {
    id: 'tl-47',
    year: 2020,
    dateString: '2020-03-25',
    title: 'Civic Elasticity activated worldwide',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'CCDR',
    classification: 'Level 2 - Confidential',
    description:
      'The continuity provisions in forty-eight sovereign contracts are activated in the first week of the pandemic, providing relocation of essential government functions to designated secure sites if required.',
    internalImpact:
      'No government asks why the contracts are fourteen years old and drafted to the hour. Cellular sub-harmonic delivery lifts quarantine compliance by 31.4% across the client states, which is the number on the cover of the internal report and not the number in it.',
    isCovert: false
  },
  {
    id: 'tl-48',
    year: 2021,
    dateString: '2021-09-15',
    title: 'Ninety days sealed at Grimsel',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'CCDR',
    classification: 'Level 5 - Black Dossier',
    description:
      'One hundred and twenty volunteers spend ninety days inside the granite redoubt with no external communication and no clocks. The drill is run as a provisioning test and is reported to the board as a success.',
    internalImpact:
      'The cohort develop a shared dream pattern at 14.8Hz, which means the signal walks through twelve hundred metres of mountain and the mountain does not attenuate it at all. Three participants withdraw from the programme afterwards and their names have been removed from the drill roll.',
    isCovert: true
  },
  {
    id: 'tl-49',
    year: 2023,
    dateString: '2023-03-14',
    title: 'Gilt shock: ChronoForecast pulled from clients',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'SFPC',
    classification: 'Level 4 - Top Secret',
    description:
      'External access to the forecasting terminals is terminated after client trading amplifies a £4.2bn move in UK gilts and the algorithm predicts the move it has just caused.',
    internalImpact:
      'The terminals stay in the building and the loop stays open. The Board of England and the Federal Reserve issue a joint restriction order in April and the company complies with the letter of it, which does not extend to internal use.',
    isCovert: true
  },
  {
    id: 'tl-50',
    year: 2023,
    dateString: '2023-11-14',
    title: 'A pulse arrives from under the mantle',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'ASIAN',
    classification: 'Level 4 - Top Secret',
    description:
      'Hydrophone 12 records an upward-sweeping 54Hz pulse from 8,400 metres of sub-seabed rock. Azores Node 14 sees the same pulse fourteen minutes later, which is faster than sound moves through the mantle and has no explanation in the file.',
    internalImpact:
      'Two further pulses follow in 2024, both with structure. Lindqvist has stopped writing the period down in his own hand and now has a junior member of the array team do it, which his colleagues have noticed.',
    isCovert: true
  },
  {
    id: 'tl-51',
    year: 2024,
    dateString: '2024-08-20',
    title: 'Site 19 pumped again',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'SISO',
    classification: 'Level 4 - Top Secret',
    description:
      'Forty thousand tonnes of polymer grout go into the salt dome boundary in eleven weeks to contain a spike in the 32.4Hz containment vibration. The salt is recrystallising into hexagonal sheets under the pressure.',
    internalImpact:
      'Highway 196 is closed for culvert replacement as cover. The chamber floor has risen eleven millimetres since spring and Lin measures the rise against the tone every month, which is not a task anyone asked her to do.',
    isCovert: true
  },
  {
    id: 'tl-52',
    year: 2026,
    dateString: '2026-01-10',
    title: 'Fifty-five years, and the carrier is at 14.94',
    era: 'Modern Hegemony (2010-2026)',
    departmentCode: 'EGSPU',
    classification: 'Level 5 - Black Dossier',
    description:
      'The company marks fifty-five years with a staff note and a lunch at every site. The planetary sensors put the basement carrier at 14.94Hz and rising, which is 0.14Hz from the point the rule was written about in 1972.',
    internalImpact:
      'Directive 01 moves to pre-activation standby and all fourteen redoubts go to sixty-minute lockdown readiness. The chair has not left Grimsel since 2016. Her anniversary note was drafted by the communications desk and she has not read it.',
    isCovert: true
  }
];
