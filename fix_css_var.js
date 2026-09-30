const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Add --kuberan-gold right after the first :root { line
css = css.replace(
  ':root {\n  --font-sans:',
  ':root {\n  --kuberan-gold: #d4a359;\n  --font-sans:'
);

// Also add .modal-header if still missing
if (!css.includes('.modal-header')) {
  css += `
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
`;
}

fs.writeFileSync('style.css', css);
console.log('Added --kuberan-gold to :root');
