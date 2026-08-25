export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os: string;
  browser: string;
}

export function parseUserAgent(ua?: string | null): DeviceInfo {
  if (!ua) {
    return {
      deviceType: 'desktop',
      os: 'macOS',
      browser: 'Safari',
    };
  }

  let deviceType: DeviceInfo['deviceType'] = 'desktop';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  const lower = ua.toLowerCase();

  // 1. Device Type
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    deviceType = 'mobile';
  } else {
    deviceType = 'desktop';
  }

  // 2. OS (Check mobile OS first to avoid iPhone "like Mac OS X" false match)
  if (/iphone|ipad|ipod/i.test(ua)) {
    os = 'iOS';
  } else if (/android/i.test(ua)) {
    os = 'Android';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
  } else if (/windows/i.test(ua)) {
    os = 'Windows';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }

  // 3. Browser
  if (/edg\//i.test(ua)) {
    browser = 'Edge';
  } else if (/chrome|crios/i.test(ua) && !/opr|opera|edge|edg/i.test(ua)) {
    browser = 'Chrome';
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = 'Safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/opr|opera/i.test(ua)) {
    browser = 'Opera';
  }

  return {
    deviceType,
    os,
    browser,
  };
}
