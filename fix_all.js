const fs = require('fs');

// --- 1. Modify index.html ---
let index = fs.readFileSync('index.html', 'utf8');

// Remove Compass Mode from Settings Modal
const compassModeRegex = /<div class="setting-group">\s*<div class="setting-label">.*Compass Mode<\/div>\s*<div class="setting-controls">\s*<label class="setting-radio">\s*<input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>\s*<span>.*Vastu Compass<\/span>\s*<\/label>\s*<label class="setting-radio">\s*<input type="radio" id="st-mode-simple" name="compass-mode" value="simple">\s*<span>.*Simple Compass<\/span>\s*<\/label>\s*<\/div>\s*<\/div>/g;
index = index.replace(compassModeRegex, '');

// Add Retail Profile dropdown under Property Type
const propertyTypeGroup = /<div class="setting-group">\s*<div class="setting-label">.*Property Type<\/div>\s*<select id="setting-property" class="setting-select">\s*<option value="residential">Residential Vastu<\/option>\s*<option value="commercial">Commercial & Retail<\/option>\s*<\/select>\s*<\/div>/;

const retailProfileHtml = `<div class="setting-group">
            <div class="setting-label">🏠 Property Type</div>
            <select id="setting-property" class="setting-select">
              <option value="residential">Residential Vastu</option>
              <option value="commercial">Commercial & Retail</option>
            </select>
          </div>
          
          <div class="setting-group hidden" id="retailProfileSettingGroup">
            <div class="setting-label">🛍️ Retail Business Category</div>
            <select id="setting-retail-profile" class="setting-select">
              <option value="apparel_silk_sarees">Apparel & Silk Sarees</option>
              <option value="jewelry_luxury">Jewelry & Luxury</option>
              <option value="general_commercial">General Commercial</option>
            </select>
          </div>`;

index = index.replace(propertyTypeGroup, retailProfileHtml);

fs.writeFileSync('index.html', index);
console.log('Fixed index.html');


// --- 2. Modify app.js ---
let app = fs.readFileSync('app.js', 'utf8');

// Remove compassMode toggle logic
app = app.replace(/\/\/ Compass Mode[\s\S]*?\}\)\);\s*\/\/ Property Type/, '// Property Type');

// Remove compassMode logic from zoneSystem change
app = app.replace(/if \(zoneSystem === '32' && compassMode === 'vastu'\)/g, "if (zoneSystem === '32')");

// Fix generateLocalVastuAnalysis roomName
app = app.replace(/roomName = roomObj\.name\.en \|\| roomObj\.name;/g, "roomName = (roomObj.names && roomObj.names.en) ? roomObj.names.en : roomObj.id;");

// Update Property Type logic to handle Retail dropdown
const propTypeLogicRegex = /\/\/ Property Type\s*const selProp = document\.getElementById\('setting-property'\);\s*if \(selProp\) \{[\s\S]*?\}\)\;\s*\}/;
const newPropLogic = `// Property Type
  const selProp = document.getElementById('setting-property');
  const selRetail = document.getElementById('setting-retail-profile');
  const retailGroup = document.getElementById('retailProfileSettingGroup');
  
  if (selProp) {
    selProp.value = propertyType;
    if (propertyType === 'commercial' && retailGroup) {
      retailGroup.classList.remove('hidden');
    }
    
    selProp.addEventListener('change', (e) => {
      propertyType = e.target.value;
      roomCategoryTab = propertyType;
      
      const tabResRooms = document.getElementById('tabResRooms');
      const tabCommRooms = document.getElementById('tabCommRooms');
      
      if (propertyType === 'commercial') {
        if (retailGroup) retailGroup.classList.remove('hidden');
        if (tabCommRooms) tabCommRooms.classList.add('active');
        if (tabResRooms) tabResRooms.classList.remove('active');
        showToast('Switched to Commercial Vastu');
      } else {
        if (retailGroup) retailGroup.classList.add('hidden');
        if (tabResRooms) tabResRooms.classList.add('active');
        if (tabCommRooms) tabCommRooms.classList.remove('active');
        showToast('Switched to Residential Vastu');
      }
      
      if (typeof renderRoomsGrid === 'function') renderRoomsGrid();
      updateVastuInspector(currentHeading);
      buildDialSvg();
    });
  }

  // Retail Profile
  if (selRetail) {
    selRetail.value = retailProfile;
    selRetail.addEventListener('change', (e) => {
      retailProfile = e.target.value;
      showToast('Retail Profile Updated');
      buildDialSvg();
      updateVastuInspector(currentHeading);
    });
  }`;

app = app.replace(propTypeLogicRegex, newPropLogic);

// Fix Dial Style body class assignment
const dialStyleRegex = /\/\/ Dial Style\s*const selDial = document\.getElementById\('setting-dial-style'\);\s*if \(selDial\) \{\s*selDial\.value = dialTheme;\s*selDial\.addEventListener\('change', \(e\) => \{\s*dialTheme = e\.target\.value;\s*buildDialSvg\(\);\s*\}\);\s*\}/;

const newDialLogic = `// Dial Style
  const selDial = document.getElementById('setting-dial-style');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => {
      dialTheme = e.target.value;
      document.body.classList.remove('theme-elemental', 'theme-chakra', 'theme-gold');
      document.body.classList.add('theme-' + dialTheme);
      buildDialSvg();
    });
  }`;

app = app.replace(dialStyleRegex, newDialLogic);

fs.writeFileSync('app.js', app);
console.log('Fixed app.js');
