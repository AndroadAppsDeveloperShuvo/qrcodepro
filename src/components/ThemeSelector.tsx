import { useState } from 'react';
import { QRTheme, ThemeId, FrameStyle } from '../types';
import { QR_THEMES } from '../data/themes';
import { Check, Palette, ChevronDown, RotateCcw, Sliders } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  frameStyle: FrameStyle;
  onChangeFrameStyle: (frame: FrameStyle) => void;
  customColorsEnabled: boolean;
  onToggleCustomColors: (enabled: boolean) => void;
  fgColor: string;
  onChangeFgColor: (color: string) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
}

export function ThemeSelector({
  selectedThemeId,
  onSelectTheme,
  frameStyle,
  onChangeFrameStyle,
  customColorsEnabled,
  onToggleCustomColors,
  fgColor,
  onChangeFgColor,
  bgColor,
  onChangeBgColor
}: ThemeSelectorProps) {
  // Arrow toggle accordion state
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = QR_THEMES.find((t) => t.id === selectedThemeId) || QR_THEMES[0];

  return (
    <div
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 overflow-hidden transition-all duration-200"
      id="theme-selector-accordion"
    >
      {/* Accordion Header - Clicking anywhere or on the arrow toggles open/close */}
      <button
        type="button"
        id="theme-accordion-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            থিম ও কালার (Themes & Styles)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active theme preview tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: customColorsEnabled ? fgColor : currentTheme.primaryColor }}
            />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {customColorsEnabled ? 'কাস্টম' : currentTheme.nameBn.split(' ')[0]}
            </span>
          </div>

          {/* Expand/Collapse Arrow Icon (তির চিহ্ন) */}
          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </span>
        </div>
      </button>

      {/* Accordion Body - Reveals all 8 themes, frames, and colors when arrow is clicked */}
      {isOpen && (
        <div className="p-3.5 pt-1 border-t border-slate-200/80 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-200">
          {/* All 8 Themes Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>পেশাদার ৮টি থিম প্যাক:</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">পছন্দমতো বেছে নিন</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="theme-grid">
              {QR_THEMES.map((theme: QRTheme) => {
                const isSelected = theme.id === selectedThemeId && !customColorsEnabled;
                return (
                  <button
                    key={theme.id}
                    id={`theme-btn-${theme.id}`}
                    type="button"
                    onClick={() => {
                      onSelectTheme(theme.id);
                      onToggleCustomColors(false);
                    }}
                    className={`relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/90 dark:bg-blue-950/60 ring-2 ring-blue-500/25 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}

                    {/* Color swatches */}
                    <div className="flex items-center gap-1 mb-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-2xs"
                        style={{ backgroundColor: theme.primaryColor }}
                        title="Primary Color"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                        style={{ backgroundColor: theme.accentColor }}
                        title="Accent Color"
                      />
                      <span
                        className="w-2 h-2 rounded-full border border-black/15 dark:border-white/15 shrink-0 opacity-80"
                        style={{ backgroundColor: theme.bgColor }}
                        title="Background Color"
                      />
                    </div>

                    <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                      {theme.nameBn.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium truncate w-full">
                      {theme.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frame Styles */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              ফ্রেমের ধরন (Frame Style):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onChangeFrameStyle('none')}
                className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                  frameStyle === 'none'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                স্ট্যান্ডার্ড
              </button>

              <button
                type="button"
                onClick={() => onChangeFrameStyle('clean_border')}
                className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                  frameStyle === 'clean_border'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                বর্ডার ফ্রেম
              </button>

              <button
                type="button"
                onClick={() => onChangeFrameStyle('badge_card')}
                className={`py-1.5 px-2 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                  frameStyle === 'badge_card'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                কার্ড ফ্রেম
              </button>
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>কাস্টম কালার (Custom Colors):</span>
              </span>
              {customColorsEnabled && (
                <button
                  type="button"
                  onClick={() => onToggleCustomColors(false)}
                  className="text-[10px] text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>থিম কালারে ফিরুন</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">কিউআর ডট</span>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    onToggleCustomColors(true);
                    onChangeFgColor(e.target.value);
                  }}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">ব্যাকগ্রাউন্ড</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    onToggleCustomColors(true);
                    onChangeBgColor(e.target.value);
                  }}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

