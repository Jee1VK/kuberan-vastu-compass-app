const fs = require('fs');

let index = fs.readFileSync('index.html', 'utf8');

const propItem = /<div class="setting-item">\s*<label for="setting-property">Property Type<\/label>\s*<select id="setting-property" class="setting-select">\s*<option value="residential">Residential<\/option>\s*<option value="commercial">Commercial<\/option>\s*<\/select>\s*<\/div>/;

const newPropItem = `<div class="setting-item">
          <label for="setting-property">Property Type</label>
          <select id="setting-property" class="setting-select">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        
        <div class="setting-item hidden" id="retailProfileSettingGroup">
          <label for="setting-retail-profile">Retail Business Category</label>
          <select id="setting-retail-profile" class="setting-select">
            <option value="apparel_silk_sarees">Apparel & Silk Sarees</option>
            <option value="jewelry_luxury">Jewelry & Luxury</option>
            <option value="general_commercial">General Commercial</option>
          </select>
        </div>`;

if(propItem.test(index)) {
  index = index.replace(propItem, newPropItem);
  fs.writeFileSync('index.html', index);
  console.log('Fixed index.html properly');
} else {
  console.log('Failed to match property setting item.');
}

// Remove the Compass Mode from index.html (it uses setting-item too!)
const compassModeRegex = /<div class="setting-item">\s*<label>Compass Mode<\/label>\s*<div class="setting-radio-group">\s*<label>\s*<input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>\s*Vastu\s*<\/label>\s*<label>\s*<input type="radio" id="st-mode-simple" name="compass-mode" value="simple">\s*Simple\s*<\/label>\s*<\/div>\s*<\/div>/g;
index = index.replace(compassModeRegex, '');
fs.writeFileSync('index.html', index);
console.log('Removed compass mode');

