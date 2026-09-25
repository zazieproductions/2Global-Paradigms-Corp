import { InternalProgram } from '../types';

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
    objective: 'Atmospheric refraction mapping and polar ducting of low-frequency acoustic standing waves across the Northern Hemisphere.',
    publicCoverStory: 'Long-term meteorological acoustic research on polar vortex wind shears and stratosphere pressure differentials.',
    classifiedReality: 'Utilizes sub-zero Arctic permafrost as an acoustic lens to bounce 14.8Hz carrier tones through the upper ionosphere, maintaining baseline neural entrainment across North America and Europe.',
    milestones: [
      { year: 1986, event: 'First acoustic transmission from Station 07 detected in Scotland.' },
      { year: 1999, event: 'Polar waveguide harmonic synchronization established with Yellowknife.' },
      { year: 2024, event: 'Ionospheric flare coupling observed; amplitude increased by 18.4%.' }
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
    objective: 'Municipal low-frequency evening tone broadcasts for mass civilian cognitive dampening and protest suppression.',
    publicCoverStory: 'Municipal background noise cancellation infrastructure for smart cities and architectural transit comfort.',
    classifiedReality: 'Sub-audible 432Hz/14.8Hz harmonic broadcast injected into commercial HVAC and public subway PA systems at 18:00 daily to induce fatigue, lower aggression, and diminish public assembly impulses.',
    milestones: [
      { year: 1989, event: 'Initial Sector 9 municipal trial in Birmingham, UK.' },
      { year: 2011, event: 'Oakhaven, Indiana full-town isolation test (abruptly terminated after cognitive dissociation incidents).' },
      { year: 2023, event: 'Integration into 18 North American metropolitan subway networks completed.' }
    ],
    linkedPersonnel: ['p-003', 'p-007', 'p-008', 'p-015', 'p-035'],
    linkedStations: ['st-01', 'st-02', 'st-15']
  },
  {
    id: 'prog-03',
    code: 'PROG-HYPNOS',
    name: 'Project Hypnos',
    leadDepartmentId: 'dept-becm',
    director: 'Dr. Kaelen Voss',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£410 Million',
    startYear: 2002,
    status: 'Active',
    objective: 'Sleep-cycle acoustic entrainment and subconscious compliance messaging in high-density residential towers.',
    publicCoverStory: 'Sleep architecture optimization technology and consumer sound-masking consultancy.',
    classifiedReality: 'Employs microtonal binaural beating delivered through standard electrical wiring harmonics (50Hz/60Hz grid hum) to compress REM sleep duration and heighten suggestibility to municipal public health directives.',
    milestones: [
      { year: 2002, event: 'Phase 1 laboratory testing with ParaCalm nursery prototypes.' },
      { year: 2016, event: 'Pilot deployment across 40 residential high-rises in Tokyo and Seoul.' },
      { year: 2024, event: 'Grid-harmonic delivery protocol patent filed under defense shell corporation.' }
    ],
    linkedPersonnel: ['p-014', 'p-015', 'p-031'],
    linkedStations: ['st-03', 'st-20']
  },
  {
    id: 'prog-04',
    code: 'PROG-CHIME',
    name: 'Project Chime',
    leadDepartmentId: 'dept-pefd',
    director: 'Dr. Jonas Sylvan',
    clearance: 'Level 3 - Secret',
    threatLevel: 'Moderate',
    budgetAnnual: '£260 Million',
    startYear: 2006,
    status: 'Active',
    objective: 'Standardization of public school bell and institutional alert acoustic spectrums to establish early developmental acoustic conditioning.',
    publicCoverStory: 'Pedagogical acoustic clarity standards and hearing preservation in primary education.',
    classifiedReality: 'Fine-tunes institutional bells to specific resonant frequencies (741Hz / 1176Hz harmonic pair) that condition students to respond immediately to sudden state broadcast tone changes in adult life.',
    milestones: [
      { year: 2006, event: 'Adopted by 4,200 municipal schools across 6 US states.' },
      { year: 2018, event: 'Expanded to secondary school transit alerts in UK and France.' }
    ],
    linkedPersonnel: ['p-007', 'p-008'],
    linkedStations: ['st-02', 'st-21']
  },
  {
    id: 'prog-05',
    code: 'PROG-PALIMPSEST',
    name: 'Project Palimpsest',
    leadDepartmentId: 'dept-airs',
    director: 'Cassian Drake',
    clearance: 'Level 5 - Black Dossier',
    threatLevel: 'Critical',
    budgetAnnual: '£850 Million',
    startYear: 1994,
    status: 'Covert Active',
    objective: 'Systematic retrospective rewriting, digital substitution, and classified redaction of historical events connecting GPC to global mass acoustic casualties.',
    publicCoverStory: 'Corporate digital asset management and legacy records archive migration.',
    classifiedReality: 'Maintains thousands of shadow domain crawlers, cryptographic hash substitution scripts, and physical microfilm shredding chambers to erase evidence of the 1994 Reson-8 deaths, 2011 Oakhaven trial, and Station 07 leaks.',
    milestones: [
      { year: 1994, event: 'Created following the emergency Reson-8 consumer recall.' },
      { year: 2019, event: 'Massive security breach when Dr. Aris Thorne exfiltrated 48GB of raw telemetry.' },
      { year: 2025, event: 'Automated AI redaction enforcement engine deployed across all intranet search endpoints.' }
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
    objective: 'Subterranean resonance dampening, acoustic fissure sealing, and seismic particulate scrubbing.',
    publicCoverStory: 'Mine safety engineering and geological hazard containment services.',
    classifiedReality: 'Deploys 80,000-ton polymer acoustic dampeners into deep mantle fault fractures beneath Utah, Svalbard, and the Atacama to prevent runaway harmonic resonance with surface structures.',
    milestones: [
      { year: 1998, event: 'First deep hydraulic grout injection at Site 19.' },
      { year: 2023, event: 'Containment of subterranean fracture 6 completed after 72-hour emergency vibration.' }
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
    objective: 'Synthetic demographic digital twins of major world capitals modeling crowd panic thresholds and compliance dynamics.',
    publicCoverStory: 'Urban mobility simulation and municipal emergency evacuation planning software.',
    classifiedReality: 'Continuous algorithmic simulation of 12 global cities down to individual citizen cellular movement. Simulates the exact casualty count and panic velocity if the 14.8Hz carrier amplitude is doubled.',
    milestones: [
      { year: 2015, event: 'First complete twin city model of London (Echo-London v1).' },
      { year: 2021, event: 'Echo-Tokyo and Echo-Chicago online; achieved 94.2% predictive accuracy during transit strike simulations.' }
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
    objective: 'High-amplitude lithospheric infrasound broadcast network capable of long-range continental acoustic transmission.',
    publicCoverStory: 'Global seismic crustal tomography and earthquake early-warning research.',
    classifiedReality: 'Underground pneumatic transducer network capable of broadcasting high-decibel sub-audible pulses directly through continental bedrock to trigger immediate physiological panic or disorientation across hostile territories.',
    milestones: [
      { year: 1991, event: 'Desert testing at Mojave Sector 44.' },
      { year: 2004, event: 'Integration with Appalachian Black Ridge deep array.' },
      { year: 2020, event: 'Dual-pulse test between Utah and Atacama verified global crustal transit in 14.2 minutes.' }
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
    objective: 'Piezoelectric sensor grid buried along interstate highway corridors to harvest tire vibration and re-radiate low-frequency entrainment tones.',
    publicCoverStory: 'Highway pavement structural health monitoring and smart asphalt telemetry.',
    classifiedReality: 'Roadway surface transducers use vehicle acoustic energy to power passive 14.8Hz re-radiators, creating seamless cognitive entrainment corridors for long-haul drivers and interstate travelers.',
    milestones: [
      { year: 2012, event: 'Pilot installation along 200 miles of I-80 in Utah and Nevada.' },
      { year: 2019, event: 'Extended to M1 motorway corridor in the United Kingdom.' }
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
    objective: 'Global network of 14 sovereign subterranean continuity redoubts provisioned for the long-term preservation of the corporate executive cadre.',
    publicCoverStory: 'High-security financial data centers and archival seed vaults.',
    classifiedReality: 'Deep-mountain subterranean bunkers engineered to sustain 10,000 selected individuals (Tier-1 Heritage Cohort) for 720 days in the event of global cognitive or civil collapse.',
    milestones: [
      { year: 1984, event: 'Groundbreaking on the Swiss Alps Redoubt (Grimsel Pass).' },
      { year: 2008, event: 'Completion of Woomera and Jeju Island deep redoubts.' },
      { year: 2024, event: 'Final biological seed and digital cultural archive transfers completed.' }
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
    objective: 'Hydro-acoustic stabilization of municipal drinking water reservoirs to prevent water-borne acoustic memory retention.',
    publicCoverStory: 'Ultrasonic algae control and municipal reservoir purification.',
    classifiedReality: 'Continuous high-frequency sonication of major metropolitan reservoirs to disrupt liquid crystalline acoustic memory that could otherwise retain and propagate sub-harmonic carrier tones into household plumbing.',
    milestones: [
      { year: 2009, event: 'Trial in Lake Mead and New York reservoir system.' },
      { year: 2021, event: 'Demonstrated complete erasure of hydro-acoustic standing waves.' }
    ],
    linkedPersonnel: ['p-025', 'p-038'],
    linkedStations: ['st-06', 'st-09', 'st-18']
  },
  {
    id: 'prog-12',
    code: 'PROG-MORPHEUS',
    name: 'Project Morpheus',
    leadDepartmentId: 'dept-bhrr',
    director: 'Dr. Marcus Vance-Saito',
    clearance: 'Level 4 - Top Secret',
    threatLevel: 'High',
    budgetAnnual: '£440 Million',
    startYear: 2014,
    status: 'Active',
    objective: 'Post-trauma civic memory dampening and targeted retrograde acoustic amnesia protocols for disaster populations.',
    publicCoverStory: 'Clinical treatment research for acute post-traumatic stress disorder and occupational noise trauma.',
    classifiedReality: 'Combines Compound 88-T pharmaceutical dosing with calibrated 7.83Hz acoustic bursts to induce rapid selective amnesia regarding classified acoustic events or municipal trial breaches.',
    milestones: [
      { year: 2014, event: 'Formulated in Yellowknife Bio-Harmonic laboratories.' },
      { year: 2020, event: 'Successfully deployed during the evacuation of Station 07 staff.' }
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
    objective: 'Harmonic architectural engineering for Fortune 100 executive suites, ensuring optimal decision-making clarity and immunity from external infrasound.',
    publicCoverStory: 'Luxury architectural acoustics and acoustic privacy design for prime commercial real estate.',
    classifiedReality: 'Installs passive Helmholtz resonators and piezoelectric floor dampers in client headquarters to shield senior executives from GPC municipal tone broadcasts.',
    milestones: [
      { year: 2016, event: 'Installed in Tower Obsidian London executive penthouse.' },
      { year: 2022, event: 'Contracted for 34 banking headquarters in Frankfurt, London, and New York.' }
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
    objective: 'Planetary core-mantle boundary harmonic resonance monitoring and deep-lithosphere communication carrier wave.',
    publicCoverStory: 'Deep earth geodynamo magnetic monitoring and mantle convection modeling.',
    classifiedReality: 'Continuous tracking of an artificial or non-biological 14.8Hz acoustic beacon originating from approximately 2,900km depth near the core-mantle boundary, first intercepted simultaneously at Svalbard and Diego Garcia in 2001.',
    milestones: [
      { year: 2001, event: 'Simultaneous 14.8Hz phase-locked detection at Station 07 and Diego Garcia.' },
      { year: 2017, event: 'Azores Seabed Station confirms transatlantic geometric convergence point.' },
      { year: 2025, event: 'Signal period modulation detected; suggests non-stochastic encoded structure.' }
    ],
    linkedPersonnel: ['p-001', 'p-003', 'p-018', 'p-025', 'p-038'],
    linkedStations: ['st-04', 'st-09', 'st-14', 'st-17', 'st-19']
  }
];
