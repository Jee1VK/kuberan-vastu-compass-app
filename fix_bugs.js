const fs = require('fs');

// --- 1. Fix Ayadi HTML in index.html ---
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('id="ayadiModal"')) {
  const ayadiModalHtml = `
  <!-- Ayadi Calculator Modal -->
  <div id="ayadiModal" class="modal-overlay hidden" style="z-index:9999;">
    <div class="modal-content" style="max-width:90%; padding:20px;">
      <div class="modal-header">
        <h2 style="font-size:1.2rem; color:var(--kuberan-gold);">📐 Ayadi Shadvarga Calculator</h2>
        <button id="btnCloseAyadiModal" class="close-btn" style="font-size:2rem;">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size:0.9rem; opacity:0.8; margin-bottom:15px;">Calculate the architectural dimensions (Aaya, Vyaya, Yoni) of your plot or building to ensure it resonates with cosmic energy.</p>
        
        <div class="setting-group" style="margin-bottom: 20px;">
          <div class="setting-item" style="border:none; padding:0; display:flex;">
            <div style="flex:1;">
              <label>Length (Feet)</label>
              <input type="number" id="ayadiLength" placeholder="e.g. 40" style="width:100%; padding:8px; margin-top:5px; background:var(--bg-glass); border:1px solid var(--border-color); color:var(--text-main); border-radius:6px; box-sizing:border-box;">
            </div>
            <div style="flex:1; margin-left:10px;">
              <label>Width (Feet)</label>
              <input type="number" id="ayadiWidth" placeholder="e.g. 30" style="width:100%; padding:8px; margin-top:5px; background:var(--bg-glass); border:1px solid var(--border-color); color:var(--text-main); border-radius:6px; box-sizing:border-box;">
            </div>
          </div>
          <button id="btnCalculateAyadi" class="primary-btn" style="width:100%; margin-top:15px; padding:10px;">Calculate Ayadi</button>
        </div>

        <div id="ayadiResults" class="vastu-defect hidden" style="text-align:left; padding:15px; border-color:var(--kuberan-gold);">
          <h3 style="font-size:1.1rem; color:var(--kuberan-gold); margin-bottom:10px;">Cosmic Dimensions Report</h3>
          <div id="ayadiReportContent" style="font-size:0.95rem; line-height:1.5;"></div>
        </div>
      </div>
    </div>
  </div>
`;
  html = html.replace('<!-- Scripts -->', ayadiModalHtml + '\n  <!-- Scripts -->');
  fs.writeFileSync('index.html', html);
  console.log('Fixed Ayadi HTML');
}

// --- 2. Fix Grid Overlay JS in app.js ---
let app = fs.readFileSync('app.js', 'utf8');

// The start of buildDialSvg
if (!app.includes('const showGrid = toggleGrid && toggleGrid.checked;')) {
  app = app.replace(
    /function buildDialSvg\(\)\s*\{\s*const cx = 250;\s*const cy = 250;\s*const rOuter = 240;\s*let svgContent = '';/,
    `function buildDialSvg() {
    const cx = 250;
    const cy = 250;
    const rOuter = 240;
    let svgContent = '';
    const toggleGrid = document.getElementById('toggle-vastu-grid');
    const showGrid = toggleGrid && toggleGrid.checked;`
  );
}

// The end of buildDialSvg
if (!app.includes('Vastu Purusha Mandala Grid (81 Padas)')) {
  app = app.replace(
    /dialSvg\.innerHTML = svgContent;\s*\}/,
    `
    // Vastu Purusha Mandala Grid (81 Padas)
    if (showGrid && compassMode === 'vastu') {
      const gridSize = 360; 
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
  }`
  );
  fs.writeFileSync('app.js', app);
  console.log('Fixed Grid Overlay JS');
}

