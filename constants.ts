import type { CoverData, Theme, FontFamily, TextStyles } from './types';

export const INITIAL_COVER_DATA: CoverData = {
  name: "اسم التلميذ/ة",
  className: "السنة الثانية ابتدائي",
  schoolYear: "2024-2025",
  schoolName: "اسم المدرسة",
  subject: "المادة",
};

export const INITIAL_TEXT_STYLES: TextStyles = {
  title: { 
    fontSize: 48, 
    color: '#2563EB',
    stroke: { color: '#FFFFFF', width: 1 },
    shadow: { color: 'rgba(0,0,0,0.3)', blur: 3, offsetX: 2, offsetY: 2 },
  },
  name: { 
    fontSize: 36, 
    color: '#67E8F9',
    stroke: { color: '#000000', width: 0 },
    shadow: { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 },
  },
  subject: { 
    fontSize: 24, 
    color: '#F3F4F6',
    stroke: { color: '#000000', width: 0 },
    shadow: { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 },
  },
  schoolName: { 
    fontSize: 20, 
    color: '#FFFFFF',
    stroke: { color: '#000000', width: 0 },
    shadow: { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 },
  },
  otherInfo: { 
    fontSize: 24, 
    color: '#FFFFFF',
    stroke: { color: '#000000', width: 0 },
    shadow: { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 },
  },
};


export const THEMES: Theme[] = [
  { id: 'space', name: 'فضاء', imageUrl: 'https://picsum.photos/seed/space123/840/1188' },
  { id: 'animals', name: 'حيوانات', imageUrl: 'https://picsum.photos/seed/animals123/840/1188' },
  { id: 'school', name: 'مدرسة', imageUrl: 'https://picsum.photos/seed/school123/840/1188' },
  { id: 'nature', name: 'طبيعة', imageUrl: 'https://picsum.photos/seed/nature123/840/1188' },
  { id: 'art', name: 'فن', imageUrl: 'https://picsum.photos/seed/art123/840/1188' },
  { id: 'science', name: 'علوم', imageUrl: 'https://picsum.photos/seed/science123/840/1188' },
  { id: 'sports', name: 'رياضة', imageUrl: 'https://picsum.photos/seed/sports123/840/1188' },
  { id: 'tech', name: 'تكنولوجيا', imageUrl: 'https://picsum.photos/seed/tech123/840/1188' },
  { id: 'history', name: 'تاريخ', imageUrl: 'https://picsum.photos/seed/history123/840/1188' },
  { id: 'stitch', name: 'ستيتش', imageUrl: 'https://picsum.photos/seed/stitch123/840/1188' },
  { id: 'mickey', name: 'ميكي ماوس', imageUrl: 'https://picsum.photos/seed/mickey123/840/1188' },
  { id: 'space_2', name: 'فضاء', imageUrl: 'https://picsum.photos/seed/space456/840/1188' },
  { id: 'animals_2', name: 'حيوانات', imageUrl: 'https://picsum.photos/seed/animals456/840/1188' },
  { id: 'school_2', name: 'مدرسة', imageUrl: 'https://picsum.photos/seed/school456/840/1188' },
];

export const FONTS: { id: FontFamily; name: string }[] = [
  { id: 'Cairo', name: 'كايرو' },
  { id: 'Amiri', name: 'أميري' },
  { id: 'Lateef', name: 'لطيف' },
];