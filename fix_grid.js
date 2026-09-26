const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/typeof populateRoomList === 'function'/g, 'typeof renderRoomsGrid === "function"');
app = app.replace(/populateRoomList\(\)/g, 'renderRoomsGrid()');

fs.writeFileSync('app.js', app);
console.log('Fixed renderRoomsGrid');
