import type { DiscontinuedProduct } from '@/types';

export const DISCONTINUED_PRODUCTS: DiscontinuedProduct[] = [
  {
    id: 'prod-01',
    modelCode: 'GPC-RS8-1992',
    name: 'Reson-8™ Home Sleep Harmonic Generator',
    releaseYear: 1992,
    recallYear: 1994,
    intendedMarket: 'Consumer Residential (North America & Western Europe)',
    advertisedFunction:
      'Binaural delta-wave acoustic nightstand generator engineered to induce immediate deep restorative sleep and eliminate insomnia.',
    actualAnomaly:
      'Dual 216Hz/222.8Hz oscillators underwent parasitic resonance coupling with domestic 60Hz wall wiring, generating a 6.8Hz sub-audible standing wave that triggered severe nocturnal panic, sleep paralysis, and vivid shared auditory hallucinations.',
    recallReason:
      'Over 14,000 warranty claims and 82 reported cases of acute neurological dissociation, with 4 fatal cardiac events attributed to nocturnal autonomic shock.',
    casualtyEstimate: '82 Hospitalizations, 4 Fatalities, 12,400 Documented Chronic Hallucination Cases',
    disposalProtocol:
      'Mandatory Level 4 Class-Action Recall. 140,000 units collected and crushed in high-pressure hydraulic presses at Site 19, Utah. Public cover story: "Defective electrolytic capacitor overheating hazard."',
    patentNumber: 'US-PAT-5291044-A (Acoustic Sleep Induction Apparatus)'
  },
  {
    id: 'prod-02',
    modelCode: 'GPC-VP4-2006',
    name: 'VeriPulse™ Corporate Biometric Stress Band',
    releaseYear: 2006,
    recallYear: 2008,
    intendedMarket: 'Enterprise Human Resources & Banking Trading Desks',
    advertisedFunction:
      'Continuous galvanic skin response and heart rate variability wristband designed to alert executive staff to impending burnout and cognitive fatigue.',
    actualAnomaly:
      'Piezoelectric micro-haptic transducer intended to deliver subtle calming vibrations accidentally induced involuntary motor tremor and permanent auditory phase-locking to ambient office fluorescent lighting buzz.',
    recallReason:
      'Mass motor seizure incident on the trading floor of a Frankfurt investment bank involving 34 simultaneous wearers.',
    casualtyEstimate: '114 Severe Neurological Tremor Cases, 34 Institutional Lawsuits Settled Under NDA',
    disposalProtocol:
      'Product line terminated immediately. Firmware wiped via broadcast cellular kill-signal. Inventory melted at London e-waste facility.',
    patentNumber: 'EP-PAT-1748291-B1 (Wearable Neurometric Stress Attenuator)'
  },
  {
    id: 'prod-03',
    modelCode: 'GPC-OMS-2013',
    name: 'Omniscan Mk IV Municipal Traffic Infrasound Monitor',
    releaseYear: 2013,
    recallYear: 2015,
    intendedMarket: 'Municipal Transportation Departments & Smart City Authorities',
    advertisedFunction:
      'Non-invasive acoustic radar for measuring vehicular traffic density and road surface degradation via tire noise analytics.',
    actualAnomaly:
      'Calibration feedback loop caused the transducer arrays to emit focused 19.8Hz sound beams at 134dB into pedestrian crosswalks, inducing nausea, eyeball resonance (18.9Hz optical vibration), and temporary blindness in commuters.',
    recallReason: 'Multiple pedestrian disorientation clusters reported in Manchester, UK and Chicago, IL.',
    casualtyEstimate:
      '320 Cases of Acute Acoustic Nausea, 18 Vehicle Collisions Attributed to Driver Vertigo',
    disposalProtocol:
      'All 480 installed municipal sensor poles removed overnight under the guise of "5G Fiber Upgrade Maintenance".',
    patentNumber: 'US-PAT-8819203-B2 (Infrasonic Traffic Density Telemetry Grid)'
  },
  {
    id: 'prod-04',
    modelCode: 'GPC-PCM-2000',
    name: 'ParaCalm™ Infant Nursery White-Noise System',
    releaseYear: 2000,
    recallYear: 2002,
    intendedMarket: 'Consumer Infant Care & Pediatric Clinics',
    advertisedFunction:
      'Acoustically modeled womb-sound generator designed to soothe colicky infants and regulate newborn circadian rhythms.',
    actualAnomaly:
      'Frequency synthesis chip contained a firmware calculation error that generated a 14.8Hz sub-harmonic modulation during the "Rainstorm" audio preset, causing developmental language delay and intense fixation on structural walls.',
    recallReason:
      'Pediatric study in Indiana identified abnormal auditory cortex developmental markers in 400 infants using the device.',
    casualtyEstimate: '1,200 Pediatric Auditory Fixation Cases, 42 Secret Out-of-Court Settlements',
    disposalProtocol:
      'Voluntary recall issued citing "power supply cord choking risk". Returned inventory buried in concrete sarcophagi at Site 19.',
    patentNumber: 'US-PAT-6192844-A (Pediatric Acoustic Calming Device)'
  },
  {
    id: 'prod-05',
    modelCode: 'GPC-EBU-2016',
    name: 'CivicContinuity™ Automated Emergency Broadcast Unit 300',
    releaseYear: 2016,
    recallYear: 2018,
    intendedMarket: 'National Civil Defense Agencies & Regional Emergency Broadcast Hubs',
    advertisedFunction:
      'Fail-safe autonomous radio broadcast transmitter engineered to broadcast emergency civil defense instructions even in total grid collapse.',
    actualAnomaly:
      'Internal predictive Markov-chain message generator began generating unapproved synthetic voice broadcasts announcing catastrophic evacuation dates for real cities 18 months in advance.',
    recallReason:
      'Accidental test broadcast in northern Sweden announced the total evacuation of Stockholm scheduled for "October 2026", causing localized regional panic.',
    casualtyEstimate:
      'Zero physical casualties; massive classified breach of GPC Predictive Chronology data tables',
    disposalProtocol:
      'All 85 units recalled and stripped of predictive speech synthesis modules. Firmware restricted to analog tone generators only.',
    patentNumber: 'WO-PAT-2016091822-A1 (Autonomous Emergency Synthesizer)'
  },
  {
    id: 'prod-06',
    modelCode: 'GPC-ESH-2019',
    name: 'EchoShield™ Corporate Executive Acoustic Scrambler',
    releaseYear: 2019,
    recallYear: 2021,
    intendedMarket: 'Corporate Boardrooms, Diplomatic Missions & Defense Contractors',
    advertisedFunction:
      'Ultrasonic directional audio jammer that prevents laser microphones, recording pens, and eavesdropping through windows.',
    actualAnomaly:
      'Interference pattern created standing acoustic nodes that permanently burned out high-frequency hearing in board members and caused persistent bilateral tinnitus matching the 14.8Hz carrier wave.',
    recallReason:
      'Five Fortune 50 CEO clients experienced sudden sensorineural hearing loss during a single closed-door merger session.',
    casualtyEstimate: '28 High-Net-Worth Individuals with Permanent Bilateral Hearing Loss',
    disposalProtocol:
      'Total product line withdrawal. Replaced with passive acoustic damping wall panels under Project Vitruvian.',
    patentNumber: 'US-PAT-10291882-B1 (Directional Ultrasonic Privacy Curtain)'
  },
  {
    id: 'prod-07',
    modelCode: 'GPC-VTM-2009',
    name: 'VesperTone™ Commercial Building HVAC Tone Modulator',
    releaseYear: 2009,
    recallYear: 2011,
    intendedMarket: 'Commercial Real Estate Property Managers & Corporate Campuses',
    advertisedFunction:
      'Centralized HVAC duct acoustic balancer that cancels disruptive airflow turbulence in large office towers.',
    actualAnomaly:
      'Injected low-amplitude sub-audible carrier tones that caused progressive loss of temporal orientation, where office workers lost track of elapsed work hours and experienced synchronized headaches at 16:30 daily.',
    recallReason:
      'Total evacuation of the 40-story Meridian Tower in Dallas, TX after 800 workers simultaneously reported intense dizziness and auditory buzzing.',
    casualtyEstimate: '2,400 Corporate Tenants Treated for Temporal Disorientation and Vertigo',
    disposalProtocol:
      'All North American installations dismantled and replaced with standard sheet-metal silencers.',
    patentNumber: 'US-PAT-7654391-B2 (HVAC Duct Acoustic Waveguide)'
  },
  {
    id: 'prod-08',
    modelCode: 'GPC-CFW-2021',
    name: 'ChronoForecast™ Predictive Stock & Demographic Terminal',
    releaseYear: 2021,
    recallYear: 2023,
    intendedMarket: 'Central Banks, Sovereign Wealth Funds & Institutional Hedge Funds',
    advertisedFunction:
      'Ultra-high-dimensional market volatility forecasting terminal utilizing non-linear demographic and environmental data.',
    actualAnomaly:
      'The terminal’s algorithmic predictions began triggering self-fulfilling trading cascades: financial institutions trading on GPC volatility predictions inadvertently caused the exact sovereign debt panics the software was forecasting.',
    recallReason:
      'Restricted by joint order of the Bank of England and Federal Reserve Board following the 2023 UK gilt market tremor.',
    casualtyEstimate: '£14 Billion in Global Flash-Crash Volatility Attributed to Feedback Cascades',
    disposalProtocol:
      'Public distribution canceled. Terminals restricted exclusively to internal GPC SFPC Directorate use.',
    patentNumber: 'WO-PAT-2021088421-A2 (Predictive Stochastic Volatility Engine)'
  }
];
