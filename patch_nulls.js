const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Helper function for safe text setting
const helper = `function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}`;

app = app.replace('function setLanguage(langCode) {', helper + '\n\n  function setLanguage(langCode) {');

// 2. Replace all direct `document.getElementById(...).textContent = ...` in setLanguage
app = app.replace(/document\.getElementById\('([^']+)'\)\.textContent\s*=\s*(.*?);/g, 'setText(\'$1\', $2);');

// 3. Fix btnZone variables in setLanguage
app = app.replace(/btnZone8\.textContent\s*=\s*(.*?);/g, 'if (btnZone8) btnZone8.textContent = $1;');
app = app.replace(/btnZone16\.textContent\s*=\s*(.*?);/g, 'if (btnZone16) btnZone16.textContent = $1;');
app = app.replace(/btnZone32\.textContent\s*=\s*(.*?);/g, 'if (btnZone32) btnZone32.textContent = $1;');
app = app.replace(/btnZone8\.classList/g, 'if (btnZone8) btnZone8.classList');
app = app.replace(/btnZone16\.classList/g, 'if (btnZone16) btnZone16.classList');
app = app.replace(/btnZone32\.classList/g, 'if (btnZone32) btnZone32.classList');

// 4. Any missing modals like `langModal` etc that might have listeners attached?
app = app.replace(/btnLanguage\.addEventListener/g, 'if (btnLanguage) btnLanguage.addEventListener');
app = app.replace(/btnCloseLangModal\.addEventListener/g, 'if (btnCloseLangModal) btnCloseLangModal.addEventListener');

// Fix old variables that were set to null due to DOM removal
app = app.replace(/btnToggleNorth\.addEventListener/g, 'if (btnToggleNorth) btnToggleNorth.addEventListener');
app = app.replace(/btnDialTheme\.addEventListener/g, 'if (btnDialTheme) btnDialTheme.addEventListener');
app = app.replace(/btnModeVastu\.addEventListener/g, 'if (btnModeVastu) btnModeVastu.addEventListener');
app = app.replace(/btnModeSimple\.addEventListener/g, 'if (btnModeSimple) btnModeSimple.addEventListener');
app = app.replace(/btnZone8\.addEventListener/g, 'if (btnZone8) btnZone8.addEventListener');
app = app.replace(/btnZone16\.addEventListener/g, 'if (btnZone16) btnZone16.addEventListener');
app = app.replace(/btnZone32\.addEventListener/g, 'if (btnZone32) btnZone32.addEventListener');

fs.writeFileSync('app.js', app);
console.log('App patched safely!');
