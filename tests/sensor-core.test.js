'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const SC = require('../sensor-core.js');
const VASTU_DATA = require(path.resolve(__dirname, '../vastu-data.js'));

const angDiff = (a, b) => Math.abs(SC.shortestDelta(a, b));

test('normalizeDeg never returns 360 and handles negatives / huge values', () => {
  assert.equal(SC.normalizeDeg(-1e-14), 0);
  assert.equal(SC.normalizeDeg(360), 0);
  assert.equal(SC.normalizeDeg(-90), 270);
  assert.equal(SC.normalizeDeg(725), 5);
  assert.ok(SC.normalizeDeg(-1e-300) < 360);
});

test('CircularEMA: crossing 359° → 0° never snaps through the opposite side', () => {
  const ema = new SC.CircularEMA({ alpha: 0.3 });
  let prev = ema.update(350);
  // sweep 350 → 370 (i.e. through North) in 1° steps
  for (let h = 351; h <= 370; h++) {
    const out = ema.update(h);
    assert.ok(angDiff(prev, out) < 5, `jump ${prev} → ${out} at raw ${h}`);
    prev = out;
  }
  // the naive linear mean of 359 and 1 is 180 — circular must be ~0
  const e2 = new SC.CircularEMA({ alpha: 0.5 });
  e2.update(359);
  assert.ok(angDiff(e2.update(1), 0) < 1.5);
});

test('CircularEMA: converges to a constant input and rejects NaN/Infinity', () => {
  const ema = new SC.CircularEMA({ alpha: 0.4 });
  ema.update(10);
  for (let i = 0; i < 60; i++) ema.update(200);
  assert.ok(angDiff(ema.heading, 200) < 0.01);
  const before = ema.heading;
  assert.equal(ema.update(NaN), before);
  assert.equal(ema.update(Infinity), before);
  assert.equal(ema.update('x'), before);
});

test('CircularEMA: attenuates ±3° jitter straddling North to the analytic EMA noise floor', () => {
  // Uniform ±3° noise → σ_in = 3/√3 ≈ 1.73°. EMA steady state: σ_out = σ_in·√(α/(2−α)).
  const alpha = 0.15;
  const sigmaIn = 3 / Math.sqrt(3);
  const sigmaOut = sigmaIn * Math.sqrt(alpha / (2 - alpha)); // ≈ 0.49°
  const ema = new SC.CircularEMA({ alpha });
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1; // deterministic
  let sumSq = 0, n = 0, worst = 0;
  for (let i = 0; i < 4000; i++) {
    const out = ema.update(SC.normalizeDeg(rnd() * 3)); // values wrap across 357°…3°
    if (i > 100) { const e = SC.shortestDelta(0, out); sumSq += e * e; n++; worst = Math.max(worst, Math.abs(e)); }
  }
  const rms = Math.sqrt(sumSq / n);
  assert.ok(Math.abs(rms - sigmaOut) < 0.08, `rms ${rms.toFixed(3)} vs analytic ${sigmaOut.toFixed(3)}`);
  assert.ok(rms < sigmaIn / 3, 'noise reduced by more than 3×');
  assert.ok(worst < 3, `output never exceeds the raw jitter amplitude (worst ${worst.toFixed(2)})`);
});

test('CircularEMA: reset() forgets history; exact 180° flip does not produce NaN', () => {
  const ema = new SC.CircularEMA({ alpha: 0.5 });
  ema.update(0);
  const out = ema.update(180);
  assert.ok(Number.isFinite(out));
  ema.reset();
  assert.equal(ema.heading, null);
  assert.equal(ema.update(123), 123);
});

test('unwrapToward keeps CSS rotation continuous', () => {
  assert.equal(SC.unwrapToward(723, 3), 723);               // 723 ≡ 3 (mod 360)
  assert.equal(SC.unwrapToward(719, 2), 722);               // forward through north
  assert.equal(SC.unwrapToward(-1, 359), -1);
  assert.equal(SC.unwrapToward(undefined, 90), 90);
});

test('PADAS_32 table is verified: 32 padas × exactly 11.25°, contiguous, correctly named', () => {
  const r = SC.verifyPadaTable(VASTU_DATA.PADAS_32);
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
  assert.equal(SC.PADA_SPAN, 11.25);
});

test('verifyPadaTable catches a corrupted table', () => {
  const bad = JSON.parse(JSON.stringify(VASTU_DATA.PADAS_32));
  bad[5].endDeg += 1;
  assert.equal(SC.verifyPadaTable(bad).ok, false);
  assert.equal(SC.verifyPadaTable(bad.slice(0, 31)).ok, false);
  const swapped = JSON.parse(JSON.stringify(VASTU_DATA.PADAS_32));
  [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
  assert.equal(SC.verifyPadaTable(swapped).ok, false);
});

test('getPadaIndex agrees with the table for every degree and boundary (incl. 0°/360°)', () => {
  const P = VASTU_DATA.PADAS_32;
  for (let h = 0; h < 360; h += 0.25) {
    const p = P[SC.getPadaIndex(h)];
    const s = p.startDeg % 360;
    const within = ((h - s) % 360 + 360) % 360;
    assert.ok(within >= 0 && within < 11.25, `heading ${h} → ${p.id}`);
  }
  assert.equal(P[SC.getPadaIndex(0)].id, 'N5');
  assert.equal(P[SC.getPadaIndex(-1e-14)].id, 'N5');          // legacy scan returned E1 here
  assert.equal(P[SC.getPadaIndex(359.999)].id, 'N4');
  assert.equal(P[SC.getPadaIndex(45)].id, 'E1');
  assert.equal(P[SC.getPadaIndex(44.999)].id, 'N8');
  assert.equal(P[SC.getPadaIndex(360)].id, 'N5');
  assert.equal(P[SC.getPadaIndex(90)].id, 'E5');
  assert.equal(P[SC.getPadaIndex(180)].id, 'S5');
  assert.equal(P[SC.getPadaIndex(270)].id, 'W5');
});

test('every 8/16-zone boundary lies on a pada boundary', () => {
  const bounds = new Set(VASTU_DATA.PADAS_32.map(p => p.startDeg % 360));
  for (const z of [...VASTU_DATA.ZONES_8, ...VASTU_DATA.ZONES_16]) {
    assert.ok(bounds.has(z.startDeg % 360), `${z.id} @ ${z.startDeg}`);
  }
});

test('evaluateTilt: warns above 15°, clears below 12° (hysteresis), uses worst axis', () => {
  assert.equal(SC.evaluateTilt(0, 0, false).warning, false);
  assert.equal(SC.evaluateTilt(15, 0, false).warning, false);   // exactly 15 is not "exceeds"
  assert.equal(SC.evaluateTilt(15.1, 0, false).warning, true);
  assert.equal(SC.evaluateTilt(0, -20, false).warning, true);   // roll counts, sign ignored
  assert.equal(SC.evaluateTilt(13, 0, true).warning, true);     // still warning (hysteresis)
  assert.equal(SC.evaluateTilt(11.9, 0, true).warning, false);
  assert.equal(SC.evaluateTilt(undefined, null, false).tilt, 0);
});
