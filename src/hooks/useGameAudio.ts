import { useCallback, useRef, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';

type SoundType =
  | 'cardFlip'
  | 'match'
  | 'mismatch'
  | 'victory'
  | 'defeat'
  | 'click'
  | 'correct'
  | 'wrong'
  | 'collect'
  | 'move'
  | 'drop'
  | 'perfect'
  | 'hint'
  | 'tick'
  | 'levelUp'
  | 'streak'
  | 'gameStart'
  | 'jump'
  | 'coin'
  | 'hurt'
  | 'pickup'
  | 'unlock';

// Synthesized sound definitions using Web Audio API
const soundConfigs: Record<SoundType, (ctx: AudioContext) => void> = {
  cardFlip: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  },

  match: (ctx) => {
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.25);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.25);
    });
  },

  mismatch: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  },

  victory: (ctx) => {
    const melody = [523, 659, 784, 1047]; // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  },

  defeat: (ctx) => {
    const melody = [392, 349, 311, 261]; // G4, F4, Eb4, C4
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.35);
      osc.start(ctx.currentTime + i * 0.2);
      osc.stop(ctx.currentTime + i * 0.2 + 0.35);
    });
  },

  click: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  },

  correct: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  },

  wrong: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  },

  collect: (ctx) => {
    const notes = [880, 1108]; // A5, C#6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.15);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.15);
    });
  },

  move: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  },

  drop: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  },

  perfect: (ctx) => {
    const notes = [659, 784, 988, 1319]; // E5, G5, B5, E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  },

  hint: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  },

  tick: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  },

  levelUp: (ctx) => {
    const melody = [392, 523, 659, 784, 1047]; // G4, C5, E5, G5, C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  },

  streak: (ctx) => {
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.15);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.15);
    });
  },

  gameStart: (ctx) => {
    const melody = [261, 329, 392, 523]; // C4, E4, G4, C5
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  },

  jump: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  },

  coin: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(988, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1319, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  },

  hurt: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  },

  pickup: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  },

  unlock: (ctx) => {
    const melody = [440, 554, 659, 880];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  },
};

// Pentatonic scale for ambient Egyptian music
const PENTATONIC_SCALE = [261.6, 293.7, 349.2, 392.0, 440.0, 523.3, 587.3, 698.5];

export function useGameAudio() {
  const { audioEnabled } = useGame();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{ oscillators: OscillatorNode[]; gains: GainNode[] } | null>(null);
  const ambientIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      soundConfigs[type](ctx);
    } catch (e) {
      // Silently fail if audio isn't available
    }
  }, [audioEnabled, getAudioContext]);

  const startAmbientMusic = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();

      // Drone bass note
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(130.8, ctx.currentTime); // C3
      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start();

      // Second drone for depth
      const drone2Osc = ctx.createOscillator();
      const drone2Gain = ctx.createGain();
      drone2Osc.type = 'sine';
      drone2Osc.frequency.setValueAtTime(196.0, ctx.currentTime); // G3
      drone2Gain.gain.setValueAtTime(0.025, ctx.currentTime);
      drone2Osc.connect(drone2Gain);
      drone2Gain.connect(ctx.destination);
      drone2Osc.start();

      ambientNodesRef.current = {
        oscillators: [droneOsc, drone2Osc],
        gains: [droneGain, drone2Gain],
      };

      // Play random pentatonic notes periodically
      ambientIntervalRef.current = setInterval(() => {
        if (!audioEnabled) return;
        const noteFreq = PENTATONIC_SCALE[Math.floor(Math.random() * PENTATONIC_SCALE.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2);
      }, 2500 + Math.random() * 2000);
    } catch (e) {
      // Silently fail
    }
  }, [audioEnabled, getAudioContext]);

  const stopAmbientMusic = useCallback(() => {
    if (ambientNodesRef.current) {
      ambientNodesRef.current.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { /* already stopped */ }
      });
      ambientNodesRef.current = null;
    }
    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientMusic();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [stopAmbientMusic]);

  // Stop music if audio gets disabled
  useEffect(() => {
    if (!audioEnabled) {
      stopAmbientMusic();
    }
  }, [audioEnabled, stopAmbientMusic]);

  return { playSound, startAmbientMusic, stopAmbientMusic };
}
