'use client';

import { useCallback, useRef } from 'react';

type SoundName = 'start' | 'hit' | 'bad' | 'miss' | 'heal' | 'boss' | 'tick' | 'end';

const soundPattern: Record<SoundName, Array<[number, number, number]>> = {
  start: [
    [440, 0.08, 0.08],
    [660, 0.1, 0.08],
    [880, 0.12, 0.08],
  ],
  hit: [
    [620, 0.06, 0.06],
    [920, 0.08, 0.05],
  ],
  bad: [
    [180, 0.13, 0.09],
    [120, 0.16, 0.08],
  ],
  miss: [[210, 0.14, 0.08]],
  heal: [
    [520, 0.08, 0.07],
    [780, 0.1, 0.07],
    [1040, 0.12, 0.06],
  ],
  boss: [
    [220, 0.08, 0.09],
    [440, 0.08, 0.08],
    [880, 0.14, 0.07],
  ],
  tick: [[760, 0.04, 0.045]],
  end: [
    [660, 0.12, 0.08],
    [392, 0.18, 0.08],
    [262, 0.22, 0.07],
  ],
};

export const useAudioEngine = (enabled: boolean) => {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return undefined;
    if (!contextRef.current) {
      contextRef.current = new window.AudioContext();
    }
    if (contextRef.current.state === 'suspended') {
      void contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const context = getContext();
      if (!context) return;

      let offset = 0;
      soundPattern[name].forEach(([frequency, duration, volume]) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = name === 'bad' || name === 'miss' ? 'sawtooth' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, context.currentTime + offset);
        gain.gain.setValueAtTime(0.0001, context.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + offset + duration,
        );
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(context.currentTime + offset);
        oscillator.stop(context.currentTime + offset + duration + 0.02);
        offset += duration * 0.72;
      });
    },
    [enabled, getContext],
  );

  return { play };
};
