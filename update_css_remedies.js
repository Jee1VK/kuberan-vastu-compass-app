const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const newCSS = `
/* --- VASTU REMEDIES CSS --- */
.setting-text {
  display: flex;
  flex-direction: column;
}

.setting-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.setting-desc {
  font-size: 0.78rem;
  opacity: 0.7;
  margin-top: 2px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #4a4a4a;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: #ffffff;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #d97706;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.remedy-card {
  margin-top: 15px;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(217, 119, 6, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.4);
  transition: all 0.3s ease;
  text-align: left;
}

.remedy-card.hidden {
  display: none !important;
}

.remedy-card h4 {
  margin: 0 0 10px 0;
  color: #f59e0b;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remedy-section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fbbf24;
  margin-top: 10px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.remedy-list {
  margin: 0 0 8px 0;
  padding-left: 20px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #e5e7eb;
}

.remedy-list li {
  margin-bottom: 4px;
}

.vastu-defect h3 {
  color: #ef4444;
  margin-bottom: 5px;
}
.vastu-success h3 {
  color: #22c55e;
  margin-bottom: 5px;
}

#vastu-analysis-container {
  margin: 15px 0;
}
`;

fs.writeFileSync('style.css', css + newCSS);
console.log('CSS updated');
