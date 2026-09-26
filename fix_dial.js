const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const regexDial = /\/\/ Dial Style\s*const selDial = document\.getElementById\('setting-dial-style'\);\s*if \(selDial\) \{\s*selDial\.value = dialTheme;\s*selDial\.addEventListener\('change', \(e\) => setDialTheme\(e\.target\.value\)\);\s*\}/;
const newDial = `// Dial Style
  const selDial = document.getElementById('setting-dial-style');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => {
      dialTheme = e.target.value;
      buildDialSvg(); // redraw the dial immediately
    });
  }`;

if(regexDial.test(app)) {
  app = app.replace(regexDial, newDial);
  fs.writeFileSync('app.js', app);
  console.log('Dial style fixed');
} else {
  console.log('Dial regex failed');
}
