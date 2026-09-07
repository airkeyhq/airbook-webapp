'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CircleCloudIcon3D, CircleCloudIconFlat } from './Logo';
import { CustomSelect } from '@/components/CustomSelect';
import {
  Sparkle24Regular,
  Globe24Regular,
  Copy24Filled,
  Checkmark24Filled,
  ArrowDownload24Filled,
  CheckmarkCircle24Filled,
  FolderZip24Filled,
  Eye24Filled,
  DocumentArrowDown24Filled,
} from '@fluentui/react-icons';

export type AvatarLogoSource =
  | '3d'
  | 'flat-black'
  | 'flat-white'
  | 'custom-brand';

export type AvatarBgStyle =
  | 'electric-sky'
  | 'obsidian-dark'
  | 'pure-white'
  | 'velvet-rose'
  | 'emerald-sage'
  | 'cyber-indigo'
  | 'sunset-amber'
  | 'blueprint'
  | 'brand-gradient'
  | 'transparent';

export type AvatarMask = 'circle' | 'squircle' | 'square';
export type AvatarStoryRing = 'none' | 'instagram' | 'linkedin' | 'gold' | 'electric';
export type AvatarVerifiedBadge = 'none' | 'blue' | 'gold';
export type SocialOutlet = 'all' | 'instagram' | 'linkedin' | 'x' | 'tiktok' | 'facebook' | 'youtube' | 'whatsapp';
export type AvatarStudioViewMode = 'production' | 'mockups';

// Official Platform Webclips directly from their live website domains (e.g. instagram.com, linkedin.com, x.com, etc.)
export const PLATFORM_WEBCLIPS: Record<SocialOutlet, string> = {
  all: '',
  instagram: '/icons/platforms/instagram.webp',
  linkedin: '/icons/platforms/linkedin.png',
  x: '/icons/platforms/x.png',
  tiktok: '/icons/platforms/tiktok.png',
  facebook: '/icons/platforms/facebook.webp',
  youtube: '/icons/platforms/youtube.png',
  whatsapp: '/icons/platforms/whatsapp.svg',
};

export const PlatformWebclip: React.FC<{ id: SocialOutlet; className?: string; alt?: string }> = ({
  id,
  className = 'w-4 h-4 rounded-md object-contain',
  alt,
}) => {
  const src = PLATFORM_WEBCLIPS[id];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || id}
      className={className}
      width={24}
      height={24}
      loading="lazy"
    />
  );
};

export const getPlatformLogo = (id: SocialOutlet, className = 'w-4.5 h-4.5 rounded-md object-contain flex-shrink-0') => {
  return <PlatformWebclip id={id} className={className} />;
};

interface SocialAvatarsStudioProps {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  bookingSlug?: string;
}

interface PlatformSpec {
  id: SocialOutlet;
  name: string;
  width: number;
  height: number;
  displaySize: string;
  shape: string;
  specKey: 'specsInstagram' | 'specsLinkedIn' | 'specsX' | 'specsTikTok' | 'specsFacebook' | 'specsYouTube' | 'specsWhatsApp';
  previewKey: 'outletPreviewInstagram' | 'outletPreviewLinkedIn' | 'outletPreviewX' | 'outletPreviewTikTok' | 'outletPreviewFacebook' | 'outletPreviewYouTube' | 'outletPreviewWhatsApp';
}

const SOCIAL_PLATFORMS: PlatformSpec[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    width: 1080,
    height: 1080,
    displaySize: '320 × 320 px',
    shape: 'Circle',
    specKey: 'specsInstagram',
    previewKey: 'outletPreviewInstagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    width: 400,
    height: 400,
    displaySize: '400 × 400 px',
    shape: 'Circle',
    specKey: 'specsLinkedIn',
    previewKey: 'outletPreviewLinkedIn',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    width: 400,
    height: 400,
    displaySize: '400 × 400 px',
    shape: 'Circle',
    specKey: 'specsX',
    previewKey: 'outletPreviewX',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    width: 200,
    height: 200,
    displaySize: '200 × 200 px',
    shape: 'Circle',
    specKey: 'specsTikTok',
    previewKey: 'outletPreviewTikTok',
  },
  {
    id: 'facebook',
    name: 'Facebook Page',
    width: 180,
    height: 180,
    displaySize: '180 × 180 px',
    shape: 'Circle',
    specKey: 'specsFacebook',
    previewKey: 'outletPreviewFacebook',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    width: 800,
    height: 800,
    displaySize: '800 × 800 px',
    shape: 'Circle',
    specKey: 'specsYouTube',
    previewKey: 'outletPreviewYouTube',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    width: 500,
    height: 500,
    displaySize: '500 × 500 px',
    shape: 'Circle',
    specKey: 'specsWhatsApp',
    previewKey: 'outletPreviewWhatsApp',
  },
];

