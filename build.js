const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Resolve javascript-obfuscator from local node_modules or global npm prefix
function loadObfuscator() {
  try {
    return require('javascript-obfuscator');
  } catch (_) {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return require(path.join(globalRoot, 'javascript-obfuscator'));
  }
}

const JavaScriptObfuscator = loadObfuscator();
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const obfConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'obfuscator.config.json'), 'utf8'));
const appVersion = pkg.version || '5.9.0';
const OTA_BASE_URL = 'https://jee1vk.github.io/kuberan-vastu-compass-app';

// Proprietary JS files to obfuscate into dist/ (source files remain clean in root)
const OBFUSCATE_PROFILES = {
  'app.js': obfConfig.engine,
  'sensor-core.js': obfConfig.engine,
  'ota-updater.js': obfConfig.engine,
  'vastu-data.js': obfConfig.data
};

console.log(`==> Building KUBERAN Vastu Compass Production Dist (v${appVersion}, Obfuscated)...`);

// Clean or create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Strictly runtime web assets (never root fix_*.js / update_*.js / store-assets)
const filesToCopy = [
  'index.html',
  'privacy.html',
  'terms.html',
  '404.html',
  'style.css',
  'vastu-data.js',
  'geomagnetism.min.js',
  'sensor-core.js',
  'app.js',
  'ota-updater.js',
  'qrcode.min.js',
  'sw.js',
  'manifest.webmanifest',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
];

filesToCopy.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    if (OBFUSCATE_PROFILES[file]) {
      const sourceCode = fs.readFileSync(src, 'utf8');
      const result = JavaScriptObfuscator.obfuscate(sourceCode, OBFUSCATE_PROFILES[file]);
      const obfCode = result.getObfuscatedCode();
      fs.writeFileSync(dest, obfCode, 'utf8');
      console.log(`Obfuscated: ${file} (${(sourceCode.length / 1024).toFixed(1)} KB -> ${(obfCode.length / 1024).toFixed(1)} KB)`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${file}`);
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
});

// Copy assets/images runtime directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(rootDir, 'assets', 'images'), path.join(distDir, 'assets', 'images'));
console.log('Copied assets/images/ runtime directory.');

// ─── Pure-Node Cross-Platform ZIP Builder (POSIX '/' paths for Android ZipInputStream) ───
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function walkFiles(dir, baseDir = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, baseDir));
    else out.push({ full, rel: path.relative(baseDir, full).split(path.sep).join('/') });
  }
  return out;
}

function buildZipBuffer(sourceDir) {
  const files = walkFiles(sourceDir).sort((a, b) => a.rel.localeCompare(b.rel));
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const f of files) {
    const nameBuf = Buffer.from(f.rel, 'utf8');
    const rawBuf = fs.readFileSync(f.full);
    const compBuf = zlib.deflateRawSync(rawBuf, { level: 9 });
    const useDeflate = compBuf.length < rawBuf.length;
    const dataBuf = useDeflate ? compBuf : rawBuf;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(rawBuf);

    // Local File Header (30 bytes + name)
    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);
    lfh.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(0, 10);
    lfh.writeUInt16LE(0x5421, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(dataBuf.length, 18);
    lfh.writeUInt32LE(rawBuf.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);

    localParts.push(lfh, nameBuf, dataBuf);

    // Central Directory Header (46 bytes + name)
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0x0800, 8);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(0, 12);
    cdh.writeUInt16LE(0x5421, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(dataBuf.length, 20);
    cdh.writeUInt32LE(rawBuf.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);
    cdh.writeUInt16LE(0, 32);
    cdh.writeUInt16LE(0, 34);
    cdh.writeUInt16LE(0, 36);
    cdh.writeUInt32LE(0, 38);
    cdh.writeUInt32LE(offset, 42);

    centralParts.push(cdh, nameBuf);
    offset += lfh.length + nameBuf.length + dataBuf.length;
  }

  const centralBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuf, eocd]);
}

// Generate self-hosted OTA bundle & manifest in project root (published via GitHub Pages)
const zipBuf = buildZipBuffer(distDir);
const otaZipPath = path.join(rootDir, 'ota-bundle.zip');
fs.writeFileSync(otaZipPath, zipBuf);
const sha256 = crypto.createHash('sha256').update(zipBuf).digest('hex');

const manifest = {
  version: appVersion,
  minNativeVersion: '5.9.0',
  buildTime: new Date().toISOString(),
  bundleUrl: `${OTA_BASE_URL}/ota-bundle.zip`,
  sha256,
  sizeBytes: zipBuf.length,
  notes: 'PWA-style Over-The-Air live updates, offline WMM-2025 geomagnetism, circular trigonometric sensor fusion.'
};
const otaManifestPath = path.join(rootDir, 'ota-manifest.json');
fs.writeFileSync(otaManifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`Generated OTA bundle: ota-bundle.zip (${(zipBuf.length / 1024).toFixed(1)} KB, SHA-256: ${sha256.slice(0, 16)}...)`);
console.log(`Generated OTA manifest: ota-manifest.json (v${appVersion})`);
console.log('==> Dist & OTA build completed successfully!');
