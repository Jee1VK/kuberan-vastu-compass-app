const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newHeader = `
    <header class="app-header">
      <div class="brand">
        <a href="https://kuberansilks.com/" target="_blank" rel="noopener noreferrer" class="kuberan-logo-link" title="Visit Kuberan Silks">
          <img src="assets/images/kuberan_logo_white_bg.png" alt="Kuberan Silks - Chickpet, Bengaluru" class="kuberan-header-logo">
        </a>
        <div class="brand-text">
          <span class="brand-kuberan">KUBERAN</span>
          <span class="brand-vastu-compass">Vastu Compass</span>
        </div>
      </div>
      <div class="header-actions">
        <button id="btnSettings" class="icon-btn" title="Settings" aria-label="Settings">
          ⚙️
        </button>
        <button id="btnInfo" class="icon-btn" title="App Info & Download" aria-label="App Info and Download">
          ℹ️
        </button>
      </div>
    </header>
`;

html = html.replace(/<header class="app-header">[\s\S]*?<\/header>/, newHeader.trim());

// Remove Mode Control Bar entirely
html = html.replace(/<!-- App Mode Control Bar[\s\S]*?<\/section>/, '');

const newToolsBar = `
  <!-- Compact Action Bar (Single-Line Tools) -->
  <section class="tools-bar" id="vastuToolsBar">
    <button class="tool-btn" id="btnToolRoomFinder"><span class="tool-icon">📍</span> <span id="lblToolRoom">Zone Finder</span></button>
    <button class="tool-btn" id="btnToolPlotTilt"><span class="tool-icon">📐</span> <span id="lblToolTilt">Plot Tilt</span></button>
    <button class="tool-btn" id="btnToolCamera"><span class="tool-icon">📷</span> <span id="lblToolCam">Camera AR</span></button>
    <button class="tool-btn" id="btnToolAudit"><span class="tool-icon">📊</span> <span id="lblToolAudit">Vastu Report</span></button>
  </section>
`;
html = html.replace('</main>', newToolsBar + '\n  </main>');

const settingsModal = `
  <!-- Settings Drawer / Modal Overlay -->
  <div id="settingsModal" class="modal-backdrop hidden" role="dialog" aria-modal="true">
    <div class="modal-window">
      <div class="modal-header">
        <h3>App Settings</h3>
        <button id="btnCloseSettings" class="btn-modal-close" aria-label="Close modal">✖</button>
      </div>
      <div class="modal-body">
        
        <div class="setting-item">
          <label for="setting-lang">Language</label>
          <select id="setting-lang" class="setting-select">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
          </select>
        </div>

        <div class="setting-item">
          <label>Compass Reference</label>
          <div class="toggle-group">
            <input type="radio" id="st-magnetic" name="compass-ref" value="magnetic">
            <label for="st-magnetic">Magnetic</label>
            <input type="radio" id="st-true-north" name="compass-ref" value="true" checked>
            <label for="st-true-north">True North</label>
          </div>
        </div>

        <div class="setting-item">
          <label for="setting-dial-style">Dial Style</label>
          <select id="setting-dial-style" class="setting-select">
            <option value="elemental">Elemental</option>
            <option value="chakra">Chakra Wheel</option>
            <option value="gold">Royal Gold</option>
          </select>
        </div>

        <div class="setting-item">
          <label>Compass Mode</label>
          <div class="toggle-group">
            <input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>
            <label for="st-mode-vastu">Vastu Mode</label>
            <input type="radio" id="st-mode-simple" name="compass-mode" value="simple">
            <label for="st-mode-simple">Simple Compass</label>
          </div>
        </div>

        <div class="setting-item">
          <label for="setting-property">Property Type</label>
          <select id="setting-property" class="setting-select">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="retail">Retail</option>
          </select>
        </div>

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
html = html.replace('<!-- Info & Install Modal -->', settingsModal + '\n  <!-- Info & Install Modal -->');

fs.writeFileSync('index.html', html);
console.log('HTML updated safely!');
