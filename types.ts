
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

export interface TextStroke {
  color: string;
  width: number; // in pixels
}

export interface TextShadow {
  color: string;
  blur: number; // in pixels
  offsetX: number; // in pixels
  offsetY: number; // in pixels
}

export interface TextStyle {
  fontSize: number; // in pixels
  color: string;
  stroke?: TextStroke;
  shadow?: TextShadow;
}

export interface TextStyles {
  title: TextStyle;
  name: TextStyle;
  subject: TextStyle;
  schoolName: TextStyle;
  otherInfo: TextStyle;
}

export type FontFamily = 'Cairo' | 'Amiri' | 'Lateef';

export type LayoutOrder = 'default' | 'schoolNameFirst';