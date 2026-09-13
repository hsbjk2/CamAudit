import { useState, useRef, useCallback } from 'react';

export type SpeakerChannel = 'left' | 'right' | 'stereo' | null;

export function useSpeakerTest() {
  const [activeChannel, setActiveChannel] = useState<SpeakerChannel>(null);
  const [hasTested, setHasTested] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7); // default 70%
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeCleanupRef = useRef<(() => void) | null>(null);

  const stopActiveTone = useCallback(() => {
    if (activeCleanupRef.current) {
      activeCleanupRef.current();
      activeCleanupRef.current = null;
    }
    setActiveChannel(null);
  }, []);

  const playTone = useCallback((channel: 'left' | 'right' | 'stereo') => {
    try {
      // Stop any existing tone first
      stopActiveTone();

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Configure destination channel count for pure 2-channel stereo
      try {
        if (ctx.destination.maxChannelCount >= 2) {
          ctx.destination.channelCount = 2;
          ctx.destination.channelCountMode = 'explicit';
          ctx.destination.channelInterpretation = 'discrete';
        }
      } catch (e) {
        // Fallback gracefully on browsers that constrain destination modification
      }

      setActiveChannel(channel);
      setHasTested(true);

      const now = ctx.currentTime;
      const duration = 1.6;

      // Master output volume gain
      const masterGain = ctx.createGain();
      const targetVol = Math.max(0.05, Math.min(1.0, volume * 0.45));
      masterGain.gain.setValueAtTime(targetVol, now);

      // Create a 2-channel discrete merger node
      // Channel 0 = Left Ear, Channel 1 = Right Ear
      const merger = ctx.createChannelMerger(2);
      merger.channelCountMode = 'explicit';
      merger.channelInterpretation = 'discrete';
      merger.connect(ctx.destination);

      // Strict hardware-level channel connection:
      if (channel === 'left') {
        // Strictly output to merger input 0 (Left). Input 1 (Right) has NO signal.
        masterGain.connect(merger, 0, 0);
      } else if (channel === 'right') {
        // Strictly output to merger input 1 (Right). Input 0 (Left) has NO signal.
        masterGain.connect(merger, 0, 1);
      } else {
        // Stereo: route to both left (0) and right (1)
        masterGain.connect(merger, 0, 0);
        masterGain.connect(merger, 0, 1);
      }

      // Play 3 rhythmic pulses (Ding - Ding - Ding) with distinct frequency profiles
      // Left = 440 Hz (A4) base, Right = 660 Hz (E5) base, Stereo = 554 Hz (C#5) base
      const baseFreq = channel === 'left' ? 440 : channel === 'right' ? 660 : 554;
      const pulses = [
        { start: 0.05, len: 0.35, mult: 1.0 },
        { start: 0.45, len: 0.35, mult: 1.25 },
        { start: 0.85, len: 0.60, mult: 1.5 },
      ];

      const oscillators: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      pulses.forEach(({ start, len, mult }) => {
        const pulseGain = ctx.createGain();
        pulseGain.gain.setValueAtTime(0.0001, now + start);
        pulseGain.gain.exponentialRampToValueAtTime(1.0, now + start + 0.04);
        pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + start + len);
        pulseGain.connect(masterGain);
        gains.push(pulseGain);

        // Primary Sine Oscillator
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * mult, now + start);
        osc.connect(pulseGain);
        osc.start(now + start);
        osc.stop(now + start + len + 0.05);
        oscillators.push(osc);

        // Gentle harmonic triangle overtone for acoustic clarity
        const overtone = ctx.createOscillator();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(baseFreq * mult * 2, now + start);
        const harmGain = ctx.createGain();
        harmGain.gain.setValueAtTime(0.18, now + start);
        harmGain.connect(pulseGain);
        overtone.connect(harmGain);
        overtone.start(now + start);
        overtone.stop(now + start + len + 0.05);
        oscillators.push(overtone);
      });

      const cleanup = () => {
        oscillators.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch (e) {}
        });
        gains.forEach((g) => {
          try {
            g.disconnect();
          } catch (e) {}
        });
        try {
          masterGain.disconnect();
        } catch (e) {}
        try {
          merger.disconnect();
        } catch (e) {}
      };

      activeCleanupRef.current = cleanup;

      const timerId = setTimeout(() => {
        setActiveChannel((curr) => (curr === channel ? null : curr));
        activeCleanupRef.current = null;
      }, duration * 1000);

      return () => {
        clearTimeout(timerId);
        cleanup();
      };
    } catch (err) {
      console.warn('Audio synthesis for speaker test failed', err);
      setActiveChannel(null);
    }
  }, [volume, stopActiveTone]);

  return {
    activeChannel,
    hasTested,
    playTone,
    stopActiveTone,
    volume,
    setVolume,
  };
}
