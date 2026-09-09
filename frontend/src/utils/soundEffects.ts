/**
 * FreshVault Twin - Web Audio API Sound Effects Synthesizer
 * =========================================================
 * Synthesizes realistic industrial SCADA alarms, warning chimes,
 * buzzer tones, and tactile clicks with 0 external MP3 dependencies.
 * Works 100% offline with zero latency.
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;
let activeAlarmInterval: number | null = null;

// Initialize or resume AudioContext safely after user gesture
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('[Sound] Web Audio API not supported or blocked:', e);
    return null;
  }
}

export function isAudioMuted(): boolean {
  try {
    const saved = localStorage.getItem('freshvault_audio_muted');
    if (saved !== null) {
      isMuted = saved === 'true';
    }
  } catch (e) {
    // Ignore storage errors
  }
  return isMuted;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
  try {
    localStorage.setItem('freshvault_audio_muted', muted ? 'true' : 'false');
  } catch (e) {}
  if (muted) {
    stopCriticalAlarm();
  }
}

export function toggleAudioMute(): boolean {
  const nextState = !isAudioMuted();
  setAudioMuted(nextState);
  return nextState;
}

/**
 * Plays a single tone beep with customizable frequency, duration, and wave type.
 */
function playTone(freq: number, durationSec: number, type: OscillatorType = 'sine', volume: number = 0.2): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationSec);
  } catch (e) {
    console.warn('[Sound] Tone error:', e);
  }
}

/**
 * 1. Industrial SCADA Critical Alarm Siren / Wokwi Piezo Buzzer (GPIO 18)
 * Alternating high-urgency pulses (880Hz / 660Hz) matching the Wokwi firmware.
 */
export function startCriticalAlarm(): void {
  if (isAudioMuted()) return;
  stopCriticalAlarm();

  const ctx = getAudioContext();
  if (!ctx) return;

  let toggle = false;
  const pulse = () => {
    if (isAudioMuted()) {
      stopCriticalAlarm();
      return;
    }
    const freq = toggle ? 880 : 660;
    playTone(freq, 0.22, 'square', 0.18);
    toggle = !toggle;
  };

  pulse();
  activeAlarmInterval = window.setInterval(pulse, 450);
}

export function stopCriticalAlarm(): void {
  if (activeAlarmInterval !== null) {
    clearInterval(activeAlarmInterval);
    activeAlarmInterval = null;
  }
}

/**
 * 2. Warning Alert Chime (Door ajar, thermal drift, solar shading)
 * Two-tone ascending chime (523Hz C5 -> 659Hz E5).
 */
export function playWarningAlert(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(523.25, 0.15, 'sine', 0.2);
  setTimeout(() => {
    playTone(659.25, 0.25, 'sine', 0.22);
  }, 120);
}

/**
 * 3. Nominal Reset / Safe Restore Harmonic Chime
 * Pleasant 3-tone harmonic arpeggio (440Hz -> 554Hz -> 659Hz).
 */
export function playRestoreChime(): void {
  if (isAudioMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(440, 0.12, 'triangle', 0.15);
  setTimeout(() => playTone(554.37, 0.12, 'triangle', 0.16), 90);
  setTimeout(() => playTone(659.25, 0.25, 'triangle', 0.18), 180);
}

/**
 * 4. Crisp Tactile Click for Pushbuttons
 */
export function playClickSound(): void {
  if (isAudioMuted()) return;
  playTone(1200, 0.03, 'triangle', 0.08);
}
