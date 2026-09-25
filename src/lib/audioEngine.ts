// Global Paradigms Corp. - Audio Engine & Procedural Synthesizer
// Web Audio API implementation with real-time waveform & spectrum analysis

class GpcAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private activeGains: GainNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private isSoundEnabled: boolean = true;
  private currentPlayingId: string | null = null;
  private animFrameId: number | null = null;
  private liveSynthNodes: {
    osc?: OscillatorNode;
    modOsc?: OscillatorNode;
    modGain?: GainNode;
    filter?: BiquadFilterNode;
    gain?: GainNode;
  } = {};

  constructor() {
    // Lazy initialize on first interaction
  }

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
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
  public playUiSound(type: 'click' | 'keystroke' | 'grant' | 'deny' | 'unredact' | 'scan' | 'alarm' | 'print') {
    if (!this.isSoundEnabled) return;
    this.resume();
    if (!this.ctx || !this.masterGain) return;

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
    this.noiseNode = noise;
    this.activeOscillators.push(noise);
    this.activeGains.push(noiseGain);
  }

  private createPinkNoiseNode(): AudioBufferSourceNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
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
    this.noiseNode = null;
    this.currentPlayingId = null;
  }

  public getPlayingArtifactId(): string | null {
    return this.currentPlayingId;
  }

  // Live frequency synthesizer tool
  public startLiveSynth(freq: number, wave: OscillatorType, modFreq: number, modDepth: number, resonance: number) {
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

  public stopLiveSynth() {
    if (this.liveSynthNodes.osc) {
      try {
        this.liveSynthNodes.osc.stop();
        this.liveSynthNodes.osc.disconnect();
      } catch {}
    }
    if (this.liveSynthNodes.modOsc) {
      try {
        this.liveSynthNodes.modOsc.stop();
        this.liveSynthNodes.modOsc.disconnect();
      } catch {}
    }
    this.liveSynthNodes = {};
  }

  // Get real-time audio analysis data
  public getFrequencyData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as any);
    } else {
      // Mock idle telemetry if audio context not running
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.sin(i * 0.1 + Date.now() * 0.002) * 15 + 20);
      }
    }
  }

  public getTimeDomainData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array as any);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = 128 + Math.floor(Math.sin(i * 0.2 + Date.now() * 0.003) * 12);
      }
    }
  }
}

export const gpcAudio = new GpcAudioEngine();
