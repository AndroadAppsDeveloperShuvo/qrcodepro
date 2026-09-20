import { QRTheme } from '../types';

export const QR_THEMES: QRTheme[] = [
  {
    id: 'classic_mono',
    nameBn: 'ক্লাসিক ব্ল্যাক (Default)',
    nameEn: 'Classic Monochrome',
    subtitleBn: 'স্ট্যান্ডার্ড কালো ও সাদা প্রফেশনাল কিউআর কোড',
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    accentColor: '#475569',
    bgColor: '#ffffff',
    dotShape: 'square',
    cornerStyle: 'square',
    tagline: 'Standard Professional QR'
  },
  {
    id: 'navy_prestige',
    nameBn: 'রয়্যাল নেভি (Royal Navy)',
    nameEn: 'Navy Prestige',
    subtitleBn: 'কর্পোরেট বিজনেস ও পেশাদার নীল থিম',
    primaryColor: '#1e3a8a',
    secondaryColor: '#172554',
    accentColor: '#3b82f6',
    bgColor: '#f8fafc',
    dotShape: 'rounded',
    cornerStyle: 'rounded',
    tagline: 'Corporate Business Edition'
  },
  {
    id: 'emerald_luxe',
    nameBn: 'এমেরাল্ড গ্রিন (Emerald)',
    nameEn: 'Emerald Luxe',
    subtitleBn: 'অভিজাত গাঢ় সবুজ ও প্রিমিয়াম লুক',
    primaryColor: '#065f46',
    secondaryColor: '#022c22',
    accentColor: '#10b981',
    bgColor: '#f0fdf4',
    dotShape: 'rounded',
    cornerStyle: 'leaf',
    tagline: 'Modern & Eco Aesthetic'
  },
  {
    id: 'royal_purple',
    nameBn: 'রয়্যাল পার্পল (Royal Purple)',
    nameEn: 'Royal Purple',
    subtitleBn: 'আভিজাত্যময় গভীর বেগুনি প্রিমিয়াম থিম',
    primaryColor: '#6b21a8',
    secondaryColor: '#3b0764',
    accentColor: '#a855f7',
    bgColor: '#faf5ff',
    dotShape: 'smooth',
    cornerStyle: 'rounded',
    tagline: 'Luxury Brand Identity'
  },
  {
    id: 'sunset_crimson',
    nameBn: 'সানসেট ক্রিমসন (Crimson)',
    nameEn: 'Sunset Crimson',
    subtitleBn: 'আকর্ষণীয় গাঢ় লাল ও মেরুন টোন',
    primaryColor: '#991b1b',
    secondaryColor: '#450a0a',
    accentColor: '#ef4444',
    bgColor: '#fef2f2',
    dotShape: 'dots',
    cornerStyle: 'circle',
    tagline: 'Vibrant Creative Profile'
  },
  {
    id: 'carbon_dark',
    nameBn: 'কার্বন ডার্ক (Carbon Dark)',
    nameEn: 'Carbon Dark',
    subtitleBn: 'স্লিক আধুনিক ডার্ক মোড স্টাইল',
    primaryColor: '#f1f5f9',
    secondaryColor: '#cbd5e1',
    accentColor: '#60a5fa',
    bgColor: '#0f172a',
    dotShape: 'rounded',
    cornerStyle: 'rounded',
    tagline: 'Ultra Modern Dark Theme'
  },
  {
    id: 'cyber_teal',
    nameBn: 'মডার্ন টিল (Modern Teal)',
    nameEn: 'Modern Teal',
    subtitleBn: 'টেক স্টার্টআপ ও ডিজিটাল লুক',
    primaryColor: '#0f766e',
    secondaryColor: '#134e4a',
    accentColor: '#14b8a6',
    bgColor: '#f0fdfa',
    dotShape: 'smooth',
    cornerStyle: 'rounded',
    tagline: 'Tech Startup Brand'
  },
  {
    id: 'warm_amber',
    nameBn: 'গোল্ডেন অ্যাম্বার (Amber)',
    nameEn: 'Golden Amber',
    subtitleBn: 'উষ্ণ সোনালী ও অ্যাম্বার লাক্সারি লুক',
    primaryColor: '#b45309',
    secondaryColor: '#78350f',
    accentColor: '#f59e0b',
    bgColor: '#fffbeb',
    dotShape: 'rounded',
    cornerStyle: 'leaf',
    tagline: 'Gold Premium Signature'
  },
  {
    id: 'minimal_clean',
    nameBn: 'সফট স্লেট (Soft Slate)',
    nameEn: 'Minimal Slate',
    subtitleBn: 'সূক্ষ্ম মার্জিত গ্রে ও পরিচ্ছন্ন মিনিমালিস্ট',
    primaryColor: '#334155',
    secondaryColor: '#1e293b',
    accentColor: '#64748b',
    bgColor: '#f8fafc',
    dotShape: 'dots',
    cornerStyle: 'rounded',
    tagline: 'Clean Minimalist Style'
  }
];

// Color palette presets for 1-click color change
export interface ColorPreset {
  nameBn: string;
  nameEn: string;
  fg: string;
  bg: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { nameBn: 'ডিফল্ট কালো-সাদা', nameEn: 'Classic B&W', fg: '#000000', bg: '#ffffff' },
  { nameBn: 'ডিপ নেভি', nameEn: 'Deep Navy', fg: '#0f172a', bg: '#f8fafc' },
  { nameBn: 'কর্পোরেট ব্লু', nameEn: 'Royal Blue', fg: '#1d4ed8', bg: '#eff6ff' },
  { nameBn: 'ফরেস্ট গ্রিন', nameEn: 'Forest Green', fg: '#047857', bg: '#ecfdf5' },
  { nameBn: 'ডার্ক পার্পল', nameEn: 'Velvet Purple', fg: '#6d28d9', bg: '#f5f3ff' },
  { nameBn: 'মারুন রেড', nameEn: 'Ruby Crimson', fg: '#be123c', bg: '#fff1f2' },
  { nameBn: 'গোল্ডেন অ্যাম্বার', nameEn: 'Warm Amber', fg: '#b45309', bg: '#fffbeb' },
  { nameBn: 'সাইবার সায়ান', nameEn: 'Cyan Teal', fg: '#0e7490', bg: '#ecfeff' },
  { nameBn: 'ইনভার্টেড ডার্ক', nameEn: 'Inverted Dark', fg: '#ffffff', bg: '#0f172a' }
];

// Alias for compatibility
export const ANIMAL_THEMES = QR_THEMES;
