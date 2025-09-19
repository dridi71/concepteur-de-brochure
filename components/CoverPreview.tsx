import React from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder, TextStyles, TextStyle } from '../types';

interface CoverPreviewProps {
  coverData: CoverData;
  selectedTheme: Theme;
  id?: string;
  selectedFont: FontFamily;
  showSubject: boolean;
  layoutOrder: LayoutOrder;
  textStyles: TextStyles;
}

const InfoField: React.FC<{ label: string; value: string; style: React.CSSProperties }> = ({ label, value, style }) => (
    <div className="text-center">
        <p className="text-lg font-semibold text-gray-200">{label}:</p>
        <p className="font-bold" style={style}>{value}</p>
    </div>
);


const CoverPreview: React.FC<CoverPreviewProps> = ({ coverData, selectedTheme, id = "printable-area", selectedFont, showSubject, layoutOrder, textStyles }) => {
  const fontStyle = { fontFamily: `'${selectedFont}', sans-serif` };

  const getDynamicTextStyle = (style: TextStyle): React.CSSProperties => {
    const dynamicStyle: React.CSSProperties = {
      ...fontStyle,
      fontSize: `${style.fontSize}px`,
      color: style.color,
    };

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


  const subjectBlock = (
    <div className="relative z-10 text-center bg-black/30 backdrop-blur-sm p-4 rounded-xl">
        <h1 
          className="font-black drop-shadow-lg" 
          style={getDynamicTextStyle(textStyles.title)}
        >
          كراس القسم
        </h1>
        {showSubject && 
          <p className="font-bold mt-2" style={getDynamicTextStyle(textStyles.subject)}>
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
              className="font-extrabold tracking-wide" 
              style={getDynamicTextStyle(textStyles.name)}
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
        <p className="font-bold" style={getDynamicTextStyle(textStyles.schoolName)}>
          {coverData.schoolName}
        </p>
    </div>
  );
  
  return (
    <div 
        id={id} 
        className="bg-white rounded-xl shadow-2xl overflow-hidden aspect-[210/297] w-full max-w-2xl mx-auto border-4 border-gray-200"
    >
      <div
        className="w-full h-full bg-cover bg-center relative p-8 md:p-12 flex flex-col justify-between"
        style={{ backgroundImage: `url(${selectedTheme.imageUrl})` }}
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