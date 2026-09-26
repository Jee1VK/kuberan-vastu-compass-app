const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const oldRoomLogic = `const currentRoomObj = activeRoom ? (VASTU_DATA.ROOMS.find(r => r.id === activeRoom) || VASTU_DATA.COMMERCIAL_ROOMS.find(r => r.id === activeRoom)) : null;`;
const newRoomLogic = `const currentRoomObj = activeRoom;`;

if(app.includes(oldRoomLogic)) {
  app = app.replace(oldRoomLogic, newRoomLogic);
  fs.writeFileSync('app.js', app);
  console.log('Fixed currentRoomObj reference!');
} else {
  console.log('Could not find oldRoomLogic');
}
