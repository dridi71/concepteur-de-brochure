import React, { useState, useRef } from 'react';
import type { Theme } from '../types';

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme;
  setSelectedTheme: React.Dispatch<React.SetStateAction<Theme>>;
  onCustomImageUpload: (dataUrl: string) => void;
  onRemoveCustomTheme: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, selectedTheme, setSelectedTheme, onCustomImageUpload, onRemoveCustomTheme }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomImage = () => {
    if (previewUrl) {
      onCustomImageUpload(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const customThemeExists = themes.some(theme => theme.id === 'custom');

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-3">اختر تصميمًا</h3>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => {
          const isSelected = selectedTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`relative w-full aspect-square bg-cover bg-center rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 ${
                isSelected ? 'ring-4 ring-blue-600 shadow-lg' : 'ring-2 ring-gray-300 hover:ring-blue-400'
              }`}
              style={{ backgroundImage: `url(${theme.imageUrl})` }}
              aria-pressed={isSelected}
              aria-label={`اختيار تصميم ${theme.name}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center rounded-lg p-1">
                  <span className="text-white text-xs font-bold">{theme.name}</span>
              </div>
              
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-1 flex items-center justify-center shadow-md transition-all duration-300 ease-out">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {previewUrl && (
        <div className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-lg space-y-3">
          <h4 className="text-md font-semibold text-gray-800 text-center">معاينة الصورة المخصصة</h4>
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded-md object-cover max-h-48" />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleApplyCustomImage}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition-transform transform hover:scale-105"
            >
              <span>تطبيق الصورة</span>
            </button>
            <button
              onClick={handleCancelPreview}
              className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 active:bg-gray-700 transition-transform transform hover:scale-105"
            >
              <span>إلغاء</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <label className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-400 text-gray-600 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 focus-within:border-blue-500 focus-within:text-blue-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4 4v8" />
          </svg>
          <span>رفع صورة مخصصة</span>
          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="sr-only" accept="image/png, image/jpeg, image/webp" />
        </label>
        
        {customThemeExists && (
          <button
            onClick={onRemoveCustomTheme}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
            aria-label="إزالة التصميم المخصص"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>إزالة التصميم المخصص</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;