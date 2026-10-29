// Klang der Musik-Werkstatt im Browser (Web Audio). Alles wird live aus Schwingungen erzeugt, es gibt keine Audiodateien
// und keine Anfragen ins Netz. Die Klänge sind einfach nachgebaut und klingen nicht wie echte Instrumente.
// Der Rauschanteil (Schlagzeug, Flöte) kommt aus einem festen Zahlengenerator, nicht aus Math.random (AGENTS.md, Zufall nur über rng).
import { scheduleScore, scoreSeconds } from './klang.js';

const SILENT = 0.0001;

/** Hüllkurve: Anstieg, Halten bis hold, Abklingen in release. Alles in Sekunden ab t. */
function envelope(param, t, peak, attack, hold, release) {
  const top = t + Math.max(attack, hold);
  param.setValueAtTime(SILENT, t);
  param.linearRampToValueAtTime(Math.max(peak, SILENT), t + attack);
  param.setValueAtTime(Math.max(peak, SILENT), top);
  param.exponentialRampToValueAtTime(SILENT, top + release);
  return top + release;
}

/** Eine Sekunde weißes Rauschen aus einem linearen Kongruenzgenerator. Immer dieselben Werte. */
function noiseBuffer(ctx) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let s = 12345;
  for (let i = 0; i < data.length; i += 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    data[i] = s / 2147483648 - 1;
  }
  return buffer;
}

let CURVE = null;
/** Kennlinie für die Verzerrung der E-Gitarre. */
function distortionCurve() {
  if (!CURVE) {
    CURVE = new Float32Array(257);
    for (let i = 0; i < CURVE.length; i += 1) CURVE[i] = Math.tanh((i / 128 - 1) * 8);
  }
  return CURVE;
}

function osc(ctx, type, freq, t, stop, detune = 0) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  o.start(t);
  o.stop(stop);
  return o;
}

/** Leises Vibrato: ein langsamer Schwinger verstimmt die Tonhöhe um wenige Cent. */
function vibrato(ctx, target, t, stop, rate, cents) {
  const lfo = osc(ctx, 'sine', rate, t, stop);
  const depth = ctx.createGain();
  depth.gain.value = cents;
  lfo.connect(depth).connect(target.detune);
}

const simple = (type, peak) => (c, out, t, d, f, v) => {
  const g = c.createGain();
  const end = envelope(g.gain, t, peak * v, 0.01, d, 0.08);
  osc(c, type, f, t, end + 0.05).connect(g).connect(out);
};

