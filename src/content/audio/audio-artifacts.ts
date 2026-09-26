import type { AudioArtifact } from '@/types';

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
      'Leaked by Dr. Aris Thorne prior to his disappearance. The raw audio capture documents the planetary 14.8Hz carrier tone modulated by unexplained non-stochastic acoustic pulses coming from deep within the permafrost.',
    transcript:
      '[00:00 - Heavy low-frequency subterranean rumble enters; 14.8Hz carrier present with 312Hz overtone]\n[00:15 - Thorne, whispering]: "It is 03:14. Station 07 deep sensor. The drilling stopped six hours ago, but the frequency has doubled in amplitude. Listen to the phase shift..."\n[00:45 - Mechanical cryostat pump cycles; rhythmic harmonic beating accelerates]\n[01:10 - Thorne]: "It isn’t an echo. The bedrock isn’t reflecting it—the bedrock is generating it. The whole plateau is vibrating in fifths."\n[01:45 - High-frequency metallic ringing enters; sudden anomalous drop in ambient room temperature logged at -4.2C]\n[02:30 - Thorne]: "They are telling the Board it’s permafrost gas venting. They know it isn’t gas. They know what’s under the ice."',
    synthesisPreset: 'infrasound',
    audioDescription:
      'A deep, steady hum just above the threshold of hearing, with a thin metallic tone that slowly wavers in pitch about once every three seconds.',
    spectralNotes:
      'Fourier spectrum shows sharp mathematical peaks at 14.8Hz, 29.6Hz, 59.2Hz, and 312Hz. Note the complete absence of random seismic noise; wave is extraordinarily coherent.'
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
      'Archived 1/4-inch magnetic tape recording of the initial Project Vesper evening broadcast. Disguised as routine chime announcements across central subway stations, the audio was tested for civilian crowd pacification.',
    transcript:
      '[00:00 - Tape hiss and vintage analog magnetic flutter]\n[00:06 - Three-tone chime sequence plays: 396Hz -> 528Hz -> 639Hz]\n[00:18 - Synthetic female voice]: "Good evening. The 18:00 commuter service is running on scheduled intervals. Please maintain orderly transit. Avoid unnecessary agitation. GPC Civic Continuity assures your evening passage."\n[00:42 - Sub-audible carrier begins pulsing at 0.35 Hz underneath background subway ambience]\n[01:15 - Background crowd chatter audibly decreases by approximately 14dB in volume over 90 seconds]\n[01:50 - Chime sequence repeats; carrier tone fades into room resonance]',
    synthesisPreset: 'vesperTone',
    audioDescription:
      'Three soft, bell-like sine tones layered into a chord. Each drifts gently in volume at its own slow rate, so the chord seems to breathe.',
    spectralNotes:
      'Comb filtering visible across 396Hz-741Hz Solfeggio intervals. The sub-carrier pulses at 0.35Hz, precisely matching human resting parasympathetic respiratory rate.'
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
      'Deep-ocean hydrophone recording capturing a rhythmic 54Hz upward-sweeping acoustic pulse originating from the lithospheric mantle beneath the Chagos Archipelago.',
    transcript:
      '[00:00 - Abyssal ocean background hum; deep pressure water noise]\n[00:20 - Low 54Hz sine wave emerges smoothly above ocean floor noise floor]\n[00:45 - Frequency smoothly ramps upwards to 78Hz over 45 seconds before dropping instantaneously to 54Hz]\n[01:10 - Hydro-acoustic analyst Dr. Al-Mansoor]: "Node 12 telemetry confirmed. Arrival angle is 84 degrees from horizontal—it is coming almost straight up from the seabed crust."\n[01:55 - Distant oceanic reverberation trails off across a 600km acoustic basin radius]',
    synthesisPreset: 'hydrophone',
    audioDescription:
      'A low tone that glides upward in pitch over about four seconds, wrapped in a soft wash of filtered hiss, like a distant engine heard through deep water.',
    spectralNotes:
      'Spectrogram reveals a clean sawtooth frequency ramp repeating every 64 seconds. Unprecedented consistency for non-anthropogenic geological sound.'
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
      'Recovered audio test tape from the pre-release evaluation of the Reson-8 sleep machine. Demonstrates the unstable 6.8Hz theta beat that precipitated the 1994 consumer recall.',
    transcript:
      '[00:00 - High-pitched electronic tone starts in left channel (216Hz)]\n[00:08 - Second tone enters in right channel (222.8Hz); binaural beating creates visceral 6.8Hz throb in head]\n[00:30 - Test Subject 14]: "I feel very heavy. My eyes won\'t focus on the clock."\n[01:00 - Pulse rate modulates; parasitic 60Hz wall wiring hum couples into circuit]\n[01:25 - Test Subject 14, panicked breathing]: "Someone is standing behind the bedroom door. Turn the machine off. The door is humming."\n[01:40 - Test abruptly cut off by lab supervisor Dr. Chen]',
    synthesisPreset: 'reson8',
    audioDescription:
      'Two close mid-range tones that beat against each other, producing a steady throbbing wobble roughly seven times per second.',
    spectralNotes:
      'Intense cross-channel phase difference. Produces involuntary theta brainwave entrainment within 45 seconds of stereo headphone listening.'
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
      'Geophone recording from deep within the Black Ridge Appalachian coal strata. Captures harmonic acoustic singing produced when high-pressure hydraulic fluid intersected an anomalous natural quartz fissure.',
    transcript:
      '[00:00 - Distant mechanical drilling drone and deep seismic crunching]\n[00:18 - Drill penetrates coal seam; sudden resonant 42Hz fundamental sings through rock face]\n[00:40 - Geologist Dr. Zimmerman]: "Did you hear that? The whole wall is ringing like a church bell. Shut down the drill rig!"\n[01:05 - Drill stops, but the 42Hz tone sustains for 3 minutes without mechanical excitation]\n[01:30 - Acoustic harmonics fold into rich choral overtone series]',
    synthesisPreset: 'seismic',
    audioDescription:
      'A dark, buzzing drone muffled almost to a growl, with faint tape hiss underneath, like a machine running far below ground.',
    spectralNotes:
      'Extremely high Q-factor resonance in natural rock strata. Bedrock acting as a giant acoustic cavity with over 20 distinct harmonic overtones.'
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
      'Continuous cryptographic data beacon broadcast through GPC internal fiber networks. Contains real-time checksums of redacted documents and automated scrubbing instructions.',
    transcript:
      '[00:00 - High-pitched sine wave carrier (432Hz)]\n[00:10 - Rapid frequency-shift keying (FSK) data burst pulses: high-speed data transmission]\n[00:35 - Synthetic voice reading cryptographic hex hashes]: "Zero-Alpha-Niner. Hash replacement confirmed for Record 1994-RS8. Retrospective status: Pure. Continuity maintained."\n[01:15 - Burst carrier resumes with steady pulse telemetry]',
    synthesisPreset: 'palimpsest',
    audioDescription:
      'A steady mid-range tone layered with a harsh, buzzy high-pitched whine and light tape hiss, like an old modem line left open.',
    spectralNotes:
      'Telemetry data rate is 9600 baud encoded via audio frequency shifts. Contains embedded SHA-256 validation trees.'
  }
];
