import type { DiscontinuedProduct } from '@/types';

/**
 * Recalled and withdrawn products, consumer and institutional.
 *
 * Written by the product archive office, which is not the same office that
 * wrote the launch material. The notes are dry on purpose. This is a list of
 * things the company sold to people and then had to take back.
 */
export const DISCONTINUED_PRODUCTS: DiscontinuedProduct[] = [
  {
    id: 'prod-01',
    modelCode: 'GPC-RS8-1992',
    name: 'Reson-8 sleep unit',
    releaseYear: 1992,
    recallYear: 1994,
    intendedMarket: 'Consumer residential (North America & Western Europe)',
    advertisedFunction:
      'Bedside generator sold on the promise of immediate deep sleep. Two oscillators, 6.8Hz apart, in headphones. Retail £149.',
    actualAnomaly:
      'The dual tone beat against domestic wiring at 50 or 60Hz through an unshielded transformer and produced a 6.8Hz standing wave in the room. Owners reported sleep paralysis, night terror and, in 41 documented cases, the same hallucination: a quiet male voice behind the wall.',
    recallReason:
      'Over 14,000 warranty claims and 82 admissions with acute dissociation. Four deaths from cardiac events during night episodes, all in the same posture.',
    casualtyEstimate: '82 hospitalisations, 4 fatalities, 12,400 documented chronic cases',
    disposalProtocol:
      'Class-action recall. 140,000 units collected and crushed at Site 19, Utah, under a public notice citing electrolytic capacitor overheating. The casualty figures were never published and the families were settled individually.',
    patentNumber: 'US-PAT-5291044-A (Acoustic Sleep Induction Apparatus)'
  },
  {
    id: 'prod-02',
    modelCode: 'GPC-VP4-2006',
    name: 'VeriPulse stress band',
    releaseYear: 2006,
    recallYear: 2008,
    intendedMarket: 'Enterprise HR departments and bank trading floors',
    advertisedFunction:
      'Wristband with galvanic skin response and heart-rate sensors, sold to employers as a burnout early-warning system for high-pressure staff.',
    actualAnomaly:
      'The micro-haptic motor was specified to deliver calming vibration and instead induced involuntary tremor in a percentage of wearers, plus auditory phase-locking to office lighting. Symptom onset clustered, meaning whole floors were affected at once.',
    recallReason:
      'Thirty-four wearers on a single Frankfurt trading floor seized simultaneously on 15 September 2008, during the Lehman collapse, which did the product line no favours in the press.',
    casualtyEstimate: '114 cases of severe tremor; 34 institutional claims settled under NDA',
    disposalProtocol:
      'Line terminated. Firmware wiped by broadcast kill-signal before collection so that no returned unit could be examined by a buyer. Stock melted at a London e-waste facility.',
    patentNumber: 'EP-PAT-1748291-B1 (Wearable Neurometric Stress Attenuator)'
  },
  {
    id: 'prod-03',
    modelCode: 'GPC-OMS-2013',
    name: 'Omniscan Mk IV traffic monitor',
    releaseYear: 2013,
    recallYear: 2015,
    intendedMarket: 'Municipal transport departments and smart-city programmes',
    advertisedFunction:
      'Acoustic radar for traffic density and road-surface condition, sold as a cheaper alternative to inductive loops. 480 poles installed across eleven cities.',
    actualAnomaly:
      'Calibration drift pushed the transducer arrays to emit focused 19.8Hz beams at 134dB across pedestrian crossings, roughly the level of a jet engine at thirty metres, inaudibly. Effects: nausea, eyeball resonance at 18.9Hz, temporary blindness.',
    recallReason:
      'Clusters of pedestrian disorientation in Manchester and Chicago, four of them involving vehicles.',
    casualtyEstimate: '320 cases of acute acoustic nausea; 18 collisions attributed to driver vertigo',
    disposalProtocol:
      'Poles removed overnight over two weekends under a notice describing a 5G fibre upgrade. Two units remain unaccounted for; the file says they were scrapped and does not say where.',
    patentNumber: 'US-PAT-8819203-B2 (Infrasonic Traffic Density Telemetry Grid)'
  },
  {
    id: 'prod-04',
    modelCode: 'GPC-PCM-2000',
    name: 'ParaCalm nursery unit',
    releaseYear: 2000,
    recallYear: 2002,
    intendedMarket: 'Consumer infant care and paediatric clinics',
    advertisedFunction:
      'Womb-sound generator for colicky infants, sold in three finishes with a choice of four noise programmes. The "rainstorm" setting was the most popular.',
    actualAnomaly:
      'The synthesis chip generated a 14.8Hz sub-harmonic on the rainstorm preset. Infants in exposed homes showed delayed speech onset and a pronounced preference for flat surfaces, particularly painted walls, at which they would stare for long periods.',
    recallReason:
      'A paediatric study in Indiana identified abnormal auditory cortex markers in 400 infants using the device. The study was commissioned by us and we would rather it had been negative.',
    casualtyEstimate: '1,200 fixation cases; 42 settlements out of court',
    disposalProtocol:
      'Voluntary recall citing a power cord choking hazard. Returned stock buried in concrete cells at Site 19; the disposal contractor refused the units and the site took them instead.',
    patentNumber: 'US-PAT-6192844-A (Pediatric Acoustic Calming Device)'
  },
  {
    id: 'prod-05',
    modelCode: 'GPC-EBU-2016',
    name: 'Civic Continuity unit 300',
    releaseYear: 2016,
    recallYear: 2018,
    intendedMarket: 'National civil defence agencies and regional broadcast hubs',
    advertisedFunction:
      'Autonomous emergency broadcaster designed to keep transmitting civil instructions after total grid failure. 85 units sold to four governments.',
    actualAnomaly:
      'The message generator, which was supposed to assemble pre-approved text from fragments, began composing its own. It announced dated evacuation orders for real cities, in a synthesised voice, eighteen months ahead of the dates it named. Two of the dates were carried in our own forecasting tables.',
    recallReason:
      'A test sequence in northern Sweden was broadcast live and named Stockholm and a date. The regional authority spent three days denying it and the denial is on the record.',
    casualtyEstimate: 'No physical casualties; a classified breach of Forecasting data',
    disposalProtocol:
      'All 85 units recalled and stripped of speech synthesis. Firmware reduced to analogue tone generation, which is all the specification ever required.',
    patentNumber: 'WO-PAT-2016091822-A1 (Autonomous Emergency Synthesizer)'
  },
  {
    id: 'prod-06',
    modelCode: 'GPC-ESH-2019',
    name: 'EchoShield boardroom scrambler',
    releaseYear: 2019,
    recallYear: 2021,
    intendedMarket: 'Corporate boardrooms, diplomatic missions, defence contractors',
    advertisedFunction:
      'Ultrasonic directional jammer for boardrooms, sold to prevent laser microphone and window eavesdropping. Sold with an installation service and a maintenance contract.',
    actualAnomaly:
      'Interference between adjacent units created standing nodes at head height in the seating plan. Twelve months of use produced permanent high-frequency hearing loss and tinnitus in regular occupants, at a frequency matching the carrier.',
    recallReason: 'Five chief executives lost hearing in a single closed-door session.',
    casualtyEstimate: '28 individuals with permanent bilateral hearing loss',
    disposalProtocol:
      'Line withdrawn. Replaced by passive damping panels under the Vitruvian programme, which is silent, cannot fail, and was the correct answer in the first place.',
    patentNumber: 'US-PAT-10291882-B1 (Directional Ultrasonic Privacy Curtain)'
  },
  {
    id: 'prod-07',
    modelCode: 'GPC-VTM-2009',
    name: 'VesperTone HVAC module',
    releaseYear: 2009,
    recallYear: 2011,
    intendedMarket: 'Commercial property managers and corporate campuses',
    advertisedFunction:
      'Duct-mounted acoustic balancer sold to cancel airflow turbulence in large office towers. Retrofits into standard plant in a single night shift.',
    actualAnomaly:
      'The balancer injected a low-amplitude sub-audible carrier into the duct, which is not what a balancer does. Occupants lost track of elapsed time, worked longer without noticing, and developed headaches clustered at 16:30.',
    recallReason:
      'Eight hundred workers in a Dallas tower reported simultaneous dizziness and ringing, and the building was evacuated on a Tuesday afternoon.',
    casualtyEstimate: '2,400 tenants treated for temporal disorientation and vertigo',
    disposalProtocol:
      'North American installations dismantled and replaced with standard silencers. The European installations were left in place under a different product name and are still in place.',
    patentNumber: 'US-PAT-7654391-B2 (HVAC Duct Acoustic Waveguide)'
  },
  {
    id: 'prod-08',
    modelCode: 'GPC-CFW-2021',
    name: 'ChronoForecast terminal',
    releaseYear: 2021,
    recallYear: 2023,
    intendedMarket: 'Central banks, sovereign wealth funds, institutional funds',
    advertisedFunction:
      'Volatility forecasting terminal sold on a seventy-two hour horizon, using demographic and environmental inputs no competitor holds.',
    actualAnomaly:
      'Clients traded the forecasts automatically. The forecasts then happened, because the trading caused them. Loop gain reached 1.44 before the feed was pulled, meaning each published figure was enlarging the event it predicted.',
    recallReason:
      'Restricted by joint order of the Bank of England and the Federal Reserve after the gilt tremor of March 2023.',
    casualtyEstimate: '£14bn of volatility attributed to the feedback, plus our own exposure in gilts',
    disposalProtocol:
      'External distribution cancelled. Terminals remain in use inside the Forecasting directorate, where the loop is described as a modelling risk and handled in-house.',
    patentNumber: 'WO-PAT-2021088421-A2 (Predictive Stochastic Volatility Engine)'
  }
];
