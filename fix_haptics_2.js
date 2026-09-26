const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const newCardinalLogic = `
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

const regex = /const cardinalAngles = \[0, 90, 180, 270\];\s*const isExactCardinal = cardinalAngles\.some\(ang => Math\.abs\(displayHeading - ang\) <= 1\.2 \|\| Math\.abs\(displayHeading - 360\) <= 1\.2\);\s*if \(isExactCardinal && lastVibratedCardinal !== rounded\) \{\s*lastVibratedCardinal = rounded;\s*triggerHapticTick\(20\);\s*\} else if \(!isExactCardinal\) \{\s*lastVibratedCardinal = -1;\s*\}/;

if (regex.test(app)) {
  app = app.replace(regex, newCardinalLogic);
  fs.writeFileSync('app.js', app);
  console.log('Cardinal logic updated!');
} else {
  console.log('Regex did not match!');
}
