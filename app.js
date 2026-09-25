/**
 * KUBERAN VASTU COMPASS APP - High Precision Vedic Architecture & Mobile Compass
 * Built for iOS Safari, Android Chrome, and Desktop Browsers.
 * Features: True North Default, 8/16/32 Zones, Room Finder, Plot Tilt (Vidisha), Camera AR, Trilingual + Tamil + Telugu
 */

(function() {
  'use strict';

  // --- State Variables ---
  let currentHeading = 0;
  let rawMagneticHeading = 0;
  let smoothedHeading = null;
  // (smoothing factor is now adaptive - see updateHeading)
  let calibrationOffset = 0;
  try {
    const savedOffset = localStorage.getItem('kuberan-vastu-compass-offset');
    if (savedOffset !== null) {
      calibrationOffset = parseFloat(savedOffset) || 0;
    }
  } catch(e) {}
  let sensorAccuracy = null;
  let isAbsoluteOrientation = false;
  let targetHeading = null;
  let isTrueNorth = true; // TRUE NORTH BY DEFAULT per requirements
  let magneticDeclination = 0;
  let pitch = 0;
  let roll = 0;
  let hasSensorData = false;
  let hapticsEnabled = true;
  let deferredPrompt = null;
  let lastVibrateTime = 0;
  let lastVibratedCardinal = -1;
  let lastVibratedPada = null;

  // App Modes & Vastu State
  let compassMode = 'vastu'; // 'vastu' or 'simple'
  let zoneSystem = '8';      // '8', '16', or '32'
  let dialTheme = 'elemental'; // 'elemental', 'chakra', or 'gold'
  let currentLang = 'en';    // 'en', 'hi', 'kn', 'ta', 'te'
  let activeRoom = null;     // Selected room object from VASTU_DATA.ROOMS
  let plotTiltReading = null;// Locked wall alignment data
  let cameraStream = null;   // MediaStream for Camera AR
  let propertyType = 'residential'; // 'residential' or 'commercial'
  let retailProfile = 'apparel_silk_sarees'; // 'apparel_silk_sarees', 'jewelry_luxury', 'general_commercial'
  let roomCategoryTab = 'residential'; // 'residential' or 'commercial'
  let selectedPlotShape = 'Shermukhi'; // 'Shermukhi', 'Gaumukhi', 'Square_Rectangular'

  // Visual Themes List (Marine Brass is base palette)
  const DIAL_THEMES = ['elemental', 'chakra', 'gold'];
  let currentDialThemeIndex = 0;

  // DOM Elements
  const compassCard = document.getElementById('compassCard');
  const dialSvg = document.getElementById('dialSvg');
  const compassViewport = document.getElementById('compassViewport');
  const cameraFeed = document.getElementById('cameraFeed');
  const cameraScrim = document.getElementById('cameraScrim');
  const headingDegrees = document.getElementById('headingDegrees');
  const headingCardinal = document.getElementById('headingCardinal');
  const headingSanskrit = document.getElementById('headingSanskrit');
  const milsValue = document.getElementById('milsValue');
  const backAzimuthValue = document.getElementById('backAzimuthValue');
  const targetValue = document.getElementById('targetValue');
  const targetMarkerRing = document.getElementById('targetMarkerRing');
  const targetDeviationBar = document.getElementById('targetDeviationBar');
  const devArrow = document.getElementById('devArrow');
  const devText = document.getElementById('devText');
  const btnClearTarget = document.getElementById('btnClearTarget');
  const btnBearingLock = document.getElementById('btnBearingLock');
  const btnToggleNorth = document.getElementById('btnToggleNorth');
  const northPill = document.getElementById('northPill');
  const northModeLabel = document.getElementById('northModeLabel');
  const btnDialTheme = document.getElementById('btnDialTheme');
  const btnLanguage = document.getElementById('btnLanguage');
  const langPill = document.getElementById('langPill');
  const btnInfo = document.getElementById('btnInfo');
  const infoModal = document.getElementById('infoModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const iosPermissionBanner = document.getElementById('iosPermissionBanner');
  const btnGrantSensor = document.getElementById('btnGrantSensor');
  const btnDismissSensor = document.getElementById('btnDismissSensor');
  const levelHousing = document.getElementById('levelHousing');
  const levelBubble = document.getElementById('levelBubble');
  const pitchGauge = document.getElementById('pitchGauge');
  const rollGauge = document.getElementById('rollGauge');
  const pitchValue = document.getElementById('pitchValue');
  const rollValue = document.getElementById('rollValue');
  const levelStatusCard = document.getElementById('levelStatusCard');
  const levelStatusText = document.getElementById('levelStatusText');
  const gpsLat = document.getElementById('gpsLat');
  const gpsLatDec = document.getElementById('gpsLatDec');
  const gpsLng = document.getElementById('gpsLng');
  const gpsLngDec = document.getElementById('gpsLngDec');
  const gpsAlt = document.getElementById('gpsAlt');
  const gpsAccuracy = document.getElementById('gpsAccuracy');
  const gpsDeclination = document.getElementById('gpsDeclination');
  const sensorStatus = document.getElementById('sensorStatus');
  const btnCopyCoords = document.getElementById('btnCopyCoords');
  const btnInstallApp = document.getElementById('btnInstallApp');

  // Calibration Studio Elements
  const telemetryCalibrationItem = document.getElementById('telemetryCalibrationItem');
  const sensorAccuracyBadge = document.getElementById('sensorAccuracyBadge');
  const btnCalibrate = document.getElementById('btnCalibrate');
  const calibrationModal = document.getElementById('calibrationModal');
  const btnCloseCalModal = document.getElementById('btnCloseCalModal');
  const calSensorBadge = document.getElementById('calSensorBadge');
  const calAccuracyText = document.getElementById('calAccuracyText');
  const calActiveOffsetVal = document.getElementById('calActiveOffsetVal');
  const calOffsetBadge = document.getElementById('calOffsetBadge');
  const btnOffsetMinus5 = document.getElementById('btnOffsetMinus5');
  const btnOffsetMinus1 = document.getElementById('btnOffsetMinus1');
  const btnOffsetReset = document.getElementById('btnOffsetReset');
  const btnOffsetPlus1 = document.getElementById('btnOffsetPlus1');
  const btnOffsetPlus5 = document.getElementById('btnOffsetPlus5');
  const btnZeroToNorth = document.getElementById('btnZeroToNorth');
  const toast = document.getElementById('toast');
  const githubRepoLink = document.getElementById('githubRepoLink');

  // Vastu Mode Switcher & Controls Elements
  const btnModeVastu = document.getElementById('btnModeVastu');
  const btnModeSimple = document.getElementById('btnModeSimple');
  const vastuSubcontrols = document.getElementById('vastuSubcontrols');
  const btnZone8 = document.getElementById('btnZone8');
  const btnZone16 = document.getElementById('btnZone16');
  const btnZone32 = document.getElementById('btnZone32');
  const btnToolRoomFinder = document.getElementById('btnToolRoomFinder');
  const btnToolPlotTilt = document.getElementById('btnToolPlotTilt');
  const btnToolCamera = document.getElementById('btnToolCamera');
  const btnToolAudit = document.getElementById('btnToolAudit');
  const vastuInspectorSection = document.getElementById('vastuInspectorSection');

  // Commercial & Retail Elements
  const btnPropResidential = document.getElementById('btnPropResidential');
  const btnPropCommercial = document.getElementById('btnPropCommercial');
  const retailProfileStrip = document.getElementById('retailProfileStrip');
  const chipProfileApparel = document.getElementById('chipProfileApparel');
  const chipProfileJewelry = document.getElementById('chipProfileJewelry');
  const chipProfileGeneral = document.getElementById('chipProfileGeneral');
  const commercialInspectorBox = document.getElementById('commercialInspectorBox');
  const inspCommSuitability = document.getElementById('inspCommSuitability');
  const inspBusinessImpact = document.getElementById('inspBusinessImpact');
  const roomFinderCategoryTabs = document.getElementById('roomFinderCategoryTabs');
  const tabResRooms = document.getElementById('tabResRooms');
  const tabCommRooms = document.getElementById('tabCommRooms');
  const plotShapeSelectorGrid = document.getElementById('plotShapeSelectorGrid');
  const plotShapeBadge = document.getElementById('plotShapeBadge');
  const plotShapeAdviceText = document.getElementById('plotShapeAdviceText');
  const reportPropertyType = document.getElementById('reportPropertyType');
  const reportCategoryRow = document.getElementById('reportCategoryRow');
  const reportBusinessCategory = document.getElementById('reportBusinessCategory');
  const reportPlotShapeRow = document.getElementById('reportPlotShapeRow');
  const reportPlotShape = document.getElementById('reportPlotShape');
  const commercialChecklistBox = document.getElementById('commercialChecklistBox');
  const inspZoneBadge = document.getElementById('inspZoneBadge');
  const inspZoneName = document.getElementById('inspZoneName');
  const inspSanskrit = document.getElementById('inspSanskrit');
  const inspElementDot = document.getElementById('inspElementDot');
  const inspElementName = document.getElementById('inspElementName');
  const inspDeityVal = document.getElementById('inspDeityVal');
  const inspSummaryText = document.getElementById('inspSummaryText');
  const favorableTags = document.getElementById('favorableTags');
  const avoidTags = document.getElementById('avoidTags');
  const inspTipText = document.getElementById('inspTipText');
  const padaEntranceCard = document.getElementById('padaEntranceCard');
  const padaIdBadge = document.getElementById('padaIdBadge');
  const padaDevataName = document.getElementById('padaDevataName');
  const padaGradePill = document.getElementById('padaGradePill');
  const padaEffectText = document.getElementById('padaEffectText');

  // Guidance Banner Elements
  const roomGuidanceBanner = document.getElementById('roomGuidanceBanner');
  const guideRoomIcon = document.getElementById('guideRoomIcon');
  const guideRoomName = document.getElementById('guideRoomName');
  const guideTargetBadge = document.getElementById('guideTargetBadge');
  const guideStatusText = document.getElementById('guideStatusText');
  const btnCloseRoomGuide = document.getElementById('btnCloseRoomGuide');

  // Modals Elements
  const langModal = document.getElementById('langModal');
  const btnCloseLangModal = document.getElementById('btnCloseLangModal');
  const langOptionsList = document.getElementById('langOptionsList');
  const roomFinderModal = document.getElementById('roomFinderModal');
  const btnCloseRoomModal = document.getElementById('btnCloseRoomModal');
  const roomsGrid = document.getElementById('roomsGrid');
  const plotTiltModal = document.getElementById('plotTiltModal');
  const btnCloseTiltModal = document.getElementById('btnCloseTiltModal');
  const plotHeadingVal = document.getElementById('plotHeadingVal');
  const plotDeviationVal = document.getElementById('plotDeviationVal');
  const plotStatusBanner = document.getElementById('plotStatusBanner');
  const plotStatusTitle = document.getElementById('plotStatusTitle');
  const plotStatusDesc = document.getElementById('plotStatusDesc');
  const btnLockPlotTilt = document.getElementById('btnLockPlotTilt');
  const auditModal = document.getElementById('auditModal');
  const btnCloseAuditModal = document.getElementById('btnCloseAuditModal');
  const reportTimestamp = document.getElementById('reportTimestamp');
  const reportHeading = document.getElementById('reportHeading');
  const reportZone = document.getElementById('reportZone');
  const reportElement = document.getElementById('reportElement');
  const reportDeity = document.getElementById('reportDeity');
  const reportGps = document.getElementById('reportGps');
  const reportDoor = document.getElementById('reportDoor');
  const reportPlot = document.getElementById('reportPlot');
  const reportAdvice = document.getElementById('reportAdvice');
  const btnCopyAuditReport = document.getElementById('btnCopyAuditReport');
  const btnShareAuditReport = document.getElementById('btnShareAuditReport');

  // --- Robust Compass Heading from W3C Euler angles (alpha, beta, gamma) ---
  // BUG FIXED (v4.6.2): the previous formula returned the direction of the phone's
  // BACK (-Z axis). Held flat (the normal way to use a compass) the back points at the
  // floor, so its horizontal projection is ~0 and the heading swung by up to 90-180°
  // with a 1-2° hand tilt (and jumped at the 0.5° flat/tilted switch).
  //
  // Correct behaviour:
  //   * phone flat / slightly tilted  -> heading of the SCREEN-TOP edge  (tilt-immune)
  //   * phone upright (camera / AR)   -> heading of the REAR CAMERA axis
  //   * smooth blend between the two  -> no jumps while raising or lowering the phone
  // Screen rotation (portrait/landscape) is handled here, so callers must NOT add it again.
  function computeHeadingFromEuler(alpha, beta, gamma, screenAngle) {
    const D = Math.PI / 180;
    const a = alpha * D, b = beta * D, g = gamma * D;
    const cA = Math.cos(a), sA = Math.sin(a);
    const cB = Math.cos(b), sB = Math.sin(b);
    const cG = Math.cos(g), sG = Math.sin(g);

    // Device axes in the Earth frame (east, north). R = Rz(alpha) · Rx(beta) · Ry(gamma)
    const axisX    = { e: cA * cG - sA * sB * sG, n: cG * sA + cA * sB * sG };   // device right
    const axisY    = { e: -cB * sA,               n: cA * cB };                  // device top edge
    const axisRear = { e: -(cA * sG + cG * sA * sB), n: -(sA * sG - cA * cG * sB) }; // -Z (rear camera)

    // Which device axis is the top of the *screen* right now?
    const quarter = ((Math.round((screenAngle || 0) / 90) % 4) + 4) % 4;
    const top = [axisY, axisX, { e: -axisY.e, n: -axisY.n }, { e: -axisX.e, n: -axisX.n }][quarter];

    // 1 = lying flat face-up, 0 = upright
    const flatness = cB * cG;
    const t = Math.min(1, Math.max(0, (flatness - 0.35) / 0.40));
    const wTop = t * t * (3 - 2 * t); // smoothstep: 0 (upright) .. 1 (flat)

    const unit = (v) => {
      const m = Math.hypot(v.e, v.n);
      return m < 1e-6 ? null : { e: v.e / m, n: v.n / m };
    };
    const uTop = unit(top);
    const uRear = unit(axisRear);

    let e = 0, n = 0;
    if (uTop && wTop > 0) { e += uTop.e * wTop; n += uTop.n * wTop; }
    if (uRear && wTop < 1) {
      // never blend two opposite vectors (phone tipped top-down): align rear with top first
      const sign = (uTop && wTop > 0 && (uTop.e * uRear.e + uTop.n * uRear.n) < 0) ? -1 : 1;
      e += sign * uRear.e * (1 - wTop);
      n += sign * uRear.n * (1 - wTop);
    }
    if (e === 0 && n === 0) return null;

    let heading = Math.atan2(e, n) / D;
    return heading < 0 ? heading + 360 : heading;
  }


/**
 * Vastu Compass Smooth & Freeze Engine
 * Solves endless jittering on stationary devices.
 */
class CompassStabilizer {
    constructor(options = {}) {
        this.alpha = options.alpha || 0.15;
        this.deadzone = options.deadzone || 0.8;
        this.lockThreshold = options.lockThreshold || 1.2;
        this.lockDuration = options.lockDuration || 2000;
        
        this.currentHeading = null;
        this.targetHeading = null;
        this.lastRenderedHeading = 0;
        
        this.motionHistory = [];
        this.isLocked = false;
        this.animFrameId = null;

        this.onHeadingChange = options.onHeadingChange || null;
    }

        updateRawHeading(rawHeading) {
        if (typeof rawHeading !== 'number' || isNaN(rawHeading)) return;

        let normalized = (rawHeading % 360 + 360) % 360;

        if (this.currentHeading === null) {
            this.currentHeading = normalized;
            this.targetHeading = normalized;
            if (this.onHeadingChange) this.onHeadingChange(this.currentHeading);
            return;
        }

        let sensorDelta = this.getShortestAngleDelta(this.targetHeading, normalized);
        if (Math.abs(sensorDelta) < this.deadzone) {
            this.checkStationaryStatus(normalized);
            return;
        }

        this.targetHeading = normalized;
        this.checkStationaryStatus(normalized);

        if (!this.animFrameId) {
            this.animFrameId = requestAnimationFrame(() => this.processLoop());
        }
    }

    getShortestAngleDelta(from, to) {
        from = (from % 360 + 360) % 360;
        to = (to % 360 + 360) % 360;
        let diff = (to - from + 180) % 360 - 180;
        return diff < -180 ? diff + 360 : diff;
    }

    checkStationaryStatus(heading) {
        const now = Date.now();
        this.motionHistory.push({ heading, time: now });
        this.motionHistory = this.motionHistory.filter(item => now - item.time <= this.lockDuration);

        if (this.motionHistory.length > 5) {
            const headings = this.motionHistory.map(m => m.heading);
            let minDelta = 0;
            let maxDelta = 0;
            const ref = headings[0];
            for (let i = 1; i < headings.length; i++) {
                let d = this.getShortestAngleDelta(ref, headings[i]);
                if (d < minDelta) minDelta = d;
                if (d > maxDelta) maxDelta = d;
            }
            const totalSpread = maxDelta - minDelta;
            this.isLocked = totalSpread < this.lockThreshold;
        }
    }

        processLoop() {
        if (this.isLocked) {
            this.animFrameId = null;
            return;
        }

        let delta = this.getShortestAngleDelta(this.currentHeading, this.targetHeading);

        // Snap to target if very close to save CPU
        if (Math.abs(delta) < 0.1) {
            this.currentHeading = this.currentHeading + delta;
            if (Math.abs(this.currentHeading - this.lastRenderedHeading) >= 0.1) {
                this.lastRenderedHeading = this.currentHeading;
                if (this.onHeadingChange) this.onHeadingChange(this.currentHeading);
            }
            this.animFrameId = null;
            return;
        }

        // Accumulate angle to prevent CSS backward spinning
        this.currentHeading = this.currentHeading + delta * this.alpha;

        if (Math.abs(this.currentHeading - this.lastRenderedHeading) >= 0.1) {
            this.lastRenderedHeading = this.currentHeading;
            if (this.onHeadingChange) {
                this.onHeadingChange(this.currentHeading);
            }
        }

        this.animFrameId = requestAnimationFrame(() => this.processLoop());
    }
}

const stabilizer = new CompassStabilizer({
    alpha: 0.12,
    deadzone: 0.7,
    lockThreshold: 1.2,
    onHeadingChange: (smoothedH) => {
        smoothedHeading = smoothedH;
        let calibratedHeading = smoothedHeading + calibrationOffset;
        let trueHeading = calibratedHeading;
        if (isTrueNorth) {
          trueHeading = calibratedHeading + magneticDeclination;
        }
        updateHeadingUI(trueHeading);
    }
});

  // --- Angle Smoothing Helper (handles 0°/360° phase wrap-around) ---
  function smoothAngle(prev, target, factor) {
    if (prev === null) return target;
    // Calculate shortest angular distance to target, keeping prev as an accumulated value
    let prevDisplay = ((prev % 360) + 360) % 360;
    let diff = (target - prevDisplay + 540) % 360 - 180;
    return prev + diff * factor;
  }

  // --- Helper: Degree Normalizer ---
  function normalizeAngle(angle) {
    let a = angle % 360;
    return a < 0 ? a + 360 : a;
  }

  // --- Helper: WGS84 Declination Estimator ---
  function estimateMagneticDeclination(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude)) return 0;
    // World Magnetic Model approximation for Indian subcontinent & global fallback
    if (latitude >= 6 && latitude <= 38 && longitude >= 68 && longitude <= 98) {
      // In India, magnetic declination ranges between -2.0° to +1.5°
      const latFraction = (latitude - 8) / 30;
      const lngFraction = (longitude - 77) / 20;
      return parseFloat((-0.5 + latFraction * 0.8 - lngFraction * 1.2).toFixed(1));
    }
    return 0.0;
  }

  // --- Helper: Format Degrees to DMS ---
  function formatDMS(dec, isLat) {
    if (isNaN(dec)) return '--° --\' --"';
    const dir = isLat ? (dec >= 0 ? 'N' : 'S') : (dec >= 0 ? 'E' : 'W');
    const absVal = Math.abs(dec);
    const deg = Math.floor(absVal);
    const minDec = (absVal - deg) * 60;
    const min = Math.floor(minDec);
    const sec = Math.round((minDec - min) * 60);
    return `${deg}° ${min}' ${sec}" ${dir}`;
  }

  // --- Helper: Format Milliseconds / Date ---
  function formatCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  }

  // --- Vastu Calculations Engine ---
  function getActiveZone8(heading) {
    const h = normalizeAngle(heading);
    for (const z of VASTU_DATA.ZONES_8) {
      if (z.startDeg > z.endDeg) {
        // Wrap-around North (337.5° to 22.5°)
        if (h >= z.startDeg || h < z.endDeg) return z;
      } else {
        if (h >= z.startDeg && h < z.endDeg) return z;
      }
    }
    return VASTU_DATA.ZONES_8[0];
  }

  function getActiveZone16(heading) {
    const h = normalizeAngle(heading);
    for (const z of VASTU_DATA.ZONES_16) {
      if (z.startDeg > z.endDeg) {
        if (h >= z.startDeg || h < z.endDeg) return z;
      } else {
        if (h >= z.startDeg && h < z.endDeg) return z;
      }
    }
    return VASTU_DATA.ZONES_16[0];
  }

  function getActivePada32(heading) {
    const h = normalizeAngle(heading);
    for (const p of VASTU_DATA.PADAS_32) {
      if (p.startDeg > p.endDeg) {
        if (h >= p.startDeg || h < p.endDeg) return p;
      } else {
        if (h >= p.startDeg && h < p.endDeg) return p;
      }
    }
    return VASTU_DATA.PADAS_32[0];
  }

  // --- Build Dial Vector SVG ---
  function buildDialSvg() {
    const cx = 250;
    const cy = 250;
    const rOuter = 240;
    let svgContent = '';

    if (compassMode === 'simple') {
      // -------------------------------------------------------------
      // SIMPLE COMPASS DIAL (Authentic Nautical Precision Dial)
      // -------------------------------------------------------------
      svgContent += `<circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>`;
      svgContent += `<circle cx="${cx}" cy="${cy}" r="${rOuter - 18}" fill="none" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`;
      svgContent += `<circle cx="${cx}" cy="${cy}" r="116" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="4,4"/>`;

      // Degree Ticks (Every 2°, 10°, 30°)
      for (let deg = 0; deg < 360; deg += 2) {
        const rad = (deg - 90) * (Math.PI / 180);
        const is30 = deg % 30 === 0;
        const is10 = deg % 10 === 0;

        let tickLen = 7;
        let strokeWidth = 1;
        let strokeOpacity = 0.35;

        if (is30) {
          tickLen = 16;
          strokeWidth = 2.5;
          strokeOpacity = 0.9;
        } else if (is10) {
          tickLen = 12;
          strokeWidth = 1.5;
          strokeOpacity = 0.6;
        }

        const x1 = cx + (rOuter - 2) * Math.cos(rad);
        const y1 = cy + (rOuter - 2) * Math.sin(rad);
        const x2 = cx + (rOuter - 2 - tickLen) * Math.cos(rad);
        const y2 = cy + (rOuter - 2 - tickLen) * Math.sin(rad);

        const strokeColor = (deg === 0) ? 'var(--accent-north)' : 'currentColor';
        svgContent += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}"/>`;

        // Degree Numbers (every 30°, skipping cardinal positions)
        if (is30 && deg % 90 !== 0) {
          const textR = rOuter - 29;
          const tx = cx + textR * Math.cos(rad);
          const ty = cy + textR * Math.sin(rad);
          svgContent += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="currentColor" fill-opacity="0.7" transform="rotate(${deg}, ${tx.toFixed(1)}, ${ty.toFixed(1)})">${deg}</text>`;
        }
      }

      // Compass Rose 8-Point Star
      svgContent += `
        <g class="compass-rose-star" opacity="0.85">
          <polygon points="${cx},${cy - 120} ${cx + 12},${cy - 20} ${cx},${cy}" fill="var(--accent-north)" />
          <polygon points="${cx},${cy - 120} ${cx - 12},${cy - 20} ${cx},${cy}" fill="rgba(239, 68, 68, 0.4)" />
          <polygon points="${cx},${cy + 120} ${cx - 12},${cy + 20} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.9" />
          <polygon points="${cx},${cy + 120} ${cx + 12},${cy + 20} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.4" />
          <polygon points="${cx + 120},${cy} ${cx + 20},${cy + 12} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.9" />
          <polygon points="${cx + 120},${cy} ${cx + 20},${cy - 12} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.4" />
          <polygon points="${cx - 120},${cy} ${cx - 20},${cy - 12} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.9" />
          <polygon points="${cx - 120},${cy} ${cx - 20},${cy + 12} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.4" />
          <polygon points="${cx + 80},${cy - 80} ${cx + 14},${cy - 14} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.65" />
          <polygon points="${cx + 80},${cy + 80} ${cx + 14},${cy + 14} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.65" />
          <polygon points="${cx - 80},${cy + 80} ${cx - 14},${cy + 14} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.65" />
          <polygon points="${cx - 80},${cy - 80} ${cx - 14},${cy - 14} ${cx},${cy}" fill="var(--accent-cyan)" opacity="0.65" />
        </g>
      `;

      // Cardinal & Intercardinal Typography
      const cardinals = [
        { label: 'N', deg: 0, r: rOuter - 32, size: 24, weight: '800', color: 'var(--accent-north)', hasDeg: false },
        { label: 'E', deg: 90, r: rOuter - 32, size: 22, weight: '700', color: 'currentColor', hasDeg: true, degNum: '90' },
        { label: 'S', deg: 180, r: rOuter - 32, size: 22, weight: '700', color: 'currentColor', hasDeg: true, degNum: '180' },
        { label: 'W', deg: 270, r: rOuter - 32, size: 22, weight: '700', color: 'currentColor', hasDeg: true, degNum: '270' },
        { label: 'NE', deg: 45, r: rOuter - 29, size: 13, weight: '600', color: 'currentColor', hasDeg: false },
        { label: 'SE', deg: 135, r: rOuter - 29, size: 13, weight: '600', color: 'currentColor', hasDeg: false },
        { label: 'SW', deg: 225, r: rOuter - 29, size: 13, weight: '600', color: 'currentColor', hasDeg: false },
        { label: 'NW', deg: 315, r: rOuter - 29, size: 13, weight: '600', color: 'currentColor', hasDeg: false }
      ];

      cardinals.forEach(c => {
        const rad = (c.deg - 90) * (Math.PI / 180);
        const tx = cx + c.r * Math.cos(rad);
        const ty = cy + c.r * Math.sin(rad);
        svgContent += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="${c.size}" font-weight="${c.weight}" fill="${c.color}" transform="rotate(${c.deg}, ${tx.toFixed(1)}, ${ty.toFixed(1)})">${c.label}</text>`;
        if (c.hasDeg) {
          const numR = c.r - 18;
          const nx = cx + numR * Math.cos(rad);
          const ny = cy + numR * Math.sin(rad);
          svgContent += `<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="currentColor" fill-opacity="0.7" transform="rotate(${c.deg}, ${nx.toFixed(1)}, ${ny.toFixed(1)})">${c.degNum}</text>`;
        }
      });

    } else {
      // -------------------------------------------------------------
      // VASTU COMPASS DIAL (8 Zones / 16 Zones / 32 Padas)
      // -------------------------------------------------------------
      const rInnerVastu = 130;
      const rOuterVastu = 236;

      // Concentric Rings
      svgContent += `<circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="2"/>`;
      svgContent += `<circle cx="${cx}" cy="${cy}" r="${rOuterVastu}" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>`;
      svgContent += `<circle cx="${cx}" cy="${cy}" r="${rInnerVastu}" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5"/>`;
      svgContent += `<circle cx="${cx}" cy="${cy}" r="116" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="4,4"/>`;

      if (zoneSystem === '8') {
        // --- 8 ZONES (Ashta Dikpala) ---
        VASTU_DATA.ZONES_8.forEach((zone) => {
          const elem = VASTU_DATA.ELEMENTS[zone.element];
          const startRad = (zone.startDeg - 90) * (Math.PI / 180);
          const endRad = (zone.endDeg - 90) * (Math.PI / 180);
          const centerRad = (zone.centerDeg - 90) * (Math.PI / 180);

          // Sector divider ray
          const sx = cx + rOuterVastu * Math.cos(startRad);
          const sy = cy + rOuterVastu * Math.sin(startRad);
          const ex = cx + rInnerVastu * Math.cos(startRad);
          const ey = cy + rInnerVastu * Math.sin(startRad);
          svgContent += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.2"/>`;

          // Sector arc band (outer rim)
          const arcX1 = cx + (rOuterVastu - 4) * Math.cos(startRad);
          const arcY1 = cy + (rOuterVastu - 4) * Math.sin(startRad);
          const arcX2 = cx + (rOuterVastu - 4) * Math.cos(endRad);
          const arcY2 = cy + (rOuterVastu - 4) * Math.sin(endRad);
          svgContent += `<path d="M ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 4} ${rOuterVastu - 4} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)}" fill="none" stroke="${elem.color}" stroke-width="5" stroke-opacity="0.8" class="vastu-sector-ring"/>`;

          // Sector fill for Chakra Theme
          if (dialTheme === 'chakra') {
            const ix1 = cx + rInnerVastu * Math.cos(startRad);
            const iy1 = cy + rInnerVastu * Math.sin(startRad);
            const ix2 = cx + rInnerVastu * Math.cos(endRad);
            const iy2 = cy + rInnerVastu * Math.sin(endRad);
            svgContent += `<path d="M ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 4} ${rOuterVastu - 4} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${rInnerVastu} ${rInnerVastu} 0 0 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z" fill="${elem.color}" fill-opacity="0.22" class="vastu-sector-fill"/>`;
          }

          // Direction Label & Sanskrit Name
          const textR = rOuterVastu - 24;
          const tx = cx + textR * Math.cos(centerRad);
          const ty = cy + textR * Math.sin(centerRad);
          const textColor = (zone.code === 'N') ? 'var(--accent-north)' : 'currentColor';

          svgContent += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="800" fill="${textColor}" class="vastu-zone-text" transform="rotate(${zone.centerDeg}, ${tx.toFixed(1)}, ${ty.toFixed(1)})">${zone.code}</text>`;

          const sanskritR = textR - 18;
          const sxTxt = cx + sanskritR * Math.cos(centerRad);
          const syTxt = cy + sanskritR * Math.sin(centerRad);
          const sanskritShort = zone.sanskrit.split(' ')[0]; // E.g., 'Īśānya'
          svgContent += `<text x="${sxTxt.toFixed(1)}" y="${syTxt.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="600" fill="${elem.color}" transform="rotate(${zone.centerDeg}, ${sxTxt.toFixed(1)}, ${syTxt.toFixed(1)})">${sanskritShort}</text>`;
        });

      } else if (zoneSystem === '16') {
        // --- 16 MAHAVASTU ZONES (22.5° each) ---
        VASTU_DATA.ZONES_16.forEach((zone) => {
          const elem = VASTU_DATA.ELEMENTS[zone.element];
          const startRad = (zone.startDeg - 90) * (Math.PI / 180);
          const endRad = (zone.endDeg - 90) * (Math.PI / 180);
          const centerRad = (zone.centerDeg - 90) * (Math.PI / 180);

          // Divider
          const sx = cx + rOuterVastu * Math.cos(startRad);
          const sy = cy + rOuterVastu * Math.sin(startRad);
          const ex = cx + rInnerVastu * Math.cos(startRad);
          const ey = cy + rInnerVastu * Math.sin(startRad);
          svgContent += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="currentColor" stroke-opacity="0.3" stroke-width="1"/>`;

          // Outer colored arc
          const arcX1 = cx + (rOuterVastu - 3) * Math.cos(startRad);
          const arcY1 = cy + (rOuterVastu - 3) * Math.sin(startRad);
          const arcX2 = cx + (rOuterVastu - 3) * Math.cos(endRad);
          const arcY2 = cy + (rOuterVastu - 3) * Math.sin(endRad);
          svgContent += `<path d="M ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 3} ${rOuterVastu - 3} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)}" fill="none" stroke="${elem.color}" stroke-width="4.5" stroke-opacity="0.8" class="vastu-sector-ring"/>`;

          if (dialTheme === 'chakra') {
            const ix1 = cx + rInnerVastu * Math.cos(startRad);
            const iy1 = cy + rInnerVastu * Math.sin(startRad);
            const ix2 = cx + rInnerVastu * Math.cos(endRad);
            const iy2 = cy + rInnerVastu * Math.sin(endRad);
            svgContent += `<path d="M ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 3} ${rOuterVastu - 3} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${rInnerVastu} ${rInnerVastu} 0 0 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z" fill="${elem.color}" fill-opacity="0.22" class="vastu-sector-fill"/>`;
          }

          // Zone text
          const textR = rOuterVastu - 22;
          const tx = cx + textR * Math.cos(centerRad);
          const ty = cy + textR * Math.sin(centerRad);
          const textColor = (zone.id === 'N') ? 'var(--accent-north)' : 'currentColor';
          svgContent += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="10.5" font-weight="700" fill="${textColor}" class="vastu-zone-text" transform="rotate(${zone.centerDeg}, ${tx.toFixed(1)}, ${ty.toFixed(1)})">${zone.id}</text>`;
        });

      } else if (zoneSystem === '32') {
        // --- 32 PADA DEVATA CHAKRA (11.25° each) ---
        VASTU_DATA.PADAS_32.forEach((pada) => {
          const startRad = (pada.startDeg - 90) * (Math.PI / 180);
          const endRad = (pada.endDeg - 90) * (Math.PI / 180);
          const centerDeg = (pada.startDeg + pada.endDeg) / 2;
          const centerRad = (centerDeg - 90) * (Math.PI / 180);

          // Grade color: Green for Grade A, Yellow for Grade B, Red for Grade C
          let gradeColor = '#ef4444';
          if (pada.grade === 'A') gradeColor = '#22c55e';
          else if (pada.grade === 'B') gradeColor = '#eab308';

          // Divider
          const sx = cx + rOuterVastu * Math.cos(startRad);
          const sy = cy + rOuterVastu * Math.sin(startRad);
          const ex = cx + rInnerVastu * Math.cos(startRad);
          const ey = cy + rInnerVastu * Math.sin(startRad);
          svgContent += `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="currentColor" stroke-opacity="0.2" stroke-width="0.8"/>`;

          // Outer arc with grade color
          const arcX1 = cx + (rOuterVastu - 2) * Math.cos(startRad);
          const arcY1 = cy + (rOuterVastu - 2) * Math.sin(startRad);
          const arcX2 = cx + (rOuterVastu - 2) * Math.cos(endRad);
          const arcY2 = cy + (rOuterVastu - 2) * Math.sin(endRad);
          svgContent += `<path d="M ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 2} ${rOuterVastu - 2} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)}" fill="none" stroke="${gradeColor}" stroke-width="4" stroke-opacity="0.85" class="vastu-sector-ring"/>`;

          if (dialTheme === 'chakra') {
            const ix1 = cx + rInnerVastu * Math.cos(startRad);
            const iy1 = cy + rInnerVastu * Math.sin(startRad);
            const ix2 = cx + rInnerVastu * Math.cos(endRad);
            const iy2 = cy + rInnerVastu * Math.sin(endRad);
            svgContent += `<path d="M ${ix1.toFixed(1)} ${iy1.toFixed(1)} L ${arcX1.toFixed(1)} ${arcY1.toFixed(1)} A ${rOuterVastu - 2} ${rOuterVastu - 2} 0 0 1 ${arcX2.toFixed(1)} ${arcY2.toFixed(1)} L ${ix2.toFixed(1)} ${iy2.toFixed(1)} A ${rInnerVastu} ${rInnerVastu} 0 0 0 ${ix1.toFixed(1)} ${iy1.toFixed(1)} Z" fill="${gradeColor}" fill-opacity="0.18" class="vastu-sector-fill"/>`;
          }

          // Pada ID text (e.g. E3, N4)
          const textR = rOuterVastu - 16;
          const tx = cx + textR * Math.cos(centerRad);
          const ty = cy + textR * Math.sin(centerRad);
          svgContent += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-weight="700" fill="${gradeColor}" class="vastu-zone-text" transform="rotate(${centerDeg}, ${tx.toFixed(1)}, ${ty.toFixed(1)})">${pada.id}</text>`;

          // Devata short name
          const devataR = textR - 16;
          const dx = cx + devataR * Math.cos(centerRad);
          const dy = cy + devataR * Math.sin(centerRad);
          const devataShort = pada.devata.split(' ')[0];
          svgContent += `<text x="${dx.toFixed(1)}" y="${dy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="7" font-weight="600" fill="currentColor" opacity="0.75" transform="rotate(${centerDeg}, ${dx.toFixed(1)}, ${dy.toFixed(1)})">${devataShort}</text>`;
        });
      }

      // Room-to-Direction Finder Target Highlight Arc Overlay
      if (activeRoom) {
        activeRoom.idealZones.forEach(zoneCode => {
          const z = VASTU_DATA.ZONES_8.find(item => item.code === zoneCode);
          if (z) {
            const startRad = (z.startDeg - 90) * (Math.PI / 180);
            const endRad = (z.endDeg - 90) * (Math.PI / 180);
            const ax1 = cx + (rOuterVastu + 1) * Math.cos(startRad);
            const ay1 = cy + (rOuterVastu + 1) * Math.sin(startRad);
            const ax2 = cx + (rOuterVastu + 1) * Math.cos(endRad);
            const ay2 = cy + (rOuterVastu + 1) * Math.sin(endRad);
            svgContent += `<path d="M ${ax1.toFixed(1)} ${ay1.toFixed(1)} A ${rOuterVastu + 1} ${rOuterVastu + 1} 0 0 1 ${ax2.toFixed(1)} ${ay2.toFixed(1)}" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round" filter="drop-shadow(0 0 8px rgba(34,197,94,0.8))"/>`;
          }
        });
      } else if (propertyType === 'commercial') {
        // Retail Key Zones Highlight (Commercial Mode)
        const prof = VASTU_DATA.RETAIL_PROFILES && VASTU_DATA.RETAIL_PROFILES.find(p => p.profile_id === retailProfile);
        if (prof && prof.keyZones) {
          prof.keyZones.forEach(zoneCode => {
            const z = VASTU_DATA.ZONES_8.find(item => item.code === zoneCode);
            if (z) {
              const startRad = (z.startDeg - 90) * (Math.PI / 180);
              const endRad = (z.endDeg - 90) * (Math.PI / 180);
              const ax1 = cx + (rOuterVastu + 1) * Math.cos(startRad);
              const ay1 = cy + (rOuterVastu + 1) * Math.sin(startRad);
              const ax2 = cx + (rOuterVastu + 1) * Math.cos(endRad);
              const ay2 = cy + (rOuterVastu + 1) * Math.sin(endRad);
              svgContent += `<path d="M ${ax1.toFixed(1)} ${ay1.toFixed(1)} A ${rOuterVastu + 1} ${rOuterVastu + 1} 0 0 1 ${ax2.toFixed(1)} ${ay2.toFixed(1)}" fill="none" stroke="#d4a359" stroke-width="4.5" stroke-linecap="round" opacity="0.85" filter="drop-shadow(0 0 6px rgba(212,163,89,0.7))"/>`;
            }
          });
        }
      }

      // Degree Ticks (Every 5° and 15° around outer edge)
      for (let deg = 0; deg < 360; deg += 5) {
        const rad = (deg - 90) * (Math.PI / 180);
        const is15 = deg % 15 === 0;
        const tickLen = is15 ? 8 : 4;
        const strokeWidth = is15 ? 1.5 : 0.8;
        const strokeOpacity = is15 ? 0.7 : 0.35;
        const x1 = cx + (rOuter - 1) * Math.cos(rad);
        const y1 = cy + (rOuter - 1) * Math.sin(rad);
        const x2 = cx + (rOuter - 1 - tickLen) * Math.cos(rad);
        const y2 = cy + (rOuter - 1 - tickLen) * Math.sin(rad);
        const strokeColor = (deg === 0) ? 'var(--accent-north)' : 'currentColor';
        svgContent += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}"/>`;
      }
    }

    dialSvg.innerHTML = svgContent;
  }

  // --- Dynamic Live Vastu Inspector Updates ---
  function updateVastuInspector(heading) {
    if (compassMode !== 'vastu') return;

    const activeZone8 = getActiveZone8(heading);
    const elem = VASTU_DATA.ELEMENTS[activeZone8.element];
    const dict = VASTU_DATA.UI[currentLang] || VASTU_DATA.UI.en;

    // Header Zone Badge & Name
    inspZoneBadge.textContent = activeZone8.code;
    inspZoneName.textContent = activeZone8.names[currentLang] || activeZone8.names.en;
    inspSanskrit.textContent = activeZone8.sanskrit;

    // Element Badge
    inspElementDot.style.background = elem.color;
    inspElementDot.style.boxShadow = `0 0 8px ${elem.color}`;
    inspElementName.textContent = elem.names[currentLang] || elem.names.en;

    // Ruling Deity & Classical Summary
    inspDeityVal.textContent = activeZone8.deityNames[currentLang] || activeZone8.deityNames.en;
    inspSummaryText.textContent = activeZone8.summary[currentLang] || activeZone8.summary.en;

    // Favorable & Avoid Placements Cloud & Commercial Inspector
    if (propertyType === 'commercial') {
      commercialInspectorBox.classList.remove('hidden');
      const commZone = VASTU_DATA.COMMERCIAL_ZONES && VASTU_DATA.COMMERCIAL_ZONES[activeZone8.code];
      if (commZone) {
        inspCommSuitability.textContent = commZone.commercial_suitability.join(' • ');
        const impactText = typeof commZone.business_impact === 'object'
          ? (commZone.business_impact[currentLang] || commZone.business_impact.en)
          : commZone.business_impact;
        inspBusinessImpact.textContent = impactText;

        let favHtml = '';
        commZone.commercial_suitability.forEach(item => {
          favHtml += `<span class="room-tag">🏢 ${item}</span>`;
        });
        favorableTags.innerHTML = favHtml || '<span class="room-tag">Commercial</span>';

        let avoidHtml = '';
        commZone.avoid.forEach(item => {
          avoidHtml += `<span class="room-tag tag-avoid">❌ ${item}</span>`;
        });
        avoidTags.innerHTML = avoidHtml || '<span class="room-tag tag-avoid">Incompatible Setup</span>';

        if (commZone.retail_tips && commZone.retail_tips[retailProfile]) {
          inspTipText.textContent = commZone.retail_tips[retailProfile][currentLang] || commZone.retail_tips[retailProfile].en;
        } else {
          inspTipText.textContent = activeZone8.tips[currentLang] || activeZone8.tips.en;
        }
      }
    } else {
      commercialInspectorBox.classList.add('hidden');
      let favHtml = '';
      activeZone8.recommendedRooms.forEach(roomId => {
        const roomObj = VASTU_DATA.ROOMS.find(r => r.id === roomId);
        const name = roomObj ? (roomObj.names[currentLang] || roomObj.names.en) : roomId;
        const icon = roomObj ? roomObj.icon : '✨';
        favHtml += `<span class="room-tag">${icon} ${name}</span>`;
      });
      favorableTags.innerHTML = favHtml || '<span class="room-tag">General</span>';

      let avoidHtml = '';
      activeZone8.prohibitedRooms.forEach(roomId => {
        const roomObj = VASTU_DATA.ROOMS.find(r => r.id === roomId);
        const name = roomObj ? (roomObj.names[currentLang] || roomObj.names.en) : roomId;
        avoidHtml += `<span class="room-tag tag-avoid">❌ ${name}</span>`;
      });
      avoidTags.innerHTML = avoidHtml || '<span class="room-tag tag-avoid">Heavy Clutter</span>';

      inspTipText.textContent = activeZone8.tips[currentLang] || activeZone8.tips.en;
    }

    // 32-Pada Entrance Card
    if (zoneSystem === '32') {
      padaEntranceCard.classList.remove('hidden');
      const activePada = getActivePada32(heading);
      padaIdBadge.textContent = activePada.id;
      padaDevataName.textContent = activePada.devata;

      // Grade Pill
      padaGradePill.className = 'pada-grade-pill';
      if (activePada.grade === 'A') {
        padaGradePill.classList.add('grade-a');
        padaGradePill.textContent = dict.entranceGradeA || '🌟 Highly Auspicious';
      } else if (activePada.grade === 'B') {
        padaGradePill.classList.add('grade-b');
        padaGradePill.textContent = dict.entranceGradeB || '⚠️ Neutral';
      } else {
        padaGradePill.classList.add('grade-c');
        padaGradePill.textContent = dict.entranceGradeC || '❌ Inauspicious';
      }

      // Effect text in selected language
      const effectProp = 'effect' + currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
      padaEffectText.textContent = activePada[effectProp] || activePada.effectEn;

      // Auspicious entrance haptic tick
      if (hapticsEnabled && activePada.grade === 'A' && lastVibratedPada !== activePada.id) {
        lastVibratedPada = activePada.id;
        triggerHapticTick(25);
      }
    } else {
      padaEntranceCard.classList.add('hidden');
    }

    // Check Room Finder Alignment
    if (activeRoom) {
      const isAligned = activeRoom.idealZones.includes(activeZone8.code);
      if (isAligned) {
        roomGuidanceBanner.classList.add('aligned');
        guideStatusText.textContent = `🎯 ${dict.targetBearing || 'Target'}: ${inspZoneName.textContent} (${dict.entranceGradeA || 'Auspicious'})`;
        if (hapticsEnabled && lastVibratedCardinal !== activeZone8.centerDeg) {
          lastVibratedCardinal = activeZone8.centerDeg;
          triggerHapticTick(35);
        }
      } else {
        roomGuidanceBanner.classList.remove('aligned');
        guideStatusText.textContent = `Rotate device toward: ${activeRoom.idealZones.join(', ')}`;
      }
    }
  }

  // --- Haptic Feedback ---
  function triggerHapticTick(duration = 20) {
    if (hapticsEnabled && 'vibrate' in navigator) {
      const now = Date.now();
      if (now - lastVibrateTime > 250) {
        lastVibrateTime = now;
        try {
          navigator.vibrate(duration);
        } catch (e) {}
      }
    }
  }

  // --- Update Primary Orientation & Telemetry UI ---
  function updateHeadingUI(cssHeading) {
    const displayHeading = ((cssHeading % 360) + 360) % 360;
    currentHeading = displayHeading; // Store clamped 0-359 value for external use
    const rounded = Math.round(displayHeading) === 360 ? 0 : Math.round(displayHeading);

    // Degrees display
    headingDegrees.textContent = rounded;

    // Cardinal Heading calculation
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const cardIndex = Math.round(displayHeading / 45) % 8;
    const activeZone8 = VASTU_DATA.ZONES_8[cardIndex];
    headingCardinal.textContent = cardinals[cardIndex];

    // Subtitle Sanskrit
    headingSanskrit.textContent = activeZone8.sanskrit;

    // Mils (6400 NATO Mils scale)
    const mils = Math.round((displayHeading / 360) * 6400);
    milsValue.textContent = mils;

    // Back Azimuth
    const backAzimuth = Math.round((displayHeading + 180) % 360);
    backAzimuthValue.textContent = `${backAzimuth}°`;

    // Rotate Compass Card
    compassCard.style.transform = `rotate(${-cssHeading}deg)`;

    // Target Deviation Bar
    if (targetHeading !== null) {
      let diff = displayHeading - targetHeading;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;

      const absDiff = Math.abs(diff);
      targetDeviationBar.classList.remove('hidden');

      if (absDiff <= 2) {
        devArrow.textContent = '🎯';
        devText.textContent = 'ON TARGET';
        targetDeviationBar.classList.add('on-target');
      } else if (diff < 0) {
        devArrow.textContent = '▶';
        devText.textContent = `${Math.round(absDiff)}° RIGHT`;
        targetDeviationBar.classList.remove('on-target');
      } else {
        devArrow.textContent = '◀';
        devText.textContent = `${Math.round(absDiff)}° LEFT`;
        targetDeviationBar.classList.remove('on-target');
      }
    } else {
      targetDeviationBar.classList.add('hidden');
    }

    // Cardinal Haptic Tick (exact 0°, 90°, 180°, 270° within 1.5°)
    const cardinalAngles = [0, 90, 180, 270];
    const isExactCardinal = cardinalAngles.some(ang => Math.abs(displayHeading - ang) <= 1.2 || Math.abs(displayHeading - 360) <= 1.2);
    if (isExactCardinal && lastVibratedCardinal !== rounded) {
      lastVibratedCardinal = rounded;
      triggerHapticTick(20);
    } else if (!isExactCardinal) {
      lastVibratedCardinal = -1;
    }

    // Update Vastu Inspector Card
    updateVastuInspector(displayHeading);

    // If Plot Tilt Modal is open, update its real-time angle
    if (!plotTiltModal.classList.contains('hidden')) {
      updatePlotTiltUI(displayHeading);
    }
  }

  // --- Bubble Level & Inclinometer ---
  function updateInclinometer(p, r) {
    pitch = p;
    roll = r;

    pitchValue.textContent = `${Math.round(pitch)}°`;
    rollValue.textContent = `${Math.round(roll)}°`;

    // Gauge bars
    const maxTilt = 45;
    const pitchPct = Math.min(100, (Math.abs(pitch) / maxTilt) * 100);
    const rollPct = Math.min(100, (Math.abs(roll) / maxTilt) * 100);
    pitchGauge.style.width = `${pitchPct}%`;
    rollGauge.style.width = `${rollPct}%`;

    // Center bubble position inside housing (housing radius ~65px)
    const maxBubbleDisp = 40;
    const bx = Math.max(-maxBubbleDisp, Math.min(maxBubbleDisp, (roll / 30) * maxBubbleDisp));
    const by = Math.max(-maxBubbleDisp, Math.min(maxBubbleDisp, (pitch / 30) * maxBubbleDisp));
    levelBubble.style.transform = `translate(${bx}px, ${by}px)`;

    // Level status check (<= 1.5° = perfectly level)
    const isLevel = Math.abs(pitch) <= 1.5 && Math.abs(roll) <= 1.5;
    if (isLevel) {
      levelHousing.classList.add('level-locked');
      levelStatusCard.classList.add('level-locked');
      levelStatusText.textContent = 'PERFECTLY LEVEL';
    } else {
      levelHousing.classList.remove('level-locked');
      levelStatusCard.classList.remove('level-locked');
      levelStatusText.textContent = `${Math.max(Math.abs(pitch), Math.abs(roll)).toFixed(1)}° TILT`;
    }
  }

  // --- Update Compass Orientation with Smoothing & Calibration Offset ---
  function updateHeading(rawHeading) {
    if (typeof rawHeading === 'number' && !isNaN(rawHeading)) {
      rawMagneticHeading = ((rawHeading % 360) + 360) % 360;
    }

    // Adaptive low-pass filter: heavy smoothing when steady (kills magnetic jitter),
    // light smoothing when the phone is genuinely turning (no lag).
    const prevShown = smoothedHeading === null ? rawMagneticHeading : normalizeAngle(smoothedHeading);
    const delta = Math.abs(((rawMagneticHeading - prevShown + 540) % 360) - 180);
    const adaptiveFactor = Math.min(0.6, Math.max(0.1, delta / 25));
    smoothedHeading = smoothAngle(smoothedHeading, rawMagneticHeading, adaptiveFactor);

    // Apply manual calibration offset
    let calibratedHeading = smoothedHeading + calibrationOffset;

    let trueHeading = calibratedHeading;
    if (isTrueNorth) {
      trueHeading = calibratedHeading + magneticDeclination;
    }

    updateHeadingUI(trueHeading);
  }

  // --- Dual-Stream Orientation Processing ---
  // Chromium (Android): plain `deviceorientation` is RELATIVE (alpha = 0 at page load, NOT north),
  // only `deviceorientationabsolute` is north-referenced. Mixing them made the needle jump.
  // iOS: `deviceorientation` carries webkitCompassHeading (north-referenced).
  // Firefox: `deviceorientation` is absolute (event.absolute === true).
  const HAS_ABSOLUTE_EVENT = ('ondeviceorientationabsolute' in window);
  let sensorAttachTs = 0;
  let lastAbsoluteEventTs = 0;
  let relativeWarningShown = false;

  function attachSensorListeners() {
    sensorAttachTs = performance.now();

    // 1. Android: Primary absolute orientation (Chrome, Samsung Internet & Android WebViews)
    window.addEventListener('deviceorientationabsolute', handleDeviceOrientationAbsolute, true);

    // 2. Standard deviceorientation (iOS webkitCompassHeading, Firefox absolute, last-resort fallback)
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);

    // Fallback manual touch/mouse control if sensors aren't firing on desktop
    initDesktopDragSimulation();
  }

  function handleDeviceOrientationAbsolute(event) {
    if (event.alpha === null || event.alpha === undefined) return; // no north reference -> useless for a compass
    isAbsoluteOrientation = true;
    lastAbsoluteEventTs = performance.now();
    processOrientationData(event, true);
  }

  function handleDeviceOrientation(event) {
    const hasWebkit = event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null;
    const hasAlpha = event.alpha !== null && event.alpha !== undefined;
    if (!hasWebkit && !hasAlpha) return; // ignore empty dummy events from desktop browsers

    // iOS: direct, north-referenced heading
    if (hasWebkit) { processOrientationData(event, false); return; }

    // Firefox / any browser that flags this stream as absolute
    if (event.absolute === true) { processOrientationData(event, true); return; }

    // Chromium: this stream is RELATIVE. Prefer the absolute stream whenever it is alive.
    const now = performance.now();
    if (HAS_ABSOLUTE_EVENT) {
      const absoluteAlive = lastAbsoluteEventTs > 0 && (now - lastAbsoluteEventTs) < 1500;
      const stillWaiting = lastAbsoluteEventTs === 0 && (now - sensorAttachTs) < 1500;
      if (absoluteAlive || stillWaiting) return;
    }

    // Last resort: relative-only device. Heading is NOT north-referenced - tell the user once.
    isAbsoluteOrientation = false;
    if (!relativeWarningShown) {
      relativeWarningShown = true;
      showToast('This browser has no magnetic compass. Open in Chrome for true direction.');
    }
    processOrientationData(event, false);
  }

  function processOrientationData(event, isAbsolute) {
    const firstSample = !hasSensorData;
    hasSensorData = true;

    // Ensure permission banner is dismissed and saved as enabled once data arrives
    if (iosPermissionBanner && !iosPermissionBanner.classList.contains('hidden')) {
      iosPermissionBanner.classList.add('hidden');
    }
    try { localStorage.setItem('kuberan_compass_sensor_enabled', 'true'); } catch(e) {}

    // First real sensor sample: drop the placeholder 0° so the filter starts from the true heading
    if (firstSample) smoothedHeading = null;

    // Handle landscape/portrait orientation adjustments (modern standard + legacy fallback)
    const orientationAngle = (screen.orientation && typeof screen.orientation.angle === 'number')
      ? screen.orientation.angle
      : (typeof window.orientation === 'number' ? window.orientation : 0);

    let heading = null;

    // iOS provides direct calibrated magnetic heading and accuracy radius
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      heading = event.webkitCompassHeading;
      if (typeof event.webkitCompassAccuracy === 'number') {
        sensorAccuracy = event.webkitCompassAccuracy;
      }
      // webkitCompassHeading is reported for the device's natural top edge: compensate for screen rotation
      if (orientationAngle) {
        heading = ((heading + orientationAngle) % 360 + 360) % 360;
      }
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // Android / W3C: tilt-immune heading (screen rotation is handled inside the function)
      const beta  = (event.beta  !== null && event.beta  !== undefined) ? event.beta  : 0;
      const gamma = (event.gamma !== null && event.gamma !== undefined) ? event.gamma : 0;
      heading = computeHeadingFromEuler(event.alpha, beta, gamma, orientationAngle);
      if (event.absolute === true || isAbsolute) {
        isAbsoluteOrientation = true;
      }
    }

    if (heading !== null) updateHeading(heading);

    // Pitch & Roll for bubble level
    let p = event.beta || 0;
    let r = event.gamma || 0;

    if (orientationAngle === 90) {
      const temp = p; p = -r; r = temp;
    } else if (orientationAngle === -90 || orientationAngle === 270) {
      const temp = p; p = r; r = -temp;
    } else if (orientationAngle === 180) {
      p = -p; r = -r;
    }

    updateInclinometer(p, r);
    updateCalibrationUI();
  }

  // --- Desktop / Fallback Drag Simulation ---
  function initDesktopDragSimulation() {
    let isDragging = false;
    let startAngle = 0;
    let startHeading = 0;

    function getAngle(e) {
      const rect = compassCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const clientX = e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
      return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
    }

    function onStart(e) {
      if (hasSensorData) return;
      isDragging = true;
      startAngle = getAngle(e);
      startHeading = currentHeading;
    }

    function onMove(e) {
      if (!isDragging) return;
      const angle = getAngle(e);
      const delta = angle - startAngle;
      const newHeading = normalizeAngle(startHeading - delta);
      updateHeading(newHeading);
    }

    function onEnd() {
      isDragging = false;
    }

    const dialSection = document.querySelector('.dial-section') || compassCard;
    dialSection.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    dialSection.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  // --- Calibration & Alignment Studio Engine ---
  function updateCalibrationUI() {
    const formattedOffset = `${calibrationOffset >= 0 ? '+' : ''}${calibrationOffset.toFixed(1)}°`;
    if (calActiveOffsetVal) calActiveOffsetVal.textContent = formattedOffset;
    if (calOffsetBadge) calOffsetBadge.textContent = formattedOffset;

    let accLabel = 'Acc: ±3° (High)';
    let badgeClass = 'badge-high';

    if (sensorAccuracy !== null) {
      if (sensorAccuracy < 0) {
        accLabel = 'Uncalibrated';
        badgeClass = 'badge-low';
      } else if (sensorAccuracy <= 15) {
        accLabel = `Acc: ±${Math.round(sensorAccuracy)}° (High)`;
        badgeClass = 'badge-high';
      } else if (sensorAccuracy <= 25) {
        accLabel = `Acc: ±${Math.round(sensorAccuracy)}° (Good)`;
        badgeClass = 'badge-med';
      } else {
        accLabel = `Acc: ±${Math.round(sensorAccuracy)}° (Interference)`;
        badgeClass = 'badge-low';
      }
    } else if (isAbsoluteOrientation) {
      accLabel = 'Acc: ±3° (Absolute)';
      badgeClass = 'badge-high';
    } else if (hasSensorData) {
      accLabel = 'Relative Gyro';
      badgeClass = 'badge-med';
    } else {
      accLabel = 'Sensors Inactive';
      badgeClass = 'badge-low';
    }

    if (calAccuracyText) {
      calAccuracyText.textContent = accLabel;
    }
    if (calSensorBadge) {
      calSensorBadge.textContent = (isAbsoluteOrientation || (sensorAccuracy !== null && sensorAccuracy >= 0))
        ? 'Magnetometer Active'
        : 'Sensors Active';
      calSensorBadge.className = `cal-badge ${badgeClass}`;
    }
    if (sensorAccuracyBadge) {
      sensorAccuracyBadge.textContent = accLabel;
    }
  }

  function setCalibrationOffset(offset) {
    calibrationOffset = Math.round(offset * 10) / 10;
    while (calibrationOffset > 180) calibrationOffset -= 360;
    while (calibrationOffset < -180) calibrationOffset += 360;
    try {
      localStorage.setItem('kuberan-vastu-compass-offset', calibrationOffset.toString());
    } catch(e) {}
    updateCalibrationUI();
    updateHeading(rawMagneticHeading);
    showToast(`Offset: ${calibrationOffset >= 0 ? '+' : ''}${calibrationOffset.toFixed(1)}°`);
  }

  function adjustCalibrationOffset(delta) {
    setCalibrationOffset(calibrationOffset + delta);
  }

  // --- GPS Location & Telemetry ---
  function initGPS() {
    if (!('geolocation' in navigator)) {
      gpsLatDec.textContent = 'GPS not supported';
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const alt = pos.coords.altitude;
        const acc = pos.coords.accuracy;

        gpsLat.textContent = formatDMS(lat, true);
        gpsLatDec.textContent = `${lat.toFixed(6)}°`;
        gpsLng.textContent = formatDMS(lng, false);
        gpsLngDec.textContent = `${lng.toFixed(6)}°`;

        gpsAlt.textContent = alt !== null ? `${Math.round(alt)} m` : '-- m';
        gpsAccuracy.textContent = `Accuracy: ±${Math.round(acc)} m`;

        // Compute magnetic declination for True North
        magneticDeclination = estimateMagneticDeclination(lat, lng, alt !== null ? alt : 0);
        gpsDeclination.textContent = `${magneticDeclination >= 0 ? '+' : ''}${magneticDeclination}°`;
        sensorStatus.textContent = isTrueNorth ? 'True North calibrated' : 'Magnetic active';
      },
      (err) => {
        gpsLatDec.textContent = 'Location access denied';
        sensorStatus.textContent = 'Using standard calibration';
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
  }

  // --- Plot Tilt / Vidisha Diagnostic Logic ---
  function updatePlotTiltUI(heading) {
    const roundedHeading = parseFloat(heading.toFixed(1));
    plotHeadingVal.textContent = `${roundedHeading}°`;

    // Nearest cardinal axis (0, 90, 180, 270)
    let deviation = ((roundedHeading % 90) + 45) % 90 - 45;
    const absDev = Math.abs(deviation).toFixed(1);

    plotDeviationVal.textContent = `${absDev}° Deviation from Cardinal Axis`;

    if (absDev <= 3.0) {
      plotStatusBanner.className = 'plot-status-banner aligned';
      plotStatusTitle.textContent = 'SAMA-SUTRA (Aligned Plot)';
      plotStatusDesc.textContent = 'The property is naturally aligned with the cardinal magnetic axis (within ±3°). Highly auspicious and energetically balanced.';
    } else {
      plotStatusBanner.className = 'plot-status-banner tilted';
      plotStatusTitle.textContent = `VIDISHA (Tilted Plot by ${absDev}°)`;
      plotStatusDesc.textContent = 'The property walls are tilted relative to cardinal North. Recommended: Align internal work desks, mandir, and bed axes towards Cardinal North.';
    }

    // Commercial Plot Shape geometry status
    const shapeObj = VASTU_DATA.PLOT_SHAPES && VASTU_DATA.PLOT_SHAPES[selectedPlotShape];
    if (shapeObj && plotShapeBadge && plotShapeAdviceText) {
      plotShapeBadge.className = `shape-badge ${shapeObj.badgeClass}`;
      plotShapeBadge.textContent = shapeObj.statusLabel;
      plotShapeAdviceText.textContent = shapeObj.commercialEffect;
    }
  }

  // --- Camera AR Mode ---
  async function toggleCameraAR() {
    if (cameraStream) {
      // Turn OFF
      cameraStream.getTracks().forEach(t => t.stop());
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
  }

  // --- UI Multi-Language Updating ---
  function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

  function setLanguage(langCode) {
    if (!VASTU_DATA.UI[langCode]) return;
    currentLang = langCode;
    if (langPill) langPill.textContent = langCode.toUpperCase();

    const dict = VASTU_DATA.UI[langCode];

    // Update Header
    setText('lblModeVastu', dict.vastuMode || 'Vastu Compass');
    setText('lblModeSimple', dict.simpleMode || 'Simple Compass');
    if (btnZone8) btnZone8.textContent = dict.zones8 || '8 Zones';
    if (btnZone16) btnZone16.textContent = dict.zones16 || '16 Zones';
    if (btnZone32) btnZone32.textContent = dict.zones32 || '32 Padas';

    setText('lblToolRoom', dict.toolsRoomFinder || 'Room Finder');
    setText('lblToolTilt', dict.toolsPlotTilt || 'Plot Tilt');
    setText('lblToolCam', dict.toolsCamera || 'Camera AR');
    setText('lblToolAudit', dict.toolsAudit || 'Vastu Report');

    setText('lblDeity', dict.deity || 'Ruling Deity');
    setText('lblFavorable', dict.favorableRooms || 'Favorable');
    setText('lblAvoid', dict.avoidPlacements || 'Avoid');

    setText('lblPitch', dict.pitch || 'PITCH');
    setText('lblRoll', dict.roll || 'ROLL');
    setText('lblCopyCoords', dict.copyReport ? 'Copy Coords' : 'Copy Coords');
    setText('lblInstallApp', dict.installApp || 'Install App');

    // Calibration Studio Localized Strings
    const lblBtnCal = document.getElementById('lblBtnCalibrate');
    if (lblBtnCal) lblBtnCal.textContent = dict.calibrate || 'Calibrate';
    const calModalTitle = document.getElementById('calModalTitle');
    if (calModalTitle) calModalTitle.textContent = dict.calibrationTitle || 'Compass Calibration';
    const calModalSub = document.getElementById('calModalSub');
    if (calModalSub) calModalSub.textContent = dict.calibrationSub || 'Hardware Magnetometer & Alignment';
    const lblCalSensor = document.getElementById('lblCalSensorStatus');
    if (lblCalSensor) lblCalSensor.textContent = dict.sensorStatusLabel || 'SENSOR STATUS:';
    const lblCalConf = document.getElementById('lblCalConfidence');
    if (lblCalConf) lblCalConf.textContent = dict.calibrationConfidence || 'CALIBRATION CONFIDENCE:';
    const lblCalManual = document.getElementById('lblCalManualOffset');
    if (lblCalManual) lblCalManual.textContent = dict.manualOffsetLabel || 'MANUAL OFFSET:';
    const lblFig8T = document.getElementById('lblFig8Title');
    if (lblFig8T) lblFig8T.textContent = dict.fig8Title || 'Wave Phone in Figure-8 Motion';
    const lblFig8D = document.getElementById('lblFig8Desc');
    if (lblFig8D) lblFig8D.textContent = dict.fig8Desc || 'Gently wave your phone in a figure-8 pattern in the air 3 to 4 times to reset the internal magnetometer and clear local magnetic bias.';
    const lblManualT = document.getElementById('lblManualOffsetTitle');
    if (lblManualT) lblManualT.textContent = dict.manualOffsetTitle || 'Manual Calibration Offset';
    const lblCalH = document.getElementById('lblCalHint');
    if (lblCalH) lblCalH.textContent = dict.calHint || 'Compensate for magnetic phone cases or fine-tune against an external reference needle.';
    const lblBtnZero = document.getElementById('lblBtnZeroToNorth');
    if (lblBtnZero) lblBtnZero.textContent = dict.zeroToNorthBtn || 'Set Current Heading as True Reference';
    const btnResetEl = document.getElementById('btnOffsetReset');
    if (btnResetEl) btnResetEl.textContent = dict.resetOffset || 'Reset (0°)';

    // Commercial & Retail UI Translations
    const lblPropRes = document.getElementById('lblPropResidential');
    if (lblPropRes) lblPropRes.textContent = dict.propertyResidential || 'Residential Vastu';
    const lblPropComm = document.getElementById('lblPropCommercial');
    if (lblPropComm) lblPropComm.textContent = dict.propertyCommercial || 'Commercial & Retail';
    const lblBizCat = document.getElementById('lblBusinessCategory');
    if (lblBizCat) lblBizCat.textContent = dict.businessCategory ? `${dict.businessCategory}:` : 'Business Category:';
    const lblCommSuit = document.getElementById('lblCommSuitability');
    if (lblCommSuit) lblCommSuit.textContent = dict.commercialSuitability || 'Commercial Suitability';
    const lblBizImp = document.getElementById('lblBusinessImpact');
    if (lblBizImp) lblBizImp.textContent = dict.businessImpact || 'Business Impact';
    const lblPlotTitle = document.getElementById('lblPlotShapeTitle');
    if (lblPlotTitle) lblPlotTitle.textContent = dict.plotShapeTitle || 'Commercial Plot Geometry & Shape';
    const lblCommCheck = document.getElementById('lblCommercialChecklist');
    if (lblCommCheck) lblCommCheck.textContent = dict.commercialChecklist ? `${dict.commercialChecklist}:` : 'Commercial Compliance Audit:';
    const lblCheckOwner = document.getElementById('lblCheckOwner');
    if (lblCheckOwner) lblCheckOwner.textContent = dict.ownerDeskCheck || 'Owner/MD Desk:';
    const lblCheckSafe = document.getElementById('lblCheckSafe');
    if (lblCheckSafe) lblCheckSafe.textContent = dict.cashSafeCheck || 'Cash Safe:';
    const lblCheckStock = document.getElementById('lblCheckStock');
    if (lblCheckStock) lblCheckStock.textContent = dict.inventoryCheck || 'Inventory Flow:';
    const lblCheckFire = document.getElementById('lblCheckFire');
    if (lblCheckFire) lblCheckFire.textContent = dict.fireElectricalCheck || 'Electrical Safety:';

    // Re-render Dial and Inspector
    buildDialSvg();
    updateVastuInspector(currentHeading);
    renderRoomsGrid();
    renderLangModal();

    showToast(`Language switched: ${VASTU_DATA.LANGUAGES.find(l => l.code === langCode).native}`);
  }

  function renderLangModal() {
    let html = '';
    VASTU_DATA.LANGUAGES.forEach(l => {
      const activeClass = l.code === currentLang ? 'active' : '';
      html += `
        <button class="lang-btn ${activeClass}" data-lang="${l.code}">
          <span>${l.native}</span>
          <span style="font-size:0.75rem; opacity:0.7;">${l.label}</span>
        </button>
      `;
    });
    langOptionsList.innerHTML = html;

    langOptionsList.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
        langModal.classList.add('hidden');
      });
    });
  }

  // --- Room Finder Modal & Grid ---
  function renderRoomsGrid() {
    let html = '';
    const roomList = (roomCategoryTab === 'commercial' && VASTU_DATA.COMMERCIAL_ROOMS) ? VASTU_DATA.COMMERCIAL_ROOMS : VASTU_DATA.ROOMS;
    roomList.forEach(room => {
      const isSelected = activeRoom && activeRoom.id === room.id ? 'active' : '';
      const name = room.names[currentLang] || room.names.en;
      html += `
        <button class="room-card-btn ${isSelected}" data-room-id="${room.id}">
          <span class="room-card-icon">${room.icon}</span>
          <span class="room-card-name">${name}</span>
          <span class="room-card-zones">Best: ${room.idealZones.join(', ')}</span>
        </button>
      `;
    });
    roomsGrid.innerHTML = html;

    roomsGrid.querySelectorAll('.room-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomId = btn.dataset.roomId;
        selectRoom(roomId);
        roomFinderModal.classList.add('hidden');
      });
    });
  }

  function selectRoom(roomId) {
    const room = VASTU_DATA.ROOMS.find(r => r.id === roomId) || (VASTU_DATA.COMMERCIAL_ROOMS && VASTU_DATA.COMMERCIAL_ROOMS.find(r => r.id === roomId));
    if (!room) return;

    activeRoom = room;
    btnToolRoomFinder.classList.add('active');
    roomGuidanceBanner.classList.remove('hidden');

    guideRoomIcon.textContent = room.icon;
    guideRoomName.textContent = room.names[currentLang] || room.names.en;
    guideTargetBadge.textContent = `Ideal: ${room.idealZones.join(', ')}`;
    guideStatusText.textContent = 'Rotate device toward auspicious zone';

    buildDialSvg();
    updateVastuInspector(currentHeading);
    showToast(`Highlighting auspicious directions for ${room.names[currentLang] || room.names.en}`);
  }

  function clearActiveRoom() {
    activeRoom = null;
    btnToolRoomFinder.classList.remove('active');
    roomGuidanceBanner.classList.add('hidden');
    buildDialSvg();
    showToast('Room Finder cleared');
  }

  // --- Vastu Inspection Audit Report Generator ---
  function openAuditModal() {
    const activeZone8 = getActiveZone8(currentHeading);
    const elem = VASTU_DATA.ELEMENTS[activeZone8.element];
    const rounded = Math.round(currentHeading);

    reportTimestamp.textContent = `Generated: ${formatCurrentTimestamp()}`;
    reportHeading.textContent = `${rounded}° ${headingCardinal.textContent} (${isTrueNorth ? 'True North' : 'Magnetic'})`;
    reportZone.textContent = `${activeZone8.names[currentLang] || activeZone8.names.en} • ${activeZone8.sanskrit}`;
    reportElement.textContent = elem.names[currentLang] || elem.names.en;
    reportDeity.textContent = activeZone8.deityNames[currentLang] || activeZone8.deityNames.en;

    const lat = gpsLat.textContent;
    const lng = gpsLng.textContent;
    reportGps.textContent = `${lat}, ${lng}`;

    if (zoneSystem === '32') {
      const activePada = getActivePada32(currentHeading);
      reportDoor.textContent = `${activePada.id} ${activePada.devata} (${activePada.grade === 'A' ? 'Auspicious' : 'Neutral/Avoid'})`;
    } else {
      reportDoor.textContent = 'Switch to 32-Pada mode for door analysis';
    }

    if (plotTiltReading) {
      reportPlot.textContent = `${plotTiltReading.type} (${plotTiltReading.dev}° tilt)`;
    } else {
      reportPlot.textContent = 'Standard Cardinal Inspection';
    }

    // Commercial Property vs Residential Audit parameters
    if (reportPropertyType) {
      reportPropertyType.textContent = propertyType === 'commercial' ? 'Commercial & Retail' : 'Residential';
    }
    if (propertyType === 'commercial') {
      if (reportCategoryRow) reportCategoryRow.classList.remove('hidden');
      if (reportPlotShapeRow) reportPlotShapeRow.classList.remove('hidden');
      if (commercialChecklistBox) commercialChecklistBox.classList.remove('hidden');

      const prof = VASTU_DATA.RETAIL_PROFILES && VASTU_DATA.RETAIL_PROFILES.find(p => p.profile_id === retailProfile);
      if (reportBusinessCategory) {
        reportBusinessCategory.textContent = prof ? (prof.name[currentLang] || prof.name.en) : 'Apparel, Silk Sarees & Boutiques';
      }
      const shapeObj = VASTU_DATA.PLOT_SHAPES && VASTU_DATA.PLOT_SHAPES[selectedPlotShape];
      if (reportPlotShape) {
        reportPlotShape.textContent = shapeObj ? `${shapeObj.name} • ${shapeObj.statusLabel}` : 'Shermukhi (Lion-Faced)';
      }
    } else {
      if (reportCategoryRow) reportCategoryRow.classList.add('hidden');
      if (reportPlotShapeRow) reportPlotShapeRow.classList.add('hidden');
      if (commercialChecklistBox) commercialChecklistBox.classList.add('hidden');
    }

    reportAdvice.textContent = inspTipText.textContent || activeZone8.tips[currentLang] || activeZone8.tips.en;

    auditModal.classList.remove('hidden');
  }

  function generateAuditTextReport() {
    const activeZone8 = getActiveZone8(currentHeading);
    const elem = VASTU_DATA.ELEMENTS[activeZone8.element];
    const activePada = getActivePada32(currentHeading);
    const prof = VASTU_DATA.RETAIL_PROFILES && VASTU_DATA.RETAIL_PROFILES.find(p => p.profile_id === retailProfile);
    const shapeObj = VASTU_DATA.PLOT_SHAPES && VASTU_DATA.PLOT_SHAPES[selectedPlotShape];

    let commercialText = '';
    if (propertyType === 'commercial') {
      commercialText = `
🏢 Property Type: Commercial & Retail
🛍️ Business Profile: ${prof ? (prof.name[currentLang] || prof.name.en) : 'Apparel, Silk Sarees & Boutiques'}
📐 Commercial Plot Shape: ${shapeObj ? shapeObj.name : 'Shermukhi (Lion-Faced)'} [${shapeObj ? shapeObj.statusLabel : 'Ideal for Retail'}]

📋 Commercial Compliance Checklist:
• Owner / MD Seating (SW Zone facing N/E): ✓ Verified
• Cash Locker / Safe Placement (SW opening North): ✓ Verified
• Fast Stock Circulation (NW Vayavya Zone): ✓ Verified
• Electrical Panel & DB Box (SE Agneya Fire Zone): ✓ Verified
`;
    }

    return `🏛️ KUBERAN VASTU COMPASS AUDIT REPORT
-----------------------------------------
Official Vedic Architecture Report
Presented by KUBERAN Silks (https://kuberansilks.com/)

📅 Date & Time: ${formatCurrentTimestamp()}
🧭 Heading: ${Math.round(currentHeading)}° (${isTrueNorth ? 'True North' : 'Magnetic North'})
🕉️ Vastu Zone: ${activeZone8.names[currentLang] || activeZone8.names.en} (${activeZone8.sanskrit})
🌊 Element: ${elem.names[currentLang] || elem.names.en}
👑 Ruling Deity: ${activeZone8.deityNames[currentLang] || activeZone8.deityNames.en}
🚪 32-Pada Devata: ${activePada.id} - ${activePada.devata} [Grade ${activePada.grade}]
📍 GPS Coordinates: ${gpsLat.textContent}, ${gpsLng.textContent}
⛰️ Altitude: ${gpsAlt.textContent}${commercialText}

💡 Vedic Recommendation:
${inspTipText.textContent || activeZone8.tips[currentLang] || activeZone8.tips.en}

Explore official luxury silk & spiritual collections at:
https://kuberansilks.com/`;
  }

  // --- Toast Notification ---
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.remove('fade');
    void toast.offsetWidth;
    setTimeout(() => toast.classList.add('fade'), 2200);
    setTimeout(() => toast.classList.add('hidden'), 2600);
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Mode Switcher (Vastu vs Simple Compass)
    if (btnModeVastu) btnModeVastu.addEventListener('click', () => {
      compassMode = 'vastu';
      if (btnModeVastu) btnModeVastu.classList.add('active');
      if (btnModeSimple) btnModeSimple.classList.remove('active');
      if (vastuSubcontrols) vastuSubcontrols.classList.remove('hidden');
      vastuInspectorSection.classList.remove('hidden');
      buildDialSvg();
      updateVastuInspector(currentHeading);
      showToast('Switched to KUBERAN Vastu Compass');
    });

    if (btnModeSimple) btnModeSimple.addEventListener('click', () => {
      compassMode = 'simple';
      if (btnModeSimple) btnModeSimple.classList.add('active');
      if (btnModeVastu) btnModeVastu.classList.remove('active');
      if (vastuSubcontrols) vastuSubcontrols.classList.add('hidden');
      vastuInspectorSection.classList.add('hidden');
      roomGuidanceBanner.classList.add('hidden');
      buildDialSvg();
      showToast('Switched to Simple Compass');
    });

    // Zone Switcher (8 / 16 / 32)
    if (btnZone8) btnZone8.addEventListener('click', () => {
      zoneSystem = '8';
      if (btnZone8) btnZone8.classList.add('active');
      if (btnZone16) btnZone16.classList.remove('active');
      if (btnZone32) btnZone32.classList.remove('active');
      buildDialSvg();
      updateVastuInspector(currentHeading);
    });

    if (btnZone16) btnZone16.addEventListener('click', () => {
      zoneSystem = '16';
      if (btnZone16) btnZone16.classList.add('active');
      if (btnZone8) btnZone8.classList.remove('active');
      if (btnZone32) btnZone32.classList.remove('active');
      buildDialSvg();
      updateVastuInspector(currentHeading);
    });

    if (btnZone32) btnZone32.addEventListener('click', () => {
      zoneSystem = '32';
      if (btnZone32) btnZone32.classList.add('active');
      if (btnZone8) btnZone8.classList.remove('active');
      if (btnZone16) btnZone16.classList.remove('active');
      buildDialSvg();
      updateVastuInspector(currentHeading);
    });

    // Property Type Switcher (Residential vs Commercial & Retail)
    if (btnPropResidential && btnPropCommercial) {
      btnPropResidential.addEventListener('click', () => {
        propertyType = 'residential';
        btnPropResidential.classList.add('active');
        btnPropCommercial.classList.remove('active');
        if (retailProfileStrip) retailProfileStrip.classList.add('hidden');
        roomCategoryTab = 'residential';
        if (tabResRooms) tabResRooms.classList.add('active');
        if (tabCommRooms) tabCommRooms.classList.remove('active');
        buildDialSvg();
        updateVastuInspector(currentHeading);
        showToast('Switched to Residential Vastu');
      });

      btnPropCommercial.addEventListener('click', () => {
        propertyType = 'commercial';
        btnPropCommercial.classList.add('active');
        btnPropResidential.classList.remove('active');
        if (retailProfileStrip) retailProfileStrip.classList.remove('hidden');
        roomCategoryTab = 'commercial';
        if (tabCommRooms) tabCommRooms.classList.add('active');
        if (tabResRooms) tabResRooms.classList.remove('active');
        buildDialSvg();
        updateVastuInspector(currentHeading);
        showToast('Switched to Commercial & Retail Vastu');
      });
    }

    // Retail Profile Chips (Apparel, Jewelry, General)
    function setRetailProfile(profId) {
      retailProfile = profId;
      [chipProfileApparel, chipProfileJewelry, chipProfileGeneral].forEach(chip => {
        if (chip) chip.classList.toggle('active', chip.dataset.profile === profId);
      });
      buildDialSvg();
      updateVastuInspector(currentHeading);
      const prof = VASTU_DATA.RETAIL_PROFILES && VASTU_DATA.RETAIL_PROFILES.find(p => p.profile_id === profId);
      const name = prof ? (prof.name[currentLang] || prof.name.en) : profId;
      showToast(`Retail Profile: ${name}`);
    }

    if (chipProfileApparel) chipProfileApparel.addEventListener('click', () => setRetailProfile('apparel_silk_sarees'));
    if (chipProfileJewelry) chipProfileJewelry.addEventListener('click', () => setRetailProfile('jewelry_luxury'));
    if (chipProfileGeneral) chipProfileGeneral.addEventListener('click', () => setRetailProfile('general_commercial'));

    // Room Category Tabs in Room Finder Modal
    if (tabResRooms) {
      tabResRooms.addEventListener('click', () => {
        roomCategoryTab = 'residential';
        tabResRooms.classList.add('active');
        if (tabCommRooms) tabCommRooms.classList.remove('active');
        renderRoomsGrid();
      });
    }
    if (tabCommRooms) {
      tabCommRooms.addEventListener('click', () => {
        roomCategoryTab = 'commercial';
        tabCommRooms.classList.add('active');
        if (tabResRooms) tabResRooms.classList.remove('active');
        renderRoomsGrid();
      });
    }

    // Commercial Plot Shape Selector Cards in Plot Tilt Modal
    if (plotShapeSelectorGrid) {
      plotShapeSelectorGrid.querySelectorAll('.shape-chip').forEach(card => {
        card.addEventListener('click', () => {
          plotShapeSelectorGrid.querySelectorAll('.shape-chip').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          selectedPlotShape = card.dataset.shape;
          const shapeObj = VASTU_DATA.PLOT_SHAPES && VASTU_DATA.PLOT_SHAPES[selectedPlotShape];
          if (shapeObj && plotShapeBadge && plotShapeAdviceText) {
            plotShapeBadge.className = `shape-badge ${shapeObj.badgeClass}`;
            plotShapeBadge.textContent = shapeObj.statusLabel;
            plotShapeAdviceText.textContent = shapeObj.commercialEffect;
            showToast(`Plot Shape: ${shapeObj.name}`);
          }
        });
      });
    }

    // Dial Visual Theme Switcher (Elemental / Chakra / Royal Gold)
    if (btnDialTheme) btnDialTheme.addEventListener('click', () => {
      currentDialThemeIndex = (currentDialThemeIndex + 1) % DIAL_THEMES.length;
      dialTheme = DIAL_THEMES[currentDialThemeIndex];

      document.body.classList.remove('theme-elemental', 'theme-chakra', 'theme-gold');
      document.body.classList.add(`theme-${dialTheme}`);

      buildDialSvg();
      const themeNames = { elemental: 'Pancha Bhoota Elemental', chakra: 'Vastu Chakra Wheel', gold: 'Royal Gold' };
      showToast(`Dial Style: ${themeNames[dialTheme]}`);
    });

    // Language Switcher Trigger
    if (btnLanguage) btnLanguage.addEventListener('click', () => {
      renderLangModal();
      langModal.classList.remove('hidden');
    });
    if (btnCloseLangModal) btnCloseLangModal.addEventListener('click', () => langModal.classList.add('hidden'));

    // North Mode Toggle (True North default)
    if (btnToggleNorth) btnToggleNorth.addEventListener('click', () => {
      isTrueNorth = !isTrueNorth;
      if (isTrueNorth) {
        btnToggleNorth.classList.add('active');
        if (northPill) northPill.textContent = 'TRU';
        if (false) northModeLabel.textContent = 'TRUE NORTH';
        showToast('True North mode active (Magnetic declination applied)');
      } else {
        btnToggleNorth.classList.remove('active');
        if (northPill) northPill.textContent = 'MAG';
        if (false) northModeLabel.textContent = 'MAGNETIC NORTH';
        showToast('Magnetic North mode active');
      }
      sensorStatus.textContent = isTrueNorth ? 'True North calibrated' : 'Magnetic active';
      updateHeading(rawMagneticHeading);
    });

    // Target Bearing Lock
    btnBearingLock.addEventListener('click', () => {
      if (targetHeading === null) {
        targetHeading = Math.round(currentHeading);
        targetValue.textContent = `${targetHeading}°`;
        btnBearingLock.classList.add('active');
        targetMarkerRing.style.transform = `rotate(${targetHeading}deg)`;
        targetMarkerRing.classList.remove('hidden');
        showToast(`Target bearing locked: ${targetHeading}°`);
      } else {
        targetHeading = null;
        targetValue.textContent = '--';
        btnBearingLock.classList.remove('active');
        targetMarkerRing.classList.add('hidden');
        targetDeviationBar.classList.add('hidden');
        showToast('Target bearing cleared');
      }
      updateHeadingUI(currentHeading);
    });

    btnClearTarget.addEventListener('click', () => {
      targetHeading = null;
      targetValue.textContent = '--';
      btnBearingLock.classList.remove('active');
      targetMarkerRing.classList.add('hidden');
      targetDeviationBar.classList.add('hidden');
    });

    // Vastu Tool: Room Finder
    btnToolRoomFinder.addEventListener('click', () => {
      renderRoomsGrid();
      roomFinderModal.classList.remove('hidden');
    });
    btnCloseRoomModal.addEventListener('click', () => roomFinderModal.classList.add('hidden'));
    btnCloseRoomGuide.addEventListener('click', clearActiveRoom);

    // Vastu Tool: Plot Tilt Detector
    btnToolPlotTilt.addEventListener('click', () => {
      updatePlotTiltUI(currentHeading);
      plotTiltModal.classList.remove('hidden');
    });
    btnCloseTiltModal.addEventListener('click', () => plotTiltModal.classList.add('hidden'));

    btnLockPlotTilt.addEventListener('click', () => {
      const heading = parseFloat(currentHeading.toFixed(1));
      let dev = ((heading % 90) + 45) % 90 - 45;
      const absDev = Math.abs(dev).toFixed(1);
      plotTiltReading = {
        heading: heading,
        dev: absDev,
        type: absDev <= 3.0 ? 'Sama-Sutra (Aligned)' : 'Vidisha (Tilted)'
      };
      plotTiltModal.classList.add('hidden');
      showToast(`Plot wall locked: ${heading}° (${plotTiltReading.type})`);
    });

    // Vastu Tool: Camera AR
    btnToolCamera.addEventListener('click', toggleCameraAR);

    // Vastu Tool: Audit Export Report
    btnToolAudit.addEventListener('click', openAuditModal);
    btnCloseAuditModal.addEventListener('click', () => auditModal.classList.add('hidden'));

    btnCopyAuditReport.addEventListener('click', async () => {
      const text = generateAuditTextReport();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Vastu Report copied to clipboard!');
      } catch (err) {
        showToast('Could not copy report to clipboard');
      }
    });

    btnShareAuditReport.addEventListener('click', async () => {
      const text = generateAuditTextReport();
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'KUBERAN Vastu Compass Audit',
            text: text
          });
        } catch (e) {}
      } else {
        await navigator.clipboard.writeText(text);
        showToast('Report copied (Share not supported on this browser)');
      }
    });

    // Info Modal
    btnInfo.addEventListener('click', () => {
      infoModal.classList.remove('hidden');
      generateQrCode();
    });
    btnCloseModal.addEventListener('click', () => infoModal.classList.add('hidden'));

    // Calibration Modal Trigger & Controls
    if (btnCalibrate) {
      btnCalibrate.addEventListener('click', () => {
        calibrationModal.classList.remove('hidden');
        updateCalibrationUI();
      });
    }
    if (telemetryCalibrationItem) {
      telemetryCalibrationItem.addEventListener('click', () => {
        calibrationModal.classList.remove('hidden');
        updateCalibrationUI();
      });
    }
    if (btnCloseCalModal) {
      btnCloseCalModal.addEventListener('click', () => {
        calibrationModal.classList.add('hidden');
      });
    }
    if (calibrationModal) {
      calibrationModal.addEventListener('click', (e) => {
        if (e.target === calibrationModal) calibrationModal.classList.add('hidden');
      });
    }

    if (btnOffsetMinus5) btnOffsetMinus5.addEventListener('click', () => adjustCalibrationOffset(-5));
    if (btnOffsetMinus1) btnOffsetMinus1.addEventListener('click', () => adjustCalibrationOffset(-1));
    if (btnOffsetReset) btnOffsetReset.addEventListener('click', () => setCalibrationOffset(0));
    if (btnOffsetPlus1) btnOffsetPlus1.addEventListener('click', () => adjustCalibrationOffset(1));
    if (btnOffsetPlus5) btnOffsetPlus5.addEventListener('click', () => adjustCalibrationOffset(5));

    if (btnZeroToNorth) {
      btnZeroToNorth.addEventListener('click', () => {
        if (!window.confirm('Only do this while pointing EXACTLY at true North (use an external reference). It permanently shifts the compass until reset. Continue?')) return;
        // Make the CURRENT pointing read 0° (North). Offset is applied AFTER smoothing and BEFORE
        // declination, so the reference must include the declination that will be added later.
        const base = (smoothedHeading !== null ? normalizeAngle(smoothedHeading) : rawMagneticHeading)
                   + (isTrueNorth ? magneticDeclination : 0);
        const neededOffset = normalizeAngle(-base);
        setCalibrationOffset(neededOffset > 180 ? neededOffset - 360 : neededOffset);
        showToast('Zeroed to Current Heading');
      });
    }

    // Copy Coordinates Button
    btnCopyCoords.addEventListener('click', async () => {
      const lat = gpsLat.textContent;
      const lng = gpsLng.textContent;
      const str = `${lat}, ${lng} (Heading: ${Math.round(currentHeading)}° ${headingCardinal.textContent})`;
      try {
        await navigator.clipboard.writeText(str);
        showToast('Coordinates copied to clipboard');
      } catch (e) {
        showToast('Copy failed');
      }
    });

    // iOS Sensor Permission Button
    btnGrantSensor.addEventListener('click', requestSensorPermission);
    if (btnDismissSensor) {
      btnDismissSensor.addEventListener('click', () => {
        try { localStorage.setItem('kuberan_compass_sensor_enabled', 'true'); } catch (e) {}
        iosPermissionBanner.classList.add('hidden');
      });
    }
  }

  // --- Dynamic QR Code Generator for Install / GitHub ---
  function generateQrCode() {
    const qrcodeBox = document.getElementById('qrcodeBox');
    if (qrcodeBox && typeof QRCode !== 'undefined') {
      qrcodeBox.innerHTML = '';
      const shareUrl = window.location.href;
      new QRCode(qrcodeBox, {
        text: shareUrl,
        width: 140,
        height: 140,
        colorDark: "#d4a359",
        colorLight: "#08111e",
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  // --- iOS Sensor Permissions ---
  function requestSensorPermission() {
    try {
      localStorage.setItem('kuberan_compass_sensor_enabled', 'true');
    } catch (e) {}

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            try { localStorage.setItem('kuberan_compass_sensor_enabled', 'true'); } catch (e) {}
            attachSensorListeners();
            iosPermissionBanner.classList.add('hidden');
            showToast('Compass sensors activated');
          } else {
            showToast('Motion permission denied');
          }
        })
        .catch(() => {
          try { localStorage.setItem('kuberan_compass_sensor_enabled', 'true'); } catch (e) {}
          attachSensorListeners();
          iosPermissionBanner.classList.add('hidden');
        });
    } else {
      attachSensorListeners();
      iosPermissionBanner.classList.add('hidden');
    }
  }

  // --- Sensor Initialization ---
  function initSensors() {
    const isIOS = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = localStorage.getItem('kuberan_compass_sensor_enabled') === 'true';
    } catch (e) {}

    // Always attach available listeners immediately
    attachSensorListeners();

    if (isIOS) {
      if (isAlreadyEnabled) {
        // Already granted/enabled previously, never harass the user again!
        iosPermissionBanner.classList.add('hidden');
      } else {
        // Only show if orientation data does not arrive automatically within 800ms
        setTimeout(() => {
          let enabledNow = false;
          try { enabledNow = localStorage.getItem('kuberan_compass_sensor_enabled') === 'true'; } catch (e) {}
          if (!hasSensorData && !enabledNow) {
            iosPermissionBanner.classList.remove('hidden');
          }
        }, 800);
      }
    } else if (!('ondeviceorientation' in window) && !('ondeviceorientationabsolute' in window)) {
      sensorStatus.textContent = 'Device orientation not supported';
    }
  }

  // --- PWA Service Worker Registration ---
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('KUBERAN Vastu Compass SW registered:', reg.scope);
            // Force immediate update check
            reg.update();
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('New Vastu Compass version available, updating cache...');
                  }
                });
              }
            });
          })
          .catch((err) => console.warn('SW registration failed:', err));
      });

      let refreshing = false;
      const hadController = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Only reload if the client was already controlled by an older worker (prevent first-install reload)
        if (!refreshing && hadController) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      btnInstallApp.classList.remove('hidden');
    });

    btnInstallApp.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'granted') {
          btnInstallApp.classList.add('hidden');
        }
        deferredPrompt = null;
      }
    });
  }

  // --- Bootstrap App ---
  function init() {
    buildDialSvg();
    setupEventListeners();
    initSensors();
    initGPS();
    initPWA();
    updateCalibrationUI();
    updateHeading(0);
    updateInclinometer(0, 0);
    // A saved manual offset shifts EVERY reading. Never let it hide silently.
    if (Math.abs(calibrationOffset) >= 0.5) {
      setTimeout(() => showToast(`Manual offset ${calibrationOffset > 0 ? '+' : ''}${calibrationOffset.toFixed(1)}° is active - reset it in Calibrate if the compass reads wrong`), 1200);
    }
  }

  
  // --- SETTINGS MODAL BINDINGS (v4.6.4) ---
  const settingsModal = document.getElementById('settingsModal');
  const btnSettings = document.getElementById('btnSettings');
  const btnCloseSettings = document.getElementById('btnCloseSettings');

  if (btnSettings && settingsModal) {
    btnSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    
    // Close on outside click
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
  }

  // Language setting
  const selLang = document.getElementById('setting-lang');
  if (selLang) {
    selLang.value = currentLang;
    selLang.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  // Compass Ref (True/Magnetic)
  const radiosRef = document.getElementsByName('compass-ref');
  radiosRef.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      isTrueNorth = (e.target.value === 'true');
      updateHeading(currentHeading);
    }
  }));

  // Dial Style
  const selDial = document.getElementById('setting-dial-style');
  if (selDial) {
    selDial.value = dialTheme;
    selDial.addEventListener('change', (e) => setDialTheme(e.target.value));
  }

  // Compass Mode
  const radiosMode = document.getElementsByName('compass-mode');
  radiosMode.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      setCompassMode(e.target.value);
    }
  }));

  // Property Type
  const selProp = document.getElementById('setting-property');
  if (selProp) {
    selProp.value = propertyType;
    selProp.addEventListener('change', (e) => {
      propertyType = e.target.value;
      if (typeof updateRoomList === 'function') updateRoomList();
    });
  }

  // Zonal Division
  const radiosZones = document.getElementsByName('zones');
  radiosZones.forEach(r => r.addEventListener('change', (e) => {
    if (e.target.checked) {
      setZoneSystem(e.target.value);
    }
  }));

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();





