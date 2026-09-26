const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Add new variable
app = app.replace('let lastVibratedCardinal = -1;', 'let lastVibratedCardinal = -1;\n  let lastVibratedRoomZone = null;');

// Fix the Room Finder logic
const oldRoomLogic = `
        if (hapticsEnabled && lastVibratedCardinal !== activeZone8.centerDeg) {
          lastVibratedCardinal = activeZone8.centerDeg;
          triggerHapticTick(35);
        }
      } else {
        roomGuidanceBanner.classList.remove('aligned');
        guideStatusText.textContent = \`Rotate device toward: \${activeRoom.idealZones.join(', ')}\`;
      }`;

const newRoomLogic = `
        if (hapticsEnabled && lastVibratedRoomZone !== activeZone8.id) {
          lastVibratedRoomZone = activeZone8.id;
          triggerHapticTick(35);
        }
      } else {
        lastVibratedRoomZone = null; // Reset when no longer aligned
        roomGuidanceBanner.classList.remove('aligned');
        guideStatusText.textContent = \`Rotate device toward: \${activeRoom.idealZones.join(', ')}\`;
      }`;
app = app.replace(oldRoomLogic, newRoomLogic);

// Fix the Cardinal Tick logic
const oldCardinalLogic = `
    // Cardinal Haptic Tick (exact 0°, 90°, 180°, 270° within 1.5°)
    const cardinalAngles = [0, 90, 180, 270];
    const isExactCardinal = cardinalAngles.some(ang => Math.abs(displayHeading - ang) <= 1.2 || Math.abs(displayHeading - 360) <= 1.2);
    if (isExactCardinal && lastVibratedCardinal !== rounded) {
      lastVibratedCardinal = rounded;
      triggerHapticTick(20);
    } else if (!isExactCardinal) {
      lastVibratedCardinal = -1;
    }
`;

const newCardinalLogic = `
    // Cardinal Haptic Tick (exact 0°, 90°, 180°, 270° within 1.5°)
    const cardinalAngles = [0, 90, 180, 270];
    let matchedCardinal = -1;
    for (const ang of cardinalAngles) {
      if (Math.abs(displayHeading - ang) <= 1.2 || Math.abs(displayHeading - 360) <= 1.2) {
        matchedCardinal = ang === 360 ? 0 : ang;
        break;
      }
    }
    
    if (matchedCardinal !== -1 && lastVibratedCardinal !== matchedCardinal) {
      lastVibratedCardinal = matchedCardinal;
      triggerHapticTick(20);
    } else if (matchedCardinal === -1) {
      lastVibratedCardinal = -1;
    }
`;
app = app.replace(oldCardinalLogic, newCardinalLogic);

fs.writeFileSync('app.js', app);
console.log('Haptics bug fixed!');
