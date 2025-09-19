import React from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder, TextStyles, TextStyle, PaperSize } from '../types';

interface CoverPreviewProps {
  coverData: CoverData;
  selectedTheme: Theme;
  id?: string;
  selectedFont: FontFamily;
  showSubject: boolean;
  layoutOrder: LayoutOrder;
  textStyles: TextStyles;
  paperSize: PaperSize;
}

const InfoField: React.FC<{ label: string; value: string; style: React.CSSProperties }> = ({ label, value, style }) => (
    <div className="text-center">
        <p className="text-lg font-semibold text-gray-200">{label}:</p>
        <p className="font-bold" style={style}>{value}</p>
    </div>
);


const CoverPreview: React.FC<CoverPreviewProps> = ({ coverData, selectedTheme, id = "printable-area", selectedFont, showSubject, layoutOrder, textStyles, paperSize }) => {
  const fontStyle = { fontFamily: `'${selectedFont}', sans-serif` };

  const getDynamicTextStyle = (style: TextStyle): React.CSSProperties => {
    const dynamicStyle: React.CSSProperties = {
      ...fontStyle,
      fontSize: `${style.fontSize}px`,
      color: style.color,
    };

    if (style.gradient?.enabled) {
      dynamicStyle.background = `linear-gradient(${style.gradient.direction}, ${style.gradient.color1}, ${style.gradient.color2})`;
      dynamicStyle.WebkitBackgroundClip = 'text';
      dynamicStyle.backgroundClip = 'text';
      dynamicStyle.color = 'transparent';
    }

    if (style.stroke && style.stroke.width > 0) {
      dynamicStyle.WebkitTextStroke = `${style.stroke.width}px ${style.stroke.color}`;
      // A more standard property, though less supported
      (dynamicStyle as any).textStroke = `${style.stroke.width}px ${style.stroke.color}`;
    }

    if (style.shadow && (style.shadow.blur > 0 || style.shadow.offsetX !== 0 || style.shadow.offsetY !== 0)) {
      dynamicStyle.textShadow = `${style.shadow.offsetX}px ${style.shadow.offsetY}px ${style.shadow.blur}px ${style.shadow.color}`;
    }

    return dynamicStyle;
  };
  
  const getAdjustedDynamicTextStyle = (text: string, baseStyle: TextStyle, threshold: number): React.CSSProperties => {
    const length = text.length;
    const baseSize = baseStyle.fontSize;
    const minSize = 14; // A readable minimum font size

    let finalSize = baseSize;
    if (length > threshold) {
        // Logarithmic scaling: newSize = baseSize * (log(threshold) / log(length))
        // This creates a smooth curve where the font size drops off and then levels out for very long text.
        const scaleFactor = Math.log(threshold) / Math.log(length);
        finalSize = Math.round(baseSize * scaleFactor);
    }

    const adjustedSize = Math.max(minSize, finalSize);
    const adjustedStyle = { ...baseStyle, fontSize: adjustedSize };
    
    return getDynamicTextStyle(adjustedStyle);
  };


  const subjectBlock = (
    <div className="relative z-10 text-center bg-black/30 backdrop-blur-sm p-4 rounded-xl">
        <h1 
          className="font-black drop-shadow-lg" 
          style={getDynamicTextStyle(textStyles.title)}
        >
          كراس القسم
        </h1>
        {showSubject && 
          <p className="font-bold mt-2 break-words" style={getAdjustedDynamicTextStyle(coverData.subject, textStyles.subject, 20)}>
            {coverData.subject}
          </p>
        }
    </div>
  );

  const studentInfoBlock = (
    <div className="relative z-10 w-full max-w-md mx-auto bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 space-y-4">
        <div className="text-center">
            <p className="text-xl font-semibold text-gray-200" style={fontStyle}>التلميذ/ة</p>
            <p 
              className="font-extrabold tracking-wide break-words" 
              style={getAdjustedDynamicTextStyle(coverData.name, textStyles.name, 15)}
            >
              {coverData.name}
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-white/20">
            <InfoField 
              label="القسم" 
              value={coverData.className} 
              style={getDynamicTextStyle(textStyles.otherInfo)} 
            />
            <InfoField 
              label="السنة الدراسية" 
              value={coverData.schoolYear} 
              style={getDynamicTextStyle(textStyles.otherInfo)} 
            />
        </div>
    </div>
  );

  const schoolNameBlock = (
    <div className="relative z-10 text-center bg-black/30 backdrop-blur-sm py-2 px-4 rounded-xl">
        <p className="font-bold break-words" style={getAdjustedDynamicTextStyle(coverData.schoolName, textStyles.schoolName, 25)}>
          {coverData.schoolName}
        </p>
    </div>
  );
  
  const aspectRatio = paperSize === 'A4' ? 'aspect-[210/297]' : 'aspect-[17/22]';

  return (
    <div 
        id={id} 
        className={`bg-white rounded-xl shadow-2xl overflow-hidden ${aspectRatio} w-full max-w-2xl mx-auto border-4 border-gray-200 transition-all duration-300 relative`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
            backgroundImage: `url(${selectedTheme.imageUrl})`,
            opacity: selectedTheme.opacity ?? 1,
            mixBlendMode: selectedTheme.blendMode as any ?? 'normal',
        }}
      ></div>
      <div
        className="w-full h-full relative p-8 md:p-12 flex flex-col justify-center gap-8"
      >
        {subjectBlock}

        {layoutOrder === 'default' ? (
          <>
            {studentInfoBlock}
            {schoolNameBlock}
          </>
        ) : (
          <>
            {schoolNameBlock}
            {studentInfoBlock}
          </>
        )}
      </div>
    </div>
  );
};

export default CoverPreview;