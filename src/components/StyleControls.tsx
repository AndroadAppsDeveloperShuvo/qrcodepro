import { useRef } from 'react';
import { FrameStyle, QRTheme, CenterLogoShape, PhotoDotsMode } from '../types';
import { COLOR_PRESETS } from '../data/themes';
import {
  Upload,
  Palette,
  Shield,
  X,
  Sparkles,
  Sliders,
  CheckCircle2,
  Image as ImageIcon,
  Circle,
  Square,
  Copy
} from 'lucide-react';

// Popular 1-click Preset Icons for Center Logo
const POPULAR_CENTER_ICONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="%2325D366"/><path fill="%23FFFFFF" d="M34.5 28.5c-.5-.3-3-1.5-3.5-1.7-.5-.2-.8-.3-1.1.2s-1.3 1.7-1.6 2c-.3.3-.6.4-1.1.1-2.9-1.4-4.8-3.1-6.1-5.4-.3-.5 0-.8.2-1 .2-.2.5-.6.8-.9.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.9-.2-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.8h-1c-.3 0-.9.1-1.4.6-.5.6-1.9 1.9-1.9 4.6s2 5.3 2.2 5.7c.3.4 3.9 6 9.4 8.4 4.6 2 5.5 1.6 6.5 1.5 1-.1 3.2-1.3 3.6-2.6.5-1.2.5-2.3.4-2.5-.2-.3-.5-.4-1-.7z"/></svg>`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="%231877F2"/><path fill="%23FFFFFF" d="M26.7 38V24.8h4.4l.7-5.1h-5.1v-3.3c0-1.5.4-2.5 2.5-2.5h2.7V9.3c-.5-.1-2.1-.2-3.9-.2-3.9 0-6.6 2.4-6.6 6.7v3.9h-4.4v5.1h4.4V38h5.7z"/></svg>`
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="46" height="46" x="1" y="1" rx="12" fill="%23FF0000"/><polygon points="19,14 33,24 19,34" fill="%23FFFFFF"/></svg>`
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23FFD521"/><stop offset="50%" stop-color="%23F50000"/><stop offset="100%" stop-color="%23B700B7"/></linearGradient></defs><rect width="46" height="46" x="1" y="1" rx="12" fill="url(%23ig)"/><rect width="26" height="26" x="11" y="11" rx="7" fill="none" stroke="%23FFFFFF" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="none" stroke="%23FFFFFF" stroke-width="3"/><circle cx="31.5" cy="16.5" r="1.5" fill="%23FFFFFF"/></svg>`
  },
  {
    id: 'website',
    name: 'Website',
    color: '#0284C7',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="%230284C7"/><circle cx="24" cy="24" r="14" fill="none" stroke="%23FFFFFF" stroke-width="2.5"/><ellipse cx="24" cy="24" rx="6" ry="14" fill="none" stroke="%23FFFFFF" stroke-width="2.5"/><line x1="10" y1="24" x2="38" y2="24" stroke="%23FFFFFF" stroke-width="2.5"/><line x1="14" y1="17" x2="34" y2="17" stroke="%23FFFFFF" stroke-width="2"/><line x1="14" y1="31" x2="34" y2="31" stroke="%23FFFFFF" stroke-width="2"/></svg>`
  },
  {
    id: 'phone',
    name: 'Call',
    color: '#059669',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="%23059669"/><path fill="%23FFFFFF" d="M15 19.5c2.2 4.4 5.6 7.8 10 10l3.3-3.3c.4-.4 1-.5 1.5-.3 1.6.6 3.4 1 5.2 1 .8 0 1.5.7 1.5 1.5v5.3c0 .8-.7 1.5-1.5 1.5C21.4 35.2 12.8 26.6 13 15.5c0-.8.7-1.5 1.5-1.5h5.3c.8 0 1.5.7 1.5 1.5 0 1.8.4 3.6 1 5.2.2.5.1 1.1-.3 1.5l-3.3 3.3z"/></svg>`
  }
];

// Sample ready-to-test photos for Photo Dots
const SAMPLE_DOT_PHOTOS = [
  {
    name: 'রঙিন ফুল (Floral)',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'প্রকৃতি (Nature)',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'সিটি লাইটস (City)',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=80'
  }
];

interface StyleControlsProps {
  currentTheme: QRTheme;
  frameStyle: FrameStyle;
  onChangeFrameStyle: (style: FrameStyle) => void;

