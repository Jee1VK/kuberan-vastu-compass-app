const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const jsLogic = `
  // --- VASTU REMEDIES OFFLINE ENGINE ---
  const REMEDY_SETTING_KEY = 'kuberan_show_vastu_remedies';
  const toggleRemedies = document.getElementById('toggle-remedies');
  
  if (toggleRemedies) {
    const isRemedyEnabled = localStorage.getItem(REMEDY_SETTING_KEY) === 'true';
    toggleRemedies.checked = isRemedyEnabled;
    
    toggleRemedies.addEventListener('change', (e) => {
      localStorage.setItem(REMEDY_SETTING_KEY, e.target.checked);
      applyRemedyVisibility(e.target.checked);
    });
  }

  function applyRemedyVisibility(show) {
    const remedyPanels = document.querySelectorAll('.remedy-card');
    remedyPanels.forEach(panel => {
      if (show) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    });
  }

  async function fetchVastuAnalysis(direction, roomObj, activeZoneKey) {
    const container = document.getElementById('vastu-analysis-container');
    if (!container) return;
    
    container.innerHTML = \`<p style="padding: 10px; color: #fbbf24; font-style: italic; text-align: center;">⚙️ Analyzing Pancha Tattva parameters...</p>\`;

    // Simulate AI loading delay
    await new Promise(r => setTimeout(r, 600));

    try {
      const data = generateLocalVastuAnalysis(direction, roomObj, activeZoneKey);
      renderVastuResult(data);
    } catch (error) {
      console.error('Vastu Engine Error:', error);
      container.innerHTML = \`<p style="color:red; text-align:center;">Error generating Vastu recommendations.</p>\`;
    }
  }

  function generateLocalVastuAnalysis(directionName, roomObj, zoneKey) {
    let roomName = 'General Layout';
    let isCompliant = true;
    let severity = 'NONE';
    let conflict = 'Placement is generally compliant or neutral.';
    
    const remedies = {
      simple_fixes: [],
      elemental_cures: [],
      vastu_instruments: []
    };

    if (roomObj && roomObj.name) {
      roomName = roomObj.name.en || roomObj.name;
      const zCode = zoneKey;
      
      if (roomObj.idealZones && roomObj.idealZones.includes(zCode)) {
        isCompliant = true;
        severity = 'NONE';
        conflict = 'No dosha detected. This placement is highly recommended.';
      } 
      else if (roomObj.avoidZones && roomObj.avoidZones.includes(zCode)) {
        isCompliant = false;
        severity = 'HIGH';
      } 
      else {
        isCompliant = false;
        severity = 'MEDIUM';
      }
    }

    if (!isCompliant) {
      if (zoneKey === 'NE' || zoneKey === 'NNE' || zoneKey === 'ENE') {
        conflict = 'Water element (North-East) clash detected. Disturbs cosmic energies and mental peace.';
        remedies.simple_fixes.push('Keep the area completely clutter-free, clean, and brightly lit.');
        remedies.simple_fixes.push('Place a bowl of uncrushed sea salt in the corner to absorb negative vibrations.');
        remedies.elemental_cures.push('Introduce Zinc or Aluminum objects to balance the sector.');
        remedies.elemental_cures.push('Place a small water fountain or a kalash with water.');
        remedies.vastu_instruments.push('Install a Vastu Copper Pyramid or a Sri Yantra on the Eastern wall.');
      } else if (zoneKey === 'SE' || zoneKey === 'ESE' || zoneKey === 'SSE') {
        conflict = 'Fire element (South-East) mismatch. Imbalances here affect liquidity, cash flow, and health.';
        remedies.simple_fixes.push('Use light shades of green or yellow for curtains/walls.');
        remedies.simple_fixes.push('Light a red bulb or candle in this zone daily.');
        remedies.elemental_cures.push('Place Copper elemental strips or a Copper Swastik on the floor/wall.');
        remedies.vastu_instruments.push('Keep a Vastu Fire Pyramid (Agni) or Shukra Yantra in the SE corner.');
      } else if (zoneKey === 'SW' || zoneKey === 'WSW' || zoneKey === 'SSW') {
        conflict = 'Earth element (South-West) instability. Affects stability, relationships, and the head of the family.';
        remedies.simple_fixes.push('Place heavy furniture or storage cabinets here to ground the energy.');
        remedies.simple_fixes.push('Use earthy tones like brown, beige, or yellow.');
        remedies.elemental_cures.push('Use Lead or Brass metallic cures (strips or blocks) along the skirting.');
        remedies.vastu_instruments.push('Install a Rahu Yantra or a Lead Helix (Vastu Spring) to stabilize the dosha.');
      } else if (zoneKey === 'NW' || zoneKey === 'WNW' || zoneKey === 'NNW') {
        conflict = 'Air element (North-West) dosha. Imbalances cause legal issues, unstable support, and mental unrest.';
        remedies.simple_fixes.push('Ensure cross-ventilation and avoid cluttering this zone.');
        remedies.simple_fixes.push('Place wind chimes with 6 or 8 hollow metal rods.');
        remedies.elemental_cures.push('Use Brass or Silver metallic strips to contain the air element.');
        remedies.vastu_instruments.push('Install a Chandra Yantra or a Brass Helix to harmonize the zone.');
      } else {
        conflict = 'Cardinal axis imbalance affects overall flow of Prana (cosmic energy) across the property grid.';
        remedies.simple_fixes.push('Cleanse the area with camphor or sage weekly.');
        remedies.elemental_cures.push('Use appropriate metal harmonizers (Copper for East, Brass for South).');
        remedies.vastu_instruments.push('Use Vastu directional pyramids specific to the affected wall.');
      }
    }

    return {
      direction: directionName,
      room: roomName,
      isCompliant: isCompliant,
      severity: severity,
      elementalConflict: conflict,
      remedies: remedies
    };
  }

  function renderVastuResult(data) {
    const container = document.getElementById('vastu-analysis-container');
    if (!container) return;
    const isRemedyEnabled = localStorage.getItem(REMEDY_SETTING_KEY) === 'true';
    const remedyCardClass = isRemedyEnabled ? 'remedy-card' : 'remedy-card hidden';

    if (data.isCompliant) {
      container.innerHTML = \`
        <div class="vastu-success" style="padding:10px; text-align:left;">
          <h3 style="font-size:1.1rem;">✅ \${data.direction} - \${data.room}</h3>
          <p style="font-size:0.9rem; opacity:0.9; margin:0;">This placement is fully compliant with Vastu Shastra rules.</p>
        </div>
      \`;
      return;
    }

    let html = \`
      <div class="vastu-defect" style="text-align:left; padding:10px 0;">
        <h3 style="font-size:1.1rem;">⚠️ Vastu Defect (\${data.severity})</h3>
        <p style="font-size:0.9rem; opacity:0.9; margin:4px 0;"><strong>Dir:</strong> \${data.direction} | <strong>Room:</strong> \${data.room}</p>
        <p style="font-size:0.85rem; color:#fca5a5; margin:4px 0;"><em>\${data.elementalConflict}</em></p>

        <div class="\${remedyCardClass}">
          <h4>⚡ Recommended Cures</h4>
          
          \${data.remedies.simple_fixes.length > 0 ? \`
            <div class="remedy-section-title">Household Fixes</div>
            <ul class="remedy-list">
              \${data.remedies.simple_fixes.map(r => \`<li>\${r}</li>\`).join('')}
            </ul>
          \` : ''}

          \${data.remedies.elemental_cures.length > 0 ? \`
            <div class="remedy-section-title">Elemental Cures</div>
            <ul class="remedy-list">
              \${data.remedies.elemental_cures.map(r => \`<li>\${r}</li>\`).join('')}
            </ul>
          \` : ''}

          \${data.remedies.vastu_instruments.length > 0 ? \`
            <div class="remedy-section-title">Vastu Instruments</div>
            <ul class="remedy-list">
              \${data.remedies.vastu_instruments.map(r => \`<li>\${r}</li>\`).join('')}
            </ul>
          \` : ''}
        </div>
      </div>
    \`;

    container.innerHTML = html;
  }
`;

app = app.replace('// --- SETTINGS MODAL BINDINGS (v4.6.4) ---', jsLogic + '\n  // --- SETTINGS MODAL BINDINGS (v4.6.4) ---');

// Call fetchVastuAnalysis inside openAuditModal
const fetchCall = `
    const currentRoomObj = activeRoom ? (VASTU_DATA.ROOMS.find(r => r.id === activeRoom) || VASTU_DATA.COMMERCIAL_ROOMS.find(r => r.id === activeRoom)) : null;
    const dirName = activeZone8.names[currentLang] || activeZone8.names.en;
    
    // Trigger Vastu Analysis API (Local Mock)
    fetchVastuAnalysis(dirName, currentRoomObj, activeZone8.id || Object.keys(VASTU_DATA.ZONES_8).find(k => VASTU_DATA.ZONES_8[k] === activeZone8));
`;

app = app.replace("reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';\n    }", "reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';\n    }\n" + fetchCall);

fs.writeFileSync('app.js', app);
console.log('JS logic injected safely');
