const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// We can just use string replacements to comment out old DOM references so we don't crash, 
// and append the new logic.

const oldRefs = [
  'const btnToggleNorth = document.getElementById(\'btnToggleNorth\');',
  'const northPill = document.getElementById(\'northPill\');',
  'const northModeLabel = document.getElementById(\'northModeLabel\');',
  'const btnDialTheme = document.getElementById(\'btnDialTheme\');',
  'const btnLanguage = document.getElementById(\'btnLanguage\');',
  'const langPill = document.getElementById(\'langPill\');',
  'const btnModeVastu = document.getElementById(\'btnModeVastu\');',
  'const btnModeSimple = document.getElementById(\'btnModeSimple\');',
  'const compassModeSwitcher = document.getElementById(\'compassModeSwitcher\');',
  'const btnToolRoomFinder = document.getElementById(\'btnToolRoomFinder\');', // Need to make sure these match if they changed, but I kept the IDs same: btnToolRoomFinder etc.
  'const zoneRadios = document.querySelectorAll(\'.zones-segmented input[type="radio"]\');',
  'const propertyTabs = document.querySelectorAll(\'.property-tabs .tab-btn\');'
];

app = app.replace(/if\s*\(btnLanguage\)\s*\{[\s\S]*?\}/, '/* removed old lang listener */');
app = app.replace(/if\s*\(btnToggleNorth\)\s*\{[\s\S]*?\}/, '/* removed old north listener */');
app = app.replace(/if\s*\(btnDialTheme\)\s*\{[\s\S]*?\}/, '/* removed old dial theme listener */');
app = app.replace(/if\s*\(btnModeVastu\)\s*\{[\s\S]*?\}/, '/* removed old vastu mode listener */');
app = app.replace(/if\s*\(btnModeSimple\)\s*\{[\s\S]*?\}/, '/* removed old simple mode listener */');
app = app.replace(/propertyTabs\.forEach[\s\S]*?\n  \}\);/, '/* removed old property tabs */');
app = app.replace(/zoneRadios\.forEach[\s\S]*?\n  \}\);/, '/* removed old zone radios */');

// Add new logic at the bottom of the file (before the end block or inside it)
const newLogic = `
  // --- SETTINGS MODAL BINDINGS (v4.6.4) ---
  const settingsModal = document.getElementById('settingsModal');
  const btnSettings = document.getElementById('btnSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');

  if (btnSettings && settingsModal) {
    btnSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    
    // Close on outside click
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // Language setting
  const selLang = document.getElementById('setting-lang');
  if (selLang) {
    selLang.value = currentLang;
    selLang.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  // Compass Ref (True/Magnetic)
  const radiosRef = document.getElementsByName('compass-ref');
  radiosRef.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      isTrueNorth = (e.target.value === 'true');
      updateHeading(currentHeading);
    }
  }));

  // Dial Style
  const selDial = document.getElementById('setting-dial-style');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => setDialTheme(e.target.value));
  }

  // Compass Mode
  const radiosMode = document.getElementsByName('compass-mode');
  radiosMode.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      setCompassMode(e.target.value);
    }
  }));

  // Property Type
  const selProp = document.getElementById('setting-property');
  if (selProp) {
    selProp.value = propertyType;
    selProp.addEventListener('change', (e) => {
      propertyType = e.target.value;
      if (typeof updateRoomList === 'function') updateRoomList();
    });
  }

  // Zonal Division
  const radiosZones = document.getElementsByName('zones');
  radiosZones.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      setZoneSystem(e.target.value);
    }
  }));
`;

app = app.replace('// Run on DOM load', newLogic + '\n  // Run on DOM load');

// Let's also patch the translation logic to avoid crashing if `northModeLabel` is missing.
app = app.replace('if (northModeLabel) northModeLabel.textContent', 'if (false) northModeLabel.textContent');
app = app.replace('if (langPill) langPill.textContent', 'if (false) langPill.textContent');
app = app.replace('if (northPill) northPill.textContent', 'if (false) northPill.textContent');
app = app.replace('if (lblModeVastu) lblModeVastu.textContent', 'if (false) lblModeVastu.textContent');
app = app.replace('if (lblModeSimple) lblModeSimple.textContent', 'if (false) lblModeSimple.textContent');

fs.writeFileSync('app.js', app);
console.log('App logic updated safely!');
