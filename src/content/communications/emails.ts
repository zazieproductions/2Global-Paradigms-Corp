import type { EmailThread } from '@/types';

/**
 * Recovered internal mail.
 *
 * House style: nobody in these threads is writing for posterity. Keep the
 * typos, the missing full stops and the half-sentences — a scrubbed archive
 * that reads like a novel is exactly what Palimpsest is accused of doing.
 */
export const EMAIL_THREADS: EmailThread[] = [
  {
    id: 'eml-01',
    threadCode: 'EML-2019-SVALBARD-LEAK',
    subject: 'Station 07 - telemetry access, unplanned',
    date: '2019-11-04 06:12 UTC',
    classification: 'Level 5 - Black Dossier',
    participants: [
      {
        name: 'Dr. Henrik Lindqvist',
        email: 'h.lindqvist@asian.globalparadigms.corp',
        role: 'Director, ASIAN'
      },
      {
        name: 'Dr. Ewan Thorne',
        email: 'e.thorne@pefd.globalparadigms.corp',
        role: 'Senior Research Fellow'
      },
      {
        name: 'Agent Paul Kiernan',
        email: 'p.kiernan@topn.globalparadigms.corp',
        role: 'Special Agent, TOPN'
      },
      {
        name: 'CEO Nigel Ashby',
        email: 'n.ashby@exec.globalparadigms.corp',
        role: 'Chief Executive Officer'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Henrik Lindqvist',
        senderEmail: 'h.lindqvist@asian.globalparadigms.corp',
        timestamp: '2019-11-04 04:22 UTC',
        body: 'Nigel, Paul -\n\nThorne pulled the Borehole 4 sensor set off the primary archive last night and took 48GB with him, October in full, uncompressed. His terminal shows an outbound sync to a Swedish relay at 03:41. We cut the fibre at 04:05, which was about an hour too late.\n\nHe missed muster. Snowmobile went out towards the old coal dock and the track stops there.\n\nI have known him six years. I would like to be wrong about what this is.'
      },
      {
        senderName: 'Dr. Ewan Thorne',
        senderEmail: 'e.thorne@pefd.globalparadigms.corp',
        timestamp: '2019-11-04 04:55 UTC',
        body: 'Henrik, board,\n\nI am not coming back to the station.\n\nBorehole 4 is not convection. It repeats on a 3,600 second cycle and it has not varied by more than four thousandths of a hertz in eleven weeks. Something down there is transmitting and we have been transmitting back since 1989, through the subway grids, every evening at six, and you signed the sheets.\n\nThe files are on fourteen servers. You can spend the next six months telling people I am a climate researcher with a head injury. It will not matter.',
        hasAttachment: true,
        attachmentName: 'Station07_Borehole4_RawCapture_Oct24.dat'
      },
      {
        senderName: 'Agent Paul Kiernan',
        senderEmail: 'p.kiernan@topn.globalparadigms.corp',
        timestamp: '2019-11-04 05:30 UTC',
        body: "Directive 09 invoked. Svalbard outbound throttled through the Nordic telecom agreement as of 05:10. Hash suppression running on the three main engines.\n\nLocal police briefed that a British researcher walked out into weather after an argument, which is close enough to true.\n\nTaking his brother's workstation in Postojna this morning. Note for the file: the brother is the archivist, he has keys to everything, and he will not be surprised."
      },
      {
        senderName: 'CEO Nigel Ashby',
        senderEmail: 'n.ashby@exec.globalparadigms.corp',
        timestamp: '2019-11-04 06:12 UTC',
        body: 'Paul - proceed with sanitisation. No statements, no briefings, nothing on the record at all.\n\nIf anyone asks about Spitsbergen, it is ice calving and gas hydrate venting. That wording has held up for thirty years and it will hold up now.\n\nHenrik - Borehole 4 closed and the inspection hatch welded by tonight please. And Henrik, this one goes on paper only, not on the network.'
      }
    ]
  },
  {
    id: 'eml-02',
    threadCode: 'EML-2011-OAKHAVEN-TERMINATION',
    subject: 'Oakhaven - we have stopped the trial',
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
        body: 'Harrison, Diane,\n\nWe pushed the modulation up 3dB at 16:30 for the evening peak and it went wrong inside four minutes. Round about 60% of the town stopped. Not panic, not running - stopped, in place, on the pavement and in their cars, facing north-northwest, for four minutes and twelve seconds. Dispatch took four hundred calls in twenty.\n\nI have cut the feed at the substation myself. No one is to re-energise the array until I have the logs. This is not a tuning fault. I do not yet know what it is.'
      },
      {
        senderName: 'Dr. Diane Kowalski',
        senderEmail: 'd.kowalski@bhrr.globalparadigms.corp',
        timestamp: '2011-09-18 20:35 EST',
        body: 'Teams at the Memorial Hospital from 20:00. Oral sedatives and dampeners, told the staff it is a water contamination event in the north district. Forty-two of them will need proper memory dampening, I am not doing that in a hospital corridor.\n\nNaomi - the ones who came round keep asking what the music was. Nobody played them music. I have stopped asking.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2011-09-18 22:45 EST',
        body: 'Transmitters off, understood, do not re-energise.\n\nStatement going out tonight: substation transformer fault after a lightning strike, low-frequency hum, no injuries, monitoring continues. Tribune staff are signing on Monday - fifty thousand each, plus the usual. Two of them asked for more and got it.\n\nNaomi, I would hold off on writing anything down for a week. When you write it, send it to me first.'
      }
    ]
  },
  {
    id: 'eml-03',
    threadCode: 'EML-2023-CHRONO-FEEDBACK',
    subject: 'the model is moving the market',
    date: '2023-03-14 09:15 GMT',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Dr. Thaddeus Holt',
        email: 't.holt@sfpc.globalparadigms.corp',
        role: 'Director, SFPC'
      },
      {
        name: 'Dr. Evelyn Reed',
        email: 'e.reed@sfpc.globalparadigms.corp',
        role: 'Deputy Director, Modelling'
      },
      {
        name: 'Helena Cross',
        email: 'h.cross@exec.globalparadigms.corp',
        role: 'Executive VP, Continuity'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Thaddeus Holt',
        senderEmail: 't.holt@sfpc.globalparadigms.corp',
        timestamp: '2023-03-14 07:45 GMT',
        body: 'Helena,\n\nThe anxiety index goes out at 06:00 and three funds trade it automatically. We predicted a gilt shock for Thursday. This morning they sold £4.2bn of gilts on the strength of it. Our Thursday number is now the thing that is going to happen on Thursday.\n\nI am not going to dress this up. The product has become the input. Closing the loop will take a code change I can push today.'
      },
      {
        senderName: 'Dr. Evelyn Reed',
        senderEmail: 'e.reed@sfpc.globalparadigms.corp',
        timestamp: '2023-03-14 08:30 GMT',
        body: 'Loop gain 1.44 as of the 08:00 run and climbing about 0.02 an hour. Thaddeus is right that we can damp it, but damping takes the noise injection out of the published series and the clients will notice a discontinuity within a week.\n\nEither we look broken or we look dishonest. I know which one Legal will prefer.'
      },
      {
        senderName: 'Helena Cross',
        senderEmail: 'h.cross@exec.globalparadigms.corp',
        timestamp: '2023-03-14 09:15 GMT',
        body: 'Take the external feed down now and put the maintenance banner up, no explanation beyond scheduled works. Buy the gilts back through the Zug entity at the discounted price, all of it, today.\n\nThaddeus - the discontinuity question is mine, not yours. Do not raise it in writing again.'
      }
    ]
  },
  {
    id: 'eml-04',
    threadCode: 'EML-2024-SITE19-FISSURE',
    subject: 'Sub-Level 6, sensor cluster B',
    date: '2024-08-20 16:04 MST',
    classification: 'Level 4 - Top Secret',
    participants: [
      { name: 'Frank Bedell', email: 'f.bedell@siso.globalparadigms.corp', role: 'Head of Security' },
      {
        name: 'Chief Engineer Sarah Lin',
        email: 's.lin@siso.globalparadigms.corp',
        role: 'Chief Engineer'
      },
      {
        name: 'Commander J. R. Calderon',
        email: 'jr.calderon@siso.globalparadigms.corp',
        role: 'Operations Commander'
      }
    ],
    messages: [
      {
        senderName: 'Chief Engineer Sarah Lin',
        senderEmail: 's.lin@siso.globalparadigms.corp',
        timestamp: '2024-08-20 14:15 MST',
        body: 'JR,\n\nCluster B logged a shear along the northern salt boundary at 13:40. Containment tone lost 6dB in Chamber 04, which is the wrong direction and a lot at once.\n\nI want 40,000 tons of polymer grout into the north gallery before the standing wave works its way up to the flats. At current attenuation Tooele County gets an audible 32Hz from the surface crust inside a fortnight. You know what that does.\n\nSarah'
      },
      {
        senderName: 'Frank Bedell',
        senderEmail: 'f.bedell@siso.globalparadigms.corp',
        timestamp: '2024-08-20 15:10 MST',
        body: 'Highway 196 closed since 14:00, culvert replacement, state DOT signage up and two of my people in DOT vests. Mixers coming in through Gate 3 with no markings, drivers briefed and phones collected.\n\nOne problem. Chamber 04 now has grout on the only door I am allowed to open. Sarah, if this gets worse the pump crew will be working against the leak instead of round it. I want that in the log before we start.'
      },
      {
        senderName: 'Commander J. R. Calderon',
        senderEmail: 'jr.calderon@siso.globalparadigms.corp',
        timestamp: '2024-08-20 16:04 MST',
        body: 'Approved. Start the pour at 18:00. Class-A headgear on everyone below Level 5, and anybody who takes it off goes to Yellowknife the same night, no exceptions and no argument with me at the gate.\n\nFrank - noted and logged. Thank you for putting it in writing.'
      }
    ]
  },
  {
    id: 'eml-05',
    threadCode: 'EML-2022-SWISS-ISOLATION',
    subject: 'Silent Cohort - we are out',
    date: '2022-01-15 10:00 CET',
    classification: 'Level 5 - Black Dossier',
    participants: [
      { name: 'Mara Finch', email: 'm.finch@ccdr.globalparadigms.corp', role: 'Director, CCDR' },
      { name: 'Martin Sedley', email: 'm.sedley@ccdr.globalparadigms.corp', role: 'Deputy Director' },
      {
        name: 'Dame Eleanor Cross',
        email: 'e.cross@board.globalparadigms.corp',
        role: 'Board President Emerita'
      }
    ],
    messages: [
      {
        senderName: 'Martin Sedley',
        senderEmail: 'm.sedley@ccdr.globalparadigms.corp',
        timestamp: '2022-01-15 08:30 CET',
        body: 'Mara, Dame Eleanor,\n\nDoor opened at 07:00 after 90 days. Nobody died and the air plant held, so on paper it is a success.\n\nFrom about day 45 we had 38% of the cohort reporting the same dream, same numbers each time they wrote it down: a black column standing in ice. They were drawing it before any of them had seen a photograph of Spitsbergen. Two subjects had to be brought out sedated at day 61 and I do not have a version of that sentence that makes the trial look good.\n\nThe carrier goes through 1,200 metres of granite. That is the finding. Everything else is administration.'
      },
      {
        senderName: 'Mara Finch',
        senderEmail: 'm.finch@ccdr.globalparadigms.corp',
        timestamp: '2022-01-15 09:15 CET',
        body: 'Martin - well done on getting them all out.\n\nDampening on the perimeter before a single Heritage Cohort principal sets foot in Grimsel. If granite does not stop it, I want two more metres of nothing between the residents and the mountain.\n\nPlease write the dream material up as a psychological observation, not a systems finding. It stays in the trial folder.'
      },
      {
        senderName: 'Dame Eleanor Cross',
        senderEmail: 'e.cross@board.globalparadigms.corp',
        timestamp: '2022-01-15 10:00 CET',
        body: 'This was recorded in Cambridge in 1969 and again in the Alps in 1979. It is not a symptom of isolation. It is the frequency finding an unshielded mind, which is precisely what these rooms are for and what the two of you have just demonstrated to the board.\n\nProceed with the secondary dampeners. Send me the drawings by post.'
      }
    ]
  },
  {
    id: 'eml-06',
    threadCode: 'EML-2024-LEAK-CONTAINMENT',
    subject: 'new mirror, .ch domain',
    date: '2024-05-12 18:22 GMT',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Agent Paul Kiernan',
        email: 'p.kiernan@topn.globalparadigms.corp',
        role: 'Special Agent, TOPN'
      },
      {
        name: 'Vincent Adeyemi',
        email: 'v.adeyemi@airs.globalparadigms.corp',
        role: 'Chief Redaction Officer'
      },
      {
        name: 'Philip Warrender',
        email: 'p.warrender@legal.globalparadigms.corp',
        role: 'General Counsel'
      }
    ],
    messages: [
      {
        senderName: 'Agent Paul Kiernan',
        senderEmail: 'p.kiernan@topn.globalparadigms.corp',
        timestamp: '2024-05-12 16:40 GMT',
        body: 'Both -\n\nMirror number fifteen came up this morning on a Swiss registrar. Same layout as the last four, so same person or same script. It has the Diego Garcia spectrums and the Reson-8 personnel dossiers, the 1994 set, unredacted.\n\nOur traffic analysis says the file has been pulled 211 times, which is low, but 34 of those came from inside our own network. I am not naming names until I have looked properly.'
      },
      {
        senderName: 'Philip Warrender',
        senderEmail: 'p.warrender@legal.globalparadigms.corp',
        timestamp: '2024-05-12 17:15 GMT',
        body: 'Injunction served on the registrar at 16:55, ex parte, security grounds. Domain redirects to the corporate 404 page within the hour.\n\nPaul, on the internal downloads: give me a list before you do anything to those accounts. There is a difference between curiosity and whatever this is, and I would rather we did not create thirty-four plaintiffs in one afternoon.'
      },
      {
        senderName: 'Vincent Adeyemi',
        senderEmail: 'v.adeyemi@airs.globalparadigms.corp',
        timestamp: '2024-05-12 18:22 GMT',
        body: 'Crawlers went out at 18:00. Anybody pulling the mirrored PDFs now gets our hash-substituted copies with the coordinates and dates stripped, so the leaks are still circulating but they mean less every hour.\n\nFor the record, the substitution is reversible on our side. The originals are all at Postojna. That is the fourth time I have written that sentence in an email this year and I would like somebody to confirm that it is not a problem.'
      }
    ]
  },
  {
    id: 'eml-07',
    threadCode: 'EML-2023-DIEGO-PULSE',
    subject: 'Hydrophone 12, 54Hz again',
    date: '2023-11-15 04:10 UTC',
    classification: 'Level 4 - Top Secret',
    participants: [
      { name: 'Kasper Vang', email: 'k.vang@asian.globalparadigms.corp', role: 'Hydrophone Engineer' },
      {
        name: 'Dr. Tariq Al-Mansoor',
        email: 't.almansoor@asian.globalparadigms.corp',
        role: 'Principal Oceanographer'
      },
      {
        name: 'Dr. Henrik Lindqvist',
        email: 'h.lindqvist@asian.globalparadigms.corp',
        role: 'Director, ASIAN'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Tariq Al-Mansoor',
        senderEmail: 't.almansoor@asian.globalparadigms.corp',
        timestamp: '2023-11-15 01:20 UTC',
        body: 'Henrik,\n\nRamp on Hydrophone 12 at 11:58 UTC, 54 to 78Hz over 64 seconds, plus 42dB on abyssal ambient. Fourth one this year and the fourth time it has been within half a percent of the last.\n\nDiego and Azores together put the source at 2,900km, at the base of the mantle. I have been doing this since 2003 and the honest version of my professional opinion is that we do not have a category for this.'
      },
      {
        senderName: 'Kasper Vang',
        senderEmail: 'k.vang@asian.globalparadigms.corp',
        timestamp: '2023-11-15 02:45 UTC',
        body: 'Not logging it in the public set, per standing instruction. Node 14 keeps its copy only.\n\nOne thing for the file. The sweep and the Svalbard carrier are locked to about one part in ten thousand. Whatever the two of them are, they are related. Somebody senior asked me in June to describe the Azores recording as a sediment event in my reports and I have done that since, and I would rather not keep doing it.'
      },
      {
        senderName: 'Dr. Henrik Lindqvist',
        senderEmail: 'h.lindqvist@asian.globalparadigms.corp',
        timestamp: '2023-11-15 04:10 UTC',
        body: 'Classify under Monolith, joint file with Svalbard, and copy nobody outside the three of us.\n\nKasper, keep writing sediment event. I know how it reads. Nigel wants a briefing in London on Thursday and I would rather he got it from me than from a file that describes what we are actually hearing.'
      }
    ]
  },
  {
    id: 'eml-08',
    threadCode: 'EML-2021-ATACAMA-OPTICAL',
    subject: 'ESO have noticed the shimmer',
    date: '2021-06-10 14:12 CLT',
    classification: 'Level 3 - Secret',
    participants: [
      { name: 'Diego Ramirez', email: 'd.ramirez@siso.globalparadigms.corp', role: 'Station Superintendent' },
      { name: 'Harrison Blake', email: 'h.blake@topn.globalparadigms.corp', role: 'Director, TOPN' },
      {
        name: 'Dr. Soraya Morales',
        email: 's.morales@asian.globalparadigms.corp',
        role: 'Deputy Director, Cartography'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Soraya Morales',
        senderEmail: 's.morales@asian.globalparadigms.corp',
        timestamp: '2021-06-10 11:30 CLT',
        body: 'Diego,\n\nESO director phoned the office landline, which means he does not have my email. With the 4.2Hz emitters at full power on a warm night the column bends starlight about 0.04 arcseconds and their adaptive optics cannot compensate for a distortion that does not move.\n\nHe has been calling it a fault in his own mirrors for two years. He has worked it out.'
      },
      {
        senderName: 'Diego Ramirez',
        senderEmail: 'd.ramirez@siso.globalparadigms.corp',
        timestamp: '2021-06-10 12:45 CLT',
        body: 'We cannot power down this week. The calibration sweep is what holds phase lock with Svalbard and if we drop out they lose the north conjunction, which puts us in front of the board on Monday.\n\nTell me which is worse, Harrison, because I have the array at 70% right now and I can hold it there until Friday.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2021-06-10 14:12 CLT',
        body: "Hold at 70%. The observatory gets jet stream shear as the explanation, and I will have a £500k grant offer for their adaptive optics programme on his desk by the end of the month. Diego, put that offer through my budget, not the station's.\n\nSoraya - please do not write the optics numbers into anything that leaves the station."
      }
    ]
  },
  {
    id: 'eml-09',
    threadCode: 'EML-2024-REDACTION-AUDIT',
    subject: 'Box AIRS-78-04',
    date: '2024-09-02 11:20 CET',
    classification: 'Level 3 - Secret',
    participants: [
      {
        name: 'Nora Beaumont',
        email: 'n.beaumont@airs.globalparadigms.corp',
        role: 'Digitisation Archivist'
      },
      {
        name: 'Vincent Adeyemi',
        email: 'v.adeyemi@airs.globalparadigms.corp',
        role: 'Chief Redaction Officer'
      }
    ],
    messages: [
      {
        senderName: 'Nora Beaumont',
        senderEmail: 'n.beaumont@airs.globalparadigms.corp',
        timestamp: '2024-09-02 09:40 CET',
        body: 'Mr Adeyemi,\n\nBox AIRS-78-04, board minutes 1978. Four pages in the middle of the binder were never barred. They are Sedley\'s handwriting and they describe a device he calls the Null Resonator, "to silence a man\'s voice inside fifty metres, without touching him".\n\nThere is a fourth name on the distribution list that has been painted out rather than barred, and the paint is lifting. The label says "the Anchor".\n\nDo you want toner tape over the four pages or do they go to the shredder? Sorry to ask, the procedure note does not cover pages that were missed on the first pass.'
      },
      {
        senderName: 'Vincent Adeyemi',
        senderEmail: 'v.adeyemi@airs.globalparadigms.corp',
        timestamp: '2024-09-02 11:20 CET',
        body: 'Do not scan them and do not tape them. Bring me the binder, in person, Sub-Level 2, this afternoon.\n\nNora - the paint lifting is not a redaction failure, it is a materials failure, and either way it is not yours to resolve. You will be booked in for a routine bio-harmonic review with Dr. Kowalski today. That is standard for anyone who handles pre-1980 material and it is nothing to do with what you found.'
      }
    ]
  },
  {
    id: 'eml-10',
    threadCode: 'EML-2023-AMNESIA-EVAL',
    subject: 'forgetfulness data - is anyone else worried about this',
    date: '2023-10-18 15:45 JST',
    classification: 'Level 4 - Top Secret',
    participants: [
      {
        name: 'Dr. Tobias Voss',
        email: 't.voss@becm.globalparadigms.corp',
        role: 'Director, BECM'
      },
      {
        name: 'Dr. Naomi Chen',
        email: 'n.chen@pefd.globalparadigms.corp',
        role: 'Director, PEFD'
      },
      {
        name: 'Dr. Brigitte Laroche',
        email: 'b.laroche@becm.globalparadigms.corp',
        role: 'Senior Analyst'
      }
    ],
    messages: [
      {
        senderName: 'Dr. Brigitte Laroche',
        senderEmail: 'b.laroche@becm.globalparadigms.corp',
        timestamp: '2023-10-18 13:10 JST',
        body: 'Tobias, Naomi -\n\nTen thousand office workers on Vesper-conditioned floors. Fare rise announcements and the emergency levy: 78% of them can recall being told, none of them can recall the number, and their stated satisfaction with the city budget goes up in the week after.\n\nCommercially this is the best result BECM has ever produced. I am attaching the retention curves because somebody should look at the part after the numbers.'
      },
      {
        senderName: 'Dr. Naomi Chen',
        senderEmail: 'n.chen@pefd.globalparadigms.corp',
        timestamp: '2023-10-18 14:30 JST',
        body: 'Brigitte - what is the 24-month curve. Specifically, do we have articulation deficits or motor ataxia showing up in the cohort, because you and I both know that a person who cannot recall a fare rise is also a person who does not recall a name.\n\nTobias, if the answer is yes we are proposing to put this into twenty more cities and I would want the executive to see the second page first.'
      },
      {
        senderName: 'Dr. Tobias Voss',
        senderEmail: 't.voss@becm.globalparadigms.corp',
        timestamp: '2023-10-18 15:45 JST',
        body: 'Naomi, the 24-month figures are inside tolerance when weekends are counted as silence intervals, which is how the protocol defines it and how I propose we keep defining it.\n\nGoing to the Executive Committee for the 2025 rollout. Both of you are on the distribution, which is the courtesy I am able to give you.'
      }
    ]
  },
  {
    id: 'eml-11',
    threadCode: 'EML-2024-TIKSI-THERMAL',
    subject: 'borehole 8 - warm',
    date: '2025-01-22 08:30 TIK',
    classification: 'Level 3 - Secret',
    participants: [
      { name: 'Roman Sleptsov', email: 'r.sleptsov@siso.globalparadigms.corp', role: 'Station Chief, Tiksi' },
      {
        name: 'Chief Engineer Sarah Lin',
        email: 's.lin@siso.globalparadigms.corp',
        role: 'Chief Engineer'
      }
    ],
    messages: [
      {
        senderName: 'Roman Sleptsov',
        senderEmail: 'r.sleptsov@siso.globalparadigms.corp',
        timestamp: '2025-01-22 06:15 TIK',
        body: 'Sarah,\n\nBorehole 8 at 9,000m went from -12C to +34C in 48 hours. Quartz sensors vibrating hard at 14.8, continuous, not the usual ticking. The permafrost round the rig is soft enough that the eastern leg has settled 40mm.\n\nRequest permission to vent nitrogen down the casing tonight. If it keeps going we lose the array and possibly the rig.\n\nRoman\n\nP.S. This is the third time I am reporting it. I have the previous two reports.'
      },
      {
        senderName: 'Chief Engineer Sarah Lin',
        senderEmail: 's.lin@siso.globalparadigms.corp',
        timestamp: '2025-01-22 08:30 TIK',
        body: 'Roman - nitrogen flush approved, keep it running and send me the pressure trace every four hours rather than daily.\n\nIf amplitude goes above 110dB, drop the shear plug, do not call and ask me first. I will square it afterwards.\n\nAnd keep the previous two reports. Somebody may want them one day and it should not be you who has to reconstruct them.'
      }
    ]
  },
  {
    id: 'eml-12',
    threadCode: 'EML-2024-DMCA-ENFORCEMENT',
    subject: 'sky trumpet takedowns - 1,420 today',
    date: '2024-04-05 17:00 EST',
    classification: 'Level 3 - Secret',
    participants: [
      { name: 'Chloe Fontaine', email: 'c.fontaine@pefd.globalparadigms.corp', role: 'Acoustic Forensics' },
      { name: 'Harrison Blake', email: 'h.blake@topn.globalparadigms.corp', role: 'Director, TOPN' }
    ],
    messages: [
      {
        senderName: 'Chloe Fontaine',
        senderEmail: 'c.fontaine@pefd.globalparadigms.corp',
        timestamp: '2024-04-05 15:30 EST',
        body: 'Harrison,\n\n1,420 notices went out today across the three platforms, Calgary and Munich uploads mainly. They are clips of the Boreas sweep, no question, the refraction signature is in the tail of every one of them.\n\nFor what it is worth, about a third of the files I was asked to action do not match any of our sweeps. I have flagged them as no action rather than take them down. Nobody has asked me what happened to those.'
      },
      {
        senderName: 'Harrison Blake',
        senderEmail: 'h.blake@topn.globalparadigms.corp',
        timestamp: '2024-04-05 17:00 EST',
        body: 'Good. Now get the science out in front of it: coronal mass ejection coupling, train braking echoes, frost quakes. Two seeded pieces in the German and Canadian outlets, Friday, and another one trailing the Munich footage specifically.\n\nOn the third of the files that do not match - carry on flagging them no action, and keep that list to yourself. There is no version of this where we explain what those are.'
      }
    ]
  },
  {
    id: 'eml-13',
    threadCode: 'EML-2025-HERITAGE-ENROLLMENT',
    subject: 'Cohort - 10,000 committed, cards in October',
    date: '2025-08-14 11:00 CET',
    classification: 'Level 5 - Black Dossier',
    participants: [
      { name: 'Mara Finch', email: 'm.finch@ccdr.globalparadigms.corp', role: 'Director, CCDR' },
      {
        name: 'CEO Nigel Ashby',
        email: 'n.ashby@exec.globalparadigms.corp',
        role: 'Chief Executive Officer'
      }
    ],
    messages: [
      {
        senderName: 'Mara Finch',
        senderEmail: 'm.finch@ccdr.globalparadigms.corp',
        timestamp: '2025-08-14 09:30 CET',
        body: 'Nigel, Helena,\n\nAll 10,000 seats across the fourteen redoubts are committed and the sovereign retainers come to £4.2bn a year, which is more than the whole continuity division costs to run, so on that measure the programme is finished and a success.\n\nTitanium-RFID cards go to the enrolled principals by diplomatic bag in October. Two things I want on the record. There are 3,400 secondary places and 90 of them are children under five, and the medical annex has nothing in it about children under five.'
      },
      {
        senderName: 'CEO Nigel Ashby',
        senderEmail: 'n.ashby@exec.globalparadigms.corp',
        timestamp: '2025-08-14 11:00 CET',
        body: 'Noted on the children. I will have the annex amended.\n\nOne item for allocation, and this is a board instruction, not mine: every secondary heir place is contingent on the 72-hour cognitive screen. In a Level 5 trigger, family members who do not synchronise do not come in - not Grimsel and not Woomera either.\n\nMara, I know you took three names off that list yourself in the spring. Please do not do that again.'
      }
    ]
  },
  {
    id: 'eml-14',
    threadCode: 'EML-2024-TERMINAL-BACKDOOR',
    subject: 'intranet console still live',
    date: '2024-11-20 23:14 UTC',
    classification: 'Level 4 - Top Secret',
    participants: [
      { name: 'David Wren', email: 'd.wren@sfpc.globalparadigms.corp', role: 'Systems Analyst' },
      {
        name: 'Agent Paul Kiernan',
        email: 'p.kiernan@topn.globalparadigms.corp',
        role: 'Special Agent, TOPN'
      }
    ],
    messages: [
      {
        senderName: 'David Wren',
        senderEmail: 'd.wren@sfpc.globalparadigms.corp',
        timestamp: '2024-11-20 22:45 UTC',
        body: 'Paul,\n\nThe old supervisor console is still answering. Anyone at Level 2 can reach it and the redaction filters do not run on that route at all; a colleague of mine read a Level 4 annex off it in September with nothing more than his normal login.\n\nI can have the thing closed tonight. I would rather not write the ticket, given how the last ticket I wrote about this went, so I am asking you instead.'
      },
      {
        senderName: 'Agent Paul Kiernan',
        senderEmail: 'p.kiernan@topn.globalparadigms.corp',
        timestamp: '2024-11-20 23:14 UTC',
        body: 'Leave it open and leave it alone, David. Every keystroke on that route comes to me and has done for two years. It is the best thing we have.\n\nClose the ticket and do not send this thread to anyone else. If you want a reason: the ones who go looking tell us more about themselves in ten minutes than a year of reviews would.'
      }
    ]
  }
];
