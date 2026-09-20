import { useRef } from 'react';
import { CenterLogoShape, PhotoDotsMode } from '../types';
import {
  UploadCloud,
  CheckCircle2,
  X,
  Circle,
  Square,
  Sliders,
  Sparkles,
  ImageIcon
} from 'lucide-react';

// CloudImageUploader without social media icons
interface CloudImageUploaderProps {
  uploadTarget: 'center' | 'dots';
  onSelectUploadTarget: (target: 'center' | 'dots') => void;

  // Center Logo state
  showCenterLogo: boolean;
  onToggleShowCenterLogo: (show: boolean) => void;
  centerLogoFile: string | null;
  onSelectCenterLogoFile: (dataUrl: string | null) => void;
  centerLogoUrl: string;
  onChangeCenterLogoUrl: (url: string) => void;
  centerLogoShape: CenterLogoShape;
  onChangeCenterLogoShape: (shape: CenterLogoShape) => void;

  // Photo Dots state
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

  onCopyCenterToDots?: () => void;
  onCopyDotsToCenter?: () => void;
}

export function CloudImageUploader({
  uploadTarget,
  onSelectUploadTarget,
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
  onChangePhotoContrast
}: CloudImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeCenterSrc = centerLogoFile || centerLogoUrl;
  const hasCenterImage = Boolean(activeCenterSrc && showCenterLogo);

  const activeDotsSrc = photoDotsFile || photoDotsUrl;
  const hasDotsImage = Boolean(activeDotsSrc && photoDotsActive);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('অনুগ্রহ করে ৪ মেগাবাইটের কম সাইজের ছবি আপলোড করুন (Max: 4MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (uploadTarget === 'center') {
        onSelectCenterLogoFile(dataUrl);
        onToggleShowCenterLogo(true);
      } else {
        onSelectPhotoDotsFile(dataUrl);
        onTogglePhotoDots(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('অনুগ্রহ করে ৪ মেগাবাইটের কম সাইজের ছবি আপলোড করুন (Max: 4MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (uploadTarget === 'center') {
        onSelectCenterLogoFile(dataUrl);
        onToggleShowCenterLogo(true);
      } else {
        onSelectPhotoDotsFile(dataUrl);
        onTogglePhotoDots(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCenter = () => {
    onSelectCenterLogoFile(null);
    onChangeCenterLogoUrl('');
    onToggleShowCenterLogo(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearDots = () => {
    onSelectPhotoDotsFile(null);
    onChangePhotoDotsUrl('');
    onTogglePhotoDots(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeCurrentSrc = uploadTarget === 'center' ? activeCenterSrc : activeDotsSrc;

  return (
    <div className="space-y-3" id="cloud-uploader-container">
      {/* Target Selector Tabs (মাঝের ছবি নাকি ডটের ছবি) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          ছবি নির্বাচন করুন (Image Uploader)
        </span>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onSelectUploadTarget('center')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              uploadTarget === 'center'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>মাঝের ছবি</span>
            {hasCenterImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>

          <button
            type="button"
            onClick={() => onSelectUploadTarget('dots')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              uploadTarget === 'dots'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ডটের ছবি</span>
            {hasDotsImage && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="cloud-image-file-input"
      />

      {/* Cloud Uploader Box (Exactly matching Screenshot 1) */}
      {!activeCurrentSrc ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-blue-500/80 hover:border-blue-600 dark:border-blue-400/80 rounded-2xl p-6 sm:p-8 text-center bg-blue-50/20 dark:bg-blue-950/10 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer group"
        >
          {/* Blue Cloud Icon matching screenshot */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            Drag & Drop your image here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            or click to browse (Max: 4MB)
          </p>

          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2.5">
            {uploadTarget === 'center'
              ? 'গ্যালারি থেকে কিউআরের মাঝের ছবি বা লোগো দিন'
              : 'ছবি দিয়ে কিউআর কোডের ডট তৈরি করতে ক্লিক করুন'}
          </p>
        </div>
      ) : (
        /* When an image is already uploaded, show thumbnail and action buttons */
        <div className="p-4 rounded-2xl border-2 border-blue-500/60 dark:border-blue-400/50 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 overflow-hidden border-2 border-blue-500 bg-white dark:bg-slate-900 shrink-0 shadow-xs ${
                  uploadTarget === 'center' && centerLogoShape === 'circle'
                    ? 'rounded-full'
                    : uploadTarget === 'center' && centerLogoShape === 'square'
                    ? 'rounded-xs'
                    : 'rounded-xl'
                }`}
              >
                <img
                  src={activeCurrentSrc}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {uploadTarget === 'center' ? 'মাঝের ছবি সক্রিয়' : 'ডটের ছবি সক্রিয়'}
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {uploadTarget === 'center' ? 'QR সেন্টারে প্রদর্শিত হচ্ছে' : 'QR ডট হিসেবে ফুটে উঠেছে'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                পরিবর্তন
              </button>

              <button
                type="button"
                onClick={uploadTarget === 'center' ? handleClearCenter : handleClearDots}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                title="ছবি মুছুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-controls for Center: Shape */}
          {uploadTarget === 'center' && (
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                মাঝের আকার:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeCenterLogoShape('rounded')}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    centerLogoShape === 'rounded'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Square className="w-3 h-3 rounded-xs" />
                  <span>রাউন্ডেড</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeCenterLogoShape('circle')}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    centerLogoShape === 'circle'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Circle className="w-3 h-3" />
                  <span>বৃত্ত</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeCenterLogoShape('square')}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                    centerLogoShape === 'square'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Square className="w-3 h-3" />
                  <span>চারকোনা</span>
                </button>
              </div>
            </div>
          )}

          {/* Sub-controls for Dots: Style mode & Contrast */}
          {uploadTarget === 'dots' && (
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangePhotoDotsMode('photo_dots')}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    photoDotsMode === 'photo_dots'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  ✨ ছবি দিয়ে ডট
                </button>

                <button
                  type="button"
                  onClick={() => onChangePhotoDotsMode('photo_mosaic')}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    photoDotsMode === 'photo_mosaic'
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  🎨 কালার মোজাইক
                </button>
              </div>

              {/* Contrast slider */}
              <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-blue-600" />
                    <span>ডট স্পষ্টতা: {photoContrast}%</span>
                  </span>
                  <span className="text-emerald-600 font-bold">✓ ১০০% স্ক্যানযোগ্য</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={photoContrast}
                  onChange={(e) => onChangePhotoContrast(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
