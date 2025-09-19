import React from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder } from '../types';

interface CoverPreviewProps {
  coverData: CoverData;
  selectedTheme: Theme;
  id?: string;
  selectedFont: FontFamily;
  showSubject: boolean;
  layoutOrder: LayoutOrder;
}

// Changed text colors to light for readability on new dark backgrounds
const InfoField: React.FC<{ label: string; value: string; className?: string, style?: React.CSSProperties }> = ({ label, value, className = '', style }) => (
    <div className={`text-center ${className}`} style={style}>
        <p className="text-lg font-semibold text-gray-200">{label}:</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);


const CoverPreview: React.FC<CoverPreviewProps> = ({ coverData, selectedTheme, id = "printable-area", selectedFont, showSubject, layoutOrder }) => {
  const fontStyle = { fontFamily: `'${selectedFont}', sans-serif` };

  // Added a semi-transparent dark background for readability
  const subjectBlock = (
    <div className="relative z-10 text-center bg-black/30 backdrop-blur-sm p-4 rounded-xl" style={fontStyle}>
        <h1 className="text-5xl md:text-6xl font-black text-blue-700 drop-shadow-lg" style={{ WebkitTextStroke: '1px white' }}>كراس القسم</h1>
        {showSubject && <p className="text-2xl font-bold text-gray-100 mt-2">{coverData.subject}</p>}
    </div>
  );

  // Switched to a dark semi-transparent background and updated text/border colors
  const studentInfoBlock = (
    <div className="relative z-10 w-full max-w-md mx-auto bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 space-y-4" style={fontStyle}>
        <div className="text-center">
            <p className="text-xl font-semibold text-gray-200">التلميذ/ة</p>
            <p className="text-4xl font-extrabold text-cyan-300 tracking-wide">{coverData.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-white/20">
            <InfoField label="القسم" value={coverData.className} style={fontStyle} />
            <InfoField label="السنة الدراسية" value={coverData.schoolYear} style={fontStyle} />
        </div>
    </div>
  );

  // Added a semi-transparent dark background for readability
  const schoolNameBlock = (
    <div className="relative z-10 text-center bg-black/30 backdrop-blur-sm py-2 px-4 rounded-xl" style={fontStyle}>
        <p className="text-xl font-bold text-white">{coverData.schoolName}</p>
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
        {/* Removed the global white overlay to enhance contrast for the new dark text backgrounds */}
        
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