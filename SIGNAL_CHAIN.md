# SIGNAL CHAIN — three linked ARG puzzles

**Where it lives:** sidebar → *ACOUSTICS & TELEMETRY* → **Signals & Intercepts** (and the
*Signals & Intercepts* jump-point in the dashboard's **INTERACTIVE ARG BACKDOORS** box).

Three off-book carriers held at **Station 23 (Gander Relay)**. Each one yields the key that
unseals the next. Keys are transmitted at the terminal (`~` / `GPC://CLI`) with `key <word>`,
or straight from the panel that recovered them.

| Stage | Carrier | Tool | Yields |
| ----- | ------- | ---- | ------ |
| 01 | `SIG-01-GANDER` — Gander Beacon Preamble | 620 Hz Morse keyer, hand key + live keying lamp, dot-dash readout | **Key one** — the name of the house |
| 02 | `SIG-02-RAVENSPORT` — Ravensport Numbers Carrier | 89 five-letter groups + live Vigenère workbench (tabula recta, legibility meter) | **Key two** — named inside its own decrypt |
| 03 | `SIG-03-HOLDTONE` — Hold-Tone Spectral Print | Waterfall spectrogram fed by real FFT of the Perpetual Hold-Tone Spiral | **Key three** — the word carried since 2006 |

## How each puzzle is built

**01 — Gander Beacon.** Hold the straight key (mouse/touch, or the `SPACE` bar) and the engine
sounds a 620 Hz sine for as long as you hold it; release length is classified against the
current PARIS timing unit (`< 1.8 units` = dot, longer = dash). The readout decodes as you send.
*TRANSMIT PREAMBLE* schedules the stored preamble through `scheduleMorseBursts()` and drives the
lamp/readout off the audio clock, so the lamp follows the tone exactly. Seven characters decode
to the house name.

**02 — Ravensport.** The traffic is real Vigenère ciphertext: 442 letters in 89 five-letter
groups, keyed on key one. Only the ciphertext is stored — `src/data/signalPuzzles.ts` has no
plaintext. The workbench decrypts live as you type, shows the repeated key under the cipher
stream, scores the output with an English trigram legibility heuristic, and can highlight any
character in a 26×26 tabula recta. The decoded traffic names its own authorisation word.

**03 — Spectral Print** (the showpiece). `startSpiral()` runs the carrier (148 Hz, slow ±6 Hz
drift) and schedules one short sine burst per lit cell of a 5×7 glyph, in seven frequency bins
between 700 and 1660 Hz. The canvas is fed by a **real FFT tap** (1024-point, 21 ms window) on the master bus —
the waterfall paints the actual audio, byte for byte. There is no image file: mute the archive
and the print stops painting. *HOLD PRINT* freezes the scroll so you can read it.

## Answers (spoilers)

1. **HALCYON** — Halcyon House, Cambridgeshire (GPC founding estate).
2. **PERSEPHONE** — the authorisation word, named twice in the Ravensport decrypt.
3. **QUIETUS** — painted by the waterfall; opens the Final Hold-Tone Disclosure and offers
   Level 5 / Black Dossier clearance.

## Re-keying the ladder

Everything is generated from one constant:

```ts
// src/data/signalPuzzles.ts
export const SIGNAL_KEYS = { one: 'HALCYON', two: 'PERSEPHONE', three: 'QUIETUS' };
```

Changing a value re-keys the Morse preamble, the dot-matrix print and the gate. If you change
key one you must also re-encrypt the Ravensport traffic and paste the new groups into
`RAVENSPORT_INTERCEPT.trafficGroups` (and keep the *AUTHORISATION WORD …* line in the plaintext
if you want stage 02 to keep naming key two):

```ts
import { vigenereEncrypt } from './src/lib/signalCiphers';
const groups = vigenereEncrypt(PLAINTEXT_LETTERS_ONLY, 'NEWKEY').match(/.{1,5}/g).join(' ');
```

## Terminal commands added

- `signals` — chain status: which carriers are sealed, how many keys recovered/transmitted.
- `key <word>` (alias `unseal`) — transmit a recovered pass-phrase at the gate.
- `gander` / `beacon` — Gander beacon dossier and preamble hint.

Progress (recovered keys, transmitted keys, print passes) persists in `localStorage` under
`gpc.signal.chain.v1`; *RESET CHAIN* in the stage switcher clears it.
