const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const settingsHTML = `
        <!-- Vastu Remedies Settings Toggle -->
        <div class="setting-item">
          <div class="setting-text">
            <span class="setting-title">Vastu Remedies & Fixes</span>
            <span class="setting-desc" style="font-size:0.75rem;opacity:0.7;">Display non-demolition remedies for Vastu Dosha</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-remedies">
            <span class="slider round"></span>
          </label>
        </div>
`;

html = html.replace('<!-- Grid Zones -->', settingsHTML + '\n        <!-- Grid Zones -->');

const containerHTML = `
          <!-- Main UI Display Container for Vastu Analysis -->
          <div id="vastu-analysis-container"></div>
`;

html = html.replace('<div class="report-row report-advice">', containerHTML + '\n            <div class="report-row report-advice">');

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully');
