const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add gear icon to header-actions, remove lang/north/dial pills
const newHeaderActions = `<div class="header-actions">
        <!-- Settings Gear Icon -->
        <button id="btnSettings" class="icon-btn" title="Settings" aria-label="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <!-- Target Bearing Lock -->
        <button id="btnBearingLock" class="icon-btn" title="Lock Target Bearing" aria-label="Lock Bearing">
          <svg id="bearingLockIcon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
          </svg>
        </button>
        <!-- Info / Download / QR / GitHub -->
        <button id="btnInfo" class="icon-btn" title="App Info & Download" aria-label="App Info and Download">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>`;

html = html.replace(/<div class="header-actions">[\s\S]*?<\/div>/, newHeaderActions);

// 2. Hide mode-control-strip (we'll move these into settings)
// For simplicity, just add "hidden" class to mode-control-strip and vastu-subcontrols where appropriate,
// or actually delete them and move into modal. The user says "Relocate UI elements...".
// I'll leave the HTML and just hide the old ones using CSS later, and build the Settings modal.

const settingsModalHTML = `
  <!-- Settings Drawer / Modal Overlay -->
  <div id="settingsModal" class="modal-backdrop hidden" role="dialog" aria-modal="true">
    <div class="modal-window">
      <div class="modal-header">
        <h3>App Settings</h3>
        <button id="btnCloseSettings" class="btn-modal-close" aria-label="Close modal">✖</button>
      </div>
      <div class="modal-body">
        
        <!-- Language -->
        <div class="setting-item">
          <label for="setting-lang">Language</label>
          <select id="setting-lang" class="setting-select">
            <option value="en">English</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
          </select>
        </div>

        <!-- True vs Magnetic -->
        <div class="setting-item">
          <label>Compass Reference</label>
          <div class="toggle-group">
            <input type="radio" id="st-magnetic" name="compass-ref" value="magnetic">
            <label for="st-magnetic">Magnetic</label>
            <input type="radio" id="st-true-north" name="compass-ref" value="true" checked>
            <label for="st-true-north">True North</label>
          </div>
        </div>

        <!-- Dial Style -->
        <div class="setting-item">
          <label for="setting-dial-style">Dial Style</label>
          <select id="setting-dial-style" class="setting-select">
            <option value="elemental">Elemental</option>
            <option value="chakra">Chakra Wheel</option>
            <option value="gold">Royal Gold</option>
          </select>
        </div>

        <!-- Mode Toggle -->
        <div class="setting-item">
          <label>Compass Mode</label>
          <div class="toggle-group">
            <input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>
            <label for="st-mode-vastu">Vastu Mode</label>
            <input type="radio" id="st-mode-simple" name="compass-mode" value="simple">
            <label for="st-mode-simple">Simple Compass</label>
          </div>
        </div>

        <!-- Property Type -->
        <div class="setting-item">
          <label for="setting-property">Property Type</label>
          <select id="setting-property" class="setting-select">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="retail">Retail</option>
          </select>
        </div>

        <!-- Grid Zones -->
        <div class="setting-item">
          <label>Zonal Division</label>
          <div class="toggle-group">
            <input type="radio" id="st-zone8" name="zones" value="8" checked>
            <label for="st-zone8">8 Zones</label>
            <input type="radio" id="st-zone16" name="zones" value="16">
            <label for="st-zone16">16 Zones</label>
            <input type="radio" id="st-zone32" name="zones" value="32">
            <label for="st-zone32">32 Zones</label>
          </div>
        </div>

      </div>
    </div>
  </div>
`;

// Insert settings modal before infoModal
html = html.replace('<!-- Info & Install Modal -->', settingsModalHTML + '\n  <!-- Info & Install Modal -->');

// Also compact action controls. 
// Remove .vastu-tools-toolbar from current spot and place it under .compass-viewport?
// Actually the prompt says: "Compact Action Controls: Re-layout the primary action tools... into a single, responsive horizontal toolbar directly below the main compass canvas."

html = html.replace(/<div class="vastu-tools-toolbar" id="vastuToolsBar">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, '');

const newToolsBar = `
  <!-- Compact Action Bar (Single-Line Tools) -->
  <section class="tools-bar" id="vastuToolsBar">
    <button class="tool-btn" id="btnToolRoomFinder"><span>📍</span> Zone Finder</button>
    <button class="tool-btn" id="btnToolPlotTilt"><span>📐</span> Plot Tilt</button>
    <button class="tool-btn" id="btnToolCamera"><span>📷</span> Camera AR</button>
    <button class="tool-btn" id="btnToolAudit"><span>📊</span> Vastu Report</button>
  </section>
`;

html = html.replace('</main>', newToolsBar + '\n  </main>');

// Remove mode-control-strip entirely since all toggles are now in settings
html = html.replace(/<!-- App Mode Control Bar[\s\S]*?<\/section>/, '');

fs.writeFileSync('index.html', html);
console.log('HTML updated!');
