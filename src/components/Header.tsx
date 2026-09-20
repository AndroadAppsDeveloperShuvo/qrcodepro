import { useState, useEffect, useRef } from 'react';
import { Settings, Moon, Sun, Check, RotateCcw, Monitor } from 'lucide-react';

interface HeaderProps {
  title: string;
  isDark: boolean;
  onToggleTheme: () => void;
  resolution: number;
  onChangeResolution: (res: number) => void;
  onResetAll?: () => void;
}

export function Header({
  title,
  isDark,
  onToggleTheme,
  resolution,
  onChangeResolution,
  onResetAll
}: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Close settings popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between mb-5 relative">
      {/* Title with exact styling from screenshots */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>

      {/* Action icons: Quick Dark/Light toggle + Gear Icon matching screenshot */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick 1-Click Dark/Light Toggle */}
        <button
          type="button"
          id="theme-toggle-header-btn"
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
          title={isDark ? 'লাইট মোড চালু করুন (Switch to Light Mode)' : 'ডার্ক মোড চালু করুন (Switch to Dark Mode)'}
          aria-label="Toggle Dark and Light mode"
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-700 fill-slate-700/20" />
          )}
        </button>

        {/* Gear Settings Icon (Identical to screenshot) */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer ${
              isSettingsOpen ? 'bg-slate-100 dark:bg-slate-800 rotate-45' : ''
            }`}
            title="সেটিংস ও থিম (Settings)"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5 text-slate-900 dark:text-white" />
          </button>

          {/* Settings Modal / Popover */}
          {isSettingsOpen && (
            <div className="absolute right-0 top-11 w-64 p-4 bg-white dark:bg-[#1a2436] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 z-50 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  অ্যাপ সেটিংস (Settings)
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">
                  v2.0
                </span>
              </div>

              {/* Dark & Light Switch */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  কালার থিম (Dark & Light System):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDark) onToggleTheme();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      !isDark
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>লাইট (Light)</span>
                    {!isDark && <Check className="w-3 h-3 text-blue-600 ml-auto" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isDark) onToggleTheme();
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'border-blue-500 bg-blue-950/60 text-blue-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span>ডার্ক (Dark)</span>
                    {isDark && <Check className="w-3 h-3 text-blue-400 ml-auto" />}
                  </button>
                </div>
              </div>

              {/* Download Resolution */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  ডাউনলোড কোয়ালিটি (Resolution):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1024, 1536, 2048].map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => onChangeResolution(res)}
                      className={`py-1.5 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                        resolution === res
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {res === 1024 ? 'Standard' : res === 1536 ? 'HD' : 'Ultra HD'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to defaults */}
              {onResetAll && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setIsSettingsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট সেটিংসে রিসেট</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
