const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('>📐</button>', '>🧮</button>');
html = html.replace('>🎛️</button>', '>🏠</button>');
html = html.replace('>🔒</button>', '>📐</button>');
html = html.replace('>📄</button>', '>📋</button>');

html = html.replace(/title="Plot Tilt Lock"/g, 'title="Plot Tilt"');
html = html.replace(/title="Zone Finder"/g, 'title="Room Finder"');
html = html.replace(/aria-label="Plot Tilt Lock"/g, 'aria-label="Plot Tilt"');
html = html.replace(/aria-label="Zone Finder"/g, 'aria-label="Room Finder"');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Icons fixed!');
