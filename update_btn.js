const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const oldBtn = `.primary-btn {
  background: var(--kuberan-gold);
  color: #1a1a2e;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.primary-btn:hover { opacity: 0.85; }`;

const newBtn = `.primary-btn {
  background: linear-gradient(135deg, #ffd700 0%, #d4a359 100%);
  color: #0a0a0a !important;
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1.05rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(212, 163, 89, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}
.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 163, 89, 0.6);
}
.primary-btn:active {
  transform: translateY(1px);
}`;

css = css.replace(oldBtn, newBtn);

fs.writeFileSync('style.css', css);
console.log('Updated primary button contrast');
