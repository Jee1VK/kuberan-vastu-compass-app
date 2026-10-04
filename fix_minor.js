const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

// 1. Fix Camera AR memory leak
app = app.replace(
  /cameraStream\.getTracks\(\)\.forEach\(t => t\.stop\(\)\);\s*cameraStream = null;/,
  `cameraStream.getTracks().forEach(t => t.stop());
      cameraStream = null;
      if (cameraFeed) cameraFeed.srcObject = null; // Free video buffer memory`
);

// 2. Fix Plot Tilt Hardcoded Strings
const oldPlotTiltUI = `    if (absDev <= 3.0) {
      plotStatusBanner.className = 'plot-status-banner aligned';
      plotStatusTitle.textContent = 'SAMA-SUTRA (Aligned Plot)';
      plotStatusDesc.textContent = 'The property is naturally aligned with the cardinal magnetic axis (within ±3°). Highly auspicious and energetically balanced.';
    } else {
      plotStatusBanner.className = 'plot-status-banner tilted';
      plotStatusTitle.textContent = \`VIDISHA (Tilted Plot by \${absDev}°)\`;
      plotStatusDesc.textContent = 'The property walls are tilted relative to cardinal North. Recommended: Align internal work desks, mandir, and bed axes towards Cardinal North.';
    }`;

const newPlotTiltUI = `    const dict = VASTU_DATA.UI[currentLang] || VASTU_DATA.UI.en;
    
    if (absDev <= 3.0) {
      plotStatusBanner.className = 'plot-status-banner aligned';
      plotStatusTitle.textContent = dict.vidishaAligned || 'SAMA-SUTRA (Aligned Plot)';
      plotStatusDesc.textContent = 'The property is naturally aligned with the cardinal magnetic axis (within ±3°). Highly auspicious and energetically balanced.';
    } else {
      plotStatusBanner.className = 'plot-status-banner tilted';
      const tiltBase = dict.vidishaTilted || 'VIDISHA (Tilted Plot)';
      plotStatusTitle.textContent = \`\${tiltBase} — \${absDev}°\`;
      plotStatusDesc.textContent = dict.plotTiltHelp || 'The property walls are tilted relative to cardinal North. Recommended: Align internal work desks, mandir, and bed axes towards Cardinal North.';
    }`;

app = app.replace(oldPlotTiltUI, newPlotTiltUI);

fs.writeFileSync('app.js', app);
console.log('Fixed Camera AR leak and Plot Tilt hardcoded strings');
