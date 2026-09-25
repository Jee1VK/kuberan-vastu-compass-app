const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const newProcessLoop = `    processLoop() {
        if (this.isLocked) {
            this.animFrameId = null;
            return;
        }

        let delta = this.getShortestAngleDelta(this.currentHeading, this.targetHeading);

        // Snap to target if very close to save CPU
        if (Math.abs(delta) < 0.1) {
            this.currentHeading = this.currentHeading + delta;
            if (Math.abs(this.currentHeading - this.lastRenderedHeading) >= 0.1) {
                this.lastRenderedHeading = this.currentHeading;
                if (this.onHeadingChange) this.onHeadingChange(this.currentHeading);
            }
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
    }`;

app = app.replace(/processLoop\(\) \{[\s\S]*?this\.animFrameId = requestAnimationFrame\(\(\) => this\.processLoop\(\)\);\s*\}/, newProcessLoop);

const newUpdateRawHeading = `    updateRawHeading(rawHeading) {
        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) return;

        let normalized = (rawHeading % 360 + 360) % 360;

        if (this.currentHeading === null) {
            this.currentHeading = normalized;
            this.targetHeading = normalized;
            if (this.onHeadingChange) this.onHeadingChange(this.currentHeading);
            return;
        }

        let sensorDelta = this.getShortestAngleDelta(this.targetHeading, normalized);
        if (Math.abs(sensorDelta) < this.deadzone) {
            this.checkStationaryStatus(normalized);
            return;
        }

        this.targetHeading = normalized;
        this.checkStationaryStatus(normalized);

        if (!this.animFrameId) {
            this.animFrameId = requestAnimationFrame(() => this.processLoop());
        }
    }`;

app = app.replace(/updateRawHeading\(rawHeading\) \{[\s\S]*?\}\s*getShortestAngleDelta/, newUpdateRawHeading + '\n\n    getShortestAngleDelta');

fs.writeFileSync('app.js', app);
console.log('Fixed CompassStabilizer');
