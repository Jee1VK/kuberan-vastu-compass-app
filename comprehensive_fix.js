const fs = require('fs');

// =============================================
// COMPREHENSIVE BUG FIX SCRIPT - v4.9.0
// Fixes ALL issues from 3 parallel audits
// =============================================

// --- 1. FIX index.html ---
let html = fs.readFileSync('index.html', 'utf8');
let htmlFixes = 0;

// 1A. Fix Ayadi Modal: change modal-overlay to modal-backdrop
if (html.includes('id="ayadiModal" class="modal-overlay')) {
  html = html.replace('id="ayadiModal" class="modal-overlay', 'id="ayadiModal" class="modal-backdrop');
  htmlFixes++;
  console.log('  [HTML] Fixed ayadiModal class: modal-overlay -> modal-backdrop');
}

// 1B. Add toggle-haptics to Settings (missing entirely)
if (!html.includes('id="toggle-haptics"')) {
  const hapticHtml = `
        <!-- Haptic Feedback Toggle -->
        <div class="setting-item">
          <div>
            <label>Haptic Feedback</label>
            <span class="setting-desc" style="font-size:0.75rem;opacity:0.7;display:block;">Vibrate on cardinal directions & zone changes</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-haptics" checked>
            <span class="slider round"></span>
          </label>
        </div>`;
  // Insert before vastu-grid toggle
  html = html.replace('<!-- Vastu Purusha Mandala Grid Overlay -->', hapticHtml + '\n\n        <!-- Vastu Purusha Mandala Grid Overlay -->');
  htmlFixes++;
  console.log('  [HTML] Added missing toggle-haptics to Settings');
}

// 1C. Add sensorStatus span (missing entirely)
if (!html.includes('id="sensorStatus"')) {
  // Add it near the sensor accuracy badge area
  const sensorBadgeMatch = html.match(/<span[^>]*id="sensorAccuracyBadge"[^>]*>[^<]*<\/span>/);
  if (sensorBadgeMatch) {
    html = html.replace(sensorBadgeMatch[0], sensorBadgeMatch[0] + '\n            <span id="sensorStatus" class="sensor-badge" style="font-size:0.7rem; opacity:0.7;"></span>');
    htmlFixes++;
    console.log('  [HTML] Added missing sensorStatus span');
  }
}

// 1D. Add aria-labels to header action buttons
html = html.replace('<button id="btnToolAyadi" class="icon-btn" title="Ayadi Calculator">', '<button id="btnToolAyadi" class="icon-btn" title="Ayadi Calculator" aria-label="Ayadi Calculator">');
html = html.replace('<button id="btnToolRoomFinder" class="icon-btn" title="Zone Finder">', '<button id="btnToolRoomFinder" class="icon-btn" title="Zone Finder" aria-label="Zone Finder">');
html = html.replace('<button id="btnToolPlotTilt" class="icon-btn" title="Plot Tilt Lock">', '<button id="btnToolPlotTilt" class="icon-btn" title="Plot Tilt Lock" aria-label="Plot Tilt Lock">');
html = html.replace('<button id="btnToolAudit" class="icon-btn" title="Vastu Report">', '<button id="btnToolAudit" class="icon-btn" title="Vastu Report" aria-label="Vastu Report">');
htmlFixes++;
console.log('  [HTML] Added aria-labels to header action buttons');

fs.writeFileSync('index.html', html);
console.log(`[HTML] Total fixes applied: ${htmlFixes}`);


// --- 2. FIX app.js ---
let app = fs.readFileSync('app.js', 'utf8');
let jsFixes = 0;

// 2A. CRITICAL: Fix Vastu Remedies zKey bug (uses .id instead of .code)
const oldZKey = /const zKey = activeZone8\.id \|\| Object\.keys\(VASTU_DATA\.ZONES_8\)\.find\(k => VASTU_DATA\.ZONES_8\[k\] === activeZone8\);/;
if (oldZKey.test(app)) {
  app = app.replace(oldZKey, 'const zKey = activeZone8.code;');
  jsFixes++;
  console.log('  [JS] CRITICAL FIX: Vastu Remedies zKey changed from .id to .code');
}

