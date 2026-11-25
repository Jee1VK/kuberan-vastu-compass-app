/**
 * KUBERAN Vastu Compass — ota-updater.js (v5.9.0)
 * PWA-style self-hosted Over-The-Air (OTA) Live Update controller for Capacitor native APKs.
 * Fetches ota-manifest.json over HTTPS, verifies SHA-256 natively, stages in background,
 * and applies seamlessly on user tap or next cold start with automatic crash rollback.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KuberanOta = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MANIFEST_URL = 'https://jee1vk.github.io/kuberan-vastu-compass-app/ota-manifest.json';
  var BUNDLED_VERSION = '5.9.1';
  var AUTO_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes between background checks
  var LAST_CHECK_KEY = 'kuberan_ota_last_check_ts';

  var isChecking = false;
  var stagedVersion = null;

  /** Compare two semver strings (e.g. "5.9.1" vs "5.9.0"). Returns >0, 0, or <0. */
  function compareSemver(a, b) {
    var pa = String(a || '0.0.0').replace(/^v/i, '').split('.').map(function (n) { return parseInt(n, 10) || 0; });
    var pb = String(b || '0.0.0').replace(/^v/i, '').split('.').map(function (n) { return parseInt(n, 10) || 0; });
    for (var i = 0; i < 3; i++) {
      var da = pa[i] || 0;
      var db = pb[i] || 0;
      if (da !== db) return da - db;
    }
    return 0;
  }

  function getNativePlugin() {
    if (typeof window === 'undefined') return null;
    var cap = window.Capacitor;
    if (!cap || !cap.Plugins || !cap.Plugins.OtaUpdater) return null;
    if (typeof cap.isNativePlatform === 'function' && !cap.isNativePlatform()) return null;
    return cap.Plugins.OtaUpdater;
  }

  function safeGetTs() {
    try { return parseInt(localStorage.getItem(LAST_CHECK_KEY), 10) || 0; } catch (e) { return 0; }
  }

  function safeSetTs(ts) {
    try { localStorage.setItem(LAST_CHECK_KEY, String(ts)); } catch (e) {}
  }

  function setStatusUI(text, showReset) {
    var el = document.getElementById('otaStatusText');
    if (el) el.textContent = text;
    var resetBtn = document.getElementById('btnResetOtaBundle');
    if (resetBtn && typeof showReset === 'boolean') {
      resetBtn.classList.toggle('hidden', !showReset);
    }
  }

  function showUpdateBanner(version, notes) {
    var banner = document.getElementById('otaUpdateBanner');
    if (!banner) return;
    var titleEl = document.getElementById('otaBannerText');
    if (titleEl) {
      titleEl.textContent = '✨ Live Update v' + version + ' ready' + (notes ? ' — ' + notes : '');
    }
    banner.classList.remove('hidden');
  }

  function hideUpdateBanner() {
    var banner = document.getElementById('otaUpdateBanner');
    if (banner) banner.classList.add('hidden');
  }

  async function refreshStatusUI() {
    var plugin = getNativePlugin();
    if (!plugin) {
      setStatusUI('Web PWA Mode (v' + BUNDLED_VERSION + ' • Service Worker auto-updates)', false);
      return null;
    }
    try {
      var st = await plugin.getStatus();
      var label = st.isOtaActive
        ? 'Live OTA v' + st.currentVersion + ' (APK Base v' + st.nativeVersion + ')'
        : 'Built-in APK v' + st.currentVersion + ' (Up to date)';
      if (st.pendingVersion) {
        stagedVersion = st.pendingVersion;
        label += ' • v' + st.pendingVersion + ' staged';
        showUpdateBanner(st.pendingVersion, '');
      }
      setStatusUI(label, !!st.isOtaActive);
      return st;
    } catch (e) {
      setStatusUI('Built-in APK v' + BUNDLED_VERSION, false);
      return null;
    }
  }

  async function checkForUpdate(options) {
    options = options || {};
    var manual = !!options.manual;
    var plugin = getNativePlugin();

    if (!plugin) {
      // On web PWA, trigger standard Service Worker update check if manual
      if (manual && 'serviceWorker' in navigator) {
        try {
          var reg = await navigator.serviceWorker.getRegistration();
          if (reg) await reg.update();
        } catch (e) {}
      }
      return { status: 'web-pwa', version: BUNDLED_VERSION };
    }

    if (isChecking) return { status: 'busy' };

    var now = Date.now();
    if (!manual && (now - safeGetTs()) < AUTO_CHECK_INTERVAL_MS) {
      return { status: 'throttled' };
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      if (manual) setStatusUI('Offline — connect to internet to check live updates');
      return { status: 'offline' };
    }

    isChecking = true;
    if (manual) setStatusUI('Checking for live updates...');

    try {
      var st = await plugin.getStatus();
      var currentVersion = st.currentVersion || BUNDLED_VERSION;
      var nativeVersion = st.nativeVersion || BUNDLED_VERSION;

      var resp = await fetch(MANIFEST_URL + '?t=' + now, { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var manifest = await resp.json();
      safeSetTs(now);

      if (!manifest || !manifest.version || !manifest.bundleUrl || !manifest.sha256) {
        throw new Error('Malformed OTA manifest');
      }

      // Check minimum native shell compatibility
      if (manifest.minNativeVersion && compareSemver(nativeVersion, manifest.minNativeVersion) < 0) {
        if (manual) setStatusUI('v' + manifest.version + ' requires a newer APK install (current base v' + nativeVersion + ')');
        return { status: 'native-update-required', version: manifest.version };
      }

      // Already on latest or newer
      if (compareSemver(manifest.version, currentVersion) <= 0) {
        await refreshStatusUI();
        return { status: 'up-to-date', version: currentVersion };
      }

      // Already staged this exact version
      if (st.pendingVersion === manifest.version) {
        stagedVersion = manifest.version;
        showUpdateBanner(manifest.version, manifest.notes || '');
        if (manual) setStatusUI('Update v' + manifest.version + ' downloaded — tap Update Now');
        return { status: 'ready', version: manifest.version };
      }

      // Download & verify SHA-256 silently in background
      if (manual) setStatusUI('Downloading live update v' + manifest.version + '...');
      await plugin.downloadAndStage({
        url: manifest.bundleUrl,
        version: manifest.version,
        sha256: manifest.sha256
      });

      stagedVersion = manifest.version;
      showUpdateBanner(manifest.version, manifest.notes || '');
      setStatusUI('Update v' + manifest.version + ' ready — tap Update Now', !!st.isOtaActive);
      return { status: 'staged', version: manifest.version };
    } catch (err) {
      if (manual) setStatusUI('Update check failed (' + (err && err.message ? err.message : 'network error') + ')');
      return { status: 'error', error: err && err.message };
    } finally {
      isChecking = false;
    }
  }

  async function applyStagedUpdate(reloadNow) {
    var plugin = getNativePlugin();
    if (!plugin) return false;
    try {
      if (reloadNow !== false && typeof window !== 'undefined') {
        if ('serviceWorker' in navigator) {
          try {
            var regs = await navigator.serviceWorker.getRegistrations();
            for (var i = 0; i < regs.length; i++) await regs[i].unregister();
          } catch (e) {}
        }
        if ('caches' in window) {
          try {
            var keys = await caches.keys();
            for (var j = 0; j < keys.length; j++) await caches.delete(keys[j]);
          } catch (e) {}
        }
      }
      await plugin.applyUpdate({ reloadNow: reloadNow !== false });
      hideUpdateBanner();
      if (reloadNow === false) {
        setStatusUI('v' + (stagedVersion || '') + ' queued — will apply on next launch');
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async function resetToBuiltIn() {
    var plugin = getNativePlugin();
    if (!plugin) return false;
    try {
      await plugin.resetToBuiltIn();
      stagedVersion = null;
      hideUpdateBanner();
      return true;
    } catch (e) {
      return false;
    }
  }

  function initOta() {
    var plugin = getNativePlugin();

    // Wire banner buttons
    var btnApplyNow = document.getElementById('btnOtaApplyNow');
    var btnApplyLater = document.getElementById('btnOtaApplyLater');
    if (btnApplyNow) {
      btnApplyNow.addEventListener('click', function () { applyStagedUpdate(true); });
    }
    if (btnApplyLater) {
      btnApplyLater.addEventListener('click', function () { applyStagedUpdate(false); });
    }

    // Wire Settings modal controls
    var btnCheck = document.getElementById('btnCheckOtaUpdate');
    if (btnCheck) {
      btnCheck.addEventListener('click', function () { checkForUpdate({ manual: true }); });
    }
    var btnReset = document.getElementById('btnResetOtaBundle');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (window.confirm('Reset to the original built-in APK version and clear downloaded OTA updates?')) {
          resetToBuiltIn();
        }
      });
    }

    // Confirm boot health immediately so native rollback watchdog commits this bundle
    if (plugin) {
      Promise.resolve(plugin.notifyAppReady()).catch(function () {});
    }

    refreshStatusUI();

    if (!plugin) return;

    // Silent background update check 3s after boot (never slows cold start)
    setTimeout(function () { checkForUpdate({ manual: false }); }, 3000);

    // Re-check when returning from background (throttled to 30 min)
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) checkForUpdate({ manual: false });
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initOta);
    } else {
      initOta();
    }
  }

  return {
    MANIFEST_URL: MANIFEST_URL,
    BUNDLED_VERSION: BUNDLED_VERSION,
    compareSemver: compareSemver,
    checkForUpdate: checkForUpdate,
    applyStagedUpdate: applyStagedUpdate,
    resetToBuiltIn: resetToBuiltIn,
    refreshStatusUI: refreshStatusUI
  };
});
