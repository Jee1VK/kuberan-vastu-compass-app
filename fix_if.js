const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/if \(roomObj && roomObj\.name\)/g, 'if (roomObj)');
fs.writeFileSync('app.js', app);
console.log('Fixed generateLocalVastuAnalysis if statement');
