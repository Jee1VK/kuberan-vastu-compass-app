const fs = require('fs');
let data = fs.readFileSync('vastu-data.js', 'utf8');

const padasMatch = data.match(/PADAS_32: \[\s*([\s\S]*?)\s*\]/);
if (!padasMatch) throw new Error('Could not find PADAS_32');

let padasText = padasMatch[1];
const lines = padasText.split('\n');
const newLines = lines.map(line => {
  if (!line.trim().startsWith('{')) return line;
  
  // parse startDeg and endDeg
  const startMatch = line.match(/startDeg: ([\d\.]+)/);
  const endMatch = line.match(/endDeg: ([\d\.]+)/);
  if (!startMatch || !endMatch) return line;
  
  let startDeg = parseFloat(startMatch[1]);
  let endDeg = parseFloat(endMatch[1]);
  
  startDeg = startDeg - 22.5;
  endDeg = endDeg - 22.5;
  
  if (startDeg < 0) startDeg += 360;
  if (endDeg <= 0) endDeg += 360;
  
  return line.replace(/startDeg: [\d\.]+/, `startDeg: ${startDeg}`).replace(/endDeg: [\d\.]+/, `endDeg: ${endDeg}`);
});

const newPadas = `PADAS_32: [\n${newLines.join('\n')}\n  ]`;
data = data.replace(/PADAS_32: \[\s*([\s\S]*?)\s*\]/, newPadas);
fs.writeFileSync('vastu-data.js', data);
console.log('PADAS_32 shifted by -22.5 degrees');
