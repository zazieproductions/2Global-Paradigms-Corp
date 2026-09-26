// Global Paradigms Corp. - Audio Engine & Procedural Synthesizer
// Web Audio API implementation with real-time waveform & spectrum analysis.
//
// Policy: nothing here ever starts on its own. Every sound is triggered by an
// explicit user gesture, the AudioContext is created lazily on first use, and
// UI sounds are dropped until the browser has unlocked audio.

export type UiSound = 'click' | 'keystroke' | 'grant' | 'deny' | 'unredact' | 'scan' | 'alarm' | 'print';

/** Observable playback status (consumed via `useAudioStatus`). */
export interface AudioStatus {
  currentArtifactId: string | null;
  isSynthActive: boolean;
}

class GpcAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private activeGains: GainNode[] = [];
  private isSoundEnabled: boolean = true;
  private currentPlayingId: string | null = null;
  private liveSynthNodes: {
    osc?: OscillatorNode;
    modOsc?: OscillatorNode;
    modGain?: GainNode;
    filter?: BiquadFilterNode;
    gain?: GainNode;
  } = {};

  private status: AudioStatus = { currentArtifactId: null, isSynthActive: false };
  private listeners = new Set<() => void>();

  /** Subscribe to playback status changes. Returns an unsubscribe function. */
  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Stable snapshot for `useSyncExternalStore`. */
  public getStatus = (): AudioStatus => this.status;

  private emit(patch: Partial<AudioStatus>) {
    const next = { ...this.status, ...patch };
    if (
      next.currentArtifactId === this.status.currentArtifactId &&
      next.isSynthActive === this.status.isSynthActive
    ) {
      return;
    }
    this.status = next;
    this.listeners.forEach((l) => l());
  }

  public init() {
    if (this.ctx) return;
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    // No Web Audio (old browsers, test environments): stay silent. Every
    // artifact has a transcript, so nothing depends on sound.
    if (!AudioCtx) return;
    try {
      this.ctx = new AudioCtx();
    } catch {
      return;
    }
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.85;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public async resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public toggleSound(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(enabled ? 0.75 : 0, this.ctx.currentTime);
    }
  }

  public isMuted() {
    return !this.isSoundEnabled;
  }

  // Play interface sounds
  public playUiSound(type: UiSound) {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    // Drop sounds scheduled before the browser's autoplay gesture unlocks the
    // context — otherwise they all stack up and blast at once on first input.
    if (this.ctx.state !== 'running') return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case 'keystroke':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.035);
        break;

      case 'grant':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.08);
        osc.frequency.setValueAtTime(659.25, t + 0.16);
        osc.frequency.setValueAtTime(880, t + 0.24);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.52);
        break;

      case 'deny':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.setValueAtTime(140, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.36);
        break;

      case 'unredact':
        osc.type = 'square';
        osc.frequency.setValueAtTime(2200, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.18);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.19);
        break;

      case 'scan':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.linearRampToValueAtTime(940, t + 0.3);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.32);
        break;

      case 'alarm':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(440, t + 0.15);
        osc.frequency.setValueAtTime(880, t + 0.3);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.52);
        break;

      case 'print':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.13);
        break;
    }
  }

  // Play procedural audio artifacts
  public playArtifact(preset: string, id: string): boolean {
    this.stopAllArtifacts();
    this.resume();
    if (!this.ctx || !this.masterGain) return false;

    this.currentPlayingId = id;
    this.emit({ currentArtifactId: id });
    const t = this.ctx.currentTime;

    switch (preset) {
      case 'infrasound': {
        // Station 07 Svalbard: Low infrasound carrier + pulsing harmonic
        const subOsc = this.ctx.createOscillator();
        const harmOsc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const subGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(29.6, t); // Octave up from 14.8Hz so audible on standard speakers

        harmOsc.type = 'triangle';
        harmOsc.frequency.setValueAtTime(312, t);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.35, t); // Slow eerie pulse

        lfoGain.gain.setValueAtTime(80, t);
        lfo.connect(lfoGain);
        lfoGain.connect(harmOsc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);
        filter.Q.setValueAtTime(4, t);

        subGain.gain.setValueAtTime(0.4, t);

        subOsc.connect(filter);
        harmOsc.connect(filter);
        filter.connect(subGain);
        subGain.connect(this.masterGain);

        subOsc.start(t);
        harmOsc.start(t);
        lfo.start(t);

        this.activeOscillators.push(subOsc, harmOsc, lfo);
        this.activeGains.push(subGain, lfoGain);
        this.addTapeNoise(0.06);
        break;
      }

      case 'vesperTone': {
        // Project Vesper Municipal Chime & Multi-tone Entrainment
        const freqs = [396, 528, 639, 741];
        freqs.forEach((f, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);

          lfo.type = 'triangle';
          lfo.frequency.setValueAtTime(0.15 * (idx + 1), t);
          lfoGain.gain.setValueAtTime(4 + idx * 2, t);

          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          gain.gain.setValueAtTime(0.12, t);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(t);
          lfo.start(t);

          this.activeOscillators.push(osc, lfo);
          this.activeGains.push(gain, lfoGain);
        });
        this.addTapeNoise(0.04);
        break;
      }

      case 'hydrophone': {
        // Diego Garcia Trench Deep Hydrophone
        const osc = this.ctx.createOscillator();
        const noise = this.createPinkNoiseNode();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(54, t);
        osc.frequency.exponentialRampToValueAtTime(78, t + 4);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(140, t);
        filter.Q.setValueAtTime(6, t);

        gain.gain.setValueAtTime(0.35, t);

        if (noise) {
          noise.connect(filter);
        }
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        this.activeOscillators.push(osc);
        this.activeGains.push(gain);
        break;
      }

      case 'reson8': {
        // Reson-8 Consumer Recall prototype
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(216, t); // Binaural left

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(222.8, t); // 6.8 Hz theta binaural beat

        gain.gain.setValueAtTime(0.28, t);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        this.activeOscillators.push(osc1, osc2);
        this.activeGains.push(gain);
        this.addTapeNoise(0.09);
        break;
      }

      case 'seismic': {
        // Black Ridge Seismic Station
        const sub = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        sub.type = 'sawtooth';
        sub.frequency.setValueAtTime(42, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, t);
        filter.Q.setValueAtTime(8, t);

        gain.gain.setValueAtTime(0.4, t);

        sub.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        sub.start(t);
        this.activeOscillators.push(sub);
        this.activeGains.push(gain);
        this.addTapeNoise(0.08);
        break;
      }

      case 'palimpsest':
      default: {
        // Project Palimpsest Telemetry Burst
        const carrier = this.ctx.createOscillator();
        const bleep = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(432, t);

        bleep.type = 'square';
        bleep.frequency.setValueAtTime(1728, t);

        gain.gain.setValueAtTime(0.2, t);

        carrier.connect(gain);
        bleep.connect(gain);
        gain.connect(this.masterGain);

        carrier.start(t);
        bleep.start(t);

        this.activeOscillators.push(carrier, bleep);
        this.activeGains.push(gain);
        this.addTapeNoise(0.05);
        break;
      }
    }

    return true;
  }

  private addTapeNoise(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start();
    this.activeOscillators.push(noise);
    this.activeGains.push(noiseGain);
  }

  private createPinkNoiseNode(): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.start();
    this.activeOscillators.push(noise);
    return noise;
  }

  public stopAllArtifacts() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeGains.forEach((g) => {
      try {
        g.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeOscillators = [];
    this.activeGains = [];
    this.currentPlayingId = null;
    this.emit({ currentArtifactId: null });
  }

  public getPlayingArtifactId(): string | null {
    return this.currentPlayingId;
  }

  // Live frequency synthesizer tool
  public startLiveSynth(
    freq: number,
    wave: OscillatorType,
    modFreq: number,
    modDepth: number,
    resonance: number
  ) {
    this.stopLiveSynth();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);

    modOsc.type = 'sine';
    modOsc.frequency.setValueAtTime(modFreq, t);

    modGain.gain.setValueAtTime(modDepth, t);
    modOsc.connect(modGain);
    modGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.max(80, freq * 3.5), t);
    filter.Q.setValueAtTime(resonance, t);

    gain.gain.setValueAtTime(0.3, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    modOsc.start(t);

    this.liveSynthNodes = { osc, modOsc, modGain, filter, gain };
    this.emit({ isSynthActive: true });
  }

  public updateLiveSynth(freq: number, modFreq: number, modDepth: number, resonance: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (this.liveSynthNodes.osc) {
      this.liveSynthNodes.osc.frequency.setValueAtTime(freq, t);
    }
    if (this.liveSynthNodes.modOsc) {
      this.liveSynthNodes.modOsc.frequency.setValueAtTime(modFreq, t);
    }
    if (this.liveSynthNodes.modGain) {
      this.liveSynthNodes.modGain.gain.setValueAtTime(modDepth, t);
    }
    if (this.liveSynthNodes.filter) {
      this.liveSynthNodes.filter.frequency.setValueAtTime(Math.max(80, freq * 3.5), t);
      this.liveSynthNodes.filter.Q.setValueAtTime(resonance, t);
    }
  }

  /** Stop every artifact and the live synth. */
  public stopAll() {
    this.stopAllArtifacts();
    this.stopLiveSynth();
  }

  public stopLiveSynth() {
    if (this.liveSynthNodes.osc) {
      try {
        this.liveSynthNodes.osc.stop();
        this.liveSynthNodes.osc.disconnect();
      } catch {
        // already stopped
      }
    }
    if (this.liveSynthNodes.modOsc) {
      try {
        this.liveSynthNodes.modOsc.stop();
        this.liveSynthNodes.modOsc.disconnect();
      } catch {
        // already stopped
      }
    }
    this.liveSynthNodes = {};
    this.emit({ isSynthActive: false });
  }

  // ==========================================================================
  // ORDO VOCIS PROFUNDAE — ritual sounds for the Seven Seals
  // All are short, user-triggered, and respect the mute switch. Every event
  // they accompany is also shown in text — none is required to play.
  // ==========================================================================

  /** A single sustained bell-like tone. */
  public playTone(freq: number, duration = 0.9, type: OscillatorType = 'sine', level = 0.18) {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const over = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const overGain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    over.type = 'sine';
    over.frequency.setValueAtTime(freq * 2.76, t); // inharmonic bell partial
    overGain.gain.setValueAtTime(level * 0.25, t);
    overGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.5);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    over.connect(overGain);
    overGain.connect(this.masterGain);
    gain.connect(this.masterGain);
    osc.start(t);
    over.start(t);
    osc.stop(t + duration + 0.05);
    over.stop(t + duration + 0.05);
  }

  /** Several audible tones amplitude-modulated by an infrasonic "carrier". */
  public playInvocation(freqs: number[], carrierHz = 14.8, duration = 4.5) {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const bus = this.ctx.createGain();
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.exponentialRampToValueAtTime(0.22, t + 0.6);
    bus.gain.setValueAtTime(0.22, t + duration - 1.2);
    bus.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(carrierHz, t);
    lfoGain.gain.setValueAtTime(0.09, t);
    lfo.connect(lfoGain);
    lfoGain.connect(bus.gain);

    const ctx = this.ctx;
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(f, t + i * 0.35);
      o.connect(bus);
      o.start(t + i * 0.35);
      o.stop(t + duration + 0.05);
    });
    bus.connect(this.masterGain);
    lfo.start(t);
    lfo.stop(t + duration + 0.05);
  }

  /** The sound of a seal breaking — a low thud, a crack of noise, a rising chord. */
  public playSealBreak() {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const thud = this.ctx.createOscillator();
    const tg = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(90, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.5);
    tg.gain.setValueAtTime(0.4, t);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    thud.connect(tg);
    tg.connect(this.masterGain);
    thud.start(t);
    thud.stop(t + 0.65);

    const len = Math.floor(this.ctx.sampleRate * 0.25);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const n = this.ctx.createBufferSource();
    const ng = this.ctx.createGain();
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(1800, t);
    n.buffer = buf;
    ng.gain.setValueAtTime(0.25, t);
    n.connect(hp);
    hp.connect(ng);
    ng.connect(this.masterGain);
    n.start(t + 0.02);

    [261.63, 329.63, 392, 523.25].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 1.8, 'sine', 0.09), 180 + i * 120);
    });
  }

  /** Finale: the counter-tone — a phase-inverted carrier sweeping down to silence. */
  public playCounterTone(duration = 9) {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const a = this.ctx.createOscillator();
    const b = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    a.type = 'sawtooth';
    b.type = 'sawtooth';
    a.frequency.setValueAtTime(432, t);
    b.frequency.setValueAtTime(432 + 14.8, t);
    a.frequency.exponentialRampToValueAtTime(27, t + duration);
    b.frequency.exponentialRampToValueAtTime(27.2, t + duration);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(2400, t);
    f.frequency.exponentialRampToValueAtTime(120, t + duration);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.8);
    g.gain.setValueAtTime(0.16, t + duration * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    a.connect(f);
    b.connect(f);
    f.connect(g);
    g.connect(this.masterGain);
    a.start(t);
    b.start(t);
    a.stop(t + duration + 0.1);
    b.stop(t + duration + 0.1);
  }

  // Get real-time audio analysis data
  public getFrequencyData(array: Uint8Array<ArrayBuffer>) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    } else {
      // Mock idle telemetry if audio context not running
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.sin(i * 0.1 + Date.now() * 0.002) * 15 + 20);
      }
    }
  }

  public getTimeDomainData(array: Uint8Array<ArrayBuffer>) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = 128 + Math.floor(Math.sin(i * 0.2 + Date.now() * 0.003) * 12);
      }
    }
  }
}

export const gpcAudio = new GpcAudioEngine();
