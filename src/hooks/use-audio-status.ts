import { useSyncExternalStore } from 'react';
import { gpcAudio, type AudioStatus } from '@/lib/audio/audio-engine';

/** Live playback status from the audio engine (artifact id + live-synth flag). */
export function useAudioStatus(): AudioStatus {
  return useSyncExternalStore(gpcAudio.subscribe, gpcAudio.getStatus, gpcAudio.getStatus);
}
