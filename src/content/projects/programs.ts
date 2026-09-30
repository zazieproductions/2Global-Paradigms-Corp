import type { InternalProgram } from '@/types';

/**
 * Programme dossiers as held by the Strategy Office.
 *
 * House style: the objective line is what the programme is allowed to be
 * called, the cover story is what clients read, and the classified reality is
 * an internal note written by someone who has stopped enjoying the job.
 */
export const INTERNAL_PROGRAMS: InternalProgram[] = [
  {
    id: 'prog-01',
    code: 'PROG-BOREAS',
    name: 'Project Boreas',
    leadDepartmentId: 'dept-asian',
    director: 'Dr. Henrik Lindqvist',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'High',
    budgetAnnual: '£380 Million',
    startYear: 1986,
    status: 'Active',
    objective: 'Polar atmospheric monitoring and refraction mapping for low-frequency acoustic signals.',
    publicCoverStory:
      'Long-term meteorological acoustics: polar vortex wind shear and stratospheric pressure differentials.',
    classifiedReality:
      'The permafrost column under Station 07 behaves as a lens. Boreas uses it to push the carrier into the upper atmosphere and bring it back down over northern Europe and the eastern seaboard. Loss along the path is higher than the 1986 model predicted and has been explained in every client deck as weather.',
    milestones: [
      { year: 1986, event: 'First transmission from Station 07 picked up in Scotland on a temporary array.' },
      {
        year: 1999,
        event: 'Waveguide synchronised with Yellowknife. Two-phase lock, holds for weeks at a time.'
      },
      {
        year: 2024,
        event: 'Ionospheric coupling observed. Amplitude up 18.4% and the increase has not reversed.'
      }
    ],
    linkedPersonnel: ['p-018', 'p-019', 'p-020', 'p-044'],
    linkedStations: ['st-04', 'st-07', 'st-17']
  },
  {
    id: 'prog-02',
    code: 'PROG-VESPER',
    name: 'Project Vesper',
    leadDepartmentId: 'dept-pefd',
    director: 'Dr. Naomi Chen',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'Critical',
    budgetAnnual: '£720 Million',
    startYear: 1989,
    status: 'Active',
    objective: 'Evening municipal tone broadcasting for urban crowd management.',
    publicCoverStory:
      'Background noise cancellation for smart cities; transit comfort and architectural acoustics.',
    classifiedReality:
      '432Hz under 14.8Hz, injected through subway PA and commercial HVAC at 18:00 local. Fatigue onset is deliberate. Assembly behaviour in covered streets is measurably down and the city authorities have never asked why the quiet hour is always the same hour.',
    milestones: [
      {
        year: 1989,
        event: 'First full municipal trial, Birmingham. Two stations, seven weeks, no complaints filed.'
      },
      {
        year: 2011,
        event:
          'Oakhaven, Indiana: full-town broadcast, stopped at the substation incident. Chen has never signed off on a whole-town trial since.'
      },
      { year: 2023, event: 'Eighteen North American subway networks in routine operation.' }
    ],
    linkedPersonnel: ['p-003', 'p-007', 'p-008', 'p-015', 'p-035'],
    linkedStations: ['st-01', 'st-02', 'st-15']
  },
  {
    id: 'prog-03',
    code: 'PROG-HYPNOS',
    name: 'Project Hypnos',
    leadDepartmentId: 'dept-becm',
    director: 'Dr. Tobias Voss',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£410 Million',
    startYear: 2002,
    status: 'Active',
    objective: 'Residential sleep-cycle entrainment and overnight message conditioning.',
    publicCoverStory: 'Sleep architecture optimisation and consumer sound-masking consultancy.',
    classifiedReality:
      'The grid is the delivery system. Domestic wiring hums at 50 or 60Hz and the beat placed on it is small enough to pass every safety test in every jurisdiction. REM is compressed. Suggestibility in the last hour before waking is elevated and has been measured on volunteer cohorts at Rosslyn.',
    milestones: [
      { year: 2002, event: 'Phase 1 lab work, using ParaCalm nursery hardware pulled from the recall line.' },
      {
        year: 2016,
        event: 'Forty towers in Tokyo and Seoul, six months, compliance questionnaires up across the board.'
      },
      { year: 2024, event: 'Grid-harmonic delivery patented through a defence shell company in Delaware.' }
    ],
    linkedPersonnel: ['p-014', 'p-015', 'p-031'],
    linkedStations: ['st-03', 'st-20']
  },
  {
    id: 'prog-04',
    code: 'PROG-CHIME',
    name: 'Project Chime',
    leadDepartmentId: 'dept-pefd',
    director: 'Dr. Jonas Weiss',
    clearance: 'Level 3 - Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£260 Million',
    startYear: 2006,
    status: 'Active',
    objective: 'Standardisation of school bell and public alert acoustic profiles.',
    publicCoverStory:
      'Acoustic clarity standards for primary education and hearing preservation in classrooms.',
    classifiedReality:
      'The approved bell is a 741Hz and 1176Hz pair. A child who hears it five days a week for eleven years will turn towards a state broadcast tone without deciding to. Weiss has twice proposed a study of what happens if a cohort ever misses the conditioning and both proposals were declined on budget.',
    milestones: [
      { year: 2006, event: 'Adopted by 4,200 municipal schools in six US states.' },
      { year: 2018, event: 'Extended to secondary school and transit alert tones in the UK and France.' }
    ],
    linkedPersonnel: ['p-007', 'p-008'],
    linkedStations: ['st-02', 'st-21']
  },
  {
    id: 'prog-05',
    code: 'PROG-PALIMPSEST',
    name: 'Project Palimpsest',
    leadDepartmentId: 'dept-airs',
    director: 'Vincent Adeyemi',
    clearance: 'Level 5 - Black Dossier',
    threatLevel: 'Critical',
    budgetAnnual: '£850 Million',
    startYear: 1994,
    status: 'Covert Active',
    objective: 'Retrospective rewriting and redaction of the archive.',
    publicCoverStory: 'Digital asset management and legacy records migration for institutional clients.',
    classifiedReality:
      'Crawlers, hash substitution scripts and a shredding floor at Postojna. Palimpsest exists because of the 1994 Reson-8 deaths, and it has since covered Oakhaven, the VeriPulse withdrawals and everything that came out of Svalbard. Adeyemi runs it to a standard: the paper that leaves the building must be able to survive comparison with whatever is left inside it.',
    milestones: [
      { year: 1994, event: 'Chartered the week after the recall, under the AIRS budget line.' },
      { year: 2019, event: 'Naylor exfiltration: 48GB of raw telemetry out of the building in one night.' },
      { year: 2025, event: 'Automated redaction enforcement running on every intranet search endpoint.' }
    ],
    linkedPersonnel: ['p-003', 'p-009', 'p-022', 'p-023', 'p-042'],
    linkedStations: ['st-01', 'st-10', 'st-04']
  },
  {
    id: 'prog-06',
    code: 'PROG-JANITOR',
    name: 'Project Janitor',
    leadDepartmentId: 'dept-siso',
    director: 'Chief Engineer Sarah Lin',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'High',
    budgetAnnual: '£540 Million',
    startYear: 1998,
    status: 'Active',
    objective: 'Deep ground resonance damping, fissure sealing and particulate control.',
    publicCoverStory: 'Mine safety engineering and geological hazard containment services.',
    classifiedReality:
      'Eighty-thousand-tonne polymer columns poured into mantle fractures under Utah, Svalbard and the Atacama, to stop the carrier finding a running resonance with anything on the surface. The work is not holding everywhere. Site 19 has taken three injections to hold one fracture and the third is not behaving like the first two.',
    milestones: [
      {
        year: 1998,
        event: 'First hydraulic injection, Site 19. The grout set faster than the lab promised.'
      },
      {
        year: 2023,
        event: 'Fracture 6 contained after a 72-hour vibration event that was felt in the visitor car park.'
      }
    ],
    linkedPersonnel: ['p-012', 'p-013', 'p-036'],
    linkedStations: ['st-06', 'st-10', 'st-15']
  },
  {
    id: 'prog-07',
    code: 'PROG-ECHO-STATE',
    name: 'Project Echo-State',
    leadDepartmentId: 'dept-sfpc',
    director: 'Dr. Evelyn Reed',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'High',
    budgetAnnual: '£610 Million',
    startYear: 2015,
    status: 'Active',
    objective: 'Synthetic demographic twins of major cities for crowd and compliance modelling.',
    publicCoverStory: 'Urban mobility simulation and municipal evacuation planning software.',
    classifiedReality:
      'Twelve cities modelled to the individual. The London instance carries 8.8 million agents and can be asked what the city does if the carrier amplitude doubles: how many stop walking, how fast, and where the hospitals fill first. Two of the pilot scenarios were run at 2026 amplitude and the results were not circulated.',
    milestones: [
      {
        year: 2015,
        event: 'Echo-London v1 online, running on the SFPC cluster for four days before anyone trusted it.'
      },
      {
        year: 2021,
        event:
          'Echo-Tokyo and Echo-Chicago added; the Chicago instance called the rail strike window to within ninety minutes.'
      }
    ],
    linkedPersonnel: ['p-005', 'p-006', 'p-032', 'p-037'],
    linkedStations: ['st-01', 'st-03', 'st-21']
  },
  {
    id: 'prog-08',
    code: 'PROG-STENTOR',
    name: 'Project Stentor',
    leadDepartmentId: 'dept-siso',
    director: 'Commander J. R. Calderon',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'Critical',
    budgetAnnual: '£490 Million',
    startYear: 1991,
    status: 'Active',
    objective: 'High-amplitude lithospheric broadcast network.',
    publicCoverStory: 'Crustal tomography and earthquake early warning research.',
    classifiedReality:
      'Pneumatic transducers in deep rock, loud enough to carry a pulse through continental bedrock. Intended for hostile territory: a population that panics on schedule is a population that stops moving. There has never been a live trial on a populated target and the standing instruction is that there will not be one without a signed directive from the chair.',
    milestones: [
      { year: 1991, event: 'Desert trials at Mojave Sector 44. Four geophones, one very surprised rancher.' },
      { year: 2004, event: 'Integrated with the Black Ridge array in West Virginia.' },
      {
        year: 2020,
        event: 'Utah to Atacama dual-pulse test: crustal transit in 14.2 minutes, matching the model.'
      }
    ],
    linkedPersonnel: ['p-012', 'p-013', 'p-029', 'p-036'],
    linkedStations: ['st-05', 'st-06', 'st-15', 'st-16']
  },
  {
    id: 'prog-09',
    code: 'PROG-CICADA',
    name: 'Project Cicada',
    leadDepartmentId: 'dept-pefd',
    director: 'Dr. Naomi Chen',
    clearance: 'Level 3 - Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£310 Million',
    startYear: 2012,
    status: 'Active',
    objective: 'Piezoelectric roadside harvesting and passive re-radiation.',
    publicCoverStory: 'Pavement structural health monitoring and smart asphalt telemetry.',
    classifiedReality:
      'Trucks power it. The plates under the carriageway turn tyre vibration into the carrier and put it in the air behind the vehicle. Long-haul drivers on the test corridor report arriving less tired than they should be. Nothing about the system is concealed except the frequency, which is not published and is not a secret the drivers would want.',
    milestones: [
      { year: 2012, event: 'Two hundred miles of I-80 in Utah and Nevada.' },
      {
        year: 2019,
        event:
          'M1 corridor in the United Kingdom. The unions asked about the smoothness and were told it was new asphalt.'
      }
    ],
    linkedPersonnel: ['p-007', 'p-027'],
    linkedStations: ['st-01', 'st-02', 'st-06', 'st-15']
  },
  {
    id: 'prog-10',
    code: 'PROG-AETHELGARD',
    name: 'Project Aethelgard',
    leadDepartmentId: 'dept-ccdr',
    director: 'Mara Finch',
    clearance: 'Level 5 - Black Dossier',
    threatLevel: 'Existential',
    budgetAnnual: '£1.65 Billion',
    startYear: 1984,
    status: 'Covert Active',
    objective: 'Fourteen subterranean continuity redoubts for the preservation of the executive cadre.',
    publicCoverStory: 'High-security financial data centres and archival seed vaults.',
    classifiedReality:
      "Ten thousand places, 720 days, fourteen mountains. Sealed at 12dB above baseline, no manual override, which was a design decision taken in 2016 and minuted. The Heritage Cohort roster is closed. Staff are not eligible. The gate list is held at Grimsel and one copy is held in the chair's own hand.",
    milestones: [
      {
        year: 1984,
        event:
          'Groundbreaking at Grimsel Pass. Two years spent on drainage before anyone talked about bunkers.'
      },
      { year: 2008, event: 'Woomera and Jeju complete.' },
      {
        year: 2024,
        event:
          'Final seed and cultural archive transfers. Jeju is eleven berths short of the roster and the shortfall has been accepted.'
      }
    ],
    linkedPersonnel: ['p-002', 'p-004', 'p-010', 'p-011', 'p-026'],
    linkedStations: ['st-08', 'st-13', 'st-20', 'st-22']
  },
  {
    id: 'prog-11',
    code: 'PROG-STILLWATER',
    name: 'Project Stillwater',
    leadDepartmentId: 'dept-asian',
    director: 'Dr. Tariq Al-Mansoor',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£290 Million',
    startYear: 2009,
    status: 'Active',
    objective: 'Hydro-acoustic stabilisation of municipal drinking water reservoirs.',
    publicCoverStory: 'Ultrasonic algae control and reservoir purification.',
    classifiedReality:
      'Water holds a standing wave longer than anyone was taught in school, and plumbing carries it into the house. Stillwater runs high-frequency sonication across the supply reservoirs to break the memory up before it reaches a tap. Al-Mansoor first proposed it as a precaution and later found evidence that it was needed.',
    milestones: [
      { year: 2009, event: 'Lake Mead and the New York reservoir system.' },
      { year: 2021, event: 'Standing waves erased to below instrument floor in all monitored reservoirs.' }
    ],
    linkedPersonnel: ['p-025', 'p-038'],
    linkedStations: ['st-06', 'st-09', 'st-18']
  },
  {
    id: 'prog-12',
    code: 'PROG-MORPHEUS',
    name: 'Project Morpheus',
    leadDepartmentId: 'dept-bhrr',
    director: 'Dr. Marcus Saito',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'High',
    budgetAnnual: '£440 Million',
    startYear: 2014,
    status: 'Active',
    objective: 'Post-trauma memory dampening and targeted retrograde amnesia.',
    publicCoverStory: 'Clinical research into acute stress disorder and occupational noise trauma.',
    classifiedReality:
      'Compound 88-T plus a 7.83Hz burst, timed to the sleep spindle. It removes the fortnight around an incident and leaves the rest of the year intact, which the Yellowknife clinic has demonstrated more often than it would like. Julian Naylor was remediated with it in 2020. Saito has asked twice for it to be restricted to clinical use and both requests are in the file.',
    milestones: [
      { year: 2014, event: 'Formulated at Yellowknife from the ParaCalm sedative line.' },
      { year: 2020, event: 'Deployed during the Station 07 evacuation. Eleven staff, no refusals.' }
    ],
    linkedPersonnel: ['p-020', 'p-021', 'p-033'],
    linkedStations: ['st-04', 'st-07']
  },
  {
    id: 'prog-13',
    code: 'PROG-VITRUVIAN',
    name: 'Project Vitruvian',
    leadDepartmentId: 'dept-pefd',
    director: 'Dr. Naomi Chen',
    clearance: 'Level 3 - Secret',
    threatLevel: 'Low',
    budgetAnnual: '£180 Million',
    startYear: 2016,
    status: 'Active',
    objective: 'Passive acoustic shielding for client executive suites.',
    publicCoverStory: 'Luxury architectural acoustics and speech privacy for prime commercial real estate.',
    classifiedReality:
      'Helmholtz resonators and damped floors, sold as elegance, priced as insulation. Whoever sits in a Vitruvian room is out of the broadcast, which is the entire point: the people who paid for the quiet hour do not hear it. Vitruvian clients do not know it exists and are not meant to.',
    milestones: [
      {
        year: 2016,
        event:
          'Tower Obsidian penthouse fitted. Ashby took the first meeting in it and asked for the hum to be put back.'
      },
      { year: 2022, event: 'Thirty-four banking headquarters in Frankfurt, London and New York.' }
    ],
    linkedPersonnel: ['p-007', 'p-027'],
    linkedStations: ['st-01', 'st-02']
  },
  {
    id: 'prog-14',
    code: 'PROG-MONOLITH',
    name: 'Project Monolith',
    leadDepartmentId: 'dept-asian',
    director: 'Dr. Henrik Lindqvist',
    clearance: 'Level 5 - Black Dossier',
    threatLevel: 'Existential',
    budgetAnnual: '£920 Million',
    startYear: 2001,
    status: 'Covert Active',
    objective: 'Core-mantle boundary acoustic monitoring and deep-lithosphere carrier track.',
    publicCoverStory: 'Geodynamo magnetic monitoring and mantle convection modelling.',
    classifiedReality:
      'Something below the mantle has been sending since before there was anyone to send it to, at 14.8Hz, and it is going up. Hydrophone 12 caught it first, phase-locked, the same afternoon as Svalbard. The period has since stopped looking random, which is the only sentence in the Monolith file that Lindqvist has ever refused to put in writing.',
    milestones: [
      {
        year: 2001,
        event:
          'Simultaneous phase-locked detection, Station 07 and Diego Garcia. The two records agree to the millisecond.'
      },
      { year: 2017, event: 'Azores Node 14 fixes the transatlantic convergence point.' },
      { year: 2025, event: 'Period modulation logged. Twelve weeks of it, structured, still unexplained.' }
    ],
    linkedPersonnel: ['p-001', 'p-003', 'p-018', 'p-025', 'p-038'],
    linkedStations: ['st-04', 'st-09', 'st-14', 'st-17', 'st-19']
  }
];
