const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The block to remove:
// <div class="setting-item">
//   <label>Compass Mode</label>
//   <div class="toggle-group">
//     <input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>
//     <label for="st-mode-vastu">Vastu Mode</label>
//     <input type="radio" id="st-mode-simple" name="compass-mode" value="simple">
//     <label for="st-mode-simple">Standard</label>
//   </div>
// </div>

const compassModeRegex = /<div class="setting-item">\s*<label>Compass Mode<\/label>\s*<div class="toggle-group">\s*<input type="radio" id="st-mode-vastu" name="compass-mode" value="vastu" checked>\s*<label for="st-mode-vastu">Vastu Mode<\/label>\s*<input type="radio" id="st-mode-simple" name="compass-mode" value="simple">\s*<label for="st-mode-simple">Standard<\/label>\s*<\/div>\s*<\/div>/g;

if (compassModeRegex.test(html)) {
  html = html.replace(compassModeRegex, '');
  fs.writeFileSync('index.html', html);
  console.log('Compass Mode removed from index.html');
} else {
  console.log('Regex did not match. Check formatting.');
}
