// DiceBear Thumbs Avatar & Calendar Color Sync System

export const PROVIDER_COLOR_PALETTE = [
  '#007AFF', // Electric Blue
  '#34C759', // Emerald Green
  '#FF9500', // Sunset Orange
  '#AF52DE', // Vibrant Purple
  '#FF2D55', // Raspberry Pink
  '#5AC8FA', // Sky Cyan
  '#FFCC00', // Golden Amber
  '#5856D6', // Royal Indigo
];

export type ColorMode = 'auto' | 'custom';

/**
 * Returns a DiceBear Thumbs SVG Avatar URL with animation options turned on.
 */
export function getThumbsAvatarUrl(
  seed: string,
  colorHex?: string,
  variant: 'fastest' | 'fast' | 'medium' | 'slow' | 'slowest' = 'fastest'
): string {
  const cleanSeed = encodeURIComponent(seed.trim().toLowerCase());
  const cleanColor = colorHex ? colorHex.replace('#', '') : '007aff';

  // Uses DiceBear 10.x API with native SVG animation parameters
  return `https://api.dicebear.com/10.x/thumbs/svg?seed=${cleanSeed}&shape1Color=${cleanColor}&shape2Color=ffffff&animationVariant=${variant}&animationProbability=100`;
}

/**
 * Resolves the effective avatar URL (custom photo vs DiceBear Thumbs).
 */
export function getAvatarUrl(name: string, avatarUrl?: string | null, colorHex?: string): string {
  if (avatarUrl && avatarUrl.trim().length > 0 && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  return getThumbsAvatarUrl(name, colorHex);
}

/**
 * Resolves provider color based on color mode (system auto-balanced vs custom selected).
 */
export function getProviderColor(staffIndex: number, customColor?: string | null, colorMode: ColorMode = 'auto'): string {
  if (colorMode === 'custom' && customColor && customColor.trim().length > 0) {
    return customColor;
  }
  // Auto-balanced assignment from curated palette based on index
  return PROVIDER_COLOR_PALETTE[staffIndex % PROVIDER_COLOR_PALETTE.length];
}
