/**
 * KUBERAN Vastu Compass — sensor-core.js (v5.8.0)
 * Pure, DOM-free sensor-fusion helpers. Loaded as a browser global (`SensorCore`)
 * and importable from Node for unit tests (`require('./sensor-core.js')`).
 *
 *  - CircularEMA      : exponential moving average of sin/cos, reconstructed via atan2
 *                       (no 359°→0° snap, no linear-averaging artefacts).
 *  - Pada geometry    : O(1) 32-Pada lookup + a verifier for the PADAS_32 table.
 *  - evaluateTilt     : pitch/roll warning with hysteresis (no flicker at the threshold).
 *  - unwrapToward     : keeps the dial's CSS rotation continuous (no 360° spin on freeze).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SensorCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var RAD = Math.PI / 180;
  var DEG = 180 / Math.PI;

  /** Normalise any angle to [0, 360). Never returns 360 (even for -1e-14). */
  function normalizeDeg(angle) {
    var n = ((angle % 360) + 360) % 360;
    return n >= 360 ? 0 : n;
  }

  /** Signed shortest rotation from `from` to `to`, in (-180, 180]. */
  function shortestDelta(from, to) {
    var d = ((to - from + 540) % 360 + 360) % 360 - 180;
    return d === -180 ? 180 : d;
  }

  /**
   * Return an angle equivalent to `targetDeg` that is the nearest to `prevUnwrapped`.
   * Used so a CSS `rotate()` that has a transition never takes the long way round.
   */
  function unwrapToward(prevUnwrapped, targetDeg) {
    var prev = Number.isFinite(prevUnwrapped) ? prevUnwrapped : 0;
    return prev + shortestDelta(prev, targetDeg);
  }

  /**
   * Circular exponential moving average.
   * s ← s + α(sin θ − s),  c ← c + α(cos θ − c),  heading = atan2(s, c)
   */
  function CircularEMA(options) {
    options = options || {};
    this.alpha = options.alpha != null ? options.alpha : 0.3;
    this.minMagnitude = options.minMagnitude != null ? options.minMagnitude : 1e-3;
    this.s = null;
    this.c = null;
    this.heading = null;
  }

  CircularEMA.prototype.reset = function () {
    this.s = null;
    this.c = null;
    this.heading = null;
  };

  /**
   * @param {number} headingDeg   raw heading (any real number, degrees)
   * @param {number} [alpha]      per-call gain override in (0, 1]
   * @returns {number|null}       smoothed heading in [0, 360), or the previous value if input invalid
   */
  CircularEMA.prototype.update = function (headingDeg, alpha) {
    if (typeof headingDeg !== 'number' || !isFinite(headingDeg)) return this.heading;
    var rad = headingDeg * RAD;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    if (this.s === null) {
      this.s = s;
      this.c = c;
    } else {
      var a = alpha != null ? alpha : this.alpha;
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      this.s += a * (s - this.s);
      this.c += a * (c - this.c);
      // A perfect 180° flip at α = 0.5 cancels the vector: re-seed on the newest sample
      if (Math.hypot(this.s, this.c) < this.minMagnitude) {
        this.s = s;
        this.c = c;
      }
    }
    this.heading = normalizeDeg(Math.atan2(this.s, this.c) * DEG);
    return this.heading;
  };

  // ─── 32-Pada geometry ────────────────────────────────────────────────
  var PADA_COUNT = 32;
  var PADA_SPAN = 360 / PADA_COUNT; // 11.25° (exactly representable in binary floating point)
  var PADA_ORIGIN_DEG = 45;         // E1 (Śikhī) begins at the NE corner and runs clockwise
  var PADA_WALLS = ['E', 'S', 'W', 'N'];

  /** O(1) index into PADAS_32 for a heading. */
  function getPadaIndex(headingDeg, originDeg) {
    var origin = originDeg != null ? originDeg : PADA_ORIGIN_DEG;
    var idx = Math.floor(normalizeDeg(normalizeDeg(headingDeg) - origin) / PADA_SPAN);
    return idx >= PADA_COUNT ? PADA_COUNT - 1 : idx < 0 ? 0 : idx;
  }

  /**
   * Verify the PADAS_32 table: 32 entries, every pada spans exactly 11.25°,
   * contiguous clockwise from 45°, ids E1..E8,S1..S8,W1..W8,N1..N8, no duplicates.
   * @returns {{ok: boolean, errors: string[]}}
   */
  function verifyPadaTable(padas, originDeg) {
    var errors = [];
    var origin = originDeg != null ? originDeg : PADA_ORIGIN_DEG;
    var EPS = 1e-9;
    if (!Array.isArray(padas) || padas.length !== PADA_COUNT) {
      errors.push('expected ' + PADA_COUNT + ' padas, got ' + (padas ? padas.length : 'none'));
      return { ok: false, errors: errors };
    }
    var seen = {};
    padas.forEach(function (p, i) {
      var id = p && p.id;
      var expId = PADA_WALLS[Math.floor(i / 8)] + ((i % 8) + 1);
      var expStart = normalizeDeg(origin + i * PADA_SPAN);
      var expEnd = normalizeDeg(origin + (i + 1) * PADA_SPAN);
      if (id !== expId) errors.push('index ' + i + ': id "' + id + '" should be "' + expId + '"');
      if (p.pada !== undefined && p.pada !== expId) errors.push(expId + ': pada field "' + p.pada + '" mismatch');
      if (Math.abs(normalizeDeg(p.startDeg) - expStart) > EPS) errors.push(id + ': startDeg ' + p.startDeg + ' should be ' + expStart);
      if (Math.abs(normalizeDeg(p.endDeg) - expEnd) > EPS) errors.push(id + ': endDeg ' + p.endDeg + ' should be ' + expEnd);
      var span = (((p.endDeg - p.startDeg) % 360) + 360) % 360 || 360;
      if (Math.abs(span - PADA_SPAN) > EPS) errors.push(id + ': span ' + span + '° should be ' + PADA_SPAN + '°');
      if (seen[id]) errors.push('duplicate id ' + id);
      seen[id] = true;
    });
    return { ok: errors.length === 0, errors: errors };
  }

  // ─── Tilt warning ────────────────────────────────────────────────────
  var TILT_WARN_DEG = 15;
  var TILT_CLEAR_DEG = 12; // hysteresis: warning clears only below this

  /**
   * @param {number} pitchDeg  beta (screen-rotation adjusted)
   * @param {number} rollDeg   gamma (screen-rotation adjusted)
   * @param {boolean} wasWarning previous warning state (for hysteresis)
   */
  function evaluateTilt(pitchDeg, rollDeg, wasWarning, warnDeg, clearDeg) {
    var warn = warnDeg != null ? warnDeg : TILT_WARN_DEG;
    var clear = clearDeg != null ? clearDeg : TILT_CLEAR_DEG;
    var tilt = Math.max(Math.abs(pitchDeg || 0), Math.abs(rollDeg || 0));
    return { tilt: tilt, warning: wasWarning ? tilt > clear : tilt > warn };
  }

  return {
    normalizeDeg: normalizeDeg,
    shortestDelta: shortestDelta,
    unwrapToward: unwrapToward,
    CircularEMA: CircularEMA,
    PADA_COUNT: PADA_COUNT,
    PADA_SPAN: PADA_SPAN,
    PADA_ORIGIN_DEG: PADA_ORIGIN_DEG,
    getPadaIndex: getPadaIndex,
    verifyPadaTable: verifyPadaTable,
    TILT_WARN_DEG: TILT_WARN_DEG,
    TILT_CLEAR_DEG: TILT_CLEAR_DEG,
    evaluateTilt: evaluateTilt
  };
});
