package com.kuberansilks.vastucompass;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.plugin.WebView;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Self-hosted, zero-telemetry PWA-style Over-The-Air (OTA) Live Update plugin for Capacitor 8.
 * Downloads SHA-256 verified web bundles over HTTPS, extracts with Zip-Slip protection,
 * serves locally via Capacitor's Bridge.setServerBasePath(), and automatically rolls back
 * if a newly applied bundle fails to call notifyAppReady() within 12 seconds.
 */
@CapacitorPlugin(name = "OtaUpdater")
public class OtaUpdaterPlugin extends Plugin {

    private static final String TAG = "KuberanOtaUpdater";
    private static final String OTA_PREFS = "KuberanOtaPrefs";
    private static final String KEY_ACTIVE_VERSION = "activeVersion";
    private static final String KEY_ACTIVE_PATH = "activePath";
    private static final String KEY_PREVIOUS_VERSION = "previousVersion";
    private static final String KEY_PREVIOUS_PATH = "previousPath";
    private static final String KEY_PENDING_VERSION = "pendingVersion";
    private static final String KEY_PENDING_PATH = "pendingPath";
    private static final String KEY_PENDING_VERIFY = "pendingVerify";
    private static final String KEY_BOOT_FAIL_COUNT = "bootFailCount";
    private static final String KEY_LAST_NATIVE_CODE = "lastNativeVersionCode";

    private static final long MAX_DOWNLOAD_BYTES = 25L * 1024L * 1024L;
    private static final long MAX_UNZIPPED_BYTES = 35L * 1024L * 1024L;
    private static final int MAX_ZIP_ENTRIES = 250;
    private static final long ROLLBACK_WATCHDOG_MS = 12000L;

    private static final Set<String> ALLOWED_HOSTS = new HashSet<>(
        Arrays.asList("jee1vk.github.io", "kuberansilks.com", "www.kuberansilks.com")
    );

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private Runnable rollbackWatchdog = null;

    @Override
    public void load() {
        super.load();
        Context ctx = getContext();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);

        long currentNativeCode = getNativeVersionCode(ctx);
        long lastNativeCode = otaPrefs.getLong(KEY_LAST_NATIVE_CODE, -1L);

        // If a newer native APK/AAB was installed, clear stale OTA metadata & directories
        if (lastNativeCode != -1L && currentNativeCode > lastNativeCode) {
            Log.i(TAG, "Newer native binary detected (" + lastNativeCode + " -> " + currentNativeCode + "). Resetting OTA cache.");
            clearAllOtaState(ctx, false);
        }
        otaPrefs.edit().putLong(KEY_LAST_NATIVE_CODE, currentNativeCode).apply();

