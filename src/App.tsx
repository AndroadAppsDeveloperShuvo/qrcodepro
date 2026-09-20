import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { QR_THEMES } from './data/themes';
import { ThemeId, FrameStyle, QROptions, CenterLogoShape, PhotoDotsMode } from './types';
import { renderQRCode } from './utils/qrDrawer';
import { Header } from './components/Header';
import { CloudImageUploader } from './components/CloudImageUploader';
import { ThemeSelector } from './components/ThemeSelector';
import { ResultSection } from './components/ResultSection';
import { SavedLinksPills, SavedLinkItem } from './components/SavedLinksPills';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Wand2, Download, Link as LinkIcon } from 'lucide-react';

export default function App() {
  // Theme & Dark mode (defaults to clean light mode unless explicitly set to 'dark')
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore
    }
    return false;
  });

  // Core Form State
  const [text, setText] = useState<string>('https://google.com');
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>('classic_mono');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [resolution, setResolution] = useState<number>(1024);

  // Uploader target tab ('center' for logo, 'dots' for photo dots)
  const [uploadTarget, setUploadTarget] = useState<'center' | 'dots'>('center');

  // 1. Center Image / Logo State
  const [showCenterLogo, setShowCenterLogo] = useState<boolean>(false);
  const [centerLogoFile, setCenterLogoFile] = useState<string | null>(null);
  const [centerLogoUrl, setCenterLogoUrl] = useState<string>('');
  const [centerLogoShape, setCenterLogoShape] = useState<CenterLogoShape>('rounded');

  // 2. Photo as QR Dots State
  const [photoDotsActive, setPhotoDotsActive] = useState<boolean>(false);
  const [photoDotsFile, setPhotoDotsFile] = useState<string | null>(null);
  const [photoDotsUrl, setPhotoDotsUrl] = useState<string>('');
  const [photoDotsMode, setPhotoDotsMode] = useState<PhotoDotsMode>('photo_dots');
  const [photoContrast, setPhotoContrast] = useState<number>(65);

  // 3. Custom Colors
  const [customColorsEnabled, setCustomColorsEnabled] = useState<boolean>(false);
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  // Generated QR output
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Saved Profiles / Links (matching screenshot)
  const [savedLinks, setSavedLinks] = useState<SavedLinkItem[]>(() => {
    try {
      const cached = localStorage.getItem('saved_qr_links');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // fallback
    }
    return [
      { id: '1', name: 'Google', url: 'https://google.com' },
      { id: '2', name: 'Facebook', url: 'https://facebook.com' },
      { id: '3', name: 'YouTube', url: 'https://youtube.com' },
      { id: '4', name: 'Shuvo', url: 'https://androadappsdevelopershuvo.github.io' }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_qr_links', JSON.stringify(savedLinks));
    } catch {
      // ignore
    }
  }, [savedLinks]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text: message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Synchronize Dark Theme with HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      try {
        localStorage.setItem('theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      try {
        localStorage.setItem('theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDark]);

  const currentTheme = useMemo(() => {
    return QR_THEMES.find((t) => t.id === selectedThemeId) || QR_THEMES[0];
  }, [selectedThemeId]);

  // Update default colors on theme change
  useEffect(() => {
    if (!customColorsEnabled) {
      setFgColor(currentTheme.primaryColor);
      setBgColor(currentTheme.bgColor);
    }
  }, [currentTheme, customColorsEnabled]);

  // Helper to safely load image
  const loadImageElement = (src: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // Generation Handler
  const handleGenerateQR = useCallback(async (silent = false) => {
    if (!text.trim()) {
      if (!silent) addToast('error', 'অনুগ্রহ করে কোনো টেক্সট বা ওয়েবসাইটের লিঙ্ক লিখুন!');
      return;
    }

    setIsGenerating(true);

    try {
      const centerSrc = showCenterLogo ? (centerLogoFile || centerLogoUrl.trim()) : '';
      const dotsSrc = photoDotsActive ? (photoDotsFile || photoDotsUrl.trim()) : '';

      const [centerLogoImg, photoDotsImg] = await Promise.all([
        loadImageElement(centerSrc),
        loadImageElement(dotsSrc)
      ]);

      const options: QROptions = {
        text,
        themeId: selectedThemeId,
        frameStyle,
        showCenterLogo,
        centerLogoFile,
        centerLogoUrl,
        centerLogoShape,
        photoDotsActive,
        photoDotsFile,
        photoDotsUrl,
        photoDotsMode,
        photoContrast,
        fgColor,
        bgColor,
        resolution,
        customColorsEnabled
      };

      const result = await renderQRCode(options, currentTheme, {
        centerLogo: centerLogoImg,
        photoDots: photoDotsImg
      });

      setGeneratedDataUrl(result.dataUrl);

      if (!silent) {
        addToast('success', 'কিউআর কোড তৈরি সম্পন্ন হয়েছে! 🎉');
      }
    } catch (err) {
      console.error('Failed to generate QR Code', err);
      if (!silent) addToast('error', 'কিউআর কোড তৈরিতে সমস্যা হয়েছে!');
    } finally {
      setIsGenerating(false);
    }
  }, [
    text,
    selectedThemeId,
    frameStyle,
    showCenterLogo,
    centerLogoFile,
    centerLogoUrl,
    centerLogoShape,
    photoDotsActive,
    photoDotsFile,
    photoDotsUrl,
    photoDotsMode,
    photoContrast,
    fgColor,
    bgColor,
    resolution,
    customColorsEnabled,
    currentTheme,
    addToast
  ]);

  // Initial and reactive generation
  useEffect(() => {
    handleGenerateQR(true);
  }, [
    text,
    selectedThemeId,
    frameStyle,
    showCenterLogo,
    centerLogoFile,
    centerLogoUrl,
    centerLogoShape,
    photoDotsActive,
    photoDotsFile,
    photoDotsUrl,
    photoDotsMode,
    photoContrast,
    customColorsEnabled,
    fgColor,
    bgColor,
    resolution
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Download Handler
  const handleDownload = () => {
    if (!generatedDataUrl) {
      handleGenerateQR(false);
      return;
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 }
      });

      const link = document.createElement('a');
      link.download = `qrcode_${Date.now()}.png`;
      link.href = generatedDataUrl;
      link.click();
      addToast('success', 'HD কিউআর কোড ডাউনলোড সম্পন্ন হয়েছে! 📥');
    } catch (err) {
      console.error('Download error', err);
      addToast('error', 'ডাউনলোডে সমস্যা দেখা দিয়েছে।');
    }
  };

  const handleReset = () => {
    setText('https://google.com');
    setShowCenterLogo(false);
    setCenterLogoFile(null);
    setCenterLogoUrl('');
    setCenterLogoShape('rounded');
    setPhotoDotsActive(false);
    setPhotoDotsFile(null);
    setPhotoDotsUrl('');
    setSelectedThemeId('classic_mono');
    setFrameStyle('none');
    setCustomColorsEnabled(false);
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    addToast('info', 'ডিফল্ট সেটিংসে রিসেট করা হয়েছে');
  };

  const handleAddSavedLink = (name: string, url: string) => {
    const newItem: SavedLinkItem = {
      id: Date.now().toString(),
      name,
      url
    };
    setSavedLinks((prev) => [...prev, newItem]);
    addToast('success', `"${name}" প্রফাইলে সেভ করা হয়েছে`);
  };

  const handleRemoveSavedLink = (id: string) => {
    setSavedLinks((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-[#edf2f7] dark:bg-[#0b1220] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 transition-colors duration-200 selection:bg-blue-600 selection:text-white"
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Centered Floating Card (Exact design language from screenshot) */}
      <main
        id="generator-card"
        className="w-full max-w-[480px] bg-white dark:bg-[#161f30] rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-slate-100/90 dark:border-slate-800/80 p-5 sm:p-7 relative transition-all"
      >
        {/* Header: Title on Left + Gear Icon & Dark/Light Toggle on Right */}
        <Header
          title="QR Generator"
          isDark={isDark}
          onToggleTheme={() => {
            setIsDark((prev) => {
              const next = !prev;
              addToast('info', next ? '🌙 ডার্ক মোড চালু হয়েছে' : '☀️ লাইট মোড চালু হয়েছে');
              return next;
            });
          }}
          resolution={resolution}
          onChangeResolution={(res) => {
            setResolution(res);
            addToast('info', `রেজ্যুলিউশন ${res}px সেট করা হয়েছে`);
          }}
          onResetAll={handleReset}
        />

        <div className="space-y-4" id="main-content-form">
          {/* Field 1: Name or URL Input (matching Screenshot 2: Name (Optional)) */}
          <div className="space-y-1.5" id="input-field-group">
            <label
              htmlFor="url-input"
              className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>URL or Text (লিঙ্ক বা টেক্সট)</span>
              </span>
              <span className="text-[10px] font-semibold text-rose-500">*আবশ্যক</span>
            </label>

            <div className="relative">
              <input
                id="url-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL (e.g., https://google.com)"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors"
              />
              {text && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1 py-0.5 rounded cursor-pointer"
                  title="মুছুন"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Field 2: Cloud Image Uploader (Exact matching Screenshot 1: Cloud Uploader) */}
          <CloudImageUploader
            uploadTarget={uploadTarget}
            onSelectUploadTarget={setUploadTarget}
            showCenterLogo={showCenterLogo}
            onToggleShowCenterLogo={setShowCenterLogo}
            centerLogoFile={centerLogoFile}
            onSelectCenterLogoFile={(file) => {
              setCenterLogoFile(file);
              if (file) setShowCenterLogo(true);
            }}
            centerLogoUrl={centerLogoUrl}
            onChangeCenterLogoUrl={setCenterLogoUrl}
            centerLogoShape={centerLogoShape}
            onChangeCenterLogoShape={setCenterLogoShape}
            photoDotsActive={photoDotsActive}
            onTogglePhotoDots={setPhotoDotsActive}
            photoDotsFile={photoDotsFile}
            onSelectPhotoDotsFile={(file) => {
              setPhotoDotsFile(file);
              if (file) setPhotoDotsActive(true);
            }}
            photoDotsUrl={photoDotsUrl}
            onChangePhotoDotsUrl={setPhotoDotsUrl}
            photoDotsMode={photoDotsMode}
            onChangePhotoDotsMode={setPhotoDotsMode}
            photoContrast={photoContrast}
            onChangePhotoContrast={setPhotoContrast}
          />

          {/* Field 3: All 8 Professional Themes directly visible on screen */}
          <ThemeSelector
            selectedThemeId={selectedThemeId}
            onSelectTheme={(themeId) => {
              setSelectedThemeId(themeId);
              setCustomColorsEnabled(false);
              const th = QR_THEMES.find((t) => t.id === themeId);
              if (th) {
                setFgColor(th.primaryColor);
                setBgColor(th.bgColor);
              }
            }}
            frameStyle={frameStyle}
            onChangeFrameStyle={setFrameStyle}
            customColorsEnabled={customColorsEnabled}
            onToggleCustomColors={setCustomColorsEnabled}
            fgColor={fgColor}
            onChangeFgColor={setFgColor}
            bgColor={bgColor}
            onChangeBgColor={setBgColor}
          />

          {/* Dual Action Buttons (Exact matching Screenshot 2: [ Calculate Age ] [ Save ]) */}
          <div className="flex items-center gap-3 pt-1">
            {/* Primary Blue Button */}
            <button
              type="button"
              id="calculate-qr-btn"
              disabled={isGenerating || !text.trim()}
              onClick={() => handleGenerateQR(false)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate QR</span>
                </>
              )}
            </button>

            {/* Outlined Secondary Button */}
            <button
              type="button"
              id="save-qr-btn"
              onClick={handleDownload}
              className="flex-1 py-3.5 px-4 rounded-xl border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-[0.98] text-blue-600 dark:text-blue-400 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save (HD)</span>
            </button>
          </div>

          {/* Result Section (QR Display) */}
          <ResultSection
            dataUrl={generatedDataUrl}
            text={text}
            themeNameBn={currentTheme.nameBn}
            hasCenterLogo={Boolean(showCenterLogo && (centerLogoFile || centerLogoUrl))}
            isPhotoMode={Boolean(photoDotsActive && (photoDotsFile || photoDotsUrl))}
            onDownload={handleDownload}
            onReset={handleReset}
            onCopySuccess={() => {}}
            onNotify={addToast}
          />

          {/* Horizontal Divider Line (matching Screenshot 2) */}
          <div className="border-t-2 border-slate-100 dark:border-slate-800/90 my-4" />

          {/* Saved Profiles (Pill tags with blue outline matching Screenshot 2) */}
          <SavedLinksPills
            currentUrl={text}
            savedLinks={savedLinks}
            onSelectLink={(url) => {
              setText(url);
              addToast('info', 'সংরক্ষিত লিংক ইনপুট করা হয়েছে');
            }}
            onRemoveLink={handleRemoveSavedLink}
            onAddCurrentLink={handleAddSavedLink}
          />
        </div>

        {/* Footer (Exact matching Screenshots 1 & 2) */}
        <footer className="mt-7 pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          This Site Developed By{' '}
          <a
            href="https://androadappsdevelopershuvo.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Developer Shuvo
          </a>
        </footer>
      </main>
    </div>
  );
}
