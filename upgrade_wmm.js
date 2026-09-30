const fs = require('fs');

let app = fs.readFileSync('app.js', 'utf8');

const oldDeclination = `function estimateMagneticDeclination(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude)) return 0;
    // World Magnetic Model approximation for Indian subcontinent & global fallback
    if (latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98) {
      // In India, magnetic declination ranges between -2.0 to +1.5
      const latFraction = (latitude - 8) / 30;
      const lngFraction = (longitude - 77) / 20;
      return parseFloat((-0.5 + latFraction * 0.8 - lngFraction * 1.2).toFixed(1));
    }
    return 0.0;
  }`;

const newDeclination = `function estimateMagneticDeclination(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude)) return 0;
    
    // 1. High-Precision World Magnetic Model (WMM)
    if (typeof geomagnetism !== 'undefined') {
      try {
        const info = geomagnetism.model().point([latitude, longitude]);
        if (info && typeof info.decl !== 'undefined') {
          return parseFloat(info.decl.toFixed(2));
        }
      } catch (err) {
        console.error('WMM calculation failed, using fallback', err);
      }
    }

    // 2. Fallback: Crude linear approximation for Indian subcontinent
    if (latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98) {
      const latFraction = (latitude - 8) / 30;
      const lngFraction = (longitude - 77) / 20;
      return parseFloat((-0.5 + latFraction * 0.8 - lngFraction * 1.2).toFixed(1));
    }
    return 0.0;
  }`;

// Use regex to account for potential degree symbol () encoding issues
app = app.replace(/function estimateMagneticDeclination\(latitude, longitude\) \{[\s\S]*?return 0\.0;\s*\}/, newDeclination);

fs.writeFileSync('app.js', app);
console.log('Declination upgraded to WMM');
