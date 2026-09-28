import type { JobPosting } from '@/types';

/**
 * Recruitment listings, careers portal.
 *
 * These are written by a recruitment desk that has been briefed on what to
 * leave out, and they read like it: normal jobs, normal benefits, and
 * occasionally one line that was drafted by the hiring manager instead of HR.
 */
export const JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-01',
    requisitionId: 'REQ-2025-0841',
    title: 'Acoustic Calibration Engineer, Municipal Transit',
    department: 'Psychoacoustics & Environmental Frequency Directorate (PEFD)',
    location: 'North American Hub (Rosslyn Sub-Complex, VA)',
    clearanceRequired: 'Level 4 - Top Secret',
    salaryRange: '$185,000 - $240,000 USD + Sub-Surface Hazard Stipend',
    overview:
      'You will hold the calibration schedule for tone installations on eighteen metropolitan transit networks: measuring, tuning and re-tuning arrays from a tablet, mostly at night, mostly alone. The work is precise rather than experimental and the tolerances are tighter than anything in commercial audio. Candidates who enjoy the difference between a specification and a field will do well here.',
    responsibilities: [
      'Calibrate and re-certify dual-modulated arrays on client transit property, typically between 01:00 and 04:00.',
      'Carry out acoustic hygiene audits of installed HVAC dampening, and write up what you find, not what the contract expects.',
      'Attend site during resonance incidents, which occur without warning and are usually reported by members of the public.',
      'Produce technical summaries for the client and a separate internal note for the directorate.'
    ],
    qualifications: [
      'Ph.D. or M.S. in acoustics, electrical engineering or applied geophysics.',
      'Seven years or more in wave propagation, DSP filter design or defence sonar.',
      'Level 4 clearance held, or the temperament to obtain it through our vetting process.',
      'Willingness to work to a specification you will not be given the reason for.'
    ],
    psychologicalRequirements: [
      'Comfortable with continuous low-frequency exposure during site visits; hearing protection is issued but not always usable.',
      'No history of sleep paralysis, night panic or auditory pareidolia. This is a hard requirement and it is checked at interview.',
      'Agreement to periodic prophylactic medication while posted to sites with active arrays.'
    ],
    postingDate: '2025-01-08'
  },
  {
    id: 'job-02',
    requisitionId: 'REQ-2025-0912',
    title: 'Building Services Engineer, Sub-Basement Levels 4-5',
    department: 'Subterranean Infrastructure & Station Operations (SISO)',
    location: 'Global HQ (Tower Obsidian, London, UK)',
    clearanceRequired: 'Level 2 - Confidential',
    salaryRange: '£65,000 - £82,000 GBP + Overtime & Shift Differential',
    overview:
      'A maintenance role at the bottom of the tower, reporting to the maintenance supervisor. Dampers, chilled water, cooling loops and the plant that keeps the executive floors quiet. The plant is older than the building around it and there is no manual for about a third of it, so we want somebody who takes notes.',
    responsibilities: [
      'Daily inspection of the hydraulic damping jacks and their foundation anchor points.',
      'Maintenance of liquid nitrogen cooling loops serving the sensor rooms on B5.',
      'Log structural micro-vibration readings; escalate immediately if the 22Hz facade damper drifts more than 0.2Hz.',
      'Keep the sub-level access hatches locked and report every attempt to open them, including your own.'
    ],
    qualifications: [
      'Mechanical engineering qualification, industrial HVAC background or equivalent site experience.',
      'Three years or more with deep-basement plant, tunnels, ships or similar confined installations.',
      'Able to work a full shift in Class-A acoustic headgear where required.'
    ],
    psychologicalRequirements: [
      'Completion of the standard cognitive stability diagnostic before hire.',
      'Comfortable in windowless, low-light, acoustically isolated spaces. Most of our staff are and the ones who are not know within a fortnight.'
    ],
    postingDate: '2025-01-14'
  },
  {
    id: 'job-03',
    requisitionId: 'REQ-2024-1104',
    title: 'Instrumentation Scientist, Polar Array',
    department: 'Atmospheric Sensing & Infrasonic Array Network (ASIAN)',
    location: 'Nordic Acoustic Array (Station 07, Spitsbergen, Svalbard)',
    clearanceRequired: 'Level 4 - Top Secret',
    salaryRange: '£140,000 - £175,000 GBP + Polar Isolation Bonus & Housing',
    overview:
      'Two-year rotation at Station 07, twelve staff, four months of dark. You will run the sensor array and the borehole instrument string, and you will live in the same corridor as the people you work with, which is the part most applicants underestimate. Previous polar service, research-station or submarine experience is strongly preferred.',
    responsibilities: [
      'Maintain and repair the microbarometer and geophone array, by hand, at ambient temperatures down to -35C.',
      'Process borehole telemetry daily and file a written report every Friday without exception.',
      'Support the station medical officer with crew monitoring, including sleep and hearing assessments.',
      'Observe the standing instruction that no crew member descends below Level 3 of the borehole complex.'
    ],
    qualifications: [
      'Physics, geophysics or instrumentation degree, or equivalent field service background.',
      'Two years or more of isolated posting, ideally with a winter-over completed.',
      'Practical electronics and a tolerance for equipment that fails in the cold.'
    ],
    psychologicalRequirements: [
      'Pre-deployment assessment with our medical office, repeated annually.',
      'Candidates should be aware that the array runs continuously. The tone is below the audible range and is described by most staff as a pressure rather than a sound. A small number of long-serving crew report hearing words in it, and everyone posted here is warned about that in writing before they sign.'
    ],
    postingDate: '2024-12-01'
  },
  {
    id: 'job-04',
    requisitionId: 'REQ-2025-0144',
    title: 'Security Operations Officer, Site Protection Team',
    department: 'Tactical Obfuscation & Public Narrative (TOPN)',
    location: 'Global HQ (Tower Obsidian, London, UK) & Field Deployment',
    clearanceRequired: 'Level 4 - Top Secret',
    salaryRange: '£110,000 - £145,000 GBP + Performance Bonus',
    overview:
      'Investigation support for the counter-leak team. The work is 70% reading: mirrors, forums, ex-employee posts, small inconsistencies in a client account. The remainder is travel to stations during incidents and writing up what you find in a form that will survive legal review. This is not a protective security role.',
    responsibilities: [
      "Monitor open sources and internal logs for material that has left the company's estate.",
      'Attend site during security incidents and take statements from staff who were present.',
      "Prepare evidential records to a standard the counsel's office can use without going back over your work.",
      'Report to the lead investigator weekly, in writing, and keep the note short.'
    ],
    qualifications: [
      'Investigative background: police, military intelligence, financial crime or regulatory.',
      'Discretion regarding colleagues. This matters more than any other bullet on this list.',
      'Level 4 clearance, or eligibility for accelerated vetting within 60 days.'
    ],
    psychologicalRequirements: [
      'The post involves exposure to material of an unpleasant nature. We provide support; we expect candour.',
      'Candidates should not apply if they expect operational work in the conventional sense.'
    ],
    postingDate: '2025-01-20'
  },
  {
    id: 'job-05',
    requisitionId: 'REQ-2024-0789',
    title: 'Continuity Planner, Resettlement Modelling',
    department: 'Division of Civic Continuity & Demographic Resilience (CCDR)',
    location: 'European Civic Continuity Bunker (Swiss Alps Redoubt, Switzerland)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '160,000 - 195,000 CHF + Alpine Living Allowance',
    overview:
      'Modelling how populations move and behave when they are relocated with little notice into constrained space, and what happens when the people moving have stopped trusting the signage. Urban planning, transport planning or emergency logistics background. Live on site; the commute is a lift.',
    responsibilities: [
      'Build and validate relocation models for client cities under a range of shock scenarios.',
      'Design crowd corridors at pinch points, using real station geometry and real commuter volumes.',
      'Run tabletop exercises with client civil contingencies teams and write the after-action notes.',
      'Present to client officials who will, on the day, be making the decisions the models describe.'
    ],
    qualifications: [
      'Degree in urban planning, civil or transport engineering, or equivalent operational experience.',
      'Strong quantitative habits; our users act on your numbers and there is no time to check them twice on the day.',
      'German or French at working level is an advantage.'
    ],
    psychologicalRequirements: [
      'Enrolment in the on-site emergency roster, including night call-out.',
      'Willingness to work on scenarios involving civilian casualties. Please consider this carefully before applying.'
    ],
    postingDate: '2024-11-15'
  },
  {
    id: 'job-06',
    requisitionId: 'REQ-2025-0312',
    title: 'Demographic Modeller, Synthetic Populations',
    department: 'Department of Strategic Forecasting & Predictive Chronology (SFPC)',
    location: 'Global HQ (Tower Obsidian, London, UK)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '£95,000 - £125,000 GBP + Equity Incentive',
    overview:
      'We run synthetic replicas of client cities with every resident modelled as an agent — 8.8 million of them in the London instance. The work is calibration: making the agents behave like people, then asking them questions that nobody can ethically ask a real city.',
    responsibilities: [
      'Extend and calibrate agent models against observed behaviour, municipal data and transit telemetry.',
      'Run scenario suites against client policy questions and write them up for non-technical readers.',
      'Maintain the validation harness; a model that cannot be reproduced is not a model.',
      'Document your assumptions. The ones that turn out to matter have all been assumptions we did not write down.'
    ],
    qualifications: [
      'Quantitative PhD or equivalent, plus production modelling experience rather than academic only.',
      'Python or C++ at a professional standard, and MPI or equivalent for large runs.',
      'An instinct for when a result is too good to be true.'
    ],
    psychologicalRequirements: [
      'Standard vetting. No field deployment and no particular physical demands.',
      'Some of our scenarios concern civil disorder and are unsettling to work on in the third year. It is discussed at interview.'
    ],
    postingDate: '2025-01-05'
  },
  {
    id: 'job-07',
    requisitionId: 'REQ-2024-0550',
    title: 'Senior Archivist, Redaction Office',
    department: 'Archive Integrity & Retrospective Scrubbing (AIRS)',
    location: 'Balkan Harmonic Calibration Center (Postojna Caverns, Slovenia)',
    clearanceRequired: 'Level 4 - Top Secret',
    salaryRange: '€75,000 - €95,000 EUR + Subterranean Allowance',
    overview:
      'Custody work in a controlled microclimate. You will process pre-1980 material — paper, microfilm, some photographic plates — and maintain the redaction standard on documents that are covered rather than destroyed. The repository is climate-controlled, quiet and about nine degrees for most of the year.',
    responsibilities: [
      'Index, scan and re-box incoming material according to the current standard, edition 8.',
      'Apply and record redaction passes, including reversals when a standard is amended.',
      'Maintain chain of custody to audit standard; we are inspected and the inspections are unfriendly.',
      'Report discrepancies to the curator. Discrepancies are handled by the curator and not by you.'
    ],
    qualifications: [
      'Archive, library or records qualification, or equivalent years in a records function.',
      'Fine manual work. This is a job for hands.',
      'Slovenian, Italian or German at working level; the site team is multilingual.'
    ],
    psychologicalRequirements: [
      'Medical screening including periodic assessment, as standard for all Postojna staff.',
      'Residency within the site compound for the first six months is required. Applicants should note that the repository holds material dating from 1971 relating to every programme the company has run, and that content is not discussed outside the office.'
    ],
    postingDate: '2024-10-22'
  },
  {
    id: 'job-08',
    requisitionId: 'REQ-2025-0401',
    title: 'Deep-Ocean Acoustics Scientist',
    department: 'Atmospheric Sensing & Infrasonic Array Network (ASIAN)',
    location: 'Indian Ocean Monitor (Diego Garcia Trench) & Sea Deployments',
    clearanceRequired: 'Level 4 - Top Secret',
    salaryRange: '$165,000 - $210,000 USD + Sea Duty Bonus',
    overview:
      'Hydrophone arrays on the seabed at 5,000 metres, and the analysis that follows the data ashore. Six weeks at sea, six weeks on station, repeated. We are looking for somebody who can run a deployment in bad weather and then write a defensible paper about what the array heard.',
    responsibilities: [
      'Operate and maintain moored hydrophone arrays including sub-surface recovery and re-deployment.',
      'Process low-frequency ambient data and distinguish equipment artefact from source.',
      'Handle visiting naval and civil liaison officers who will ask what we are looking for.',
      'Publish what can be published. There is a standing arrangement about what cannot.'
    ],
    qualifications: [
      'Ph.D. in ocean acoustics, marine geophysics or a closely related field.',
      'Certified for sea duty and experienced in deep mooring operations.',
      'Comfortable with long deployments and with equipment you cannot reach without a ship.'
    ],
    psychologicalRequirements: [
      'Sea-going medical certificate and regular fitness reviews.',
      'Applicants are advised that some recorded material from these arrays is disturbing. It is not played to new staff and it is available to those who ask.'
    ],
    postingDate: '2025-01-12'
  },
  {
    id: 'job-09',
    requisitionId: 'REQ-2024-0988',
    title: 'Clinical Officer, Occupational Audiology',
    department: 'Bio-Harmonic Reclamation & Remediation (BHRR)',
    location: 'Yellowknife Sub-Permafrost Lab (NWT, Canada)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '$135,000 - $160,000 CAD + Remote Location Stipend',
    overview:
      'Clinical support for field staff exposed to undamped sources: audiology, sleep, and the anxiety that comes with both. You will be one of two clinicians on site and you will be the person people talk to at 03:00, because there is nobody else.',
    responsibilities: [
      'Assessment, treatment and monitoring of acoustic exposure cases, including dispensing the standard drops.',
      'Sleep and hearing monitoring for active-array crews, filed quarterly.',
      'Advise the station chief on fitness for duty, and hold the line when you are asked to sign somebody as fit.',
      'Keep case notes that could be read aloud in a court without embarrassing you.'
    ],
    qualifications: [
      'Registered clinician: audiology, occupational medicine or clinical psychology.',
      'Experience of remote or industrial medicine.',
      'Willingness to work with a small team in a very cold place for most of the year.'
    ],
    psychologicalRequirements: [
      'Routine pre-deployment screening, repeated annually.',
      'Please note that you will be asked to assess colleagues you live with. The previous holder of this post managed it for four years; we mention it because it is the hardest part of the job.'
    ],
    postingDate: '2024-11-28'
  },
  {
    id: 'job-10',
    requisitionId: 'REQ-2025-0210',
    title: 'Cryogenic Systems Technician, High-Altitude Array',
    department: 'Atmospheric Sensing & Infrasonic Array Network (ASIAN)',
    location: 'High-Altitude Infrasound Array (Atacama Trench Station, Chile)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '$120,000 - $145,000 USD + High-Altitude Premium',
    overview:
      'Maintaining sensor cooling at 4,800 metres, where the air is thin, the UV is unforgiving and the nearest hospital is two hours of gravel away. Small station, fourteen staff, international rotation. This is a hands-on post; the instrumentation is temperamental and the instruments are cold.',
    responsibilities: [
      'Maintain cryogenic cooling loops and the SQUID sensor pods they serve.',
      'Carry out field repairs at the array line and calibrate replacement units on site.',
      'Support the superintendent with power and water systems during the winter window.',
      'Record everything in the station log, in ink, at the time. Our record from 2021 exists because somebody did.'
    ],
    qualifications: [
      'Electronics or refrigeration qualification with several years at technician level.',
      'High-altitude or remote station experience preferred.',
      'A good head for heights and an unromantic attitude to scenery.'
    ],
    psychologicalRequirements: [
      'Altitude and fitness screening, then an annual review.',
      'Rotation is eight weeks on, four off. Applicants frequently underestimate the fourth week. We tell you this now rather than in the interview.'
    ],
    postingDate: '2025-01-18'
  },
  {
    id: 'job-11',
    requisitionId: 'REQ-2024-1215',
    title: 'Corporate Affairs Writer',
    department: 'Tactical Obfuscation & Public Narrative (TOPN)',
    location: 'Global HQ (Tower Obsidian, London, UK)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '£80,000 - £105,000 GBP + Annual Performance Bonus',
    overview:
      'Writing on the corporate side: statements, sustainability reporting, incident communications and the language used when a fault in client equipment needs explaining to the public. Fast turnaround, high volume, no byline.',
    responsibilities: [
      'Draft press statements, client notifications and regulatory responses to a house style.',
      'Re-word technical findings for public audiences without saying anything the engineers cannot stand behind.',
      'Maintain the standing wording library, including the approved explanations for low-frequency noise complaints.',
      'Be available out of hours during incidents, which occur perhaps eight times a year and never at a convenient time.'
    ],
    qualifications: [
      'Newsroom, press office or communications agency background.',
      'Ability to write quickly in a formal register, and to be edited without arguing.',
      'Level 3 clearance or the willingness to obtain it; the work requires access to unredacted reports.'
    ],
    psychologicalRequirements: [
      'Standard vetting.',
      'Applicants should be at peace with writing material that is accurate but not complete. It is the nature of the role and it is stated here so that nobody is surprised in their second month.'
    ],
    postingDate: '2024-12-15'
  },
  {
    id: 'job-12',
    requisitionId: 'REQ-2025-0602',
    title: 'Drilling Engineer, Deep Construction',
    department: 'Subterranean Infrastructure & Station Operations (SISO)',
    location: 'Sub-Basin Containment Facility (Site 19, Utah)',
    clearanceRequired: 'Level 3 - Secret',
    salaryRange: '$130,000 - $165,000 USD + Hazardous Duty Differential',
    overview:
      'Heavy drilling and shaft construction in a live underground facility: new galleries, foundation work, and the sealing of openings that have already been drilled. Work is performed on a two-week rotation on site with accommodation provided. Site 19 is a mine in all but name; the safety standard is better than the industry and the paperwork is worse.',
    responsibilities: [
      'Operate and maintain the drill rigs and support the shotcrete and liner crews.',
      'Follow the ground control plan exactly and stop work when the ground disagrees with the plan, which it does.',
      'Maintain drilling records; the geological logging we ask for is more detailed than elsewhere and is used by other departments.',
      'Assist the vault team with sealing work on completed openings.'
    ],
    qualifications: [
      'Mining or tunnelling background with a documented deep shaft record.',
      'Current certifications for the plant operated, or a clear pathway to them.',
      'Willingness to work in heat and in conditions where the ventilation is engineered rather than natural.'
    ],
    psychologicalRequirements: [
      'Fitness for underground work, including respirator use and confined space.',
      'Applicants are advised that some areas of the facility are restricted. Curiosity about restricted areas is the single most common reason people are dismissed from this site, and the second most common reason people are promoted.'
    ],
    postingDate: '2025-01-22'
  }
];
