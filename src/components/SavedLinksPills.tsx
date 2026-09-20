import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export interface SavedLinkItem {
  id: string;
  name: string;
  url: string;
}

interface SavedLinksPillsProps {
  currentUrl: string;
  savedLinks: SavedLinkItem[];
  onSelectLink: (url: string) => void;
  onRemoveLink: (id: string) => void;
  onAddCurrentLink: (name: string, url: string) => void;
}

export function SavedLinksPills({
  currentUrl,
  savedLinks,
  onSelectLink,
  onRemoveLink,
  onAddCurrentLink
}: SavedLinksPillsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [customName, setCustomName] = useState('');

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUrl.trim()) return;
    const nameToUse = customName.trim() || new URL(currentUrl.startsWith('http') ? currentUrl : `https://${currentUrl}`).hostname.replace('www.', '').split('.')[0] || 'Link';
    onAddCurrentLink(nameToUse, currentUrl);
    setCustomName('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-2" id="saved-links-section">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          Saved Profiles (সংরক্ষিত লিংক)
        </label>
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>নতুন যোগ করুন</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            বাতিল
          </button>
        )}
      </div>

      {/* Add current link mini form */}
      {isAdding && (
        <form onSubmit={handleSaveCurrent} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="প্রোফাইলের নাম (যেমন: My Facebook)..."
            className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
          >
            সেভ
          </button>
        </form>
      )}

      {/* Blue Pill Tags matching Screenshot 2 */}
      <div className="flex items-center gap-2 flex-wrap" id="saved-profiles-list">
        {savedLinks.map((item) => {
          const isActive = currentUrl === item.url;
          return (
            <div
              key={item.id}
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 transition-all duration-150 cursor-pointer select-none ${
                isActive
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-blue-600/80 dark:border-blue-500/70 hover:border-blue-600 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-blue-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectLink(item.url)}
                className="text-xs sm:text-sm font-bold tracking-tight text-left cursor-pointer"
                title={item.url}
              >
                {item.name}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLink(item.id);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-700 transition-colors cursor-pointer"
                title="মুছুন"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          );
        })}

        {savedLinks.length === 0 && (
          <p className="text-xs text-slate-400 italic">কোনো লিংক সংরক্ষিত নেই</p>
        )}
      </div>
    </div>
  );
}
