const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const stabilizerCode = `
/**
 * Vastu Compass Smooth & Freeze Engine
 * Solves endless jittering on stationary devices.
 */
class CompassStabilizer {
    constructor(options = {}) {
        this.alpha = options.alpha || 0.15;
        this.deadzone = options.deadzone || 0.8;
        this.lockThreshold = options.lockThreshold || 1.2;
        this.lockDuration = options.lockDuration || 2000;
        
        this.currentHeading = null;
        this.targetHeading = null;
        this.lastRenderedHeading = 0;
        
        this.motionHistory = [];
        this.isLocked = false;
        this.animFrameId = null;

        this.onHeadingChange = options.onHeadingChange || null;
    }

    updateRawHeading(rawHeading) {
        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) return;

        let normalized = (rawHeading % 360 + 360) % 360;

        if (this.currentHeading === null) {
            this.currentHeading = normalized;
            this.targetHeading = normalized;
            if (this.onHeadingChange) this.onHeadingChange(this.currentHeading);
            return;
        }

        this.targetHeading = normalized;
        this.checkStationaryStatus(normalized);

        if (!this.animFrameId) {
            this.animFrameId = requestAnimationFrame(() => this.processLoop());
        }
    }

    getShortestAngleDelta(from, to) {
        from = (from % 360 + 360) % 360;
        to = (to % 360 + 360) % 360;
        let diff = (to - from + 180) % 360 - 180;
        return diff < -180 ? diff + 360 : diff;
    }

    checkStationaryStatus(heading) {
        const now = Date.now();
        this.motionHistory.push({ heading, time: now });
        this.motionHistory = this.motionHistory.filter(item => now - item.time <= this.lockDuration);

        if (this.motionHistory.length > 5) {
            const headings = this.motionHistory.map(m => m.heading);
            let minDelta = 0;
            let maxDelta = 0;
            const ref = headings[0];
            for (let i = 1; i < headings.length; i++) {
                let d = this.getShortestAngleDelta(ref, headings[i]);
                if (d < minDelta) minDelta = d;
                if (d > maxDelta) maxDelta = d;
            }
            const totalSpread = maxDelta - minDelta;
            this.isLocked = totalSpread < this.lockThreshold;
        }
    }

    processLoop() {
        if (this.isLocked) {
            this.animFrameId = null;
            return;
        }

        let delta = this.getShortestAngleDelta(this.currentHeading, this.targetHeading);

        if (Math.abs(delta) < this.deadzone) {
            this.animFrameId = null;
            return;
        }

        // Accumulate angle to prevent CSS backward spinning
        this.currentHeading = this.currentHeading + delta * this.alpha;

        if (Math.abs(this.currentHeading - this.lastRenderedHeading) >= 0.1) {
            this.lastRenderedHeading = this.currentHeading;
            if (this.onHeadingChange) {
                this.onHeadingChange(this.currentHeading);
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.processLoop());
    }
}

const stabilizer = new CompassStabilizer({
    alpha: 0.12,
    deadzone: 0.7,
    lockThreshold: 1.2,
    onHeadingChange: (smoothedH) => {
        smoothedHeading = smoothedH;
        let calibratedHeading = smoothedHeading + calibrationOffset;
        let trueHeading = calibratedHeading;
        if (isTrueNorth) {
          trueHeading = calibratedHeading + magneticDeclination;
        }
        updateHeadingUI(trueHeading);
    }
});
`;

app = app.replace('  // --- Angle Smoothing Helper (handles 0°/360° phase wrap-around) ---', stabilizerCode + '\n  // --- Angle Smoothing Helper (handles 0°/360° phase wrap-around) ---');

const oldUpdateHeading = `  function updateHeading(rawHeading) {
    if (typeof rawHeading === 'number' && !isNaN(rawHeading)) {
      rawMagneticHeading = ((rawHeading % 360) + 360) % 360;
    }

    // Adaptive low-pass filter: heavy smoothing when steady (kills magnetic jitter),
    // light smoothing when the phone is genuinely turning (no lag).
    const prevShown = smoothedHeading === null ? rawMagneticHeading : normalizeAngle(smoothedHeading);
    const delta = Math.abs(((rawMagneticHeading - prevShown + 540) % 360) - 180);
    const adaptiveFactor = Math.min(0.6, Math.max(0.1, delta / 25));
    smoothedHeading = smoothAngle(smoothedHeading, rawMagneticHeading, adaptiveFactor);

    // Apply manual calibration offset
    let calibratedHeading = smoothedHeading + calibrationOffset;

    let trueHeading = calibratedHeading;
    if (isTrueNorth) {
      trueHeading = calibratedHeading + magneticDeclination;
    }

    updateHeadingUI(trueHeading);
  }`;

const newUpdateHeading = `  function updateHeading(rawHeading) {
    if (typeof rawHeading === 'number' && !isNaN(rawHeading)) {
      rawMagneticHeading = ((rawHeading % 360) + 360) % 360;
      stabilizer.updateRawHeading(rawMagneticHeading);
    }
  }`;

app = app.replace(oldUpdateHeading, newUpdateHeading);

fs.writeFileSync('app.js', app);
console.log('Done!');
