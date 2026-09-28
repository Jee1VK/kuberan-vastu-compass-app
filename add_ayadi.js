const fs = require('fs');

// --- 1. Modify index.html ---
let html = fs.readFileSync('index.html', 'utf8');

// Add button to header
const headerRegex = /<button id="btnToolRoomFinder"/;
html = html.replace(headerRegex, `<button id="btnToolAyadi" class="icon-btn" title="Ayadi Calculator">📐</button>\n        <button id="btnToolRoomFinder"`);

// Add Ayadi Modal HTML at the end of the body (before <script>)
const ayadiModalHtml = `
  <!-- Ayadi Calculator Modal -->
  <div id="ayadiModal" class="modal-overlay hidden">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📐 Ayadi Shadvarga Calculator</h2>
        <button id="btnCloseAyadiModal" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-size:0.9rem; opacity:0.8; margin-bottom:15px;">Calculate the architectural dimensions (Aaya, Vyaya, Yoni) of your plot or building to ensure it resonates with cosmic energy.</p>
        
        <div class="setting-group" style="margin-bottom: 20px;">
          <div class="setting-item" style="border:none; padding:0;">
            <div style="flex:1;">
              <label>Length (Feet)</label>
              <input type="number" id="ayadiLength" placeholder="e.g. 40" style="width:100%; padding:8px; margin-top:5px; background:var(--bg-glass); border:1px solid var(--border-color); color:var(--text-main); border-radius:6px;">
            </div>
            <div style="flex:1; margin-left:10px;">
              <label>Width (Feet)</label>
              <input type="number" id="ayadiWidth" placeholder="e.g. 30" style="width:100%; padding:8px; margin-top:5px; background:var(--bg-glass); border:1px solid var(--border-color); color:var(--text-main); border-radius:6px;">
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
html = html.replace('<!-- Include JavaScript -->', ayadiModalHtml + '\n  <!-- Include JavaScript -->');
fs.writeFileSync('index.html', html);


// --- 2. Modify app.js ---
let app = fs.readFileSync('app.js', 'utf8');

const jsCode = `
  // --- Ayadi Shadvarga Calculator ---
  const btnToolAyadi = document.getElementById('btnToolAyadi');
  const ayadiModal = document.getElementById('ayadiModal');
  const btnCloseAyadiModal = document.getElementById('btnCloseAyadiModal');
  const btnCalculateAyadi = document.getElementById('btnCalculateAyadi');
  const ayadiLength = document.getElementById('ayadiLength');
  const ayadiWidth = document.getElementById('ayadiWidth');
  const ayadiResults = document.getElementById('ayadiResults');
  const ayadiReportContent = document.getElementById('ayadiReportContent');

  if (btnToolAyadi) {
    btnToolAyadi.addEventListener('click', () => {
      ayadiModal.classList.remove('hidden');
    });
  }

  if (btnCloseAyadiModal) {
    btnCloseAyadiModal.addEventListener('click', () => {
      ayadiModal.classList.add('hidden');
    });
  }

  if (btnCalculateAyadi) {
    btnCalculateAyadi.addEventListener('click', () => {
      const l = parseFloat(ayadiLength.value);
      const w = parseFloat(ayadiWidth.value);
      
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
        showToast('Please enter valid length and width');
        return;
      }

      // Convert feet to Hastas (approx 1 Hasta = 2.75 feet or 33 inches)
      const hastaL = l / 2.75;
      const hastaW = w / 2.75;
      const area = Math.round(hastaL * hastaW);

      if (area <= 0) {
        showToast('Area too small to calculate');
        return;
      }

      // Traditional Ayadi Formulas based on Area (Kshetra)
      const aaya = (area * 8) % 12; // Income
      const vyaya = (area * 9) % 10; // Expenditure
      let yoni = (area * 3) % 8; // Direction/Life breath (1=Dhvaja, 2=Dhuma, 3=Simha, 4=Shva, 5=Vrshabha, 6=Khara, 7=Gaja, 0/8=Kaka)
      if (yoni === 0) yoni = 8;
      
      const nakshatra = (area * 8) % 27;
      
      let html = '';
      
      // Aaya vs Vyaya
      html += \`<p><strong>Aaya (Income):</strong> \${aaya}</p>\`;
      html += \`<p><strong>Vyaya (Expense):</strong> \${vyaya}</p>\`;
      if (aaya > vyaya) {
        html += \`<p style="color:#a7f3d0; margin-bottom:10px;">✅ Auspicious (Income is greater than Expense)</p>\`;
      } else {
        html += \`<p style="color:#fca5a5; margin-bottom:10px;">⚠️ Inauspicious (Expense is greater than or equal to Income). Consider adjusting dimensions slightly.</p>\`;
      }

      // Yoni
      const yoniNames = {1: 'Dhvaja (Flag - East - Very Auspicious)', 2: 'Dhuma (Smoke - SE - Inauspicious)', 3: 'Simha (Lion - South - Auspicious)', 4: 'Shva (Dog - SW - Inauspicious)', 5: 'Vrshabha (Bull - West - Auspicious)', 6: 'Khara (Donkey - NW - Inauspicious)', 7: 'Gaja (Elephant - North - Auspicious)', 8: 'Kaka (Crow - NE - Inauspicious)'};
      html += \`<p><strong>Yoni (Cosmic Orientation):</strong> \${yoni} - \${yoniNames[yoni]}</p>\`;
      
      if (yoni % 2 !== 0) {
        html += \`<p style="color:#a7f3d0; margin-bottom:10px;">✅ Auspicious Yoni (Odd numbers are beneficial)</p>\`;
      } else {
        html += \`<p style="color:#fca5a5; margin-bottom:10px;">⚠️ Inauspicious Yoni (Even numbers bring distress)</p>\`;
      }

      ayadiReportContent.innerHTML = html;
      ayadiResults.classList.remove('hidden');
    });
  }
`;

app = app.replace('  // --- Event Listeners Setup ---', jsCode + '\n\n  // --- Event Listeners Setup ---');
fs.writeFileSync('app.js', app);
console.log('Ayadi Calculator Added!');