// 2B. Remove btnToolCamera references in toggleCameraAR (it was moved to Settings toggle)
app = app.replace(/btnToolCamera\.classList\.remove\('active'\);/g, '// btnToolCamera removed (now in Settings)');
app = app.replace(/btnToolCamera\.classList\.add\('active'\);/g, '// btnToolCamera removed (now in Settings)');
jsFixes++;
console.log('  [JS] Removed stale btnToolCamera references from toggleCameraAR');

// 2C. Fix Ayadi math: handle modulo 0
app = app.replace(
  "const aaya = (area * 8) % 12;",
  "const aaya = ((area * 8) % 12) || 12;"
);
app = app.replace(
  "const vyaya = (area * 9) % 10;",
  "const vyaya = ((area * 9) % 10) || 10;"
);
jsFixes++;
console.log('  [JS] Fixed Ayadi modulo-0 edge case (aaya and vyaya)');

// 2D. Fix Dial Theme index sync
const dialThemeListener = /dialTheme = e\.target\.value;\s*document\.body\.classList\.remove\('theme-elemental', 'theme-chakra', 'theme-gold'\);\s*document\.body\.classList\.add\('theme-' \+ dialTheme\);\s*buildDialSvg\(\);/;
if (dialThemeListener.test(app)) {
  app = app.replace(dialThemeListener, `dialTheme = e.target.value;
      currentDialThemeIndex = DIAL_THEMES.indexOf(dialTheme);
      document.body.classList.remove('theme-elemental', 'theme-chakra', 'theme-gold');
      document.body.classList.add('theme-' + dialTheme);
      buildDialSvg();`);
  jsFixes++;
  console.log('  [JS] Fixed Dial Theme index sync (currentDialThemeIndex)');
}

// 2E. Fix duplicate drag simulation (add guard flag)
if (!app.includes('let dragSimulationInitialized = false;')) {
  app = app.replace(
    'function initDesktopDragSimulation() {',
    `let dragSimulationInitialized = false;
  function initDesktopDragSimulation() {
    if (dragSimulationInitialized) return;
    dragSimulationInitialized = true;`
  );
  jsFixes++;
  console.log('  [JS] Fixed duplicate drag simulation event listeners');
}

// 2F. Remove dead code: if (false)
app = app.replace(/if \(false\) northModeLabel\.textContent = 'TRUE NORTH';/g, '// northModeLabel removed');
app = app.replace(/if \(false\) northModeLabel\.textContent = 'MAGNETIC NORTH';/g, '// northModeLabel removed');
jsFixes++;
console.log('  [JS] Removed dead code (if (false) northModeLabel)');

// 2G. Fix window scope pollution for remedyToastTimer
app = app.replace(/window\.remedyToastTimer/g, 'remedyToastTimer');
if (!app.includes('let remedyToastTimer;')) {
  app = app.replace('// --- VASTU REMEDIES OFFLINE ENGINE ---', 'let remedyToastTimer;\n  // --- VASTU REMEDIES OFFLINE ENGINE ---');
}
jsFixes++;
console.log('  [JS] Fixed window scope pollution (remedyToastTimer)');

// 2H. Add haptics toggle event listener
if (!app.includes("toggle-haptics")) {
  const hapticJs = `
    // Haptic Feedback Toggle
    const toggleHaptics = document.getElementById('toggle-haptics');
    if (toggleHaptics) {
      const hapticSaved = localStorage.getItem('kuberan_haptics');
      if (hapticSaved !== null) {
        toggleHaptics.checked = hapticSaved === 'true';
      }
      toggleHaptics.addEventListener('change', (e) => {
        localStorage.setItem('kuberan_haptics', e.target.checked);
        showToast(e.target.checked ? 'Haptic feedback enabled' : 'Haptic feedback disabled');
      });
    }
`;
  app = app.replace('const toggleGridListener = document.getElementById', hapticJs + '\n    const toggleGridListener = document.getElementById');
  jsFixes++;
  console.log('  [JS] Added toggle-haptics event listener');
}

