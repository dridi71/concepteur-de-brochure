import React from 'react';
import type { FontFamily, TextStyle, TextStroke, TextShadow, TextGradient } from '../types';

interface StyleControlProps {
  label: string;
  previewText: string;
  style: TextStyle;
  fontFamily: FontFamily;
  onStyleChange: (newStyle: TextStyle) => void;
}

const gradientDirections = [
  { value: 'to right', label: 'يمين' },
  { value: 'to left', label: 'يسار' },
  { value: 'to bottom', label: 'أسفل' },
  { value: 'to top', label: 'أعلى' },
  { value: 'to bottom right', label: 'أسفل يمين' },
  { value: 'to bottom left', label: 'أسفل يسار' },
  { value: 'to top right', label: 'أعلى يمين' },
  { value: 'to top left', label: 'أعلى يسار' },
];

const StyleControl: React.FC<StyleControlProps> = ({ label, previewText, style, fontFamily, onStyleChange }) => {
  
  const handleStyleChange = (prop: keyof TextStyle, value: any) => {
    onStyleChange({ ...style, [prop]: value });
  };

  const handleStrokeChange = (prop: keyof TextStroke, value: string | number) => {
    onStyleChange({
      ...style,
      stroke: {
        ...(style.stroke || { color: '#000000', width: 0 }),
        [prop]: value,
      },
    });
  };

  const handleShadowChange = (prop: keyof TextShadow, value: string | number) => {
    onStyleChange({
      ...style,
      shadow: {
        ...(style.shadow || { color: 'rgba(0,0,0,0)', blur: 0, offsetX: 0, offsetY: 0 }),
        [prop]: value,
      },
    });
  };

  const handleGradientChange = (prop: keyof TextGradient, value: string | number | boolean) => {
    onStyleChange({
      ...style,
      gradient: {
        ...(style.gradient || { enabled: false, color1: '#FFFFFF', color2: '#000000', direction: 'to right' }),
        [prop]: value,
      },
    });
  };

  const getPreviewStyle = (): React.CSSProperties => {
    const previewStyle: React.CSSProperties = {
      fontFamily: `'${fontFamily}', sans-serif`,
      fontSize: `${style.fontSize}px`,
      color: style.color,
    };
  
    if (style.gradient?.enabled) {
      previewStyle.background = `linear-gradient(${style.gradient.direction}, ${style.gradient.color1}, ${style.gradient.color2})`;
      previewStyle.WebkitBackgroundClip = 'text';
      previewStyle.backgroundClip = 'text';
      previewStyle.color = 'transparent';
    }
  
    if (style.stroke && style.stroke.width > 0) {
      previewStyle.WebkitTextStroke = `${style.stroke.width}px ${style.stroke.color}`;
    }
  
    if (style.shadow && (style.shadow.blur > 0 || style.shadow.offsetX !== 0 || style.shadow.offsetY !== 0)) {
      previewStyle.textShadow = `${style.shadow.offsetX}px ${style.shadow.offsetY}px ${style.shadow.blur}px ${style.shadow.color}`;
    }
  
    return previewStyle;
  };


  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      
      <div 
        className="w-full p-2 mb-3 bg-gray-700 text-white rounded text-center truncate" 
        style={getPreviewStyle()}
        aria-label={`معاينة لـ ${label}`}
      >
        {previewText || "نص للمعاينة"}
      </div>

      <div className="space-y-3">
        {/* Font Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor={`size-${label}`} className="text-xs text-gray-600 flex-shrink-0">الحجم</label>
            <input id={`size-${label}`} type="range" min="12" max="120" step="1" value={style.fontSize} onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" aria-label={`تغيير حجم خط ${label}`} />
            <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.fontSize}</span>
          </div>
          {!style.gradient?.enabled && (
            <div className="flex items-center gap-2">
              <label htmlFor={`color-${label}`} className="text-xs text-gray-600 flex-shrink-0">اللون</label>
              <input id={`color-${label}`} type="color" value={style.color} onChange={(e) => handleStyleChange('color', e.target.value)} className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer" aria-label={`تغيير لون خط ${label}`} />
            </div>
          )}
        </div>
        
        {/* Gradient Style */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">التدرج اللوني (Gradient)</p>
             <button
                type="button"
                onClick={() => handleGradientChange('enabled', !style.gradient?.enabled)}
                className={`${style.gradient?.enabled ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                role="switch"
                aria-checked={style.gradient?.enabled}
              >
                <span className={`${style.gradient?.enabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}/>
              </button>
          </div>
          {style.gradient?.enabled && (
            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`gradient-color1-${label}`} className="text-xs text-gray-600 flex-shrink-0">لون 1</label>
                    <input id={`gradient-color1-${label}`} type="color" value={style.gradient?.color1 ?? '#FFFFFF'} onChange={(e) => handleGradientChange('color1', e.target.value)} className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer" />
                  </div>
                   <div className="flex items-center gap-2">
                    <label htmlFor={`gradient-color2-${label}`} className="text-xs text-gray-600 flex-shrink-0">لون 2</label>
                    <input id={`gradient-color2-${label}`} type="color" value={style.gradient?.color2 ?? '#000000'} onChange={(e) => handleGradientChange('color2', e.target.value)} className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer" />
                  </div>
              </div>
              <div>
                <label htmlFor={`gradient-dir-${label}`} className="text-xs text-gray-600 mb-1 block">الاتجاه</label>
                <select id={`gradient-dir-${label}`} value={style.gradient?.direction ?? 'to right'} onChange={(e) => handleGradientChange('direction', e.target.value)} className="w-full p-1.5 border border-gray-300 rounded-md shadow-sm text-sm">
                  {gradientDirections.map(dir => (
                    <option key={dir.value} value={dir.value}>{dir.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>


        {/* Stroke Style */}
        <div className="pt-3 border-t border-gray-200">
           <p className="text-xs font-semibold text-gray-700 mb-2">الإطار الخارجي (Stroke)</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div className="flex items-center gap-2">
                <label htmlFor={`stroke-width-${label}`} className="text-xs text-gray-600 flex-shrink-0">السماكة</label>
                <input id={`stroke-width-${label}`} type="range" min="0" max="10" step="0.5" value={style.stroke?.width ?? 0} onChange={(e) => handleStrokeChange('width', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.stroke?.width ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`stroke-color-${label}`} className="text-xs text-gray-600 flex-shrink-0">اللون</label>
                <input id={`stroke-color-${label}`} type="color" value={style.stroke?.color ?? '#000000'} onChange={(e) => handleStrokeChange('color', e.target.value)} className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer" />
              </div>
           </div>
        </div>

        {/* Shadow Style */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">الظل (Shadow)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div className="flex items-center gap-2 md:col-span-2">
              <label htmlFor={`shadow-color-${label}`} className="text-xs text-gray-600 flex-shrink-0">اللون</label>
              <input id={`shadow-color-${label}`} type="color" value={style.shadow?.color ?? '#000000'} onChange={(e) => handleShadowChange('color', e.target.value)} className="p-0 h-8 w-10 border-2 border-transparent rounded-md cursor-pointer" />
            </div>
             <div className="flex items-center gap-2">
                <label htmlFor={`shadow-blur-${label}`} className="text-xs text-gray-600 flex-shrink-0">التعتيم</label>
                <input id={`shadow-blur-${label}`} type="range" min="0" max="30" step="1" value={style.shadow?.blur ?? 0} onChange={(e) => handleShadowChange('blur', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.shadow?.blur ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`shadow-offsetX-${label}`} className="text-xs text-gray-600 flex-shrink-0">أفقي</label>
                <input id={`shadow-offsetX-${label}`} type="range" min="-20" max="20" step="1" value={style.shadow?.offsetX ?? 0} onChange={(e) => handleShadowChange('offsetX', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.shadow?.offsetX ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`shadow-offsetY-${label}`} className="text-xs text-gray-600 flex-shrink-0">رأسي</label>
                <input id={`shadow-offsetY-${label}`} type="range" min="-20" max="20" step="1" value={style.shadow?.offsetY ?? 0} onChange={(e) => handleShadowChange('offsetY', Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <span className="text-sm font-mono bg-white border rounded px-1.5 py-0.5 w-10 text-center">{style.shadow?.offsetY ?? 0}</span>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StyleControl;