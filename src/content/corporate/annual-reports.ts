import type { AnnualReport } from '@/types';

/**
 * Selected annual disclosures, as filed and as later amended by AIRS.
 *
 * House style: shareholder letters are written by the executive office and
 * rewritten twice by Legal. The metrics table is the only part anyone outside
 * the company reads. The scrubbed footnote is what the archive removed from
 * the filed version and kept here.
 */
export const ANNUAL_REPORTS: AnnualReport[] = [
  {
    id: 'ar-1986',
    year: 1986,
    title: '1986 Annual Strategic Review',
    fiscalHeadline: 'Consolidated global revenue: £412.5M (+24.8% YoY) | Civic retention index: 98.4%',
    revenue: '£412,500,000',
    civicContinuityIndex: '98.4% Baseline Stability',
    executiveLetter:
      'To our sovereign clients and stakeholders:\n\nFifteen years ago this company sold risk forecasts to four banks and one shipping insurer. We now sit inside the continuity planning of twelve governments, which is a sentence I would not have believed in 1971 and which I would ask you to read carefully rather than quickly. The last decade has persuaded our clients that civic stability is an engineering problem, and we have been the engineers.\n\nIn November our Nordic station on Spitsbergen began transmission. The array now provides an unbroken acoustic reference frame across the North Atlantic, which is a technical way of saying that we no longer have to guess. Our thanks to the station crew, who will spend the winter above the Arctic Circle with a darkroom nobody uses and a boiler that wakes the whole corridor at six.',
    keyInitiatives: [
      'Station 07 (Nordic Acoustic Array) commissioned in Spitsbergen.',
      'Municipal transit acoustic consulting extended to eight European capitals.',
      'Grimsel Pass redoubt, Phase 1, completed under Project Aethelgard.'
    ],
    demographicMetrics: [
      { metric: 'Civil Protest Velocity Suppression', value: '-38.2%', variance: 'Exceeded target by 6.4%' },
      { metric: 'Municipal Curfew Compliance Rate', value: '96.1%', variance: '+4.2% vs baseline' },
      { metric: 'Sovereign Treasury Advisory Coverage', value: '14 Nations', variance: '+3 nations YoY' }
    ],
    scrubbedFootnote:
      '[AIRS SCRUBBED 1994]: Sub-surface tonal dispersion expenditures reallocated to municipal HVAC consulting in the filed version. The original line items are in the Postojna set.'
  },
  {
    id: 'ar-1999',
    year: 1999,
    title: '1999 Millennial Transition & Civic Resilience Mandate',
    fiscalHeadline: 'Consolidated global revenue: £1.24bn (+18.2% YoY) | Transition certainty: 99.9%',
    revenue: '£1,240,000,000',
    civicContinuityIndex: '99.9% Transition Certainty',
    executiveLetter:
      'To our sovereign clients and institutional partners:\n\nEvery institution we serve has spent the last two years asking the same question about midnight on the thirty-first of December, and the answer we have given them is that nothing will happen. We are able to give that answer because of the redoubts, the Tokyo hub and four hundred staff who will work through the holiday on our behalf. Please note in your own planning that our desks are staffed from 30 December to 3 January and that the people staffing them are volunteers, not conscripts.\n\nThe 1994 consumer recall of the Reson-8 continues to cost us money and attention. It is behind us operationally and it will not be behind us in the press for some years. Consumer electronics is a business this company should never have entered and our exit from it is now complete.',
    keyInitiatives: [
      'Woomera redoubt completed (Project Aethelgard, southern arc).',
      'Japanese and European grid sub-harmonic monitoring integrated.',
      'Postojna Caverns calibration centre opened in Slovenia.'
    ],
    demographicMetrics: [
      { metric: 'Millennial Panic Incident Mitigation', value: '99.4%', variance: 'Target: 95.0%' },
      { metric: 'Executive Heritage Cohort Enrollment', value: '4,200 Persons', variance: '+800 YoY' },
      { metric: 'Acoustic Baseline Carrier Coverage', value: '62% Earth Landmass', variance: '+11% YoY' }
    ],
    scrubbedFootnote:
      '[AIRS SCRUBBED 2002]: Footnote 14 on Reson-8 settlement outlays (£48.2M) sealed by High Court order in January 2002. We complied with the order and kept the original here.'
  },
  {
    id: 'ar-2008',
    year: 2008,
    title: '2008 Global Liquidity & Demographic Stability Report',
    fiscalHeadline: 'Consolidated global revenue: £2.85bn (+31.4% YoY) | Market shock absorption: 94.2%',
    revenue: '£2,850,000,000',
    civicContinuityIndex: '94.2% Sovereign Retention',
    executiveLetter:
      'To our shareholders and sovereign council:\n\nThe events of September were an examination we had spent a decade preparing for, and we passed it in the cities where our systems were installed. In those cities, withdrawal queues were shorter, the disorder was contained to the usual streets, and no client lost a payment system. In cities where we had no contract, people queued in the rain for four days.\n\nI would like the record to show that this result is not a comparison we sought and that we have declined to market it. The VeriPulse withdrawal is a separate matter, is being handled, and has our full attention. The settlement figure is confidential and will be treated as if it were not.',
    keyInitiatives: [
      'Vesper frequency modulators deployed across 24 North American commercial centres.',
      'Chime school-bell standardisation extended to 4,200 schools.',
      'Rosslyn sub-complex deep vault completed and consecrated.'
    ],
    demographicMetrics: [
      { metric: 'Bank Run Velocity Dampening', value: '-44.6%', variance: 'Exceeded forecast by 8.1%' },
      { metric: 'Corporate Executive Relocation Readiness', value: '100%', variance: 'Zero failure rate' },
      { metric: 'Lithospheric Infrasound Sensor Uptime', value: '99.98%', variance: '+0.04% YoY' }
    ],
    scrubbedFootnote:
      '[AIRS SCRUBBED 2010]: References to VeriPulse trading floor seizures expunged and reclassified as workstation ergonomic re-tooling costs. Thirty-four claims, all settled, none acknowledged.'
  },
  {
    id: 'ar-2017',
    year: 2017,
    title: '2017 Fifty-Year Horizon Assessment',
    fiscalHeadline: 'Consolidated global revenue: £5.10bn (+16.5% YoY) | Global array: 22 stations',
    revenue: '£5,100,000,000',
    civicContinuityIndex: '96.8% Harmonic Equilibrium',
    executiveLetter:
      'To our partners, sovereign ministries and board:\n\nHalf a century is long enough that the founding story has become a marketing asset, and I want to use this letter to set it aside. What this company sells is the absence of events. It is difficult to invoice for and impossible to photograph, and it is why a large part of our revenue line comes from governments paying us not to say anything.\n\nOur network is now twenty-two stations and five hydrophone arrays. Echo-State can model a capital city down to the individual and does so for twelve cities at present, and the municipal authorities who have seen it understand it better than the ones who merely bought it. The board has asked me to note that litigation risk in the modelling line is not yet quantified, and I am noting it here.',
    keyInitiatives: [
      'Echo-State synthetic twin models online for London and Tokyo.',
      'Mid-Atlantic Ridge Node 14 commissioned (Azores seabed station).',
      'Vitruvian architectural dampening rolled out across client headquarters.'
    ],
    demographicMetrics: [
      { metric: 'Predictive Civil Unrest Lead Time', value: '18.4 Days', variance: '+6.2 days YoY' },
      { metric: 'Subterranean Tonal Containment Margin', value: '92.4%', variance: '-1.8% vs 2016' },
      {
        metric: 'Planetary Infrasound Baseline Amplitude',
        value: '14.8 Hz @ 84dB',
        variance: '+3.2dB vs 1986'
      }
    ],
    scrubbedFootnote:
      "[AIRS SCRUBBED 2019]: Dr. Ewan Thorne's appendix note on rising baseline amplitude removed from Appendix C. Appendix C was then reissued without an annex, which the printers queried."
  },
  {
    id: 'ar-2022',
    year: 2022,
    title: '2022 Post-Pandemic Civic Elasticity & Urban Tone Harmonisation',
    fiscalHeadline: 'Consolidated global revenue: £7.45bn (+22.1% YoY) | Civic compliance score: 98.9%',
    revenue: '£7,450,000,000',
    civicContinuityIndex: '98.9% Public Synchronization',
    executiveLetter:
      'To our global stakeholders:\n\nThe pandemic tested the elasticity language in our client contracts and the language held. Forty-eight sovereign states ran continuity under our provisions for some part of 2020 and 2021, and while governments were improvising, the systems we had built to a fourteen-year-old specification did what they had been built to do. That specification is now eighteen years old and the board has been asked, twice, whether it should be reviewed. It should, and it will be, after 2026.\n\nOur field personnel continue to work below the level at which the company communicates with its staff, and the clinic at Yellowknife has done good work keeping them there. Compound 88-T is now a clinical product rather than a prototype and I am told the register is complete.',
    keyInitiatives: [
      'Cicada piezoelectric roadside grids in full deployment on three corridors.',
      'Ninety-day Grimsel isolation certification completed.',
      'ChronoForecast terminals integrated into client risk desks.'
    ],
    demographicMetrics: [
      { metric: 'Curfew & Quarantine Adherence Boost', value: '+31.4%', variance: 'Target: +25.0%' },
      { metric: 'Public Anxiety Index Reduction', value: '-42.8%', variance: 'Exceeded target' },
      {
        metric: 'Digital Retrospective Scrubbing Velocity',
        value: '99.7% Leak Purge',
        variance: '<4 hour MTTR'
      }
    ],
    scrubbedFootnote:
      '[AIRS SCRUBBED 2023]: Section on Oakhaven Phase 3 retrospective closure settlements permanently sealed. The section ran to nine pages and is held under the AIRS standing order on surface settlements.'
  },
  {
    id: 'ar-2025',
    year: 2025,
    title: '2025 Integrated Annual Disclosure',
    fiscalHeadline:
      'Consolidated global revenue: £9.82bn (+14.8% YoY) | Tier-1 Heritage Cohort: 10,000 enrolled',
    revenue: '£9,820,000,000',
    civicContinuityIndex: '99.8% Comprehensive Certainty',
    executiveLetter:
      "To our shareholders, sovereign council and Heritage Cohort:\n\nTwenty twenty-six is the year the plan was written for, which those of you who have read the 1972 papers will already know. All fourteen redoubts are certified. The cohort roster is closed at ten thousand and the reserve list stands at three hundred and forty, and I am aware that some of you reading this have been on that list for eleven years. The board's position on the reserve list has not changed and will not change between now and the end of the cycle.\n\nThere have been disclosures. There will be more. The company has survived worse than a leaked hard drive, and the disclosure programme will continue to be handled by the people whose job it is rather than by anyone acting on their own initiative. I would ask staff to remember that patience is a policy here and not a personality trait.",
    keyInitiatives: [
      'Tier-1 Heritage Cohort allocation of 10,000 seats completed.',
      'Monolith deep-crust acoustic receivers deployed at five sites.',
      'Automated real-time redaction integrated across the archive.'
    ],
    demographicMetrics: [
      { metric: 'Global Demographic Stability Index', value: '99.8%', variance: '+0.9% YoY' },
      { metric: 'Executive Bunker Autonomous Endurance', value: '720 Days', variance: 'Certified 100%' },
      { metric: 'Planetary Infrasonic Carrier Phase-Lock', value: '99.94%', variance: 'Global Synchrony' }
    ],
    scrubbedFootnote:
      '[AIRS LEVEL 5 RESTRICTED]: On divergence above 10.0%, Directive 01 triggers automatic Level 5 lockdown across all fourteen redoubts with no manual override. The override was removed at design stage and the design note is attached to the seventh chamber minutes.'
  }
];
