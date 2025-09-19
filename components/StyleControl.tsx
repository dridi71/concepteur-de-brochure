import React from 'react';
import type { FontFamily, TextStyle } from '../types';

interface StyleControlProps {
  label: string;
  previewText: string;
  style: TextStyle;
  fontFamily: FontFamily;
  onStyleChange: (newStyle: TextStyle) => void;
}

const StyleControl: React.FC<StyleControlProps> = ({ label, previewText, style, fontFamily, onStyleChange }) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({ ...style, fontSize: Number(e.target.value) });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStyleChange({ ...style, color: e.target.value });
  };

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      
      {/* Live Preview */}
      <div 
        className="w-full p-2 mb-3 bg-gray-700 text-white rounded text-center truncate" 
        style={{ 
          fontFamily: `'${fontFamily}', sans-serif`, 
          fontSize: `${style.fontSize}px`, 
          color: style.color 
        }}
        aria-label={`معاينة لـ ${label}`}
      >
        {previewText || "نص للمعاينة"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Font Size Slider */}
        <div className="flex items-center gap-2">
          <label htmlFor={`size-${label}`} className="text-xs text-gray-600 flex-shrink-0">الحجم</label>
          <input
            id={`size-${label}`}
            type="range"
            min="12"
            max="120"
            step="1"
            value={style.fontSize}
            onChange={handleSizeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label={`تغيير حجم خط ${label}`}
          />
          <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.fontSize}</span>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <label htmlFor={`color-${label}`} className="text-xs text-gray-600 flex-shrink-0">اللون</label>
          <input
            id={`color-${label}`}
            type="color"
            value={style.color}
            onChange={handleColorChange}
            className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer"
            aria-label={`تغيير لون خط ${label}`}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleControl;
