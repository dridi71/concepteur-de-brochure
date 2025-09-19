import type { CoverData, Theme, FontFamily } from './types';

export const INITIAL_COVER_DATA: CoverData = {
  name: "اسم التلميذ/ة",
  className: "السنة الثانية ابتدائي",
  schoolYear: "2024-2025",
  schoolName: "اسم المدرسة",
  subject: "المادة",
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
];

export const FONTS: { id: FontFamily; name: string }[] = [
  { id: 'Cairo', name: 'كايرو' },
  { id: 'Amiri', name: 'أميري' },
  { id: 'Lateef', name: 'لطيف' },
];
