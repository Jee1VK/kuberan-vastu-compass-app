const fs = require('fs');

// --- 1. Modify style.css ---
let css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('.icon-btn.active')) {
  css += `\n.icon-btn.active {\n  border-color: var(--kuberan-gold);\n  color: var(--kuberan-gold);\n  box-shadow: 0 0 10px rgba(212, 163, 89, 0.3);\n}\n`;
  fs.writeFileSync('style.css', css);
}

// --- 2. Modify index.html ---
let html = fs.readFileSync('index.html', 'utf8');

// A. Move buttons to header
const headerRegex = /<div class="header-actions">\s*<button id="btnSettings"/;
const newHeader = `<div class="header-actions">
        <button id="btnToolRoomFinder" class="icon-btn" title="Zone Finder">🎛️</button>
        <button id="btnToolPlotTilt" class="icon-btn" title="Plot Tilt Lock">🔒</button>
        <button id="btnToolAudit" class="icon-btn" title="Vastu Report">📄</button>
        <button id="btnSettings"`;
html = html.replace(headerRegex, newHeader);

// B. Remove tools-bar entirely
const toolsBarRegex = /<section class="tools-bar" id="vastuToolsBar">[\s\S]*?<\/section>/;
html = html.replace(toolsBarRegex, '');

// C. Insert Camera AR toggle into Settings Modal
// Find the Vastu Remedies toggle and insert this right before it
const remediesRegex = /<!-- Vastu Remedies Settings Toggle -->/;
const cameraHtml = `<!-- Camera AR Settings Toggle -->
        <div class="setting-item">
          <div>
            <label>Camera AR Mode</label>
            <span class="setting-desc" style="font-size:0.75rem;opacity:0.7;display:block;">See compass overlay on live camera</span>
          </div>
          <label class="switch">
            <input type="checkbox" id="toggle-camera-ar">
            <span class="slider round"></span>
          </label>
        </div>
        
        <!-- Vastu Remedies Settings Toggle -->`;
html = html.replace(remediesRegex, cameraHtml);

fs.writeFileSync('index.html', html);


// --- 3. Modify app.js ---
let app = fs.readFileSync('app.js', 'utf8');

// A. Remove btnToolCamera references at top
app = app.replace(/const btnToolCamera = document\.getElementById\('btnToolCamera'\);\s*/, '');

// B. Modify toggleCameraAR function
const oldToggleCameraAR = `  async function toggleCameraAR() {
    if (cameraStream) {
      // Turn OFF
      const tracks = cameraStream.getTracks();
      tracks.forEach(track => track.stop());
      cameraStream = null;
      cameraFeed.classList.add('hidden');
      cameraScrim.classList.add('hidden');
      compassViewport.classList.remove('camera-active');
      btnToolCamera.classList.remove('active');
      showToast('Camera AR disabled');
    } else {
      // Turn ON
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        cameraStream = stream;
        cameraFeed.srcObject = stream;
        cameraFeed.classList.remove('hidden');
        cameraScrim.classList.remove('hidden');
        compassViewport.classList.add('camera-active');
        btnToolCamera.classList.add('active');
        showToast('Camera AR active: Align phone with room walls');
      } catch (err) {
        showToast('Camera access permission denied or unavailable');
      }
    }
  }`;

const newToggleCameraAR = `  async function toggleCameraAR() {
    const toggleCam = document.getElementById('toggle-camera-ar');
    if (cameraStream) {
      // Turn OFF
      const tracks = cameraStream.getTracks();
      tracks.forEach(track => track.stop());
      cameraStream = null;
      cameraFeed.classList.add('hidden');
      cameraScrim.classList.add('hidden');
      compassViewport.classList.remove('camera-active');
      if (toggleCam) toggleCam.checked = false;
      showToast('Camera AR disabled');
    } else {
      // Turn ON
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        cameraStream = stream;
        cameraFeed.srcObject = stream;
        cameraFeed.classList.remove('hidden');
        cameraScrim.classList.remove('hidden');
        compassViewport.classList.add('camera-active');
        if (toggleCam) toggleCam.checked = true;
        showToast('Camera AR active: Align phone with room walls');
      } catch (err) {
        if (toggleCam) toggleCam.checked = false;
        showToast('Camera access permission denied or unavailable');
      }
    }
  }`;

app = app.replace(oldToggleCameraAR, newToggleCameraAR);

// C. Wire up the settings toggle event listener
// D. Remove the old btnToolCamera event listener
app = app.replace(/if \(btnToolCamera\) btnToolCamera\.addEventListener\('click', toggleCameraAR\);/, `
    const toggleCamera = document.getElementById('toggle-camera-ar');
    if (toggleCamera) {
      toggleCamera.addEventListener('change', (e) => {
         if (e.target.checked && !cameraStream) toggleCameraAR();
         else if (!e.target.checked && cameraStream) toggleCameraAR();
      });
    }
`);

fs.writeFileSync('app.js', app);
console.log('UI restructure completed!');
