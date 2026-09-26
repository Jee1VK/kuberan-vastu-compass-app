const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target1 = '<div class="setting-item">\n          <label>Zonal Division</label>';
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

if (!html.includes('id="toggle-remedies"')) {
    html = html.replace(target1, settingsHTML + target1);
}

const target2 = '<div class="report-advice-box">';
const containerHTML = `
          <!-- Main UI Display Container for Vastu Analysis -->
          <div id="vastu-analysis-container"></div>
`;

if (!html.includes('id="vastu-analysis-container"')) {
    html = html.replace(target2, containerHTML + target2);
}

fs.writeFileSync('index.html', html);
console.log('index.html fixed');
