import { useState } from 'react';
import { Copy, Check, ZoomIn, Sparkles } from 'lucide-react';

interface ResultSectionProps {
  dataUrl: string | null;
  text: string;
  themeNameBn: string;
  isPhotoMode?: boolean;
  hasCenterLogo?: boolean;
  onDownload: () => void;
  onReset: () => void;
  onCopySuccess: () => void;
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function ResultSection({
  dataUrl,
  text,
  themeNameBn,
  isPhotoMode,
  hasCenterLogo,
  onNotify
}: ResultSectionProps) {
  const [copiedImage, setCopiedImage] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!dataUrl) return null;

  const handleCopyImage = async () => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
      onNotify('success', 'কিউআর কোডের ছবি ক্লিপবোর্ডে কপি হয়েছে!');
    } catch (err) {
      console.error('Clipboard write error', err);
      onNotify('info', 'ইমেজ কপি ব্রাউজারে সাপোর্টেড না হলে সরাসরি ডাউনলোড করুন।');
    }
  };

  return (
    <div className="space-y-3 pt-2" id="result-section">
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center">
        {/* Top Info Bar */}
        <div className="w-full flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200/70 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>প্রিভিউ: {themeNameBn}</span>
            {hasCenterLogo && (
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded-full">
                🏷️ লোগো
              </span>
            )}
            {isPhotoMode && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-full">
                ✨ ছবির ডট
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{isZoomed ? 'স্বাভাবিক ভিউ' : 'বড় ভিউ'}</span>
          </button>
        </div>

        {/* The QR Display */}
        <div
          className={`relative rounded-2xl overflow-hidden p-2.5 transition-all duration-300 ${
            isZoomed
              ? 'w-72 sm:w-80 shadow-2xl ring-2 ring-blue-500/30'
              : 'w-56 sm:w-60 shadow-md ring-1 ring-slate-200 dark:ring-slate-800'
          } bg-white flex items-center justify-center`}
        >
          <img
            src={dataUrl}
            alt="Generated QR Code"
            className="w-full h-auto aspect-square object-contain block select-none"
          />
        </div>

        {/* Scan notice and Copy Image */}
        <div className="flex items-center justify-between w-full mt-3 pt-2 text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>১০০% স্পষ্ট ও দ্রুত স্ক্যানযোগ্য</span>
          </span>

          <button
            type="button"
            onClick={handleCopyImage}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedImage ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>ইমেজ কপি</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