// 2I. Guard haptic vibrations with the toggle check
if (!app.includes("kuberan_haptics") || !app.includes("hapticEnabled")) {
  // Add a helper function near the top of vibration code
  const vibratePattern = /navigator\.vibrate\(/g;
  let count = 0;
  app = app.replace(vibratePattern, () => {
    count++;
    return `(localStorage.getItem('kuberan_haptics') !== 'false') && navigator.vibrate(`;
  });
  if (count > 0) {
    jsFixes++;
    console.log(`  [JS] Guarded ${count} vibrate() calls with haptics toggle check`);
  }
}

fs.writeFileSync('app.js', app);
console.log(`[JS] Total fixes applied: ${jsFixes}`);


// --- 3. FIX style.css ---
let css = fs.readFileSync('style.css', 'utf8');
let cssFixes = 0;

// 3A. Add --kuberan-gold to :root
if (!css.includes('--kuberan-gold')) {
  css = css.replace(':root {', ':root {\n  --kuberan-gold: #d4a359;');
  cssFixes++;
  console.log('  [CSS] Added --kuberan-gold to :root');
}

// 3B. Add missing .modal-overlay (alias for .modal-backdrop)
if (!css.includes('.modal-overlay')) {
  css += `
/* Modal Overlay (alias for modal-backdrop for injected modals) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}
`;
  cssFixes++;
  console.log('  [CSS] Added .modal-overlay class');
}

// 3C. Add missing .primary-btn
if (!css.includes('.primary-btn')) {
  css += `
.primary-btn {
  background: var(--kuberan-gold);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.primary-btn:hover { opacity: 0.85; }
`;
  cssFixes++;
  console.log('  [CSS] Added .primary-btn class');
}

// 3D. Add missing .close-btn
if (!css.includes('.close-btn')) {
  css += `
.close-btn {
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.close-btn:hover { opacity: 1; }
`;
  cssFixes++;
  console.log('  [CSS] Added .close-btn class');
}

// 3E. Add missing .fade
if (!css.includes('.fade {') && !css.includes('.fade{')) {
  css += `
.fade { opacity: 0 !important; transition: opacity 0.4s ease; }
`;
  cssFixes++;
  console.log('  [CSS] Added .fade class');
}

// 3F. Add missing .setting-group
if (!css.includes('.setting-group')) {
  css += `
.setting-group { margin-bottom: 15px; }
`;
  cssFixes++;
  console.log('  [CSS] Added .setting-group class');
}

// 3G. Add missing .modal-content
if (!css.includes('.modal-content')) {
  css += `
.modal-content {
  background: var(--bg-primary, #1a1a2e);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  max-width: 420px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  color: var(--text-main);
}
`;
  cssFixes++;
  console.log('  [CSS] Added .modal-content class');
}

// 3H. Add missing .modal-header
if (!css.includes('.modal-header')) {
  css += `
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
`;
  cssFixes++;
  console.log('  [CSS] Added .modal-header class');
}

// 3I. Add missing .modal-body
if (!css.includes('.modal-body')) {
  css += `
.modal-body { font-size: 0.95rem; }
`;
  cssFixes++;
  console.log('  [CSS] Added .modal-body class');
}

fs.writeFileSync('style.css', css);
console.log(`[CSS] Total fixes applied: ${cssFixes}`);


// --- 4. FIX manifest.webmanifest ---
let manifest = fs.readFileSync('manifest.webmanifest', 'utf8');
manifest = manifest.replace('"sizes": "512x512",\n    "type": "image/svg+xml"', '"sizes": "any",\n    "type": "image/svg+xml"');
fs.writeFileSync('manifest.webmanifest', manifest);
console.log('[MANIFEST] Fixed SVG icon sizes: 512x512 -> any');


console.log('\n=== ALL FIXES COMPLETE ===');