  // 1. Center Image / Logo Controls (QR এর মাঝের ছবি)
  showCenterLogo: boolean;
  onToggleShowCenterLogo: (show: boolean) => void;
  centerLogoFile: string | null;
  onSelectCenterLogoFile: (dataUrl: string | null) => void;
  centerLogoUrl: string;
  onChangeCenterLogoUrl: (url: string) => void;
  centerLogoShape: CenterLogoShape;
  onChangeCenterLogoShape: (shape: CenterLogoShape) => void;

  // 2. Photo as QR Dots Controls (QR এর ডটে ছবি)
  photoDotsActive: boolean;
  onTogglePhotoDots: (active: boolean) => void;
  photoDotsFile: string | null;
  onSelectPhotoDotsFile: (dataUrl: string | null) => void;
  photoDotsUrl: string;
  onChangePhotoDotsUrl: (url: string) => void;
  photoDotsMode: PhotoDotsMode;
  onChangePhotoDotsMode: (mode: PhotoDotsMode) => void;
  photoContrast: number;
  onChangePhotoContrast: (contrast: number) => void;

  // Convenience copy between center and dots
  onCopyCenterToDots?: () => void;
  onCopyDotsToCenter?: () => void;

  // 3. Custom Colors
  customColorsEnabled: boolean;
  onToggleCustomColors: (val: boolean) => void;
  fgColor: string;
  onChangeFgColor: (color: string) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
  onApplyColorPreset: (fg: string, bg: string) => void;
}

