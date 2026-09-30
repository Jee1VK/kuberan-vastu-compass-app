const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const oldGridEnd = `      // Outer rim box
      svgContent += \`<rect x="\${startX}" y="\${startY}" width="\${gridSize}" height="\${gridSize}" fill="none" stroke="var(--kuberan-gold)" stroke-width="2" stroke-opacity="0.6"/>\`;
    }`;

const newGridEnd = `      // Maha Marmas (Critical Energy Diagonals: NE-SW Spine & NW-SE)
      // NW to SE diagonal
      svgContent += \`<line x1="\${startX}" y1="\${startY}" x2="\${startX + gridSize}" y2="\${startY + gridSize}" stroke="#ef4444" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="6,4"/>\`;
      // NE to SW diagonal (The Primary Spine)
      svgContent += \`<line x1="\${startX + gridSize}" y1="\${startY}" x2="\${startX}" y2="\${startY + gridSize}" stroke="#ef4444" stroke-opacity="0.5" stroke-width="2.5" stroke-dasharray="6,4"/>\`;
      
      // Outer rim box
      svgContent += \`<rect x="\${startX}" y="\${startY}" width="\${gridSize}" height="\${gridSize}" fill="none" stroke="var(--kuberan-gold)" stroke-width="2" stroke-opacity="0.6"/>\`;
    }`;

app = app.replace(oldGridEnd, newGridEnd);
fs.writeFileSync('app.js', app);
console.log('Added Marma Sthanas to Grid');
