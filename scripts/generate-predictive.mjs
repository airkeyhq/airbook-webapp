import puppeteer from 'puppeteer';
import path from 'path';

async function generatePredictiveAvailability() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 2 });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 1200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .canvas-container {
      width: 1100px;
      height: 1100px;
      border-radius: 96px;
      background: linear-gradient(145deg, #DDF3FF 0%, #C4EAFF 35%, #EAF6FF 75%, #D4EEFF 100%);
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 6px rgba(43, 181, 255, 0.15);
    }

    /* Subtle ambient radial glow */
    .ambient-glow {
      position: absolute;
      width: 850px;
      height: 850px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%);
      top: -100px;
      left: -100px;
      pointer-events: none;
    }

    /* 1. Main Live Schedule Card (Top Left) */
    .schedule-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 780px;
      background: #FFFFFF;
      border-bottom-right-radius: 56px;
      padding: 52px 52px 46px 56px;
      box-shadow: 0 28px 56px -12px rgba(32, 98, 160, 0.18), 0 8px 18px -4px rgba(32, 98, 160, 0.08);
      z-index: 10;
    }

    .schedule-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .schedule-title {
      font-size: 34px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.6px;
    }

    .add-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748B;
      font-size: 26px;
      font-weight: 600;
    }

    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .schedule-item {
      padding-bottom: 24px;
      border-bottom: 1.5px solid #F1F5F9;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .schedule-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item-left {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-title {
      font-size: 25px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.4px;
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 18px;
      font-weight: 500;
      color: #64748B;
    }

    .item-meta svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: #94A3B8;
      stroke-width: 2.2;
    }

    .item-sub {
      font-size: 16.5px;
      font-weight: 500;
      color: #94A3B8;
    }

    .item-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      border-radius: 20px;
      font-size: 14.5px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .badge-vip {
      background: #FFF1F2;
      color: #E11D48;
      border: 1px solid #FFE4E6;
    }

    .badge-auto {
      background: #ECFDF5;
      color: #059669;
      border: 1px solid #D1FAE5;
    }

    .badge-protected {
      background: #EFF6FF;
      color: #2563EB;
      border: 1px solid #DBEAFE;
    }

    .avatar-stack {
      display: flex;
      align-items: center;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2.5px solid #FFFFFF;
      margin-left: -9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: #FFFFFF;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }

    .avatar:first-child {
      margin-left: 0;
    }

    .avatar-1 { background: linear-gradient(135deg, #FF6B8B, #FF8E53); }
    .avatar-2 { background: linear-gradient(135deg, #6B73FF, #000DFF); }
    .avatar-3 { background: linear-gradient(135deg, #2AF598, #009EFD); }
    .avatar-4 { background: linear-gradient(135deg, #B92B27, #1565C0); }
    .avatar-5 { background: linear-gradient(135deg, #F857A6, #FF5858); }
    .avatar-6 { background: linear-gradient(135deg, #4E54C8, #8F94FB); }
    .avatar-7 { background: linear-gradient(135deg, #11998E, #38EF7D); }
    .avatar-8 { background: linear-gradient(135deg, #FC466B, #3F5EFB); }
    .avatar-9 { background: linear-gradient(135deg, #3A1C71, #D76D77); }

    /* 2. Center-Left Utilization Pill */
    .utilization-pill {
      position: absolute;
      top: 670px;
      left: 70px;
      background: #FFFFFF;
      border-radius: 44px;
      padding: 26px 42px 26px 30px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 26px 54px -10px rgba(32, 98, 160, 0.22), 0 8px 20px -4px rgba(32, 98, 160, 0.1);
      z-index: 20;
    }

    .check-icon-wrap {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      background: #EBF7FF;
      border: 3.5px solid #2BB5FF;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .check-icon-wrap svg {
      width: 38px;
      height: 38px;
      fill: none;
      stroke: #2BB5FF;
      stroke-width: 3.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .pill-content {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .pill-title {
      font-size: 26px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.4px;
    }

    .pill-sub {
      font-size: 18.5px;
      font-weight: 600;
      color: #64748B;
    }

    /* 3. Right Smart Availability Card */
    .availability-card {
      position: absolute;
      top: 450px;
      right: 40px;
      width: 510px;
      background: #FFFFFF;
      border-radius: 48px;
      padding: 46px 44px;
      box-shadow: 0 30px 60px -12px rgba(32, 98, 160, 0.22), 0 12px 24px -4px rgba(32, 98, 160, 0.08);
      z-index: 12;
    }

    .availability-title {
      font-size: 30px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
      margin-bottom: 30px;
    }

    .availability-list {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .availability-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 20px;
      border-bottom: 1.5px solid #F1F5F9;
    }

    .availability-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .status-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .status-circle-blue {
      background: #2BB5FF;
      box-shadow: 0 4px 14px rgba(43, 181, 255, 0.45);
    }

    .status-circle-blue svg {
      width: 18px;
      height: 18px;
      fill: #FFFFFF;
    }

    .status-circle-gray {
      background: #E2E8F0;
    }

    .status-circle-gray svg {
      width: 16px;
      height: 16px;
      fill: #94A3B8;
    }

    .availability-text {
      font-size: 20.5px;
      font-weight: 700;
      color: #1E293B;
      letter-spacing: -0.2px;
    }

    .availability-text-muted {
      color: #94A3B8;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="canvas-container">
    <div class="ambient-glow"></div>

    <!-- Top Left Live Schedule -->
    <div class="schedule-card">
      <div class="schedule-header">
        <div class="schedule-title">Live Schedule</div>
        <div class="add-btn">+</div>
      </div>

      <div class="schedule-list">
        <!-- Row 1 -->
        <div class="schedule-item">
          <div class="item-left">
            <div class="item-title">Balayage & Gloss Finish</div>
            <div class="item-meta">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              <span>09:30 – 11:30 AM</span>
            </div>
            <div class="item-sub">Station 01 · Sarah J.</div>
          </div>
          <div class="item-right">
            <div class="badge badge-vip">⚡ VIP Client</div>
            <div class="avatar-stack">
              <div class="avatar avatar-1">SJ</div>
              <div class="avatar avatar-2">EM</div>
              <div class="avatar avatar-3">AL</div>
            </div>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="schedule-item">
          <div class="item-left">
            <div class="item-title">HydraFacial Glow Ritual</div>
            <div class="item-meta">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              <span>11:45 – 12:45 PM</span>
            </div>
            <div class="item-sub">Suite B · Waitlist Match</div>
          </div>
          <div class="item-right">
            <div class="badge badge-auto">✨ Auto-Filled</div>
            <div class="avatar-stack">
              <div class="avatar avatar-4">MK</div>
              <div class="avatar avatar-5">TL</div>
              <div class="avatar avatar-6">CH</div>
            </div>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="schedule-item">
          <div class="item-left">
            <div class="item-title">Executive Cut & Beard</div>
            <div class="item-meta">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              <span>01:30 – 02:30 PM</span>
            </div>
            <div class="item-sub">Chair 03 · Marcus V.</div>
          </div>
          <div class="item-right">
            <div class="badge badge-protected">🔒 Protected</div>
            <div class="avatar-stack">
              <div class="avatar avatar-7">MV</div>
              <div class="avatar avatar-8">DR</div>
              <div class="avatar avatar-9">JK</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center-Left Utilization Pill -->
    <div class="utilization-pill">
      <div class="check-icon-wrap">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="pill-content">
        <div class="pill-title">Full Chair Utilization</div>
        <div class="pill-sub">8 of 8 slots filled today</div>
      </div>
    </div>

    <!-- Right Smart Availability Card -->
    <div class="availability-card">
      <div class="availability-title">Smart Availability</div>
      <div class="availability-list">
        <div class="availability-item">
          <div class="status-circle status-circle-blue">
            <svg viewBox="0 0 24 24"><polygon points="6 4 19 12 6 20 6 4"/></svg>
          </div>
          <div class="availability-text">10:00 AM Gap Auto-Filled</div>
        </div>

        <div class="availability-item">
          <div class="status-circle status-circle-blue">
            <svg viewBox="0 0 24 24"><polygon points="6 4 19 12 6 20 6 4"/></svg>
          </div>
          <div class="availability-text">2-Way SMS Confirmed</div>
        </div>

        <div class="availability-item">
          <div class="status-circle status-circle-blue">
            <svg viewBox="0 0 24 24"><polygon points="6 4 19 12 6 20 6 4"/></svg>
          </div>
          <div class="availability-text">Stripe Deposit Guarded</div>
        </div>

        <div class="availability-item">
          <div class="status-circle status-circle-gray">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>
          </div>
          <div class="availability-text availability-text-muted">15m Buffer Turnover</div>
        </div>

        <div class="availability-item">
          <div class="status-circle status-circle-gray">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/></svg>
          </div>
          <div class="availability-text availability-text-muted">Apple & Google Synced</div>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
  `;

  await page.setContent(html);
  const outPath = path.resolve('public/web1/assets/images/qBDQaEC7ZiYkRslEy23Ql43xy2w.png');
  await page.screenshot({ path: outPath, type: 'png', omitBackground: true });
  console.log(`Generated high-DPI enlarged graphic: ${outPath}`);

  await browser.close();
}

generatePredictiveAvailability().catch(console.error);
