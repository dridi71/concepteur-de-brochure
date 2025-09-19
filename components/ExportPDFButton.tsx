import React, { useState } from 'react';
import type { PaperSize } from '../types';

declare const html2canvas: any;
declare const jspdf: any;

interface ExportPDFButtonProps {
    elementIdToCapture: string;
    paperSize: PaperSize;
    fileName?: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ elementIdToCapture, paperSize, fileName = 'غلاف-كراس.pdf' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementIdToCapture);
    if (!element) {
      console.error('Element to capture not found!');
      alert('حدث خطأ أثناء محاولة تصدير الملف.');
      return;
    }

    setIsExporting(true);

    try {
      const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          scale: 3, // Higher scale for better PDF quality
      });
      
      const imgData = canvas.toDataURL('image/png');

      const { jsPDF } = jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: paperSize === 'A4' ? 'a4' : [170, 220] // A4 or custom notebook size
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('حدث خطأ أثناء تصدير ملف PDF.');
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-2.5 px-3 rounded-lg shadow-md hover:bg-orange-600 active:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-orange-300 disabled:scale-100 disabled:cursor-wait"
      aria-label="تصدير الغلاف كملف PDF"
    >
      {isExporting ? (
        <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري التصدير...</span>
        </>
      ) : (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>PDF ملف</span>
        </>
      )}
    </button>
  );
};

export default ExportPDFButton;
