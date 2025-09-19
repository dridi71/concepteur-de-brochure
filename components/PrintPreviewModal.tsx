import React from 'react';
import type { CoverData, Theme, FontFamily, LayoutOrder } from '../types';
import CoverPreview from './CoverPreview';
import PrintButton from './PrintButton';
import DownloadButton from './DownloadButton';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverData: CoverData;
  selectedTheme: Theme;
  selectedFont: FontFamily;
  showSubject: boolean;
  layoutOrder: LayoutOrder;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({ isOpen, onClose, coverData, selectedTheme, selectedFont, showSubject, layoutOrder }) => {
  if (!isOpen) {
    return null;
  }

  const modalPreviewId = "printable-area-modal";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-preview-title"
    >
      <div
        className="bg-slate-50 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-4xl h-[95vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 flex-shrink-0">
          <h2 id="print-preview-title" className="text-xl sm:text-2xl font-bold text-slate-800">معاينة الطباعة (حجم A4)</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            aria-label="إغلاق المعاينة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* The preview area with a dark background for contrast. `items-center` ensures vertical centering. */}
        <div className="flex-grow bg-slate-900 rounded-lg overflow-hidden flex justify-center items-center p-4 sm:p-8">
           {/* This wrapper constrains the height, guaranteeing vertical margins. 
               `w-auto` lets the width scale based on the child's aspect ratio. */}
           <div className="w-auto h-[95%]">
            <CoverPreview 
              coverData={coverData} 
              selectedTheme={selectedTheme} 
              id={modalPreviewId} 
              selectedFont={selectedFont} 
              showSubject={showSubject}
              layoutOrder={layoutOrder}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
          <p className="text-sm text-slate-500 text-center sm:text-right">هذه معاينة لكيفية ظهور الغلاف على ورقة A4.</p>
          <div className="flex gap-3">
            <DownloadButton elementIdToCapture={modalPreviewId} />
            <PrintButton />
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PrintPreviewModal;
