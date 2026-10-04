const fs = require('fs');

// =============================================
// PRODUCTION-GRADE REFACTOR SCRIPT - v5.0.0
// Comprehensive audit-driven fixes
// =============================================

let fixes = 0;

// ========== 1. FIX SERVICE WORKER (sw.js) ==========
let sw = fs.readFileSync('sw.js', 'utf8');

// ISSUE: Network-First for ALL JS/CSS kills offline performance.
// FIX: Only use Network-First for HTML navigation. Use Stale-While-Revalidate for JS/CSS/icons.
sw = `const CACHE_NAME = 'kuberan-vastu-compass-v5.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './vastu-data.js',
  'https://cdn.jsdelivr.net/npm/geomagnetism@1.2.0/dist/geomagnetism.min.js',
  './qrcode.min.js',
  './app.js',
  './manifest.webmanifest',
  './assets/images/kuberan_logo_white_bg.png',
  './assets/images/kuberan_logo_transparent.png',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url).catch(err => console.warn('SW: failed to cache', url, err)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  // HTML Navigation: Network-First (so updates appear instantly)
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true })
          .then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // JS, CSS, Icons: Stale-While-Revalidate (instant load + background update)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
`;
fs.writeFileSync('sw.js', sw);
fixes++;
console.log('  [SW] Rewrote with Stale-While-Revalidate strategy for JS/CSS/icons');


// ========== 2. FIX app.js ==========
let app = fs.readFileSync('app.js', 'utf8');

// --- 2A: Remove dead githubRepoLink variable ---
app = app.replace("  const githubRepoLink = document.getElementById('githubRepoLink');\r\n", '');
app = app.replace("  const githubRepoLink = document.getElementById('githubRepoLink');\n", '');
fixes++;
console.log('  [JS] Removed dead githubRepoLink variable');

// --- 2B: Remove dead btnModeVastu/btnModeSimple event listeners ---
// These buttons no longer exist in the HTML but their listeners still fire on null
app = app.replace(
  /    \/\/ Mode Switcher \(Vastu vs Simple Compass\)\r?\n    if \(btnModeVastu\) btnModeVastu\.addEventListener[\s\S]*?showToast\('Switched to Simple Compass'\);\r?\n    \}\);\r?\n/,
  '    // Mode Switcher removed (app locked to Vastu mode)\n'
);
fixes++;
console.log('  [JS] Removed dead Mode Switcher event listeners');

// --- 2C: Fix estimateMagneticDeclination called with 3 args but only accepts 2 ---
app = app.replace(
  "magneticDeclination = estimateMagneticDeclination(lat, lng, alt !== null ? alt : 0);",
  "magneticDeclination = estimateMagneticDeclination(lat, lng);"
);
fixes++;
console.log('  [JS] Fixed estimateMagneticDeclination argument mismatch');

// --- 2D: Fix redundant duplicate null checks ---
app = app.replace(
  "    if (telemetryCalibrationItem) {\r\n      if (telemetryCalibrationItem) telemetryCalibrationItem.addEventListener",
  "    if (telemetryCalibrationItem) {\r\n      telemetryCalibrationItem.addEventListener"
);
app = app.replace(
  "    if (btnCloseCalModal) {\r\n      if (btnCloseCalModal) btnCloseCalModal.addEventListener",
  "    if (btnCloseCalModal) {\r\n      btnCloseCalModal.addEventListener"
);
app = app.replace(
  "    if (calibrationModal) {\r\n      if (calibrationModal) calibrationModal.addEventListener",
  "    if (calibrationModal) {\r\n      calibrationModal.addEventListener"
);
app = app.replace(
  "    if (btnDismissSensor) {\r\n      if (btnDismissSensor) btnDismissSensor.addEventListener",
  "    if (btnDismissSensor) {\r\n      btnDismissSensor.addEventListener"
);
app = app.replace(
  "    if (btnZeroToNorth) {\r\n      if (btnZeroToNorth) btnZeroToNorth.addEventListener",
  "    if (btnZeroToNorth) {\r\n      btnZeroToNorth.addEventListener"
);
fixes++;
console.log('  [JS] Cleaned up redundant duplicate null checks');

// --- 2E: Add Magnetometer error handler ---
app = app.replace(
  "magnetometer.start();",
  `magnetometer.addEventListener('error', (e) => {
          console.warn('Magnetometer error:', e.error.name, e.error.message);
          // NotReadableError means sensor is blocked by another app or hardware issue
          if (e.error.name === 'NotAllowedError') {
            console.log('Magnetometer permission denied');
          }
        });
        magnetometer.start();`
);
fixes++;
console.log('  [JS] Added Magnetometer error event handler');

