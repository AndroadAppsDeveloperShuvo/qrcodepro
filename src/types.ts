export type ThemeId =
  | 'classic_mono'
  | 'navy_prestige'
  | 'emerald_luxe'
  | 'royal_purple'
  | 'sunset_crimson'
  | 'carbon_dark'
  | 'cyber_teal'
  | 'warm_amber'
  | 'minimal_clean';

export type FrameStyle = 'none' | 'clean_border' | 'badge_card';

export type DotShape = 'square' | 'rounded' | 'dots' | 'smooth';

export type CornerSquareStyle = 'square' | 'rounded' | 'circle' | 'leaf';

export type CenterLogoShape = 'rounded' | 'circle' | 'square';

export type PhotoDotsMode = 'photo_dots' | 'photo_mosaic';

export type PhotoMode = 'photo_dots' | 'photo_mosaic' | 'center_logo';

export interface QRTheme {
  id: ThemeId;
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  dotShape: DotShape;
  cornerStyle: CornerSquareStyle;
  tagline: string;
}

export interface QROptions {
  text: string;
  themeId: ThemeId;
  frameStyle: FrameStyle;

  // Center Logo / Image (মাঝের ছবি)
  showCenterLogo: boolean;
  centerLogoFile: string | null; // User's uploaded picture for center
  centerLogoUrl: string; // URL or preset icon for center
  centerLogoShape: CenterLogoShape; // rounded, circle, square

  // Photo Dots (ডটের ছবি)
  photoDotsActive: boolean;
  photoDotsFile: string | null; // User's uploaded picture for dots
  photoDotsUrl: string;
  photoDotsMode: PhotoDotsMode;
  photoContrast: number; // 30 to 95, default ~65

  // Colors & Resolutions
  fgColor: string;
  bgColor: string;
  resolution: number; // 1024, 1536, 2048
  customColorsEnabled: boolean;

  // Backward compatibility fields
  customLogoUrl?: string;
  customLogoFile?: string | null;
  photoMode?: PhotoMode;
}

// Backward compatibility alias for AnimalThemeId
export type AnimalThemeId = ThemeId;
export type AnimalTheme = QRTheme;
