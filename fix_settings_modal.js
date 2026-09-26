const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Inject fetchVastuAnalysis into openAuditModal
const oldAuditEnd = `reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';
    }`;
const newAuditEnd = `reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';
    }

    const currentRoomObj = activeRoom ? (VASTU_DATA.ROOMS.find(r => r.id === activeRoom) || VASTU_DATA.COMMERCIAL_ROOMS.find(r => r.id === activeRoom)) : null;
    const dirName = activeZone8.names[currentLang] || activeZone8.names.en;
    
    // Trigger Vastu Analysis API (Local Mock)
    const zKey = activeZone8.id || Object.keys(VASTU_DATA.ZONES_8).find(k => VASTU_DATA.ZONES_8[k] === activeZone8);
    fetchVastuAnalysis(dirName, currentRoomObj, zKey);`;

if (!app.includes('fetchVastuAnalysis(dirName')) {
  app = app.replace(oldAuditEnd, newAuditEnd);
  // fallback for CRLF
  app = app.replace("reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';\r\n    }", newAuditEnd.replace(/\n/g, '\r\n'));
}

// 2. Fix Settings Modal Bindings
const regexBindings = /\/\/ Compass Mode\s*const radiosMode = document\.getElementsByName\('compass-mode'\);\s*radiosMode\.forEach\(r => r\.addEventListener\('change', \(e\) => \{\s*if \(e\.target\.checked\) \{\s*setCompassMode\(e\.target\.value\);\s*\}\s*\}\)\);\s*\/\/ Property Type\s*const selProp = document\.getElementById\('setting-property'\);\s*if \(selProp\) \{\s*selProp\.value = propertyType;\s*selProp\.addEventListener\('change', \(e\) => \{\s*propertyType = e\.target\.value;\s*if \(typeof updateRoomList === 'function'\) updateRoomList\(\);\s*\}\);\s*\}\s*\/\/ Zonal Division\s*const radiosZones = document\.getElementsByName\('zones'\);\s*radiosZones\.forEach\(r => r\.addEventListener\('change', \(e\) => \{\s*if \(e\.target\.checked\) \{\s*setZoneSystem\(e\.target\.value\);\s*\}\s*\}\)\);/;

const newBindings = `// Compass Mode
  const radiosMode = document.getElementsByName('compass-mode');
  radiosMode.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      compassMode = e.target.value;
      if (compassMode === 'simple') {
        if (zoneInspector) zoneInspector.classList.add('hidden');
        if (padaEntranceCard) padaEntranceCard.classList.add('hidden');
      } else {
        if (zoneInspector) zoneInspector.classList.remove('hidden');
        if (zoneSystem === '32' && padaEntranceCard) padaEntranceCard.classList.remove('hidden');
      }
      updateVastuInspector(currentHeading);
    }
  }));

  // Property Type
  const selProp = document.getElementById('setting-property');
  if (selProp) {
    selProp.value = propertyType;
    selProp.addEventListener('change', (e) => {
      propertyType = e.target.value;
      roomCategoryTab = propertyType;
      
      const retailProfileStrip = document.getElementById('retailProfileStrip');
      const tabResRooms = document.getElementById('tabResRooms');
      const tabCommRooms = document.getElementById('tabCommRooms');
      
      if (propertyType === 'commercial') {
        if (retailProfileStrip) retailProfileStrip.classList.remove('hidden');
        if (tabCommRooms) tabCommRooms.classList.add('active');
        if (tabResRooms) tabResRooms.classList.remove('active');
        showToast('Switched to Commercial Vastu');
      } else {
        if (retailProfileStrip) retailProfileStrip.classList.add('hidden');
        if (tabResRooms) tabResRooms.classList.add('active');
        if (tabCommRooms) tabCommRooms.classList.remove('active');
        showToast('Switched to Residential Vastu');
      }
      
      if (typeof populateRoomList === 'function') populateRoomList();
      updateVastuInspector(currentHeading);
    });
  }

  // Zonal Division
  const radiosZones = document.getElementsByName('zones');
  radiosZones.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      zoneSystem = e.target.value;
      if (zoneSystem === '32' && compassMode === 'vastu') {
        if (padaEntranceCard) padaEntranceCard.classList.remove('hidden');
      } else {
        if (padaEntranceCard) padaEntranceCard.classList.add('hidden');
      }
      updateVastuInspector(currentHeading);
    }
  }));`;

app = app.replace(regexBindings, newBindings);

// And we need to fix the dialTheme
const regexDial = /\/\/ Dial Style\s*const selDial = document\.getElementById\('setting-dial'\);\s*if \(selDial\) \{\s*selDial\.value = dialTheme;\s*selDial\.addEventListener\('change', \(e\) => setDialTheme\(e\.target\.value\)\);\s*\}/;
const newDial = `// Dial Style
  const selDial = document.getElementById('setting-dial');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => {
      dialTheme = e.target.value;
      // Drawing handles the theme automatically next frame
    });
  }`;

app = app.replace(regexDial, newDial);

fs.writeFileSync('app.js', app);
console.log('Fixed settings bindings!');
