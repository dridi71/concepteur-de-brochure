
export interface CoverData {
  name: string;
  className: string;
  schoolYear: string;
  schoolName: string;
  subject: string;
}

export interface Theme {
  id: string;
  name: string;
  imageUrl: string;
}

export type FontFamily = 'Cairo' | 'Amiri' | 'Lateef';

export type LayoutOrder = 'default' | 'schoolNameFirst';