/** Stimmen: (Kontext, Ausgang, Start, Dauer, Frequenz, Lautstärke, Rauschen). */
const VOICE = {
  sine: simple('sine', 0.5),
  tri: simple('triangle', 0.45),
  saw: simple('sawtooth', 0.16),
  square: simple('square', 0.13),

  pluck(c, out, t, d, f, v) {
    const len = Math.min(d + 0.4, 1.6);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(f * 9, 9000), t);
    lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.35);
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.28 * v, t + 0.004);
    g.gain.exponentialRampToValueAtTime(SILENT, t + len);
    osc(c, 'sawtooth', f, t, t + len + 0.05).connect(lp).connect(g).connect(out);
  },

  cembalo(c, out, t, d, f, v) {
    const len = Math.min(d, 1) + 0.25;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.min(f * 6, 9000);
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.2 * v, t + 0.003);
    g.gain.exponentialRampToValueAtTime(SILENT, t + len);
    osc(c, 'sawtooth', f, t, t + len + 0.05).connect(lp).connect(g).connect(out);
  },

  organ(c, out, t, d, f, v) {
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.12 * v, 0.02, d, 0.08);
    [[1, 0.5], [2, 0.25], [3, 0.12]].forEach(([mult, level]) => {
      const part = c.createGain();
      part.gain.value = level;
      osc(c, 'sine', f * mult, t, end + 0.05).connect(part).connect(g);
    });
    g.connect(out);
  },

  flute(c, out, t, d, f, v, noise) {
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.4 * v, 0.06, d, 0.1);
    const main = osc(c, 'sine', f, t, end + 0.05);
    vibrato(c, main, t, end + 0.05, 5.2, 6);
    main.connect(g);
    const second = c.createGain();
    second.gain.value = 0.12;
    osc(c, 'sine', f * 2, t, end + 0.05).connect(second).connect(g);
    const breath = c.createBufferSource();
    breath.buffer = noise;
    breath.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = Math.min(f * 3, 8000);
    bp.Q.value = 1;
    const bg = c.createGain();
    bg.gain.value = 0.05;
    breath.connect(bp).connect(bg).connect(g);
    breath.start(t);
    breath.stop(end + 0.05);
    g.connect(out);
  },

  voice(c, out, t, d, f, v) {
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.38 * v, 0.08, d, 0.12);
    const src = osc(c, 'sawtooth', f, t, end + 0.05);
    vibrato(c, src, t, end + 0.05, 5.5, 10);
    [[700, 6, 1], [1100, 8, 0.6]].forEach(([freq, q, level]) => {
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = q;
      const lg = c.createGain();
      lg.gain.value = level;
      src.connect(bp).connect(lg).connect(g);
    });
    g.connect(out);
  },

  pad(c, out, t, d, f, v) {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1400;
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.1 * v, 0.06, d, 0.25);
    [-7, 7].forEach((cents) => osc(c, 'sawtooth', f, t, end + 0.05, cents).connect(lp));
    lp.connect(g).connect(out);
  },

  strings(c, out, t, d, f, v) {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2600;
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.09 * v, 0.08, d, 0.2);
    [-5, 5].forEach((cents) => osc(c, 'sawtooth', f, t, end + 0.05, cents).connect(lp));
    lp.connect(g).connect(out);
  },

  brass(c, out, t, d, f, v) {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 2, t);
    lp.frequency.linearRampToValueAtTime(Math.min(f * 7, 8000), t + 0.1);
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.13 * v, 0.04, d, 0.1);
    osc(c, 'sawtooth', f, t, end + 0.05).connect(lp).connect(g).connect(out);
  },

  bell(c, out, t, d, f, v) {
    const len = Math.min(2.5, d + 1.2);
    [[1, 1], [2.76, 0.5], [5.4, 0.28], [8.93, 0.14]].forEach(([ratio, level], i) => {
      const freq = f * ratio;
      if (freq > 14000) return;
      const g = c.createGain();
      const stop = t + len / (1 + i * 0.6);
      g.gain.setValueAtTime(SILENT, t);
      g.gain.linearRampToValueAtTime(0.2 * level * v, t + 0.003);
      g.gain.exponentialRampToValueAtTime(SILENT, stop);
      osc(c, 'sine', freq, t, stop + 0.05).connect(g).connect(out);
    });
  },

  gitarre(c, out, t, d, f, v) {
    const shaper = c.createWaveShaper();
    shaper.curve = distortionCurve();
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 3200;
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.09 * v, 0.005, d, 0.09);
    osc(c, 'sawtooth', f, t, end + 0.05).connect(shaper).connect(lp).connect(g).connect(out);
  },

  bass(c, out, t, d, f, v) {
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 700;
    const g = c.createGain();
    const end = envelope(g.gain, t, 0.5 * v, 0.01, d * 0.85, 0.12);
    osc(c, 'triangle', f, t, end + 0.05).connect(lp);
    osc(c, 'sine', f, t, end + 0.05).connect(lp);
    lp.connect(g).connect(out);
  },

  kick(c, out, t, d, f, v) {
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.9 * v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(SILENT, t + 0.35);
    const o = osc(c, 'sine', 150, t, t + 0.4);
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    o.connect(g).connect(out);
  },

  snare(c, out, t, d, f, v, noise) {
    const src = c.createBufferSource();
    src.buffer = noise;
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1200;
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.4 * v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(SILENT, t + 0.2);
    src.connect(hp).connect(g).connect(out);
    src.start(t);
    src.stop(t + 0.25);
    const body = c.createGain();
    body.gain.setValueAtTime(0.22 * v, t);
    body.gain.exponentialRampToValueAtTime(SILENT, t + 0.1);
    osc(c, 'sine', 190, t, t + 0.12).connect(body).connect(out);
  },

  hat(c, out, t, d, f, v, noise) {
    const src = c.createBufferSource();
    src.buffer = noise;
    const hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.18 * v, t + 0.002);
    g.gain.exponentialRampToValueAtTime(SILENT, t + Math.min(Math.max(d, 0.05), 0.12));
    src.connect(hp).connect(g).connect(out);
    src.start(t);
    src.stop(t + 0.15);
  },

  wood(c, out, t, d, f, v) {
    const g = c.createGain();
    g.gain.setValueAtTime(SILENT, t);
    g.gain.linearRampToValueAtTime(0.5 * v, t + 0.001);
    g.gain.exponentialRampToValueAtTime(SILENT, t + 0.07);
    osc(c, 'triangle', f, t, t + 0.1).connect(g).connect(out);
  }
};

/**
 * Spieler für ein Beispiel nach dem anderen. host ist das globale Fenster, damit Tests einen Ersatz geben können.
 * play() muss aus einem Tipp oder Klick heraus aufgerufen werden, sonst blockiert der Browser den Ton.
 */
export function createPlayer(host = globalThis) {
  const Ctx = host.AudioContext || host.webkitAudioContext;
  let ctx = null;
  let timer = null;
  let onEnd = null;

  function stop() {
    if (timer !== null) host.clearTimeout(timer);
    timer = null;
    if (ctx) {
      const closing = ctx;
      ctx = null;
      try {
        closing.close();
      } catch (error) {
        // Schon geschlossen: nichts zu tun.
      }
    }
    const done = onEnd;
    onEnd = null;
    if (done) done();
  }

  /** Spielt das Beispiel. Gibt false zurück, wenn der Browser keinen Ton erzeugen kann. */
  function play(score, done) {
    if (!Ctx) return false;
    stop();
    try {
      ctx = new Ctx();
      if (ctx.state === 'suspended' && typeof ctx.resume === 'function') ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      const limiter = ctx.createDynamicsCompressor();
      master.connect(limiter);
      limiter.connect(ctx.destination);
      const noise = noiseBuffer(ctx);
      const start = ctx.currentTime + 0.12;
      for (const e of scheduleScore(score)) {
        const make = Object.hasOwn(VOICE, e.voice) ? VOICE[e.voice] : null;
        if (make) make(ctx, master, start + e.t, e.d, e.freq, e.vel * e.gain, noise);
      }
      onEnd = done || null;
      timer = host.setTimeout(stop, (scoreSeconds(score) + 3) * 1000);
      return true;
    } catch (error) {
      stop();
      return false;
    }
  }

  return { play, stop };
}
