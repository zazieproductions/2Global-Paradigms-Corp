import type { Newsletter } from '@/types';

/**
 * Internal staff bulletins.
 *
 * House style: in-house newsletters are written badly and in a hurry, by
 * whoever was asked. Keep the canteen notes and the safety reminders — they
 * are the only honest part of the format.
 */
export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'news-01',
    issueNumber: 'VOL-44-ISS-02',
    title: 'Paradigms Horizon // Q1 2025: Harmonizing the Century',
    publicationDate: '2025-01-15',
    volumeName: 'Internal Global Staff Publication (London / Rosslyn / Tokyo / Svalbard)',
    leadArticle: {
      headline: 'Tower Obsidian dampening upgrade complete, floors 20-50',
      content:
        'The second-generation passive resonators were signed off on 9 January and the building is now running quieter than at any point since 2016. The low oscillation some colleagues have noticed in Sub-Basement 3 is a normal part of the damper cycle and is not a fault. Anyone experiencing headaches or a metallic taste should contact Occupational Health rather than Facilities: the two desks have different reporting requirements and the paperwork matters.'
    },
    secondaryArticles: [
      {
        headline: 'Site 19 sealing work finished',
        content:
          'Sarah Lin and the SISO team completed the annual acoustic sealing of Chamber 04 in Utah before Christmas, with 40,000 tons of polymer grout pumped into the bedrock perimeter. The containment envelope is stable. The crew would like it noted that they worked through the holiday period, again.'
      },
      {
        headline: 'Cognitive stability diagnostic - deadline 28 February',
        content:
          'All staff at Level 3 and above must complete the annual diagnostic with the BECM directorate by 28 February. Late completion results in temporary suspension of lift bypass and canteen privileges, which is a strange sentence to have to write, but it is the incentive that works.'
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Soraya Morales (Atacama Trench Station 05)',
      role: 'Deputy Director, Infrasonic Cartography',
      quote:
        '"People think it is silent up here at night. It is not. It is just tuned lower than the telescope people care about."'
    },
    cafeteriaSpecial:
      'Tuesday: Baked hake, dill potatoes (Tower Obsidian, Level -1) | Daily: electrolyte broth, free, Yellowknife only, and yes it tastes like that on purpose.',
    safetyNotice:
      'SAFETY REMINDER 44-B: Do not sleep in the Sub-Basement 5 mechanical rooms. Two colleagues did in November and both needed correcting on the date when they woke up.'
  },
  {
    id: 'news-02',
    issueNumber: 'VOL-43-ISS-04',
    title: 'Civic Pulse // Winter 2024: Demographic Resilience in Action',
    publicationDate: '2024-11-20',
    volumeName: 'Division of Civic Continuity & Demographic Resilience Bulletin',
    leadArticle: {
      headline: 'Grimsel Pass storage complete: 720 days, 10,000 residents',
      content:
        'Mara Finch confirmed on Monday that the Grimsel complex is fully provisioned. The nitrogen and oxygen loops have completed their acceptance tests against a full resident load. Two hundred and forty of the sealed crates in the lower stores are marked for the medical annex only and require a countersignature to open, which is why the count in the stores register does not match the total in the audit. Both numbers are correct.'
    },
    secondaryArticles: [
      {
        headline: 'Echo-State expands to twelve twin cities',
        content:
          "Evelyn Reed's team has stood up synthetic models of Chicago, Seoul and Frankfurt, and the Chicago instance called the pattern of last month's rail disruption to within ninety minutes. The team are asking for two more analysts and have been asking since June."
      },
      {
        headline: 'Compound 88-T dispensers at polar stations',
        content:
          'Five hundred units of drops have gone to Station 07 and Tiksi. Staff who hear a low hum that other people cannot hear should use the drops before sleeping and note the frequency in the station log. The log is not a complaint mechanism and it is not used against staff. It is read for tone and period.'
      }
    ],
    employeeSpotlight: {
      name: 'Niall O’Connor (Tower Obsidian, Facilities)',
      role: 'Maintenance Supervisor, Sub-Basement',
      quote:
        '"I wear the earmuffs when the chillers are off. That is the only thing I want in the newsletter."'
    },
    cafeteriaSpecial:
      'Thursday: braised beef, polenta (Grimsel Pass). All dairy at Swiss sites is irradiated for twenty-year storage; enquiries about the taste should go to the stores officer, not the canteen.',
    safetyNotice:
      'SECURITY: the whistleblower line is monitored at all hours. Staff taking photographs in Microfilm Room 2, or writing notes on paper in the repository, will be asked to accompany a security officer to Medical. This is a welfare process and there is no penalty. Please do not make it awkward for the officer.'
  },
  {
    id: 'news-03',
    issueNumber: 'VOL-42-ISS-01',
    title: 'The Acoustic Perimeter // Special Technical Edition 2024',
    publicationDate: '2024-06-10',
    volumeName: 'PEFD & ASIAN Joint Technical Journal',
    leadArticle: {
      headline: 'Carrier at 14.988 and drifting',
      content:
        'All twenty-two stations now agree on a carrier value of 14.988Hz, up from 14.802 at commissioning. Henrik Lindqvist notes that the rate of rise is not linear and that coupling to high-voltage grid infrastructure has increased measurably at every step. The paper that will be circulated to clients describes the effect as "seasonal variation". Our own record should describe it accurately.'
    },
    secondaryArticles: [
      {
        headline: 'Node 14 transducers replaced',
        content:
          'Kasper Vang and the Atlantic team finished swapping the sapphire pressure sensors on the ridge at 3,200 metres. Resolution is now below a millihertz, which is better than the array was specified for and better than we have a use for.'
      },
      {
        headline: 'Cicada extended to UK motorways',
        content:
          "Piezoelectric harvesting along the M1 is now powering the passive re-radiator bars in the northbound carriageway. Average speed through the test section is down 4mph and the collieries' haulage operators have complained about the smoothness. No colleague is to describe these installations in public using the word entrainment."
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Clara Zimmerman (Black Ridge Station 16)',
      role: 'Resonance Analyst',
      quote:
        '"The seam sings in fifths. I put it in the report in 2020 and I have not been asked about it since."'
    },
    cafeteriaSpecial:
      'Wednesday: smoked trout, cornbread (Black Ridge) | Friday: poke bowl, seaweed salad (Chiyoda B3).',
    safetyNotice:
      'ACOUSTIC HYGIENE: if your handset rings when no call is incoming, or a three-tone chime plays on a landline, hang up and hand the set to TOPN for de-gaussing. Do not record it and do not share the recording internally.'
  },
  {
    id: 'news-04',
    issueNumber: 'VOL-41-ISS-03',
    title: 'Continuity Weekly // Q3 2023: Sovereign Advisory Highlights',
    publicationDate: '2023-09-01',
    volumeName: 'Executive Governance & Special Projects Unit Dispatch',
    leadArticle: {
      headline: 'Resilience pact signed with three ministries',
      content:
        'Helena Cross signed a ten-year demographic continuity and frequency harmonisation agreement with three sovereign ministries on 22 August. Twenty-eight metropolitan centres are covered. The word "frequency" does not appear in the public annexes; the schedule of works is filed under ambient noise abatement, which is a category the client departments already have, and which is why the pact went through without any of them needing to ask what it was for.'
    },
    secondaryArticles: [
      {
        headline: 'Postojna re-indexing complete for 1971-1999',
        content:
          'Vincent Adeyemi reports that every legacy file in the 1971-1999 range now carries a dynamic validation tree. Anyone holding an altered copy will see it fail within seconds. Anyone holding a true copy will keep holding it, which is the part of this that the directorate has been asked about twice.'
      },
      {
        headline: 'Tokyo baffles installed',
        content:
          'Five floors of vertical acoustic baffling are now in place along the Chiyoda lift shafts. The stated purpose is seismic damping. The actual purpose is also seismic damping, on a frequency band that was not in the original brief.'
      }
    ],
    employeeSpotlight: {
      name: 'Dr. Brigitte Laroche (Tokyo Chiyoda Deep Tower)',
      role: 'Senior Analyst, Behavioural Metrics',
      quote: '"I do not think of it as a crowd. I think of it as a curve, and the curve can be moved."'
    },
    cafeteriaSpecial:
      'Monday: tonkotsu ramen, Chiyoda B3 | Daily: sugar-free matcha available at all exec kiosks, at a price the rest of us are not paying.',
    safetyNotice:
      'SECURITY: attempts to reach the legacy console on the corporate intranet are logged and reviewed individually by Agent Kiernan. Curiosity here is treated as a health matter first and a disciplinary matter second. That is a genuine offer, not a trap.'
  },
  {
    id: 'news-05',
    issueNumber: 'VOL-40-ISS-02',
    title: 'Paradigms Horizon // Summer 2022: Post-Pandemic Harmony',
    publicationDate: '2022-07-20',
    volumeName: 'Internal Global Staff Publication',
    leadArticle: {
      headline: 'Emergency alert study - pilot results',
      content:
        'The BECM directorate has published results from the alert-tone pilot run in fourteen cities. Adherence to emergency instructions improved substantially and distress calls fell. The mechanism is described in the published summary as a calming acoustic quality in the alert tone. The full study is Level 4 and anyone who wants to read it can request it, though the summary is what clients will get.'
    },
    secondaryArticles: [
      {
        headline: 'Compound 88-T, clinical update',
        content:
          'Marcus Saito reports good outcomes in the Yellowknife group. Roughly nine in ten of those treated no longer perceive the hum. Of the remainder, most are staff who chose to stop taking the drops, and the clinic has stopped trying to change their minds.'
      },
      {
        headline: 'Atacama telemetry record',
        content:
          'Four thousand consecutive hours from the stratospheric microbarometers, which is an instrument record and also four thousand hours of a hum that nobody in Chile was asked about.'
      }
    ],
    employeeSpotlight: {
      name: 'Diego Ramirez (Atacama Trench Station 05)',
      role: 'Station Superintendent',
      quote:
        '"You can see the wave bending the starlight in the telescope feeds. It is beautiful and I would like it to stop."'
    },
    cafeteriaSpecial:
      'Tuesday: pastel de choclo (Atacama) | Thursday: roast beef, Yorkshire pudding (Tower Obsidian).',
    safetyNotice:
      'FACILITY WARNING: do not adjust the manual valves on the Sub-Level 4 cryogenic lines. A helium burn at a field station means a medical evacuation to Yellowknife, and the flight is longer than the pain is worth.'
  },
  {
    id: 'news-06',
    issueNumber: 'VOL-39-ISS-04',
    title: 'Civic Pulse // Winter 2021: 50 Years of Pre-emptive Certainty',
    publicationDate: '2021-12-10',
    volumeName: 'Commemorative Golden Jubilee Staff Issue (1971-2021)',
    leadArticle: {
      headline: 'Chair address marks fifty years',
      content:
        'Dame Eleanor Cross gave a short recorded address from the Grimsel complex on 12 November. She spoke about the first offices in Cambridge, the eighteen staff in 1974, and the criticism the company took in its early years for forecasting that events "had not yet had time to happen". The full recording runs eleven minutes and is stored on the internal network in audio only. There is no transcript, which several people have asked about, and none is planned.'
    },
    secondaryArticles: [
      {
        headline: 'Golden jubilee retrospective',
        content:
          'The archive office has produced an eight-page illustrated retrospective: twenty-two stations, the Site 19 excavation, and the acoustic engineering teams of the eighties. Two photographs were withheld from the printed version by the archive office and the reason given was emulsion damage.'
      },
      {
        headline: 'Jubilee dividend and cohort milestone',
        content:
          'The board has authorised a jubilee dividend for eligible staff and confirmed the eight-thousandth enrolment in the Tier-1 Heritage Cohort. Enrolment is closed and staff are not eligible, which has been asked about in the canteen and is answered here so nobody has to ask Human Resources directly.'
      }
    ],
    employeeSpotlight: {
      name: 'Chief Engineer Sarah Lin (Site 19, Utah)',
      role: 'Chief Engineer, Underground Works',
      quote:
        '"The Earth has a beat. I have spent fifteen years making sure it does not get faster than the plant was built for."'
    },
    cafeteriaSpecial:
      'Friday: jubilee lunch at all twenty-two sites | Vegetarian: truffled mushroom risotto, which the London canteen has had on the menu since October and is not jubilee-specific.',
    safetyNotice:
      'GENERAL: project code names (Vesper, Boreas, Hypnos, Palimpsest and others) are not to be used with family members or with anyone outside the company, including former colleagues. Email is retained permanently. Assume it will be read aloud in a room you are not in.'
  }
];
