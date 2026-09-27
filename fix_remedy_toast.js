const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const regexToggle = /toggleRemedies\.addEventListener\('change', \(e\) => \{\s*localStorage\.setItem\(REMEDY_SETTING_KEY, e\.target\.checked\);\s*applyRemedyVisibility\(e\.target\.checked\);\s*\}\);/;

const newToggle = `toggleRemedies.addEventListener('change', (e) => {
      localStorage.setItem(REMEDY_SETTING_KEY, e.target.checked);
      applyRemedyVisibility(e.target.checked);
      if (e.target.checked) {
        showToast('Please use the Zone Finder (grid icon) to select a room... Then open this report to generate an AI Vastu Dosha analysis and view remedies.');
      }
    });`;

if(regexToggle.test(app)) {
  app = app.replace(regexToggle, newToggle);
  fs.writeFileSync('app.js', app);
  console.log('Fixed toggle remedies');
} else {
  console.log('Toggle remedies regex failed');
}

// Ensure the checkbox defaults to false if not set in localStorage
const regexCheck = /const isRemedyEnabled = localStorage\.getItem\(REMEDY_SETTING_KEY\) === 'true';/;
// The logic is already returning false if it's not set ('true' string comparison)
// So no need to change that.

