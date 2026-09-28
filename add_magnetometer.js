const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const magInjection = `
  // --- Magnetic Interference Detection ---
  let magnetometer = null;
  let interferenceWarningActive = false;

  function initMagnetometer() {
    if ('Magnetometer' in window) {
      try {
        // Frequency 2 Hz is sufficient and saves battery
        magnetometer = new Magnetometer({ frequency: 2 });
        magnetometer.addEventListener('reading', () => {
          // Calculate vector magnitude in microteslas (µT): sqrt(x^2 + y^2 + z^2)
          const fieldStrength = Math.sqrt(
            Math.pow(magnetometer.x, 2) +
            Math.pow(magnetometer.y, 2) +
            Math.pow(magnetometer.z, 2)
          );

          // Earth's magnetic field is typically between 25 and 65 µT.
          // Thresholds set at > 85 µT to prevent false positives from slight anomalies
          if (fieldStrength > 85 || fieldStrength < 15) {
            if (!interferenceWarningActive) {
              interferenceWarningActive = true;
              showToast('⚠️ HIGH MAGNETIC INTERFERENCE: Step away from metal/electronics for accurate Vastu reading');
              sensorStatus.textContent = '⚠️ High Interference Detected (' + Math.round(fieldStrength) + ' µT)';
              sensorStatus.style.color = '#fca5a5';
              document.querySelector('.compass-container').style.boxShadow = '0 0 20px rgba(252, 165, 165, 0.4)';
            }
          } else {
            if (interferenceWarningActive) {
              interferenceWarningActive = false;
              sensorStatus.textContent = 'North tracking active';
              sensorStatus.style.color = 'var(--text-main)';
              document.querySelector('.compass-container').style.boxShadow = 'none';
            }
          }
        });
        magnetometer.start();
      } catch (err) {
        console.log('Magnetometer API not available/permitted for interference detection');
      }
    }
  }
`;

// Insert the code just before initSensors
app = app.replace('  // --- Sensor Initialization ---', magInjection + '\n  // --- Sensor Initialization ---');

// Call it inside initSensors
const initSensorsRegex = /function initSensors\(\) \{[\s\S]*?let isAlreadyEnabled = false;/;
app = app.replace(initSensorsRegex, "function initSensors() {\n    initMagnetometer();\n    const isIOS = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';\n    let isAlreadyEnabled = false;");

fs.writeFileSync('app.js', app);
console.log('Injected Magnetic Interference Detection');
