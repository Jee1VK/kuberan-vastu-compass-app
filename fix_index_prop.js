const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');

// Replace the entire Property Type block
const propertyBlockRegex = /<div class="setting-item">\s*<label for="setting-property">Property Type<\/label>\s*<select id="setting-property" class="setting-select">\s*<option value="residential">Residential<\/option>\s*<option value="commercial">Commercial<\/option>\s*<option value="retail">Retail<\/option>\s*<\/select>\s*<\/div>/;

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

index = index.replace(propertyBlockRegex, newPropItem);
fs.writeFileSync('index.html', index);
console.log('Fixed property block in index.html');
