const fs = require('fs');

// --- 1. Modify index.html ---
let html = fs.readFileSync('index.html', 'utf8');

const gridToggleHtml = `
        <!-- Vastu Purusha Mandala Grid Overlay -->
        <div class="setting-item">
          <div>
            <label>Vastu Purusha Mandala (81-Pada Grid)</label>
            <span class="setting-desc" style="font-size:0.75rem;opacity:0.7;display:block;">Overlay authentic 9x9 geometric grid</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-vastu-grid">
            <span class="slider round"></span>
          </label>
        </div>
        
        <!-- Camera AR Settings Toggle -->`;

html = html.replace('<!-- Camera AR Settings Toggle -->', gridToggleHtml);
fs.writeFileSync('index.html', html);


// --- 2. Modify app.js ---
let app = fs.readFileSync('app.js', 'utf8');

// Insert grid drawing logic into buildDialSvg
const oldDialSvgStart = `function buildDialSvg() {
    const cx = 250;
    const cy = 250;
    const rOuter = 240;
    let svgContent = '';`;

const newDialSvgStart = `function buildDialSvg() {
    const cx = 250;
    const cy = 250;
    const rOuter = 240;
    let svgContent = '';
    
    const toggleGrid = document.getElementById('toggle-vastu-grid');
    const showGrid = toggleGrid && toggleGrid.checked;`;

app = app.replace(oldDialSvgStart, newDialSvgStart);

// At the very end of buildDialSvg, before dialSvg.innerHTML = svgContent;
const oldDialSvgEnd = `dialSvg.innerHTML = svgContent;
  }`;

const newDialSvgEnd = `
    // Vastu Purusha Mandala Grid (81 Padas)
    if (showGrid && compassMode === 'vastu') {
      const gridSize = 420; 
      const cell = gridSize / 9;
      const startX = cx - (gridSize / 2);
      const startY = cy - (gridSize / 2);

      // Draw grid lines
      for (let i = 0; i <= 9; i++) {
        const pos = startX + i * cell;
        // vertical
        svgContent += \`<line x1="\${pos}" y1="\${startY}" x2="\${pos}" y2="\${startY + gridSize}" stroke="var(--kuberan-gold)" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4,4"/>\`;
        // horizontal
        svgContent += \`<line x1="\${startX}" y1="\${pos}" x2="\${startX + gridSize}" y2="\${pos}" stroke="var(--kuberan-gold)" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4,4"/>\`;
      }

      // Highlight Brahmasthan (Center 3x3 = 9 squares)
      const bStart = startX + 3 * cell;
      svgContent += \`<rect x="\${bStart}" y="\${bStart}" width="\${3*cell}" height="\${3*cell}" fill="var(--kuberan-gold)" fill-opacity="0.1" stroke="var(--kuberan-gold)" stroke-width="2"/>\`;
      svgContent += \`<text x="\${cx}" y="\${cy}" fill="var(--kuberan-gold)" font-size="12" font-weight="bold" font-family="Inter,sans-serif" text-anchor="middle" dominant-baseline="middle" opacity="0.9">BRAHMASTHAN</text>\`;
      
      // Outer rim box
      svgContent += \`<rect x="\${startX}" y="\${startY}" width="\${gridSize}" height="\${gridSize}" fill="none" stroke="var(--kuberan-gold)" stroke-width="2" stroke-opacity="0.6"/>\`;
    }

    dialSvg.innerHTML = svgContent;
  }`;

app = app.replace(oldDialSvgEnd, newDialSvgEnd);


// Wire up the toggle in Event Listeners setup
const eventListenerRegex = /const toggleCamera = document\.getElementById\('toggle-camera-ar'\);/;
const newEventListener = `const toggleGridListener = document.getElementById('toggle-vastu-grid');
    if (toggleGridListener) {
      const gridSaved = localStorage.getItem('kuberan_vastu_grid') === 'true';
      toggleGridListener.checked = gridSaved;
      toggleGridListener.addEventListener('change', (e) => {
        localStorage.setItem('kuberan_vastu_grid', e.target.checked);
        buildDialSvg();
      });
    }

    const toggleCamera = document.getElementById('toggle-camera-ar');`;

app = app.replace(eventListenerRegex, newEventListener);

fs.writeFileSync('app.js', app);
console.log('Mandala Grid added!');
