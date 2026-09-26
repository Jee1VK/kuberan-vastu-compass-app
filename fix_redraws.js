const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Fix Compass Mode redraw
app = app.replace(
  'updateVastuInspector(currentHeading);\n    }\n  }));\n\n  // Property',
  'updateVastuInspector(currentHeading);\n      buildDialSvg();\n    }\n  }));\n\n  // Property'
);

// Fix Property Type redraw
app = app.replace(
  'updateVastuInspector(currentHeading);\n    });\n  }\n\n  // Zonal',
  'updateVastuInspector(currentHeading);\n      buildDialSvg();\n    });\n  }\n\n  // Zonal'
);

// Fix Zonal Division redraw
app = app.replace(
  'updateVastuInspector(currentHeading);\n    }\n  }));\n\n  // Run on DOM load',
  'updateVastuInspector(currentHeading);\n      buildDialSvg();\n    }\n  }));\n\n  // Run on DOM load'
);

fs.writeFileSync('app.js', app);
console.log('Fixed buildDialSvg triggers!');
