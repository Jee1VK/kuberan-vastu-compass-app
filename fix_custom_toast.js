const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldToggleRegex = /toggleRemedies\.addEventListener\('change', \(e\) => \{\s*localStorage\.setItem\(REMEDY_SETTING_KEY, e\.target\.checked\);\s*applyRemedyVisibility\(e\.target\.checked\);\s*if \(e\.target\.checked\) \{\s*showToast\('Please use the Zone Finder \(grid icon\) to select a room\.\.\. Then open this report to generate an AI Vastu Dosha analysis and view remedies\.'\);\s*\}\s*\}\);/;

const newToggle = `toggleRemedies.addEventListener('change', (e) => {
      localStorage.setItem(REMEDY_SETTING_KEY, e.target.checked);
      applyRemedyVisibility(e.target.checked);
      if (e.target.checked) {
        let remedyToast = document.getElementById('remedyToastAlert');
        if (!remedyToast) {
          remedyToast = document.createElement('div');
          remedyToast.id = 'remedyToastAlert';
          remedyToast.style.position = 'fixed';
          remedyToast.style.bottom = '30px';
          remedyToast.style.left = '50%';
          remedyToast.style.transform = 'translateX(-50%)';
          remedyToast.style.backgroundColor = 'rgba(20, 25, 35, 0.98)';
          remedyToast.style.color = '#f7eedd';
          remedyToast.style.padding = '15px 20px';
          remedyToast.style.borderRadius = '12px';
          remedyToast.style.border = '1px solid #d4a359';
          remedyToast.style.zIndex = '99999';
          remedyToast.style.width = '85%';
          remedyToast.style.maxWidth = '400px';
          remedyToast.style.boxShadow = '0 10px 40px rgba(0,0,0,0.8)';
          remedyToast.style.display = 'flex';
          remedyToast.style.alignItems = 'flex-start';
          remedyToast.style.gap = '10px';
          remedyToast.style.fontFamily = 'inherit';
          remedyToast.style.fontSize = '0.9rem';
          remedyToast.style.lineHeight = '1.4';
          
          remedyToast.innerHTML = \`
            <div style="flex:1;">
              <strong style="color:#d4a359; font-size:1rem; display:block; margin-bottom:5px;">ℹ️ Vastu AI Engine</strong>
              <span style="opacity:0.9;">Please use the <strong>Zone Finder (grid icon)</strong> to select a room... Then open this report to generate an AI Vastu Dosha analysis and view remedies.</span>
            </div>
            <button id="closeRemedyToast" style="background:none; border:none; color:#d4a359; font-size:1.8rem; cursor:pointer; padding:0; line-height:1; outline:none;">&times;</button>
          \`;
          document.body.appendChild(remedyToast);
          
          document.getElementById('closeRemedyToast').addEventListener('click', () => {
            remedyToast.style.display = 'none';
          });
        }
        
        remedyToast.style.display = 'flex';
        
        if (window.remedyToastTimer) clearTimeout(window.remedyToastTimer);
        window.remedyToastTimer = setTimeout(() => {
          if (remedyToast) remedyToast.style.display = 'none';
        }, 30000);
      }
    });`;

if(oldToggleRegex.test(app)) {
  app = app.replace(oldToggleRegex, newToggle);
  fs.writeFileSync('app.js', app);
  console.log('Fixed toggle toast to custom HTML notification');
} else {
  console.log('Regex failed. Trying fallback.');
  // Let's print out the match if it failed
  const matches = app.match(/toggleRemedies\.addEventListener\('change'[\s\S]*?\}\);/);
  console.log(matches ? matches[0] : 'No match found at all');
}
