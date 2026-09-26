const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const regexDial = /\/\/ Dial Style\s*const selDial = document\.getElementById\('setting-dial-style'\);\s*if \(selDial\) \{\s*selDial\.value = dialTheme;\s*selDial\.addEventListener\('change', \(e\) => \{\s*dialTheme = e\.target\.value;\s*buildDialSvg\(\); \/\/ redraw the dial immediately\s*\}\);\s*\}/;

const newDialLogic = `// Dial Style
  const selDial = document.getElementById('setting-dial-style');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => {
      dialTheme = e.target.value;
      document.body.classList.remove('theme-elemental', 'theme-chakra', 'theme-gold');
      document.body.classList.add('theme-' + dialTheme);
      buildDialSvg(); // redraw the dial immediately
    });
  }`;

if(regexDial.test(app)) {
  app = app.replace(regexDial, newDialLogic);
  fs.writeFileSync('app.js', app);
  console.log('Fixed Dial Logic!');
} else {
  console.log('Regex Dial Failed!');
}