export function StyleControls({
  currentTheme,
  frameStyle,
  onChangeFrameStyle,
  showCenterLogo,
  onToggleShowCenterLogo,
  centerLogoFile,
  onSelectCenterLogoFile,
  centerLogoUrl,
  onChangeCenterLogoUrl,
  centerLogoShape,
  onChangeCenterLogoShape,
  photoDotsActive,
  onTogglePhotoDots,
  photoDotsFile,
  onSelectPhotoDotsFile,
  photoDotsUrl,
  onChangePhotoDotsUrl,
  photoDotsMode,
  onChangePhotoDotsMode,
  photoContrast,
  onChangePhotoContrast,
  onCopyCenterToDots,
  onCopyDotsToCenter,
  customColorsEnabled,
  onToggleCustomColors,
  fgColor,
  onChangeFgColor,
  bgColor,
  onChangeBgColor,
  onApplyColorPreset
}: StyleControlsProps) {
  const centerFileInputRef = useRef<HTMLInputElement | null>(null);
  const dotsFileInputRef = useRef<HTMLInputElement | null>(null);

  // Center logo upload
  const handleCenterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('অনুগ্রহ করে ৮ মেগাবাইটের কম সাইজের ছবি নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSelectCenterLogoFile(reader.result as string);
      onToggleShowCenterLogo(true);
    };
    reader.readAsDataURL(file);
  };

  const handleClearCenterLogo = () => {
    onSelectCenterLogoFile(null);
    onChangeCenterLogoUrl('');
    onToggleShowCenterLogo(false);
    if (centerFileInputRef.current) centerFileInputRef.current.value = '';
  };

  // Photo dots upload
  const handleDotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('অনুগ্রহ করে ৮ মেগাবাইটের কম সাইজের ছবি নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSelectPhotoDotsFile(reader.result as string);
      onTogglePhotoDots(true);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhotoDots = () => {
    onSelectPhotoDotsFile(null);
    onChangePhotoDotsUrl('');
    onTogglePhotoDots(false);
    if (dotsFileInputRef.current) dotsFileInputRef.current.value = '';
  };

  const activeCenterSrc = centerLogoFile || centerLogoUrl;
  const hasCenterImage = Boolean(activeCenterSrc && showCenterLogo);

  const activeDotsSrc = photoDotsFile || photoDotsUrl;
  const hasDotsImage = Boolean(activeDotsSrc && photoDotsActive);

  return (
    <div className="space-y-4" id="style-controls-container">
      {/* ======================================================== */}
      {/* 1. QR এর মাঝের ছবি / লোগো (CENTER LOGO & IMAGE SYSTEM)     */}
      {/* ======================================================== */}
      <div
        className={`p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 transition-all shadow-xs space-y-3 relative overflow-hidden ${
          hasCenterImage
            ? 'border-indigo-500/50 dark:border-indigo-500/40 bg-indigo-50/10'
            : 'border-slate-200/90 dark:border-slate-800/80'
        }`}
        id="center-logo-section"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>QR এর মাঝের ছবি / লোগো</span>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  সেন্টার লোগো
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                কিউআর কোডের ঠিক মাঝখানে নিজের ছবি বা লোগো বসান
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasCenterImage && (
              <button
                type="button"
                onClick={handleClearCenterLogo}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="মাঝের ছবি মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleShowCenterLogo(!showCenterLogo)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                showCenterLogo && (centerLogoFile || centerLogoUrl)
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {showCenterLogo && (centerLogoFile || centerLogoUrl) ? 'সক্রিয়' : 'চালু করুন'}
            </button>
          </div>
        </div>

        {/* Upload Trigger & Active Center Thumbnail */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center">
          <input
            type="file"
            ref={centerFileInputRef}
            onChange={handleCenterUpload}
            accept="image/*"
            className="hidden"
            id="center-logo-file-input"
          />

          <button
            type="button"
            onClick={() => centerFileInputRef.current?.click()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>গ্যালারি থেকে মাঝের ছবি আপলোড করুন</span>
          </button>

          {/* Active Center Photo Thumbnail */}
          {activeCenterSrc && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
              <div
                className={`w-8 h-8 overflow-hidden border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shrink-0 ${
                  centerLogoShape === 'circle'
                    ? 'rounded-full'
                    : centerLogoShape === 'square'
                    ? 'rounded-xs'
                    : 'rounded-lg'
                }`}
              >
                <img
                  src={activeCenterSrc}
                  alt="Center preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>মাঝের ছবি সক্রিয়</span>
                </span>
                <span className="text-[10px] text-slate-400">QR এর সেন্টারে প্রদর্শিত</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Logo Shape & Quick Actions when an image is selected */}
        {activeCenterSrc && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                মাঝের ছবির আকৃতি (Shape):
              </span>
              {onCopyCenterToDots && (
                <button
                  type="button"
                  onClick={onCopyCenterToDots}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>এই ছবিটি কিউআর ডটেও দিন</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChangeCenterLogoShape('rounded')}
                className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  centerLogoShape === 'rounded'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Square className="w-3.5 h-3.5 rounded-sm" />
                <span>রাউন্ডেড</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeCenterLogoShape('circle')}
                className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  centerLogoShape === 'circle'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>বৃত্তাকার</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeCenterLogoShape('square')}
                className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  centerLogoShape === 'square'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>চারকোনা</span>
              </button>
            </div>
          </div>
        )}

        {/* 1-Click Popular Icon Presets for Center */}
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
            অথবা এক ক্লিকে জনপ্রিয় মাঝের লোগো বেছে নিন:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {POPULAR_CENTER_ICONS.map((icon) => {
              const isActive = centerLogoUrl === icon.dataUrl && showCenterLogo && !centerLogoFile;
              return (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => {
                    onSelectCenterLogoFile(null);
                    onChangeCenterLogoUrl(icon.dataUrl);
                    onToggleShowCenterLogo(true);
                  }}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <img src={icon.dataUrl} alt={icon.name} className="w-4 h-4 rounded-full" />
                  <span>{icon.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. QR এর ডটে ছবি (PHOTO AS QR DOTS SYSTEM)                */}
      {/* ======================================================== */}
      <div
        className={`p-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 transition-all shadow-xs space-y-3 relative overflow-hidden ${
          hasDotsImage
            ? 'border-blue-500/50 dark:border-blue-500/40 bg-blue-50/10'
            : 'border-slate-200/90 dark:border-slate-800/80'
        }`}
        id="photo-dots-section"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>QR এর ডটে ছবি (Photo Dots)</span>
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  ডট ম্যাট্রিক্স
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                আপনার আপলোড করা ছবিটি কিউআর কোডের ডট আকারে ফুটে উঠবে
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasDotsImage && (
              <button
                type="button"
                onClick={handleClearPhotoDots}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="ডটের ছবি মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onTogglePhotoDots(!photoDotsActive)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                photoDotsActive && (photoDotsFile || photoDotsUrl)
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {photoDotsActive && (photoDotsFile || photoDotsUrl) ? 'সক্রিয়' : 'চালু করুন'}
            </button>
          </div>
        </div>

        {/* Upload Trigger & Active Dots Thumbnail */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center">
          <input
            type="file"
            ref={dotsFileInputRef}
            onChange={handleDotsUpload}
            accept="image/*"
            className="hidden"
            id="photo-dots-file-input"
          />

          <button
            type="button"
            onClick={() => dotsFileInputRef.current?.click()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl border border-dashed border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-950/60 text-xs font-bold text-blue-700 dark:text-blue-300 transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>গ্যালারি থেকে ডটের ছবি আপলোড করুন</span>
          </button>

          {/* Active Dots Photo Thumbnail */}
          {activeDotsSrc && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shrink-0">
                <img
                  src={activeDotsSrc}
                  alt="Dots preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ডটের ছবি সক্রিয়</span>
                </span>
                <span className="text-[10px] text-slate-400">ডট আকারে ফুটে উঠছে</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Photos for Dots */}
        {!activeDotsSrc && (
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              অথবা এক ক্লিকে ডেমো ছবি দিয়ে ডট টেস্ট করুন:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SAMPLE_DOT_PHOTOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => {
                    onSelectPhotoDotsFile(null);
                    onChangePhotoDotsUrl(sample.url);
                    onTogglePhotoDots(true);
                  }}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-400 dark:hover:border-blue-500 text-[11px] font-medium text-slate-700 dark:text-slate-300 shrink-0 transition-colors cursor-pointer"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-4 h-4 rounded-md object-cover"
                  />
                  <span>{sample.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dots Mode & Contrast Controls */}
        {activeDotsSrc && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                ডট স্টাইল মোড:
              </span>
              {onCopyDotsToCenter && (
                <button
                  type="button"
                  onClick={onCopyDotsToCenter}
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>এই ছবি মাঝের লোগোতেও দিন</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangePhotoDotsMode('photo_dots')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  photoDotsMode === 'photo_dots'
                    ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs block font-bold">✨ ছবি দিয়ে ডট</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">সব ডটে ছবি ফুটে উঠবে</span>
              </button>

              <button
                type="button"
                onClick={() => onChangePhotoDotsMode('photo_mosaic')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  photoDotsMode === 'photo_mosaic'
                    ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs block font-bold">🎨 কালার মোজাইক</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">রঙিন পিক্সেল ডট</span>
              </button>
            </div>

            {/* Contrast / Clarity Slider */}
            <div className="pt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>ডট স্পষ্টতা ও স্ক্যান কনট্রাস্ট:</span>
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{photoContrast}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                value={photoContrast}
                onChange={(e) => onChangePhotoContrast(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>উজ্জ্বল ফটো লুক</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ ১০০% ক্যামেরা স্ক্যানযোগ্য
                </span>
                <span>গাঢ় স্পষ্ট ডট</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. রং কাস্টমাইজেশন (CUSTOM COLOR PALETTE)                  */}
      {/* ======================================================== */}
      <div
        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-3"
        id="color-control-section"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                রং কাস্টমাইজেশন (যেকোনো রং বেছে নিন)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                পছন্দমতো কিউআর ও ব্যাকগ্রাউন্ডের রং পরিবর্তন করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleCustomColors(!customColorsEnabled)}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
              customColorsEnabled
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {customColorsEnabled ? 'কাস্টম চালু' : 'কাস্টম রং দিন'}
          </button>
        </div>

        {/* 1-Click Quick Palette Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            দ্রুত রেডিমেড কালার সেট:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_PRESETS.map((preset) => {
              const isActive = fgColor === preset.fg && bgColor === preset.bg;
              return (
                <button
                  key={preset.nameEn}
                  type="button"
                  onClick={() => onApplyColorPreset(preset.fg, preset.bg)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/20 shrink-0"
                    style={{ backgroundColor: preset.fg }}
                  />
                  <span>{preset.nameBn.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Freeform Color Pickers */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                কিউআর কোড রং
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {fgColor}
              </span>
            </div>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => {
                onToggleCustomColors(true);
                onChangeFgColor(e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="QR কোড রং পরিবর্তন"
            />
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                ব্যাকগ্রাউন্ড রং
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {bgColor}
              </span>
            </div>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                onToggleCustomColors(true);
                onChangeBgColor(e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="ব্যাকগ্রাউন্ড রং পরিবর্তন"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ফ্রেম ও কার্ড লেআউট (FRAME STYLE)                     */}
      {/* ======================================================== */}
      <div
        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-2.5"
        id="frame-style-section"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              ফ্রেম ও কার্ড লেআউট (Frame Style)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              ডিফল্ট সাধারণ QR নাকি প্রফেশনাল ফ্রেম
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeFrameStyle('none')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
              frameStyle === 'none'
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs block font-bold">ডিফল্ট সাধারণ QR</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">ফ্রেম ছাড়া</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeFrameStyle('clean_border')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
              frameStyle === 'clean_border'
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs block font-bold">ক্লিন বর্ডার</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">মিনিমাল বর্ডার</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeFrameStyle('badge_card')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
              frameStyle === 'badge_card'
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs block font-bold">কার্ড ফ্রেম</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">SCAN ME ব্যানার</span>
          </button>
        </div>
      </div>
    </div>
  );
}