export const SocialAvatarsStudio: React.FC<SocialAvatarsStudioProps> = ({
  brandName,
  tagline,
  logoUrl = '',
  primaryColor = '#007AFF',
  accentColor = '#60A5FA',
  bookingSlug = 'airbook-studio',
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Customizer State
  const [viewMode, setViewMode] = useState<AvatarStudioViewMode>('production');
  const [logoSource, setLogoSource] = useState<AvatarLogoSource>(logoUrl ? 'custom-brand' : '3d');
  const [bgStyle, setBgStyle] = useState<AvatarBgStyle>('electric-sky');
  const [scalePercent, setScalePercent] = useState<number>(72);
  const [mask, setMask] = useState<AvatarMask>('circle');
  const [storyRing, setStoryRing] = useState<AvatarStoryRing>('instagram');
  const [verifiedBadge, setVerifiedBadge] = useState<AvatarVerifiedBadge>('blue');
  const [selectedOutlet, setSelectedOutlet] = useState<SocialOutlet>('all');
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handle = bookingSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fullBookingUrl = `https://getairbook.com/book/${bookingSlug}`;

  const getBackgroundCss = (style: AvatarBgStyle): string => {
    switch (style) {
      case 'electric-sky':
        return 'bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0369A1]';
      case 'obsidian-dark':
        return 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617]';
      case 'pure-white':
        return 'bg-white shadow-inner';
      case 'velvet-rose':
        return 'bg-gradient-to-br from-[#FFA6B9] via-[#E11D48] to-[#9F1239]';
      case 'emerald-sage':
        return 'bg-gradient-to-br from-[#34D399] via-[#059669] to-[#064E3B]';
      case 'cyber-indigo':
        return 'bg-gradient-to-br from-[#818CF8] via-[#4F46E5] to-[#312E81]';
      case 'sunset-amber':
        return 'bg-gradient-to-br from-[#FBBF24] via-[#D97706] to-[#78350F]';
      case 'blueprint':
        return 'bg-[#1D61F2]';
      case 'brand-gradient':
        return '';
      case 'transparent':
        return 'bg-transparent';
      default:
        return 'bg-gradient-to-br from-[#38BDF8] to-[#0284C7]';
    }
  };

  const getBackgroundInlineStyle = (style: AvatarBgStyle): React.CSSProperties => {
    if (style === 'brand-gradient') {
      return {
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
      };
    }
    if (style === 'transparent') {
      return {
        backgroundImage:
          'radial-gradient(#CBD5E1 1px, transparent 1px), radial-gradient(#CBD5E1 1px, transparent 1px)',
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 6px 6px',
      };
    }
    return {};
  };

  const getRingClass = (ring: AvatarStoryRing): string => {
    switch (ring) {
      case 'instagram':
        return 'p-[3px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-md';
      case 'linkedin':
        return 'p-[3px] bg-[#0077B5] shadow-md';
      case 'gold':
        return 'p-[3px] bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#D97706] shadow-md';
      case 'electric':
        return 'p-[3px] bg-gradient-to-tr from-[#38BDF8] to-[#0284C7] shadow-[0_0_12px_rgba(56,189,248,0.6)]';
      default:
        return 'p-0';
    }
  };

  const getMaskClass = (m: AvatarMask): string => {
    switch (m) {
      case 'circle':
        return 'rounded-full';
      case 'squircle':
        return 'rounded-[28%]';
      case 'square':
        return 'rounded-2xl';
      default:
        return 'rounded-full';
    }
  };

  /**
   * High-Resolution Canvas Render & Download Engine
   * Generates clean, unmasked, high-DPI 1:1 square PNGs for direct platform upload.
   */
  const generateCanvasImage = async (
    targetWidth: number,
    targetHeight: number,
    options?: { isMockupExport?: boolean }
  ): Promise<Blob | null> => {
    const isMockup = options?.isMockupExport ?? false;
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cx = targetWidth / 2;
    const cy = targetHeight / 2;

    // Helper to create the shape path (circle, squircle, square)
    const createShapePath = (
      x: number,
      y: number,
      w: number,
      h: number,
      shape: AvatarMask,
      cornerRadius?: number
    ) => {
      ctx.beginPath();
      if (shape === 'circle') {
        const r = w / 2;
        ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
      } else if (shape === 'squircle') {
        const r = cornerRadius ?? w * 0.25;
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
        }
      } else {
        // Square (Full 1:1 Canvas)
        ctx.rect(x, y, w, h);
      }
    };

    let inset = 0;

    // 1. Draw Ring ONLY if exporting in mockup simulation mode
    if (isMockup && storyRing !== 'none') {
      const ringThickness = Math.max(6, Math.round(targetWidth * 0.035));
      const ringGap = Math.max(4, Math.round(targetWidth * 0.02));
      inset = ringThickness + ringGap;

      ctx.save();
      const halfThick = ringThickness / 2;
      createShapePath(
        halfThick,
        halfThick,
        targetWidth - ringThickness,
        targetHeight - ringThickness,
        mask,
        targetWidth * 0.25
      );
      ctx.lineWidth = ringThickness;

      if (storyRing === 'instagram') {
        const ringGrad = ctx.createLinearGradient(0, targetHeight, targetWidth, 0);
        ringGrad.addColorStop(0, '#F58529');
        ringGrad.addColorStop(0.4, '#DD2A7B');
        ringGrad.addColorStop(1, '#8134AF');
        ctx.strokeStyle = ringGrad;
      } else if (storyRing === 'linkedin') {
        ctx.strokeStyle = '#0077B5';
      } else if (storyRing === 'gold') {
        const goldGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
        goldGrad.addColorStop(0, '#F59E0B');
        goldGrad.addColorStop(0.5, '#FDE68A');
        goldGrad.addColorStop(1, '#D97706');
        ctx.strokeStyle = goldGrad;
      } else {
        const skyGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
        skyGrad.addColorStop(0, '#38BDF8');
        skyGrad.addColorStop(1, '#0284C7');
        ctx.strokeStyle = skyGrad;
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Avatar Background (Full bleed 1:1 square for production uploads, or clipped for mockups)
    ctx.save();
    const innerW = targetWidth - inset * 2;
    const innerH = targetHeight - inset * 2;

    if (isMockup && mask !== 'square') {
      createShapePath(
        inset,
        inset,
        innerW,
        innerH,
        mask,
        Math.max(0, targetWidth * 0.25 - inset)
      );
      ctx.clip();
    }

    if (bgStyle === 'electric-sky') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#38BDF8');
      bgGrad.addColorStop(0.5, '#0284C7');
      bgGrad.addColorStop(1, '#0369A1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'obsidian-dark') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#1E293B');
      bgGrad.addColorStop(0.7, '#0F172A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'pure-white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'velvet-rose') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#FFA6B9');
      bgGrad.addColorStop(0.6, '#E11D48');
      bgGrad.addColorStop(1, '#9F1239');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'emerald-sage') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#34D399');
      bgGrad.addColorStop(0.6, '#059669');
      bgGrad.addColorStop(1, '#064E3B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'cyber-indigo') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#818CF8');
      bgGrad.addColorStop(0.6, '#4F46E5');
      bgGrad.addColorStop(1, '#312E81');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'sunset-amber') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, '#FBBF24');
      bgGrad.addColorStop(0.6, '#D97706');
      bgGrad.addColorStop(1, '#78350F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else if (bgStyle === 'blueprint') {
      ctx.fillStyle = '#1D61F2';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      // Blueprint grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      const step = Math.round(targetWidth / 14);
      for (let x = 0; x < targetWidth; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, targetHeight);
        ctx.stroke();
      }
      for (let y = 0; y < targetHeight; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(targetWidth, y);
        ctx.stroke();
      }
    } else if (bgStyle === 'brand-gradient') {
      const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      bgGrad.addColorStop(0, primaryColor);
      bgGrad.addColorStop(1, accentColor);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    } else {
      // transparent — do nothing, keep canvas clear
    }

    // 3. Draw Logo Content
    const logoDrawSize = Math.round(innerW * (scalePercent / 100));
    const lx = cx - logoDrawSize / 2;
    const ly = cy - logoDrawSize / 2;

    if (logoSource === 'custom-brand' && logoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = logoUrl;
        });
        ctx.drawImage(img, lx, ly, logoDrawSize, logoDrawSize);
      } catch (err) {
        console.warn('Could not draw custom logo on canvas, falling back to vector:', err);
        drawAirBookCloudVector(ctx, lx, ly, logoDrawSize, logoSource);
      }
    } else {
      drawAirBookCloudVector(ctx, lx, ly, logoDrawSize, logoSource);
    }

    ctx.restore();

    // 4. Draw Verified Badge ONLY if exporting in mockup simulation mode
    if (isMockup && verifiedBadge !== 'none') {
      const badgeSize = Math.max(24, Math.round(targetWidth * 0.22));
      const bx = targetWidth - inset - badgeSize * 0.9;
      const by = targetHeight - inset - badgeSize * 0.9;

      ctx.save();
      ctx.beginPath();
      ctx.arc(bx + badgeSize / 2, by + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = verifiedBadge === 'gold' ? '#F59E0B' : '#007AFF';
      ctx.fill();
      ctx.lineWidth = Math.max(2, Math.round(badgeSize * 0.08));
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Checkmark inside badge
      ctx.beginPath();
      const p1x = bx + badgeSize * 0.3;
      const p1y = by + badgeSize * 0.52;
      const p2x = bx + badgeSize * 0.44;
      const p2y = by + badgeSize * 0.68;
      const p3x = bx + badgeSize * 0.72;
      const p3y = by + badgeSize * 0.36;

      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.lineTo(p3x, p3y);
      ctx.lineWidth = Math.max(2, Math.round(badgeSize * 0.1));
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  };

  /**
   * Helper to draw AirBook Master Vector Path directly onto canvas
   */
  const drawAirBookCloudVector = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    source: AvatarLogoSource
  ) => {
    ctx.save();
    ctx.translate(x, y);
    const scale = size / 200;
    ctx.scale(scale, scale);

    const outerPath = new Path2D(`
      M 68.00,45.01 
      Q 100.00,15.00 132.00,45.01 
      Q 174.05,57.12 164.00,100.00 
      Q 174.05,142.88 132.00,154.99 
      Q 100.00,185.00 68.00,154.99 
      Q 25.95,142.88 36.00,100.00 
      Q 25.95,57.12 68.00,45.01 Z
      M 88,72
      A 12,12 0 0,1 112,72
      L 112,84
      A 4,4 0 0,0 116,88
      L 128,88
      A 12,12 0 0,1 128,112
      L 116,112
      A 4,4 0 0,0 112,116
      L 112,128
      A 12,12 0 0,1 88,128
      L 88,116
      A 4,4 0 0,0 84,112
      L 72,112
      A 12,12 0 0,1 72,88
      L 84,88
      A 4,4 0 0,0 88,84
      Z
    `);

    if (source === 'flat-black') {
      ctx.fillStyle = '#0F172A';
      ctx.fill(outerPath, 'evenodd');
    } else if (source === 'flat-white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(outerPath, 'evenodd');
    } else {
      // 3D Cloud Body
      ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 10;

      const bodyGrad = ctx.createLinearGradient(100, 0, 100, 200);
      bodyGrad.addColorStop(0, '#FFFFFF');
      bodyGrad.addColorStop(0.6, '#F1F5F9');
      bodyGrad.addColorStop(1, '#CBD5E1');

      ctx.fillStyle = bodyGrad;
      ctx.fill(outerPath, 'evenodd');

      // Top gloss highlight
      ctx.shadowColor = 'transparent';
      const glossGrad = ctx.createLinearGradient(100, 0, 100, 200);
      glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glossGrad;
      ctx.fill(outerPath, 'evenodd');
    }

    ctx.restore();
  };

  const handleDownload = async (platformName: string, w: number, h: number) => {
    setIsExporting(true);
    try {
      // Production export: clean 1:1 square master asset for social media profile settings
      const blob = await generateCanvasImage(w, h, { isMockupExport: false });
      if (!blob) throw new Error('Could not generate avatar image.');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `airbook-profile-picture-${platformName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${w}x${h}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast(t('avatarDownloaded'), 'success');
    } catch (err) {
      console.error('Download error:', err);
      addToast('Error generating profile picture download.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsExporting(true);
    try {
      for (const p of SOCIAL_PLATFORMS) {
        await handleDownload(p.id, p.width, p.height);
        await new Promise((r) => setTimeout(r, 250));
      }
      addToast(t('avatarDownloaded'), 'success');
    } catch (err) {
      console.error('Download all error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async (key = 'avatar-png', w = 1080, h = 1080) => {
    try {
      const blob = await generateCanvasImage(w, h, { isMockupExport: false });
      if (!blob) throw new Error('Failed to generate image');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedKey(key);
        addToast(t('avatarCopied'), 'success');
        setTimeout(() => setCopiedKey(null), 2000);
      } else {
        throw new Error('ClipboardItem API not supported in browser.');
      }
    } catch (err) {
      console.warn('Clipboard write error:', err);
      // Fallback: download
      handleDownload(key, w, h);
    }
  };

  /**
   * Reusable Live Vector / DOM Avatar Preview Component
   */
  const renderAvatarPreview = (
    sizePx = 120,
    customShapeOrOptions?:
      | AvatarMask
      | {
          customShape?: AvatarMask;
          isMockupContext?: boolean;
          forceCleanProduction?: boolean;
        }
  ) => {
    const opts =
      typeof customShapeOrOptions === 'string'
        ? { customShape: customShapeOrOptions, isMockupContext: true }
        : customShapeOrOptions;

    const isMockup = opts?.isMockupContext ?? (viewMode === 'mockups');
    const isForceClean = opts?.forceCleanProduction ?? (viewMode === 'production');

    const activeMask: AvatarMask = isForceClean
      ? (opts?.customShape || 'square')
      : (opts?.customShape || mask);

    const ringWrapperClass = !isForceClean && isMockup ? getRingClass(storyRing) : 'p-0';
    const maskClass = getMaskClass(activeMask);
    const bgClass = getBackgroundCss(bgStyle);
    const bgStyleInline = getBackgroundInlineStyle(bgStyle);

    return (
      <div className={`relative inline-flex items-center justify-center ${ringWrapperClass} ${maskClass} select-none transition-all duration-200`}>
        <div
          className={`relative overflow-hidden flex items-center justify-center ${maskClass} ${bgClass}`}
          style={{ width: sizePx, height: sizePx, ...bgStyleInline }}
        >
          {/* Safe Zone Visual Circle Indicator Overlay (shown on square production canvas) */}
          {showSafeZone && (
            <div
              className="absolute rounded-full border border-dashed border-white/50 dark:border-white/40 pointer-events-none z-20"
              style={{ width: `${sizePx * 0.8}px`, height: `${sizePx * 0.8}px` }}
              title={t('safeCropZoneNotice')}
            />
          )}

          {/* Blueprint Grid Lines in preview */}
          {bgStyle === 'blueprint' && (
            <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
              <defs>
                <pattern id="avatarBlueprintGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                  <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#avatarBlueprintGrid)" />
            </svg>
          )}

          {/* Logo Content Render */}
          <div className="flex items-center justify-center z-10 w-full h-full pointer-events-none">
            <div
              className="flex items-center justify-center transition-transform duration-200"
              style={{
                width: `${sizePx * (scalePercent / 100)}px`,
                height: `${sizePx * (scalePercent / 100)}px`,
              }}
            >
              {logoSource === 'custom-brand' && logoUrl ? (
                <img src={logoUrl} alt={brandName} className="w-full h-full object-contain" />
              ) : logoSource === 'flat-black' ? (
                <CircleCloudIconFlat size="100%" styleType="solid-black" className="w-full h-full" />
              ) : logoSource === 'flat-white' ? (
                <CircleCloudIconFlat size="100%" styleType="solid-white" className="w-full h-full" />
              ) : (
                <CircleCloudIcon3D size="100%" className="w-full h-full" />
              )}
            </div>
          </div>
        </div>

        {/* Verified Badge Icon in preview (ONLY in mockup simulation mode) */}
        {!isForceClean && isMockup && verifiedBadge !== 'none' && (
          <div
            className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-[var(--bg-primary)] shadow-md flex items-center justify-center z-30 ${
              verifiedBadge === 'gold' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
            }`}
            style={{ width: Math.max(20, sizePx * 0.28), height: Math.max(20, sizePx * 0.28) }}
          >
            <Checkmark24Filled className="w-full h-full p-0.5" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Main Studio Grid: Left Customizer Controls, Right Master Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Style Controls (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
          <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Sparkle24Regular className="w-4 h-4 text-blue-500" />
            <span>{t('avatarCustomizer')}</span>
          </h4>

          {/* 1. Logo Source Picker */}
          <CustomSelect
            label={t('logoSourceLabel')}
            value={logoSource}
            onChange={(val) => setLogoSource(val as AvatarLogoSource)}
            options={[
              {
                value: '3d',
                label: t('logoSource3D'),
                icon: <CircleCloudIcon3D size={20} />,
              },
              {
                value: 'flat-black',
                label: t('logoSourceFlatBlack'),
                icon: <CircleCloudIconFlat size={20} styleType="solid-black" />,
              },
              {
                value: 'flat-white',
                label: t('logoSourceFlatWhite'),
                icon: (
                  <div className="p-1 rounded bg-slate-900 flex items-center justify-center">
                    <CircleCloudIconFlat size={14} styleType="solid-white" />
                  </div>
                ),
              },
              ...(logoUrl
                ? [
                    {
                      value: 'custom-brand',
                      label: t('logoSourceBrand'),
                      icon: <img src={logoUrl} alt="Logo" className="w-5 h-5 object-contain" />,
                    },
                  ]
                : []),
            ]}
          />

          {/* 2. Background Aesthetic Style */}
          <CustomSelect
            label={t('bgStyleLabel')}
            value={bgStyle}
            onChange={(val) => setBgStyle(val as AvatarBgStyle)}
            options={[
              {
                value: 'electric-sky',
                label: t('bgStyleElectricSky'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#38BDF8] to-[#0284C7]" />,
              },
              {
                value: 'obsidian-dark',
                label: t('bgStyleObsidianDark'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#1E293B] to-[#0F172A]" />,
              },
              {
                value: 'pure-white',
                label: t('bgStylePureWhite'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-white border border-slate-300" />,
              },
              {
                value: 'velvet-rose',
                label: t('bgStyleVelvetRose'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#FFA6B9] to-[#E11D48]" />,
              },
              {
                value: 'emerald-sage',
                label: t('bgStyleEmeraldSage'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#34D399] to-[#059669]" />,
              },
              {
                value: 'cyber-indigo',
                label: t('bgStyleCyberIndigo'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#818CF8] to-[#4F46E5]" />,
              },
              {
                value: 'sunset-amber',
                label: t('bgStyleSunsetAmber'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-[#FBBF24] to-[#D97706]" />,
              },
              {
                value: 'blueprint',
                label: t('bgStyleBlueprint'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-[#1D61F2]" />,
              },
              {
                value: 'brand-gradient',
                label: t('bgStyleBrandGradient'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-gradient-to-r from-blue-600 to-sky-400" />,
              },
              {
                value: 'transparent',
                label: t('bgStyleTransparent'),
                icon: <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-transparent border border-dashed border-slate-400" />,
              },
            ]}
          />

          {/* 3. Logo Scale Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">
              <span>{t('avatarPaddingLabel')}</span>
              <span className="font-mono text-blue-500">{scalePercent}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              value={scalePercent}
              onChange={(e) => setScalePercent(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Safe Zone Toggle */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-primary)] block">80% Safe Crop Circle</span>
              <span className="text-[10px] text-[var(--text-muted)]">Show circular safe area boundary</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showSafeZone}
              onClick={() => setShowSafeZone(!showSafeZone)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center flex-shrink-0 cursor-pointer ${
                showSafeZone ? 'bg-blue-600' : 'bg-black/15 dark:bg-white/20'
              }`}
            >
              <motion.div
                animate={{ x: showSafeZone ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          {/* Mode 2 ONLY: Simulation & Mockup Overlays */}
          {viewMode === 'mockups' && (
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-5">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Simulation Only
                </span>
                <h5 className="text-xs font-black text-[var(--text-primary)]">
                  {t('simulationOverlaysTitle')}
                </h5>
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                  {t('simulationOverlaysDesc')}
                </p>
              </div>

              {/* 4. Mask & Shape Selector */}
              <CustomSelect
                label={t('avatarMaskLabel')}
                value={mask}
                onChange={(val) => setMask(val as AvatarMask)}
                options={[
                  {
                    value: 'circle',
                    label: t('maskCircle'),
                    icon: <div className="w-4 h-4 rounded-full border-2 border-current" />,
                  },
                  {
                    value: 'squircle',
                    label: t('maskSquircle'),
                    icon: <div className="w-4 h-4 rounded-[6px] border-2 border-current" />,
                  },
                  {
                    value: 'square',
                    label: t('maskSquare'),
                    icon: <div className="w-4 h-4 rounded-none border-2 border-current" />,
                  },
                ]}
              />

              {/* 5. Story / Accent Ring */}
              <CustomSelect
                label={t('storyRingLabel')}
                value={storyRing}
                onChange={(val) => setStoryRing(val as AvatarStoryRing)}
                options={[
                  {
                    value: 'none',
                    label: t('ringNone'),
                    icon: <div className="w-4 h-4 rounded-full border border-dashed border-[var(--text-muted)]" />,
                  },
                  {
                    value: 'instagram',
                    label: t('ringInstagram'),
                    icon: (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)]" />
                      </div>
                    ),
                  },
                  {
                    value: 'linkedin',
                    label: t('ringLinkedIn'),
                    icon: (
                      <div className="w-4 h-4 rounded-full bg-[#0077B5] p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)]" />
                      </div>
                    ),
                  },
                  {
                    value: 'gold',
                    label: t('ringGold'),
                    icon: (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)]" />
                      </div>
                    ),
                  },
                  {
                    value: 'electric',
                    label: t('ringElectric'),
                    icon: (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 p-[1.5px]">
                        <div className="w-full h-full rounded-full bg-[var(--bg-primary)]" />
                      </div>
                    ),
                  },
                ]}
              />

              {/* 6. Verified Badge Overlay */}
              <CustomSelect
                label={t('verifiedBadgeToggle')}
                value={verifiedBadge}
                onChange={(val) => setVerifiedBadge(val as AvatarVerifiedBadge)}
                options={[
                  {
                    value: 'none',
                    label: t('badgeTypeNone'),
                    icon: <div className="w-3.5 h-3.5 rounded-full border border-dashed border-[var(--text-muted)]" />,
                  },
                  {
                    value: 'blue',
                    label: t('badgeTypeBlue'),
                    icon: <CheckmarkCircle24Filled className="w-4 h-4 text-blue-500" />,
                  },
                  {
                    value: 'gold',
                    label: t('badgeTypeGold'),
                    icon: <CheckmarkCircle24Filled className="w-4 h-4 text-amber-500" />,
                  },
                ]}
              />
            </div>
          )}
        </div>

        {/* Right Column: Master Preview & Live Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Canvas Card */}
          <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

            {/* Centered Large Avatar Preview */}
            <div className="z-10 my-2">
              {renderAvatarPreview(180)}
            </div>

            {/* Quick Master Actions */}
            <div className="z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownload('master-1080', 1080, 1080)}
                disabled={isExporting}
                className="btn-primary h-10 px-5 text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ArrowDownload24Filled className="w-4 h-4" />
                <span>{t('downloadMasterAvatar')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyImage('master-png', 1080, 1080)}
                className="btn-secondary h-10 px-4 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'master-png' ? (
                  <Checkmark24Filled className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy24Filled className="w-4 h-4" />
                )}
                <span>{copiedKey === 'master-png' ? t('avatarCopied') : t('copyAvatarPng')}</span>
              </button>
            </div>

            {/* Crop Safe Notice */}
            <p className="z-10 text-[11px] text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              {t('safeCropZoneNotice')}
            </p>
          </div>

          {/* Mode 1 vs Mode 2 Segmented Control Switcher */}
          <div className="p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('production')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'production'
                  ? 'bg-[var(--bg-primary)] text-blue-600 dark:text-blue-400 shadow-xs border border-[var(--border-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <DocumentArrowDown24Filled className="w-4 h-4" />
              <span>{t('viewModeProduction')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mockups')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'mockups'
                  ? 'bg-[var(--bg-primary)] text-blue-600 dark:text-blue-400 shadow-xs border border-[var(--border-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Eye24Filled className="w-4 h-4" />
              <span>{t('viewModeMockups')}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* MODE 1: DIRECT UPLOAD PRODUCTION ASSETS (DEFAULT) */}
          {/* ========================================================================= */}
          {viewMode === 'production' && (
            <div className="space-y-6">
              {/* Batch Download Social Media Pack Button */}
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isExporting}
                className="w-full btn-primary h-12 px-5 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FolderZip24Filled className="w-4 h-4" />
                <span>{t('downloadPackageBtn')}</span>
              </button>

              {/* Direct Upload Ready Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SOCIAL_PLATFORMS.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 flex flex-col justify-between min-w-0 overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Platform Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2 min-w-0">
                          {getPlatformLogo(p.id, 'w-4.5 h-4.5 flex-shrink-0')}
                          <span className="font-black text-xs text-[var(--text-primary)] truncate">{p.name}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 font-black text-[var(--text-secondary)] flex-shrink-0">
                          {p.width} × {p.height} px
                        </span>
                      </div>

                      {/* Centered Avatar Display */}
                      <div className="py-2 flex items-center justify-center">
                        {renderAvatarPreview(90)}
                      </div>

                      {/* Specs info */}
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed text-center min-h-[32px]">
                        {t(p.specKey)}
                      </p>
                    </div>

                    {/* Download & Copy CTA */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2 w-full min-w-0">
                      <button
                        type="button"
                        onClick={() => handleDownload(p.id, p.width, p.height)}
                        disabled={isExporting}
                        className="btn-primary flex-1 min-w-0 h-9 px-3 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        title={t('downloadForPlatform', { platform: p.name })}
                      >
                        <ArrowDownload24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{t('download')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyImage(p.id, p.width, p.height)}
                        className="h-9 w-9 min-w-[36px] rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs hover:bg-[var(--bg-secondary)] hover:border-[#2BB5FF]/40 active:scale-95 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
                        title={t('copyAvatarPng')}
                        aria-label={t('copyAvatarPng')}
                      >
                        {copiedKey === p.id ? (
                          <Checkmark24Filled className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy24Filled className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: LIVE CONTEXT MOCKUPS */}
          {/* ========================================================================= */}
          {viewMode === 'mockups' && (
            <div className="space-y-6">
              {/* Social Platform Outlet Selector */}
              <CustomSelect
                label={t('selectOutlet')}
                value={selectedOutlet}
                onChange={(val) => setSelectedOutlet(val as SocialOutlet)}
                options={[
                  {
                    value: 'all',
                    label: t('allOutlets'),
                    icon: <Globe24Regular className="w-4 h-4 text-[var(--text-secondary)]" />,
                  },
                  ...SOCIAL_PLATFORMS.map((p) => ({
                    value: p.id,
                    label: p.name,
                    icon: getPlatformLogo(p.id, 'w-4 h-4 flex-shrink-0'),
                  })),
                ]}
              />

              {/* Multi-Platform Live Outlet Simulation Cards */}
              <div className="space-y-6">
                {/* 1. INSTAGRAM PROFILE CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'instagram') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('instagram', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewInstagram')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('instagram', 1080, 1080)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>1080 × 1080</span>
                      </button>
                    </div>

                    {/* Instagram Header Mock */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 max-w-xl mx-auto">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1 font-black">
                          @{handle}
                          {verifiedBadge !== 'none' && <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-blue-500" />}
                        </span>
                        <span>•••</span>
                      </div>

                      <div className="flex items-center gap-6">
                        {renderAvatarPreview(76, 'circle')}
                        <div className="flex-1 grid grid-cols-3 text-center gap-2">
                          <div>
                            <span className="block font-black text-sm sm:text-base">142</span>
                            <span className="text-[10px] text-slate-500">posts</span>
                          </div>
                          <div>
                            <span className="block font-black text-sm sm:text-base">12.4K</span>
                            <span className="text-[10px] text-slate-500">followers</span>
                          </div>
                          <div>
                            <span className="block font-black text-sm sm:text-base">380</span>
                            <span className="text-[10px] text-slate-500">following</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <h5 className="font-extrabold">{brandName}</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{tagline}</p>
                        <a href={fullBookingUrl} target="_blank" rel="noreferrer" className="text-blue-500 font-semibold text-[11px] block hover:underline">
                          🔗 getairbook.com/book/{bookingSlug}
                        </a>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-1">
                        <button className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">Following</button>
                        <button className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">Message</button>
                        <button className="py-1.5 rounded-lg bg-blue-600 text-white text-center font-black">Book Now</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LINKEDIN COMPANY CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'linkedin') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('linkedin', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewLinkedIn')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('linkedin', 400, 400)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>400 × 400</span>
                      </button>
                    </div>

                    {/* LinkedIn Card Mock */}
                    <div className="rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden max-w-xl mx-auto">
                      <div className="h-20 bg-gradient-to-r from-[#0077B5] to-[#004182]" />
                      <div className="px-5 pb-5 space-y-3 relative">
                        <div className="flex items-end justify-between -mt-10">
                          {renderAvatarPreview(80, 'circle')}
                          <button className="px-4 py-1.5 rounded-full bg-[#0077B5] text-white text-xs font-bold hover:bg-[#005582] transition-colors">
                            + Follow
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-base font-black">{brandName}</h5>
                            <CheckmarkCircle24Filled className="w-4 h-4 text-[#0077B5]" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {tagline || 'Bespoke Salon Studio & Booking Technology'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            San Francisco, CA · 500+ connections · Verified Business
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. X (TWITTER) PROFILE CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'x') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('x', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewX')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('x', 400, 400)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>400 × 400</span>
                      </button>
                    </div>

                    {/* X Header Mock */}
                    <div className="rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden max-w-xl mx-auto">
                      <div className="h-20 bg-gradient-to-r from-slate-800 to-slate-950" />
                      <div className="px-5 pb-5 space-y-3">
                        <div className="flex items-end justify-between -mt-10">
                          {renderAvatarPreview(76, 'circle')}
                          <button className="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black">
                            Follow
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <h5 className="text-base font-black">{brandName}</h5>
                            <CheckmarkCircle24Filled className="w-4 h-4 text-amber-500" />
                          </div>
                          <span className="text-xs text-slate-500">@{handle}</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-snug">{tagline}</p>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                            <span><strong className="text-slate-900 dark:text-white">380</strong> Following</span>
                            <span><strong className="text-slate-900 dark:text-white">14.8K</strong> Followers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TIKTOK CREATOR CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'tiktok') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('tiktok', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewTikTok')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('tiktok', 200, 200)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>200 × 200</span>
                      </button>
                    </div>

                    {/* TikTok Mock */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-center space-y-3 max-w-xl mx-auto">
                      <div className="inline-block">
                        {renderAvatarPreview(84, 'circle')}
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="font-black text-sm flex items-center justify-center gap-1">
                          @{handle}
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-[#00F2FE]" />
                        </h5>
                        <span className="text-xs text-slate-500">{brandName}</span>
                      </div>

                      <div className="flex items-center justify-center gap-6 text-xs">
                        <div><span className="font-black block">380</span><span className="text-[10px] text-slate-500">Following</span></div>
                        <div><span className="font-black block">24.8K</span><span className="text-[10px] text-slate-500">Followers</span></div>
                        <div><span className="font-black block">89.2K</span><span className="text-[10px] text-slate-500">Likes</span></div>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button className="px-6 py-2 rounded-lg bg-[#FE2C55] text-white font-black text-xs">Follow</button>
                        <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold">Message</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. FACEBOOK BUSINESS PAGE CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'facebook') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('facebook', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewFacebook')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('facebook', 180, 180)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>180 × 180</span>
                      </button>
                    </div>

                    {/* Facebook Mock */}
                    <div className="rounded-2xl bg-white dark:bg-[#18191A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden max-w-xl mx-auto">
                      <div className="h-24 bg-gradient-to-r from-[#1877F2] to-[#0C5DC7]" />
                      <div className="px-5 pb-5 space-y-3 relative">
                        <div className="flex items-end justify-between -mt-12">
                          {renderAvatarPreview(84, 'circle')}
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-1.5 rounded-lg bg-[#1877F2] text-white font-black text-xs">
                              Book Now
                            </button>
                            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                              Message
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-base font-black">{brandName}</h5>
                            <CheckmarkCircle24Filled className="w-4 h-4 text-[#1877F2]" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {tagline || 'Beauty & Wellness Studio · 4.9 ★ (120+ reviews)'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            12.8K likes · 14.2K followers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. YOUTUBE CHANNEL CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'youtube') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('youtube', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewYouTube')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('youtube', 800, 800)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>800 × 800</span>
                      </button>
                    </div>

                    {/* YouTube Mock */}
                    <div className="rounded-2xl bg-white dark:bg-[#0F0F0F] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden max-w-xl mx-auto">
                      <div className="h-20 bg-gradient-to-r from-red-600 to-rose-700" />
                      <div className="p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {renderAvatarPreview(80, 'circle')}
                          <div className="space-y-1 flex-1">
                            <h5 className="text-base font-black flex items-center gap-1">
                              {brandName}
                              <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-slate-400" />
                            </h5>
                            <p className="text-xs text-slate-500 font-mono">@{handle} · 24.8K subscribers · 128 videos</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{tagline}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black">
                            Subscribe
                          </button>
                          <button className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. WHATSAPP BUSINESS CHAT CARD */}
                {(selectedOutlet === 'all' || selectedOutlet === 'whatsapp') && (
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        {getPlatformLogo('whatsapp', 'w-4.5 h-4.5 flex-shrink-0')}
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                          {t('outletPreviewWhatsApp')}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownload('whatsapp', 500, 500)}
                        className="btn-primary h-7 px-3 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowDownload24Filled className="w-3 h-3" />
                        <span>500 × 500</span>
                      </button>
                    </div>

                    {/* WhatsApp Chat Mock */}
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
                      {/* WhatsApp Header */}
                      <div className="p-3.5 bg-[#075E54] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {renderAvatarPreview(42, 'circle')}
                          <div>
                            <h5 className="font-black text-xs leading-tight flex items-center gap-1">
                              {brandName}
                              <CheckmarkCircle24Filled className="w-3 h-3 text-[#25D366]" />
                            </h5>
                            <span className="text-[10px] text-emerald-200">{t('onlineStatusNow')}</span>
                          </div>
                        </div>
                        <span className="text-xs">📞 📹 ⁝</span>
                      </div>

                      {/* Chat Area */}
                      <div className="p-4 bg-[#ECE5DD] dark:bg-[#0B141A] space-y-2 text-xs">
                        <div className="p-3 rounded-2xl bg-white dark:bg-[#1F2C34] text-slate-900 dark:text-white max-w-[85%] shadow-xs space-y-1">
                          <p className="leading-relaxed">
                            Hello! 👋 Welcome to {brandName}. You can book your appointment online 24/7 with zero commission fee:
                          </p>
                          <a href={fullBookingUrl} target="_blank" rel="noreferrer" className="text-blue-500 font-bold block truncate">
                            {fullBookingUrl}
                          </a>
                          <span className="text-[9px] text-slate-400 block text-right">09:41 AM ✓✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialAvatarsStudio;
