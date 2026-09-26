import type { EmailThread } from '@/types';

export const EMAIL_THREADS: EmailThread[] = [
  {
    id: 'eml-01',
    threadCode: 'EML-2019-SVALBARD-LEAK',
    subject: 'URGENT // Station 07 Telemetry Discrepancy & Unauthorized Data Dump',
    date: '2019-11-04 06:12 UTC',
    classification: 'Level 5 - Black Dossier',
    participants: [
      {
        name: 'Dr. Henrik Lindqvist',
        email: 'h.lindqvist@asian.globalparadigms.corp',
        role: 'Director, ASIAN'
      },
      {
        name: 'Dr. Aris Thorne',
        email: 'a.thorne@pefd.globalparadigms.corp',
        role: 'Senior Research Fellow'
      },
      {
        name: 'Agent Felix Mercer',
        email: 'f.mercer@topn.globalparadigms.corp',
        role: 'Special Agent, TOPN'
      },
      {
        name: 'CEO Alistair Sterling',
        email: 'a.sterling@exec.globalparadigms.corp',
        role: 'Chief Executive Officer'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Henrik Lindqvist',
        senderEmail: 'h.lindqvist@asian.globalparadigms.corp',
        timestamp: '2019-11-04 04:22 UTC',
        body: 'Alistair, Felix: We have a severe perimeter security breach at Station 07. Dr. Aris Thorne accessed the Borehole 4 primary acoustic sensor telemetry and downloaded 48 gigabytes of uncompressed 32-bit float audio records from October. His terminal logged an external IP sync to an encrypted Swedish relay before we cut the fiber link.\n\nHe has not reported to morning muster in Longyearbyen. His snowmobile was tracked toward the old Soviet coal dock.'
      },
      {
        senderName: 'Dr. Aris Thorne',
        senderEmail: 'a.thorne@pefd.globalparadigms.corp',
        timestamp: '2019-11-04 04:55 UTC',
        body: 'To Henrik and the Board:\n\nI’m not coming back to the station. You lied about the Borehole 4 source. The 14.8Hz pulse is not geothermal convection. It has an algorithmic period that modulates every 3,600 seconds. It is a broadcast, and you’ve been broadcasting back to it using the municipal subway grids in Europe since 1989.\n\nThe files are already mirrored across 14 independent servers. You can’t scrub this with Project Palimpsest.',
        hasAttachment: true,
        attachmentName: 'Station07_Borehole4_RawCapture_Oct24.dat'
      },
      {
        senderName: 'Agent Felix Mercer',
        senderEmail: 'f.mercer@topn.globalparadigms.corp',
        timestamp: '2019-11-04 05:30 UTC',
        body: 'Directive 09 is now active. All Svalbard regional outbound internet traffic is throttled via our Nordic telecom agreement. Automated hash suppressors deployed across major search engines. Local Norwegian police have been told an eccentric climate researcher went missing during a blizzard.\n\nWe are seizing his brother Julian Thorne’s workstation in Postojna immediately.'
      },
      {
        senderName: 'CEO Alistair Sterling',
        senderEmail: 'a.sterling@exec.globalparadigms.corp',
        timestamp: '2019-11-04 06:12 UTC',
        body: 'Felix: Execute the total sanitization protocol. No media statements. If journalists inquire about acoustic anomalies in Spitsbergen, attribute it to routine ice-shelf calving and gas hydrate venting. Henrik: lock down Borehole 4 and weld the sub-surface inspection hatch.'
      }
    ]
  },
  {
    id: 'eml-02',
    threadCode: 'EML-2011-OAKHAVEN-TERMINATION',
    subject: 'INCIDENT REPORT // Oakhaven Phase 3 Trial - Premature Cessation',
    date: '2011-09-18 22:45 EST',
    classification: 'Level 4 - Top Secret',
    participants: [
      { name: 'Dr. Naomi Chen', email: 'n.chen@pefd.globalparadigms.corp', role: 'Director, PEFD' },
      { name: 'Harrison Blake', email: 'h.blake@topn.globalparadigms.corp', role: 'Director, TOPN' },
      {
        name: 'Dr. Diane Kowalski',
        email: 'd.kowalski@bhrr.globalparadigms.corp',
        role: 'Neurological Hygiene Officer'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Naomi Chen',
        senderEmail: 'n.chen@pefd.globalparadigms.corp',
        timestamp: '2011-09-18 19:10 EST',
        body: 'Harrison: We must shut down the Oakhaven municipal transmitters immediately. At 16:30 today, when the VesperTone modulation was increased by 3dB for the evening commute test, approximately 60% of the town residents stopped walking simultaneously and stood facing North-Northwest for 4 minutes and 12 seconds.\n\nLocal emergency dispatch received 400 calls in twenty minutes reporting sudden ear ringing and total spatial confusion. This is beyond our target compliance parameters.'
      },
      {
        senderName: 'Dr. Diane Kowalski',
        senderEmail: 'd.kowalski@bhrr.globalparadigms.corp',
        timestamp: '2011-09-18 20:35 EST',
        body: 'I have dispatched mobile Bio-Harmonic teams with Compound 88-T to the Oakhaven Memorial Hospital. We are administering oral sedatives and acoustic dampeners under the guise of an industrial water contamination investigation. 42 severe cases will require permanent memory dampening under Protocol 9.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2011-09-18 22:45 EST',
        body: 'Transmitters powered down as of 21:00. Press statement drafted blaming a lightning strike on the local electrical substation causing high-voltage transformer harmonic buzzing. All Oakhaven Tribune staff have signed standard Section 4 non-disclosure agreements with £50,000 severance packages.'
      }
    ]
  },
  {
    id: 'eml-03',
    threadCode: 'EML-2023-CHRONO-FEEDBACK',
    subject: 'CRITICAL ALERT // ChronoForecast Self-Fulfilling Volatility Loop',
    date: '2023-03-14 09:15 GMT',
    classification: 'Level 4 - Top Secret',
    participants: [
      { name: 'Dr. Thaddeus Holt', email: 't.holt@sfpc.globalparadigms.corp', role: 'Director, SFPC' },
      {
        name: 'Helena Vance-Cross',
        email: 'h.vancecross@exec.globalparadigms.corp',
        role: 'Executive Vice President'
      },
      {
        name: 'Dr. Evelyn Reed',
        email: 'e.reed@sfpc.globalparadigms.corp',
        role: 'Lead Chronological Modeler'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Thaddeus Holt',
        senderEmail: 't.holt@sfpc.globalparadigms.corp',
        timestamp: '2023-03-14 07:45 GMT',
        body: 'Helena: We have discovered a dangerous feedback loop in our ChronoForecast™ enterprise market feeds. Three major London hedge funds and two sovereign wealth funds configured automated high-frequency trading algorithms to trade on our 72-hour demographic anxiety index.\n\nBecause our index predicted a liquidity shock in UK government bonds for Thursday, their algorithms dumped £4.2 billion in gilts this morning. Our forecast didn’t predict the crash—our forecast caused it.'
      },
      {
        senderName: 'Dr. Evelyn Reed',
        senderEmail: 'e.reed@sfpc.globalparadigms.corp',
        timestamp: '2023-03-14 08:30 GMT',
        body: 'I reviewed the mathematical twin models. The loop gain is currently 1.44. If we don’t inject synthetic noise into the ChronoForecast terminal API within 3 hours, the cascade will spread to European commercial paper.'
      },
      {
        senderName: 'Helena Vance-Cross',
        senderEmail: 'h.vancecross@exec.globalparadigms.corp',
        timestamp: '2023-03-14 09:15 GMT',
        body: 'Thaddeus: Restrict all external ChronoForecast API feeds immediately. Display an error message citing "Scheduled Fiber Cable Maintenance". We will settle with the Bank of England privately. GPC will buy the discounted gilts through our Swiss holding entity.'
      }
    ]
  },
  {
    id: 'eml-04',
    threadCode: 'EML-2024-SITE19-FISSURE',
    subject: 'ENGINEERING ADVISORY // Salt Lake Site 19 Sub-Level 6 Micro-Fracture',
    date: '2024-08-20 16:04 MST',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Chief Engineer Sarah Lin',
        email: 's.lin@siso.globalparadigms.corp',
        role: 'Chief Engineer, SISO'
      },
      {
        name: 'Commander J. R. Calderon',
        email: 'jr.calderon@siso.globalparadigms.corp',
        role: 'Operations Commander'
      },
      { name: 'Garrison Cole', email: 'g.cole@siso.globalparadigms.corp', role: 'Chief Security Officer' }
    ],
    messages: [
      {
        senderName: 'Chief Engineer Sarah Lin',
        senderEmail: 's.lin@siso.globalparadigms.corp',
        timestamp: '2024-08-20 14:15 MST',
        body: 'Commander Calderon: Sub-Level 6 acoustic sensor cluster B logged a shear fracture along the northern salt dome boundary at 13:40. The 32.4Hz containment tone lost 6dB of attenuation in Chamber 04.\n\nWe need to inject 40,000 tons of acoustic dampening polymer grout before the standing wave reaches the surface salt flats. Surface observers could otherwise hear an audible 32Hz hum across Tooele County.'
      },
      {
        senderName: 'Garrison Cole',
        senderEmail: 'g.cole@siso.globalparadigms.corp',
        timestamp: '2024-08-20 15:10 MST',
        body: 'Surface perimeter security has closed Highway 196 under the cover of Utah Department of Transportation culvert replacement. Cement mixer convoys are entering Gate 3 without commercial markings.'
      },
      {
        senderName: 'Commander J. R. Calderon',
        senderEmail: 'jr.calderon@siso.globalparadigms.corp',
        timestamp: '2024-08-20 16:04 MST',
        body: 'Approved. Grout pumping will commence at 18:00. All Sub-Level 6 personnel must wear Class-A acoustic headgear. Anyone removing their ear dampeners will be subject to immediate medical quarantine at Yellowknife.'
      }
    ]
  },
  {
    id: 'eml-05',
    threadCode: 'EML-2022-SWISS-ISOLATION',
    subject: 'EXECUTIVE DISPATCH // 90-Day Silent Cohort Isolation Test Results',
    date: '2022-01-15 10:00 CET',
    classification: 'Level 5 - Black Dossier',
    participants: [
      { name: 'Mara Finch', email: 'm.finch@ccdr.globalparadigms.corp', role: 'Director, CCDR' },
      {
        name: 'Dame Eleanor Cross',
        email: 'e.cross@board.globalparadigms.corp',
        role: 'Co-Founder & Board President'
      },
      {
        name: 'Arthur K. Vance-Cross',
        email: 'ak.vancecross@ccdr.globalparadigms.corp',
        role: 'Deputy Director, CCDR'
      }
    ],
    messages: [
      {
        senderName: 'Arthur K. Vance-Cross',
        senderEmail: 'ak.vancecross@ccdr.globalparadigms.corp',
        timestamp: '2022-01-15 08:30 CET',
        body: 'Dame Eleanor, Mara: We have unsealed the Grimsel Pass redoubt after 90 days of complete atmospheric and electromagnetic isolation. All 120 test cohort members survived with zero respiratory illnesses.\n\nHowever, by Day 45, without external radio or acoustic anchoring, 38% of the cohort developed synchronized dreaming patterns centered around a repeating 14.8Hz pulse. They reported dreaming of a black obelisk rising out of an Arctic fjord.'
      },
      {
        senderName: 'Mara Finch',
        senderEmail: 'm.finch@ccdr.globalparadigms.corp',
        timestamp: '2022-01-15 09:15 CET',
        body: 'This confirms that the 14.8Hz frequency penetrates 1,200 meters of alpine granite. We must install secondary Helmholtz acoustic dampening chambers along the bunker perimeter before we enroll the full 10,000-person Tier-1 Heritage Cohort.'
      },
      {
        senderName: 'Dame Eleanor Cross',
        senderEmail: 'e.cross@board.globalparadigms.corp',
        timestamp: '2022-01-15 10:00 CET',
        body: 'Arthur: Arthur Vance-Vane documented this exact dream synchronization in Cambridge in 1969. It is not an artifact of isolation—it is the baseline frequency of the planet reclaiming an unshielded consciousness. Proceed with the secondary dampeners.'
      }
    ]
  },
  {
    id: 'eml-06',
    threadCode: 'EML-2024-LEAK-CONTAINMENT',
    subject: 'SECURITY BULLETIN // Digital Mirror Purge & Palimpsest Crawlers',
    date: '2024-05-12 18:22 GMT',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Agent Felix Mercer',
        email: 'f.mercer@topn.globalparadigms.corp',
        role: 'Special Agent, TOPN'
      },
      {
        name: 'Cassian Drake',
        email: 'c.drake@airs.globalparadigms.corp',
        role: 'Senior Curator & Redaction Officer'
      },
      {
        name: 'Vance Sterling-Holt',
        email: 'v.sterlingholt@legal.globalparadigms.corp',
        role: 'Chief Legal Counsel'
      }
    ],
    messages: [
      {
        senderName: 'Agent Felix Mercer',
        senderEmail: 'f.mercer@topn.globalparadigms.corp',
        timestamp: '2024-05-12 16:40 GMT',
        body: 'Cassian, Vance: A new mirror of the "Palimpsest Telemetry Archive" appeared on an anonymous Swiss domain (global-paradigms-leaks.ch). It contains raw audio spectrums from Diego Garcia Hydrophone 12 and employee dossiers from the 1994 Reson-8 recall.'
      },
      {
        senderName: 'Vance Sterling-Holt',
        senderEmail: 'v.sterlingholt@legal.globalparadigms.corp',
        timestamp: '2024-05-12 17:15 GMT',
        body: 'I have served an emergency ex-parte DMCA and national security injunction on the Zurich registrar. Domain will be seized and redirected to our custom GPC 404 dead link portal within 45 minutes.'
      },
      {
        senderName: 'Cassian Drake',
        senderEmail: 'c.drake@airs.globalparadigms.corp',
        timestamp: '2024-05-12 18:22 GMT',
        body: 'Project Palimpsest crawlers have executed SHA-256 hash substitutions on all linked PDF records. Anyone attempting to download the raw leaks will receive our scrubbed version with all classified coordinates blacked out.'
      }
    ]
  },
  {
    id: 'eml-07',
    threadCode: 'EML-2023-DIEGO-PULSE',
    subject: 'OCEANIC TELEMETRY // Hydrophone 12 Mantle Acoustic Anomaly',
    date: '2023-11-15 04:10 UTC',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Dr. Tariq Al-Mansoor',
        email: 't.almansoor@asian.globalparadigms.corp',
        role: 'Lead Hydro-Acoustics Oceanographer'
      },
      {
        name: 'Dr. Henrik Lindqvist',
        email: 'h.lindqvist@asian.globalparadigms.corp',
        role: 'Director, ASIAN'
      },
      { name: 'Kasper Vang', email: 'k.vang@asian.globalparadigms.corp', role: 'Seabed Telemetry Engineer' }
    ],
    messages: [
      {
        senderName: 'Dr. Tariq Al-Mansoor',
        senderEmail: 't.almansoor@asian.globalparadigms.corp',
        timestamp: '2023-11-15 01:20 UTC',
        body: 'Henrik: Hydrophone 12 recorded a 54Hz acoustic ramp at 11:58 UTC yesterday. This is the fourth time in six months that the signal has manifested with identical amplitude (+42dB over abyssal ambient).\n\nTriangulation between Diego Garcia and the Azores Station 19 indicates the source is at 2,900km depth near the core-mantle boundary.'
      },
      {
        senderName: 'Kasper Vang',
        senderEmail: 'k.vang@asian.globalparadigms.corp',
        timestamp: '2023-11-15 02:45 UTC',
        body: "We checked the Azores fiber line. The signal arrived at Node 14 exactly 14.2 minutes after Diego Garcia. This matches the acoustic propagation speed through the D'' layer of the lower mantle."
      },
      {
        senderName: 'Dr. Henrik Lindqvist',
        senderEmail: 'h.lindqvist@asian.globalparadigms.corp',
        timestamp: '2023-11-15 04:10 UTC',
        body: 'Do not log this in the public oceanographic database. Classify under Project Monolith. Alistair has requested a briefing in London on Thursday.'
      }
    ]
  },
  {
    id: 'eml-08',
    threadCode: 'EML-2021-ATACAMA-OPTICAL',
    subject: 'OBSERVATORY NOTICE // Optical Refraction Interference over Atacama',
    date: '2021-06-10 14:12 CLT',
    classification: 'Level 3 - Secret',
    participants: [
      {
        name: 'Dr. Soraya Morales',
        email: 's.morales@asian.globalparadigms.corp',
        role: 'Lead Infrasonic Cartographer'
      },
      { name: 'Diego Ramirez', email: 'd.ramirez@siso.globalparadigms.corp', role: 'Station Superintendent' },
      { name: 'Harrison Blake', email: 'h.blake@topn.globalparadigms.corp', role: 'Director, TOPN' }
    ],
    messages: [
      {
        senderName: 'Dr. Soraya Morales',
        senderEmail: 's.morales@asian.globalparadigms.corp',
        timestamp: '2021-06-10 11:30 CLT',
        body: 'Diego: The European Southern Observatory director contacted us regarding optical distortion in the Very Large Telescope array. When our 4.2Hz high-altitude infrasonic emitters are running at full power, the barometric pressure standing waves create air-density lenses that bend starlight by 0.04 arcseconds.'
      },
      {
        senderName: 'Diego Ramirez',
        senderEmail: 'd.ramirez@siso.globalparadigms.corp',
        timestamp: '2021-06-10 12:45 CLT',
        body: 'We cannot power down during the scheduled Northern Hemisphere calibration sweep. If we shut down, Station 07 will lose phase lock.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2021-06-10 14:12 CLT',
        body: 'Inform the observatory that the atmospheric turbulence is caused by anomalous high-altitude jet stream shearing. Offer them a £500,000 GPC academic grant for adaptive optics research to ensure their cooperation.'
      }
    ]
  },
  {
    id: 'eml-09',
    threadCode: 'EML-2024-REDACTION-AUDIT',
    subject: 'INTERNAL MEMO // Postojna Caverns Redaction Discrepancies',
    date: '2024-09-02 11:20 CET',
    classification: 'Level 3 - Secret',
    participants: [
      {
        name: 'Evelyn Vance-Sylvan',
        email: 'e.vancesylvan@airs.globalparadigms.corp',
        role: 'Digitization Archivist'
      },
      {
        name: 'Cassian Drake',
        email: 'c.drake@airs.globalparadigms.corp',
        role: 'Senior Curator & Redaction Officer'
      }
    ],
    messages: [
      {
        senderName: 'Evelyn Vance-Sylvan',
        senderEmail: 'e.vancesylvan@airs.globalparadigms.corp',
        timestamp: '2024-09-02 09:40 CET',
        body: 'Mr. Drake: While scanning the 1978 Board Minutes box (Box AIRS-78-04), I noticed that four pages of Dr. Arthur Vance-Vane’s original notebook were un-redacted in the physical binder. They describe a device called the "Null Resonator" designed to silence human vocal cords within a 50-meter radius.\n\nShould I apply standard black toner tape or submit them to the chemical shredder?'
      },
      {
        senderName: 'Cassian Drake',
        senderEmail: 'c.drake@airs.globalparadigms.corp',
        timestamp: '2024-09-02 11:20 CET',
        body: 'Do not scan them. Bring the physical binder directly to my office on Sub-Level 2. You will be scheduled for a routine Bio-Harmonic review with Dr. Kowalski this afternoon.'
      }
    ]
  },
  {
    id: 'eml-10',
    threadCode: 'EML-2023-AMNESIA-EVAL',
    subject: 'RESEARCH SUMMARY // VesperTone Retrograde Amnesia Biomarkers',
    date: '2023-10-18 15:45 JST',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Dr. Brigitte Laroche',
        email: 'b.laroche@becm.globalparadigms.corp',
        role: 'Senior Quantitative Behavioral Analyst'
      },
      { name: 'Dr. Kaelen Voss', email: 'k.voss@becm.globalparadigms.corp', role: 'Director, BECM' },
      { name: 'Dr. Naomi Chen', email: 'n.chen@pefd.globalparadigms.corp', role: 'Director, PEFD' }
    ],
    messages: [
      {
        senderName: 'Dr. Brigitte Laroche',
        senderEmail: 'b.laroche@becm.globalparadigms.corp',
        timestamp: '2023-10-18 13:10 JST',
        body: 'Dr. Voss, Dr. Chen: Our analysis of 10,000 corporate workers exposed to VesperTone HVAC conditioning shows a 78% reduction in memory retention regarding municipal fare hike announcements and emergency tax increases. Workers perceive the announcements, acknowledge them emotionally without resistance, and forget the details within 48 hours.\n\nThis represents the highest compliance stability rating in BECM history.'
      },
      {
        senderName: 'Dr. Naomi Chen',
        senderEmail: 'n.chen@pefd.globalparadigms.corp',
        timestamp: '2023-10-18 14:30 JST',
        body: 'What is the long-term cognitive degradation curve? Are we seeing speech articulation deficits or motor ataxia after 24 months of exposure?'
      },
      {
        senderName: 'Dr. Kaelen Voss',
        senderEmail: 'k.voss@becm.globalparadigms.corp',
        timestamp: '2023-10-18 15:45 JST',
        body: 'Degradation is negligible when balanced with weekend silence intervals. We are submitting the protocol to the Executive Committee for 2025 municipal rollout.'
      }
    ]
  },
  {
    id: 'eml-11',
    threadCode: 'EML-2024-TIKSI-THERMAL',
    subject: 'STATION DISPATCH // Siberian Borehole 8 Thermal Acoustic Surge',
    date: '2025-01-22 08:30 TIK',
    classification: 'Level 3 - Secret',
    participants: [
      { name: 'Mikhail Volkov', email: 'm.volkov@siso.globalparadigms.corp', role: 'Station Chief, Tiksi' },
      {
        name: 'Chief Engineer Sarah Lin',
        email: 's.lin@siso.globalparadigms.corp',
        role: 'Chief Engineer, SISO'
      }
    ],
    messages: [
      {
        senderName: 'Mikhail Volkov',
        senderEmail: 'm.volkov@siso.globalparadigms.corp',
        timestamp: '2025-01-22 06:15 TIK',
        body: 'Sarah: Borehole 8 temperature jumped from -12C to +34C in 48 hours at 9,000m depth. The deep quartz sensors are vibrating violently at 14.8Hz. The permafrost around the rig is softening.\n\nWe need permission to vent high-pressure nitrogen down the casing.'
      },
      {
        senderName: 'Chief Engineer Sarah Lin',
        senderEmail: 's.lin@siso.globalparadigms.corp',
        timestamp: '2025-01-22 08:30 TIK',
        body: 'Permission granted. Maintain continuous nitrogen flush. If the borehole acoustic amplitude exceeds 110dB, trigger the emergency concrete shear plug.'
      }
    ]
  },
  {
    id: 'eml-12',
    threadCode: 'EML-2024-DMCA-ENFORCEMENT',
    subject: 'TACTICAL REPORT // Mass Takedown of "Sky Trumpet" Audio Recordings',
    date: '2024-04-05 17:00 EST',
    classification: 'Level 3 - Secret',
    participants: [
      {
        name: 'Chloe Fontaine',
        email: 'c.fontaine@pefd.globalparadigms.corp',
        role: 'Acoustic Forensic Investigator'
      },
      { name: 'Harrison Blake', email: 'h.blake@topn.globalparadigms.corp', role: 'Director, TOPN' }
    ],
    messages: [
      {
        senderName: 'Chloe Fontaine',
        senderEmail: 'c.fontaine@pefd.globalparadigms.corp',
        timestamp: '2024-04-05 15:30 EST',
        body: 'Harrison: We issued 1,420 automated DMCA and copyright notices across YouTube, TikTok, and X today regarding viral audio clips recorded in Calgary and Munich. The videos captured our atmospheric refraction sweep during the Project Boreas test.\n\nAll primary uploads have been removed or audio-muted.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2024-04-05 17:00 EST',
        body: 'Excellent. Push the seeded scientific articles claiming the sounds are "coronal mass ejection acoustic coupling" and "industrial train braking echoes".'
      }
    ]
  },
  {
    id: 'eml-13',
    threadCode: 'EML-2025-HERITAGE-ENROLLMENT',
    subject: 'CONTINUITY DIRECTIVE // Final Tier-1 Heritage Cohort Seat Confirmation',
    date: '2025-08-14 11:00 CET',
    classification: 'Level 5 - Black Dossier',
    participants: [
      { name: 'Mara Finch', email: 'm.finch@ccdr.globalparadigms.corp', role: 'Director, CCDR' },
      {
        name: 'CEO Alistair Sterling',
        email: 'a.sterling@exec.globalparadigms.corp',
        role: 'Chief Executive Officer'
      },
      {
        name: 'Helena Vance-Cross',
        email: 'h.vancecross@exec.globalparadigms.corp',
        role: 'Executive Vice President'
      }
    ],
    messages: [
      {
        senderName: 'Mara Finch',
        senderEmail: 'm.finch@ccdr.globalparadigms.corp',
        timestamp: '2025-08-14 09:30 CET',
        body: 'Alistair, Helena: Seat allocation for all 10,000 slots across the 14 Aethelgard redoubts is 100% committed. The sovereign continuity contracts provide £4.2 billion in annual retainer fees.\n\nBiometric access cards (Titanium-RFID) will be delivered to enrolled principals via diplomatic courier in October.'
      },
      {
        senderName: 'CEO Alistair Sterling',
        senderEmail: 'a.sterling@exec.globalparadigms.corp',
        timestamp: '2025-08-14 11:00 CET',
        body: 'Ensure that all secondary heir allocations include the mandatory 72-hour cognitive screening clause. In the event of a Level 5 trigger, non-synchronized family members cannot be admitted to Grimsel Pass or Woomera.'
      }
    ]
  },
  {
    id: 'eml-14',
    threadCode: 'EML-2024-TERMINAL-BACKDOOR',
    subject: 'SYSTEM NOTICE // Terminal Backdoor Maintenance & Clearance Protocols',
    date: '2024-11-20 23:14 UTC',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'David Vance-Wren',
        email: 'd.vancewren@sfpc.globalparadigms.corp',
        role: 'Senior Systems Analyst'
      },
      { name: 'Agent Felix Mercer', email: 'f.mercer@topn.globalparadigms.corp', role: 'Special Agent, TOPN' }
    ],
    messages: [
      {
        senderName: 'David Vance-Wren',
        senderEmail: 'd.vancewren@sfpc.globalparadigms.corp',
        timestamp: '2024-11-20 22:45 UTC',
        body: 'Felix: The command-line console backdoor on the intranet portal (`GPC://terminal`) is still responding to legacy supervisor override commands. Anyone with standard Level 2 credentials who enters `override 432-88` or `leak-dump` can bypass the front-end redaction filters.'
      },
      {
        senderName: 'Agent Felix Mercer',
        senderEmail: 'f.mercer@topn.globalparadigms.corp',
        timestamp: '2024-11-20 23:14 UTC',
        body: 'Leave it active. It serves as our primary honeypot for identifying curious research staff before they attempt external exfiltration. Every keystroke is logged directly to my terminal.'
      }
    ]
  }
];