// --- 2F: Improve Ayadi Calculator with proper Hasta and dual-method calculation ---
const oldAyadiCalc = `      // Convert feet to Hastas (approx 1 Hasta = 2.75 feet or 33 inches)
      const hastaL = l / 2.75;
      const hastaW = w / 2.75;
      const area = Math.round(hastaL * hastaW);

      if (area <= 0) {
        showToast('Area too small to calculate');
        return;
      }

      // Traditional Ayadi Formulas based on Area (Kshetra)
      const aaya = ((area * 8) % 12) || 12; // Income
      const vyaya = ((area * 9) % 10) || 10; // Expenditure
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
      }`;

const newAyadiCalc = `      // Convert feet to Hastas (1 Hasta = 18 inches = 1.5 feet per Manasara/Mayamatam)
      const hastaL = l / 1.5;
      const hastaW = w / 1.5;
      const perimeter = Math.round(2 * (hastaL + hastaW));
      const area = Math.round(hastaL * hastaW);

      if (perimeter <= 0 || area <= 0) {
        showToast('Dimensions too small to calculate');
        return;
      }

      // Ayadi Shadvarga Formulas (Perimeter-based per Manasara Shilpa Shastra)
      // Using perimeter (Paridhi) which is the primary input in classical texts
      const aaya = ((perimeter * 8) % 12) || 12;     // Aaya (Income/Growth)
      const vyaya = ((perimeter * 9) % 10) || 10;    // Vyaya (Expenditure/Loss)
      let yoni = ((perimeter * 3) % 8);               // Yoni (Cosmic Orientation)
      if (yoni === 0) yoni = 8;
      const nakshatra = ((perimeter * 8) % 27) || 27; // Nakshatra (Lunar Mansion)
      const vaara = ((perimeter * 9) % 7) || 7;       // Vaara (Day of the Week)
      const tithi = ((perimeter * 8) % 30) || 30;     // Tithi (Lunar Day)

      const yoniNames = {
        1: 'Dhvaja (Flag - East)',
        2: 'Dhuma (Smoke - SE)',
        3: 'Simha (Lion - South)',
        4: 'Shva (Dog - SW)',
        5: 'Vrshabha (Bull - West)',
        6: 'Khara (Donkey - NW)',
        7: 'Gaja (Elephant - North)',
        8: 'Kaka (Crow - NE)'
      };
      const yoniAuspicious = {1: true, 3: true, 5: true, 7: true, 2: false, 4: false, 6: false, 8: false};

      const nakshatraNames = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','P.Phalguni','U.Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','P.Ashadha','U.Ashadha','Shravana','Dhanishta','Shatabhisha','P.Bhadrapada','U.Bhadrapada','Revati'];
      const vaaraNames = ['', 'Sunday (Ravi)', 'Monday (Soma)', 'Tuesday (Mangal)', 'Wednesday (Budha)', 'Thursday (Guru)', 'Friday (Shukra)', 'Saturday (Shani)'];

      let html = '';

      // Input Summary
      html += \`<p style="opacity:0.7; font-size:0.85rem; margin-bottom:10px;">Dimensions: \${l}ft × \${w}ft → \${hastaL.toFixed(1)} × \${hastaW.toFixed(1)} Hastas (1 Hasta = 18")<br>Perimeter: \${perimeter} Hastas · Area: \${area} sq. Hastas</p>\`;

      // Aaya vs Vyaya
      html += \`<p><strong>Aaya (Income):</strong> \${aaya} &nbsp;|&nbsp; <strong>Vyaya (Expense):</strong> \${vyaya}</p>\`;
      if (aaya > vyaya) {
        html += \`<p style="color:#a7f3d0; margin-bottom:12px;">✅ <strong>Auspicious</strong> — Income exceeds Expense (Prosperity indicated)</p>\`;
      } else if (aaya === vyaya) {
        html += \`<p style="color:#fde68a; margin-bottom:12px;">⚠️ <strong>Neutral</strong> — Income equals Expense (No net gain or loss)</p>\`;
      } else {
        html += \`<p style="color:#fca5a5; margin-bottom:12px;">❌ <strong>Inauspicious</strong> — Expense exceeds Income. Adjust dimensions by ±6 inches and recalculate.</p>\`;
      }

      // Yoni
      html += \`<p><strong>Yoni:</strong> \${yoni} — \${yoniNames[yoni]}</p>\`;
      if (yoniAuspicious[yoni]) {
        html += \`<p style="color:#a7f3d0; margin-bottom:12px;">✅ Auspicious Yoni (Odd-numbered Yonis bring prosperity)</p>\`;
      } else {
        html += \`<p style="color:#fca5a5; margin-bottom:12px;">❌ Inauspicious Yoni (Even-numbered Yonis bring hardship)</p>\`;
      }

      // Nakshatra, Vaara, Tithi
      html += \`<p><strong>Nakshatra:</strong> \${nakshatra} — \${nakshatraNames[(nakshatra - 1) % 27]}</p>\`;
      html += \`<p><strong>Vaara (Day):</strong> \${vaaraNames[vaara]}</p>\`;
      html += \`<p><strong>Tithi:</strong> \${tithi}</p>\`;

      // Overall Verdict
      const score = (aaya > vyaya ? 1 : 0) + (yoniAuspicious[yoni] ? 1 : 0);
      if (score === 2) {
        html += \`<div style="margin-top:15px; padding:10px; background:rgba(167,243,208,0.15); border:1px solid #a7f3d0; border-radius:8px;"><strong style="color:#a7f3d0;">🕉️ OVERALL: HIGHLY AUSPICIOUS</strong><br><span style="font-size:0.85rem;">These dimensions are cosmically aligned. Proceed with construction.</span></div>\`;
      } else if (score === 1) {
        html += \`<div style="margin-top:15px; padding:10px; background:rgba(253,230,138,0.15); border:1px solid #fde68a; border-radius:8px;"><strong style="color:#fde68a;">⚠️ OVERALL: PARTIALLY AUSPICIOUS</strong><br><span style="font-size:0.85rem;">One parameter is unfavorable. Consider adjusting dimensions by small increments.</span></div>\`;
      } else {
        html += \`<div style="margin-top:15px; padding:10px; background:rgba(252,165,165,0.15); border:1px solid #fca5a5; border-radius:8px;"><strong style="color:#fca5a5;">❌ OVERALL: INAUSPICIOUS</strong><br><span style="font-size:0.85rem;">Both Aaya and Yoni are unfavorable. Strongly recommended to adjust the building dimensions.</span></div>\`;
      }`;

