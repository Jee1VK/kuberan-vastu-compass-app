Add-Type -AssemblyName System.Drawing

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$storeDir = Join-Path $rootDir "assets\store"
$screenshotsDir = Join-Path $storeDir "screenshots"
if (-not (Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir -Force | Out-Null
}

$icon512Path = Join-Path $rootDir "icon-512.png"
$srcImg = [System.Drawing.Image]::FromFile($icon512Path)

# Store Screenshot Specifications: 1080 x 1920 (Standard 9:16 portrait)
$screens = @(
    @{
        File = "screenshot-1-vastu-mandala-32pada.png";
        Tagline = "SACRED VEDIC GEOMETRY";
        Title = "32 Pada Devata Mandala";
        Subtitle = "Precision 8, 16 & 32-zone architectural division from Vishwakarma Prakash & Manasara";
        Badge1 = "81-Pada Vastu Purusha Grid";
        Badge2 = "Degree-Accurate Entrance Analysis";
        Badge3 = "True & Magnetic North Switch"
    },
    @{
        File = "screenshot-2-room-finder-spatial.png";
        Tagline = "SPATIAL PLANNING";
        Title = "Dynamic Room Finder";
        Subtitle = "Instant directional suitability guidance for Puja, Kitchen, Master Bed & Living spaces";
        Badge1 = "Residential & Commercial Profiles";
        Badge2 = "Non-Demolition Vedic Balancers";
        Badge3 = "Color & Element Tattva Mapping"
    },
    @{
        File = "screenshot-3-ayadi-shadvarga-calc.png";
        Tagline = "VEDIC MATHEMATICS";
        Title = "Ayadi Shadvarga Calculator";
        Subtitle = "Calculate Aya, Vyaya, Yoni, Nakshatra, Tithi & Ayu for harmonious building dimensions";
        Badge1 = "Classical Hasta & Angula Formulas";
        Badge2 = "Dimensional Energy Scorecard";
        Badge3 = "Auspicious Perimeter Verification"
    },
    @{
        File = "screenshot-4-ar-camera-sighting.png";
        Tagline = "AUGMENTED REALITY";
        Title = "AR Wall Sighting HUD";
        Subtitle = "Overlay live room boundaries behind the sacred mandala with laser wall guide";
        Badge1 = "Live Camera Boundary View";
        Badge2 = "Dual-Axis Inclinometer (±0.1°)";
        Badge3 = "Field Snapshot & Freeze Mode"
    },
    @{
        File = "screenshot-5-plot-tilt-sama-sutra.png";
        Tagline = "FIELD PRECISION";
        Title = "Plot Tilt & Solar Azimuth";
        Subtitle = "Detect Sama-Sutra vs Vidisha plot orientation and calibrate to the astronomical Sun";
        Badge1 = "1-Tap Shanku-Chaya Sun Cal";
        Badge2 = "5s Circular Mean Survey Lock";
        Badge3 = "100% Offline Zero-Telemetry"
    }
)

$fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
$tagFont = New-Object System.Drawing.Font($fontFamily, 22, [System.Drawing.FontStyle]::Bold)
$titleFont = New-Object System.Drawing.Font($fontFamily, 44, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font($fontFamily, 22, [System.Drawing.FontStyle]::Regular)
$badgeFont = New-Object System.Drawing.Font($fontFamily, 20, [System.Drawing.FontStyle]::Bold)
$brandFont = New-Object System.Drawing.Font($fontFamily, 18, [System.Drawing.FontStyle]::Italic)

$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(197, 160, 89))
$ivoryBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 250, 247))
$dimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 175, 195))
$badgeBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(107, 29, 47))
$badgeBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(197, 160, 89), 2)
$cardBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 12, 22, 38))
$cardBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 197, 160, 89), 2)

foreach ($sc in $screens) {
    $outPath = Join-Path $screenshotsDir $sc.File
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background gradient: Deep temple navy to regal indigo
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        [System.Drawing.Color]::FromArgb(8, 17, 30),
        [System.Drawing.Color]::FromArgb(16, 28, 48)
    )
    $g.FillRectangle($gradBrush, 0, 0, 1080, 1920)

    # Decorative Vastu Mandala Grid overlay in background
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(18, 197, 160, 89), 1)
    for ($x = 60; $x -lt 1080; $x += 60) { $g.DrawLine($gridPen, $x, 0, $x, 1920) }
    for ($y = 60; $y -lt 1920; $y += 60) { $g.DrawLine($gridPen, 0, $y, 1080, $y) }

    # Top Header Banner
    $g.DrawString($sc.Tagline, $tagFont, $goldBrush, 80, 90)
    $g.DrawString($sc.Title, $titleFont, $ivoryBrush, 80, 135)
    
    # Subtitle wrapping in rectangle
    $subRect = New-Object System.Drawing.RectangleF(80, 205, 920, 90)
    $g.DrawString($sc.Subtitle, $subFont, $dimBrush, $subRect)

    # Central App Preview Card (Simulated Device Viewport)
    $g.FillRectangle($cardBgBrush, 80, 320, 920, 1140)
    $g.DrawRectangle($cardBorderPen, 80, 320, 920, 1140)

    # Concentric Sacred Yantra circles inside Card
    $yantraPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 197, 160, 89), 2)
    $g.DrawEllipse($yantraPen, 180, 420, 720, 720)
    $g.DrawEllipse($yantraPen, 240, 480, 600, 600)
    $g.DrawEllipse($yantraPen, 300, 540, 480, 480)

    # Central Dial Emblem
    $emblemRect = New-Object System.Drawing.Rectangle(250, 490, 580, 580)
    $g.DrawImage($srcImg, $emblemRect)

    # Feature Badges inside preview card
    $badgeY = 1140
    $badges = @($sc.Badge1, $sc.Badge2, $sc.Badge3)
    foreach ($b in $badges) {
        $g.FillRectangle($badgeBgBrush, 120, $badgeY, 840, 64)
        $g.DrawRectangle($badgeBorderPen, 120, $badgeY, 840, 64)
        $g.DrawString("✦  $b", $badgeFont, $ivoryBrush, 140, ($badgeY + 18))
        $badgeY += 82
    }

    # Bottom Branding Footer
    $g.DrawString("KUBERAN SILKS • CHICKPET, BENGALURU", $brandFont, $goldBrush, 80, 1530)
    $g.DrawString("Heritage Since 1980 • 100% Client-Side Privacy", $brandFont, $dimBrush, 80, 1565)

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "[OK] Generated Store Screenshot: $outPath"
}

$srcImg.Dispose()
Write-Host "All 5 Store Screenshots generated successfully!"
