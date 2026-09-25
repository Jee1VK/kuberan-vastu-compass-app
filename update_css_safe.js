const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const newCSS = `

/* --- V4.6.4 SETTINGS MODAL & TOOLS BAR --- */

/* Compact Single-Line Tools Container */
.tools-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 6px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  background: rgba(8, 17, 30, 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(212, 163, 89, 0.2);
}

.tool-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  font-size: 11px;
  white-space: nowrap;
  border: 1px solid rgba(212, 163, 89, 0.25);
  border-radius: 8px;
  background: rgba(14, 28, 49, 0.65);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-btn:hover, .tool-btn.active {
  background: rgba(212, 163, 89, 0.18);
  border-color: rgba(212, 163, 89, 0.5);
}

.tool-icon {
  font-size: 16px;
  margin-bottom: 2px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.setting-select {
  background: rgba(0,0,0,0.3);
  color: var(--text-main);
  border: 1px solid rgba(212, 163, 89, 0.4);
  padding: 4px 8px;
  border-radius: 4px;
}

.toggle-group {
  display: flex;
  background: rgba(0,0,0,0.3);
  border-radius: 6px;
  padding: 2px;
  border: 1px solid rgba(212, 163, 89, 0.2);
}

.toggle-group input[type="radio"] {
  display: none;
}

.toggle-group label {
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  color: var(--text-dim);
  border-radius: 4px;
}

.toggle-group input[type="radio"]:checked + label {
  background: rgba(212, 163, 89, 0.3);
  color: var(--text-main);
}
`;

fs.writeFileSync('style.css', css + newCSS);
console.log('CSS updated safely!');
