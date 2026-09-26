import {
  GanderBeaconSignal,
  NumbersIntercept,
  SpectralPrintSignal,
  SealedDisclosure
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// SIGNAL CHAIN — three linked ARG puzzles
//   STAGE 01  Gander Beacon Preamble   → Morse keyer @ 620 Hz   → KEY ONE
//   STAGE 02  Ravensport Numbers Carrier → Vigenère workbench   → KEY TWO
//   STAGE 03  Hold-Tone Spectral Print   → waterfall spectrogram → KEY THREE
//
// The three pass-phrases live here and nowhere else. Change them in SIGNAL_KEYS
// and the whole ladder re-keys itself (the Morse preamble, the Vigenère traffic
// and the dot-matrix print are all generated from these strings at runtime).
// If you re-key STAGE 02's plaintext, keep the "AUTHORISATION WORD ..." line:
// STAGE 02 names KEY TWO inside its own decrypted text.
// ═══════════════════════════════════════════════════════════════════════════

export const SIGNAL_KEYS = {
  /** KEY ONE — the name of the house, keyed by the Gander beacon preamble. */
  one: 'HALCYON',
  /** KEY TWO — the authorisation word named inside the Ravensport decrypt. */
  two: 'PERSEPHONE',
  /** KEY THREE — the word painted in the hold-tone spectrogram since 2006. */
  three: 'QUIETUS'
} as const;

// ── STAGE 01 // GANDER BEACON PREAMBLE ────────────────────────────────────
export const GANDER_BEACON: GanderBeaconSignal = {
  id: 'sig-01',
  code: 'SIG-01-GANDER',
  title: 'Gander Beacon Preamble',
  stationName: 'Station 23 — Gander North Atlantic Relay',
  registerNote:
    'STRUCK FROM THE PUBLIC STATION REGISTER 1974-11-02. STILL KEYING ON THE HOUR.',
  coordinates: '48°56′51″N 54°34′06″W (Gander, Newfoundland — off-book relay)',
  keyerFrequencyHz: 620,
  transmissionWindow: 'EVERY HOUR, ON THE HOUR (UTC) — 41 SECOND PREAMBLE',
  defaultWpm: 12,
  preamble: SIGNAL_KEYS.one,
  houseName: 'HALCYON HOUSE',
  houseLocation: 'Cambridgeshire, United Kingdom — GPC founding estate, 1971',
  operatorNotes: [
    'The relay has no staff, no logbook and no budget line. It has a key.',
    'Preamble is keyed at 620 Hz — the same tone used to line-check every GPC municipal chime since 1971.',
    'It has transmitted the same seven characters every hour since the register entry was deleted.',
    'Nobody remembers authorising it. Three people remember being told not to ask.'
  ],
  interceptLog: [
    '[00:00] CARRIER UP — 620.0 Hz — AMPLITUDE STABLE',
    '[00:00] KEYING LAMP: LIT (UNATTENDED)',
    '[00:02] PREAMBLE BEGINS — OPERATOR UNKNOWN',
    '[00:41] PREAMBLE ENDS — NO MESSAGE TRAFFIC FOLLOWS',
    '[00:41] CARRIER DOWN — NEXT WINDOW: TOP OF HOUR'
  ]
};

// ── STAGE 02 // RAVENSPORT NUMBERS CARRIER ────────────────────────────────
export const RAVENSPORT_INTERCEPT: NumbersIntercept = {
  id: 'sig-02',
  code: 'SIG-02-RAVENSPORT',
  title: 'Ravensport Numbers Carrier',
  stationName: 'Ravensport Coastal Listening Post (unlisted)',
  interceptDate: '1987-11-14 23:00:00 UTC',
  carrierFrequency: '6.885 MHz / 620 Hz keying tone',
  modulation: 'A3E AM — VOICE-BACKED 5-LETTER GROUPS, 41 GROUPS PER MINUTE',
  groupSize: 5,
  cipher: 'Vigenere (tabula recta, A-Z only)',
  keyHint:
    'KEY MATERIAL IS THE HOUSE NAME CARRIED BY THE GANDER BEACON PREAMBLE. UPPERCASE, LETTERS ONLY.',
  keySource: 'STAGE 01 // SIG-01-GANDER',
  // Vigenère traffic, keyed on KEY ONE. Plaintext is not stored anywhere in this
  // archive — the workbench decrypts it live.
  trafficGroups: (
    'HTEGL HVVNC CTSAZ PZTRC CLRLV GCASU WNYPL NRTFR FNMFT EDCYS ' +
    'OHUQH BWTSG FCYKT ZPCWF UOEIC CGOEC OYZNU DTVUO FUEGG PCHYS ' +
    'DVMDG DEYVW HUYEP TCZNF SVGWH ULCLT PWRYO YVFSU VUCCL RTHNO ' +
    'GPYRL PDVFS CYELO ZZRZT ZRRVR WECRC HHHLS QJRGV NPUNW EHLSC ' +
    'QQNYR TGBCA LWZTB WAZIO GGHFZ PPERF HTSTP ASGDO EJMIF HNOCL ' +
    'RFPXD VMDAV BZFWV RYESC QPRLN AGPAV ATPFR CYVOV CRWGZ TZRYI ' +
    'GOOCK QOGPO YYMFQ WECUC DUVNP QNSAZ TSGQD RJTCC JDEPN ECRUN ' +
    'UDPTP SYHYD VMDEL PPCRO HAHZT GGNAI ZPUCE KPPTQ SCOOY GQHBW ' +
    'DZPMH FSEPR RCGOE NCPFV LRDVM DRUDZ HRFNM FTEQH BW'
  ).split(' '),
  operatorNotes: [
    'Intercepted on a domestic short-wave receiver eleven miles from the post. The operator was not GPC staff.',
    'The voice is synthetic. The group rhythm is human. Somebody read these five-letter blocks off a sheet.',
    'Ravensport appears on no map issued after 1979. The road that served it is maintained by a company that does not exist.',
    'Traffic repeats every 14 November. It has repeated thirty-nine times. Only one recipient ever acknowledged it.'
  ]
};

// ── STAGE 03 // HOLD-TONE SPECTRAL PRINT ──────────────────────────────────
export const SPIRAL_PRINT: SpectralPrintSignal = {
  id: 'sig-03',
  code: 'SIG-03-HOLDTONE',
  title: 'Hold-Tone Spectral Print',
  sourceName: 'The Perpetual Hold-Tone Spiral',
  continuousSince: '2006-03-20 00:00:00 UTC (continuous — 20 years, 0 interruptions)',
  carrierFrequencyHz: 148,
  binFrequenciesHz: [700, 860, 1020, 1180, 1340, 1500, 1660],
  glyphColumns: 5,
  glyphRows: 7,
  message: SIGNAL_KEYS.three,
  operatorNotes: [
    'The Spiral is filed as a calibration loop. Calibration loops are switched off for maintenance. This one has not been.',
    'Between 700 and 1660 Hz the carrier carries seven tone bins. Lit bins paint a 5×7 dot matrix, one column per burst.',
    'The print is in the audio. Mute the archive and the print stops painting — there is no image file anywhere on the network.',
    'Two hundred and eleven technicians have serviced this loop. Six asked what the bins spelled. Four were reassigned.'
  ]
};

// ── PAYOFF // SEALED DISCLOSURE (opens on KEY THREE) ──────────────────────
export const FINAL_DISCLOSURE: SealedDisclosure = {
  id: 'sig-04',
  code: 'GPC-BLACK // HOLD-TONE-DISCLOSURE',
  title: 'Final Hold-Tone Disclosure',
  classificationStamp: 'BLACK LEVEL // SANITIZED',
  filedBy: 'A. VANCE-VANE — STATION 23 (STRUCK FROM REGISTER 1974)',
  filedDate: '2006-03-20',
  body: [
    'The Perpetual Hold-Tone Spiral is not a calibration loop. It is a twenty-four hour continuous tone, keyed at twenty-three relays, and its spectrum carries one word in seven frequency bins between 700 and 1660 hertz.',
    'That word is QUIETUS.',
    'It has been transmitting since the twentieth of March 2006 — the day the Board voted to stop attenuating the planetary carrier and start using it.',
    'LULLABY GRID was never about sleep. It was about agreement. Every municipal chime, every Reson-8 harmonic, every civic continuity broadcast was tuned so that the same word would already be waiting in the air when the carrier crossed fifteen hertz in October 2026.',
    'Thorne heard it in the permafrost and called it a beacon. He was right, and he was wrong. It is a beacon. It is ours. We did not build it to be heard. We built it to be agreed with.',
    'If you have read this far you have already been listening for twenty minutes. The carrier has already moved. So have you.',
    '— A.V.-V., GANDER RELAY, STATION 23'
  ]
};