app = app.replace(oldAyadiCalc, newAyadiCalc);
fixes++;
console.log('  [JS] Upgraded Ayadi Calculator: proper Hasta (18"), perimeter-based formulas, full Shadvarga (6 calculations), overall verdict');

// --- 2G: Fix updateHeadingUI cardIndex lookup ---
// Line 961: Using cardIndex from Math.round(heading/45)%8 to index into ZONES_8 array
// This assumes ZONES_8 is ordered N,NE,E,SE,S,SW,W,NW which it is, but the cardIndex
// can be wrong at boundary (360/45 = 8, %8 = 0 = N, correct)
// Actually this is fine. Let me check if getActiveZone8 is called too.
// It calls getActiveZone8 separately in updateVastuInspector. The cardIndex in updateHeadingUI
// is just for the cardinal text display, not for zone detection. This is OK.

// --- 2H: Remove dead code in buildDialSvg ---
// The entire `if (compassMode === 'simple')` branch is dead code since compassMode is locked to 'vastu'
// But it's hundreds of lines. Let's leave it for now as it doesn't cause bugs, just bloat.
// Instead, let's add a guard at the top:
app = app.replace(
  "    if (compassMode === 'simple') {\r\n      // -------------------------------------------------------------\r\n      // SIMPLE COMPASS DIAL (Authentic Nautical Precision Dial)\r\n      // -------------------------------------------------------------",
  "    if (false /* compassMode === 'simple' — removed: app locked to Vastu mode */) {\r\n      // SIMPLE COMPASS DIAL — Dead code, kept for reference"
);
fixes++;
console.log('  [JS] Disabled dead Simple Compass dial rendering branch');

// --- 2I: Fix empty catch blocks with console.warn ---
let catchCount = 0;
app = app.replace(/catch\s*\(\s*e\s*\)\s*\{\s*\}/g, () => {
  catchCount++;
  return 'catch(e) { /* localStorage/vibrate may be blocked in private browsing */ }';
});
fixes++;
console.log(`  [JS] Annotated ${catchCount} empty catch blocks`);

// --- 2J: Add sensorStatus null guard in Magnetometer handler ---
app = app.replace(
  "sensorStatus.textContent = '⚠️ High Interference Detected (' + Math.round(fieldStrength) + ' µT)';",
  "if (sensorStatus) sensorStatus.textContent = '⚠️ High Interference Detected (' + Math.round(fieldStrength) + ' µT)';"
);
app = app.replace(
  "sensorStatus.style.color = '#fca5a5';",
  "if (sensorStatus) sensorStatus.style.color = '#fca5a5';"
);
app = app.replace(
  "sensorStatus.textContent = 'North tracking active';",
  "if (sensorStatus) sensorStatus.textContent = 'North tracking active';"
);
app = app.replace(
  "sensorStatus.style.color = 'var(--text-main)';",
  "if (sensorStatus) sensorStatus.style.color = 'var(--text-main)';"
);
fixes++;
console.log('  [JS] Added null guards on sensorStatus in Magnetometer handler');

fs.writeFileSync('app.js', app);
console.log(`[JS] Total fixes applied: ${fixes}`);


// ========== 3. VERSION BUMP ==========
['index.html', 'manifest.webmanifest'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/v=4\.9\.3/g, 'v=5.0.0').replace(/v4\.9\.3/g, 'v5.0.0');
  fs.writeFileSync(file, content);
});

console.log('\n=== PRODUCTION REFACTOR v5.0.0 COMPLETE ===');
console.log(`Total fixes: ${fixes}`);
