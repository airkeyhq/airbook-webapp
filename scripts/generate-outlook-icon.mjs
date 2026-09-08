import puppeteer from 'puppeteer';
import path from 'path';

async function generateOutlookIcon() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 400, deviceScaleFactor: 2 });

  // Microsoft Outlook App Icon
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 400px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      overflow: hidden;
    }

    .icon-wrapper {
      width: 360px;
      height: 360px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 14px 24px rgba(0, 70, 160, 0.22)) drop-shadow(0 4px 8px rgba(0, 40, 120, 0.12));
    }

    /* Squircle base */
    .squircle-bg {
      width: 100%;
      height: 100%;
      border-radius: 80px;
      background: #FFFFFF;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 6px rgba(0, 100, 220, 0.08);
      border: 1px solid rgba(0, 120, 212, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    svg {
      width: 270px;
      height: 270px;
      position: relative;
      z-index: 2;
    }
  </style>
</head>
<body>
  <div class="icon-wrapper">
    <div class="squircle-bg">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Back layer gradient -->
          <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0078D4" />
            <stop offset="100%" stop-color="#004C87" />
          </linearGradient>

          <!-- Middle sheet gradient -->
          <linearGradient id="midGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#28A8EA" />
            <stop offset="100%" stop-color="#0078D4" />
          </linearGradient>

          <!-- Front flap gradient -->
          <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#50E6FF" />
            <stop offset="60%" stop-color="#1490DF" />
            <stop offset="100%" stop-color="#005A9E" />
          </linearGradient>

          <!-- 'O' Tile Badge Gradient -->
          <linearGradient id="tileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0078D4" />
            <stop offset="100%" stop-color="#004578" />
          </linearGradient>

          <!-- Shadow filters -->
          <filter id="tileShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#001F3F" flood-opacity="0.38" />
          </filter>
        </defs>

        <!-- Back Blue Panel (Envelope Back) -->
        <rect x="22" y="16" width="64" height="68" rx="14" fill="url(#backGrad)" />

        <!-- Interior Mail Paper/Sheet -->
        <rect x="30" y="24" width="48" height="42" rx="6" fill="#FFFFFF" opacity="0.95" />
        <rect x="36" y="32" width="36" height="4" rx="2" fill="#0078D4" opacity="0.4" />
        <rect x="36" y="40" width="28" height="4" rx="2" fill="#0078D4" opacity="0.3" />

        <!-- Envelope Fold Bottom Section -->
        <path d="M 22 48 L 54 68 L 86 48 L 86 70 C 86 77.7 79.7 84 72 84 L 36 84 C 28.3 84 22 77.7 22 70 Z" fill="url(#flapGrad)" />

        <!-- Envelope Flap (V-Shape Fold Overlay) -->
        <path d="M 22 48 L 54 68 L 86 48 L 54 36 Z" fill="url(#midGrad)" opacity="0.9" />

        <!-- Overlapping 'O' Tile (Left App Badge) -->
        <g filter="url(#tileShadow)">
          <rect x="12" y="26" width="48" height="48" rx="12" fill="url(#tileGrad)" />
          
          <!-- Inner White 'O' Ring -->
          <ellipse cx="36" cy="50" rx="13" ry="15" fill="#FFFFFF" />
          <ellipse cx="36" cy="50" rx="7" ry="8.5" fill="url(#tileGrad)" />
        </g>
      </svg>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  const outPath = path.resolve('public/web1/assets/images/pFQat08e9brmq0Jo21xMeMweMsw.png');
  await page.screenshot({ path: outPath, type: 'png', omitBackground: true });
  console.log(`Generated Outlook Icon: ${outPath}`);

  await browser.close();
}

generateOutlookIcon().catch(console.error);
