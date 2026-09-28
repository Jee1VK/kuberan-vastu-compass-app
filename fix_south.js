const fs = require('fs');
let data = fs.readFileSync('vastu-data.js', 'utf8');

const regex = /(id:\s*'S',[\s\S]*?deity:\s*'Yama Dharmaraja[^']*',\s*element:\s*)'earth'(,)/;

if (regex.test(data)) {
  data = data.replace(regex, "$1'fire'$2");
  fs.writeFileSync('vastu-data.js', data);
  console.log('Fixed South element in ZONES_8 to fire');
} else {
  console.log('Regex failed');
}
