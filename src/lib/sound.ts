/** Tiny WebAudio synth for cute retro sound effects — no audio files needed. */

export type Sfx = "pop" | "flip" | "match" | "miss" | "win" | "click" | "blow" | "unlock";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "square", vol = 0.06) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, vol = 0.08) {
  const c = getCtx();
  if (!c) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  gain.gain.value = vol;
  src.buffer = buffer;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function playSfx(name: Sfx) {
  switch (name) {
    case "pop":
      tone(880, 0, 0.08);
      tone(1320, 0.05, 0.1);
      break;
    case "click":
      tone(660, 0, 0.06, "triangle");
      break;
    case "flip":
      tone(520, 0, 0.06, "triangle");
      break;
    case "match":
      tone(784, 0, 0.1);
      tone(1046, 0.09, 0.14);
      break;
    case "miss":
      tone(330, 0, 0.12, "triangle");
      tone(262, 0.1, 0.14, "triangle");
      break;
    case "unlock":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.08, 0.14));
      break;
    case "win":
      [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.1, 0.18, "square", 0.05));
      break;
    case "blow":
      noise(0.5);
      break;
  }
}

/** Call from a user gesture so iOS allows audio later. */
export function unlockAudio() {
  getCtx();
}
