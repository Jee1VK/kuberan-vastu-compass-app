'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Ota = require('../ota-updater.js');

const rootDir = path.resolve(__dirname, '..');

test('compareSemver compares major, minor, patch, and v-prefixed strings accurately', () => {
  assert.equal(Ota.compareSemver('5.9.0', '5.9.0'), 0);
  assert.equal(Ota.compareSemver('v5.9.0', '5.9.0'), 0);
  assert.ok(Ota.compareSemver('5.9.1', '5.9.0') > 0);
  assert.ok(Ota.compareSemver('5.10.0', '5.9.9') > 0);
  assert.ok(Ota.compareSemver('6.0.0', '5.99.99') > 0);
  assert.ok(Ota.compareSemver('5.8.9', '5.9.0') < 0);
});

test('ota-manifest.json and ota-bundle.zip match SHA-256 and contain valid runtime entries', () => {
  const manifestPath = path.join(rootDir, 'ota-manifest.json');
  const zipPath = path.join(rootDir, 'ota-bundle.zip');
  assert.ok(fs.existsSync(manifestPath), 'ota-manifest.json must exist');
  assert.ok(fs.existsSync(zipPath), 'ota-bundle.zip must exist');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const zipBuf = fs.readFileSync(zipPath);
  const actualSha = crypto.createHash('sha256').update(zipBuf).digest('hex');

  assert.equal(manifest.sha256, actualSha, 'SHA-256 in manifest must match ota-bundle.zip');
  assert.equal(manifest.sizeBytes, zipBuf.length, 'sizeBytes must match zip file length');
  assert.ok(manifest.bundleUrl.startsWith('https://jee1vk.github.io/'), 'bundleUrl must use HTTPS GitHub Pages');

  // Verify ZIP local file header magic (PK\x03\x04) and required entry names
  assert.equal(zipBuf.readUInt32LE(0), 0x04034b50, 'Valid ZIP header');
  const zipAscii = zipBuf.toString('latin1');
  for (const req of ['index.html', 'app.js', 'vastu-data.js', 'sensor-core.js', 'geomagnetism.min.js', 'ota-updater.js', 'assets/images/kuberan_logo_white_bg.png']) {
    assert.ok(zipAscii.includes(req), `ota-bundle.zip must include ${req}`);
  }
  assert.ok(!zipAscii.includes('assets\\images'), 'ZIP paths must use POSIX forward slashes');
});
