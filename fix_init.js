const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Move buildDialSvg AFTER setupEventListeners in init()
app = app.replace(
  /function init\(\) \{\s*buildDialSvg\(\);\s*setupEventListeners\(\);/,
  `function init() {
    setupEventListeners();
    buildDialSvg();`
);

fs.writeFileSync('app.js', app);
console.log('Fixed init sequence');