        // Arm automatic crash-rollback watchdog if a newly applied OTA bundle has not yet verified
        boolean pendingVerify = otaPrefs.getBoolean(KEY_PENDING_VERIFY, false);
        if (pendingVerify) {
            int failCount = otaPrefs.getInt(KEY_BOOT_FAIL_COUNT, 0) + 1;
            otaPrefs.edit().putInt(KEY_BOOT_FAIL_COUNT, failCount).apply();

            if (failCount >= 2) {
                Log.w(TAG, "New OTA bundle failed to boot on previous launch. Rolling back immediately.");
                performRollback();
                return;
            }

            rollbackWatchdog = () -> {
                SharedPreferences p = getContext().getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
                if (p.getBoolean(KEY_PENDING_VERIFY, false)) {
                    Log.w(TAG, "OTA boot verification timed out after " + ROLLBACK_WATCHDOG_MS + "ms. Rolling back.");
                    performRollback();
                }
            };
            mainHandler.postDelayed(rollbackWatchdog, ROLLBACK_WATCHDOG_MS);
        }
    }

    @Override
    protected void handleOnDestroy() {
        cancelWatchdog();
        executor.shutdownNow();
        super.handleOnDestroy();
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        Context ctx = getContext();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
        SharedPreferences capPrefs = ctx.getSharedPreferences(WebView.WEBVIEW_PREFS_NAME, Activity.MODE_PRIVATE);

        String nativeVersion = getNativeVersionName(ctx);
        long nativeCode = getNativeVersionCode(ctx);
        String activeVersion = otaPrefs.getString(KEY_ACTIVE_VERSION, "");
        String activePath = capPrefs.getString(WebView.CAP_SERVER_PATH, "");
        String pendingVersion = otaPrefs.getString(KEY_PENDING_VERSION, "");
        boolean isOtaActive = activePath != null && !activePath.isEmpty() && new File(activePath).exists();

        JSObject ret = new JSObject();
        ret.put("nativeVersion", nativeVersion);
        ret.put("nativeVersionCode", nativeCode);
        ret.put("currentVersion", (isOtaActive && !activeVersion.isEmpty()) ? activeVersion : nativeVersion);
        ret.put("isOtaActive", isOtaActive);
        ret.put("activePath", isOtaActive ? activePath : "");
        ret.put("pendingVersion", pendingVersion);
        call.resolve(ret);
    }

    @PluginMethod
    public void downloadAndStage(PluginCall call) {
        final String urlStr = call.getString("url");
        final String rawVersion = call.getString("version");
        final String expectedSha256 = call.getString("sha256");

        if (urlStr == null || rawVersion == null || expectedSha256 == null) {
            call.reject("Missing required parameters: url, version, sha256");
            return;
        }

        Uri uri = Uri.parse(urlStr);
        if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null || !ALLOWED_HOSTS.contains(uri.getHost().toLowerCase(Locale.US))) {
            call.reject("Untrusted OTA URL. Only HTTPS downloads from authorized Kuberan hosts are permitted.");
            return;
        }

        final String safeVersion = rawVersion.replaceAll("[^0-9A-Za-z._-]", "");
        if (safeVersion.isEmpty() || safeVersion.contains("..")) {
            call.reject("Invalid version identifier");
            return;
        }

        final String cleanExpectedSha = expectedSha256.trim().toLowerCase(Locale.US);
        if (cleanExpectedSha.length() != 64) {
            call.reject("Invalid SHA-256 checksum format");
            return;
        }

        executor.execute(() -> {
            Context ctx = getContext();
            File otaRoot = new File(ctx.getFilesDir(), "ota_bundles");
            File tmpDir = new File(ctx.getFilesDir(), "ota_tmp");
            File stagingDir = new File(ctx.getFilesDir(), "ota_staging_" + safeVersion + "_" + System.currentTimeMillis());
            File targetDir = new File(otaRoot, safeVersion);
            File zipFile = new File(tmpDir, safeVersion + ".zip");

            try {
                if (!otaRoot.exists()) otaRoot.mkdirs();
                if (!tmpDir.exists()) tmpDir.mkdirs();

                // 1. Download over HTTPS while computing streaming SHA-256
                String actualSha256 = downloadFileWithSha256(urlStr, zipFile);
                if (!cleanExpectedSha.equals(actualSha256)) {
                    zipFile.delete();
                    call.reject("SHA-256 checksum mismatch. Expected " + cleanExpectedSha + ", got " + actualSha256);
                    return;
                }

                // 2. Extract safely with Zip-Slip & size-bomb protection
                unzipSafely(zipFile, stagingDir);
                zipFile.delete();

                // 3. Verify mandatory runtime entrypoints exist
                if (!new File(stagingDir, "index.html").isFile()
                    || !new File(stagingDir, "app.js").isFile()
                    || !new File(stagingDir, "vastu-data.js").isFile()) {
                    deleteRecursively(stagingDir);
                    call.reject("Downloaded OTA bundle is incomplete (missing index.html, app.js, or vastu-data.js)");
                    return;
                }

                // 4. Atomically place into ota_bundles/<version>
                if (targetDir.exists()) {
                    deleteRecursively(targetDir);
                }
                if (!stagingDir.renameTo(targetDir)) {
                    deleteRecursively(stagingDir);
                    call.reject("Failed to commit staged OTA directory");
                    return;
                }

                // 5. Record staged bundle ready for applyUpdate()
                SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
                otaPrefs.edit()
                    .putString(KEY_PENDING_VERSION, safeVersion)
                    .putString(KEY_PENDING_PATH, targetDir.getAbsolutePath())
                    .apply();

                JSObject res = new JSObject();
                res.put("staged", true);
                res.put("version", safeVersion);
                res.put("path", targetDir.getAbsolutePath());
                call.resolve(res);
            } catch (Exception ex) {
                Log.e(TAG, "OTA download/stage failed", ex);
                if (zipFile.exists()) zipFile.delete();
                if (stagingDir.exists()) deleteRecursively(stagingDir);
                call.reject("OTA update failed: " + ex.getMessage());
            }
        });
    }

    @PluginMethod
    public void applyUpdate(PluginCall call) {
        boolean reloadNow = call.getBoolean("reloadNow", true);
        Context ctx = getContext();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
        SharedPreferences capPrefs = ctx.getSharedPreferences(WebView.WEBVIEW_PREFS_NAME, Activity.MODE_PRIVATE);

        String pendingVersion = otaPrefs.getString(KEY_PENDING_VERSION, "");
        String pendingPath = otaPrefs.getString(KEY_PENDING_PATH, "");

        if (pendingPath.isEmpty() || !new File(pendingPath, "index.html").isFile()) {
            call.reject("No valid staged OTA bundle available to apply");
            return;
        }

        // Preserve current active path as rollback target
        String currentActivePath = capPrefs.getString(WebView.CAP_SERVER_PATH, "");
        String currentActiveVersion = otaPrefs.getString(KEY_ACTIVE_VERSION, "");

        otaPrefs.edit()
            .putString(KEY_PREVIOUS_PATH, currentActivePath != null ? currentActivePath : "")
            .putString(KEY_PREVIOUS_VERSION, currentActiveVersion != null ? currentActiveVersion : "")
            .putString(KEY_ACTIVE_VERSION, pendingVersion)
            .putString(KEY_ACTIVE_PATH, pendingPath)
            .putString(KEY_PENDING_VERSION, "")
            .putString(KEY_PENDING_PATH, "")
            .putBoolean(KEY_PENDING_VERIFY, true)
            .putInt(KEY_BOOT_FAIL_COUNT, 0)
            .apply();

        // Persist into Capacitor's native CapWebViewSettings so cold boots load offline from this folder
        capPrefs.edit().putString(WebView.CAP_SERVER_PATH, pendingPath).apply();

        JSObject res = new JSObject();
        res.put("applied", true);
        res.put("version", pendingVersion);
        res.put("reloadNow", reloadNow);
        call.resolve(res);

        if (reloadNow) {
            // Arm watchdog for live reload as well
            cancelWatchdog();
            rollbackWatchdog = () -> {
                SharedPreferences p = getContext().getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
                if (p.getBoolean(KEY_PENDING_VERIFY, false)) {
                    Log.w(TAG, "Live-reloaded OTA bundle failed to confirm notifyAppReady(). Rolling back.");
                    performRollback();
                }
            };
            mainHandler.postDelayed(rollbackWatchdog, ROLLBACK_WATCHDOG_MS);
            bridge.setServerBasePath(pendingPath);
        }
    }

    @PluginMethod
    public void notifyAppReady(PluginCall call) {
        cancelWatchdog();
        Context ctx = getContext();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
        boolean wasPending = otaPrefs.getBoolean(KEY_PENDING_VERIFY, false);
        String activePath = otaPrefs.getString(KEY_ACTIVE_PATH, "");

        if (wasPending) {
            otaPrefs.edit()
                .putBoolean(KEY_PENDING_VERIFY, false)
                .putInt(KEY_BOOT_FAIL_COUNT, 0)
                .apply();
            // Prune older OTA bundle folders on background thread
            executor.execute(() -> pruneOldBundles(ctx, activePath));
            Log.i(TAG, "OTA bundle verified and committed: " + otaPrefs.getString(KEY_ACTIVE_VERSION, ""));
        }

        JSObject ret = new JSObject();
        ret.put("verified", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void resetToBuiltIn(PluginCall call) {
        clearAllOtaState(getContext(), true);
        JSObject ret = new JSObject();
        ret.put("reset", true);
        call.resolve(ret);
    }

    private void performRollback() {
        cancelWatchdog();
        Context ctx = getContext();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
        SharedPreferences capPrefs = ctx.getSharedPreferences(WebView.WEBVIEW_PREFS_NAME, Activity.MODE_PRIVATE);

        String failedPath = otaPrefs.getString(KEY_ACTIVE_PATH, "");
        String prevPath = otaPrefs.getString(KEY_PREVIOUS_PATH, "");
        String prevVersion = otaPrefs.getString(KEY_PREVIOUS_VERSION, "");

        boolean hasValidPrev = prevPath != null && !prevPath.isEmpty() && new File(prevPath, "index.html").isFile();

        otaPrefs.edit()
            .putString(KEY_ACTIVE_PATH, hasValidPrev ? prevPath : "")
            .putString(KEY_ACTIVE_VERSION, hasValidPrev ? prevVersion : "")
            .putBoolean(KEY_PENDING_VERIFY, false)
            .putInt(KEY_BOOT_FAIL_COUNT, 0)
            .apply();

        if (hasValidPrev) {
            capPrefs.edit().putString(WebView.CAP_SERVER_PATH, prevPath).apply();
            bridge.setServerBasePath(prevPath);
        } else {
            capPrefs.edit().remove(WebView.CAP_SERVER_PATH).apply();
            bridge.setServerAssetPath("public");
        }

        if (failedPath != null && !failedPath.isEmpty() && !failedPath.equals(prevPath)) {
            executor.execute(() -> deleteRecursively(new File(failedPath)));
        }
    }

    private void clearAllOtaState(Context ctx, boolean reloadBuiltIn) {
        cancelWatchdog();
        SharedPreferences otaPrefs = ctx.getSharedPreferences(OTA_PREFS, Activity.MODE_PRIVATE);
        SharedPreferences capPrefs = ctx.getSharedPreferences(WebView.WEBVIEW_PREFS_NAME, Activity.MODE_PRIVATE);
        long nativeCode = getNativeVersionCode(ctx);

        otaPrefs.edit()
            .clear()
            .putLong(KEY_LAST_NATIVE_CODE, nativeCode)
            .apply();
        capPrefs.edit().remove(WebView.CAP_SERVER_PATH).apply();

        executor.execute(() -> {
            deleteRecursively(new File(ctx.getFilesDir(), "ota_bundles"));
            deleteRecursively(new File(ctx.getFilesDir(), "ota_tmp"));
        });

        if (reloadBuiltIn && bridge != null) {
            bridge.setServerAssetPath("public");
        }
    }

    private void cancelWatchdog() {
        if (rollbackWatchdog != null) {
            mainHandler.removeCallbacks(rollbackWatchdog);
            rollbackWatchdog = null;
        }
    }

    private String downloadFileWithSha256(String urlStr, File destFile) throws Exception {
        HttpURLConnection conn = null;
        try {
            URL url = new URL(urlStr);
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(20000);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestProperty("Cache-Control", "no-cache");

            int code = conn.getResponseCode();
            if (code != HttpURLConnection.HTTP_OK) {
                throw new IOException("HTTP " + code + " downloading OTA bundle");
            }

            // Re-verify final URL host after redirects
            URL finalUrl = conn.getURL();
            if (!"https".equalsIgnoreCase(finalUrl.getProtocol())
                || !ALLOWED_HOSTS.contains(finalUrl.getHost().toLowerCase(Locale.US))) {
                throw new SecurityException("Redirected to unauthorized host: " + finalUrl.getHost());
            }

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            long totalRead = 0;
            byte[] buffer = new byte[16384];

            try (InputStream in = new BufferedInputStream(conn.getInputStream());
                 FileOutputStream out = new FileOutputStream(destFile)) {
                int len;
                while ((len = in.read(buffer)) != -1) {
                    totalRead += len;
                    if (totalRead > MAX_DOWNLOAD_BYTES) {
                        throw new IOException("OTA bundle exceeds maximum permitted size");
                    }
                    digest.update(buffer, 0, len);
                    out.write(buffer, 0, len);
                }
            }

            byte[] hash = digest.digest();
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format(Locale.US, "%02x", b));
            }
            return hex.toString();
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    private void unzipSafely(File zipFile, File destDir) throws IOException {
        if (!destDir.exists() && !destDir.mkdirs()) {
            throw new IOException("Could not create OTA staging directory");
        }
        String destCanonical = destDir.getCanonicalPath();
        int entryCount = 0;
        long totalUnzipped = 0;
        byte[] buffer = new byte[16384];

        try (ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                entryCount++;
                if (entryCount > MAX_ZIP_ENTRIES) {
                    throw new IOException("Too many entries in OTA archive");
                }

                File outFile = new File(destDir, entry.getName());
                String outCanonical = outFile.getCanonicalPath();
                if (!outCanonical.startsWith(destCanonical + File.separator)) {
                    throw new SecurityException("Zip-Slip path traversal blocked: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    outFile.mkdirs();
                } else {
                    File parent = outFile.getParentFile();
                    if (parent != null && !parent.exists()) parent.mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(outFile)) {
                        int len;
                        while ((len = zis.read(buffer)) != -1) {
                            totalUnzipped += len;
                            if (totalUnzipped > MAX_UNZIPPED_BYTES) {
                                throw new IOException("Extracted OTA bundle exceeds size limit");
                            }
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zis.closeEntry();
            }
        }
    }

    private void pruneOldBundles(Context ctx, String keepPath) {
        File otaRoot = new File(ctx.getFilesDir(), "ota_bundles");
        if (!otaRoot.isDirectory()) return;
        File[] children = otaRoot.listFiles();
        if (children == null) return;
        for (File child : children) {
            if (keepPath != null && child.getAbsolutePath().equals(keepPath)) continue;
            deleteRecursively(child);
        }
    }

    private void deleteRecursively(File file) {
        if (file == null || !file.exists()) return;
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursively(child);
                }
            }
        }
        file.delete();
    }

    private String getNativeVersionName(Context ctx) {
        try {
            PackageInfo info = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            return info.versionName != null ? info.versionName : "0.0.0";
        } catch (Exception e) {
            return "0.0.0";
        }
    }

    private long getNativeVersionCode(Context ctx) {
        try {
            PackageInfo info = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return info.getLongVersionCode();
            }
            return info.versionCode;
        } catch (Exception e) {
            return 0L;
        }
    }
}
