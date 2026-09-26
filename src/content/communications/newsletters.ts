import type { Newsletter } from '@/types';

export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'news-01',
    issueNumber: 'VOL-44-ISS-02',
    title: 'Paradigms Horizon // Q1 2025: Harmonizing the Century',
    publicationDate: '2025-01-15',
    volumeName: 'Internal Global Staff Publication (London / Rosslyn / Tokyo / Svalbard)',
    leadArticle: {
      headline: 'Tower Obsidian Achieves 99.8% Ambient Harmonic Synchronization',
      content:
        'Following the installation of our second-generation passive Helmholtz resonators across Floors 20 through 50, Tower Obsidian London has achieved the lowest measured internal acoustic turbulence in corporate real estate history. Staff are reminded that the gentle low-frequency oscillation perceptible in Sub-Basement 3 is a normal component of our structural anti-resonance dampers and poses zero biological risk when wearing standard Level 2 ear protection.'
    },
    secondaryArticles: [
      {
        headline: 'Site 19 Sub-Level 6 Structural Grouting Complete',
        content:
          'Chief Engineer Sarah Lin and the SISO team have finalized the annual acoustic sealing of Chamber 04 in Utah. Over 40,000 tons of high-density polymer grout were successfully injected into the bedrock perimeter, maintaining our 32.4Hz heavy containment envelope.'
      },
      {
        headline: 'Reminder: Mandatory Annual Cognitive Stability Diagnostics',
        content:
          'All personnel holding Level 3 Secret clearance or above must complete their online Cognitive Stability Diagnostic with the BECM Directorate before February 28. Failure to complete the evaluation will result in automatic temporary suspension of cafeteria and elevator bypass privileges.'
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Soraya Morales (Atacama Trench Station 05)',
      role: 'Lead Infrasonic Cartographer',
      quote:
        '"Working at 4,800 meters elevation in the Atacama Desert teaches you that silence is never truly empty. The atmosphere is always humming; you just have to know which harmonics belong to the Earth and which belong to us."'
    },
    cafeteriaSpecial:
      'Tuesday: Cold-Smoked Atlantic Cod with Dill Potatoes (Tower Obsidian Level -1) | Daily: Complimentary Electrolyte Recovery Broth (Yellowknife Lab)',
    safetyNotice:
      'SAFETY REMINDER 44-B: Do not attempt to sleep inside the Sub-Basement 5 mechanical rooms. Prolonged exposure to unsynchronized HVAC carrier harmonics may cause temporary disorientation regarding calendar dates.'
  },
  {
    id: 'news-02',
    issueNumber: 'VOL-43-ISS-04',
    title: 'Civic Pulse // Winter 2024: Demographic Resilience in Action',
    publicationDate: '2024-11-20',
    volumeName: 'Division of Civic Continuity & Demographic Resilience Bulletin',
    leadArticle: {
      headline: 'Swiss Alps Redoubt Completes 720-Day Hydroponic Seed Vault Stocking',
      content:
        'Director Mara Finch announced this week that the Grimsel Pass subterranean complex has achieved 100% capacity in all critical life-support consumables. The facility’s closed-loop nitrogen and oxygen scrubbers have been tested to support 10,000 enrolled Heritage Cohort members for two full years of total isolation.'
    },
    secondaryArticles: [
      {
        headline: 'Project Echo-State Expands to 12 Global Twin Cities',
        content:
          'Dr. Evelyn Reed’s chronological simulation team has completed synthetic digital twin models of Chicago, Seoul, and Frankfurt. The models accurately predicted transit foot-traffic patterns during last month’s rail strikes with 94.2% precision.'
      },
      {
        headline: 'New Bio-Harmonic Ear-Drop Dispensers Installed at Polar Stations',
        content:
          'Yellowknife Lab has shipped 500 units of Compound 88-T pharmaceutical drops to Station 07 (Svalbard) and Station 17 (Tiksi). Staff experiencing persistent 14.8Hz phantom hums should apply two drops prior to sleep.'
      }
    ],
    employeeSpotlight: {
      name: 'Niall O’Connor (Tower Obsidian Facilities)',
      role: 'Sub-Basement Maintenance Supervisor',
      quote:
        '"People ask me why I wear heavy earmuffs even when the HVAC chillers are turned off. When you work next to the bedrock dampeners, you learn that the ground is always talking."'
    },
    cafeteriaSpecial:
      'Thursday: Braised Alpine Beef with Polenta (Grimsel Pass Redoubt) | Note: All dairy products in Swiss bunkers are pasteurized and gamma-irradiated for 20-year shelf life.',
    safetyNotice:
      'CLASSIFIED PROTOCOL REMINDER: Whistleblower tip lines are monitored 24/7. Any staff member observed photographing server hardware or taking physical notes in Microfilm Room 2 will be escorted to Medical for evaluation.'
  },
  {
    id: 'news-03',
    issueNumber: 'VOL-42-ISS-01',
    title: 'The Acoustic Perimeter // Special Technical Edition 2024',
    publicationDate: '2024-06-10',
    volumeName: 'PEFD & ASIAN Joint Technical Journal',
    leadArticle: {
      headline: 'Planetary Infrasound Baseline Approaches 15.0Hz Milestone',
      content:
        'Data collected across all 22 global monitoring stations indicates that the subterranean 14.8Hz baseline carrier has experienced a subtle 0.05% frequency drift toward 15.000 Hz. Dr. Henrik Lindqvist noted that while the shift is mathematically minute, it increases the acoustic coupling efficiency between the Earth’s mantle and high-voltage surface power grids.'
    },
    secondaryArticles: [
      {
        headline: 'Azores Seabed Hydrophone Node 14 Upgraded with Sapphire Transducers',
        content:
          'Kasper Vang and the Atlantic oceanographic team replaced the deep-water pressure sensors along the Mid-Atlantic Ridge at 3,200 meters depth. The new transducers offer sub-millihertz frequency resolution.'
      },
      {
        headline: 'Project Cicada Highway Grid Extended Along UK Motorways',
        content:
          'Piezoelectric road sensors embedded along the M1 motorway are now harvesting tire vibration energy to power passive 14.8Hz re-radiators, creating smooth cognitive entrainment corridors for freight haulers.'
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Clara Zimmerman (Black Ridge Station 16)',
      role: 'Lead Infrasonic Resonance Analyst',
      quote:
        '"The coal seams in West Virginia act like giant organ pipes. When you pump fluid down into the deep fissures, the mountain sings in pure perfect fifths."'
    },
    cafeteriaSpecial:
      'Wednesday: Appalachian Smoked Trout with Sweet Cornbread (Black Ridge Station) | Friday: Salmon Poke Bowls with Seaweed Salad (Tokyo Chiyoda Tower)',
    safetyNotice:
      'ACOUSTIC HYGIENE BULLETIN: If you hear a rhythmic three-tone chime inside your domestic landline or mobile phone when no call is incoming, hang up immediately and submit your handset to TOPN Security for de-gaussing.'
  },
  {
    id: 'news-04',
    issueNumber: 'VOL-41-ISS-03',
    title: 'Continuity Weekly // Q3 2023: Sovereign Advisory Highlights',
    publicationDate: '2023-09-01',
    volumeName: 'Executive Governance & Special Projects Unit Dispatch',
    leadArticle: {
      headline: 'GPC Signs Landmark £2.4 Billion Sovereign Resilience Pact',
      content:
        'Executive Vice President Helena Vance-Cross confirmed the signing of a comprehensive 10-year demographic continuity and urban frequency harmonization agreement with three G7 sovereign ministries. Under the pact, GPC will provide predictive civic modeling and municipal background noise management across 28 metropolitan centers.'
    },
    secondaryArticles: [
      {
        headline: 'Postojna Caverns Completes 100% Digital Document Hash Re-Indexing',
        content:
          'Senior Curator Cassian Drake reported that all legacy files dating from 1971 to 1999 have been re-encoded with dynamic SHA-256 validation trees. Any external alteration or unauthorized screenshot attempt automatically triggers cryptographic pixel scrambling.'
      },
      {
        headline: 'New Helmholtz Resonator Installation at Tokyo Deep Tower',
        content:
          'The Chiyoda facility has completed the installation of five-story vertical acoustic baffles along its elevator shafts, dampening seismic vibrations from the Tokyo Bay fault corridor.'
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Brigitte Laroche (Tokyo Chiyoda Deep Tower)',
      role: 'Senior Quantitative Behavioral Analyst',
      quote:
        '"Human crowds behave remarkably like acoustic waveforms. When you introduce the correct phase-canceling frequency into a transit station, social friction simply dissolves."'
    },
    cafeteriaSpecial:
      'Monday: Tonkotsu Ramen with Marinated Soft-Boiled Egg (Chiyoda B3 Dining) | Daily: Sugar-Free Nootropic Matcha Lattes available at all executive refreshment kiosks.',
    safetyNotice:
      'SECURITY ALERT: Unauthorized access to the legacy `/terminal` backdoor on the corporate intranet will result in immediate IP logging and mandatory security review with Agent Felix Mercer.'
  },
  {
    id: 'news-05',
    issueNumber: 'VOL-40-ISS-02',
    title: 'Paradigms Horizon // Summer 2022: Post-Pandemic Harmony',
    publicationDate: '2022-07-20',
    volumeName: 'Internal Global Staff Publication',
    leadArticle: {
      headline: 'Cellular Carrier Acoustic Synchronization Boosts Public Calm by 31.4%',
      content:
        'A comprehensive study published by the BECM Directorate demonstrates that subtle low-frequency acoustic cues delivered through standard smartphone speaker coils during municipal emergency alerts significantly reduced public panic and impulsive civil assembly across tested pilot cities.'
    },
    secondaryArticles: [
      {
        headline: 'Yellowknife Bio-Harmonic Lab Announces Compound 88-T Clinical Success',
        content:
          'Dr. Marcus Vance-Saito confirmed that clinical trials of our proprietary Compound 88-T ear drops achieved a 98% resolution rate for research personnel suffering from persistent infrasonic auditory phantom perceptions.'
      },
      {
        headline: 'Atacama Trench Station 05 Sets High-Altitude Telemetry Record',
        content:
          'The Chilean observatory achieved 4,000 consecutive hours of uninterrupted stratospheric microbarometer tracking, charting planetary acoustic ducting across the South Pacific.'
      }
    ],
    employeeSpotlight: {
      name: 'Diego Ramirez (Atacama Trench Station 05)',
      role: 'Station Superintendent',
      quote:
        '"At 4,800 meters, the air is thin and the stars don’t twinkle—they vibrate. You can see the sound waves bending the light in the telescopes if you look carefully."'
    },
    cafeteriaSpecial:
      'Tuesday: Pastel de Choclo with Chilean Empanadas (Atacama Station) | Thursday: Traditional Roast Beef with Yorkshire Pudding (Tower Obsidian)',
    safetyNotice:
      'FACILITY WARNING: Do not attempt to adjust the manual pressure valves on the Sub-Level 4 cryogenic cooling lines at any field station. Cryogenic helium burns require immediate Yellowknife medical evacuation.'
  },
  {
    id: 'news-06',
    issueNumber: 'VOL-39-ISS-04',
    title: 'Civic Pulse // Winter 2021: 50 Years of Pre-emptive Certainty',
    publicationDate: '2021-12-10',
    volumeName: 'Commemorative Golden Jubilee Staff Issue (1971-2021)',
    leadArticle: {
      headline: 'Dame Eleanor Cross Addresses Global Staff on Five Decades of GPC Excellence',
      content:
        'In a live encrypted broadcast from the Swiss Alps Redoubt, Co-Founder Dame Eleanor Cross reflected on the journey from a modest Cambridge seminar room in 1971 to the world’s leading continuity architecture corporation. "We were told that human history was chaotic and uncontrollable. We proved that with the correct acoustic and demographic leverage, certainty is not only possible—it is inevitable."'
    },
    secondaryArticles: [
      {
        headline: 'Historical Retrospective: From Paradigms Systems to Global Paradigms',
        content:
          'An illustrated 8-page retrospective detailing our expansion across 22 field stations, the construction of Site 19, and the pioneering work of our early acoustic engineering teams.'
      },
      {
        headline: 'Executive Bonus Allocation & Heritage Enrollment Milestone',
        content:
          'The Board of Directors has authorized a special 50th Anniversary Golden Jubilee dividend and confirmed the enrollment of the 8,000th member of the Tier-1 Heritage Cohort.'
      }
    ],
    employeeSpotlight: {
      name: 'Chief Engineer Sarah Lin (Site 19, Utah)',
      role: 'Chief Engineer, Subterranean Infrastructure',
      quote:
        '"Fifty years of digging deep into the crust has taught us one thing: the Earth has a heartbeat, and Global Paradigms Corp. knows how to keep it in time."'
    },
    cafeteriaSpecial:
      'Friday: Golden Jubilee Banquet Roast with Champagne Sorbet (Available across all 22 global cafeteria hubs) | Vegetarian: Truffled Wild Mushroom Risotto',
    safetyNotice:
      'GENERAL REMINDER: Staff are prohibited from discussing internal project code names (Vesper, Boreas, Hypnos, Palimpsest) with family members or external financial contacts. All email correspondence is archived perpetually.'
  }
];
