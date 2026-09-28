import type { TrainingModule } from '@/types';

/**
 * Mandatory e-learning modules from the internal induction portal.
 *
 * House style: the course text is written by the directorate that owns the
 * risk, the safety line is written by Legal, and the quiz is written by
 * whoever drew the short straw. The material is meant to read as something
 * staff click through on a Friday afternoon.
 */
export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'train-01',
    moduleCode: 'MOD-101',
    title: 'Principles of Pre-emptive Certainty & Non-Linear Forecasting',
    departmentCode: 'SFPC',
    estimatedMinutes: 25,
    overview:
      'Induction module, all staff, to be completed in the first two weeks. Explains what the forecasting desk does, why the numbers are not shown to clients in raw form, and where the panic feedback loop sits in the process.',
    sections: [
      {
        title: '1. Why the Model Works At All',
        text: 'The common assumption is that a society under stress behaves unpredictably. It does not. At population scale, with the noise averaged out, behaviour follows low-frequency cycles that can be measured, and once measured, forecast. The desk has run this against four decades of unrest records and the error is small. Please note that the model is good at telling you what a population will do and poor at telling you why, and that this distinction matters when you write to a client.',
        safetyGuideline:
          'Raw probabilistic forecasts are never sent to uncleared municipal officials. Present projections as routine demographic capacity planning.'
      },
      {
        title: '2. Acting Before the Event Exists',
        text: 'An intervention made after the crowd has formed is a policing cost. An intervention made four days earlier, delivered through lighting, transport or the sound of a street, is an infrastructure cost and appears in no minutes at all. This is the principle you are being asked to accept as an employee: the company does not defeat disturbances, it arranges for them not to occur. Colleagues who have difficulty with that sentence should raise it with their line manager, who will have heard it before.',
        safetyGuideline:
          'Predictive tables and client-facing narrative are kept on separate systems. Do not cross-reference them in correspondence.'
      },
      {
        title: '3. Cognitive Elasticity',
        text: 'Elasticity is the capacity of a population to absorb a shock without ceasing to trust the institutions above it. Pupils in Chime schools and commuters on Vesper routes have measurably more of it. Whether that capacity was earned or installed is not a question this module answers, and it is not a question for the induction quiz.',
        safetyGuideline:
          'Report any personal sense of temporal displacement, intrusive humming or unaccountable dread to the department hygiene officer. This is a welfare route.'
      }
    ],
    quiz: [
      {
        question: 'According to the module, why does population behaviour appear unpredictable?',
        options: [
          'Because the underlying cycles have not been measured at sufficient scale',
          'Because human beings have free will and history is random',
          'Because solar activity disturbs the measurement',
          'Because municipal records are unreliable'
        ],
        correctIndex: 0,
        explanation:
          'At population scale the behaviour resolves into low-frequency cycles; the apparent randomness is a measurement problem.'
      },
      {
        question: 'When is an intervention made under the Pre-emptive Certainty framework?',
        options: [
          'After the crowd has formed, to minimise cost',
          'Days before the disturbance coheres in public sentiment',
          'Only after ministerial approval is published',
          'At the same time as the public announcement'
        ],
        correctIndex: 1,
        explanation:
          'Interventions are placed before an event exists, at the infrastructure stage rather than the policing stage.'
      },
      {
        question: 'How is raw predictive data presented to a municipal client?',
        options: [
          'In full, for transparency',
          'As routine demographic capacity planning',
          'Not at all, under any circumstances',
          'As a verbal briefing only, with no document'
        ],
        correctIndex: 1,
        explanation:
          'The standing instruction is to present projections as capacity planning; raw collapse models remain internal.'
      }
    ],
    certificationTitle: 'Certified Pre-emptive Certainty Practitioner (Level 1)'
  },
  {
    id: 'train-02',
    moduleCode: 'MOD-204',
    title: 'Acoustic Hygiene & Ear-Dampener Protocols in Sub-Surface Workstations',
    departmentCode: 'BHRR',
    estimatedMinutes: 30,
    overview:
      'Mandatory for all engineering and scientific staff posted to Site 19, Station 07, Postojna, Grimsel and Tiksi. Covers the use of Class-A ear protection, Compound 88-T dosing, and what to do when a colleague starts describing the walls.',
    sections: [
      {
        title: '1. What You Are Working Next To',
        text: 'The containment plant at a deep station runs between 14.8Hz and 32.4Hz at amplitudes that do not register as sound. You will not hear it. You may feel it through the floor, or in your teeth, or as a pressure behind the eyes. Vascular micro-vibration and eyeball resonance at 18.9Hz are documented effects and are the reason for the ear protection rule rather than any hearing risk.',
        safetyGuideline:
          'Class-A ear dampeners at all times below Sub-Level 2. This includes short visits and includes visitors.'
      },
      {
        title: '2. The Three Stages',
        text: 'Exposure without protection follows a course that every field officer is expected to recognise in others, and typically not in themselves:\n- Stage 1: fullness in both ears, metallic taste, the impression of humming inside a wall.\n- Stage 2: loss of the need to sleep, waking dreams of black geometric shapes, uncertainty about the day of the week.\n- Stage 3: involuntary humming in fifths, speech in no known language, and a stated wish to remove the ear dampeners in order to hear the rock properly.',
        safetyGuideline:
          'Any colleague at Stage 2 is stood down immediately and walked to the medical bay by two people.'
      },
      {
        title: '3. Compound 88-T',
        text: 'A neuro-otological suspension issued by the clinic. It steadies the hair cells and holds off theta entrainment for about twelve hours. Two drops per ear before entering a containment chamber, or after any suspected transducer leak. The drops taste of salt and there is nothing to be done about that.',
        safetyGuideline:
          'Maximum four drops in twenty-four hours. Temporary flattening of high frequencies is expected and resolves.'
      }
    ],
    quiz: [
      {
        question: 'Which protection is required below Sub-Level 2?',
        options: [
          'Foam plugs from the supply closet',
          'Class-A active-cancelling ear dampeners',
          'A winter balaclava and goggles',
          'None, provided the room is quiet'
        ],
        correctIndex: 1,
        explanation:
          'Class-A dampeners are the specified protection below Sub-Level 2, for everyone including short visits.'
      },
      {
        question: 'Which of these is a Stage 2 indicator?',
        options: [
          'Cravings for spicy food',
          'Loss of sleep drive and waking dreams of geometric shapes',
          'Rapid nail growth',
          'Difficulty reading digital clocks'
        ],
        correctIndex: 1,
        explanation: 'Stage 2 is marked by insomnia, geometric waking dreams and uncertainty about the date.'
      },
      {
        question: 'What does Compound 88-T do?',
        options: [
          'Cleans earwax from company headsets',
          'Permanently reduces hearing',
          'Steadies the hair cells and holds off theta entrainment',
          'Improves treble response for music'
        ],
        correctIndex: 2,
        explanation:
          'It stabilises cochlear mechanics for roughly twelve hours and delays entrainment to the carrier.'
      }
    ],
    certificationTitle: 'Certified Sub-Surface Acoustic Hygiene Specialist (Level 2)'
  },
  {
    id: 'train-03',
    moduleCode: 'MOD-308',
    title: 'Protocol 9: Non-Auditory Perception & Temporal Displacement Guidelines',
    departmentCode: 'PEFD',
    estimatedMinutes: 35,
    overview:
      'Restricted module for field researchers and station managers. Standard procedure for clusters of direct cortical perception, subjective temporal dilation and radio reflections that arrive before they are transmitted.',
    sections: [
      {
        title: '1. Direct Cortical Perception',
        text: 'Where a high-power carrier meets dense granite or deep permafrost, the field can couple straight into the listener. Staff report whole sentences, counting, and organ chords, with no sound pressure anywhere in the room. It is telemetry arriving through the wrong door. It is not addressed to you and it does not become addressed to you because you answer it.',
        safetyGuideline:
          'Do not reply to, argue with, or take dictation from anything perceived in this way. Log it as signal.'
      },
      {
        title: '2. Temporal Dilation and Memory Drift',
        text: 'The 7.83Hz band interacts with hippocampal firing rates. A ten-minute sweep may present to the operator as several hours; the previous afternoon may be missing entirely. Neither experience is a symptom of illness and neither is reliable. The clock in the calibration room is the authority on what happened and when.',
        safetyGuideline:
          'Field logs are reconciled against atomic clock timestamps. Personal recollection is not a record.'
      },
      {
        title: '3. Cluster Response',
        text: 'If more than three people report the same phenomenon in the same hour:\n1. Shut down secondary transducer amplifiers within 500 metres.\n2. Play the 528Hz reset chime for ninety seconds.\n3. Move those affected to the damped Faraday room.\n4. Notify the nearest BHRR medical officer and raise a Morpheus entry.',
        safetyGuideline:
          'Do not discuss the content of a shared perception with colleagues who lack the clearance for the site.'
      }
    ],
    quiz: [
      {
        question: 'What is direct cortical perception, as defined here?',
        options: [
          'Telepathy between cleared staff',
          'Sound experienced inside the head with no measurable air pressure',
          'A fault in the intranet phone system',
          'Radio interference on handheld sets'
        ],
        correctIndex: 1,
        explanation:
          'It is field coupling directly into the auditory pathway with no acoustic pressure in the room.'
      },
      {
        question: 'How are event times recorded during a calibration sweep?',
        options: [
          'By wristwatch and recollection',
          'Against the atomic clock timestamps',
          'By the position of the sun',
          'By asking the nearest colleague afterwards'
        ],
        correctIndex: 1,
        explanation:
          'Atomic clock time is the only accepted record; subjective duration is unreliable in the affected band.'
      },
      {
        question: 'What is the first action on detecting a perception cluster?',
        options: [
          'Evacuate the site',
          'Power down secondary amplifiers, run the reset chime, isolate those affected',
          'Call the local news desk',
          'Increase broadcast power by 12dB'
        ],
        correctIndex: 1,
        explanation: 'Protocol 9 runs amplifier shutdown, the 528Hz chime and isolation before anything else.'
      }
    ],
    certificationTitle: 'Protocol 9 Field Operations Certified Operator (Level 3)'
  },
  {
    id: 'train-04',
    moduleCode: 'MOD-412',
    title: 'Whistleblower Identification & Information Containment Protocols',
    departmentCode: 'TOPN',
    estimatedMinutes: 20,
    overview:
      'Supervisory staff only. Behavioural indicators, exfiltration methods and the containment steps required under Palimpsest. This module was rewritten in 2020 and the earlier version has been withdrawn.',
    sections: [
      {
        title: '1. How a Leak Begins',
        text: 'Leaks do not begin with money. They begin with a member of staff who has read something they were not prepared for: a casualty schedule, a settlement figure, a borehole log with a human voice on it. The individual then behaves exactly as they always have for several weeks while deciding what to do, which is the window this module exists to identify.',
        safetyGuideline:
          'Note staff who become reluctant to sign the annual Section 4 renewal. Do not challenge them; report it.'
      },
      {
        title: '2. Indicators',
        text: 'Supervisors should read the following as a set rather than as single events:\n- Repeated terminal queries for Palimpsest, Oakhaven or Borehole 4.\n- Questions about the legal status or whereabouts of Dr Arthur Sedley or Dr Ewan Thorne.\n- Handwritten notes or personal cameras near the microfilm cabinets.\n- Moral objections raised, in any form, to a municipal tone trial.',
        safetyGuideline:
          'Two or more indicators together warrant a flag through the Behavioural Tracker. One indicator alone is a Monday morning.'
      },
      {
        title: '3. Containment',
        text: "On an active exfiltration:\n1. Revoke digital credentials and physical access at once, without notice.\n2. TOPN response team to seize local storage. The team is instructed to be courteous and to work in view of witnesses.\n3. Transfer the individual's authored records to AIRS for retroactive redaction and hash re-indexing.\n4. Refer the subject for clinical review. Memory remediation requires a director's signature and is not a supervisory decision.",
        safetyGuideline:
          'No supervisor confronts a suspected whistleblower alone. Coordination runs through TOPN security, duty officer, at any hour.'
      }
    ],
    quiz: [
      {
        question: 'What most often starts an internal leak?',
        options: [
          'Financial offers from competitors',
          'Ethical distress after reading unredacted casualty or trial records',
          'Boredom on a polar rotation',
          'Political ambition'
        ],
        correctIndex: 1,
        explanation: 'The pattern is exposure to unredacted material followed by weeks of ordinary behaviour.'
      },
      {
        question: 'Which is an authorised immediate step on discovering a leak?',
        options: [
          'Debating the employee in the canteen',
          'Revoking credentials, seizing local media, starting AIRS hash re-indexing',
          'Ignoring it below ten gigabytes',
          'Forwarding the files to HR by email'
        ],
        correctIndex: 1,
        explanation: 'Containment is credential revocation, media seizure and retroactive hash replacement.'
      },
      {
        question:
          "A colleague asks what happened to Dr Ewan Thorne's 2019 disclosures. What does the module require?",
        options: [
          'Answer from the public record',
          'Point them to the newspapers',
          'Flag it to TOPN and confirm the subject is classified under Directive 09',
          'Offer them a promotion'
        ],
        correctIndex: 2,
        explanation: 'The topic is classified under Directive 09 and the query itself is to be flagged.'
      }
    ],
    certificationTitle: 'Information Containment & Asset Protection Officer (Level 4)'
  }
];
