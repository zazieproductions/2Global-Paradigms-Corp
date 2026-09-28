import type { PressRelease } from '@/types';

/**
 * Press office archive.
 *
 * House style: the public words are the press office's; the `internalSubtext`
 * is what the desk actually meant, added by the archive team years later.
 * Keep the two registers completely separate — that gap is the story.
 */
export const PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr-01',
    releaseNumber: 'PR-1978-04',
    date: '1978-06-14',
    headline: 'Paradigms Systems announces urban studies division',
    city: 'London, UK',
    leadParagraph:
      'Paradigms Systems Ltd. has established an Urban Studies Division to advise municipal authorities on passenger flow and congestion in public transport networks. The division will be based in Bishopsgate and will initially serve clients in the United Kingdom and the Low Countries.',
    bodyParagraphs: [
      "The division will apply the firm's statistical methods to transport planning, with particular attention to the comfort and movement of passengers during peak hours.",
      'Dr. Arthur Sedley said: "Cities are loud places and most of what is said in them is never heard. We are interested in the part that is not heard."',
      'The company declined to name its first municipal client.'
    ],
    mediaContact: 'Press Bureau, Paradigms Systems Ltd., Bishopsgate, London',
    disclaimer: 'For general business distribution only.',
    internalSubtext:
      'Cover for the first acoustic entrainment trials on the Central Line, run in June and July.'
  },
  {
    id: 'pr-02',
    releaseNumber: 'PR-1984-11',
    date: '1984-10-05',
    headline: 'Paradigms International to trade as Global Paradigms Corporation',
    city: 'London & Washington, D.C.',
    leadParagraph:
      'Following an internal reorganisation, Paradigms International has consolidated its operations under the single trading name Global Paradigms Corporation. Existing contracts transfer to the new entity without change.',
    bodyParagraphs: [
      'The group now covers sovereign advisory work, continuity planning and environmental infrastructure across eleven countries.',
      'The company also confirmed that construction has begun on a European records facility in the Swiss Alps, intended to hold institutional archives in conditions of complete environmental stability.',
      "No redundancies are expected. The press office will not be commenting on the facility's location beyond the canton."
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Approved for international financial media.',
    internalSubtext: 'Ran alongside groundbreaking at Grimsel Pass. Tier-1 redoubt, not a records facility.'
  },
  {
    id: 'pr-03',
    releaseNumber: 'PR-1986-09',
    date: '1986-11-15',
    headline: 'Station 07 opens in Spitsbergen',
    city: 'Longyearbyen, Svalbard',
    leadParagraph:
      'Global Paradigms Corp. has opened an atmospheric research station on Spitsbergen, in the Svalbard archipelago. The station will study polar weather systems and the propagation of very low frequency sound through the upper atmosphere.',
    bodyParagraphs: [
      'The facility accommodates twelve staff year-round and operates an array of microbarometers and borehole sensors.',
      'Dr. Henrik Lindqvist, who will direct the station, said: "The Arctic is the quietest place on the planet, and the most useful one for listening to the whole of it."',
      'The station operates under the scientific research provisions of the Svalbard Treaty.'
    ],
    mediaContact: 'Nordic Research Bureau, GPC Station 07',
    disclaimer: 'Issued in accordance with the Svalbard Treaty scientific research provisions.',
    internalSubtext:
      'Station 07 was built around Borehole 4, which had already been drilled to 820 metres before the station existed. The opening press pack contains no mention of the borehole.'
  },
  {
    id: 'pr-04',
    releaseNumber: 'PR-1989-12',
    date: '1989-11-20',
    headline: 'Co-founder retires from the board',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. announces that Dr. Arthur Sedley, co-founder and director of research, has retired from the board and from all executive duties with immediate effect, on grounds of ill health. The company thanks him for eighteen years of service.',
    bodyParagraphs: [
      "Dr. Sedley's research programmes will continue under existing directors. Dame Eleanor Cross assumes the chairmanship in full.",
      "The company will not be issuing further statements on Dr. Sedley's retirement, and requests that the privacy of his family be respected."
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Not for regional distribution.',
    internalSubtext:
      'He did not retire. Directive 09 issued the same day; the file was rewritten to read as retirement rather than loss of personnel, and the research programmes named in paragraph two are the ones he was running.'
  },
  {
    id: 'pr-05',
    releaseNumber: 'PR-1992-06',
    date: '1992-04-10',
    headline: 'New sleep machine from GPC Consumer: the Reson-8',
    city: 'Chicago, IL',
    leadParagraph:
      "GPC Consumer Products today launches the Reson-8, a bedside sleep generator developed from the company's acoustic research programme. The unit is available from May in North America and the United Kingdom at a recommended retail price of £149 or $229.",
    bodyParagraphs: [
      'The Reson-8 uses a patented twin-oscillator arrangement to produce a gentle low-frequency beat, which the company says encourages the natural deep-sleep rhythm without drugs, side effects or habit.',
      'Dr. Hiroshi Tanaka, who led the design, said: "Most sleep products mask noise. This one works with the body\'s own timing. We are proud of it."',
      'The launch will be supported by national press and television advertising through the autumn.'
    ],
    mediaContact: 'GPC Consumer Products, Publicity, Chicago',
    disclaimer: 'Product claims relate to laboratory conditions.',
    internalSubtext:
      'Tanaka had already filed an internal note flagging the unshielded transformer coupling. It is in the vault. The "patented twin-oscillator arrangement" is the fault.'
  },
  {
    id: 'pr-06',
    releaseNumber: 'PR-1994-08',
    date: '1994-05-18',
    headline: 'Voluntary recall: Reson-8 sleep machines, 1992-1994',
    city: 'Washington, D.C. & Brussels',
    leadParagraph:
      'Global Paradigms Corp., in cooperation with the U.S. Consumer Product Safety Commission and European safety authorities, is voluntarily recalling all Reson-8 sleep machines manufactured between 1992 and 1994.',
    bodyParagraphs: [
      'The recall follows the identification of a manufacturing defect in the power supply, which in a small number of units may overheat during prolonged use. Owners should stop using the unit and return it to the place of purchase for a full refund or replacement.',
      'The company has received reports of the issue in a small proportion of units sold. Customers with questions should contact the freephone number below.',
      'GPC regrets any inconvenience and wishes to thank retailers for their cooperation in this action.'
    ],
    mediaContact: 'Consumer Affairs, GPC, freephone 0800 118 118',
    disclaimer: 'Recall issued in coordination with CPSC notice 94-118.',
    internalSubtext:
      'Capacitor story drafted by Blake. Four deaths, 82 admissions, and a settlement fund of £48.2M sat behind this two-paragraph notice.'
  },
  {
    id: 'pr-07',
    releaseNumber: 'PR-1999-14',
    date: '1999-12-01',
    headline: 'Continuity arrangements for the millennium date change',
    city: 'London, UK',
    leadParagraph:
      "Global Paradigms Corp. confirms that all client continuity arrangements have been verified ahead of the millennium date change. The company's advisory desks will be staffed continuously from 30 December to 3 January.",
    bodyParagraphs: [
      'Preparations have covered power, telecommunications and civil logistics across all fourteen countries in which the group holds continuity contracts.',
      'A company spokesperson said: "Nothing of consequence is expected to happen. We will be there if something does. That has been the arrangement for twenty-eight years and it is not going to change at midnight."'
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Client-facing advisory notice.',
    internalSubtext:
      'True statement, odd wording. Millennium Charter signed this quarter: the fourteen redoubts were certified against a schedule that has nothing to do with computers.'
  },
  {
    id: 'pr-08',
    releaseNumber: 'PR-2004-09',
    date: '2004-09-12',
    headline: 'Global Paradigms appoints chief executive',
    city: 'London, UK',
    leadParagraph:
      'The board of Global Paradigms Corp. has appointed Nigel Ashby as chief executive with effect from 1 September. Mr Ashby joins from public sector procurement and has worked with the company as an adviser since 2001.',
    bodyParagraphs: [
      'Mr Ashby said: "The company has grown by being useful to governments in the least glamorous corners of their business. I intend to keep it that way."',
      'Dame Eleanor Cross continues as chairman. The board thanks the outgoing chief executive for eleven years of service.'
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'For financial media.',
    internalSubtext:
      'The outgoing chief executive was moved sideways after refusing to sign the 2003 Vesper expansion. His name does not appear in this release and will not appear in the next annual report.'
  },
  {
    id: 'pr-09',
    releaseNumber: 'PR-2008-16',
    date: '2008-09-22',
    headline: 'Statement on recent client incidents',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. notes recent reporting concerning the withdrawal of its VeriPulse biometric band from the corporate market and wishes to clarify the position for clients and employees.',
    bodyParagraphs: [
      'VeriPulse was withdrawn as a precautionary measure following a small number of reports of device malfunction in high-stress working environments. The company has cooperated fully with the relevant occupational health authorities in each jurisdiction concerned.',
      "This does not affect the company's environmental acoustics contracts, which are unaffected and continue to perform to specification."
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'No further comment will be made.',
    internalSubtext:
      'Written on the afternoon of the Lehman collapse, when nobody was reading the business pages. The phrase "unaffected and continue to perform to specification" was chosen by Warrender.'
  },
  {
    id: 'pr-10',
    releaseNumber: 'PR-2011-21',
    date: '2011-09-20',
    headline: 'Oakhaven atmospheric testing - clarification',
    city: 'Oakhaven, Indiana',
    leadParagraph:
      'Global Paradigms Corp. wishes to clarify the nature of the atmospheric acoustic testing carried out in the Oakhaven area during September under contract to the county.',
    bodyParagraphs: [
      'The test programme, which has now concluded, involved the measurement of low-frequency sound propagation under different weather conditions. It is not connected in any way to the incident at the county substation on 18 September.',
      'The company asks residents to disregard unofficial recordings circulating online, some of which predate the test programme by several years.'
    ],
    mediaContact: 'Regional Affairs, GPC, Chicago',
    disclaimer: 'Issued at the request of the county executive.',
    internalSubtext:
      "Two paragraphs, no apology, and the sentence about older recordings was Blake's idea: the recordings are from 1989 and 2001 and are genuine. Tribune archive servers were collected on the 19th."
  },
  {
    id: 'pr-11',
    releaseNumber: 'PR-2015-08',
    date: '2015-07-02',
    headline: 'GPC launches synthetic city modelling service',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. has launched a demographic simulation service which models the behaviour of entire urban populations as populations of software agents. The first instance covers Greater London and represents 8.8 million individuals.',
    bodyParagraphs: [
      'Clients can run policy scenarios against the model, including transport disruption, utility failure and civil disturbance, without exposing real populations to the conditions being tested.',
      'Dr. Evelyn Reed, who leads the modelling team, said: "A city is a very large number of people doing small things. If you can get the small things right, the rest follows."',
      'The service is offered to public authorities and does not use personal data.'
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Technical claims subject to client licence terms.',
    internalSubtext:
      'The service also accepts an acoustic variable that is not in any client-facing documentation. Two of the pilot scenarios were run with the carrier at 2026 amplitude.'
  },
  {
    id: 'pr-12',
    releaseNumber: 'PR-2018-11',
    date: '2018-05-14',
    headline: 'Postojna facility upgrade completed',
    city: 'Postojna, Slovenia',
    leadParagraph:
      'Global Paradigms Corp. has completed an eighteen-month upgrade to its records facility in the Postojna caverns, comprising climate control, a new reading room and additional storage capacity.',
    bodyParagraphs: [
      'The facility holds corporate and client archives dating from 1971 and maintains continuous environmental records as part of its accreditation.',
      'A company spokesperson said: "This is a records archive and nothing more. We maintain it to archival standard because our clients expect their material to be readable in a hundred years, which is exactly what we are here for."'
    ],
    mediaContact: 'Regional Communications, GPC Central Europe',
    disclaimer: 'Facility tours are not available.',
    internalSubtext:
      'The facility is a reliquary. The "additional storage capacity" is chambers 7 to 11, dug by the Order\'s own contractors, and it is where the true originals are kept.'
  },
  {
    id: 'pr-13',
    releaseNumber: 'PR-2020-06',
    date: '2020-03-25',
    headline: 'Continuity protocols activated for sovereign clients',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. has activated the continuity provisions in its sovereign client agreements, providing for the relocation of essential government functions to designated secure facilities should conditions require it.',
    bodyParagraphs: [
      'The provisions were agreed with client governments between 1999 and 2016 and have been exercised in full only twice, both times as simulation.',
      'The company will not disclose the locations of the facilities concerned. It confirms that provisioning and staffing are complete and that activation can be achieved within seventy-two hours.'
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Issued simultaneously in eleven jurisdictions.',
    internalSubtext:
      'Published in the first week of the pandemic, when every government in Europe was reading continuity contracts for the first time. Not one of them asked why the contracts were fourteen years old and already drafted to the hour.'
  },
  {
    id: 'pr-14',
    releaseNumber: 'PR-2022-19',
    date: '2022-12-08',
    headline: 'Redoubt network certified carbon neutral',
    city: 'Zug, Switzerland',
    leadParagraph:
      'Global Paradigms Corp. has certified its fourteen subterranean continuity facilities as carbon neutral for the 2022 financial year, following an audit by an independent assessor.',
    bodyParagraphs: [
      'The facilities run on geothermal, hydroelectric and stored capacity, with no connection to public grids in normal operation.',
      'The company\'s head of continuity said the certification "reflects a decade of investment in infrastructure that will never be seen by the public and is not built to be."'
    ],
    mediaContact: 'Sustainability Office, GPC, Zug',
    disclaimer: 'Audit summary available on request.',
    internalSubtext:
      'Third sentence written by Tessa Ashby. The audit cost £400k and did not look at the acoustic programme, which uses four times the electricity.'
  },
  {
    id: 'pr-15',
    releaseNumber: 'PR-2024-27',
    date: '2024-09-01',
    headline: 'GPC reports record revenue for FY2024',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. reports consolidated revenue of £9.82 billion for the financial year ending 31 March 2024, an increase of 11.4% on the prior year, with continuity and environmental infrastructure the strongest segments.',
    bodyParagraphs: [
      'The board proposes a final dividend of 41.2 pence per share. Recurring revenue from sovereign contracts now represents 78% of group turnover.',
      'The chief executive said: "Governments buy certainty when they can afford it. The last three years have made that an easier conversation."'
    ],
    mediaContact: 'Investor Relations, GPC, London',
    disclaimer: 'Full statements filed with Companies House.',
    internalSubtext:
      'Segment note in the accounts shows "environmental infrastructure" growing 34% on municipal tone contracts. The word tone appears nowhere in the filed statements.'
  },
  {
    id: 'pr-16',
    releaseNumber: 'PR-2026-01',
    date: '2026-01-10',
    headline: 'Fifty-five years of continuity: a note from the chair',
    city: 'London, UK',
    leadParagraph:
      'Global Paradigms Corp. marks fifty-five years since its founding in Cambridge in 1971. The chair, Dame Eleanor Cross, has issued the following note to clients and staff.',
    bodyParagraphs: [
      '"We were founded to answer a question about how societies hold together. We have spent five decades answering it in the only way that has ever worked: quietly, early, and without asking for credit.',
      'I would ask every member of staff to remember that our clients are not buying forecasts. They are buying the ordinary Tuesday that nothing happened on."'
    ],
    mediaContact: 'Corporate Communications, Global Paradigms Corp.',
    disclaimer: 'Circulated to clients, staff and alumni.',
    internalSubtext:
      'Issued ten months before the projected Completion of the Square. The chair has not left the Grimsel complex since 2016; this note was written for her and the paragraph about "the ordinary Tuesday" was drafted by the communications desk.'
  }
];
