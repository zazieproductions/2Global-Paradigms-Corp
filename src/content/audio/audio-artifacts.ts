import type { AudioArtifact } from '@/types';

/**
 * Audio reel index. The transcripts are the record; the audio is a synthesis
 * and is labelled as such in the player. Timestamps in the transcripts are
 * the archivist's, not the recorder's, and do not always line up.
 */
export const AUDIO_ARTIFACTS: AudioArtifact[] = [
  {
    id: 'audio-01',
    code: 'ART-01-SVALBARD',
    title: 'Station 07 Sub-Permafrost Infrasound Capture',
    recordingDate: '2019-10-24 03:14:22 UTC',
    recordedAt: 'Nordic Acoustic Array (Station 07), Spitsbergen, Borehole 4 (-820m)',
    carrierFrequency: '14.8 Hz (Carrier) + 312 Hz Harmonic Warble',
    sampleRate: '48.0 kHz / 32-bit Floating Point',
    durationSeconds: 180,
    classification: 'Level 5 - Black Dossier',
    summary:
      "Thorne's copy of the deep sensor reel, taken off the archive server before he left. Three minutes of the carrier with the overtones on top of it, and a man talking to nobody.",
    transcript:
      '[00:00 - Low rumble comes up under the floor of the recording; 14.8Hz carrier and a 312Hz overtone]\n[00:15 - THORNE, close to the mic, almost a whisper]: "It is 03:14. Deep sensor, Borehole 4. Drilling stopped six hours ago and the amplitude has doubled since then. Listen to the phase. Listen to what the phase is doing."\n[00:45 - Cryostat pump cycles; the beating between the two tones speeds up and slows down again]\n[01:10 - THORNE]: "That is not an echo. An echo comes back. This one is still coming."\n[01:45 - Metallic ringing enters on the upper band; the log shows a 4.2C drop in the chamber in under a minute]\n[02:30 - THORNE]: "The board is being told it is gas venting. Permafrost gas venting. They have the same recording I do."',
    synthesisPreset: 'infrasound',
    audioDescription:
      'A deep steady hum near the floor of hearing, with a thin metallic tone over it that wavers about once every three seconds.',
    spectralNotes:
      'Clean peaks at 14.8Hz, 29.6Hz, 59.2Hz and 312Hz. Almost no seismic noise between the peaks, which is the odd part; ground recordings are never this tidy.'
  },
  {
    id: 'audio-02',
    code: 'ART-02-VESPER',
    title: 'Project Vesper Municipal Test Broadcast - Sector 9',
    recordingDate: '1989-11-03 18:00:00 GMT',
    recordedAt: 'Birmingham Municipal Transit Control Room, Sector 9 PA System',
    carrierFrequency: '432 Hz / 528 Hz / 639 Hz Tri-Tonal Harmonic Cluster',
    sampleRate: '44.1 kHz / 16-bit Master Tape Archive',
    durationSeconds: 160,
    classification: 'Level 4 - Top Secret',
    summary:
      'Quarter-inch tape from the first Vesper evening broadcast, eleven days before the borehole was sealed. The scheduled chime, the announcement, and the room going quiet underneath both.',
    transcript:
      '[00:00 - Tape hiss and motor flutter]\n[00:06 - Three-tone chime: 396Hz, 528Hz, 639Hz]\n[00:18 - Recorded voice, female, unaccented]: "Good evening. The 18:00 service is running to schedule. Please maintain orderly transit. GPC Civic Continuity wishes you a quiet evening."\n[00:42 - Sub-audible carrier begins under the platform noise, slow, about one cycle every three seconds]\n[01:15 - Footfall and conversation in the station drop away over the next ninety seconds until only the tape motor is audible]\n[01:50 - Chime repeats. Carrier is still running.]',
    synthesisPreset: 'vesperTone',
    audioDescription:
      'Three soft bell tones layered into one chord. Each drifts in volume at its own pace so the chord seems to breathe in and out.',
    spectralNotes:
      'Comb filtering across the 396-741Hz band. The sub-carrier pulses at 0.35Hz, which is a resting breathing rate and was chosen for that reason.'
  },
  {
    id: 'audio-03',
    code: 'ART-03-DIEGO',
    title: 'Diego Garcia Trench Hydrophone 12 Anomalous Deep Pulse',
    recordingDate: '2023-11-14 11:58:04 UTC',
    recordedAt: 'Indian Ocean Submerged Monitor (Station 09), Hydrophone 12 (-5,400m)',
    carrierFrequency: '54.0 Hz Mantle Harmonic Ramp',
    sampleRate: '96.0 kHz Deep Ocean Hydro-Telemetry',
    durationSeconds: 210,
    classification: 'Level 4 - Top Secret',
    summary:
      'Hydrophone reel from the 54Hz pulse, the one Node 14 heard again fourteen minutes later. Al-Mansoor is audible on the channel asking the same question four times in different words.',
    transcript:
      '[00:00 - Abyssal background; water noise, nothing else]\n[00:20 - 54Hz sine comes up out of the floor noise, smooth, no attack]\n[00:45 - Pitch ramps upward to 78Hz over forty-five seconds, then drops back to 54Hz between one sample and the next]\n[01:10 - AL-MANSOOR, on the comms channel]: "Node 12 confirms. Arrival angle eighty-four degrees from horizontal. It is coming up. Not along, up."\n[01:30 - AL-MANSOOR, further away from the mic]: "Say the time again. Say the time at Diego."\n[01:55 - Reverberation trails out across the basin and stops.]',
    synthesisPreset: 'hydrophone',
    audioDescription:
      'A low tone that slides upward in pitch over about four seconds, wrapped in filtered hiss, like an engine heard through deep water.',
    spectralNotes:
      'Sawtooth ramp repeating every 64 seconds. The file has been reviewed three times and the ramp has not drifted by so much as a hertz since the first analysis.'
  },
  {
    id: 'audio-04',
    code: 'ART-04-RESON8',
    title: 'Reson-8 Prototype Test Loop #4 (Uncensored Recovery)',
    recordingDate: '1993-04-18 23:45:00 EST',
    recordedAt: 'Rosslyn Sub-Complex, Acoustic Sleep Chamber 03',
    carrierFrequency: '216.0 Hz / 222.8 Hz (6.8 Hz Theta Binaural Beat)',
    sampleRate: '44.1 kHz / 16-bit Master DAT Tape',
    durationSeconds: 150,
    classification: 'Level 4 - Top Secret',
    summary:
      'Pre-release evaluation tape from the sleep chamber, taken from the DAT master before the 1994 recall. Test subject 14 is the only subject whose session was cut short by staff.',
    transcript:
      '[00:00 - Electronic tone in the left channel, 216Hz]\n[00:08 - Second tone in the right, 222.8Hz. The beat between them lands at 6.8Hz and is audible as a throb rather than a pitch]\n[00:30 - SUBJECT 14]: "I feel very heavy. My eyes will not hold on the clock."\n[01:00 - Pulse rate drops; 60Hz wall hum couples into the loop]\n[01:25 - SUBJECT 14, breathing fast]: "There is someone behind the bedroom door. Turn it off. The door is humming."\n[01:40 - Session cut by the supervising clinician. A chair is knocked over and is not picked up before the tape ends.]',
    synthesisPreset: 'reson8',
    audioDescription:
      'Two close mid-range tones beating against each other, a steady wobble about seven times a second.',
    spectralNotes:
      'Large cross-channel phase difference. Theta entrainment in headphone subjects within 45 seconds; the chamber report says the room itself did it at volume, without headphones, which is the finding that killed the product.'
  },
  {
    id: 'audio-05',
    code: 'ART-05-BLACKRIDGE',
    title: 'Black Ridge Appalachian Seismic Resonance ("Singing Seam")',
    recordingDate: '2020-08-12 14:22:00 EST',
    recordedAt: 'Appalachian Station 16, Black Ridge Mine Level 4 (-420m)',
    carrierFrequency: '42.0 Hz Deep Coal Seam Resonator',
    sampleRate: '48.0 kHz Geophone Recording',
    durationSeconds: 140,
    classification: 'Level 3 - Secret',
    summary:
      'Geophone recording from Level 4, taken when the hydraulic fluid hit a quartz fissure in the seam. The rig is shut down at 1:05 and the tone keeps going for another three minutes.',
    transcript:
      '[00:00 - Drill drone, and the rock shifting under it]\n[00:18 - Bit enters the seam; a 42Hz tone comes up through the wall and stays]\n[00:40 - ZIMMERMAN, off-mic, shouting over the rig]: "Do you hear that? That is the wall. Shut the rig down. Shut it down now."\n[01:05 - Drill stops. The tone is still there.]\n[01:30 - Overtones fold in above the fundamental, roughly in fifths, and hold]\n[02:20 - Recording ends with the seam still ringing.]',
    synthesisPreset: 'seismic',
    audioDescription:
      'A dark buzzing drone muffled almost to a growl with tape hiss under it, like a machine running a long way below the floor.',
    spectralNotes:
      "Very high Q in natural rock; the seam behaves as a cavity with more than twenty detectable overtones. Zimmerman's 2020 note described the interval as fifths and nobody acted on it."
  },
  {
    id: 'audio-06',
    code: 'ART-06-PALIMPSEST',
    title: 'Project Palimpsest Telemetry Burst & Encrypted Carrier',
    recordingDate: '2024-03-01 00:00:00 UTC',
    recordedAt: 'Postojna Caverns Secure Repository (Station 10), Main Data Beacon',
    carrierFrequency: '432 Hz Carrier + 1728 Hz FSK Data Bursts',
    sampleRate: '96.0 kHz Digital Cryptographic Master',
    durationSeconds: 190,
    classification: 'Level 5 - Black Dossier',
    summary:
      'The Postojna beacon, recorded off the internal fibre. It is a housekeeping channel that reads out document hashes aloud in a synthesised voice, which nobody at the operator desk has ever asked it to stop doing.',
    transcript:
      '[00:00 - 432Hz carrier, steady]\n[00:10 - Fast FSK burst, several seconds of it, then silence]\n[00:35 - SYNTHETIC VOICE, reading hashes]: "Zero Alpha Niner. Hash replacement confirmed for record 1994-RS8. Retrospective status: pure. Continuity maintained."\n[01:15 - Burst resumes; the carrier continues underneath]\n[02:40 - Carrier only, to end of file]',
    synthesisPreset: 'palimpsest',
    audioDescription:
      'A steady mid-range tone with a harsh high whine over it and light hiss, like an old modem line left open overnight.',
    spectralNotes:
      'Audio-frequency shift keying at 9600 baud. The embedded validation trees are the same ones the search endpoints check against, which is why an altered copy fails within seconds.'
  }
];
