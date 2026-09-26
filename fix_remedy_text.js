const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const oldRender = `    if (data.isCompliant) {
      container.innerHTML = \`
        <div class="vastu-success" style="padding:10px; text-align:left;">
          <h3 style="font-size:1.1rem;">✅ \${data.direction} - \${data.room}</h3>
          <p style="font-size:0.9rem; opacity:0.9; margin:0;">This placement is fully compliant with Vastu Shastra rules.</p>
        </div>
      \`;
      return;
    }`;

const newRender = `    if (data.isCompliant) {
      if (data.room === 'General Layout') {
        container.innerHTML = \`
          <div class="vastu-success" style="padding:10px; text-align:left;">
            <h3 style="font-size:1.1rem;">ℹ️ Select a Room</h3>
            <p style="font-size:0.9rem; opacity:0.9; margin:0;">Please use the <strong>Zone Finder</strong> (grid icon) to select a room (e.g. Kitchen, Master Bedroom). Then open this report to generate an AI Vastu Dosha analysis and view remedies.</p>
          </div>
        \`;
      } else {
        container.innerHTML = \`
          <div class="vastu-success" style="padding:10px; text-align:left;">
            <h3 style="font-size:1.1rem;">✅ \${data.direction} - \${data.room}</h3>
            <p style="font-size:0.9rem; opacity:0.9; margin:0;">Excellent! This placement is fully compliant with Vastu Shastra rules. No remedies required.</p>
          </div>
        \`;
      }
      return;
    }`;

if(app.includes('if (data.isCompliant) {')) {
  app = app.replace(oldRender, newRender);
  fs.writeFileSync('app.js', app);
  console.log('Fixed render state');
} else {
  console.log('Could not find render state');
}
